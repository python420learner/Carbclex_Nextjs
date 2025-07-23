'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase'
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import AddProject from './AddProject';

const ProjectManagement = () => {

    const [userId, setUserId] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [editingProjectId, setEditingProjectId] = useState(null)
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

    const filteredProjectsVerification = projects.filter(project => {
        if (filter_verificationStatus == "all") return true;
        return project.verificationStatus == filter_verificationStatus;
    });

    const filteredOnDates = filteredProjectsVerification.filter(project => {
        if (!startDate || !endDate) return true;
        const from = new Date(startDate)
        const to = new Date(endDate)
        const projectStartDate = new Date(project.startDate);
        return projectStartDate >= from && projectStartDate <= to;
    });

    const filteredProjects = filteredOnDates.filter(project => {
        if (filter_projectType == "all") return true;
        return project.projectType == filter_projectType;
    });

    const handleDelete = async (id) => {
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


    if (loading) {
        return (
            <div>Loading Projects....</div>
        )
    }

    if (editingProjectId) {
        console.log(editingProjectId)
    return (
      <Suspense fallback={<div>Loading Editor...</div>}>
        <AddProject id={editingProjectId} onCancel={() => setEditingProjectId(null)} />
      </Suspense>
    )
  }


    return (
        <div>
            <div className="min-h-screen bg-gray-50 p-6">
                {userId && (
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Project Dashboard</h1>
                            <p className="text-gray-600">Welcome back! Here are your projects</p>
                        </div>

                        {/* Filter Section */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
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

                                {/* Date Range Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="date"
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="date"
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Projects Grid */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Projects</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProjects.map(project => (
                                    <div
                                        key={project.id}
                                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                                    >
                                        <div className="p-6">
                                            {/* Project Header */}
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-bold text-gray-800">{project.projectName}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                                                        project.verificationStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {project.verificationStatus.replace(/_/g, ' ')}
                                                </span>
                                            </div>

                                            {/* Project Description */}
                                            <p className="text-gray-600 mb-6 line-clamp-3">{project.projectDescription}</p>

                                            {/* Project Details */}
                                            <div className="space-y-4 mb-6">
                                                <div className="flex items-center text-gray-700">
                                                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{project.countryId?.country || 'No country specified'}</span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500">Carbon Credits</h4>
                                                        <p className="font-semibold text-gray-800">{project.carbonCreditsIssued || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500">Project Type</h4>
                                                        <p className="font-semibold text-gray-800">{project.projectType?.replace(/_/g, ' ') || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-3">
                                                <Suspense fallback={<div>Loading...</div>}>
                                                    <Link href={`/my-project?projectId=${project.id}`}>
                                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                                            View Project
                                                        </button>
                                                    </Link>
                                                </Suspense>

                                                {(project.verificationStatus === 'draft' || project.verificationStatus === 'uploaded_media' || project.verificationStatus === 'failed') && (
                                                    <button onClick={() => setEditingProjectId(project.id)} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                                                        Edit
                                                    </button>
                                                )}

                                                {(project.verificationStatus === 'draft' || project.verificationStatus === 'failed') && (
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
                                ))}
                            </div>
                        </div>

                        {/* New Project Button */}
                        <div className="text-center">
                            <Link href="/seller">
                                <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                                    Register New Project
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default ProjectManagement