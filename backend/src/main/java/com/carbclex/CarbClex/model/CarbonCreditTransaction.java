package com.carbclex.CarbClex.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "CarbonCreditTransaction")
public class CarbonCreditTransaction implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectId", referencedColumnName = "id", nullable = false)
    private Project project;

    @Column(name = "creditsIssued")
    private Integer creditsIssued;

    @Column(name = "creditsSold")
    private Integer creditsSold;

    @Column(name = "creditsRemaining")
    private Integer creditsRemaining;

    @Column(name = "buyerName", length = 100)
    private String buyerName;

    @Temporal(TemporalType.DATE)
    @Column(name = "saleDate")
    private Date saleDate;

    @Column(name = "pricePerCredit", precision = 10, scale = 2)
    private BigDecimal pricePerCredit;

    @Column(name = "transactionDescription", columnDefinition = "TEXT")
    private String transactionDescription;

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

    public Integer getCreditsIssued() {
        return creditsIssued;
    }

    public void setCreditsIssued(Integer creditsIssued) {
        this.creditsIssued = creditsIssued;
    }

    public Integer getCreditsSold() {
        return creditsSold;
    }

    public void setCreditsSold(Integer creditsSold) {
        this.creditsSold = creditsSold;
    }

    public Integer getCreditsRemaining() {
        return creditsRemaining;
    }

    public void setCreditsRemaining(Integer creditsRemaining) {
        this.creditsRemaining = creditsRemaining;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public Date getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(Date saleDate) {
        this.saleDate = saleDate;
    }

    public BigDecimal getPricePerCredit() {
        return pricePerCredit;
    }

    public void setPricePerCredit(BigDecimal pricePerCredit) {
        this.pricePerCredit = pricePerCredit;
    }

    public String getTransactionDescription() {
        return transactionDescription;
    }

    public void setTransactionDescription(String transactionDescription) {
        this.transactionDescription = transactionDescription;
    }
}
