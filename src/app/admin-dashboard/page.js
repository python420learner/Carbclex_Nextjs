"use client"

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app, getCurrentUser } from '../firebase';
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState([]);
  const router = useRouter();

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
    const checkAdmin = async () => {
      try {
        const auth = getAuth(app);
        const user = await getCurrentUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const idToken = await user.getIdToken();

        const res = await fetch("/api/user/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const userData = await res.json();

        if (userData.role === "admin") {
          setIsAdmin(true);
        } else {
          router.push("/unauthorized"); // Or your custom error page
        }
      } catch (err) {
        console.error("Error verifying admin role:", err);
        // router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  const fetchUnverifiedProjects = async () => {
    try {
      const response = await fetch('/api/project/getNonVerifiedProjects'); // 🔁 Change to your live backend URL in prod
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching unverified projects:', error);
    }
  };

  useEffect(() => {
    fetchUnverifiedProjects();
  }, []);


  const verifyProject = async (projectId) => {
    try {
      const user = await getCurrentUser();
      const token = await user.getIdToken(); // Firebase ID token (if secured)

      const res = await fetch(`/api/verifyProject/${projectId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, // optional if auth required
        },
      });

      if (res.ok) {
        alert("Project verified!");
        // 🔄 Refresh the project list
        fetchUnverifiedProjects();
      } else {
        alert("Verification failed.");
      }
    } catch (err) {
      console.error("Error verifying project", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {isAdmin ? (
        <div>
          <div>
            <Navbar />
          </div>

          <div style={{ marginBlock: '5rem' }}>

            {projects && projects.map(project => (
              <div
                key={project.id}
                className="border border-gray-200 my-3 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.projectName}</h2>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                      {project.verificationStatus}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 text-lg">{project.projectDescription}</p>

                  <div className="flex items-center text-gray-700 mb-6">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{project.countryId.country}</span>
                  </div>

                  {project.verificationStatus != 'verified' && (
                    <button
                      className="w-2xl bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                      onClick={() => verifyProject(project.id)}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verify Project
                    </button>
                  )}
                </div>
              </div>
            ))}

          </div>

          <div>
            <Footer />
          </div>

        </div>


      ) : (
        <p>You are not authorized.</p>
      )}
    </div>
  );
};

export default AdminDashboard;