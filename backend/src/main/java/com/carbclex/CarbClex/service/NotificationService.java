package com.carbclex.CarbClex.service;

import com.carbclex.CarbClex.model.UserNotification;
import com.carbclex.CarbClex.model.NotificationEventMaster;
import com.carbclex.CarbClex.repository.UserNotificationRepository;
import com.carbclex.CarbClex.repository.NotificationEventMasterRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationService {

    @Autowired
    private UserNotificationRepository notificationRepository;

    @Autowired
    private NotificationEventMasterRepository eventRepository;

    @Transactional
    public void createNotification(NotificationEventMaster event, String message, Integer relatedEntityId, String relatedEntityType, String userId) {
        UserNotification notification = new UserNotification();
        notification.setEvent(event);
        notification.setCustomMessage(message);
        notification.setUserId(userId);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setRelatedEntityType(relatedEntityType);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setIsRead(false);

        notificationRepository.save(notification);
    }

    // Optional helper if you want to fetch event by code directly in this service
    public NotificationEventMaster getEventByCode(String code) {
        return eventRepository.findByCode(code);
    }
}
