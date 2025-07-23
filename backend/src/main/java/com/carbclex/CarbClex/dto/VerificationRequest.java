package com.carbclex.CarbClex.dto;

import com.carbclex.CarbClex.model.Project.VerificationStatus;

public class VerificationRequest {
    private VerificationStatus status;

    public VerificationStatus getStatus() {
        return status;
    }

    public void setStatus(VerificationStatus status) {
        this.status = status;
    }
}