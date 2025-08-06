"use client";
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Search, Filter, ShoppingCart, X, Heart, TrendingDown, Bell, Share2, MapPin, Award } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

const sdgOptions = [
    { id: '1', label: 'No Poverty', description: 'SDG 1' },
    { id: '2', label: 'Zero Hunger', description: 'SDG 2' },
    { id: '3', label: 'Good Health and Well-being', description: 'SDG 3' },
    { id: '6', label: 'Clean Water and Sanitation', description: 'SDG 6' },
    { id: '7', label: 'Affordable and Clean Energy', description: 'SDG 7' },
    { id: '8', label: 'Decent Work and Economic Growth', description: 'SDG 8' },
    { id: '13', label: 'Climate Action', description: 'SDG 13' },
    { id: '14', label: 'Life Below Water', description: 'SDG 14' },
    { id: '15', label: 'Life on Land', description: 'SDG 15' }
];

const WishlistCard = ({ item, removeFromWishlist, toggleNotification, user }) => {
    const [project, setProject] = React.useState();
    const [loading, setLoading] = React.useState(true);


    React.useEffect(() => {
        let cancelled = false;

        async function fetchProject() {
            setLoading(true);
            try {
                const resp = await fetch(
                    `/api/getByProjectId/${item.projectId}` // use correct API path
                );
                if (!resp.ok) throw new Error("Failed to fetch project");
                const data = await resp.json();
                if (!cancelled) setProject(data);
            } catch (err) {
                if (!cancelled) setProject(null);
                // Optionally handle error (show error UI, etc)
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchProject();

        return () => {
            cancelled = true;
        };
    }, [item.projectId]);

    if (!project) {
        return (
            <div>
                <div colSpan={8}>
                    <div className="p-4 text-center text-red-500">Project not found</div>
                </div>
            </div>
        );
    }

    const addToCart = async (projectId) => {
        if (!user) {
            alert('Please login to add items to the cart.');
            return;
        }
        console.log('Adding to cart for project ID:', projectId);
        const idToken = await user.getIdToken();

        const submitItem = {
            productId: projectId,
            productName: item.projectName || 'Unknown Project',
            // Do not set userId or quantity here; backend sets them
        };

        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify(submitItem),
            });

            if (response.ok) {
                alert('Item added to cart!');
                removeFromWishlist(item.id); // Remove from wishlist after adding to cart
                // Optionally refresh cart state or UI here
            } else {
                const errorMsg = await response.text();
                alert(`Failed to add to cart: ${errorMsg}`);
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert('Something went wrong! Please try again.');
        }
    };
    console.log('Wishlist Item:', item);
    console.log('Project Name:', project);

    return (
        <div>
            <Card key={item.id} className="relative overflow-hidden">
                <CardHeader className="p-0">
                    <div className="relative">
                        {/* <ImageWithFallback
                            src={item.projectImage}
                            alt={item.projectName}
                            className="w-full h-48 object-cover"
                        /> */}
                        <div className="absolute top-3 right-3 flex gap-2">
                            {/* <Badge variant="outline" className={getCreditTypeColor(item.creditType)}>
                                {getCreditTypeIcon(item.creditType)} {item.creditType}
                            </Badge> */}
                            {/* {item.priceChange !== 0 && (
                                <Badge variant="outline" className={item.priceChange < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                    {item.priceChange < 0 ? '' : '+'}{item.priceChange.toFixed(1)}%
                                </Badge>
                            )} */}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-3 left-3 text-red-500 hover:text-red-600"
                            onClick={() => removeFromWishlist(item.id)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-base mb-1">{project.projectName}</h3>
                            <div className="flex items-center text-sm text-(--muted-foreground) mb-2">
                                <MapPin className="h-3 w-3 mr-1" />
                                {project.locationDetails} • {item.projectId}
                            </div>
                            <p className="text-sm text-(--muted-foreground)">{project.impact}</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-xl font-bold text-green-600">
                                {/* ${item.pricePerTonne.toFixed(2)} */} $10
                            </div>
                            <div className="text-sm text-(--muted-foreground)">
                                per tonne
                            </div>
                        </div>

                        {/* {item.availableStock === 0 ? (
                            <Badge variant="outline" className="bg-red-100 text-red-800 w-full justify-center">
                                Out of Stock
                            </Badge>
                        ) : item.availableStock < 100 ? (
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 w-full justify-center">
                                Low Stock: {item.availableStock} left
                            </Badge>
                        ) : (
                            <div className="text-sm text-green-600">
                                {item.availableStock} credits available
                            </div>
                        )} */}

                        <div className="flex flex-wrap gap-1">
                            {project.sdgAlignment.map((goal) => (
                                <Badge key={goal} variant="outline" className="text-xs">
                                    {sdgOptions.find((option) => option.id === goal)?.description || `SDG ${goal}`}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Bell className="h-3 w-3" />
                                    <Switch
                                        size="sm"
                                        // checked={item.notifyOnPrice}
                                        onCheckedChange={() => toggleNotification(item.id, 'price')}
                                    />
                                </div>
                                <Button variant="ghost" size="sm" title="Share">
                                    <Share2 className="h-3 w-3" />
                                </Button>
                            </div>
                            <Button
                                size="sm"
                                // disabled={item.availableStock === 0}
                                onClick={() => addToCart(item.projectId)}
                            >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default WishlistCard