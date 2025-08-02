package com.carbclex.CarbClex.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carbclex.CarbClex.model.UserNotificationSettings;

public interface UserNotificationSettingsRepository extends JpaRepository<UserNotificationSettings, Integer> {
    Optional<UserNotificationSettings> findByUserId(String userId);
}
