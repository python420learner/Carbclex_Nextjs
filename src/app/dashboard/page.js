"use client"
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBell, faUser, faBagShopping } from '@fortawesome/free-solid-svg-icons'
import { faDashboard,
  faUser,
  faSliders,
  faBagShopping,
  faDollarSign,
  faCreditCard,
  faBell,
  faListCheck,
  faInfo,
  faBars,
  faRightFromBracket,
  faTimes } from '@fortawesome/free-solid-svg-icons'
import revenueData from "../revenueData.json"
import sourceData from "../sourceData.json"
import monthlyData from "../monthly.json"
import "./page.css"
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    ArcElement,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import Footer from '../components/footer';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { app } from '../firebase'
import { UserProfile } from '../components/UserProfile'
import AddProject from '../components/AddProject'
import { NotificationsAndUpdates } from '../components/NotificationAndUpdates'
import { ManageProject } from '../components/ManageProject'
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);


const Dashboard = () => {
    const [hasScrolled_market, setHasScrolled_market] = useState(false);
    const [userId, setUserId] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [display, setDisplay] = useState('dashboard');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertNotifications, setAlertsNotifications] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [marketInsights, setMarketInsights] = useState([]);
    const [pendingProjectId, setPendingProjectId] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Function to close sidebar on mobile after clicking a link
    const handleLinkClick = (view) => {
        setDisplay(view);
        setMobileOpen(false); // close sidebar on mobile after click
    };

    const router = useRouter();
    const auth = getAuth(app);

    const handlePendingSubmit = async (projectId) => {
        console.log("Submitting project with ID:", projectId);
        setPendingProjectId(projectId);
        setDisplay('project_management');
    }

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
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        setUserId(user.uid); // Store Firebase UID in state

                        // 3. Fetch projects for this user
                        fetchUserProjects(user.uid);

                        // 4. Fetch notifications for this user
                        fetchUserNotifications(user.uid);
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

        // ✅ New function to fetch notifications
        const fetchUserNotifications = async (uid) => {
            try {
                const res = await fetch(`/api/notification/getAll?userId=${uid}`);
                if (!res.ok) throw new Error('Failed to fetch notifications');
                const data = await res.json();
                setNotifications(data); // Assuming you already defined this state
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        checkSessionAndFetchUser();

        // Optional cleanup
        return () => {
            // No cleanup needed now
        };
    }, [router, auth]);

    useEffect(() => {
        if (notifications.length > 0) {
            const alerts = notifications.filter(n => n.event.type.name === 'alert');
            const reminders = notifications.filter(n => n.event.type.name === 'reminder');
            const marketInsights = notifications.filter(n => n.event.type.name === 'market-insights');

            setAlertsNotifications(alerts);
            setReminders(reminders);
            setMarketInsights(marketInsights);
        }
    }, [notifications]);


    const handleLogout = async () => {
        await fetch(`/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        signOut(auth)
            .then(() => {
                console.log("User signed out successfully.");
            })
            .catch((error) => {
                console.error("Sign-out error:", error);
            });

        // Redirect to login page
        // localStorage.setItem('cart_merged', 'false'); // ✅ Set flag

        alert("Logout Successful")
        router.push("/login")
    };


    // useEffect(() => {
    //     const handleScroll = () => {
    //         // Check if user has scrolled vertically
    //         if (window.scrollY > 0) {
    //             setHasScrolled_market(true);
    //         } else {
    //             setHasScrolled_market(false);
    //         }
    //     };

    //     // Add the event listener inside the effect
    //     window.addEventListener('scroll', handleScroll);

    //     // Cleanup the event listener when the component unmounts
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);

    // if(notifications.length>0){
    //     console.log(notifications)
    //     console.log(reminders)
    // }
    return (
        <>
            <div className='dashboard' style={{ display: 'flex', marginBottom: '50rem' }}>
                <div className="navigation" style={{ width: '250px', padding: '20px', backgroundColor: '#1e1e2f' }}>
                    <ul style={{ color: 'white', listStyle: 'none', padding: 0 }}>
                        <li className="py-2 cursor-pointer hover:bg-gray-800 px-2 rounded" onClick={() => setDisplay('dashboard')}>
                            <FontAwesomeIcon icon={faDashboard} style={{ marginRight: '8px' }} size="1x" />
                            Dashboard
                        </li>

                        <div className="">
                            <li
                                onClick={() => setDisplay('profile')}
                                className="py-2 cursor-pointer hover:bg-gray-800 px-2 rounded flex items-center"
                            >
                                <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} size="1x" />
                                Profile
                            </li>
                        </div>

                        <li className="py-2 cursor-pointer hover:bg-gray-800 px-2 rounded">
                            <FontAwesomeIcon icon={faSliders} style={{ marginRight: '8px' }} size="1x" />
                            Market Activity
                        </li>

                        <li className="py-2 cursor-pointer hover:bg-gray-800 px-2 rounded">
                            <FontAwesomeIcon icon={faBagShopping} style={{ marginRight: '8px' }} size="1x" />
                            Cart
                        </li>

                        <li className="py-2 cursor-pointer hover:bg-gray-800 px-2 rounded">
                            <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '8px' }} size="1x" />
                            Transactions
                        </li>

                        <li className="py-2 cursor-pointer hover:bg-gray-800 px-2 rounded">
                            <FontAwesomeIcon icon={faCreditCard} style={{ marginRight: '8px' }} size="1x" />
                            Saved Cards
                        </li>
                        <li onClick={() => setDisplay('notification_centre')} className="py-2 cursor-pointer hover:bg-gray-800 px-2 rounded">
                            <FontAwesomeIcon icon={faBell} style={{ marginRight: '8px' }} size="1x" />
                            Notification & Updates
                        </li>

                        {projects.length>0 && (
                            <li className="relative py-2 cursor-pointer  px-2 rounded">
                                <div
                                    onClick={() => setDisplay('project_management')}
                                    className="flex items-center hover:bg-gray-800 "
                                >
                                    <FontAwesomeIcon icon={faListCheck} className="mr-2" size="1x" />
                                    Project Management
                                </div>
                            </li>
                        )}
                        <li className="py-2 cursor-pointer hover:bg-gray-800 px-2 rounded">
                            <FontAwesomeIcon icon={faInfo} style={{ marginRight: '8px' }} size="1x" />
                            Support and Resources
                        </li>
                    </ul>
                </div>
                <div style={{ marginLeft: 'auto', width: '85vw' }}>
                    <div className={`nav_bar ${hasScrolled_market ? 'nav_background' : ''}`} id='navbar' >
                        <Navbar />
                    </div>
                    <div className='icons' style={{ marginLeft: 'auto', width: 'fit-content', marginBlock: '2rem' }}>
                        <FontAwesomeIcon className='icon' icon={faBagShopping} style={{ marginRight: '2rem' }} color='black' size='2x' />
                        <FontAwesomeIcon className='icon' icon={faBell} style={{ marginRight: '2rem' }} color='black' size='2x' />
                        <Link href="/signup"><FontAwesomeIcon icon={faUser} style={{ marginRight: '2rem' }} color='black' size='2x' /></Link>
                        <FontAwesomeIcon className='icon' onClick={handleLogout} icon={faRightFromBracket} style={{ marginRight: '2rem' }} color='black' size='2x' />
                    </div>
                    <div>
                        {display === 'profile' && (
                            <div>
                                <UserProfile />
                            </div>
                        )}
                        {display === 'project_management' && (
                            <div>
                                <ManageProject pendingProjectId={pendingProjectId} />
                            </div>
                        )}
                        {display === 'add_project' && (
                            <div>
                                <AddProject />
                            </div>
                        )}
                        {display === 'notification_centre' && (
                            <div>
                                <NotificationsAndUpdates userId={userId}
                                    notifications={notifications}
                                    alertNotifications={alertNotifications}
                                    reminders={reminders}
                                    marketInsights={marketInsights}
                                    handlePendingSubmit={handlePendingSubmit}
                                />
                            </div>
                        )}

                    </div>
                    {display === 'dashboard' && (<div className="w-full space-y-8 p-6">
                        {/* First Row - Line and Doughnut Charts */}
                        <div className="flex flex-col lg:flex-row gap-6 w-full">
                            {/* Line Chart Card */}
                            <div className="bg-white rounded-xl shadow-md p-6 flex-1 border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Cost and Revenue</h3>
                                <div className="h-64">
                                    <Line
                                        data={{
                                            labels: revenueData.map((data) => data.label),
                                            datasets: [
                                                {
                                                    label: "Revenue",
                                                    data: revenueData.map((data) => data.revenue),
                                                    backgroundColor: "#3b82f6",
                                                    borderColor: "#3b82f6",
                                                    tension: 0.3,
                                                },
                                                {
                                                    label: "Cost",
                                                    data: revenueData.map((data) => data.cost),
                                                    backgroundColor: "#ef4444",
                                                    borderColor: "#ef4444",
                                                    tension: 0.3,
                                                },
                                            ]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: "top",
                                                    labels: {
                                                        boxWidth: 12,
                                                        padding: 20,
                                                        usePointStyle: true,
                                                    }
                                                },
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    grid: {
                                                        color: "#f3f4f6"
                                                    }
                                                },
                                                x: {
                                                    grid: {
                                                        display: false
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Doughnut Chart Card */}
                            <div className="bg-white rounded-xl shadow-md p-6 flex-1 border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Sources</h3>
                                <div className="h-64">
                                    <Doughnut
                                        data={{
                                            labels: sourceData.map((data) => data.label),
                                            datasets: [
                                                {
                                                    label: "Count",
                                                    data: sourceData.map((data) => data.value),
                                                    backgroundColor: [
                                                        "#6366f1",
                                                        "#f59e0b",
                                                        "#ef4444",
                                                    ],
                                                    borderWidth: 0,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            cutout: '70%',
                                            plugins: {
                                                legend: {
                                                    position: "right",
                                                    labels: {
                                                        boxWidth: 12,
                                                        padding: 20,
                                                        usePointStyle: true,
                                                    }
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Second Row - Bar Charts */}
                        <div className="flex flex-col lg:flex-row gap-6 w-full">
                            {/* Vertical Bar Chart */}
                            <div className="bg-white rounded-xl shadow-md p-6 flex-1 border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Category</h3>
                                <div className="h-64">
                                    <Bar
                                        data={{
                                            labels: sourceData.map((data) => data.label),
                                            datasets: [
                                                {
                                                    label: "Count",
                                                    data: sourceData.map((data) => data.value),
                                                    backgroundColor: [
                                                        "#6366f1",
                                                        "#f59e0b",
                                                        "#ef4444",
                                                    ],
                                                    borderRadius: 4,
                                                    borderSkipped: false,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    grid: {
                                                        color: "#f3f4f6"
                                                    }
                                                },
                                                x: {
                                                    grid: {
                                                        display: false
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Horizontal Bar Chart */}
                            <div className="bg-white rounded-xl shadow-md p-6 flex-1 border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Performance</h3>
                                <div className="h-64">
                                    <Bar
                                        data={{
                                            labels: monthlyData.map((data) => data.label),
                                            datasets: [
                                                {
                                                    label: "Count",
                                                    data: monthlyData.map((data) => data.value),
                                                    backgroundColor: "#3b82f6",
                                                    borderRadius: 4,
                                                    borderSkipped: false,
                                                },
                                            ],
                                        }}
                                        options={{
                                            indexAxis: 'y',
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                            },
                                            scales: {
                                                x: {
                                                    beginAtZero: true,
                                                    grid: {
                                                        color: "#f3f4f6"
                                                    }
                                                },
                                                y: {
                                                    grid: {
                                                        display: false
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>)}
                </div>
            </div>
            {/* <Cart/> */}
            <div style={{ width: '85vw', marginLeft: 'auto' }}>
                <Footer />
            </div>
        </>
    )
}

export default Dashboard
