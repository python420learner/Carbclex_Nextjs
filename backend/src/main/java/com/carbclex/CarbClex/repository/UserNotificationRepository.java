package com.carbclex.CarbClex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.carbclex.CarbClex.model.NotificationEventMaster;
import com.carbclex.CarbClex.model.UserNotification;

import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;

import java.util.List;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Integer> {
    List<UserNotification> findByUserIdOrderByCreatedAtDesc(String userId);

    boolean existsByEventAndRelatedEntityIdAndUserId(NotificationEventMaster event, int relatedEntityId, String userId);

    Long countByUserIdAndIsReadFalse(String userId);

    @Transactional
    @Modifying
    @Query("UPDATE UserNotification n SET n.isRead = true WHERE n.id IN :ids")
    void markNotificationsAsRead(@Param("ids") List<Integer> ids);

    @Transactional
    @Modifying
    @Query("DELETE FROM UserNotification n WHERE n.userId = :userId")
    void deleteAllByUserId(@Param("userId") String userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM UserNotification n WHERE n.userId = :userId AND n.event.type.id = :typeId")
    void deleteAllByUserIdAndTypeId(@Param("userId") String userId, @Param("typeId") Integer typeId);

}