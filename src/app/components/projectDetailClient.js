'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import AdminMessage from "./admin_message";

export default function ProjectDetailClient() {

  const statusMap = {
    draft: "Draft",
    submitted: "Submitted for Review",
    reviewing: "Under Preliminary Reviewing",
    expert_validation: "Expert Validation / Compliance Review",
    verified: "Verified"
  };

  const statusKeys = Object.keys(statusMap);
  const [projectId, setProjectId] = useState(null);
  const [project, setProject] = useState(null);
  const [media, setMedia] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);


  const getNextStatus = (current) => {
    const currentIndex = statusKeys.indexOf(current);
    if (currentIndex < statusKeys.length - 1) {
      return statusKeys[currentIndex + 1];
    }
    return null; // already at final status
  };

  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus(status);
    if (!nextStatus) return alert("Already at final status!");

    try {
      setLoading(true);
      await axios.post(`/api/updateVerificationStatus/${projectId}`, {
        status: nextStatus
      });
      setStatus(nextStatus);
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFailed = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/updateVerificationStatus/${projectId}`, {
        status: 'failed'
      });
      setStatus('failed');
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // ✅ Fallback approach to get query param from URL
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("projectId");
    console.log("Fetched projectId from URL:", id);
    setProjectId(id);
  }, []);

  useEffect(() => {
    if (!projectId) return;

    // 🔄 Make sure to use your actual production backend URL here
    axios.get(`/api/projects/${projectId}`)
      .then(res => {
        const fetchedProject = res.data;
        setProject(fetchedProject);

        const pid = fetchedProject.projectid;
        const project_status = fetchedProject.verificationStatus;
        setStatus(project_status)
        if (pid) {
          axios.get(`/api/media/project/${pid}`)
            .then(res => setMedia(res.data))
            .catch(err => console.error('Error fetching media:', err));
        } else {
          console.warn('Project ID not found in the fetched project.');
        }
      })
      .catch(err => console.error('Error fetching project:', err));
  }, [projectId]);

  // console.log("this is media files", media)
  if (!project) return <p className="p-8">Loading project details...</p>;
  if(media){
    media.flatMap((items)=>{
      items.images.map((item)=>{
        console.log(items)

      })
    })
  }


  return (
    <div className="max-w-4xl mx-auto my-14 p-6 bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{project.projectName}</h1>
        <div className="flex items-center mt-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${project.verificationStatus === 'verified'
            ? 'bg-green-100 text-green-800'
            : status === 'failed' ? 'bg-red-600 text-white' : 'bg-yellow-100 text-yellow-800'
            }`}>
            {status.toUpperCase()}
          </span>
          <span className="ml-4 text-gray-600">{project.projectType}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Project Details</h2>
          <p className="text-gray-600 mb-6">{project.projectDescription}</p>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="text-gray-800">{project.locationDetails}, {project.region}</p>
              <p className="text-gray-600">{project.countryId.country}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Project Duration</h3>
              <p className="text-gray-800">
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Carbon Metrics</h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Actual Reduction</h3>
              <p className="text-2xl font-bold text-blue-600">{project.actualCarbonReduction} tCO₂</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Credits Available</h3>
              <p className="text-2xl font-bold text-green-600">{project.carbonCreditsAvailable}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800">Credits Issued</h3>
              <p className="text-2xl font-bold text-purple-600">{project.carbonCreditsIssued}</p>
            </div>
          </div>

          {project.verificationStatus == 'verified' ?
            (<div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-800 mb-2">Verification Details</h3>
              <p className="font-medium text-gray-700">{project.verifierId.verifierName}</p>
              <p className="text-gray-600 text-sm">{project.verifierId.contactInfo}</p>
            </div>) :
            (
              <div>

                Verfication Status : {status === 'failed' ? 'Verification Failed' : statusMap[status]}
              </div>
            )
          }
        </div>
      </div>

      <div>
        {media.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Uploaded Media</h2>

            {/* Image URLs */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {media.flatMap(items =>
                items.images.map((item,index) => (
                  <a key={index} href={`https://carbclex.com/${item.url}`} target="_blank" rel="noopener noreferrer">
                    <img
                      width={100}
                      height={100}
                      src={`https://carbclex.com/${item.url}`}
                      alt={`Project Media ${item.title}`}
                      className="w-full h-auto rounded-lg shadow"
                    />
                  </a>
                ))
              )}
            </div>

            {/* Document URLs */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Documents</h3>
              <ul className="list-disc ml-5 text-blue-600">
                {media.flatMap(items =>
                  items.documents.map((item,idx) => (
                    <li key={idx}>
                      <a href={`https://carbclex.com/${item.url}`} download target="_blank" rel="noopener noreferrer">
                        Download File
                      </a>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="my-6">

        <div className="w-full max-w-3xl mx-auto px-4 py-8">
          {/* Timeline */}
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
            {statusKeys.map((key, index) => {
              const isCompleted = statusKeys.indexOf(status) >= index;
              const isActive = status === key;

              return (
                <div
                  key={key}
                  className="relative z-10 flex flex-col items-center"
                >
                  {/* Dot with pulse animation when active */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 
                ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}
                ${isActive ? 'ring-4 ring-blue-300 animate-pulse' : ''}
              `}>
                    {isCompleted && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* Label */}
                  <div className={`mt-2 text-xs font-medium text-center transition-all duration-300
                ${isCompleted ? 'text-blue-600' : 'text-gray-500'}
                ${isActive ? 'font-bold text-sm -mt-1' : ''}
              `}>
                    {statusMap[key]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="my-4">
          {/* <p className="mb-2 text-sm">Current Status: <strong>{statusMap[status]}</strong></p> */}
          <button
            onClick={handleStatusUpdate}
            disabled={loading || status === 'verified' || status === 'failed'}
            className={`px-4 py-2 mx-2 rounded-lg text-white transition ${status === 'verified'
              ? 'bg-green-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading ? 'Updating...' : status === 'verified' ? 'Verified' : 'Set to ' + statusMap[statusKeys[statusKeys.indexOf(status) + 1]]}
          </button>
          <button
            onClick={handleStatusFailed}
            disabled={loading || status === 'verified' || status === 'failed'}
            className={`px-4 py-2 rounded-lg text-white transition bg-red-600 hover:bg-red-800`}
          >
            FAILED
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-sm text-gray-500">
        Last updated: {new Date(project.updatedAt).toLocaleString()}
      </div>
      <div>
        <AdminMessage project={project} />
      </div>
    </div>
  );
}
