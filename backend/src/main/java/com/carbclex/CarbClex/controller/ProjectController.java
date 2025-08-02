package com.carbclex.CarbClex.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.carbclex.CarbClex.dto.VerificationRequest;
import com.carbclex.CarbClex.model.NotificationEventMaster;
import com.carbclex.CarbClex.model.Project;
import com.carbclex.CarbClex.model.Project.VerificationStatus;
import com.carbclex.CarbClex.model.UserNotification;
import com.carbclex.CarbClex.repository.NotificationEventMasterRepository;
import com.carbclex.CarbClex.repository.ProjectRepository;
import com.carbclex.CarbClex.repository.UserNotificationRepository;
import com.carbclex.CarbClex.service.ProjectService;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/carbclex")

public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private NotificationEventMasterRepository notificationEventRepository;

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @GetMapping("/next-id")
    public ResponseEntity<Integer> getNextProjectId() {
        Integer maxId = projectRepository.findMaxProjectId();
        return ResponseEntity.ok(maxId != null ? maxId + 1 : 1);
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @PostMapping("/add")
    public ResponseEntity<Project> add(@RequestBody Project project) {
        System.out.println("Project Received");
        Project savedProject = projectService.saveProject(project);
        return ResponseEntity.ok(savedProject);
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @GetMapping("/getAll")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @GetMapping("project/getVerifiedProjects")
    public ResponseEntity<List<Project>> getVerifiedProjects() {
        return ResponseEntity.ok(projectService.getVerifiedProjects());
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @GetMapping("project/getNonVerifiedProjects")
    public ResponseEntity<List<Project>> getNonVerifiedProjects() {
        return ResponseEntity.ok(projectService.getNonVerifiedProjects());
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @PutMapping("/verifyProject/{id}")
    public ResponseEntity<?> verifyProject(@PathVariable Integer id) {
        try {
            projectRepository.updateVerificationStatusById(id,
                    VerificationStatus.verified);
            return ResponseEntity.ok("Project verified successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Verification failed");
        }
    }

    @PostMapping("/updateVerificationStatus/{id}")
    public ResponseEntity<?> updateVerificationStatus(@PathVariable Integer id,
            @RequestBody VerificationRequest request) {
        try {
            // 1. Update project verification status
            projectRepository.updateVerificationStatusById(id, request.getStatus());

            // 2. Fetch project and user
            Optional<Project> projectOpt = projectRepository.findById(id);
            if (projectOpt.isPresent()) {
                Project project = projectOpt.get();
                String userId = project.getUserId();

                // 4. Handle "FAILED"
                if (request.getStatus() == VerificationStatus.failed) {
                    NotificationEventMaster event = notificationEventRepository.findByCode("PROJECT_REJECTED");

                    UserNotification notification = new UserNotification();
                    notification.setUserId(userId);
                    notification.setEvent(event);
                    notification.setIsRead(false);
                    notification.setCreatedAt(LocalDateTime.now());
                    notification.setRelatedEntityType("project");
                    notification.setRelatedEntityId(project.getId());
                    notification.setCustomMessage("Your project '" + project.getProjectName() + "' was failed.");

                    userNotificationRepository.save(notification);
                }

                // 5. Handle "VERIFIED"
                if (request.getStatus() == VerificationStatus.verified) {
                    NotificationEventMaster event = notificationEventRepository.findByCode("PROJECT_APPROVED");

                    UserNotification notification = new UserNotification();
                    notification.setUserId(userId);
                    notification.setEvent(event);
                    // notification.setIsRead(false);
                    notification.setCreatedAt(LocalDateTime.now());
                    notification.setRelatedEntityType("project");
                    notification.setRelatedEntityId(project.getId());
                    notification.setCustomMessage(
                            "Your project '" + project.getProjectName() + "' has been verified and approved.");

                    userNotificationRepository.save(notification);
                }
            }

            return ResponseEntity.ok("Project status updated to " + request.getStatus());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed");
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/projects/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Integer id) {
        try {
            Project project = projectService.getProjectById(id);
            // .orElseThrow(() -> new RuntimeException("Project not found"));
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getByProjectId/{projectid}")
    public ResponseEntity<Project> getProjectByProjectid(@PathVariable Integer
    projectid) {
    Project project = projectRepository.findByProjectid(projectid);
    return ResponseEntity.ok(project);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/projects/user/{userId}")
    public ResponseEntity<List<Project>> getProjectsByUser(@PathVariable String userId) {
        List<Project> projects = projectService.getUserProjects(userId);
        return ResponseEntity.ok(projects);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/upload-images")
    public ResponseEntity<?> uploadImages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("projectId") Integer projectId) throws IOException {

        Project project = projectService.getProjectById(projectId);
        // .orElseThrow(() -> new RuntimeException("Project not found"));

        List<String> uploadedUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads", filename);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            uploadedUrls.add("/uploads/" + filename);
        }

        ObjectMapper mapper = new ObjectMapper();
        String jsonArray = mapper.writeValueAsString(uploadedUrls);
        project.setImageUrls(jsonArray);

        projectService.saveProject(project);

        return ResponseEntity.ok(Map.of("imageUrls", uploadedUrls));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/project/deleteProject/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Integer id) {
        System.out.println("Project id is ::::::" + id);
        try {
            projectService.deleteProjectById(id);
            return ResponseEntity.ok("Project deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete project");
        }
    }
}
