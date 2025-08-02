package com.carbclex.CarbClex.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carbclex.CarbClex.model.NotificationSettings;

import java.util.List;

public interface NotificationSettingsRepository extends JpaRepository<NotificationSettings, Integer> {
    List<NotificationSettings> findByUserId(Integer userId);
    NotificationSettings findByUserIdAndType_Id(Integer userId, Integer typeId);
}