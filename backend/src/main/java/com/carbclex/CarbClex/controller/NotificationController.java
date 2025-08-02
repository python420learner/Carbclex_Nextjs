package com.carbclex.CarbClex.controller;

import java.util.List;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.carbclex.CarbClex.model.UserNotification;
import com.carbclex.CarbClex.repository.UserNotificationRepository;
import com.carbclex.CarbClex.service.ReminderScheduler;

@RestController
@RequestMapping("/carbclex")
public class NotificationController {

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    @GetMapping("/notification/getAll")
    public ResponseEntity<?> getNotificationsByUserId(@RequestParam("userId") String userId) {
        try {
            List<UserNotification> notifications = userNotificationRepository
                    .findByUserIdOrderByCreatedAtDesc(userId);

            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch notifications: " + e.getMessage());
        }
    }

    @Autowired
    private ReminderScheduler reminderScheduler;

    @PostMapping("/cart-expiry")
    public ResponseEntity<String> triggerCartReminder() {
        reminderScheduler.checkCartExpiryReminders();
        return ResponseEntity.ok("Cart expiry reminder triggered");
    }

    @PutMapping("/notifications/mark-as-read")
    public ResponseEntity<String> markNotificationsAsRead(@RequestBody List<Integer> notificationIds) {
        try {
            userNotificationRepository.markNotificationsAsRead(notificationIds);
            return ResponseEntity.ok("Notifications marked as read successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR)
                    .body("Failed to mark notifications as read.");
        }
    }

    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable Integer id) {
        try {
            if (userNotificationRepository.existsById(id)) {
                userNotificationRepository.deleteById(id);
                return ResponseEntity.ok("Notification deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body("Notification not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body("Failed to delete notification.");
        }
    }

    @DeleteMapping("/notifications/clear-all/{userId}")
    public ResponseEntity<String> clearAllNotifications(@PathVariable String userId) {
        try {
            userNotificationRepository.deleteAllByUserId(userId);
            return ResponseEntity.ok("All notifications cleared successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body("Failed to clear notifications.");
        }
    }

    @DeleteMapping("/notifications/clear")
    public ResponseEntity<String> clearNotificationsByUserAndType(
            @RequestParam String userId,
            @RequestParam Integer typeId) {
        try {
            userNotificationRepository.deleteAllByUserIdAndTypeId(userId, typeId);
            return ResponseEntity.ok("Notifications cleared for userId: " + userId + " and typeId: " + typeId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body("Failed to clear notifications.");
        }
    }

}