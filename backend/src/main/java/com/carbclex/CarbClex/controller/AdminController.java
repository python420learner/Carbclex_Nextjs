package com.carbclex.CarbClex.controller;

import com.carbclex.CarbClex.dto.RoleUpdateRequest;
import com.carbclex.CarbClex.model.AdminFeedback;
import com.carbclex.CarbClex.model.UserMaster;
import com.carbclex.CarbClex.repository.AdminFeedbackRepository;
import com.carbclex.CarbClex.repository.UserMasterRepository;
import com.carbclex.CarbClex.service.RoleService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/carbclex")
public class AdminController {

    @Autowired
    private UserMasterRepository userMasterRepository;
    private final RoleService roleService;

    @Autowired
    private AdminFeedbackRepository adminFeedbackRepository;


    public AdminController(RoleService roleService) {
        this.roleService = roleService;
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @PreAuthorize("hasRole('admin')")

    @PutMapping("/admin/update-role")
    public String updateRole(@RequestBody RoleUpdateRequest request) {
        try {
            UserMaster.Role role = UserMaster.Role.valueOf(request.getNewRole().toLowerCase());
            roleService.updateUserRole(request.getUserId(), role);
            return "Role updated to " + role.name();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Invalid role. Valid roles: " + Arrays.toString(UserMaster.Role.values()));
        }
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('admin')")
    public List<UserMaster> getAllUsers() {
        return userMasterRepository.findAll();
    }

    @GetMapping("admin-feedback/project/{projectId}")
    public ResponseEntity<?> getFeedbackByProject(@PathVariable Integer projectId) {
        List<AdminFeedback> feedbackList = adminFeedbackRepository.findByProjectId(projectId);
        return ResponseEntity.ok(feedbackList);
    }

    @GetMapping("admin-feedback/{id}")
    public ResponseEntity<?> getFeedbackById(@PathVariable Integer id) {
        Optional<AdminFeedback> feedback = adminFeedbackRepository.findById(id);
        return ResponseEntity.ok(feedback);
    }
}
