"use client"
import { act, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Upload, MapPin, Calendar, FileText, CheckCircle, Target, Leaf, Users, Map } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { MapSelector } from './MapSelector';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../firebase';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const projectTypes = {
  'Renewable': "Renewable",
  'Reforestation': 'Reforestation',
  'Energy Efficiency': 'Energy_efficiency',
  'Agriculture': 'Agriculture',
  'Carbon Capture': 'Carbon_capture'
};

const sdgOptions = [
  { id: '1', label: 'No Poverty', description: 'SDG 1' },
  { id: '2', label: 'Zero Hunger', description: 'SDG 2' },
  { id: '3', label: 'Good Health and Well-being', description: 'SDG 3' },
  { id: '6', label: 'Clean Water and Sanitation', description: 'SDG 6' },
  { id: '7', label: 'Affordable and Clean Energy', description: 'SDG 7' },
  { id: '8', label: 'Decent Work and Economic Growth', description: 'SDG 8' },
  { id: '13', label: 'Climate Action', description: 'SDG 13' },
  { id: '14', label: 'Life Below Water', description: 'SDG 14' },
  { id: '15', label: 'Life on Land', description: 'SDG 15' }
];

const registrationStatus = {
  1: 'projectInfo',
  2: 'methodology',
  3: 'impact',
  4: 'documents_uploaded',
  5: 'review'
};

const actions = {
  edit_project_info: [
    'latitude',
    'longitude',
    'startDate',
    'endDate',
    'projectArea'
  ],
  edit_methodology: [
    'baselineScenarioDescription',
    'methodology',
  ]
}

const actionEditableUploads = {
  edit_documents: ['designDocs', 'mrvReports', 'satelliteImagery', 'verificationDocs'],
  edit_project_info: [],
  edit_methodology: ['methodology_document'],
  // ...add as needed
};

export function NewProjectRegistration({ projectId, onProjectSubmit, requiredAction }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [userId, setUserId] = useState('');
  const [media, setMedia] = useState(null);
  const [actionRequired, setActionRequired] = useState(null);
  const [projectMedia, setProjectMedia] = useState([]);
  const editableFields = actionRequired ? actions[actionRequired] : [];

  const isUploadEditable = (category) =>
    actionRequired && actionEditableUploads[actionRequired]?.includes(category);

  const [files, setFiles] = useState({
    designDocs: [],
    mrvReports: [],
    satelliteImagery: [],
    verificationDocs: [],
    methodology_document: [],
  });
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    projectid: '',                  // existing
    userId: '',                    // existing
    projectName: '',               // existing
    projectType: '',               // ENUM: Renewable, Reforestation, etc.
    countryId: '',                 // Foreign key to CountryCodeMaster
    region: '',                   // existing
    locationDetails: '',          // existing, includes address + lat/lng separately
    startDate: '',                // existing - datetime string, e.g., 'YYYY-MM-DD'
    endDate: '',                  // existing - datetime string, e.g., 'YYYY-MM-DD'
    estimatedCarbonReduction: 0,  // existing
    actualCarbonReduction: 0,     // existing
    carbonCreditsIssued: 0,       // existing
    carbonCreditsAvailable: 0,    // existing
    projectDescription: '',       // existing
    verificationStatus: 'draft',  // default as per DB
    verifierId: '',               // existing (commented out previously)
    projectDocumentURL: '',       // existing (URL as string)
    projectImagesURL: '',         // existing (URL as string)
    projectVideosURL: '',         // existing (URL as string)
    methodology: '',              // existing (longtext)
    baselineScenarioDescription: '',      // varchar(1000)
    methodologyDocumentUrl: '',           // varchar(500)
    co2offset: 0,                        // decimal(12,2)
    sdgAlignment: [],                    // array of strings for SDGs (e.g., ['SDG1', 'SDG2'])
    coBenefits: '',                      // varchar(1000)
    registrationStatus: 'projectInfo',  // enum default value
    projectArea: 0,                     // decimal(12,2)
    latitude: '',                       // decimal(9,6) stored as string from form input
    longitude: '',                      // decimal(9,6) stored as string from form input
  });

  const fetchMedia = async (projectId: number) => {
    if (projectId) {
      try {
        // Fetch media
        const mediaRes = await fetch(`/api/media/project/${projectId}`);
        if (!mediaRes.ok) throw new Error("Failed to fetch media");
        const mediaData = await mediaRes.json();
        setProjectMedia(mediaData);

      } catch (error) {
        console.error("Error fetching feedbacks or media:", error);
      } finally {
      }
    }
  };


  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ User is signed in:', user.uid);
        setUserId(user.uid);
      } else {
        alert('You must be logged in to submit a project.');
      }

    });
    if (projectId) {
      console.log("this is the received project.id", projectId)
      // ✅ Fetch project from backend
      fetch(`/api/projects/${projectId}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch project");
          return res.json();
        })
        .then(data => {
          setProject(data);
          console.log("🎯 Project data:", data);
          setFormData({
            ...formData,
            id: data.id,
            projectid: data.projectid,
            userId: data.userId,
            projectName: data.projectName,
            projectType: data.projectType,
            countryId: data.countryId.countryId, // assuming countryId is an object with countryId property
            region: data.region,
            locationDetails: data.locationDetails,
            startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
            endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
            estimatedCarbonReduction: data.estimatedCarbonReduction || 0,
            actualCarbonReduction: data.actualCarbonReduction || 0,
            carbonCreditsIssued: data.carbonCreditsIssued || 0,
            carbonCreditsAvailable: data.carbonCreditsAvailable || 0,
            projectDescription: data.projectDescription,
            verificationStatus: data.verificationStatus || 'draft',
            verifierId: data.verifierId ? data.verifierId.id : '', // assuming verifierId is an object with id property
            projectDocumentURL: data.projectDocumentURL || '',
            projectImagesURL: data.projectImagesURL || '',
            projectVideosURL: data.projectVideosURL || '',
            methodology: data.methodology,
            baselineScenarioDescription: data.baselineScenarioDescription,
            methodologyDocumentUrl: data.methodologyDocumentUrl,
            co2offset: data.co2Offset,
            sdgAlignment: Array.isArray(data.sdgAlignment) ? data.sdgAlignment : [],
            coBenefits: data.coBenefits,
            registrationStatus: data.registrationStatus,
            projectArea: data.projectArea || 0,
            latitude: (data.latitude !== null && !isNaN(data.latitude)) ? String(data.latitude) : '',
            longitude: (data.longitude !== null && !isNaN(data.longitude)) ? String(data.longitude) : '',
          });
          setCurrentStep(data.registrationStatus === 'projectInfo' ? 1 : data.registrationStatus === 'methodology' ? 2 : data.registrationStatus === 'impact' ? 3 : data.registrationStatus === 'documents_uploaded' ? 4 : 5);
          fetchMedia(data.projectid)

          if (requiredAction) {
            setActionRequired(requiredAction)
          }
        })
        .catch(err => console.error("Error fetching project:", err));
    }
    return () => unsubscribe(); // cleanup listener
  }, [projectId, requiredAction]);


  console.log('formdata', formData)

  const totalSteps = 5;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));
  };

  const toggleSDG = (sdgId: string) => {
    setFormData(prev => ({
      ...prev,
      sdgAlignment: prev.sdgAlignment.includes(sdgId)
        ? prev.sdgAlignment.filter(id => id !== sdgId)
        : [...prev.sdgAlignment, sdgId]
    }));
  };

  const handleFileChange = (category, e) => {
    setFiles((prev) => ({
      ...prev,
      [category]: Array.from(e.target.files),
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      formData.registrationStatus = registrationStatus[currentStep + 1];
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      formData.registrationStatus = registrationStatus[currentStep];
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <FileText className="h-4 w-4" />;
      case 2: return <Target className="h-4 w-4" />;
      case 3: return <Leaf className="h-4 w-4" />;
      case 4: return <Upload className="h-4 w-4" />;
      case 5: return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.projectName && formData.projectDescription && formData.projectType &&
          formData.locationDetails && formData.startDate && formData.endDate;
      case 2:
        return formData.baselineScenarioDescription;
      case 3:
        return formData.co2offset && formData.coBenefits;
      case 4:
        return Object.values(files).some(category => category.length > 0); // Documents are optional in this step
      default:
        return true;
    }
  };

  const getNextProjectId = async () => {
    const res = await fetch('/api/next-id');
    if (!res.ok) throw new Error('Failed to get next project ID');
    return await res.json();
  };

  const handleNext = async (e) => {
    e.preventDefault(); // prevent default form submit/reload
    nextStep();

    try {
      // Fetch next project ID from backend
      const nextId = await getNextProjectId();
      // setProjectId(nextId);

      // Prepare payload matching your updated backend Project model
      const payload = {
        id: formData.id ? Number(formData.id) : undefined,  // Optional, if editing existing project
        projectid: formData.projectid ? Number(formData.projectid) : Number(nextId),
        userId: userId,
        projectName: formData.projectName,
        projectType: formData.projectType,             // ENUM value as string
        countryId: { countryId: Number(formData.countryId) }, // nested object
        region: formData.region,
        locationDetails: formData.locationDetails,
        latitude: formData.latitude !== '' ? parseFloat(formData.latitude) : null,   // Convert to float or null
        longitude: formData.longitude !== '' ? parseFloat(formData.longitude) : null,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        estimatedCarbonReduction: formData.estimatedCarbonReduction,
        actualCarbonReduction: formData.actualCarbonReduction,
        carbonCreditsIssued: Number(formData.carbonCreditsIssued),
        carbonCreditsAvailable: Number(formData.carbonCreditsAvailable),
        projectDescription: formData.projectDescription,
        methodology: formData.methodology,
        baselineScenarioDescription: formData.baselineScenarioDescription,
        methodologyDocumentUrl: formData.methodologyDocumentUrl,
        co2Offset: formData.co2offset,
        sdgAlignment: formData.sdgAlignment.length > 0 ? formData.sdgAlignment : [],
        coBenefits: formData.coBenefits,
        registrationStatus: formData.registrationStatus || 'projectInfo',     // Default value
        projectArea: formData.projectArea,
        verificationStatus: formData.verificationStatus || 'draft',            // Default value
        verifierId: formData.verifierId ? { id: Number(formData.verifierId) } : null,
        projectDocumentURL: formData.projectDocumentURL,
        projectImagesURL: formData.projectImagesURL,
        projectVideosURL: formData.projectVideosURL,
      };

      // Send data to backend
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Success: Project added');
        const savedProject = await response.json();
        setProject(savedProject);
        setFormData(prevFormData => ({
          ...prevFormData,
          id: savedProject.id,
          projectid: savedProject.projectid,
        }));
        const hasFiles = Object.values(files).some(category => category.length > 0);
        if (currentStep === 4 || hasFiles) {
          // Await handleUpdateProject call, passing event if needed or refactor to no-arg
          await handleUpdateProject(e);
          // nextStep();
        } else if (currentStep === 5) {
          console.log(formData.registrationStatus)
          await handleSubmit();
          // nextStep();
        } else {
          // Proceed to next step if no files to upload
          nextStep();
        }
      } else {
        alert('Something went wrong');
        console.error('Error: Server responded with status', response.status);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit project');
    }
  };

  const handleUpdateProject = async (event) => {
    event.preventDefault();

    try {
      const hasFiles = Object.values(files).some(category => category.length > 0);
      if (!hasFiles) {
        alert('Please select at least one file to upload');
        return;
      }

      const newFormData = new FormData();

      Object.entries(files).forEach(([category, fileList]) => {
        fileList.forEach((file, index) => {
          const ext = file.name.split('.').pop();
          const newName = `${category}_${index + 1}.${ext}`;
          const renamedFile = new File([file], newName, { type: file.type });

          // Append to form data under the SAME key 'files'
          newFormData.append('files', renamedFile);
        });
      });

      // Upload media files
      const mediaUploadRes = await fetch(
        `/api/media/upload?userId=${userId}&projectId=${project.projectid}`,
        {
          method: 'POST',
          body: newFormData,
        }
      );

      if (!mediaUploadRes.ok) {
        throw new Error(`Upload failed: ${mediaUploadRes.statusText}`);
      }
      const mediaData = await mediaUploadRes.json();
      setMedia(mediaData)
      nextStep();
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`/api/updateVerificationStatus/${project.id}`, {
        status: 'submitted'
      });
      onProjectSubmit();
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Failed to update status.");
    } finally {
    }
  }

  // if (project) {
  //   console.log(project);
  // }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.projectName}
                  onChange={(e) => updateFormData('projectName', e.target.value)}
                  placeholder="Enter a descriptive project title"
                  readOnly={actionRequired}
                />
              </div>

              <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={formData.projectDescription}
                  onChange={(e) => updateFormData('projectDescription', e.target.value)}
                  placeholder="Provide a detailed description of your carbon offset project"
                  rows={4}
                  readOnly={actionRequired}
                />
              </div>

              <div>
                <Label htmlFor="type">Project Type *</Label>
                <Select value={formData.projectType} onValueChange={(value) => updateFormData('projectType', value)} disabled={actionRequired}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(projectTypes).map(([key, value]) => (
                      <SelectItem key={value} value={value}>{key}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium">
                <MapPin className="h-4 w-4" />
                Project Location *
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label>Country Id</Label>
                  <Input
                    type="number"
                    name="countryId"
                    value={formData.countryId}
                    placeholder="Country ID"
                    className="w-full p-2 border mb-3"
                    onChange={(e) => updateFormData('countryId', e.target.value)}
                    readOnly={actionRequired}
                  />

                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.locationDetails}
                    onChange={(e) => updateFormData('locationDetails', e.target.value)}
                    placeholder="Full project address"
                    readOnly={actionRequired}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4" />
                    Project Location
                  </h5>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMapOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Map className="h-4 w-4" />
                    Select on Map
                  </Button>
                </div>

                {/* Show selected location info if available */}
                {(formData.latitude && formData.longitude) && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-green-700">
                        Location selected: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
                      </div>
                      {formData.locationDetails && (
                        <div className="text-xs text-green-600 mt-1">{formData.locationDetails}</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      value={formData.latitude}
                      onChange={(e) => updateFormData('latitude', e.target.value)}
                      placeholder="e.g., 28.6139"
                      type="number"
                      step="any"
                      readOnly={actionRequired && !editableFields.includes('latitude')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      value={formData.longitude}
                      onChange={(e) => updateFormData('longitude', e.target.value)}
                      placeholder="e.g., 77.2090"
                      type="number"
                      step="any"
                      readOnly={actionRequired && !editableFields.includes('longitude')}
                    />
                  </div>
                </div>
                <p className="text-xs text-(--muted-foreground)">
                  Use the "Select on Map" button above for interactive selection, or enter coordinates manually. Use decimal degrees format.
                </p>
              </div>

              <div>
                <Label htmlFor="area">Project Area (hectares)</Label>
                <Input
                  id="area"
                  value={formData.projectArea}
                  onChange={(e) => updateFormData('projectArea', e.target.value)}
                  placeholder="Total area covered"
                  type="number"
                  step="any"
                  readOnly={actionRequired && !editableFields.includes('projectArea')}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium">
                <Calendar className="h-4 w-4" />
                Project Timeline *
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                    readOnly={actionRequired && !editableFields.includes('startDate')}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData('endDate', e.target.value)}
                    readOnly={actionRequired && !editableFields.includes('endDate')}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="baseline">Baseline Scenario Description *</Label>
              <Textarea
                id="baseline"
                value={formData.baselineScenarioDescription}
                onChange={(e) => updateFormData('baselineScenarioDescription', e.target.value)}
                placeholder="Describe the current state/scenario without the project intervention"
                rows={6}
                readOnly={actionRequired && !editableFields.includes('baselineScenarioDescription')}
              />
              <p className="text-sm text-(--muted-foreground) mt-2">
                Include details about current land use, emissions, and expected scenario without project implementation.
              </p>
            </div>
            <div>
              <Label htmlFor="baseline">Methodology *</Label>
              <Textarea
                id="baseline"
                value={formData.methodology}
                onChange={(e) => updateFormData('methodology', e.target.value)}
                placeholder="Project Methodology and approach"
                rows={6}
                readOnly={actionRequired && !editableFields.includes('methodology')}
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="methodology" className={actionRequired && isUploadEditable("methodology_documents") ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}>Methodology Document (Optional)</Label>
              <div className="mt-2 p-4 border-2 border-dashed border-(--muted-foreground)/25 rounded-lg">
                <input
                  type="file"
                  id="methodology"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('methodology_document', e)}
                  disabled={actionRequired && !isUploadEditable('methodology_document')}
                  className="hidden"
                />
                <label htmlFor="methodology" className="cursor-pointer">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-(--muted-foreground) mb-2" />
                    {files.methodology_document.length > 0 ? <p className='text-green-500'>Uploaded Methodology Document</p> : <p className="text-sm font-medium">Upload Methodology Document</p>}
                    <p className="text-xs text-(--muted-foreground)">PDF, DOC up to 10MB</p>
                  </div>
                </label>
              </div>
            </div>

            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                The baseline scenario is crucial for calculating the additionality of your project.
                Be specific about what would happen without your intervention.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="offset">Expected CO₂ Offset (tonnes/year) *</Label>
              <Input
                id="offset"
                type="number"
                value={formData.co2offset}
                onChange={(e) => updateFormData('co2offset', e.target.value)}
                placeholder="Annual carbon offset in tonnes"
                readOnly={actionRequired}
              />
            </div>

            <Separator />

            <div>
              <Label>SDG Alignment</Label>
              <p className="text-sm text-(--muted-foreground) mb-4">
                Select the Sustainable Development Goals your project contributes to:
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {sdgOptions.map((sdg) => (
                  <div key={sdg.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sdg-${sdg.id}`}
                      checked={formData.sdgAlignment.includes(sdg.id)}
                      onCheckedChange={() => toggleSDG(sdg.id)}
                      disabled={actionRequired}
                    />
                    <Label htmlFor={`sdg-${sdg.id}`} className="text-sm">
                      <span className="font-medium">{sdg.description}:</span> {sdg.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="benefits">Community/Environmental Co-benefits *</Label>
              <Textarea
                id="benefits"
                value={formData.coBenefits}
                onChange={(e) => updateFormData('coBenefits', e.target.value)}
                placeholder="Describe additional benefits beyond carbon sequestration"
                rows={4}
                readOnly={actionRequired}
              />
              <p className="text-sm text-(--muted-foreground) mt-2">
                Include social, economic, and environmental co-benefits for local communities.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription>
                Upload all relevant documents for your project. All documents should be in PDF format and clearly labeled.
              </AlertDescription>
            </Alert>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Project Design Document (PDD)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-(--muted-foreground)/25 rounded-lg p-4">
                    <input
                      type="file"
                      id="pdd"
                      accept=".pdf"
                      onChange={(e) => handleFileChange('designDocs', e)}
                      disabled={actionRequired && !isUploadEditable('designDocs')}
                      className="hidden"
                    />
                    <label htmlFor="pdd" className={actionRequired && isUploadEditable("designDocs") ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}>
                      <div className="text-center">
                        <FileText className="mx-auto h-6 w-6 text-(--muted-foreground) mb-2" />
                        {files.designDocs.length > 0 ? <p className='text-green-500'>Uploaded PDD</p> : <p className="text-sm font-medium">Upload PDD</p>}
                        <p className="text-xs text-(--muted-foreground)">PDF up to 50MB</p>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Monitoring/Reporting (MRV)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-(--muted-foreground)/25 rounded-lg p-4">
                    <input
                      type="file"
                      id="mrv"
                      accept=".pdf"
                      multiple
                      onChange={(e) => handleFileChange('mrvReports', e)}
                      className="hidden"
                      disabled={actionRequired && !isUploadEditable('mvrReports')}
                    />
                    <label htmlFor="mrv" className={actionRequired && isUploadEditable("mvrReports") ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}>
                      <div className="text-center">
                        <FileText className="mx-auto h-6 w-6 text-(--muted-foreground) mb-2" />
                        {files.mrvReports.length > 0 ? <p className='text-green-500'>Uploaded MVR Reports</p> : <p className="text-sm font-medium">Upload MRV Reports</p>}
                        <p className="text-xs text-(--muted-foreground)">Multiple PDFs allowed</p>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Satellite Imagery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-(--muted-foreground)/25 rounded-lg p-4">
                    <input
                      type="file"
                      id="satellite"
                      accept=".pdf,.jpg,.png,.tiff"
                      multiple
                      onChange={(e) => handleFileChange('satelliteImagery', e)}
                      className="hidden"
                      disabled={actionRequired && !isUploadEditable('satelliteImagery')}
                    />
                    <label htmlFor="satellite" className={actionRequired && isUploadEditable("satelliteImagery") ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}>
                      <div className="text-center">
                        <MapPin className="mx-auto h-6 w-6 text-(--muted-foreground) mb-2" />
                        {files.satelliteImagery.length > 0 ? <p className='text-green-500'>Uploaded Satellite Imagery</p> : <p className="text-sm font-medium">Upload Satellite Imagery</p>}
                        <p className="text-xs text-(--muted-foreground)">Images or PDF reports</p>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Verification Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-(--muted-foreground)/25 rounded-lg p-4">
                    <input
                      type="file"
                      id="verification"
                      accept=".pdf"
                      multiple
                      onChange={(e) => handleFileChange('verificationDocs', e)}
                      className="hidden"
                      disabled={actionRequired && !isUploadEditable('verificationDocs')}
                    />
                    <label htmlFor="verification" className={actionRequired && isUploadEditable("verificationDocs") ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}>
                      <div className="text-center">
                        <CheckCircle className="mx-auto h-6 w-6 text-(--muted-foreground) mb-2" />
                        {files.verificationDocs.length > 0 ? <p className='text-green-500'>Uploaded Verification Docs</p> : <p className="text-sm font-medium">Upload Verification Docs</p>}
                        <p className="text-xs text-(--muted-foreground)">Certification documents</p>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Review Your Project Submission</h3>
              <p className="text-(--muted-foreground)">
                Please review all the information before submitting for verification.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Title:</span> {formData.projectName}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {formData.projectType}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {formData.locationDetails}
                  </div>
                  {(formData.latitude || formData.longitude) && (
                    <div>
                      <span className="font-medium">Coordinates:</span>
                      {formData.latitude && formData.longitude
                        ? ` ${formData.latitude}, ${formData.longitude}`
                        : ' Partial coordinates provided'
                      }
                    </div>
                  )}
                  {formData.projectArea && (
                    <div>
                      <span className="font-medium">Area:</span> {formData.projectArea} hectares
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Duration:</span> {formData.startDate} to {formData.endDate}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Impact Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Expected Offset:</span> {formData.co2offset} tCO₂/year
                  </div>
                  <div>
                    <span className="font-medium">SDG Alignment:</span> {formData.sdgAlignment.length} goals
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.sdgAlignment.map(sdgId => (
                      <Badge key={sdgId} variant="outline" className="text-xs">
                        SDG {sdgId}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{formData.projectDescription}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Baseline Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{formData.baselineScenarioDescription}</p>
              </CardContent>
            </Card>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                By submitting this project, you confirm that all information provided is accurate and you have the necessary rights and permissions for this project.
              </AlertDescription>
            </Alert>

            <div className="text-center">
              <Button size="lg" type='submit' onClick={handleNext} className="px-8">
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm and Submit for Verification
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Map Selector Modal */}
      <MapSelector
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onLocationSelect={handleLocationSelect}
        initialLat={formData.latitude ? parseFloat(formData.latitude) : undefined}
        initialLng={formData.longitude ? parseFloat(formData.longitude) : undefined}
      />

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle>New Project Registration</CardTitle>
          <div className="flex items-center justify-between mt-4">
            <Progress value={(currentStep / totalSteps) * 100} className="flex-1 mr-4" />
            <span className="text-sm text-(--muted-foreground)">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step === currentStep
                  ? 'border-(--primary) bg-(--primary) text-(--primary-foreground)'
                  : step < currentStep
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-(--muted-foreground)/25 bg-(--background)'
                  }`}>
                  {step < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    getStepIcon(step)
                  )}
                </div>
                <span className={`text-xs mt-2 ${step === currentStep ? 'font-medium' : step < currentStep ? 'text-green-600' : 'text-(--muted-foreground)'
                  }`}>
                  {step === 1 && 'Project Info'}
                  {step === 2 && 'Methodology'}
                  {step === 3 && 'Impact'}
                  {step === 4 && 'Documents'}
                  {step === 5 && 'Review'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button type='submit'
            onClick={handleNext}
            disabled={!isStepValid(currentStep)}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button disabled className="opacity-50">
            Submitted
          </Button>
        )}
      </div>
    </div>
  );
}