package com.carbclex.CarbClex.model;

import java.io.Serializable;
import java.util.*;

public class UserActivity implements Serializable {
    private String sessionId;
    private String userId;
    private List<String> pagesVisited = new ArrayList<>();
    private List<String> buttonsClicked = new ArrayList<>();
    private List<String> formsSubmitted = new ArrayList<>();
    private Date loginTime;
    private Date lastActive;

    // Getters and setters
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<String> getPagesVisited() { return pagesVisited; }
    public void setPagesVisited(List<String> pagesVisited) { this.pagesVisited = pagesVisited; }

    public List<String> getButtonsClicked() { return buttonsClicked; }
    public void setButtonsClicked(List<String> buttonsClicked) { this.buttonsClicked = buttonsClicked; }

    public List<String> getFormsSubmitted() { return formsSubmitted; }
    public void setFormsSubmitted(List<String> formsSubmitted) { this.formsSubmitted = formsSubmitted; }

    public Date getLoginTime() { return loginTime; }
    public void setLoginTime(Date loginTime) { this.loginTime = loginTime; }

    public Date getLastActive() { return lastActive; }
    public void setLastActive(Date lastActive) { this.lastActive = lastActive; }
}
