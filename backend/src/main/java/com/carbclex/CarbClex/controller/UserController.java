package com.carbclex.CarbClex.controller;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.nio.file.*;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.carbclex.CarbClex.dto.KycStatusUpdateRequest;
import com.carbclex.CarbClex.model.NotificationEventMaster;
import com.carbclex.CarbClex.model.UserMaster;
import com.carbclex.CarbClex.model.UserNotification;
import com.carbclex.CarbClex.model.UserMaster.KYC;
import com.carbclex.CarbClex.repository.NotificationEventMasterRepository;
import com.carbclex.CarbClex.repository.UserMasterRepository;
import com.carbclex.CarbClex.repository.UserNotificationRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

@RestController
@RequestMapping("/carbclex")
public class UserController {

    @Autowired
    private UserMasterRepository userRepository;

    @Value("${media.upload.path}")
    private String baseUploadPath;

    @Autowired
    private NotificationEventMasterRepository notificationEventRepository;

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    // @Value("${upload.dir}")
    // private String uploadDir;

    // private final ObjectMapper objectMapper = new ObjectMapper();

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @PostMapping("/user/register")
    public ResponseEntity<?> registerUser(
            @RequestBody UserMaster user,
            @RequestHeader("Authorization") String idToken) {

        try {
            System.out.println("this is the id tokeinnnnnnn"+ idToken);
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
    @PostMapping("/user/upload-documents/{userId}")
    public ResponseEntity<?> uploadUserDocuments(
            @PathVariable String userId,
            @RequestHeader(value = "Authorization", required = false) String idToken,
            @RequestParam Map<String, MultipartFile> fileMap // ⬅️ This line is key
    ) {
        try {
            // Optional Firebase validation
            if (idToken != null && idToken.startsWith("Bearer ")) {
                idToken = idToken.substring(7);
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
                String uid = decodedToken.getUid();
                if (!uid.equals(userId)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
                }
            }

            Optional<UserMaster> optionalUser = userRepository.findByUid(userId);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            UserMaster user = optionalUser.get();

            String basePath = baseUploadPath + "/" + userId + "/";
            File dir = new File(basePath);
            if (!dir.exists())
                dir.mkdirs();

            Map<String, String> documentUrls = user.getDocuments() != null ? user.getDocuments() : new HashMap<>();

            for (Map.Entry<String, MultipartFile> entry : fileMap.entrySet()) {
                String key = entry.getKey(); // e.g. "aadhaar", "panCard"
                MultipartFile file = entry.getValue();

                if (!file.isEmpty()) {
                    String ext = Objects.requireNonNull(file.getOriginalFilename())
                            .substring(file.getOriginalFilename().lastIndexOf("."));
                    String newFileName = key + ext;

                    Path filePath = Paths.get(basePath + newFileName);
                    Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE,
                            StandardOpenOption.TRUNCATE_EXISTING);

                    documentUrls.put(key, baseUploadPath + "/" + userId + "/" + newFileName);
                }
            }

            user.setDocuments(documentUrls);
            userRepository.save(user);

            return ResponseEntity.ok("Documents uploaded successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload documents: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @GetMapping("/user/get-documents/{userId}")
    public ResponseEntity<Map<String, String>> getUserDocuments(@PathVariable String userId) {
        Optional<UserMaster> optionalUser = userRepository.findByUid(userId);

        if (optionalUser.isPresent()) {
            UserMaster user = optionalUser.get();
            Map<String, String> documents = user.getDocuments(); // This is your JSON field

            if (documents != null) {
                return ResponseEntity.ok(documents);
            } else {
                return ResponseEntity.ok(new HashMap<>()); // Return empty if no documents
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/user/update")
    public ResponseEntity<?> updateUser(
            @RequestPart("user") UserMaster updatedUser,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestHeader("Authorization") String idToken) {
        try {
            if (idToken.startsWith("Bearer ")) {
                idToken = idToken.substring(7);
            }

            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();

            Optional<UserMaster> optionalUser = userRepository.findByUid(uid);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            UserMaster existingUser = optionalUser.get();

            // ✅ Update non-null fields from `updatedUser`
            if (updatedUser.getName() != null)
                existingUser.setName(updatedUser.getName());
            if (updatedUser.getPhone() != null)
                existingUser.setPhone(updatedUser.getPhone());
            if (updatedUser.getAddress() != null)
                existingUser.setAddress(updatedUser.getAddress());
            if (updatedUser.getState() != null)
                existingUser.setState(updatedUser.getState());
            if (updatedUser.getPincode() != null)
                existingUser.setPincode(updatedUser.getPincode());

            // ✅ Handle profile image upload
            if (file != null && !file.isEmpty()) {
                String uploadDir = "uploads/" + uid + "/";
                File dir = new File(uploadDir);
                if (!dir.exists())
                    dir.mkdirs();

                String fileName = "displayImage.png";
                Path filePath = Paths.get(uploadDir + fileName);

                // Overwrite existing file
                Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

                String imageUrl = baseUploadPath + uid + "/" + fileName;
                existingUser.setDisplayImage(imageUrl);
            }

            userRepository.save(existingUser);
            return ResponseEntity.ok("User updated successfully.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update user: " + e.getMessage());
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

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @PutMapping("/user/updateKycStatus/{userId}")
    public ResponseEntity<?> updateKycStatus(@PathVariable Integer userId,
            @RequestBody KycStatusUpdateRequest request) {
        try {
            KYC newStatus = KYC.valueOf(request.getStatus().toLowerCase());

            // Update user in DB
            Optional<UserMaster> optionalUser = userRepository.findById(userId);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            System.out.println("this is the id from frontend" + userId);
            UserMaster user = optionalUser.get();
            user.setKycStatus(newStatus);
            userRepository.save(user);

            // Create notification based on KYC status
            String message = null;
            String eventName = null;

            if (newStatus == KYC.failed) {
                message = "Your KYC documents were rejected. Please re-submit.";
                eventName = "KYC_REJECTED"; // Replace with actual event ID for "KYC Failed"
            } else if (newStatus == KYC.verified) {
                message = "Your KYC has been verified successfully.";
                eventName = "KYC_APPROVED"; // Replace with actual event ID for "KYC Verified"
            }

            if (message != null) {

                NotificationEventMaster event = notificationEventRepository.findByCode(eventName);
                UserNotification notification = new UserNotification();
                notification.setUserId(user.getUid());
                notification.setIsRead(false);
                notification.setCreatedAt(LocalDateTime.now());
                notification.setCustomMessage(message);
                notification.setEvent(event);
                notification.setRelatedEntityType("user");
                notification.setRelatedEntityId(userId);
                userNotificationRepository.save(notification);
            }

            return ResponseEntity.ok("KYC status updated to " + newStatus);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid KYC status");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed");
        }
    }

    @GetMapping("/user/getById/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        Optional<UserMaster> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(optionalUser.get());
    }

}
