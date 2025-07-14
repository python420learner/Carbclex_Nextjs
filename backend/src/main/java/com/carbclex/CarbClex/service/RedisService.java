package com.carbclex.CarbClex.service;

import com.carbclex.CarbClex.model.UserActivity;

public interface RedisService {
    void saveActivity(String sessionId, UserActivity activity);
    UserActivity getActivity(String sessionId);
}
