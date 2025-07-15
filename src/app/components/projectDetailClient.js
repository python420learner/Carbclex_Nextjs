'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import AdminMessage from "./admin_message";
import Image from "next/image";

export default function ProjectDetailClient() {
  const [projectId, setProjectId] = useState(null);
  const [project, setProject] = useState(null);
  const [media, setMedia] = useState([]);

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


  return (
    <div className="max-w-4xl mx-auto my-14 p-6 bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{project.projectName}</h1>
        <div className="flex items-center mt-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${project.verificationStatus === 'verified'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
            }`}>
            {project.verificationStatus.toUpperCase()}
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
                Verfication Status : {project.verificationStatus.toUpperCase()}
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
              {media.flatMap(item =>
                item.imageUrls.map((url, index) => (
                  <a key={index} href={`https://carbclex.com/${url}`} target="_blank" rel="noopener noreferrer">
                    <Image
                      width={100}
                      height={100}
                      src={`https://carbclex.com/${url}`}
                      alt={`Project Media ${index}`}
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
                {media.flatMap(item =>
                  item.documentUrls.map((doc, idx) => (
                    <li key={idx}>
                      <a href={`https://carbclex.com/${url}`} download target="_blank" rel="noopener noreferrer">
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
