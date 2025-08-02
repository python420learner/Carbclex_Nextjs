package com.carbclex.CarbClex.controller;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carbclex.CarbClex.model.UserNotificationSettings;
import com.carbclex.CarbClex.repository.UserNotificationSettingsRepository;

@RestController
@RequestMapping("/carbclex")
public class NotificationSettingsController {

    @Autowired
    private UserNotificationSettingsRepository settingsRepository;

    // GET endpoint to fetch user notification settings
    @GetMapping("/notification-settings/{userId}")
    public ResponseEntity<?> getNotificationSettings(@PathVariable String userId) {
        Optional<UserNotificationSettings> settings = settingsRepository.findByUserId(userId);
        if (settings.isPresent()) {
            return ResponseEntity.ok(settings.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Settings not found for user: " + userId);
        }
    }

     // POST or PUT endpoint to save or update settings
    @PostMapping("/notification-settings/save")
    public ResponseEntity<?> saveNotificationSettings(@RequestBody UserNotificationSettings newSettings) {
        Optional<UserNotificationSettings> existing = settingsRepository.findByUserId(newSettings.getUserId());

        if (existing.isPresent()) {
            newSettings.setId(existing.get().getId());
            newSettings.setCreatedAt(existing.get().getCreatedAt()); // preserve original createdAt
        }

        newSettings.setUpdatedAt(LocalDateTime.now());
        UserNotificationSettings saved = settingsRepository.save(newSettings);

        return ResponseEntity.ok(saved);
    }
}