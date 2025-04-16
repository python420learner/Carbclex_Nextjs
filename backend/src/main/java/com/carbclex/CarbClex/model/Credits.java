package com.carbclex.CarbClex.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Credits")
public class Credits implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectId", referencedColumnName = "id", nullable = false)
    private Project project;

    @Column(name = "creditId", nullable = false, unique = true)
    private Long creditId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stakeholderId", referencedColumnName = "stakeholderId")
    private ProjectStakeholder stakeholder;

    @Enumerated(EnumType.STRING)
    @Column(name = "creditStatus", nullable = false, columnDefinition = "ENUM('issued', 'active', 'expired', 'retired') DEFAULT 'issued'")
    private CreditStatus creditStatus;

    @Column(name = "dateIssued", nullable = false)
    private LocalDate dateIssued;

    @Column(name = "creditExpiryDate")
    private LocalDate creditExpiryDate;

    @Column(name = "createdAt", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updatedAt", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

    public enum CreditStatus {
        ISSUED,
        ACTIVE,
        EXPIRED,
        RETIRED
    }

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Long getCreditId() {
        return creditId;
    }

    public void setCreditId(Long creditId) {
        this.creditId = creditId;
    }

    public ProjectStakeholder getStakeholder() {
        return stakeholder;
    }

    public void setStakeholder(ProjectStakeholder stakeholder) {
        this.stakeholder = stakeholder;
    }

    public CreditStatus getCreditStatus() {
        return creditStatus;
    }

    public void setCreditStatus(CreditStatus creditStatus) {
        this.creditStatus = creditStatus;
    }

    public LocalDate getDateIssued() {
        return dateIssued;
    }

    public void setDateIssued(LocalDate dateIssued) {
        this.dateIssued = dateIssued;
    }

    public LocalDate getCreditExpiryDate() {
        return creditExpiryDate;
    }

    public void setCreditExpiryDate(LocalDate creditExpiryDate) {
        this.creditExpiryDate = creditExpiryDate;
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
