package com.carbclex.CarbClex.repository;

import com.carbclex.CarbClex.model.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Integer> {
    List<Media> findByUserId(String userId);
    List<Media> findByProjectId(Integer projectId);
    void deleteByProjectId(Integer projectId);
}
