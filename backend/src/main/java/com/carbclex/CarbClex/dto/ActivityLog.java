package com.carbclex.CarbClex.dto;

import java.io.Serializable;

public class ActivityLog implements Serializable {
    private String type;       // click, navigation, form_submission, etc.
    private String url;        // page the user was on
    private String tag;        // clicked element tag (e.g., button, link)
    private String formId;     // ID of submitted form
    private String status;     // online/offline
    private Long timestamp;    // time of the event in ms

    public ActivityLog() {}

    public ActivityLog(String type, String url, String tag, String formId, String status, Long timestamp) {
        this.type = type;
        this.url = url;
        this.tag = tag;
        this.formId = formId;
        this.status = status;
        this.timestamp = timestamp;
    }

    // Getters
    public String getType() {
        return type;
    }

    public String getUrl() {
        return url;
    }

    public String getTag() {
        return tag;
    }

    public String getFormId() {
        return formId;
    }

    public String getStatus() {
        return status;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    // Setters
    public void setType(String type) {
        this.type = type;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public void setFormId(String formId) {
        this.formId = formId;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "ActivityLog{" +
                "type='" + type + '\'' +
                ", url='" + url + '\'' +
                ", tag='" + tag + '\'' +
                ", formId='" + formId + '\'' +
                ", status='" + status + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
