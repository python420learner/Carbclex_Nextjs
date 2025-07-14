package com.carbclex.CarbClex.service;

import com.carbclex.CarbClex.model.UserActivity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RedisServiceImple implements RedisService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String KEY_PREFIX = "session:";

    @Override
    public void saveActivity(String sessionId, UserActivity activity) {
        redisTemplate.opsForValue().set(KEY_PREFIX + sessionId + ":logs", activity);
    }

    @Override
    public UserActivity getActivity(String sessionId) {
        UserActivity activity = (UserActivity) redisTemplate.opsForValue().get("session:" + sessionId + ":logs");
        if (activity == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No activity found for session ID");
        }
        return activity;
    }
}
