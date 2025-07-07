package com.carbclex.CarbClex.model;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "UserMaster")
public class UserMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false, unique = true)
    private String uid;

    @Column(name = "countryId", nullable = false)
    private Integer countryId=1;

    @Column(name = "phone", length = 15, unique = true)
    private String phone;

    @Column(name = "email", length = 255, unique = true)
    private String email;

    @Column(name = "emailStripped", length = 255)
    private String emailStripped;

    @Column(name = "userName", length = 100, unique = true)
    private String userName;

    @Column(name = "name", length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role = Role.User;

    @Enumerated(EnumType.STRING)
    @Column(name = "signupMethod", nullable = false)
    private SignupMethod signupMethod = SignupMethod.email;

    @Column(name = "is_active", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isActive = true;

    @Column(name = "createdAt", updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    @Column(name = "updatedAt", insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private Timestamp updatedAt;

    @Column(name = "role_update_token")
    private Integer roleUpdateToken = 0;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public Integer getCountryId() {
        return countryId;
    }

    public void setCountryId(Integer countryId) {
        this.countryId = countryId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmailStripped() {
        return emailStripped;
    }

    public void setEmailStripped(String emailStripped) {
        this.emailStripped = emailStripped;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public SignupMethod getSignupMethod() {
        return signupMethod;
    }

    public void setSignupMethod(SignupMethod signupMethod) {
        this.signupMethod = signupMethod;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public Integer getRoleUpdateToken() { return roleUpdateToken; }
    public void setRoleUpdateToken(Integer token) { this.roleUpdateToken = token; }

    // Enums for role and signupMethod
    public enum Role {
        Buyer, admin, Supplier, User
    }

    public enum SignupMethod {
        email, phone, social
    }
}
