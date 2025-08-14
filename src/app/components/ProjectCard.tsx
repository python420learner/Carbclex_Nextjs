"use client"
import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { getCurrentUser } from "../firebase";
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Card, CardContent } from './ui/card';
import { MapPin, Verified, TrendingUp, ShoppingCart, Star, Globe, Award, Heart } from 'lucide-react';

// interface ProjectCardProps {
//   project: ProjectData;
//   onClick: () => void;
//   viewMode?: 'grid' | 'list';
//   featured?: boolean;
// }

// SDG mapping for tooltips
const sdgDescriptions: Record<number, string> = {
    1: "No Poverty",
    2: "Zero Hunger",
    3: "Good Health and Well-being",
    4: "Quality Education",
    5: "Gender Equality",
    6: "Clean Water and Sanitation",
    7: "Affordable and Clean Energy",
    8: "Decent Work and Economic Growth",
    9: "Industry, Innovation and Infrastructure",
    10: "Reduced Inequalities",
    11: "Sustainable Cities and Communities",
    12: "Responsible Consumption and Production",
    13: "Climate Action",
    14: "Life Below Water",
    15: "Life on Land",
    16: "Peace, Justice and Strong Institutions",
    17: "Partnerships for the Goals"
};

export default function ProjectCard({ project, onClick, viewMode = 'grid', featured }) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlist, setWishlist] = useState([]);
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
                setWishlist([]);
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!userId) {
            setWishlist([]);
            return;
        }
        fetch(`/api/wishlist/user/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setWishlist(data);
                } else {
                    setWishlist([]);
                    console.warn('Wishlist fetched data not an array:', data);
                }
            })
            .catch(err => console.error('Failed to fetch wishlist:', err));
    }, [userId]);

    useEffect(() => {
        if (!project || !Array.isArray(wishlist) || wishlist.length === 0) {
            setIsWishlisted(false);
            return;
        }
        const found = wishlist.some(item => item.projectId === project.projectid);
        setIsWishlisted(found);
    }, [project, wishlist]);

    // useEffect(() => {
    //     if (!currentUser) return;
    //     fetch(`/api/wishlist/user/${userId}`)
    //         .then(res => res.json())
    //         .then(data => setWishlist(data))
    //         .catch(err => console.error('Failed to fetch wishlist:', err));
    // }, [userId]);

    // useEffect(() => {
    //     if (!project || wishlist.length === 0) {
    //         setIsWishlisted(false);
    //         return;
    //     }
    //     // Check if current project is in user's wishlist
    //     const found = wishlist.some(item => item.projectId === project.projectid);
    //     setIsWishlisted(found);
    // }, [project, wishlist]);

    const handlePurchase = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('Purchase:', project.id);
    };

    const addToWishlist = async ({ userId, projectId, notifyOnPrice, notifyOnAvailable, projectName, creditType, projectType }) => {
        try {
            const res = await fetch("/api/wishlist/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    projectId,
                    notifyOnPrice,
                    notifyOnAvailable,
                    projectName,
                    creditType,
                    projectType
                    // NOTE: do not send id or addedAt, backend generates these!
                }),
            });
            if (res.ok) {
                const res = await fetch(`/api/wishlist/user/${userId}`);
                const data = await res.json();
                setWishlist(data);
                setIsWishlisted(true);
                // handle UI feedback, e.g. show success toast or refetch wishlist state
            } else {
                alert("Failed to add to wishlist.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred.");
        }
    };

    const removeFromWishlist = async (id) => {
        try {
            const res = await fetch(`/api/wishlist/delete/${id}`, {
                method: 'DELETE',
                // Include headers if your backend requires auth tokens etc.
                // headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error('Failed to delete wishlist item');
            }

            // Update state by removing deleted item
            setWishlist((prev) => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error(error);
            alert('Error removing wishlist item');
        }
    };


    const handleWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentUser) {
            if (!isWishlisted) {
                setIsWishlisted(!isWishlisted);
                addToWishlist({ userId, projectId: project.projectid, projectName: project.projectName, creditType: 'gold', projectType: project.projectType, notifyOnPrice: true, notifyOnAvailable: true })
                console.log('Wishlist toggled:', project.id, !isWishlisted);
            } else {
                const item = wishlist.filter(i => i.projectId === project.projectid)
                console.log(item[0].id)
                removeFromWishlist(item[0].id)
                setIsWishlisted(false)
            }
        }
        else {
            alert('Need to get Logged-In')
        }
    };

    if (viewMode === 'list') {
        return (
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white border border-gray-200">
                <CardContent className="p-0">
                    <div className="flex" onClick={onClick}>
                        {/* Image */}
                        <div className="w-80 h-48 flex-shrink-0 relative overflow-hidden">
                            {/* <ImageWithFallback
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              /> */}
                            {featured && (
                                <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-900 px-3 py-1 shadow-lg">
                                    <Star className="w-4 h-4 mr-1 fill-current" />
                                    Featured
                                </Badge>
                            )}
                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                                {project.verified && (
                                    <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                                        <Verified className="w-5 h-5" />
                                    </div>
                                )}
                                <button
                                    onClick={handleWishlist}
                                    className={`p-2 rounded-full shadow-lg transition-all duration-200 ${isWishlisted
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                                        }`}
                                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-8 flex justify-between">
                            <div className="flex-1">
                                {/* Location & Verification */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium text-gray-700">{project.locationDetails}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {project.verfierName}
                                    </Badge>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                                    {project.projectName}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                    {project.projectDescription}
                                </p>

                                {/* SDG Alignment */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm text-gray-600 font-medium">SDGs:</span>
                                    <div className="flex gap-1">
                                        {project.sdgAlignment.slice(0, 4).map((sdg) => (
                                            <div
                                                key={sdg}
                                                className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold border border-blue-200 hover:bg-blue-200 transition-colors"
                                                title={`SDG ${sdg}: ${sdgDescriptions[sdg]}`}
                                            >
                                                {sdg}
                                            </div>
                                        ))}
                                        {project.sdgAlignment.length > 4 && (
                                            <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold border border-gray-200">
                                                +{project.sdgAlignment.length - 4}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                        <span>{project.co2Offset.toLocaleString()} tons CO₂</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4 text-blue-600" />
                                        <span>4.8 rating</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col items-end justify-between ml-8">
                                <div className="text-right mb-4">
                                    <p className="text-2xl font-bold text-green-600">
                                        {/* ${project.price.toFixed(2)} */} $50
                                    </p>
                                    <p className="text-sm text-gray-500">per ton</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleWishlist}
                                        className={`self-end p-2 rounded-full transition-all duration-200 ${isWishlisted
                                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-500'
                                            }`}
                                        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    </button>

                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onClick();
                                            }}
                                            className="px-6 py-2"
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            onClick={handlePurchase}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Buy
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            className={`cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white border border-gray-200 ${featured ? 'ring-2 ring-yellow-400 ring-offset-2' : ''
                }`}
            onClick={onClick}
        >
            <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    {/* <ImageWithFallback
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          /> */}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {featured && (
                            <Badge className="bg-yellow-500 text-yellow-900 px-3 py-1 shadow-lg">
                                <Star className="w-4 h-4 mr-1 fill-current" />
                                Featured
                            </Badge>
                        )}
                        <Badge
                            variant="secondary"
                            className="bg-green-600 text-white capitalize px-3 py-1 shadow-lg"
                        >
                            {project.projectType.replace('_', ' ')}
                        </Badge>
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {project.verified && (
                            <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                                <Verified className="w-5 h-5" />
                            </div>
                        )}
                        <button
                            onClick={handleWishlist}
                            className={`p-2 rounded-full shadow-lg transition-all duration-200 ${isWishlisted
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                                }`}
                            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-lg font-bold text-green-600">
                            {/* ${project.price.toFixed(2)} */} $10
                        </p>
                        <p className="text-xs text-gray-600">per ton</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Location */}
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700">{project.locationDetails}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2 min-h-[3rem]">
                        {project.projectName}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3 min-h-[4.5rem] leading-relaxed">
                        {project.projectDescription}
                    </p>

                    {/* Impact Metrics */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">CO₂ Offset Potential</span>
                            <span className="font-bold text-green-600">
                                {project.co2Offset.toLocaleString()} tons
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">4.8 impact rating</span>
                        </div>
                    </div>

                    {/* SDG Alignment */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-600 font-medium">UN SDGs:</span>
                            <Badge variant="outline" className="text-xs ml-auto">
                                {project.verifierId.verifierName}
                            </Badge>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                            {project.sdgAlignment.slice(0, 5).map((sdg) => (
                                <div
                                    key={sdg}
                                    className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold border border-blue-200 hover:bg-blue-200 transition-colors cursor-help"
                                    title={`SDG ${sdg}: ${sdgDescriptions[sdg]}`}
                                >
                                    {sdg}
                                </div>
                            ))}
                            {project.sdgAlignment.length > 5 && (
                                <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold border border-gray-200 cursor-help"
                                    title={`${project.sdgAlignment.length - 5} more SDGs`}>
                                    +{project.sdgAlignment.length - 5}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleWishlist}
                            className={`p-2 rounded-full transition-all duration-200 ${isWishlisted
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-500'
                                }`}
                            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>

                        <Button
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick();
                            }}
                            className="flex-1"
                        >
                            View Details
                        </Button>
                        <Button
                            onClick={handlePurchase}
                            className="bg-green-600 hover:bg-green-700 text-white px-6"
                        >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Buy
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}