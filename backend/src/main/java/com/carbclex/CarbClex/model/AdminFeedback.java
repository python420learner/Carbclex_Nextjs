package com.carbclex.CarbClex.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_feedback")
public class AdminFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Foreign key to the project
    @Column(name = "project_id", nullable = false)
    private Integer projectId;  // ✅ Just store the ID, no relation to Project entity

    @Column(name = "admin_message", columnDefinition = "TEXT")
    private String adminMessage;

    @Column(name = "title", columnDefinition = "TEXT")
    private String title;

    @Column(name = "action_required", nullable = false, columnDefinition = "ENUM('edit_project_info','edit_methodology','edit_documents')")
    @Enumerated(EnumType.STRING)
    private ActionRequired actionRequired;

    @Column(name = "responded", nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean responded = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ActionRequired {
        edit_project_info, edit_methodology, edit_documents;
    }

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public String getAdminMessage() {
        return adminMessage;
    }

    public void setAdminMessage(String adminMessage) {
        this.adminMessage = adminMessage;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ActionRequired getActionRequired() {
        return actionRequired;
    }

    public void setActionRequired(ActionRequired actionRequired) {
        this.actionRequired = actionRequired;
    }

    public Boolean getResponded() {
        return responded;
    }

    public void setResponded(Boolean responded) {
        this.responded = responded;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}