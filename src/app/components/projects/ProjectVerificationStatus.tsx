"use client"
import { use, useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, FileText, MessageSquare, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../firebase'
import { useRouter } from 'next/navigation';

interface VerificationProject {
  id: string;
  name: string;
  type: string;
  submittedDate: string;
  expectedCompletionDate: string;
  currentStage: 'Submitted' | 'Document Review' | 'Technical Verification' | 'Final Review' | 'Approved' | 'Rejected';
  verificationSteps: VerificationStep[];
  adminFeedback: AdminFeedback[];
  documentsStatus: DocumentStatus[];
  priority: 'High' | 'Medium' | 'Low';
}

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  completedDate?: string;
  estimatedDays: number;
}

// interface AdminFeedback {
//   id: string;
//   date: string;
//   type: 'info' | 'warning' | 'error' | 'success';
//   title: string;
//   message: string;
//   actionRequired: boolean;
//   response?: string;
//   responseDate?: string;
// }

interface AdminFeedback {
  id: number;
  projectId: number;
  adminMessage: string;
  actionRequired: boolean;
  responded: boolean;
  createdAt: string;
  title: string;
}

interface DocumentStatus {
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision-required';
  feedback?: string;
  uploadedDate: string;
}

export function ProjectVerificationStatus({onRespond}) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(
    projects.length > 0 ? projects[0] : null
  );

  const [xProject, setXproject] = useState([]);

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const auth = getAuth(app);
  const router = useRouter();
  const [status, setStatus] = useState('');
  const statusMap = {
    // draft: ["Draft", "Project is in Draft"],
    submitted: ["Submitted for Review", "Description for status"],
    reviewing: ["Under Preliminary Reviewing", "Description for status"],
    expert_validation: ["Expert Validation / Compliance Review", "Description for status"],
    verified: ["Verified", "Description for status"]
  };
  const statusKeys = Object.keys(statusMap);
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
  const [projectMedia, setProjectMedia] = useState([]);

  const fetchFeedbacks = async (projectId: number) => {
    if (xProject) {
      try {
        const res = await fetch(`/api/admin-feedback/project/${projectId}`);
        if (!res.ok) throw new Error("Failed to fetch feedbacks");

        const data = await res.json();
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchMedia = async (projectId: number) => {
    if (xProject) {
      setLoading(true);
      try {
        // Fetch media
        const mediaRes = await fetch(`/api/media/project/${projectId}`);
        if (!mediaRes.ok) throw new Error("Failed to fetch media");
        const mediaData = await mediaRes.json();
        setProjectMedia(mediaData);

      } catch (error) {
        console.error("Error fetching feedbacks or media:", error);
      } finally {
        setLoading(false);
      }
    }
  };


  const fetchUserProjects = async (uid) => {
    try {
      const response = await fetch(`/api/projects/user/${uid}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
      setXproject(data[0])
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

  const getStageProgress = (project) => {
    if (project.verificationStatus == 'failed') {
      return 0;
    }
    const currentStatusIndex = statusKeys.indexOf(project.verificationStatus) + 1
    const totalSteps = 4;
    // const completedSteps = project.verificationSteps.filter(step => step.status === 'completed').length;
    return (currentStatusIndex / totalSteps) * 100;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'submitter': 'bg-blue-100 text-blue-800',
      'reviewing': 'bg-yellow-100 text-yellow-800',
      'verified': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'expert_validation': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColorforDocuments = (status: string) => {
    const colors = {
      'PENDING': 'bg-gray-100 text-gray-800',
      'VERIFIED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // const getFeedbackIcon = (type: AdminFeedback['type']) => {
  //   switch (type) {
  //     case 'error':
  //       return <XCircle className="h-4 w-4 text-red-500" />;
  //     case 'warning':
  //       return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  //     case 'success':
  //       return <CheckCircle className="h-4 w-4 text-green-500" />;
  //     default:
  //       return <MessageSquare className="h-4 w-4 text-blue-500" />;
  //   }
  // };

  const getDaysRemaining = (expectedDate: string) => {
    const today = new Date();
    const expected = new Date(expectedDate);
    const diffTime = expected.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };


  // if (projectMedia.length > 0) {
  //   projectMedia.flatMap((media) => {
  //     media.images.map((image) => {

  //       console.log(image.url)
  //     })
  //   })
  // }
  if(feedbacks.length > 0) {
    feedbacks.forEach((feedback) => {
      console.log(feedback.adminMessage);
    });
  }


  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Verification</CardTitle>
            <Clock className="h-4 w-4 text-(--muted-foreground)" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => !['Approved', 'Rejected'].includes(p.currentStage)).length}
            </div>
            <p className="text-xs text-(--muted-foreground)">
              Active verifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.currentStage === 'Approved').length}
            </div>
            <p className="text-xs text-(--muted-foreground)">
              Successfully verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {projects.filter(p => p.currentStage === 'Rejected').length}
            </div>
            <p className="text-xs text-(--muted-foreground)">
              Require revision
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing</CardTitle>
            <Calendar className="h-4 w-4 text-(--muted-foreground)" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-(--muted-foreground)">
              Days average
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Projects in Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {projects?.map((project) => statusKeys.includes(project.verificationStatus) ? (
              <div
                key={project.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${xProject['id'] === project['id']
                  ? 'border-(--primary) bg-(--primary)/5'
                  : 'border-(--border) hover:bg-(--muted)/50'
                  }`}
                onClick={() => {
                  setXproject(project);
                  setStatus(project.verificationStatus);
                  fetchFeedbacks(project.id);
                  fetchMedia(project.projectid);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">{project.projectName}</h4>
                    <p className="text-xs text-(--muted-foreground)">{project.id}</p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(project.verificationStatus.toLowerCase().replace(' ', '-'))}`}
                    >
                      {project.verificationStatus === 'failed' ? 'Failed' : statusMap[project.verificationStatus][0]}
                    </Badge>
                  </div>
                  <Badge
                    variant={project.priority === 'High' ? 'destructive' :
                      project.priority === 'Medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {project.priority}
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-(--muted-foreground)">
                    <span>Progress</span>
                    <span>{Math.round(getStageProgress(project))}%</span>
                  </div>
                  <Progress value={getStageProgress(project)} className="h-1 mt-1" />
                </div>
                <div className="mt-2 text-xs text-(--muted-foreground)">
                  Expected: {new Date(project.expectedCompletionDate).toLocaleDateString()}
                  <span className={`ml-2 ${getDaysRemaining(project.expectedCompletionDate) < 0 ? 'text-red-600' : ''}`}>
                    ({getDaysRemaining(project.expectedCompletionDate)} days)
                  </span>
                </div>
              </div>
            ) : null)}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {xProject ? xProject['projectName'] : 'Select a project'}
            </CardTitle>
            {xProject && (
              <div className="flex items-center space-x-4 text-sm text-(--muted-foreground)">
                <span>ID: {xProject['id']}</span>
                <span>Type: {xProject['projectType']}</span>
                <span>Submitted: {new Date(xProject['submittedDate']).toLocaleDateString()}</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {xProject ? (
              <Tabs defaultValue="progress" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="progress">Verification Progress</TabsTrigger>
                  <TabsTrigger value="feedback">Admin Feedback</TabsTrigger>
                  <TabsTrigger value="documents">Document Status</TabsTrigger>
                </TabsList>

                <TabsContent value="progress" className="space-y-4">
                  <div className="space-y-4 my-5">
                    {statusKeys.map((key, index) => {
                      const currentStatusIndex = statusKeys.indexOf(status)
                      const isCompleted = statusKeys.indexOf(status) >= index;
                      const isActive = status === key;
                      return (
                        <div
                          key={key}
                          className="flex items-start space-x-3"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {statusKeys.indexOf(key) <= currentStatusIndex ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (currentStatusIndex < statusKeys.indexOf(key) && status != 'failed') ? (
                              <Clock className="h-5 w-5 text-blue-600" />
                            ) : status === 'failed' ? (
                              <XCircle className="h-5 w-5 text-red-600" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/20" />
                            )}
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{statusMap[key][0]}</h4>
                              <Badge className={getStatusColor(key)}>
                                {statusMap[key][0]}
                              </Badge>
                            </div>
                            <p className="text-sm text-(--muted-foreground)">{statusMap[key][1]}</p>
                            {/* <div className="text-xs text-(--muted-foreground)">
                              {step.completedDate ? (
                                `Completed: ${new Date(step.completedDate).toLocaleDateString()}`
                              ) : (
                                `Estimated: ${step.estimatedDays} days`
                              )}
                            </div> */}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="feedback" className="space-y-4">
                  <div className="space-y-4">

                    {feedbacks.length > 0 ?
                      feedbacks.map((feedback) => (
                        <Alert key={feedback.id}>
                          <div className="flex items-start space-x-3">
                            {/* {getFeedbackIcon(feedback.type)} */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{feedback.title}</h4>
                                <span className="ml-5 text-xs text-(--muted-foreground)">
                                  {new Date(feedback.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <AlertDescription>{feedback.adminMessage}</AlertDescription>
                              {feedback.responded && (
                                <div className="flex items-center space-x-2">
                                  {feedback.actionRequired && <Badge variant="outline" className="text-xs">
                                    Action Required
                                  </Badge>}
                                  {feedback.responded && <Button size="sm" variant="outline" onClick={() => onRespond(feedback.id)}>
                                    {/* onclick will handle the repond in the project management section we will send the project.id from here */}
                                    Respond
                                  </Button>}
                                </div>
                              )}
                            </div>
                          </div>
                        </Alert>
                      )) :
                      <div>
                        <h3>No Feedback from the Admin</h3>
                      </div>
                    }
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="space-y-3">

                    {projectMedia.length > 0 ? (
                      projectMedia.flatMap(media => {
                        // Map images
                        const imageElements = media.images.map((image, index) => (
                          <div key={`image-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <h4 className="font-medium text-sm">{image.title}</h4>
                                <p className="text-xs text-muted-foreground">
                                  Uploaded: {new Date(image.uploadedAt).toLocaleDateString()}
                                </p>
                                {image.feedback && (
                                  <p className="text-xs text-red-600 mt-1">{image.feedback}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColorforDocuments(image.verificationStatus)}>
                                {image.verificationStatus}
                              </Badge>
                              {image.verificationStatus === 'FAILED' && (
                                <Button size="sm" variant="outline">
                                  Upload New Version
                                </Button>
                              )}
                            </div>
                          </div>
                        ));

                        // Map documents
                        const documentElements = media.documents.map((document, index) => (
                          <div key={`document-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <h4 className="font-medium text-sm">{document.title}</h4>
                                <p className="text-xs text-muted-foreground">
                                  Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
                                </p>
                                {document.feedback && (
                                  <p className="text-xs text-red-600 mt-1">{document.feedback}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColorforDocuments(document.verificationStatus)}>
                                {document.verificationStatus}
                              </Badge>
                              {document.verificationStatus === 'FAILED' && (
                                <Button size="sm" variant="outline">
                                  Upload New Version
                                </Button>
                              )}
                            </div>
                          </div>
                        ));

                        // Combine and return all elements for this media
                        return [...imageElements, ...documentElements];
                      })
                    ) : (
                      <div>
                        <h3>No Media files attached</h3>
                      </div>
                    )}


                    {/* {selectedProject.documentsStatus.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-(--muted-foreground)" />
                          <div>
                            <h4 className="font-medium text-sm">{doc.name}</h4>
                            <p className="text-xs text-(--muted-foreground)">
                              Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}
                            </p>
                            {doc.feedback && (
                              <p className="text-xs text-red-600 mt-1">{doc.feedback}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status.replace('-', ' ')}
                          </Badge>
                          {doc.status === 'revision-required' && (
                            <Button size="sm" variant="outline">
                              Upload New Version
                            </Button>
                          )}
                        </div>
                      </div>
                    ))} */}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-(--muted-foreground)">
                <FileText className="mx-auto h-12 w-12 mb-4" />
                <p>Select a project to view verification details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}