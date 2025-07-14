package com.carbclex.CarbClex.controller;

import com.carbclex.CarbClex.model.UserActivity;
import com.carbclex.CarbClex.service.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpSession;
import java.util.Date;

@RestController
@RequestMapping("/carbclex")
public class ActivityController {

    @Autowired
    private RedisService redisService;

    // @PostMapping("/activity/track")
    @PostMapping("/activity/track")
    public void trackActivity(@RequestBody UserActivity newActivity, HttpSession session) {
        String sessionId = newActivity.getSessionId();
        if (sessionId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Session ID is required");
        }

        // Fetch existing activity
        UserActivity existing = null;
        try {
            existing = redisService.getActivity(sessionId);
        } catch (ResponseStatusException e) {
            // No existing activity found, this will be the first
            existing = new UserActivity();
            existing.setSessionId(sessionId);
            existing.setLoginTime(new Date());
        }

        // Merge new data
        if (newActivity.getPagesVisited() != null) {
            existing.getPagesVisited().addAll(newActivity.getPagesVisited());
        }
        if (newActivity.getButtonsClicked() != null) {
            existing.getButtonsClicked().addAll(newActivity.getButtonsClicked());
        }
        if (newActivity.getFormsSubmitted() != null) {
            existing.getFormsSubmitted().addAll(newActivity.getFormsSubmitted());
        }

        // Update metadata
        existing.setLastActive(new Date());
        String userId = (String) session.getAttribute("userId");
        if (userId != null) {
            existing.setUserId(userId);
        }

        redisService.saveActivity(sessionId, existing);
    }

    // public void trackActivity(@RequestBody UserActivity activity, HttpSession
    // session) {
    // // Trust sessionId from request body
    // if (activity.getSessionId() == null) {
    // throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing session
    // ID");
    // }

    // activity.setLastActive(new Date());

    // // Optional: attach logged-in user ID from session
    // String userId = (String) session.getAttribute("userId");
    // if (userId != null) {
    // activity.setUserId(userId);
    // }

    // redisService.saveActivity(activity.getSessionId(), activity);
    // }

    @GetMapping("/activity/{sessionId}")
    public ResponseEntity<?> getActivity(@PathVariable String sessionId) {
        UserActivity activity = redisService.getActivity(sessionId);
        if (activity != null) {
            return ResponseEntity.ok(activity);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No activity found for session");
        }
    }
}
