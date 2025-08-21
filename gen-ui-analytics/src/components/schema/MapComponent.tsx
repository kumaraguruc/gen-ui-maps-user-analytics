import React, { useEffect, useRef } from 'react';
import type { MapData, MapPin } from '../../types/schema';

// Define a basic type for MapKit JS
interface MapKit {
  Map: new (element: HTMLElement) => MapKitMap;
  Coordinate: new (latitude: number, longitude: number) => MapKitCoordinate;
  CoordinateSpan: new (latitudeDelta: number, longitudeDelta: number) => MapKitCoordinateSpan;
  CoordinateRegion: new (center: MapKitCoordinate, span: MapKitCoordinateSpan) => MapKitCoordinateRegion;
  MarkerAnnotation: new (coordinate: MapKitCoordinate) => MapKitMarkerAnnotation;
  CircleOverlay: new (coordinate: MapKitCoordinate, radius: number) => MapKitCircleOverlay;
  Style: new (options: MapKitStyleOptions) => MapKitStyle;
  Padding: new (top: number, right: number, bottom: number, left: number) => MapKitPadding;
  init: (options: MapKitInitOptions) => void;
}

interface MapKitPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface MapKitMap {
  region: MapKitCoordinateRegion;
  showItems: (items: MapKitMarkerAnnotation[], options?: any) => void;
  addOverlay: (overlay: MapKitCircleOverlay) => void;
  removeAnnotations: (annotations: MapKitMarkerAnnotation[]) => void;
  annotations: MapKitMarkerAnnotation[];
  // Additional properties that might exist in MapKit JS
  mapType?: string;
  padding?: any;
  showsPointsOfInterest?: boolean;
}

interface MapKitCoordinate {
  latitude: number;
  longitude: number;
}

interface MapKitCoordinateSpan {
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapKitCoordinateRegion {
  center: MapKitCoordinate;
  span: MapKitCoordinateSpan;
}

interface MapKitMarkerAnnotation {
  title: string;
  // Additional properties that might exist in MapKit JS
  color?: any;
  glyphText?: string;
  visible?: boolean;
}

interface MapKitCircleOverlay {
  style: MapKitStyle;
}

interface MapKitStyle {
  fillColor: string;
  strokeColor: string;
}

interface MapKitStyleOptions {
  fillColor: string;
  strokeColor: string;
}

interface MapKitInitOptions {
  authorizationCallback: (done: (token: string) => void) => void;
}

// Define the global mapkit object that will be loaded from the MapkitJS script
declare global {
  interface Window {
    mapkit?: MapKit & {
      MarkerAnnotationColor?: {
        Red: any;
        Green: any;
        Blue: any;
      }
    };
  }
}

interface MapComponentProps {
  mapData: MapData;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ mapData, className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<MapKitMap | null>(null);

  useEffect(() => {
    // Clean up any existing markers before initializing
    const existingMarkers = document.querySelectorAll('.custom-map-marker');
    existingMarkers.forEach(marker => {
      if (marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
    });
    
    // Check if MapkitJS is loaded
    if (!window.mapkit) {
      // Load MapkitJS script if not already loaded
      const script = document.createElement('script');
      script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
      script.async = true;
      
      script.onload = () => {
        initializeMap();
      };
      
      document.head.appendChild(script);
    } else {
      // MapkitJS is already loaded
      initializeMap();
    }
    
    return () => {
      // Only clean up custom markers, leave MapKit JS cleanup to React
      try {
        const markers = document.querySelectorAll('.custom-map-marker');
        if (markers.length > 0) {
          markers.forEach(marker => {
            if (marker.parentNode) {
              marker.parentNode.removeChild(marker);
            }
          });
        }
      } catch (err) {
        console.error("Error cleaning up custom markers:", err);
      }
    };
  }, [mapData]);

  const initializeMap = () => {
    if (!window.mapkit || !mapRef.current) return;
    
    // In a real application, you would use a token provider service
    // This is a placeholder for demonstration purposes
    window.mapkit.init({
      authorizationCallback: (done: (token: string) => void) => {
        // In a real app, fetch a token from your server
        // For demo purposes, we're using a JWT token
        done("eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjZHM1lMQlpaNzgifQ.eyJpc3MiOiJDNVU4OTI3MzZZIiwiaWF0IjoxNzU1Nzk2MDI2LCJleHAiOjE3NTU5Njg4MjZ9.98TgRgcQLsqF6mdfXgAF90PZu6RT4Qbia-tU5yIS_UyuKMHKHzgWeZLBGEJTLClFhODnuwNKylpSradJw2qazA");
      }
    });
    
    // Create a new map instance with enhanced options for better visibility
    const map = new window.mapkit.Map(mapRef.current);
    
    // Configure map to show roads and street names
    // Set map type to standard (shows roads, labels, etc.)
    if (map.mapType !== undefined) {
      // @ts-expect-error - mapType exists in MapKit JS but not in our interface
      map.mapType = "standard";
    }
    
    // Set padding to ensure pins are visible
    if (map.padding !== undefined && window.mapkit) {
      // Create a proper Padding object
      const padding = new window.mapkit.Padding(10, 10, 10, 10);
      // @ts-expect-error - padding exists in MapKit JS but not in our interface
      map.padding = padding;
    }
    
    // Enable showing points of interest for better context
    if (map.showsPointsOfInterest !== undefined) {
      // @ts-expect-error - showsPointsOfInterest exists in MapKit JS but not in our interface
      map.showsPointsOfInterest = true;
    }
    
    mapInstanceRef.current = map;
    console.log(map.showsPointsOfInterest);
    
    // Set the map region based on the first pin or a default location
    if (mapData.data.length > 0) {
      const firstPin = mapData.data[0];
      const center = new window.mapkit.Coordinate(firstPin.lat, firstPin.lng);
      // Use a smaller span for closer zoom to see streets better
      const span = new window.mapkit.CoordinateSpan(0.02, 0.02);
      const region = new window.mapkit.CoordinateRegion(center, span);
      map.region = region;
    }
    
    // Handle different map types
    if (mapData.type === 'pins') {
      // Add pins to the map with enhanced visibility
      if (window.mapkit) {
        // Debug log to check if pins data exists
        console.log("Map pins data:", mapData.data);
        
        // Log the raw coordinates for debugging
        console.log("Raw coordinates from API:", JSON.stringify(mapData.data, null, 2));
        
        // Ensure coordinates are numbers, not strings
        const processedData = mapData.data.map(pin => ({
          lat: typeof pin.lat === 'string' ? parseFloat(pin.lat) : pin.lat,
          lng: typeof pin.lng === 'string' ? parseFloat(pin.lng) : pin.lng,
          label: pin.label
        }));
        
        console.log("Processed coordinates:", JSON.stringify(processedData, null, 2));
        
        // Create a simple HTML marker for each pin
        processedData.forEach((pin: MapPin, index: number) => {
          console.log("Creating pin at:", pin.lat, pin.lng, pin.label);
          
          try {
            // Create a div element for the custom marker
            const markerElement = document.createElement('div');
            markerElement.className = 'custom-map-marker';
            markerElement.id = `marker-${index}`;

            
            // Calculate position based on the map's center and the pin's coordinates
            // This is a simplified approach - in a real app, you'd use the map's projection
            if (mapInstanceRef.current && mapRef.current) {
              // Get map dimensions
              const mapWidth = mapRef.current.clientWidth;
              const mapHeight = mapRef.current.clientHeight;
              
              // Get map center and span
              const mapCenter = mapInstanceRef.current.region.center;
              const mapSpan = mapInstanceRef.current.region.span;
              
              // Calculate position as percentage of the map
              const latPercent = (mapCenter.latitude - pin.lat) / mapSpan.latitudeDelta;
              const lngPercent = (pin.lng - mapCenter.longitude) / mapSpan.longitudeDelta;
              
              const top = (0.5 - latPercent) * mapHeight;
              const left = (0.5 + lngPercent) * mapWidth;
              
              markerElement.style.top = `${top}px`;
              markerElement.style.left = `${left}px`;
              
              console.log(`Positioned marker ${index} at top: ${top}px, left: ${left}px`);
            } else {
              // Fallback to center if we can't calculate position
              markerElement.style.left = '50%';
              markerElement.style.top = '50%';
              markerElement.style.transform = 'translate(-50%, -50%)';
            }
            
            // Add tooltip
            markerElement.title = `${pin.label} (${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)})`;
            
            // Add the marker to the map container
            if (mapRef.current) {
              mapRef.current.appendChild(markerElement);
            }
            
            // Store the marker element for cleanup
            const markers = document.querySelectorAll('.custom-map-marker');
            console.log(`Created ${markers.length} custom markers`);
          } catch (err) {
            console.error(`Error creating custom marker for pin ${index}:`, err);
          }
        });
        
        // Also try the standard MapKit approach
        try {
          // Create more visible annotations
          const annotations = mapData.data.map((pin: MapPin) => {
            const coordinate = new window.mapkit!.Coordinate(pin.lat, pin.lng);
            const annotation = new window.mapkit!.MarkerAnnotation(coordinate);
            
            // Set title for better visibility
            annotation.title = pin.label;
            annotation.subtitle = `Location: ${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}`;
            
            // Try to make pins more visible with all available properties
            try {
              // @ts-expect-error - These properties might exist in MapKit JS
              annotation.color = "red";
              // @ts-expect-error
              annotation.glyphText = "📍";
              // @ts-expect-error
              annotation.glyphColor = "white";
              // @ts-expect-error
              annotation.displayPriority = 1000; // High priority to ensure visibility
              // @ts-expect-error
              annotation.size = { width: 40, height: 40 }; // Make pins larger
              // @ts-expect-error
              annotation.visible = true;
              // @ts-expect-error
              annotation.animates = true;
              // @ts-expect-error
              annotation.selected = true; // Try to make it selected by default
            } catch (err) {
              console.error("Error setting pin properties:", err);
            }
            
            return annotation;
          });
          
          // Show items with animation if available
          if (map.showItems && annotations.length > 0) {
            console.log("Adding pins to map:", annotations.length);
            
            try {
              // Try with animation first
              // @ts-expect-error - The second parameter for animation options exists in MapKit JS
              map.showItems(annotations, { animate: true, animationDuration: 1.0 });
            } catch (err) {
              console.error("Error showing pins with animation:", err);
              
              // Fallback if the animation option causes an error
              try {
                map.showItems(annotations);
                console.log("Added pins without animation");
              } catch (err2) {
                console.error("Error showing pins without animation:", err2);
              }
            }
            
            // Additional attempt to make pins visible
            annotations.forEach((annotation, index) => {
              try {
                // @ts-expect-error - Try to add annotations individually
                map.addAnnotation(annotation);
                console.log(`Added pin ${index} individually`);
              } catch (err) {
                console.error(`Error adding pin ${index} individually:`, err);
              }
            });
          } else {
            console.error("Cannot show pins: map.showItems unavailable or no annotations");
          }
        } catch (err) {
          console.error("Error with standard MapKit approach:", err);
        }
      } else {
        console.error("Cannot show pins: window.mapkit is undefined");
      }
    } else if (mapData.type === 'heatmap') {
      // For a real heatmap, you would use a custom overlay
      // This is a simplified version using colored circles
      if (window.mapkit) {
        mapData.data.forEach((point: MapPin) => {
          const coordinate = new window.mapkit!.Coordinate(point.lat, point.lng);
          const circle = new window.mapkit!.CircleOverlay(coordinate, 1000);
          
          // Set color based on the label (assuming label contains traffic info)
          if (point.label.includes('High') && window.mapkit) {
            circle.style = new window.mapkit.Style({
              fillColor: 'rgba(255, 59, 48, 0.5)',
              strokeColor: 'rgba(255, 59, 48, 0.8)'
            });
          } else if (point.label.includes('Medium') && window.mapkit) {
            circle.style = new window.mapkit.Style({
              fillColor: 'rgba(255, 204, 0, 0.5)',
              strokeColor: 'rgba(255, 204, 0, 0.8)'
            });
          } else if (window.mapkit) {
            circle.style = new window.mapkit.Style({
              fillColor: 'rgba(48, 209, 88, 0.5)',
              strokeColor: 'rgba(48, 209, 88, 0.8)'
            });
          }
          
          map.addOverlay(circle);
        });
      }
    }
  };

  // Fallback content when MapkitJS is not available
  const renderFallback = () => {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-500 mb-2">Map data:</p>
        <ul className="list-disc pl-5">
          {mapData.data.map((pin, index) => (
            <li key={index} className="text-sm">
              {pin.label} ({pin.lat.toFixed(4)}, {pin.lng.toFixed(4)})
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={`map-container map-height rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="h-full w-full">
        {/* MapkitJS will render the map here */}
        {/* Fallback content will be shown until the map is initialized */}
        {renderFallback()}
      </div>
      <style>
        {`
          .map-height {
            height: 480px; /* Increased from h-80 (320px) to 480px */
          }
          @media (max-width: 640px) {
            .map-height {
              height: 400px; /* Slightly smaller on mobile but still larger than before */
            }
          }
        `}
      </style>
    </div>
  );
};

export default MapComponent;
