package com.carbclex.CarbClex.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.carbclex.CarbClex.model.CartItem;
import com.carbclex.CarbClex.model.NotificationEventMaster;
import com.carbclex.CarbClex.model.Project;
import com.carbclex.CarbClex.model.UserMaster;
import com.carbclex.CarbClex.model.UserNotification;
import com.carbclex.CarbClex.repository.CartItemRepository;
import com.carbclex.CarbClex.repository.NotificationEventMasterRepository;
import com.carbclex.CarbClex.repository.ProjectRepository;
import com.carbclex.CarbClex.repository.UserMasterRepository;
import com.carbclex.CarbClex.repository.UserNotificationRepository;

import jakarta.transaction.Transactional;

@Service
public class ReminderScheduler {
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private NotificationEventMasterRepository eventRepo;

    @Autowired
    private UserNotificationRepository notificationRepo;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserMasterRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Scheduled(fixedRate = 36000000) // Every 10 hour
    public void checkCartExpiryReminders() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(48);
        List<CartItem> expiredCarts = cartItemRepository.findByCreatedAtBefore(threshold);

        if (expiredCarts.isEmpty()) return;

        NotificationEventMaster event = eventRepo.findByCode("CART_EXPIRY");

        for (CartItem item : expiredCarts) {
            // Prevent duplicate notifications for the same cart item
            boolean alreadyNotified = notificationRepo.existsByEventAndRelatedEntityIdAndUserId(
                    event, item.getId().intValue(), item.getUserId());

            if (!alreadyNotified) {
                UserNotification reminder = new UserNotification();
                reminder.setUserId(item.getUserId());
                reminder.setCreatedAt(LocalDateTime.now());
                reminder.setIsRead(false);
                reminder.setEvent(event);
                reminder.setRelatedEntityId(item.getId().intValue());
                reminder.setRelatedEntityType("cart");
                reminder.setCustomMessage("Credit(s) in your cart are about to expire.");
                notificationRepo.save(reminder);
            }
        }
    }

    // 1. Project Draft Reminder
    @Transactional
    @Scheduled(cron = "0 0 * * * *") // hourly
    public void checkIncompleteProjectDrafts() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(7);
        List<Project> oldDrafts = projectRepository.findByVerificationStatusAndCreatedAtBefore(Project.VerificationStatus.draft, cutoffDate);

        NotificationEventMaster event = eventRepo.findByCode("PROJECT_DRAFT");

        for (Project project : oldDrafts) {
            notificationService.createNotification(
                    event,
                    "Your project '" + project.getProjectName() + "' has been in draft for over 7 days.",
                    project.getId(),
                    "project",
                    project.getUserId()
            );
        }
    }

    // 2. Inactive User Reminder
    @Transactional
    @Scheduled(cron = "0 0 0 * * *") // daily
    public void checkInactiveUsers() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusYears(1);
        List<UserMaster> inactiveUsers = userRepository.findByUpdatedAtBefore(cutoffDate);

        NotificationEventMaster event = eventRepo.findByCode("KYC_EXPIRE");

        for (UserMaster user : inactiveUsers) {
            notificationService.createNotification(
                    event,
                    "You haven’t updated your profile in over a year. Please review your KYC.",
                    user.getId(),
                    "user",
                    user.getUid()
            );
        }
    }
}
