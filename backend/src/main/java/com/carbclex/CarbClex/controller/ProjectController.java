package com.carbclex.CarbClex.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
    @PostMapping("/add")
    public String add(@RequestBody Project project){
        projectService.saveProject(project);
        return "New Project is added";
    }
    
    // @CrossOrigin(origins = "http://localhost:3000") // Allow requests from React's dev server
    @GetMapping("/getAll")
    public List<Project> getAllProjects(){
        return projectService.getAllProjects();
    }

}
