import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { getCurrentUser } from "../firebase";
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { mergeGuestCartToUserCart, getGuestCart, saveGuestCart } from './cartUtility';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Verified, TrendingUp, ShoppingCart, Download, Star, Calendar, Globe, Users, Leaf, Award, Shield, Clock, ArrowLeft, Plus, Minus, Heart, Share2, FileText, CheckCircle, Camera, Play, Satellite } from 'lucide-react';
// import { ImageWithFallback } from './figma/ImageWithFallback';
import MediaGallery from './MediaGallery';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from './Navbar';
// interface ProjectDetailsProps {
//   project: ProjectData;
//   onBack: () => void;    
// }

export default function ProjectDetails({ project, onBack }) {
    const [purchaseAmount, setPurchaseAmount] = useState(1);
    const [activeTab, setActiveTab] = useState('overview');
    const [isFavorite, setIsFavorite] = useState(false);
    const [media, setMedia] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [isInCart, setIsInCart] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [user, setUser] = useState(null);
    const currentProjectId = project.projectid;
    const router = useRouter();

    const handlePurchase = () => {
        console.log('Purchase:', project.id, purchaseAmount);
        // Handle purchase logic
    };

    // if (cartItems.length > 0) {
    //     console.log(cartItems)

    // }

    const totalPrice = 10 * quantity;
    const startDate = new Date(project.startDate)
    const formattedStartDate = `${startDate.getDate()}/${startDate.getMonth() + 1}/${startDate.getFullYear()}`

    const endDate = new Date(project.endDate)
    const yearDuration = endDate.getFullYear() - startDate.getFullYear()
    const monthDuration = endDate.getMonth() - startDate.getMonth()
    const [currentUser, setCurrentUser] = useState(null);
    const [userId, setUserId] = useState(null)
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                setUserId(user.uid);
            } else {
                setUserId("");
            }
        });
        return unsubscribe;
    }, []);

    console.log(currentUser)

    // useEffect(() => {
    //     if (!project) return;
    //     const pid = project.projectid;
    //     if (pid) {
    //         axios.get(`/api/media/project/${pid}`)
    //             .then(res => setMedia(res.data))
    //             .catch(err => console.error('Error fetching media:', err));
    //     } else {
    //         console.warn('Project ID not found in the fetched project.');
    //     }
    // }, [project]);


    // useEffect(() => {
    //     let didRun = false;

    //     const fetchCart = async () => {
    //         if (didRun) return;

    //         // const user = await getCurrentUser();
    //         // setUser(user);
    //         console.log(currentUser)

    //         if (currentUser) {
    //             console.log("i am heeererere")
    //             const idToken = await currentUser.getIdToken();
    //             const guestCart = getGuestCart();
    //             await mergeGuestCartToUserCart(guestCart, idToken); // ✅ now safe

    //             fetch(`/api/cart`, {
    //                 headers: {
    //                     Authorization: `Bearer ${idToken}`,
    //                 },
    //             })
    //                 .then((res) => res.json())
    //                 .then((data) => setCartItems(data));
    //             router.refresh(); // This will reload the page
    //         } else {
    //             const localCart = getGuestCart();
    //             setCartItems(localCart);
    //         }

    //         didRun = true;

    //     };

    //     fetchCart();
    // }, []);

    // useEffect(() => {
    //     const fetchCart = async () => {
    //         if (currentUser) {
    //             const idToken = await currentUser.getIdToken();
    //             const guestCart = getGuestCart();
    //             await mergeGuestCartToUserCart(guestCart, idToken);

    //             const res = await fetch(`/api/cart`, {
    //                 headers: {
    //                     Authorization: `Bearer ${idToken}`,
    //                 },
    //             });
    //             const data = await res.json();
    //             setCartItems(data);
    //             router.refresh();
    //         } else {
    //             // No user logged in, use guest cart from localStorage
    //             const localCart = getGuestCart();
    //             setCartItems(localCart);
    //         }
    //     };

    //     fetchCart();
    // }, [currentUser]); // <-- run whenever currentUser changes



    // useEffect(() => {
    //     console.log(currentUser)
    //     if (currentUser) {
    //         console.log('i am heree')
    //         const idToken = currentUser.getIdToken();
    //         // Logged-in user: Fetch cart from backend
    //         fetch(`/api/cart`, {
    //             headers: {
    //                 Authorization: `Bearer ${idToken}`,
    //             },
    //         })
    //             .then((res) => res.json())
    //             .then((cartItems) => {
    //                 const found = cartItems.some(item => item.productId == currentProjectId);
    //                 const item = cartItems.find(item => item.productId == currentProjectId);
    //                 console.log(item)
    //                 setQuantity(item ? item.quantity : 0);
    //                 setIsInCart(found);
    //             });
    //     } else {
    //         console.log('maybe i am here')
    //         // Guest user: Check from localStorage
    //         const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
    //         const found = guestCart.some(item => item.productId == currentProjectId);
    //         const item = guestCart.find(item => item.productId == currentProjectId);
    //         setQuantity(item ? item.quantity : 0);
    //         setIsInCart(found);
    //     }
    // }, [currentProjectId,currentUser]);

    useEffect(() => {
        const fetchAndSetCart = async () => {
            let cartData = [];

            if (currentUser) {
                // ✅ Logged-in user
                const idToken = await currentUser.getIdToken();

                // Merge guest cart into backend if exists
                const guestCart = getGuestCart();
                if (guestCart.length > 0) {
                    await mergeGuestCartToUserCart(guestCart, idToken);
                }

                // Fetch backend cart
                const res = await fetch(`/api/cart`, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                });

                if (res.ok) {
                    cartData = await res.json();
                } else {
                    console.error("Failed to fetch backend cart");
                    cartData = [];
                }

                // Clear guest cart now that it's merged
                localStorage.removeItem("guestCart");
            }
            else {
                // ❌ Guest user
                cartData = getGuestCart();
            }

            // ✅ Update full cart state
            setCartItems(cartData);

            // ✅ Also update per-project state if we're on a project page
            if (currentProjectId || currentProjectId === 0) {
                const foundItem = cartData.find(
                    (item) => item.productId == currentProjectId
                );
                setQuantity(foundItem ? foundItem.quantity : 0);
                setIsInCart(!!foundItem);
            }
        };

        fetchAndSetCart();
    }, [currentUser, currentProjectId]);


    const handleAddToCart = async () => {
        const user = await getCurrentUser();

        if (currentUser) {
            console.log(currentUser)
            const idToken = await currentUser.getIdToken();

            // Add to backend cart
            await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ productId: project.projectid, productName: project.projectName }),
            });
        } else {
            // 🛒 Guest → update local storage
            const cart = getGuestCart() || [];
            const existing = cart.find((item) => item.productId === project.projectid);
            if (!existing) {
                cart.push({ productId: project.projectid, quantity: 1, productName: project.projectName });
            }
            saveGuestCart(cart);
        }
        setIsInCart(true)
        setQuantity(1)
    };

    const handleIncrease = async () => {
        if (currentUser) {
            const idToken = await currentUser.getIdToken();
            await fetch('/api/cart/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    productId: currentProjectId,
                    delta: 1
                }),
            });
        } else {
            const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
            const updatedCart = guestCart.map(item =>
                item.productId == currentProjectId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }

        // Immediately update UI
        setQuantity((prev) => prev + 1);
    };

    const handleDecrease = async () => {
        if (quantity <= 0) return;

        if (currentUser) {
            const idToken = await currentUser.getIdToken();
            await fetch('/api/cart/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    productId: currentProjectId,
                    delta: -1,
                }),
            });
        } else {
            const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
            const updatedCart = guestCart
                .map(item =>
                    item.productId == currentProjectId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0); // remove if quantity becomes 0
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }

        // 🟢 Immediately update UI
        setQuantity((prev) => Math.max(prev - 1, 0));
    };

    // if(media.length>0){
    //     console.log(media)
    // }

    const getSDGTitle = (sdg: number): string => {
        const titles: Record<number, string> = {
            1: 'No Poverty',
            2: 'Zero Hunger',
            3: 'Good Health',
            5: 'Gender Equality',
            7: 'Clean Energy',
            9: 'Innovation',
            11: 'Sustainable Cities',
            12: 'Responsible Consumption',
            13: 'Climate Action',
            15: 'Life on Land',
            17: 'Partnerships'
        };
        return titles[sdg] || `Goal ${sdg}`;
    };

    return (
        <div className="min-h-screen bg-[#f4fff6]">
            <Navbar activePage='marketplace'/>
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onBack}
                                className="flex items-center gap-2 hover:bg-green-50"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Back to Projects</span>
                                <span className="sm:hidden">Back</span>
                            </Button>

                            {/* Breadcrumb */}
                            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                                <span>Projects</span>
                                <span>/</span>
                                <span className="capitalize">{project.projectType.replace('-', ' ')}</span>
                                <span>/</span>
                                <span className="text-gray-900 font-medium truncate max-w-48">
                                    {project.projectName}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`hover:bg-red-50 ${isFavorite ? "text-red-500" : "text-gray-500"}`}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                <span className="hidden sm:inline ml-2">
                                    {isFavorite ? 'Saved' : 'Save'}
                                </span>
                            </Button>
                            <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                                <Share2 className="w-5 h-5" />
                                <span className="hidden sm:inline ml-2">Share</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
                {/* <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        /> */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium text-sm sm:text-base">{project.locationDetails}</span>
                            </div>
                            {project.verifierId && (
                                <Badge className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                                    <Verified className="w-4 h-4 mr-2" />
                                    Verified Project
                                </Badge>
                            )}
                            <Badge className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full capitalize">
                                {project.projectType.replace('-', ' ')}
                            </Badge>
                            {media && media.length > 0 && (
                                <Badge className="bg-purple-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                                    <Camera className="w-4 h-4 mr-2" />
                                    {media.length} Media Files
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 leading-tight">
                            {project.projectName}
                        </h1>
                        <p className="text-lg sm:text-xl opacity-95 max-w-3xl leading-relaxed">
                            {project.projectDescription}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Content Area */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Navigation Tabs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 bg-transparent gap-1 h-auto p-0">
                                    <TabsTrigger
                                        value="overview"
                                        className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-medium rounded-xl py-3 px-2 sm:px-4 text-xs sm:text-sm"
                                    >
                                        <span className="hidden sm:inline">Overview</span>
                                        <span className="sm:hidden">Info</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="media"
                                        className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-medium rounded-xl py-3 px-2 sm:px-4 text-xs sm:text-sm"
                                    >
                                        <Camera className="w-4 h-4 sm:hidden" />
                                        <span className="hidden sm:inline">Media</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="impact"
                                        className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-medium rounded-xl py-3 px-2 sm:px-4 text-xs sm:text-sm"
                                    >
                                        Impact
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="verification"
                                        className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-medium rounded-xl py-3 px-2 sm:px-4 text-xs sm:text-sm"
                                    >
                                        <span className="hidden sm:inline">Verification</span>
                                        <span className="sm:hidden">Verified</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="sdg"
                                        className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-medium rounded-xl py-3 px-2 sm:px-4 text-xs sm:text-sm"
                                    >
                                        <span className="hidden sm:inline">SDG Goals</span>
                                        <span className="sm:hidden">Goals</span>
                                    </TabsTrigger>
                                </TabsList>

                                <div className="mt-8">
                                    <TabsContent value="media" className="mt-0">
                                        <MediaGallery
                                            media={media || []}
                                            projectTitle={project.projectName}
                                        />
                                    </TabsContent>

                                    <TabsContent value="overview" className="space-y-8 mt-0">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                        <Globe className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    Project Details
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                        <span className="text-gray-600">Location:</span>
                                                        <span className="font-semibold text-gray-900">{project.locationDetails}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                        <span className="text-gray-600">Category:</span>
                                                        <span className="font-semibold text-gray-900 capitalize">{project.projectType.replace('-', ' ')}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                        <span className="text-gray-600">Start Date:</span>
                                                        <span className="font-semibold text-gray-900">{formattedStartDate}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                        <span className="text-gray-600">Duration:</span>
                                                        <span className="font-semibold text-gray-900"> {yearDuration > 0 ? `${yearDuration} years and` : ''}{monthDuration} month</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2">
                                                        <span className="text-gray-600">Status:</span>
                                                        <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Active</Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Need to work on this --- may need to create some extra columns or tables*/}
                                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Users className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    Community Impact
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                        <span className="text-gray-600">Beneficiaries:</span>
                                                        <span className="font-semibold text-gray-900">50,000 people</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                        <span className="text-gray-600">Jobs Created:</span>
                                                        <span className="font-semibold text-gray-900">2,500</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                        <span className="text-gray-600">Local Investment:</span>
                                                        <span className="font-semibold text-gray-900">$15M</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2">
                                                        <span className="text-gray-600">Rating:</span>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                                                ))}
                                                            </div>
                                                            <span className="font-semibold text-gray-900">4.8</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Need to work on this */}
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <Clock className="w-5 h-5 text-purple-600" />
                                                </div>
                                                Project Timeline
                                            </h3>
                                            <div className="space-y-6">
                                                {[
                                                    { date: 'Jan 2024', title: 'Project Launch', status: 'completed', description: 'Initial project setup and team deployment' },
                                                    { date: 'Jun 2024', title: 'First Verification', status: 'completed', description: 'Independent third-party verification completed' },
                                                    { date: 'Dec 2024', title: 'Mid-term Review', status: 'current', description: 'Ongoing assessment of project performance' },
                                                    { date: 'Jun 2025', title: 'Second Verification', status: 'upcoming', description: 'Scheduled follow-up verification audit' }
                                                ].map((milestone, index) => (
                                                    <div key={index} className="flex items-start gap-4 relative">
                                                        <div className={`w-4 h-4 rounded-full mt-1 z-10 ${milestone.status === 'completed' ? 'bg-green-500' :
                                                            milestone.status === 'current' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                                                            }`} />
                                                        {index < 3 && (
                                                            <div className="absolute left-2 top-5 w-0.5 h-8 bg-gray-200" />
                                                        )}
                                                        <div className="flex-1 pb-2">
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                                                                <p className="font-semibold text-gray-900">{milestone.title}</p>
                                                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full w-fit">{milestone.date}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">{milestone.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="impact" className="space-y-8 mt-0">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Leaf className="w-5 h-5 text-green-600" />
                                                </div>
                                                Environmental Impact Metrics
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 text-center group hover:shadow-md transition-all">
                                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <TrendingUp className="w-6 h-6 text-white" />
                                                    </div>
                                                    <p className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">
                                                        {/* {typeof value === 'number' ? value.toLocaleString() : value} */}
                                                    </p>
                                                    <p className="text-gray-700 font-medium capitalize text-sm">
                                                        {project.co2Offset}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                            <h4 className="text-xl font-bold mb-4 flex items-center gap-3 text-gray-900">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Shield className="w-5 h-5 text-blue-600" />
                                                </div>
                                                Methodology & Monitoring
                                            </h4>
                                            <div className="prose prose-gray max-w-none">
                                                <p className="text-gray-700 leading-relaxed mb-4">
                                                    This project follows internationally recognized carbon accounting methodologies
                                                    and is monitored using satellite data, field surveys, and third-party audits
                                                    to ensure accurate impact measurement.
                                                </p>
                                                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                                                    <div className="bg-blue-50 rounded-lg p-4">
                                                        <h5 className="font-semibold text-blue-900 mb-2">Monitoring Technology</h5>
                                                        <p className="text-sm text-blue-800">Satellite imagery, IoT sensors, and field verification</p>
                                                    </div>
                                                    <div className="bg-green-50 rounded-lg p-4">
                                                        <h5 className="font-semibold text-green-900 mb-2">Reporting Frequency</h5>
                                                        <p className="text-sm text-green-800">Monthly monitoring, quarterly reports</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="verification" className="space-y-8 mt-0">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Shield className="w-5 h-5 text-green-600" />
                                                </div>
                                                Verification & Standards
                                            </h3>

                                            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-6">
                                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Verified className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                                                            Verified by {project.verifierId.verifierName}
                                                        </h4>
                                                        <p className="text-gray-700 mb-4">
                                                            This project has been independently verified and meets the highest international
                                                            standards for carbon offset projects. Regular monitoring ensures continued compliance
                                                            and accurate impact measurement.
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Badge className="bg-green-100 text-green-800 px-3 py-1">Independently Verified</Badge>
                                                            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">Continuously Monitored</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                            <Award className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <h4 className="font-bold text-gray-900">Methodology</h4>
                                                    </div>
                                                    <p className="text-gray-700 font-medium">VM0006 - Carbon Accounting</p>
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        Internationally recognized methodology for measuring carbon impact
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                            <Globe className="w-5 h-5 text-indigo-600" />
                                                        </div>
                                                        <h4 className="font-bold text-gray-900">Registry</h4>
                                                    </div>
                                                    <p className="text-gray-700 font-medium">Verified Carbon Standard</p>
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        Leading global standard for voluntary carbon market
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                            <h4 className="text-xl font-bold mb-4 text-gray-900">Verification Process</h4>
                                            <div className="space-y-4">
                                                {[
                                                    { step: 1, title: 'Initial Assessment', description: 'Comprehensive project evaluation and baseline establishment' },
                                                    { step: 2, title: 'Independent Audit', description: 'Third-party verification of methodologies and impact calculations' },
                                                    { step: 3, title: 'Ongoing Monitoring', description: 'Continuous verification of project performance and impact delivery' },
                                                    { step: 4, title: 'Annual Review', description: 'Yearly comprehensive assessment and certification renewal' }
                                                ].map((item) => (
                                                    <div key={item.step} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                            {item.step}
                                                        </div>
                                                        <div>
                                                            <h5 className="font-semibold text-gray-900 mb-1">{item.title}</h5>
                                                            <p className="text-sm text-gray-600">{item.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="sdg" className="space-y-8 mt-0">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Globe className="w-5 h-5 text-blue-600" />
                                                </div>
                                                UN Sustainable Development Goals
                                            </h3>
                                            <p className="text-gray-600 mb-8">
                                                This project contributes to {project.sdgAlignment.length} of the UN's 17 Sustainable Development Goals,
                                                creating positive impact beyond carbon reduction.
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {project.sdgAlignment.map((sdg) => (
                                                    <div key={sdg} className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 text-center group hover:shadow-lg transition-all cursor-pointer">
                                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg sm:text-xl shadow-lg group-hover:scale-105 transition-transform">
                                                            {sdg}
                                                        </div>
                                                        <h4 className="font-bold text-gray-900 mb-2">SDG {sdg}</h4>
                                                        <p className="text-sm text-gray-700 font-medium">{getSDGTitle(sdg)}</p>
                                                        <div className="mt-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                            Active Contribution
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                            <h4 className="text-xl font-bold mb-4 text-gray-900">Impact Alignment</h4>
                                            <div className="prose prose-gray max-w-none">
                                                <p className="text-gray-700 leading-relaxed mb-4">
                                                    Beyond carbon reduction, this project creates measurable progress toward global sustainability targets
                                                    through community development, environmental conservation, and economic empowerment.
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                                        <div className="text-2xl font-bold text-green-600 mb-1">85%</div>
                                                        <div className="text-sm text-gray-600">Community Engagement</div>
                                                    </div>
                                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                        <div className="text-2xl font-bold text-blue-600 mb-1">95%</div>
                                                        <div className="text-sm text-gray-600">Environmental Protection</div>
                                                    </div>
                                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                                        <div className="text-2xl font-bold text-purple-600 mb-1">75%</div>
                                                        <div className="text-sm text-gray-600">Economic Development</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                </div>
                                Project Documents
                            </h3>
                            <div className="space-y-3">
                                {[
                                    'Project-Verification-Document.pdf',
                                    'Environmental-Impact-Report.pdf',
                                    'Community-Benefit-Assessment.pdf'
                                ].map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            <span className="text-blue-600 font-medium">{doc}</span>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sticky Purchase Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            {/* Pricing Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                                        <Verified className="w-4 h-4" />
                                        Verified Impact
                                    </div>
                                    <p className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">
                                        {/* ${project.price.toFixed(2)} */}
                                        $10
                                    </p>
                                    <p className="text-gray-600 font-medium">per ton CO₂ offset</p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="amount" className="text-sm font-semibold text-gray-900 mb-3 block">
                                            Number of tons to offset
                                        </Label>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleDecrease}
                                                className="w-10 h-10 p-0 rounded-full"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <Input
                                                id="amount"
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setPurchaseAmount(Math.max(1, parseInt(e.target.value) || 1))}
                                                min="1"
                                                className="text-center h-12 text-lg font-medium bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleIncrease}
                                                className="w-10 h-10 p-0 rounded-full"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-semibold text-gray-900">Total Cost:</span>
                                            <span className="text-2xl font-bold text-green-600">${totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">CO₂ Impact:</span>
                                            <span className="font-semibold text-gray-900">{quantity} ton{quantity !== 1 ? 's' : ''} offset</span>
                                        </div>
                                        <div className="mt-3 p-2 bg-white/60 rounded-lg">
                                            <p className="text-xs text-gray-600 text-center">
                                                🌱 Equivalent to planting {(quantity * 16).toLocaleString()} trees
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            onClick={handlePurchase}
                                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                            size="lg"
                                        >
                                            <ShoppingCart className="w-5 h-5 mr-3" />
                                            Buy Now
                                        </Button>

                                        {quantity > 0 ?
                                            <Link href="/dashboard"><Button
                                                variant="outline"
                                                onClick={() => {
                                                    localStorage.setItem("dashboardActiveTab", "cart_wishlist");
                                                }}
                                                className="w-full h-12 border-2 border-green-500 text-green-700 hover:bg-green-50 font-semibold rounded-xl transition-all"
                                                size="lg">
                                                Go to Cart
                                            </Button></Link>
                                            :
                                            <Button
                                                onClick={handleAddToCart}
                                                variant="outline"
                                                className="w-full h-12 border-2 border-green-500 text-green-700 hover:bg-green-50 font-semibold rounded-xl transition-all"
                                                size="lg"
                                            >
                                                Add to Cart
                                            </Button>}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        className="w-full text-gray-600 hover:text-green-700"
                                        size="sm"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Project Details
                                    </Button>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-4">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <TrendingUp className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                                        {project.co2Offset.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-600 font-medium">tons CO₂ offset potential</p>
                                    <div className="mt-3 bg-blue-50 rounded-lg p-2">
                                        <p className="text-xs text-blue-700">Total project capacity</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Award className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div className="flex items-center justify-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">4.8</p>
                                    <p className="text-sm text-gray-600 font-medium">community impact rating</p>
                                    <div className="mt-3 bg-yellow-50 rounded-lg p-2">
                                        <p className="text-xs text-yellow-700">Based on 500+ reviews</p>
                                    </div>
                                </div>

                                {/* Media & Transparency Card */}
                                {media && media.length > 0 && (
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Camera className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <p className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                                                {media.length}
                                            </p>
                                            <p className="text-sm text-gray-600 font-medium mb-3">media files available</p>

                                            {/* Media type breakdown */}
                                            <div className="space-y-2 text-xs">
                                                {media.some(m => m.type === 'image') && (
                                                    <div className="flex items-center justify-between text-gray-600">
                                                        <span>Photos & Images</span>
                                                        <span className="font-medium">{media.filter(m => m.type === 'image').length}</span>
                                                    </div>
                                                )}
                                                {media.some(m => m.type === 'video') && (
                                                    <div className="flex items-center justify-between text-gray-600">
                                                        <span>Videos</span>
                                                        <span className="font-medium">{media.filter(m => m.type === 'video').length}</span>
                                                    </div>
                                                )}
                                                {media.some(m => m.type === 'satellite') && (
                                                    <div className="flex items-center justify-between text-gray-600">
                                                        <span>Satellite Data</span>
                                                        <span className="font-medium">{media.filter(m => m.type === 'satellite').length}</span>
                                                    </div>
                                                )}
                                                {media.some(m => m.type === 'map') && (
                                                    <div className="flex items-center justify-between text-gray-600">
                                                        <span>3D Maps</span>
                                                        <span className="font-medium">{media.filter(m => m.type === 'map').length}</span>
                                                    </div>
                                                )}
                                                {media.some(m => m.type === 'drone') && (
                                                    <div className="flex items-center justify-between text-gray-600">
                                                        <span>Drone Footage</span>
                                                        <span className="font-medium">{media.filter(m => m.type === 'drone').length}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 bg-purple-50 rounded-lg p-3">
                                                <p className="text-xs text-purple-700">🔍 Full transparency with visual evidence</p>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setActiveTab('media')}
                                                className="w-full mt-3 border-purple-200 text-purple-700 hover:bg-purple-50"
                                            >
                                                <Camera className="w-4 h-4 mr-2" />
                                                View All Media
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDecrease}
                                className="w-8 h-8 p-0 rounded-full"
                            >
                                <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setPurchaseAmount(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                className="text-center h-8 w-16 text-sm"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleIncrease}
                                className="w-8 h-8 p-0 rounded-full"
                            >
                                <Plus className="w-3 h-3" />
                            </Button>
                        </div>
                        <div className="text-xs text-gray-600">
                            Total: ${totalPrice.toFixed(2)}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {quantity > 0 ?
                            <Link href='/dashboard'>
                                <Button
                                    onClick={() => {
                                        localStorage.setItem("dashboardActiveTab", "cart_wishlist");
                                    }}
                                    variant="outline"
                                    className="border-green-500 text-green-700 hover:bg-green-50"
                                >
                                    Go to Cart
                                </Button>
                            </Link>
                            : <Button
                                onClick={handleAddToCart}
                                variant="outline"
                                className="border-green-500 text-green-700 hover:bg-green-50"
                            >
                                Add to Cart
                            </Button>}
                        <Button
                            onClick={handlePurchase}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Buy Now
                        </Button>
                    </div>
                </div>
            </div>

            {/* Add bottom padding to prevent content being hidden behind mobile action bar */}
            <div className="lg:hidden h-20" />
        </div>
    );
}