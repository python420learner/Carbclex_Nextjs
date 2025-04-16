package com.carbclex.CarbClex.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.*;

@Entity
public class Verifier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String verifierName;

    @Lob
    private String contactInfo;

    @Lob
    private String accreditationDetails;

    // Constructors, Getters, and Setters

    public Verifier() {}

    public Verifier(String verifierName, String contactInfo, String accreditationDetails) {
        this.verifierName = verifierName;
        this.contactInfo = contactInfo;
        this.accreditationDetails = accreditationDetails;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getVerifierName() {
        return verifierName;
    }

    public void setVerifierName(String verifierName) {
        this.verifierName = verifierName;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public String getAccreditationDetails() {
        return accreditationDetails;
    }

    public void setAccreditationDetails(String accreditationDetails) {
        this.accreditationDetails = accreditationDetails;
    }
}
