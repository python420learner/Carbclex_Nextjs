package com.carbclex.CarbClex.controller;

import com.carbclex.CarbClex.repository.NewsletterRepository;
import com.carbclex.CarbClex.model.NewsletterSubscription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/carbclex/newsletter")
public class NewsletterController {

    @Autowired
    private NewsletterRepository newsletterRepository;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestParam String email) {
        // Basic validation
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            return ResponseEntity.badRequest().body("Invalid email format.");
        }

        // If already exists — return 200 OK with a friendly message
        if (newsletterRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.ok("You are already subscribed to our newsletter!");
        }

        // Save to DB
        NewsletterSubscription subscription = new NewsletterSubscription(email);
        newsletterRepository.save(subscription);

        return ResponseEntity.ok("Subscribed successfully!");
    }
}
