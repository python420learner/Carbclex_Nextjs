package com.carbclex.CarbClex.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.carbclex.CarbClex.model.UserMaster;
import com.carbclex.CarbClex.repository.UserMasterRepository;

@Service
public class RoleService {

    private final UserMasterRepository userRepository;

    @Autowired
    public RoleService(UserMasterRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void updateUserRole(String userId, UserMaster.Role newRole) {
        UserMaster user = userRepository.findByUid(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRoleUpdateToken(1);
        userRepository.saveAndFlush(user); // <-- FORCES INSERT/UPDATE TO DATABASE
        
        user.setRole(newRole);
        userRepository.saveAndFlush(user); // <-- TRIGGER SEES TOKEN = 1, role allowed  

        user.setRoleUpdateToken(0);
        userRepository.saveAndFlush(user);

    }
}
