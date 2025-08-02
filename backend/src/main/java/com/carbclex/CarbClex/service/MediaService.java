package com.carbclex.CarbClex.service;

import com.carbclex.CarbClex.model.Documents;
import com.carbclex.CarbClex.model.Image;
import com.carbclex.CarbClex.model.Media;
import com.carbclex.CarbClex.model.Image.VerificationStatus;
import com.carbclex.CarbClex.repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class MediaService {

    @Value("${media.upload.path}")
    private String baseUploadPath; // e.g., "/var/www/carbclex.com/uploads"

    private static final String PROJECT_SUB_DIR = "/projects/";

    @Autowired
    private MediaRepository mediaRepository;

    public Media uploadMedia(String userId, Integer projectId, List<MultipartFile> files) throws IOException {
        List<Documents> documents = new ArrayList<>();
        List<Image> images = new ArrayList<>();

        String uploadPath = baseUploadPath + "/" + userId + PROJECT_SUB_DIR + projectId + "/";
        Path fullPath = Paths.get(uploadPath);
        Files.createDirectories(fullPath);

        for (MultipartFile file : files) {
            String fileName = file.getOriginalFilename();
            if (fileName == null || fileName.isEmpty())
                continue;

            Path filePath = fullPath.resolve(fileName);
            Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE);

            String relativeUrl = "uploads/" + userId + "/projects/" + projectId + "/" + fileName;

            if (isImage(fileName)) {
                Image image = new Image();
                image.setUrl(relativeUrl);
                image.setTitle(fileName); // or extract title from filename as needed
                image.setVerificationStatus(VerificationStatus.PENDING);
                image.setUploadedAt(Instant.now());
                images.add(image);
            } else {
                Documents document = new Documents();
                document.setUrl(relativeUrl);
                document.setTitle(fileName); // or extract title from filename as needed
                document.setVerificationStatus(Documents.VerificationStatus.PENDING);
                document.setUploadedAt(Instant.now());
                documents.add(document);
            }
        }

        Media media = new Media();
        media.setUserId(userId);
        media.setProjectId(projectId);
        media.setDocuments(documents);
        media.setImages(images);

        return mediaRepository.save(media);
    }

    // public Media uploadMedia(String userId, Integer projectId,
    // List<MultipartFile> files) throws IOException {
    // List<String> imageUrls = new ArrayList<>();
    // List<String> documentUrls = new ArrayList<>();

    // // Full file system path to save files
    // String uploadPath = baseUploadPath + "/" + userId + PROJECT_SUB_DIR +
    // String.valueOf(projectId) + "/";
    // Path fullPath = Paths.get(uploadPath);
    // Files.createDirectories(fullPath);

    // for (MultipartFile file : files) {
    // String fileName = file.getOriginalFilename();
    // if (fileName == null || fileName.isEmpty())
    // continue;

    // Path filePath = fullPath.resolve(fileName);
    // Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE);

    // // Store relative URL, NOT full system path
    // String relativeUrl = "uploads/" + userId + "/projects/" + projectId + "/" +
    // fileName;

    // if (isImage(fileName)) {
    // imageUrls.add(relativeUrl);
    // } else {
    // documentUrls.add(relativeUrl);
    // }
    // }

    // Media media = new Media();
    // media.setUserId(userId);
    // media.setProjectId(projectId);
    // media.setImageUrls(imageUrls); // contains relative URLs
    // media.setDocumentUrls(documentUrls);

    // return mediaRepository.save(media);
    // }

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
