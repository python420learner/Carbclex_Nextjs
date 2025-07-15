package com.carbclex.CarbClex.service;

import com.carbclex.CarbClex.model.Media;
import com.carbclex.CarbClex.repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class MediaService {

    @Value("${media.upload.path}")
    private String baseUploadPath;  // Comes from profile-specific properties

    private static final String PROJECT_SUB_DIR = "/projects/";

    @Autowired
    private MediaRepository mediaRepository;

    public Media uploadMedia(String userId, Integer projectId, List<MultipartFile> files) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        List<String> documentUrls = new ArrayList<>();

        // Construct full upload path
        String uploadPath = baseUploadPath + "/" + userId + PROJECT_SUB_DIR + String.valueOf(projectId) + "/";
        Path fullPath = Paths.get(uploadPath);
        Files.createDirectories(fullPath);

        for (MultipartFile file : files) {
            String fileName = file.getOriginalFilename();
            if (fileName == null || fileName.isEmpty()) continue;

            Path filePath = fullPath.resolve(fileName);
            Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE);

            String savedPath = filePath.toString();

            if (isImage(fileName)) {
                imageUrls.add(savedPath);
            } else {
                documentUrls.add(savedPath);
            }
        }

        Media media = new Media();
        media.setUserId(userId);
        media.setProjectId(projectId);
        media.setImageUrls(imageUrls);
        media.setDocumentUrls(documentUrls);

        return mediaRepository.save(media);
    }

    public List<Media> getMediaByUserId(String userId) {
        return mediaRepository.findByUserId(userId);
    }

    public List<Media> getMediaByProjectId(Integer projectId) {
        return mediaRepository.findByProjectId(projectId);
    }

    private boolean isImage(String filename) {
        return filename.matches("(?i).+\\.(png|jpg|jpeg|gif|bmp|webp)$");
    }
}
