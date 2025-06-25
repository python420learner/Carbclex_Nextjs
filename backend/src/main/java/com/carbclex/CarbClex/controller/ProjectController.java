package com.carbclex.CarbClex.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.carbclex.CarbClex.model.Project;
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
    
    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @GetMapping("/getAll")
    public List<Project> getAllProjects(){
        return projectService.getAllProjects();
    }

}
