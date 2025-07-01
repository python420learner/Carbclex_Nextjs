package com.carbclex.CarbClex.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.carbclex.CarbClex.model.Project;
import com.carbclex.CarbClex.model.Project.VerificationStatus;
import com.carbclex.CarbClex.repository.ProjectRepository;
import com.carbclex.CarbClex.service.ProjectService;

@RestController
@RequestMapping("/carbclex")

public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectRepository projectRepository;

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @GetMapping("/next-id")
    public ResponseEntity<Integer> getNextProjectId() {
        Integer maxId = projectRepository.findMaxProjectId();
        return ResponseEntity.ok(maxId != null ? maxId + 1 : 1);
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @PostMapping("/add")
    public ResponseEntity<Void> add(@RequestBody Project project) {
        System.out.println("Project Received");
        projectService.saveProject(project);
        return ResponseEntity.ok().build(); // No content in the body
    }

    // @CrossOrigin(origins = "http://localhost:3000") // Allow requests from
    // React's dev server
    // @GetMapping("/getAll")
    // public List<Project> getAllProjects(){
    // return projectService.getAllProjects();
    // }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @GetMapping("project/getVerifiedProjects")
    public ResponseEntity<List<Project>> getVerifiedProjects() {
        return ResponseEntity.ok(projectService.getVerifiedProjects());
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @GetMapping("project/getNonVerifiedProjects")
    public ResponseEntity<List<Project>> getNonVerifiedProjects() {
        return ResponseEntity.ok(projectService.getNonVerifiedProjects());
    }

    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @PutMapping("/verifyProject/{id}")
    public ResponseEntity<?> verifyProject(@PathVariable Integer id) {
    try {
        projectRepository.updateVerificationStatusById(id, VerificationStatus.verified);
        return ResponseEntity.ok("Project verified successfully");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Verification failed");
    }
}
}
