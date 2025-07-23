package com.carbclex.CarbClex.service;
import java.util.List;


import com.carbclex.CarbClex.model.Project;

public interface ProjectService {
    public Project saveProject(Project project);
    public List<Project> getAllProjects();
    public List<Project> getVerifiedProjects();

    public List<Project> getNonVerifiedProjects();
    public Project getProjectById(Integer id); 
    public List<Project> getUserProjects(String userId);
    public void deleteProjectById(Integer id);


}
