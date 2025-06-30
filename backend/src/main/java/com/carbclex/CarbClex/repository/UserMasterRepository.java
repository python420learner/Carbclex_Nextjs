package com.carbclex.CarbClex.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carbclex.CarbClex.model.UserMaster;

public interface UserMasterRepository extends JpaRepository<UserMaster, Integer> {
    Optional<UserMaster> findByEmail(String email);
    Optional<UserMaster> findByUid(String uid);
    boolean existsByUid(String uid);
}
