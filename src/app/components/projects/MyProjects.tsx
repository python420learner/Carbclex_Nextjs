"use client"
import { useEffect, useState } from 'react';
import { Plus, Filter, Eye, Edit, Trash2, Calendar, MapPin, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../firebase'
import { useRouter } from 'next/navigation';
import { NewProjectRegistration } from './NewProjectRegistration';
// import { X } from "lucide-react";
// import { cn } from "../ui/utils";


export function MyProjects({ onEditProject, createNewProject }) {
  const [projects, setProjects] = useState([]);
  // const [filteredProjects, setFilteredProjects] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [filter_verificationStatus, setFilter_verificationStatus] = useState("all");
  const [filter_projectType, setFilter_projectType] = useState("all");
  const auth = getAuth(app);
  const router = useRouter();

  // Function to fetch projects by user ID
  const fetchUserProjects = async (uid) => {
    try {
      const response = await fetch(`/api/projects/user/${uid}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    // Check session and fetch user data
    const checkSessionAndFetchUser = async () => {
      try {
        // 1. Check backend session
        const sessionRes = await fetch('/api/auth/check-session', {
          credentials: 'include',
        });

        if (!sessionRes.ok) {
          throw new Error('Session invalid');
        }

        // 2. Get Firebase user
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            setUserId(user.uid); // Store Firebase UID in state

            // 3. Fetch projects for this user
            await fetchUserProjects(user.uid);
          } else {
            router.push('/login');
          }
        });

      } catch (error) {
        console.error('Session check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndFetchUser();
    // fetchUserProjects()  

    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [router, auth]);

  if (projects) {
    console.log(projects)
  }

  const filteredProjects = projects.filter(project => {
    // Filter by searchTerm (name or location)
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesName = project.projectName?.toLowerCase().includes(lowerSearch);
      const matchesLocation = project.locationDetails?.toLowerCase().includes(lowerSearch); // or region, or address field
      if (!matchesName && !matchesLocation) return false;
    }

    // Filter by verification status
    if (filter_verificationStatus !== 'all' && project.verificationStatus !== filter_verificationStatus)
      return false;

    // Filter by project type
    if (filter_projectType !== 'all' && project.projectType !== filter_projectType)
      return false;

    return true; // Passed all filters
  });



  const getStatusColor = (status) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'submitter': 'bg-blue-100 text-blue-800',
      'reviewing': 'bg-yellow-100 text-yellow-800',
      'verified': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'expert_validation': 'bg-purple-100 text-purple-800'
    };
    return colors[status];
  };

  const canEdit = (status) => {
    return status === 'draft' || status === 'failed';
  };

  const canDelete = (status) => {
    return status === 'draft' || status === 'failed';
  };

  const handleDeleteProject = async (id) => {
    try {
      const response = await fetch(`/api/project/deleteProject/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Project deleted successfully');
        await fetchUserProjects(userId)
        // Optionally: refresh project list or remove from UI
      } else {
        const errorText = await response.text();
        console.error('Failed to delete project:', errorText);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const totalCredits = filteredProjects.reduce((sum, project) => sum + project.creditUnits, 0);
  const activeProjects = filteredProjects.filter(p => ['verified'].includes(p.verificationStatus)).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeProjects} active projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits Issued</CardTitle>
            <Badge variant="outline" className="text-xs">CO₂</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Tonnes CO₂ equivalent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Under Review</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredProjects.filter(p => p.status === 'Under Review' || p.status === 'Submitted').length}
            </div>
            <p className="text-xs text-muted-foreground">
              In verification process
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions Required</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {filteredProjects.filter(p => p.verificationStatus === 'failed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Projects need revision
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Project List</span>
            <Button onClick={createNewProject}>
              <Plus className="mr-2 h-4 w-4" />
              Register New Project
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search projects by name or location..."
                value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}

              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Verification Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
              <select
                onChange={(e) => setFilter_verificationStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted for review</option>
                <option value="reviewing">Under Preliminary Review</option>
                <option value="expert_validation">Expert Validation</option>
                <option value="verified">Verified</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Project Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <select
                onChange={(e) => setFilter_projectType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Carbon_capture">Carbon Capture</option>
                <option value="Renewable">Renewable</option>
                <option value="Reforestation">Reforestation</option>
                <option value="Energy_efficiency">Energy Efficiency</option>
              </select>
            </div>
          </div>

          {/* Projects Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Details</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Credits Issued</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects && filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project['projectName']}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {project.id}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                        </div>
                        {project['methodology'] && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Methodology: {project['methodology']}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{project['projectType']}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project['verificationStatus'])}>
                        {project['verificationStatus']}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {project.creditUnits > 0 ? project.creditUnits.toLocaleString() : '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {project['carbonCreditsIssued'] > 0 ? 'tCO₂e issued' :
                          project['carbonCreditsIssued'] ? `${project['carbonCreditsIssued'].toLocaleString()} tCO₂e estimated` : 'Pending'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{project['locationDetails']}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProject(project)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Project Details - {selectedProject?.projectName}</DialogTitle>
                            </DialogHeader>
                            {selectedProject && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-(--foreground)">Project ID</label>
                                    <p>{selectedProject.id}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-(--foreground)">Type</label>
                                    <p>{selectedProject.type}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-(--foreground)">Status</label>
                                    <Badge className={getStatusColor(selectedProject.verificationStatus)}>
                                      {selectedProject.verificationStatus}
                                    </Badge>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-(--foreground)">Credits Issued</label>
                                    <p>{selectedProject.creditUnits > 0 ? `${selectedProject.creditUnits.toLocaleString()} tCO₂e` : 'Pending'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-(--foreground)">Location</label>
                                    <p>{selectedProject.locationDetails}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-(--foreground)">Duration</label>
                                    <p>{new Date(selectedProject.startDate).toLocaleDateString()} - {new Date(selectedProject.endDate).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-(--foreground)">Methodology</label>
                                    <p>{selectedProject.methodology || 'Not specified'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-(--foreground)">Created Date</label>
                                    <p>{new Date(selectedProject.startDate).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                {selectedProject.adminRemarks && (
                                  <div>
                                    <label className="text-sm font-medium text-muted-(--foreground)">Admin Remarks</label>
                                    <div className="mt-1 p-3 bg-muted rounded-md">
                                      <p className="text-sm">{selectedProject.adminRemarks}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {canEdit(project.verificationStatus) && (
                          <Button variant="outline" size="sm" onClick={() => onEditProject(project.id)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}

                        {canDelete(project.verificationStatus) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}

                        {project.adminRemarks && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="px-2">
                                <FileText className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-sm">{project.adminRemarks}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-muted-foreground">No projects found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Get started by registering your first project'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}