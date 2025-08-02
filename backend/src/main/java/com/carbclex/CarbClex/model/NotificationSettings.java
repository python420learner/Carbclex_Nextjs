
package com.carbclex.CarbClex.model;

import jakarta.persistence.*;

@Entity
@Table(name = "notification_settings")
public class NotificationSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer userId;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private NotificationTypeMaster type;

    private Boolean enabled = true;

    private String preferredChannel;

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public NotificationTypeMaster getType() { return type; }
    public void setType(NotificationTypeMaster type) { this.type = type; }

    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }

    public String getPreferredChannel() { return preferredChannel; }
    public void setPreferredChannel(String preferredChannel) { this.preferredChannel = preferredChannel; }
}
