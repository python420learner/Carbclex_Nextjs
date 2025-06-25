package com.carbclex.CarbClex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.carbclex.CarbClex.model.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    @Query("SELECT MAX(p.projectid) FROM Project p")
    Integer findMaxProjectId();

}
