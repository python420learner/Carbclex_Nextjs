package com.carbclex.CarbClex.model;
import jakarta.persistence.*;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "wishlist")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "project_id", nullable = false)
    private Integer projectId;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    @Column(name = "notifyOnPrice", nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean notifyOnPrice;

    @Column(name = "notifyOnAvailable", nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean notifyOnAvailable;

    @Column(name = "creditType", nullable = false)
    private String creditType;

    @Column(name = "projectType", nullable = false)
    private String projectType;

    @Column(name = "projectName")
    private String projectName;

    // === Constructors ===
    public Wishlist() {}

    public Wishlist(String userId, Integer projectId, LocalDateTime addedAt, Boolean notifyOnPrice, Boolean notifyOnAvailable) {
        this.userId = userId;
        this.projectId = projectId;
        this.addedAt = addedAt;
        this.projectName = projectName;
        this.notifyOnPrice = notifyOnPrice;
        this.notifyOnAvailable = notifyOnAvailable;
        this.creditType = creditType; // Set default value or pass as parameter
        this.projectType = projectType; // Set default value or pass as parameter
    }

    // === Getters and Setters ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public String getCreditType(){
        return creditType;
    }

    public void setCreditType(String creditType) {
        this.creditType = creditType;
    }

    public String getProjectType() {
        return projectType;
    }

    public void setProjectType(String projectType) {
        this.projectType = projectType;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    } 

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    public Boolean getNotifyOnPrice() {
        return notifyOnPrice;
    }

    public void setNotifyOnPrice(Boolean notifyOnPrice) {
        this.notifyOnPrice = notifyOnPrice;
    }

    public Boolean getNotifyOnAvailable() {
        return notifyOnAvailable;
    }

    public void setNotifyOnAvailable(Boolean notifyOnAvailable) {
        this.notifyOnAvailable = notifyOnAvailable;
    }
}
