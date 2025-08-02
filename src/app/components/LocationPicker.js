"use client";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import react-leaflet components for client-side rendering only
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

const LocationPicker = () => {
  const [position, setPosition] = useState({ lat: 28.61, lng: 77.23 }); // Default: New Delhi
  const markerRef = useRef();

  // Capture latitude and longitude on map click
  const handleMapClick = e => {
    setPosition(e.latlng);
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        onClick={handleMapClick}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[position.lat, position.lng]}
          draggable={true}
          eventHandlers={{
            dragend() {
              const marker = markerRef.current;
              if (marker) {
                setPosition(marker.getLatLng());
              }
            },
          }}
          ref={markerRef}
        />
      </MapContainer>
      <div>
        <p>Latitude: {position.lat}</p>
        <p>Longitude: {position.lng}</p>
      </div>
    </div>
  );
}

export default LocationPicker