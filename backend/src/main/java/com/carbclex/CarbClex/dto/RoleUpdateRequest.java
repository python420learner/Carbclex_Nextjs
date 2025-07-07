package com.carbclex.CarbClex.dto;

// import com.carbclex.CarbClex.model.UserMaster.Role;

public class RoleUpdateRequest {
    private String userId;
    private String newRole;

    public RoleUpdateRequest(String userId, String newRole) {
        this.userId = userId;
        this.newRole = newRole;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getNewRole() {
        return newRole;
    }

    public void setNewRole(String newRole) {
        this.newRole = newRole;
    }       
}

