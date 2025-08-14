"use client"
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MyProjects } from './projects/MyProjects';
import { ProjectVerificationStatus } from './projects/ProjectVerificationStatus';
import { NewProjectRegistration } from './projects/NewProjectRegistration';

export function ManageProject({ pendingProjectId, tabNeedsActive }) {
  const [activeTab, setActiveTab] = useState('my-projects');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [actionRequired, setActionRequired] = useState(null);


  const handleEditProject = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveTab("new-registration");
  }

  const handleProjectSubmit = () => {
    setActiveTab('my-projects');
    setSelectedProjectId(null);
  };  

  const handleRespondToFeedback = async (feedbackId) => {
    if (feedbackId) {
      try {
        const res = await fetch(`/api/admin-feedback/${feedbackId}`);
        if (!res.ok) throw new Error("Failed to fetch feedback");

        const data = await res.json();
        setFeedback(data);
        setSelectedProjectId(data.projectId);
        setActiveTab("new-registration");
        setActionRequired(data.actionRequired);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    }
  }

  const handleCreateNewProject = () => {
    setSelectedProjectId(null);
    setActiveTab("new-registration");
  }

  useEffect(() => {
    if (pendingProjectId) {
      setSelectedProjectId(pendingProjectId);
      setActiveTab("new-registration");
    }
    if(tabNeedsActive){
      setActiveTab(tabNeedsActive)
    }
  }, [pendingProjectId]);
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="text-muted-foreground">
            Register, track, and manage your carbon offset projects from initiation to credit issuance.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="verification-status">Verification Status</TabsTrigger>
          <TabsTrigger value="new-registration">New Registration</TabsTrigger>
        </TabsList>

        <TabsContent value="my-projects" className="space-y-6">
          <MyProjects onEditProject={handleEditProject} createNewProject={handleCreateNewProject} />
        </TabsContent>

        <TabsContent value="verification-status" className="space-y-6">
          <ProjectVerificationStatus onRespond={handleRespondToFeedback} />
        </TabsContent>

        <TabsContent value="new-registration" className="space-y-6">
          <NewProjectRegistration projectId={selectedProjectId} onProjectSubmit={handleProjectSubmit} requiredAction={actionRequired} />
        </TabsContent>
      </Tabs>
    </div>
  );
}   