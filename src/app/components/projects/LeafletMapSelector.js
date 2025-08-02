// components/LeafletMapSelector.js
"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ 
  iconRetinaUrl: "/Assets/marker-icon-2x.png",
  iconUrl: "/Assets/marker-icon.png",
  shadowUrl: "/Assets/marker-shadow.png",
});

function LocationMarker({ selectedLat, selectedLng, onMapClick, defaultLat, defaultLng }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });

  return selectedLat && selectedLng ? (
    <Marker
      position={[selectedLat, selectedLng]}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          onMapClick(latlng.lat, latlng.lng);
        }
      }}
    />
  ) : (
    <Marker position={[defaultLat, defaultLng]} />
  );
}
export default function LeafletMapSelector({
  lat,
  lng,
  selectedLat,
  selectedLng,
  onMapClick,
  mapRef
}) {    
// const [mapCenter, setMapCenter] = useState({ lat, lng });
//   const mapRef = useRef();

  // Center map if location changes (e.g., on search result or current location)
  useEffect(() => {
    if (mapRef.current && lat && lng) {
      mapRef.current.setView([lat, lng]);
    }
  }, [lat, lng]);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom
      style={{ height: "24rem", width: "100%", borderRadius: "0.5rem" }}
      whenCreated={(map) => { mapRef.current = map; }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker
        selectedLat={selectedLat}
        selectedLng={selectedLng}
        onMapClick={onMapClick}
        defaultLat={lat}
        defaultLng={lng}
      />
    </MapContainer>
  );
}
