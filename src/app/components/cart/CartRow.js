"use client"
import React from 'react'
import { TableCell, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Minus, Plus, Trash2, Clock, Heart } from 'lucide-react';

const CartRow = ({ item, updateQuantity, removeItem }) => {
    const [project, setProject] = React.useState();
    const [loading, setLoading] = React.useState(true);


    React.useEffect(() => {
        let cancelled = false;

        async function fetchProject() {
            setLoading(true);
            try {
                const resp = await fetch(
                    `/api/getByProjectId/${item.productId}` // use correct API path
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
    }, [item.productId]);

    if (loading) {
        return (
            <tr>
                <td colSpan={8}>
                    <div className="p-4 text-center text-gray-500">Loading project details...</div>
                </td>
            </tr>
        );
    }

    if (!project) {
        return (
            <tr>
                <td colSpan={8}>
                    <div className="p-4 text-center text-red-500">Project not found</div>
                </td>
            </tr>
        );
    }

    function getTimeRemaining(createdAt, hoursValid = 24) {
        const created = new Date(createdAt).getTime();
        const expiry = created + hoursValid * 60 * 60 * 1000;
        const now = Date.now();

        const diff = expiry - now;  // milliseconds left until expiry

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return {
            hours,
            minutes,
            isExpiring: diff < 60 * 60 * 1000 && diff > 0,
            expired: diff < 0,
        };
    }

    const getCreditTypeColor = (type) => {
        switch (type) {
            case 'blue':
                return 'bg-blue-100 text-blue-800';
            case 'green':
                return 'bg-green-100 text-green-800';
            case 'gold':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const handleInputChange = (e) => {
        const newVal = parseInt(e.target.value) || 1;
        console.log("This is the newValue", newVal)
        const delta = newVal - item.quantity;
        if (delta !== 0) updateQuantity(item.productId, delta);
    };

    // Example usage on ProjectCard
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
                // handle UI feedback, e.g. show success toast or refetch wishlist state
                alert("Added to wishlist!");
                removeItem(item.productId); // Optionally remove from cart
            } else {
                alert("Failed to add to wishlist.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred.");
        }
    };

    const getCreditTypeIcon = (type) => {
        switch (type) {
            case 'blue':
                return '🌊';
            case 'green':
                return '🌱';
            case 'gold':
                return '⭐';
            default:
                return '♻️';
        }
    };
    const timeRemaining = getTimeRemaining(item.createdAt, 24);
    return (

        <TableRow key={item.id}>
            <TableCell>
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                    {/* <span className="text-lg">{getCreditTypeIcon(item.creditType)}</span> */}
                </div>
            </TableCell>
            <TableCell className="max-w-48">
                <div className="space-y-1">
                    <div className="font-medium truncate" title={project.projectName}>
                        {project.projectName}
                    </div>
                    <div className="text-xs text-(--muted-foreground)">
                        {project.id} • {project.locationDetails}
                    </div>
                    {item.stockLeft < 20 && (
                        <Badge variant="outline" className="text-orange-700 bg-orange-50 border-orange-200">
                            Only {item.stockLeft} left
                        </Badge>
                    )}
                </div>
            </TableCell>
            <TableCell>
                {/* <Badge variant="outline" className={getCreditTypeColor(item.creditType)}>
                       {getCreditTypeIcon(item.creditType)} {item.creditType.charAt(0).toUpperCase() + item.creditType.slice(1)}
                     </Badge> */}
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, -1)}
                        disabled={item.quantity <= 1}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                        type="number"
                        value={item.quantity}
                        onChange={handleInputChange}
                        className="w-16 text-center"
                        min="1"
                        max={item.quantity + 100}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, 1)}
                        disabled={item.quantity >= item.stockLeft + item.quantity}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </TableCell>
            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
            <TableCell className="text-right font-medium">${item.price.toFixed(2)}</TableCell>
            <TableCell className="text-center">
                <div className={`flex items-center justify-center gap-1 ${timeRemaining.isExpiring ? 'text-red-600' : 'text-(--muted-foreground)'}`}>
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">
                        {timeRemaining.hours}h {timeRemaining.minutes}m
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => moveToWishlist(item.id)}
                        onClick={() => addToWishlist({
                            userId: item.userId,
                            projectId: item.productId,
                            projectName: project.projectName,
                            creditType: 'gold',
                            projectType: project.projectType,
                            notifyOnPrice: true,          // or from a checkbox/setting
                            notifyOnAvailable: true      // or from a checkbox/setting
                        })}
                        title="Move to Wishlist"
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.productId)}
                        title="Remove from Cart"
                        className="text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default CartRow