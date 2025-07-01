package com.carbclex.CarbClex.service;
import java.util.List;

import com.carbclex.CarbClex.model.Project;

public interface ProjectService {
    public Project saveProject(Project project);
    public List<Project> getAllProjects();
    public List<Project> getVerifiedProjects();

    public List<Project> getNonVerifiedProjects();

}
