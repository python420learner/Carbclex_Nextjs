package com.carbclex.CarbClex.service;

import com.carbclex.CarbClex.model.Media;
import com.carbclex.CarbClex.repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class MediaService {

    private static final String BASE_DIR = "uploads/";
    private static final String SUB_DIR = "/projects/";

    @Autowired
    private MediaRepository mediaRepository;

    public Media uploadMedia(String userId, Integer projectId, List<MultipartFile> files) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        List<String> documentUrls = new ArrayList<>();

        String uploadPath = BASE_DIR + userId + SUB_DIR + String.valueOf(projectId) + "/";
        Files.createDirectories(Paths.get(uploadPath));

        for (MultipartFile file : files) {
            String fileName = file.getOriginalFilename();
            Path filePath = Paths.get(uploadPath + fileName);
            Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE);

            if (isImage(fileName)) {
                imageUrls.add(filePath.toString());
            } else {
                documentUrls.add(filePath.toString());
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
