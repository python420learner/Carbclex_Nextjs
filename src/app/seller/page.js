"use client"
import { useState, useEffect } from 'react';
import "./page.css"
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import { app } from '../firebase';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function CreateProject() {

    const [files, setFiles] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);

    const router = useRouter()

    useEffect(() => {
        fetch(`/api/auth/check-session`, {
            credentials: 'include',
        })
            .then((res) => {
                if (!res.ok) {
                    alert('Login Required!!')
                    router.push('/login');
                }
            })
            .catch(() => {
                router.push('/login');
            });
    }, []);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const [formData, setFormData] = useState({
        projectid: '',
        projectName: '',
        projectType: '',               // ENUM: Renewable, Reforestation, etc.
        countryId: '',                 // Foreign key to CountryCodeMaster
        region: '',
        locationDetails: '',
        startDate: '',
        endDate: '',
        estimatedCarbonReduction: '',
        actualCarbonReduction: '',
        carbonCreditsIssued: '',
        carbonCreditsAvailable: '',
        projectDescription: '',
        verificationStatus: 'pending', // ENUM: 'verified', 'pending', 'failed'
        // verifierId: '',                // Foreign key to Verifier
        projectdocumentURL: '',
        projectimagesURL: '',
        projectvideosURL: ''
    });

    const getNextProjectId = async () => {
        const res = await fetch('/api/next-id');
        if (!res.ok) throw new Error('Failed to get next project ID');
        return await res.json();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {

        e.preventDefault(); // prevent default form reload

        try {
            const auth = getAuth(app);
            const user = auth.currentUser;

            if (!user) {
                alert('You must be logged in to submit a project.');
                return;
            }

            const userId = user.uid;
            const nextId = await getNextProjectId()

            // Convert your formData fields to match backend data types
            const payload = {
                projectid: Number(nextId),
                projectName: formData.projectName,
                projectType: formData.projectType,
                countryId: { countryId: Number(formData.countryId) },
                region: formData.region,
                locationDetails: formData.locationDetails,
                startDate: formData.startDate,
                endDate: formData.endDate,
                estimatedCarbonReduction: parseFloat(formData.estimatedCarbonReduction),
                actualCarbonReduction: parseFloat(formData.actualCarbonReduction),
                carbonCreditsIssued: Number(formData.carbonCreditsIssued),
                carbonCreditsAvailable: Number(formData.carbonCreditsAvailable),
                projectDescription: formData.projectDescription,
                verificationStatus: formData.verificationStatus,
                // verifierId: { id: Number(formData.verifierId) },
                projectDocumentURL: formData.projectdocumentURL,
                projectImagesURL: formData.projectimagesURL,
                projectVideosURL: formData.projectvideosURL
            };

            try {
                const response = await fetch('/api/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert('Success: Project added');
                } else {
                    alert('Something went wrong')
                    console.error('Error: Server responded with status', response.status);
                }
                if (files.length > 0) {
                    const mediaFormData = new FormData();
                    for (const file of files) {
                        mediaFormData.append('files', file);
                    }

                    const mediaUploadRes = await fetch(`/api/media/upload?userId=${userId}&projectId=${nextId}`, {
                        method: 'POST',
                        body: mediaFormData
                    });

                    if (!mediaUploadRes.ok) {
                        throw new Error("Media upload failed.");
                    }
                }

                alert('Project submitted successfully!');
            } catch (error) {
                console.error('Error submitting form:', error);
            }

        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit project');
        }
    }

        return (
            <div>
                <Navbar />
                <form onSubmit={handleSubmit} style={{ marginBlock: '2rem', marginInline: 'auto', width: '60vw' }} className="mx-auto p-6 bg-white shadow-md rounded">
                    <h2 className="text-2xl mb-4 font-bold">Create Project</h2>

                    <label>Project Name</label>
                    <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        placeholder="Project Name"
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    <label>Project Type</label>
                    <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full p-2 border mb-3"
                    >
                        <option value="" disabled>-- Select project type --</option>
                        <option value="Renewable">Renewable</option>
                        <option value="Reforestation">Reforestation</option>
                        <option value="Energy_efficiency">Energy efficiency</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Carbon_capture">Carbon capture</option>
                    </select>

                    <label>Country Id</label>
                    <input
                        type="number"
                        name="countryId"
                        value={formData.countryId}
                        placeholder="Country ID"
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    <label>Region</label>
                    <input
                        type="text"
                        name="region"
                        value={formData.region}
                        placeholder="Region"
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    <label>Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    <label>End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    <label>Location Details</label>
                    <textarea
                        name="locationDetails"
                        value={formData.locationDetails}
                        placeholder="Location Details"
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    <label>Estimated Carbon Reduction</label>
                    <input
                        type="number"
                        name="estimatedCarbonReduction"
                        value={formData.estimatedCarbonReduction}
                        placeholder="Estimated Carbon Reduction"
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    <label>Actual Carbon Reduction</label>
                    <input
                        type="number"
                        name="actualCarbonReduction"
                        value={formData.actualCarbonReduction}
                        placeholder="Actual Carbon Reduction"
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    <label>Carbon Credits Issued</label>
                    <input
                        type="number"
                        name="carbonCreditsIssued"
                        value={formData.carbonCreditsIssued}
                        placeholder="Carbon Credits Issued"
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    <label>Carbon Credits Available</label>
                    <input
                        type="number"
                        name="carbonCreditsAvailable"
                        value={formData.carbonCreditsAvailable}
                        placeholder="Carbon Credits Available"
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    <label>Project Description</label>
                    <textarea
                        name="projectDescription"
                        placeholder="Project Description"
                        value={formData.projectDescription}
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    {/* <label>Project Documents URL</label>
                    <input
                        type="text"
                        name="projectdocumentURL"
                        value={formData.projectdocumentURL}
                        placeholder="Project Document URL"
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    <label>Project Image URL</label>
                    <input
                        type="text"
                        name="projectimagesURL"
                        value={formData.projectimagesURL}
                        placeholder="Project Images URL"
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    <label>Project Videos URL</label>
                    <input
                        type="text"
                        name="projectvideosURL"
                        value={formData.projectvideosURL}
                        placeholder="Project Videos URL"
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    /> */}

                    <input type="file" multiple onChange={handleFileChange} />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
                <Footer />
            </div>
        );
    }
