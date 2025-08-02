
package com.carbclex.CarbClex.repository;

import com.carbclex.CarbClex.model.AdminFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminFeedbackRepository extends JpaRepository<AdminFeedback, Integer> {
    List<AdminFeedback> findByProjectId(Integer projectId);
}
