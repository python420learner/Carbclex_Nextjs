package com.carbclex.CarbClex.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carbclex.CarbClex.model.Project;
import com.carbclex.CarbClex.model.Project.VerificationStatus;
import com.carbclex.CarbClex.repository.ProjectRepository;

@Service
public class ProjectServiceImplement implements ProjectService{

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Project saveProject(Project project){
        return projectRepository.save(project);
    }

    @Override
    public List<Project> getAllProjects(){
        return projectRepository.findAll();
    }

     public List<Project> getVerifiedProjects() {
        return projectRepository.findByVerificationStatus(VerificationStatus.verified);
    }

    public List<Project> getNonVerifiedProjects() {
        return projectRepository.findByVerificationStatusNot(VerificationStatus.verified);
    }

    public Project getProjectById(Integer id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }


}
