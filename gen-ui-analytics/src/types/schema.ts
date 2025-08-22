// Schema types for the JSON data returned by the API

export type UserProfileType = 'commuter' | 'tourist' | 'driver';
export type VehicleType = 'ev' | 'car' | 'bike';
export type MapType = 'pins' | 'heatmap';
export type ChartType = 'bar' | 'line' | 'pie' | 'area';

export interface MapPin {
  lat: number;
  lng: number;
  label: string;
}

export interface MapData {
  type: MapType;
  data: MapPin[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
  unit?: string; // Optional unit for the value (e.g., "km", "%", "hours")
}

export interface Chart {
  type: ChartType;
  title: string;
  data: ChartDataPoint[];
}

export interface Stat {
  label: string;
  value: string;
}

export interface UserProfileData {
  map?: MapData;
  charts: Chart[];
  stats: Stat[];
  message?: string;
}

export interface UserProfileRequest {
  profileType: UserProfileType;
  vehicleType?: VehicleType;
  location?: {
    lat: number;
    lng: number;
  };
}
