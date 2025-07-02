package com.carbclex.CarbClex.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carbclex.CarbClex.model.UserMaster;
import com.carbclex.CarbClex.repository.UserMasterRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

@RestController
@RequestMapping("/carbclex")
public class UserController {

    @Autowired
    private UserMasterRepository userRepository;

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @PostMapping("/user/register")
    public ResponseEntity<?> registerUser(
            @RequestBody UserMaster user,
            @RequestHeader("Authorization") String idToken) {

        try {

             if (idToken.startsWith("Bearer ")) {
                idToken = idToken.substring(7);
            }

            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            if (!decodedToken.isEmailVerified()) {
                return ResponseEntity.status(403).body("Email not verified.");
            }

            // Prevent overwrite if already exists
            if (userRepository.findByEmail(user.getEmail()).isEmpty()) {
                userRepository.save(user);
                return ResponseEntity.ok("User saved to backend.");
            } else {
                return ResponseEntity.ok("User already exists.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid Firebase token.");
        }
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @GetMapping("user/me")
    public ResponseEntity<?> getUser(@RequestHeader("Authorization") String idToken) {
        try {

             if (idToken.startsWith("Bearer ")) {
                idToken = idToken.substring(7);
            }

            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();

            Optional<UserMaster> user = userRepository.findByUid(uid);
            return user.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token.");
        }
    }
}
