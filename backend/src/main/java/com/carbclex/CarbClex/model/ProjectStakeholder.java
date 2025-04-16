package com.carbclex.CarbClex.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "ProjectStakeholder")
public class ProjectStakeholder implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stakeholderId")
    private Integer stakeholderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectId", referencedColumnName = "id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(name = "stakeholderType", nullable = false)
    private StakeholderType stakeholderType;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "contactInfo", columnDefinition = "TEXT")
    private String contactInfo;

    @Column(name = "contributionDetails", columnDefinition = "TEXT")
    private String contributionDetails;

    // Getters and Setters

    public Integer getStakeholderId() {
        return stakeholderId;
    }

    public void setStakeholderId(Integer stakeholderId) {
        this.stakeholderId = stakeholderId;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public StakeholderType getStakeholderType() {
        return stakeholderType;
    }

    public void setStakeholderType(StakeholderType stakeholderType) {
        this.stakeholderType = stakeholderType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public String getContributionDetails() {
        return contributionDetails;
    }

    public void setContributionDetails(String contributionDetails) {
        this.contributionDetails = contributionDetails;
    }
    
    // Enum for StakeholderType
    public enum StakeholderType {
        INVESTOR, MANAGER, AUDITOR;
    }
}
