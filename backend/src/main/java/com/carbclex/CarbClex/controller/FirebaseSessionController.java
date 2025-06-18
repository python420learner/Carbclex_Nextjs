package com.carbclex.CarbClex.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/carbclex")
public class FirebaseSessionController {
    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server

    @PostMapping("/auth/login")
    public ResponseEntity<?> loginWithFirebase(@RequestHeader("Authorization") String idToken,
            HttpServletRequest request) {
        try {
            // Strip "Bearer " if sent that way
            if (idToken.startsWith("Bearer ")) {
                idToken = idToken.substring(7);
            }

            // Verify Firebase token
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);

            boolean emailVerified = Boolean.TRUE.equals(decodedToken.isEmailVerified());
            if (!emailVerified) {
                return ResponseEntity.status(403).body("Email not verified.");
            }

            String email = decodedToken.getEmail();
            String uid = decodedToken.getUid();
            // String provider = decodedToken.getFirebase().getSignInProvider(); // "google.com", "password", etc.
            String provider = (String) decodedToken.getClaims().get("firebase").toString();



            // Check if session already exists for this user
            HttpSession existingSession = request.getSession(false);
            if (existingSession != null && email.equals(existingSession.getAttribute("email"))) {
                return ResponseEntity.ok("Session already active for " + email);
            }

            // Create Spring Boot session
            HttpSession session = request.getSession(true);
            session.setAttribute("uid", uid);
            session.setAttribute("email", email);
            session.setAttribute("provider", provider);


            return ResponseEntity.ok("Session created for " + email);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid Firebase ID token");
        }
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server

    @GetMapping("/auth/dashboard")
    public ResponseEntity<?> dashboard(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("email") == null) {
            return ResponseEntity.status(401).body("Not logged in.");
        }

        return ResponseEntity.ok("Hello " + session.getAttribute("email"));
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @GetMapping("/auth/check-session")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("email") != null) {
            return ResponseEntity.ok("Session active");
        } else {
            return ResponseEntity.status(401).body("Session inactive");
        }
    }
    
    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate(); // ✅ Destroys the session
        }
        return ResponseEntity.ok("Logged out successfully");
    }
}