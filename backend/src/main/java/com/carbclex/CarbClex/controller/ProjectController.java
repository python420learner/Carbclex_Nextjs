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
import com.carbclex.CarbClex.service.ProjectService;

@RestController
@RequestMapping("/carbclex")

public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
//    public ResponseEntity<Map<String, String>> add(@RequestBody Project project) {
//     System.out.println("Project Received");
//     projectService.saveProject(project);

//     Map<String, String> response = new HashMap<>();
//     response.put("message", "New Project is added");

//     return ResponseEntity.ok(response);
// }

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
