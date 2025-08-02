package com.carbclex.CarbClex.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carbclex.CarbClex.model.NotificationEventMaster;


public interface NotificationEventMasterRepository extends JpaRepository<NotificationEventMaster, Integer> {
    NotificationEventMaster findByCode(String code);
}