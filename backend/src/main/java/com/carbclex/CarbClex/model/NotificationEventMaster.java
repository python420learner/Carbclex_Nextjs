
package com.carbclex.CarbClex.model;

import jakarta.persistence.*;

@Entity
@Table(name = "notification_event_master")
public class NotificationEventMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private NotificationTypeMaster type;

    @Column(nullable = false, unique = true)
    private String code;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public NotificationTypeMaster getType() { return type; }
    public void setType(NotificationTypeMaster type) { this.type = type; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
