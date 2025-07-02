package com.carbclex.CarbClex.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.time.LocalDateTime;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer projectid;

    @Column(nullable = false, length = 255)
    private String projectName;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('Renewable', 'Reforestation', 'Energy_efficiency', 'Agriculture', 'Carbon_capture')")
    private ProjectType projectType;

    @ManyToOne
    @JoinColumn(name = "countryId", referencedColumnName = "countryId")
    private CountryCodeMaster countryId;

    @Column(length = 100)
    private String region;

    @Lob
    private String locationDetails;

    private Date startDate;
    private Date endDate;

    @Column(precision = 10, scale = 2)
    private BigDecimal estimatedCarbonReduction;

    @Column(precision = 10, scale = 2)
    private BigDecimal actualCarbonReduction;

    private Integer carbonCreditsIssued;
    private Integer carbonCreditsAvailable;

    @Lob
    private String projectDescription;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('verified', 'pending', 'failed')")
    private VerificationStatus verificationStatus;

    @ManyToOne
    @JoinColumn(name = "verifierId", referencedColumnName = "id")
    private Verifier verifierId;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

    private String projectDocumentURL;
    private String projectImagesURL;
    private String projectVideosURL;

    public enum ProjectType {
        Renewable, Reforestation, Energy_efficiency, Agriculture, Carbon_capture
    }

    public enum VerificationStatus {
        verified, pending, failed
    }

    public Project() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getProjectid() {
        return projectid;
    }

    public void setProjectid(Integer projectid) {
        this.projectid = projectid;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public ProjectType getProjectType() {
        return projectType;
    }

    public void setProjectType(ProjectType projectType) {
        this.projectType = projectType;
    }

    public CountryCodeMaster getCountryId() {
        return countryId;
    }

    public void setCountryId(CountryCodeMaster countryId) {
        this.countryId = countryId;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getLocationDetails() {
        return locationDetails;
    }

    public void setLocationDetails(String locationDetails) {
        this.locationDetails = locationDetails;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getEstimatedCarbonReduction() {
        return estimatedCarbonReduction;
    }

    public void setEstimatedCarbonReduction(BigDecimal estimatedCarbonReduction) {
        this.estimatedCarbonReduction = estimatedCarbonReduction;
    }

    public BigDecimal getActualCarbonReduction() {
        return actualCarbonReduction;
    }

    public void setActualCarbonReduction(BigDecimal actualCarbonReduction) {
        this.actualCarbonReduction = actualCarbonReduction;
    }

    public Integer getCarbonCreditsIssued() {
        return carbonCreditsIssued;
    }

    public void setCarbonCreditsIssued(Integer carbonCreditsIssued) {
        this.carbonCreditsIssued = carbonCreditsIssued;
    }

    public Integer getCarbonCreditsAvailable() {
        return carbonCreditsAvailable;
    }

    public void setCarbonCreditsAvailable(Integer carbonCreditsAvailable) {
        this.carbonCreditsAvailable = carbonCreditsAvailable;
    }

    public String getProjectDescription() {
        return projectDescription;
    }

    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public Verifier getVerifierId() {
        return verifierId;
    }

    public void setVerifierId(Verifier verifierId) {
        this.verifierId = verifierId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
