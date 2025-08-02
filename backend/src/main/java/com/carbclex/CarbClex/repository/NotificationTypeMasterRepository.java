package com.carbclex.CarbClex.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carbclex.CarbClex.model.NotificationTypeMaster;

public interface NotificationTypeMasterRepository extends JpaRepository<NotificationTypeMaster, Integer> {
    NotificationTypeMaster findByName(String name);
}