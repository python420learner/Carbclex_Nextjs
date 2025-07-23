'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import React from 'react'
import { useRouter } from "next/navigation";

const MyProject = () => {

    const statusMap = {
        draft: "Draft",
        uploaded_media: "Uploaded Media",
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
    const router = useRouter();

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

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/project/deleteProject/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Project deleted successfully');
                router.push("/dashboard")
                // Optionally: refresh project list or remove from UI
            } else {
                const errorText = await response.text();
                console.error('Failed to delete project:', errorText);
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleProjectSubmit = async() => {
        try {
            setLoading(true);
            await axios.post(`/api/updateVerificationStatus/${projectId}`, {
                status: 'submitted'
            });
            setStatus('submitted');
        } catch (error) {
            console.error("Status update failed:", error);
            alert("Failed to update status.");
        } finally {
            setLoading(false);
        }
    }

    const handleStep2 = async()=>{
        try {
            setLoading(true);
            await axios.post(`/api/updateVerificationStatus/${projectId}`, {
                status: 'draft'
            });
            setStatus('draft');
            router.push(`/seller?projectId=${project.id}`)
        } catch (error) {
            console.error("Status update failed:", error);
            alert("Failed to update status.");
        } finally {
            setLoading(false);
        }

    }

    // console.log("this is media files", media)
    if (!project) return <p className="p-8">Loading project details...</p>;

    return (
        <div>
            {status==='uploaded_media' && (
                <div className="max-w-4xl mx-auto my-14 p-6">
                    <h3>Project Review Panel</h3>
                    <div className='flex w-fit mx-auto my-10 gap-10'>
                        {/* Steps Timeline */}
                        <button className='px-8 py-1 text-white bg-green-800'>Step-1</button>
                        <button onClick={handleStep2} className={`px-8 py-1 border border-black-500 text-white bg-green-800`}>Step-2</button>
                        <button className={`px-8 py-1 border border-black-500 text-white bg-green-800`}>Step-3</button>
                    </div>
                </div>
            )}
            <div className="max-w-4xl mx-auto my-14 p-6 bg-white rounded-lg shadow-md">
                {/* Header Section */}
                <div className="border-b pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">{project.projectName}</h1>
                    <div className="flex items-center mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${project.verificationStatus === 'verified'
                            ? 'bg-green-100 text-green-800'
                            : status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
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

                <div>
                    {media.length > 0 && (
                        <div className="mt-10">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Uploaded Media</h2>

                            {/* Image URLs */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                {media.flatMap(item =>
                                    item.imageUrls.map((url, index) => (
                                        <a key={index} href={`https://carbclex.com/${url}`} target="_blank" rel="noopener noreferrer">
                                            <img
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
                                                <a href={`https://carbclex.com/${doc}`} download target="_blank" rel="noopener noreferrer">
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
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-10">
                    {(project.verificationStatus === 'draft' || project.verificationStatus === 'uploaded_media') && <button onClick={handleProjectSubmit} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        Submit for Reviewing
                    </button>}

                    {(project.verificationStatus === 'draft' || project.verificationStatus === 'failed') && (
                        <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                            Edit
                        </button>
                    )}

                    {(project.verificationStatus === 'draft' || project.verificationStatus === 'uploaded_media' || project.verificationStatus === 'failed') && (
                        <button
                            onClick={() => handleDelete(project.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyProject