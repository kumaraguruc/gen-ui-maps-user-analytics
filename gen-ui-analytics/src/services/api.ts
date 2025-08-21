import axios from 'axios';
import type { UserProfileData, UserProfileRequest, UserProfileType, VehicleType } from '../types/schema';

// API base URL - in a real app, this would come from environment variables
const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch user profile data from the API
 * 
 * @param profileType - The type of user profile (commuter, tourist, driver)
 * @param vehicleType - The type of vehicle if profileType is driver
 * @param location - Optional location data with lat and lng
 * @returns Promise with the user profile data
 */
export const fetchUserProfileData = async (
  profileType: UserProfileType,
  vehicleType?: VehicleType,
  location?: { lat: number; lng: number }
): Promise<UserProfileData> => {
  try {
    // Build query parameters for GET request
    const params: Record<string, string | number> = {};
    
    if (vehicleType) {
      params.vehicle_type = vehicleType;
    }
    
    if (location) {
      params.lat = location.lat;
      params.lng = location.lng;
    }
    
    // Make GET request to API
    const response = await apiClient.get<UserProfileData>(
      `/api/profile/${profileType}`,
      { params }
    );
      console.log('46', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile data:', error);
    
    // Return fallback data in case of error
    return {
      charts: [],
      stats: [
        { label: 'Error', value: 'Failed to fetch data. Please try again.' }
      ]
    };
  }
};

/**
 * Post user profile request to the API
 * 
 * @param request - The user profile request data
 * @returns Promise with the user profile data
 */
export const postUserProfileRequest = async (
  request: UserProfileRequest
): Promise<UserProfileData> => {
  try {
    // Make POST request to API
    const response = await apiClient.post<UserProfileData>(
      '/api/profile',
      request
    );
    
    return response.data;
  } catch (error) {
    console.error('Error posting user profile request:', error);
    
    // Return fallback data in case of error
    return {
      charts: [],
      stats: [
        { label: 'Error', value: 'Failed to fetch data. Please try again.' }
      ]
    };
  }
};

/**
 * Check if the API is healthy
 * 
 * @returns Promise with boolean indicating if API is healthy
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};
