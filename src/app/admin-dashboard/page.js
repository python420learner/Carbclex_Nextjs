'use client'

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app, getCurrentUser } from '../firebase';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import Link from "next/link";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [filter_verificationStatus, setFilter_verificationStatus] = useState("all");
  const [filter_projectType, setFilter_projectType] = useState("all");

  const router = useRouter();

  const checkAdminStatus = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/login");
        return false;
      }

      const idToken = await user.getIdToken();
      setCurrentUser(user);

      const res = await fetch("/api/user/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user data");

      const userData = await res.json();
      return userData.role === "admin";
    } catch (err) {
      console.error("Error checking admin status:", err);
      setError(err.message);
      return false;
    }
  };

  const filteredProjectsVerification = projects.filter(project => {
    if (filter_verificationStatus == "all") return true;
    return project.verificationStatus == filter_verificationStatus;
  });

  const filteredProjects = filteredProjectsVerification.filter(project => {
    if (filter_projectType == "all") return true;
    return project.projectType == filter_projectType;
  });

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const isAdminUser = await checkAdminStatus();
      if (!isAdminUser) {
        router.push("/unauthorized");
        return;
      }

      setIsAdmin(true);

      // Get fresh token for subsequent requests
      const user = await getCurrentUser();
      const idToken = await user.getIdToken();

      // Fetch users and projects in parallel
      const [usersRes, projectsRes] = await Promise.all([
        axios.get('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${idToken}` }
        }),
        axios.get('/api/getAll', {
          headers: { 'Authorization': `Bearer ${idToken}` }
        })
      ]);

      setUsers(usersRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId,newRole) => {
    try {
      const idToken = await currentUser.getIdToken();
      await axios.put(
        '/api/admin/update-role',
        {
          userId,
          newRole: newRole
        },
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchAllData(); // Refresh all data
    } catch (err) {
      console.error('Update role error:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const verifyProject = async (projectId) => {
    try {
      const idToken = await currentUser.getIdToken();
      const res = await fetch(`/api/verifyProject/${projectId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${idToken}` },
      });

      if (res.ok) {
        alert("Project verified!");
        fetchAllData(); // Refresh all data
      } else {
        throw new Error("Verification failed");
      }
    } catch (err) {
      console.error("Error verifying project", err);
      setError(err.message);
    }
  };

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
    fetchAllData();
  }, []);

  const handleUpdateKycStatus = async (id, newStatus) => {
    console.log(id)
    try {
      const response = await axios.put(`/api/user/updateKycStatus/${id}`, {
        status: newStatus,
      });

      alert(`KYC status updated successfully: ${newStatus}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error updating KYC status:', error);
      alert('Failed to update KYC status');
    }
  };
  console.log(users)

  
  if (loading) return <p>Loading...</p>;
  if (error) return <div>Error: {error}</div>;
  if (!isAdmin) return <p>You are not authorized.</p>;

  return (
    <div>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {/* <UserActivityLog/> */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

          {/* Projects Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200">
              Projects :
            </h2>
            <div className="flex gap-7">
              <p>Filter:</p>
              <div>
                <p>Verfication Status</p>
                <select
                  onChange={(e) => setFilter_verificationStatus(e.target.value)}
                  className="p-2 border rounded mb-5"
                >
                   <option value="all">All</option>
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted for review</option>
                    <option value="reviewing">Under Preliminary Reviewing</option>
                    <option value="expert_validation">Expert Validation</option>
                    <option value="verified">Verified</option>
                    <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <p>Project Type</p>
                <select
                  onChange={(e) => setFilter_projectType(e.target.value)}
                  className="p-2 border rounded mb-5"
                >
                  <option value="all">All</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Carbon_capture">Carbon Capture</option>
                  <option value="Renewable">Renewable</option>
                  <option value="Reforestation">Reforestation</option>
                  <option value="Energy_efficiency">Energy Efficiency</option>
                </select>

              </div>

            </div>

            {filteredProjects.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-500">No projects to show</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <Link href={`/projectDescription?projectId=${project.id}`} key={project.id}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-800">{project.projectName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.verificationStatus === 'verified'
                            ? 'bg-green-100 text-green-800'
                            :  project.verificationStatus === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {project.verificationStatus}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-6 line-clamp-3">{project.projectDescription}</p>

                        <div className="flex items-center text-gray-700 mb-6">
                          <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{project.countryId?.country || 'No country specified'}</span>
                        </div>

                        {/* {project.verificationStatus !== 'verified' && (
                          <button
                            onClick={() => verifyProject(project.id)}
                            className="w-full bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verify Project
                          </button>
                        )} */}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Users Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200">
              User Management
            </h2>

            {users.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                  <div key={user.uid} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{user.email}</h3>
                          <p className="text-sm text-gray-500">UID: {user.uid.substring(0, 8)}...</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                          }`}>
                          {user.role}
                        </span>
                      </div>

                      {user.role == 'User' && (
                        <button
                          onClick={() => updateUserRole(user.uid,'admin')}
                          className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                        >
                          Promote to Admin
                        </button>
                      )}
                      {user.role == 'admin' && (
                        <button
                          onClick={() => updateUserRole(user.uid,'User')}
                          className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                        >
                          Demote to User
                        </button>
                      )}
                      {user.kycStatus != 'verified' && <button
                          onClick={() => handleUpdateKycStatus(user.id,'verified')}
                          className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                        >
                          KYC Verified
                      </button>}

                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
