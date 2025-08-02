package com.carbclex.CarbClex.dto;

public class KycStatusUpdateRequest {
    private String status;

    public KycStatusUpdateRequest() {
    }

    public KycStatusUpdateRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}