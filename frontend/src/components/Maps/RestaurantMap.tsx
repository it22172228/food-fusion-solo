
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

// Temporary token input until Supabase integration
interface RestaurantLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface RestaurantMapProps {
  locations?: RestaurantLocation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const RestaurantMap: React.FC<RestaurantMapProps> = ({
  locations = [],
  center = [80.2, 7.9],
  zoom = 7,
  height = "400px",
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: center,
      zoom: zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.on("load", () => setIsMapLoaded(true));

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken, center, zoom]);

  // Add markers when map is loaded and locations change
  useEffect(() => {
    if (!map.current || !isMapLoaded || !locations.length) return;

    // Clear previous markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    locations.forEach(location => {
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.innerHTML = `<div class="p-1 bg-primary text-white rounded-full"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`;

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <strong>${location.name}</strong>
          <p>${location.address}</p>
        `);

      // Add marker to map
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([location.lng, location.lat])
        .setPopup(popup)
        .addTo(map.current!);
      
      markers.current.push(marker);
    });

    // Fit bounds to markers if more than one
    if (locations.length > 1 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach(location => {
        bounds.extend([location.lng, location.lat]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [locations, isMapLoaded]);

  return (
    <Card className="overflow-hidden border">
      {!mapboxToken ? (
        <div className="p-4">
          <p className="mb-2 text-sm">Enter your Mapbox token to view the map</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="pk.eyJ1..."
              className="flex-1 px-3 py-2 border rounded"
              onChange={(e) => setMapboxToken(e.target.value)}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Get your token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
          </p>
        </div>
      ) : (
        <div style={{ height }} ref={mapContainer} className="w-full" />
      )}
    </Card>
  );
};

export default RestaurantMap;
