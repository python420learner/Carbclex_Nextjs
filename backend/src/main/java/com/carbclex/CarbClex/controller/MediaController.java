package com.carbclex.CarbClex.controller;

import com.carbclex.CarbClex.model.Media;
import com.carbclex.CarbClex.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/carbclex")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @PostMapping("/media/upload")
    public ResponseEntity<Media> uploadMedia(
            @RequestParam("userId") String userId,
            @RequestParam("projectId") Integer projectId,
            @RequestParam("files") List<MultipartFile> files
    ) {
        try {
            Media media = mediaService.uploadMedia(userId, projectId, files);
            return ResponseEntity.ok(media);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/media/user/{userId}")
    public ResponseEntity<List<Media>> getMediaByUser(@PathVariable String userId) {
        return ResponseEntity.ok(mediaService.getMediaByUserId(userId));
    }

    @GetMapping("/media/project/{projectId}")
    public ResponseEntity<List<Media>> getMediaByProject(@PathVariable Integer projectId) {
        return ResponseEntity.ok(mediaService.getMediaByProjectId(projectId));
    }
}
