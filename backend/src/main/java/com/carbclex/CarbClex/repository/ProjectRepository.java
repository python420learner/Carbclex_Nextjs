package com.carbclex.CarbClex.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


import com.carbclex.CarbClex.model.Project;
import com.carbclex.CarbClex.model.Project.VerificationStatus;


@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    @Query("SELECT MAX(p.projectid) FROM Project p")
    Integer findMaxProjectId();

    Project findByProjectid(Integer projectid);

    List<Project> findByVerificationStatus(VerificationStatus status);

    List<Project> findByVerificationStatusNot(VerificationStatus status);

    List<Project> findByUserId(String userId);
    List<Project> findByVerificationStatusAndCreatedAtBefore(Project.VerificationStatus status, LocalDateTime dateTime);


    void deleteById(Integer id);


    @Modifying
    @Transactional
    @Query("UPDATE Project p SET p.verificationStatus = :status WHERE p.id = :id")
    void updateVerificationStatusById(@Param("id") Integer id, @Param("status") VerificationStatus status);

}
