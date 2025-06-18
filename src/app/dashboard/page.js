'use client'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faUser, faBagShopping } from '@fortawesome/free-solid-svg-icons'
import { faDashboard, faWallet, faFile, faSliders, faCreditCard, faDollarSign, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
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
// import Cart from './cart'

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);


const Dashboard = () => {
    const [hasScrolled_market, setHasScrolled_market] = useState(false);
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

    const handleLogout = async () => {
        await fetch(`/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        // Redirect to login page
        alert("Logout Successful")
        router.push("/login")
    };


    useEffect(() => {
        const handleScroll = () => {
            // Check if user has scrolled vertically
            if (window.scrollY > 0) {
                setHasScrolled_market(true);
            } else {
                setHasScrolled_market(false);
            }
        };

        // Add the event listener inside the effect
        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <>
            <div className='dashboard' style={{ display: 'flex', marginBottom: '50rem' }}>
                <div className='navigation' style={{}}>
                    <ul style={{ color: 'white', listStyle: 'none', marginTop: '80%' }}>
                        <li><FontAwesomeIcon icon={faDashboard} style={{ marginRight: '8px' }} size='1x' />Dashboard</li>
                        <li><FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} size='1x' />Profile</li>
                        <li><FontAwesomeIcon icon={faSliders} style={{ marginRight: '8px' }} size='1x' />Setting</li>
                        <li className='lspace'><FontAwesomeIcon icon={faFile} style={{ marginRight: '8px' }} size='1x' />KYC</li>
                        <li><FontAwesomeIcon icon={faWallet} style={{ marginRight: '8px' }} size='1x' />Wallets</li>
                        <li><FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '8px' }} size='1x' />Transactions</li>
                        <li><FontAwesomeIcon icon={faCreditCard} style={{ marginRight: '8px' }} size='1x' />Saved Cards</li>
                    </ul>
                </div>
                <div style={{ marginLeft: '220px' }}>
                    <div className={`nav_bar ${hasScrolled_market ? 'nav_background' : ''}`} id='navbar' >
                        <Navbar />
                    </div>
                    <div className='icons' style={{ marginLeft: 'auto', width: 'fit-content', marginBlock: '2rem' }}>
                        <FontAwesomeIcon className='icon' icon={faBagShopping} style={{ marginRight: '2rem' }} color='black' size='2x' />
                        <FontAwesomeIcon className='icon' icon={faBell} style={{ marginRight: '2rem' }} color='black' size='2x' />
                        <Link href="/signup"><FontAwesomeIcon icon={faUser} style={{ marginRight: '2rem' }} color='black' size='2x' /></Link>
                        <FontAwesomeIcon  className='icon' onClick={handleLogout} icon={faRightFromBracket} style={{ marginRight: '2rem' }} color='black' size='2x' />


                    </div>
                    <div style={{ width: '80vw', height: '40vh', display: 'flex', justifyContent: 'space-around' }}>
                        <div>
                            <Line style={{ width: '35vw', height: '20vw' }}
                                data={{
                                    labels: revenueData.map((data) => data.label),
                                    datasets: [
                                        {
                                            label: "Revenue",
                                            data: revenueData.map((data) => data.revenue),
                                            backgroundColor: "#064FF0",
                                            borderColor: "#064FF0",
                                        },
                                        {
                                            label: "Cost",
                                            data: revenueData.map((data) => data.cost),
                                            backgroundColor: "#FF3030",
                                            borderColor: "#FF3030",
                                        },
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: "top",
                                        },
                                        title: {
                                            display: true,
                                            text: "Monthly Cost and Revenue",
                                        },
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <Doughnut
                                data={{
                                    labels: sourceData.map((data) => data.label),
                                    datasets: [
                                        {
                                            label: "Count",
                                            data: sourceData.map((data) => data.value),
                                            backgroundColor: [
                                                "rgba(43, 63, 229, 0.8)",
                                                "rgba(250, 192, 19, 0.8)",
                                                "rgba(253, 135, 135, 0.8)",
                                            ],
                                            borderRadius: 1,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: "top",
                                        },
                                        title: {
                                            display: true,
                                            text: "Doughnut",
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ width: '80vw', height: '40vh', display: 'flex', justifyContent: 'space-around' }}>
                        <div style={{ height: '100%', width: '30vw' }}>
                            <Bar
                                data={{
                                    labels: sourceData.map((data) => data.label),
                                    datasets: [
                                        {
                                            label: "Count",
                                            data: sourceData.map((data) => data.value),
                                            backgroundColor: [
                                                "rgba(43, 63, 229, 0.8)",
                                                "rgba(250, 192, 19, 0.8)",
                                                "rgba(253, 135, 135, 0.8)",
                                            ],
                                            borderRadius: 25,
                                            barThickness: 25
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: "top",
                                        },
                                        title: {
                                            display: true,
                                            text: "Bar Chart",
                                        },
                                    },
                                }}
                            />
                        </div>
                        <div style={{ height: '100%', width: '30vw' }}>
                            <Bar
                                data={{
                                    labels: monthlyData.map((data) => data.label),
                                    datasets: [
                                        {
                                            label: "Count",
                                            data: monthlyData.map((data) => data.value),
                                            backgroundColor: [
                                                "rgba(0, 0, 205, 0.8)",
                                                "rgba(0, 0, 205, 0.8)",
                                                "rgba(0, 0, 205, 0.8)",
                                            ],
                                            borderRadius: 5,
                                            barThickness: 15
                                        },
                                    ],
                                }}
                                options={{
                                    indexAxis: 'y',
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: "top",
                                        },
                                        title: {
                                            display: true,
                                            text: "Bar Chart",
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
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
