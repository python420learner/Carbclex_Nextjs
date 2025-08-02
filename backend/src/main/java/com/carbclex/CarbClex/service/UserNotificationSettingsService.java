package com.carbclex.CarbClex.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carbclex.CarbClex.model.UserNotificationSettings;
import com.carbclex.CarbClex.repository.UserNotificationSettingsRepository;

@Service
public class UserNotificationSettingsService {

    @Autowired
    private UserNotificationSettingsRepository settingsRepository;

    public UserNotificationSettings getOrCreateSettingsForUser(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }

        return settingsRepository.findByUserId(userId)
                .orElseGet(() -> settingsRepository.save(new UserNotificationSettings(userId)));
    }
}
