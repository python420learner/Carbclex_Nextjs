package com.carbclex.CarbClex.service;

import java.io.File;
import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.nio.file.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.carbclex.CarbClex.model.Media;
import com.carbclex.CarbClex.model.Project;
import com.carbclex.CarbClex.model.Project.VerificationStatus;
import com.carbclex.CarbClex.repository.MediaRepository;
import com.carbclex.CarbClex.repository.ProjectRepository;

@Service
public class ProjectServiceImplement implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private MediaRepository mediaRepository;

    @Value("${media.upload.path}")
    private String baseUploadPath; // e.g. /var/www/carbclex.com/uploads

    private static final String PROJECT_SUB_DIR = "/projects/";

    @Override
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getVerifiedProjects() {
        return projectRepository.findByVerificationStatus(VerificationStatus.verified);
    }

    public List<Project> getNonVerifiedProjects() {
        return projectRepository.findByVerificationStatusNot(VerificationStatus.verified);
    }

    public Project getProjectById(Integer id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    public List<Project> getUserProjects(String userId) {
        return projectRepository.findByUserId(userId);
    }

    public void deleteProjectById(Integer id) {

        // 1. Fetch the project using its ID
        Optional<Project> projectOptional = projectRepository.findById(id);
        if (projectOptional.isEmpty()) {
            throw new RuntimeException("Project not found");
        }

        Project project = projectOptional.get();
        Integer projectId = project.getProjectid(); // You must have a separate field for this
        String userId = project.getUserId(); // Assuming Project has userId field too

        List<Media> mediaList = mediaRepository.findByProjectId(projectId);

        for (Media media : mediaList) {
            mediaRepository.delete(media); // This removes media, documents & images (element collections)
        }

        // 3. Delete media folder for this project
        Path directoryPath = Paths.get(baseUploadPath + "/" + userId + PROJECT_SUB_DIR + String.valueOf(projectId) + "/");
        try {
            if (Files.exists(directoryPath)) {
                deleteDirectoryRecursively(directoryPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete media directory", e);
        }

        projectRepository.deleteById(id);
    }

    private void deleteDirectoryRecursively(Path path) throws IOException {
        Files.walk(path)
                .sorted(Comparator.reverseOrder())
                .map(Path::toFile)
                .forEach(File::delete);
    }

}
