package com.carbclex.CarbClex.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

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

    @Column(name = "user_id", nullable = false) // Simple storage of the ID
    private String userId;

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

    @Lob
    private String methodology;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('draft','uploaded_media','submitted','reviewing','expert_validation','verified','failed')")
    private VerificationStatus verificationStatus;

    @ManyToOne
    @JoinColumn(name = "verifierId", referencedColumnName = "id")
    private Verifier verifierId;

    @Column(name = "createdAt", updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

    private String projectDocumentURL;
    private String projectImagesURL;
    private String projectVideosURL;

    // 1. Latitude
    @Column(precision = 9, scale = 6)
    private BigDecimal latitude;

    // 2. Longitude
    @Column(precision = 9, scale = 6)
    private BigDecimal longitude;

    // 3. Baseline Scenario Description
    @Column(length = 1000)
    private String baselineScenarioDescription;

    // 4. Methodology document (store as URL path or filename)
    @Column(length = 500)
    private String methodologyDocumentUrl;

    // 5. CO2 Offset
    @Column(precision = 12, scale = 2)
    private BigDecimal co2Offset;

    // 6. SDG Alignment (List of Strings)
    @ElementCollection
    @CollectionTable(name = "project_sdg_alignment", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "sdg")
    private List<String> sdgAlignment;

    // 7. Community/Environments Co-benefits
    @Column(length = 1000)
    private String coBenefits;

    // 8. Registration Status Enum
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('projectInfo','methodology','impact','documents_uploaded','review')")
    private RegistrationStatus registrationStatus;

    // 9. Project Area (use BigDecimal for precision, e.g., in hectares)
    @Column(precision = 12, scale = 2)
    private BigDecimal projectArea;

    public enum ProjectType {
        Renewable, Reforestation, Energy_efficiency, Agriculture, Carbon_capture
    }

    public enum VerificationStatus {
        draft, uploaded_media, submitted, reviewing, expert_validation, verified, failed
    }

    public enum RegistrationStatus {
        projectInfo,
        methodology,
        impact,
        documents_uploaded,
        review
    }

    public Project() {
    }

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

    public String getMethodology() {
        return methodology;
    }

    public void setMethodology(String methodology) {
        this.methodology = methodology;
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

    public String getImageUrls() {
        return projectImagesURL;
    }

    public void setImageUrls(String imageUrls) {
        this.projectImagesURL = imageUrls;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    // Longitude
    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    // Baseline Scenario Description
    public String getBaselineScenarioDescription() {
        return baselineScenarioDescription;
    }

    public void setBaselineScenarioDescription(String baselineScenarioDescription) {
        this.baselineScenarioDescription = baselineScenarioDescription;
    }

    // Methodology Document URL
    public String getMethodologyDocumentUrl() {
        return methodologyDocumentUrl;
    }

    public void setMethodologyDocumentUrl(String methodologyDocumentUrl) {
        this.methodologyDocumentUrl = methodologyDocumentUrl;
    }

    // CO2 Offset
    public BigDecimal getCo2Offset() {
        return co2Offset;
    }

    public void setCo2Offset(BigDecimal co2Offset) {
        this.co2Offset = co2Offset;
    }

    // SDG Alignment
    public List<String> getSdgAlignment() {
        return sdgAlignment;
    }

    public void setSdgAlignment(List<String> sdgAlignment) {
        this.sdgAlignment = sdgAlignment;
    }

    // Community/Environments Co-benefits
    public String getCoBenefits() {
        return coBenefits;
    }

    public void setCoBenefits(String coBenefits) {
        this.coBenefits = coBenefits;
    }

    // Registration Status
    public RegistrationStatus getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(RegistrationStatus registrationStatus) {
        this.registrationStatus = registrationStatus;
    }

    // Project Area
    public BigDecimal getProjectArea() {
        return projectArea;
    }

    public void setProjectArea(BigDecimal projectArea) {
        this.projectArea = projectArea;
    }
}
