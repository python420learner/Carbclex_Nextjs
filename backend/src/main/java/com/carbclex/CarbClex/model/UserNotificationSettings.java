package com.carbclex.CarbClex.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_notification_settings")
public class UserNotificationSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String userId;

    // General Preferences
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DefaultView defaultView = DefaultView.alerts_first;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertPriority alertPriority = AlertPriority.all_alerts;

    // Delivery Channels

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean emailNotifications = true;

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean inAppNotifications = true;

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean smsNotifications = false;

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean notificationSound = true;

    // Alert Categories

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean kycAlerts = true;

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean projectUpdates = true;

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean marketplaceUpdates = true;

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean systemNotifications = true;

    // Market Insights
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UpdateFrequency updateFrequency = UpdateFrequency.daily;

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean policyUpdates = true;

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean techUpdates = true;

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean priceTrends = true;

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean marketNews = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Enums
    public enum DefaultView {
        alerts_first, reminders_first
    }

    public enum AlertPriority {
        all_alerts, critical_only
    }

    public enum UpdateFrequency {
        daily, weekly, monthly
    }

    // Constructors

    public UserNotificationSettings(){

    }

    public UserNotificationSettings(String userId) {
        this.userId = userId;
        this.defaultView = DefaultView.alerts_first;
        this.alertPriority = AlertPriority.all_alerts;
        this.updateFrequency = UpdateFrequency.daily;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        this.emailNotifications = true;
        this.inAppNotifications = true;
        this.smsNotifications = false;
        this.notificationSound = true;
        this.kycAlerts = true;
        this.projectUpdates = true;
        this.marketplaceUpdates = true;
        this.systemNotifications = true;
        this.priceTrends = true;
        this.marketNews = false;
        this.policyUpdates = true;
        this.techUpdates = true;
    }

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public DefaultView getDefaultView() {
        return defaultView;
    }

    public void setDefaultView(DefaultView defaultView) {
        this.defaultView = defaultView;
    }

    public AlertPriority getAlertPriority() {
        return alertPriority;
    }

    public void setAlertPriority(AlertPriority alertPriority) {
        this.alertPriority = alertPriority;
    }

    public Boolean getEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(Boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public Boolean getInAppNotifications() {
        return inAppNotifications;
    }

    public void setInAppNotifications(Boolean inAppNotifications) {
        this.inAppNotifications = inAppNotifications;
    }

    public Boolean getSmsNotifications() {
        return smsNotifications;
    }

    public void setSmsNotifications(Boolean smsNotifications) {
        this.smsNotifications = smsNotifications;
    }

    public Boolean getNotificationSound() {
        return notificationSound;
    }

    public void setNotificationSound(Boolean notificationSound) {
        this.notificationSound = notificationSound;
    }

    public Boolean getKycAlerts() {
        return kycAlerts;
    }

    public void setKycAlerts(Boolean kycAlerts) {
        this.kycAlerts = kycAlerts;
    }

    public Boolean getProjectUpdates() {
        return projectUpdates;
    }

    public void setProjectUpdates(Boolean projectUpdates) {
        this.projectUpdates = projectUpdates;
    }

    public Boolean getMarketplaceUpdates() {
        return marketplaceUpdates;
    }

    public void setPolicyUpdates(Boolean policyUpdates){
        this.policyUpdates = policyUpdates;
    }

    public Boolean getPolicyUpdates(){
        return policyUpdates;
    }

    public void setTechUpdates(Boolean techUpdates){
        this.techUpdates = techUpdates;
    }

    public Boolean getTechUpdates(){
        return techUpdates;
    }

    public void setMarketplaceUpdates(Boolean marketplaceUpdates) {
        this.marketplaceUpdates = marketplaceUpdates;
    }

    public Boolean getSystemNotifications() {
        return systemNotifications;
    }

    public void setSystemNotifications(Boolean systemNotifications) {
        this.systemNotifications = systemNotifications;
    }

    public UpdateFrequency getUpdateFrequency() {
        return updateFrequency;
    }

    public void setUpdateFrequency(UpdateFrequency updateFrequency) {
        this.updateFrequency = updateFrequency;
    }

    public Boolean getPriceTrends() {
        return priceTrends;
    }

    public void setPriceTrends(Boolean priceTrends) {
        this.priceTrends = priceTrends;
    }

    public Boolean getMarketNews() {
        return marketNews;
    }

    public void setMarketNews(Boolean marketNews) {
        this.marketNews = marketNews;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
