"use client"
import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Locate } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
// import LeafletMapSelector from "./LeafletMapSelector";
import dynamic from 'next/dynamic';

const LeafletMapSelector = dynamic(() => import('./LeafletMapSelector'), { ssr: false });

// Use LeafletMapSelector normally in JSX


interface MapSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelect: (lat: number, lng: number, address?: string) => void;
    initialLat?: number;
    initialLng?: number;
}

export function MapSelector({
    isOpen,
    onClose,
    onLocationSelect,
    initialLat = 28.6139,
    initialLng = 77.2090
}: MapSelectorProps) {
    const [mapCenter, setMapCenter] = useState({ lat: initialLat, lng: initialLng });
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
        address?: string;
    } | null>(null);
    const mapRef = useRef(null);



    // Update map center if initial coordinates change
    useEffect(() => {
        if (initialLat && initialLng) {
            setMapCenter({ lat: initialLat, lng: initialLng });
            setSelectedLocation({ lat: initialLat, lng: initialLng });
        }
    }, [initialLat, initialLng]);

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedLocation({ lat, lng });
    };

    const handleSearch = (query: string) => {
        // Mock geocoding functionality - in production this would use a geocoding service
        const mockLocations = [
            { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090 },
            { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777 },
            { name: 'Bangalore, India', lat: 12.9716, lng: 77.5946 },
            { name: 'Chennai, India', lat: 13.0827, lng: 80.2707 },
            { name: 'Kolkata, India', lat: 22.5726, lng: 88.3639 },
            { name: 'Hyderabad, India', lat: 17.3850, lng: 78.4867 },
            { name: 'Pune, India', lat: 18.5204, lng: 73.8567 },
            { name: 'Ahmedabad, India', lat: 23.0225, lng: 72.5714 }
        ];

        const found = mockLocations.find(loc =>
            loc.name.toLowerCase().includes(query.toLowerCase()) ||
            query.toLowerCase().includes(loc.name.toLowerCase().split(',')[0])
        );

        if (found) {
            setMapCenter({ lat: found.lat, lng: found.lng });
            setSelectedLocation({ lat: found.lat, lng: found.lng, address: found.name });
        }
    };

    const handleConfirm = () => {
        if (selectedLocation) {
            onLocationSelect(selectedLocation.lat, selectedLocation.lng, selectedLocation.address);
            onClose();
        }
    };

    // const handleCurrentLocation = () => {
    //     // Mock getting current location
    //     const mockCurrentLocation = { lat: 28.6139, lng: 77.2090 };
    //     setMapCenter(mockCurrentLocation);
    //     setSelectedLocation({ ...mockCurrentLocation, address: 'Current Location (Mock)' });
    // };

    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setMapCenter({ lat: latitude, lng: longitude });
                setSelectedLocation({ lat: latitude, lng: longitude, address: 'Current Location' });
                setTimeout(() => {
                    mapRef.current?.setView([latitude, longitude]);
                }, 0);
                // Notify the parent with new location
                if (onLocationSelect) {
                    onLocationSelect(latitude,longitude);
                }
            },
            (error) => {
                alert("Unable to retrieve your location: " + error.message);
            }
        );
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-(--primary)" />
                        Select Project Location
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Current Location Button */}
                    <div className="flex justify-between items-center">
                        <Alert className="flex-1 mr-4">
                            <MapPin className="h-4 w-4" />
                            <AlertDescription>
                                Click on the map to pin your exact project location, or search for a city/landmark.
                            </AlertDescription>
                        </Alert>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={()=>{
                                handleCurrentLocation();
                                onClose();
                            }}
                            className="flex items-center gap-2 whitespace-nowrap"
                        >
                            <Locate className="h-4 w-4" />
                            Use Current Location
                        </Button>
                    </div>

                    {/* Map Component */}
                    <LeafletMapSelector
                        lat={mapCenter.lat}
                        lng={mapCenter.lng}
                        selectedLat={selectedLocation?.lat}
                        selectedLng={selectedLocation?.lng}
                        onMapClick={handleMapClick}
                        mapRef={mapRef}
                    />

                    {/* Selected Location Details */}
                    {selectedLocation && (
                        <div className="p-4 bg-muted/50 border rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Selected Latitude</Label>
                                    <div className="font-mono text-sm bg-(--background) border rounded px-3 py-2">
                                        {selectedLocation.lat.toFixed(6)}
                                    </div>
                                </div>
                                <div>
                                    <Label>Selected Longitude</Label>
                                    <div className="font-mono text-sm bg-(--background) border rounded px-3 py-2">
                                        {selectedLocation.lng.toFixed(6)}
                                    </div>
                                </div>
                                {selectedLocation.address && (
                                    <div className="md:col-span-2">
                                        <Label>Location Name</Label>
                                        <div className="text-sm bg-(--background) border rounded px-3 py-2">
                                            {selectedLocation.address}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={!selectedLocation}
                            className="bg-(--primary) hover:bg-(--primary)/90"
                        >
                            <MapPin className="mr-2 h-4 w-4" />
                            Use This Location
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}