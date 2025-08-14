"use client"
import { useState, useEffect } from 'react';
// import "./page.css"
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer'; 
import { app } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AddProject({ id, onCancel }) {

    const [files, setFiles] = useState({
        designDocs: [],
        mrvReports: [],
        satelliteImagery: [],
        verificationDocs: [],
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState('Step-1')
    const [projectId, setProjectId] = useState()
    const [userId, setUserId] = useState();
    const [project, setProject] = useState();
    const router = useRouter()

    console.log(id)

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

        // const searchParams = new URLSearchParams(window.location.search);
        // const id = searchParams.get("projectId");

        if (id) {
            setStep('Step-2');
            // setProjectId(id);
            console.log("✅ Fetched projectId from URL:", id);

            // ✅ Fetch project from backend
            fetch(`/api/projects/${id}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch project");
                    return res.json();
                })
                .then(data => {
                    setProject(data);
                    console.log("🎯 Project data:", data);
                    const projectId = data.projectid
                    setProjectId(projectId)
                    const verificationStatus = data.verificationStatus;
                    setStatus(verificationStatus)
                })
                .catch(err => console.error("Error fetching project:", err));
        }
        return () => unsubscribe(); // cleanup listener
    }, []);

    useEffect(() => {
        console.log(status, projectId)
        if (status === 'uploaded_media' && project?.id) {
            setStep('Step-3')
            router.push(`/my-project?projectId=${project.id}`);
        }
    }, [status, project, router]);

    const handleFileChange = (e, category) => {
        setFiles((prev) => ({
            ...prev,
            [category]: Array.from(e.target.files),
        }));
    };

    const [formData, setFormData] = useState({
        projectid: '',
        userId: '',
        projectName: '',
        projectType: '',               // ENUM: Renewable, Reforestation, etc.
        countryId: '',                 // Foreign key to CountryCodeMaster
        region: '',
        locationDetails: '',
        startDate: '',
        endDate: '',
        estimatedCarbonReduction: 0,
        actualCarbonReduction: 0,
        carbonCreditsIssued: 0,
        carbonCreditsAvailable: 0,
        projectDescription: '',
        verificationStatus: 'draft',
        // verifierId: '',                // Foreign key to Verifier
        // projectdocumentURL: '',
        // projectimagesURL: '',
        // projectvideosURL: ''
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
    const handleCreateProject = async (e) => {

        e.preventDefault(); // prevent default form reload

        try {
            const nextId = await getNextProjectId()
            setProjectId(nextId)

            // Convert your formData fields to match backend data types
            const payload = {
                projectid: Number(nextId),
                userId: userId,
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
                // projectDocumentURL: formData.projectdocumentURL,
                // projectImagesURL: formData.projectimagesURL,
                // projectVideosURL: formData.projectvideosURL
            };

            try {
                const response = await fetch('/api/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert('Success: Project added');
                    const savedProject = await response.json();
                    setProject(savedProject);
                    setStep('Step-2')
                } else {
                    alert('Something went wrong')
                    console.error('Error: Server responded with status', response.status);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }

        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit project');
        }
    }

    const handleUpdateProject = async (event) => {
        event.preventDefault();

        const handleProjectSubmit = async () => {
            try {
                await axios.post(`/api/updateVerificationStatus/${project.id}`, {
                    status: 'uploaded_media'
                });
                setStatus('uploaded_media');
            } catch (error) {
                console.error("Status update failed:", error);
                alert("Failed to update status.");
            }
        }

        try {
            setLoading(true); // Optional UX feedback

            const hasFiles = Object.values(files).some(category => category.length > 0);
            if (!hasFiles) {
                alert('Please select at least one file to upload');
                return;
            }

            const mediaFormData = new FormData();
            Object.entries(files).forEach(([category, fileList]) => {
                fileList.forEach(file => {
                    mediaFormData.append('files', file);
                });
            });

            // Upload media files
            const mediaUploadRes = await fetch(
                `/api/media/upload?userId=${userId}&projectId=${projectId}`,
                {
                    method: 'POST',
                    body: mediaFormData,
                }
            );

            if (!mediaUploadRes.ok) {
                throw new Error(`Upload failed: ${mediaUploadRes.statusText}`);
            }

            handleProjectSubmit()

            // ✅ Step 3: Everything went well, proceed
            if (status === 'uploaded_media') {
                alert('Media files uploaded successfully');
                setStep('Step-3');

                await new Promise(resolve => setTimeout(resolve, 300));
                router.push(`/my-project?projectId=${project.id}`);

            }

        } catch (error) {
            console.error("Upload failed:", error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    const handleStep1 = () => {
        if (step === 'Step-2') {
            console.log('Wanted to go to step - 1')
        }
    }

    return (
        <div>
            {/* <Navbar /> */}

            <div className='flex w-fit mx-auto my-10 gap-10'>
                {/* Steps Timeline */}
                <button onClick={handleStep1} className='px-8 py-1 text-white bg-green-800'>Step-1</button>
                <button className={`px-8 py-1 border border-black-500 ${step !== 'Step-1' ? ' text-white bg-green-800' : ''}`}>Step-2</button>
                <button className='px-8 py-1 border border-black-500'>Step-3</button>
            </div>

            {step === 'Step-2' && (
                <div className='my-5'>
                    <form
                        onSubmit={handleUpdateProject}
                        className="mx-auto p-8 bg-white rounded-xl shadow-md border border-gray-100 w-full max-w-3xl"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Project Documents</h2>

                        <div className="space-y-6">
                            {/* Project Design Documents */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Design Documents
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 flex items-center">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => handleFileChange(e, 'designDocs')}
                                        className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">PDF, DOCX, or image files (max. 10MB each)</p>
                            </div>

                            {/* MRV Reports */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Monitoring/Reporting (MRV) Reports
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 flex items-center">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => handleFileChange(e, 'mrvReports')}
                                        className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">CSV, XLSX, or PDF files (max. 15MB each)</p>
                            </div>

                            {/* Satellite Imagery */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Satellite Imagery
                                </label>
                                <div className="mt-1 flex items-center">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => handleFileChange(e, 'satelliteImagery')}
                                        className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        accept="image/*,.geotiff,.tiff"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">JPG, PNG, TIFF, or GEOTIFF (max. 20MB each)</p>
                            </div>

                            {/* Verification Documents */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Body Documents
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 flex items-center">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => handleFileChange(e, 'verificationDocs')}
                                        className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">PDF or DOCX files (max. 10MB each)</p>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    // onClick={handleUpdateProject}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Upload Documents
                                </button>
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="bg-gray-300 mt-3 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {step === 'Step-1' && <div>
                <form onSubmit={handleCreateProject} style={{ marginBlock: '2rem', marginInline: 'auto', width: '60vw' }} className="mx-auto p-6 bg-white shadow-md rounded">
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



                    <label>Project Description</label>
                    <textarea
                        name="projectDescription"
                        placeholder="Project Description"
                        value={formData.projectDescription}
                        className="w-full p-2 border mb-3"
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>}

            {/* <Footer /> */}
        </div>
    );
}



{/* <label>Estimated Carbon Reduction</label>
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
/> */}


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