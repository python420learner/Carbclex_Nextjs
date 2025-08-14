package com.carbclex.CarbClex.model;

import jakarta.persistence.*;

@Entity
@Table(name = "newsletter_subscriptions", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
public class NewsletterSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    public NewsletterSubscription() {
    }

    public NewsletterSubscription(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
