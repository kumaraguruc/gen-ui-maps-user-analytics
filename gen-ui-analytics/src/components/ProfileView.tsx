import React, { useState, useEffect } from 'react';
import type { UserProfileType, VehicleType, UserProfileData } from '../types/schema';
import { fetchUserProfileData } from '../services/api';
import SchemaRenderer from './schema/SchemaRenderer';

interface ProfileViewProps {
  profileType: UserProfileType;
  vehicleType?: VehicleType;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profileType, vehicleType, onBack }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UserProfileData | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async (location: { lat: number; lng: number }) => {
      try {
        setLoading(true);
        setData(null);
        setError(null);
        console.log("25 fetch profile");
        // Fetch data from API with the provided location
        const profileData = await fetchUserProfileData(profileType, vehicleType, location);
        setData(profileData);
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // Default location (Chennai, India) as fallback
    const defaultLocation = {
      lat: 13.0827,
      lng: 80.2707
    };

    // Try to get the user's actual location using the browser's Geolocation API
    if (navigator.geolocation) {
      setLocationStatus('loading');
      
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('User location:', userLocation);
          setLocationStatus('success');
          loadData(userLocation);
        },
        // Error callback
        (error) => {
          console.error('Geolocation error:', error);
          setLocationStatus('error');
          setLocationError(
            error.code === 1
              ? 'Location access denied. Using default location.'
              : 'Could not get your location. Using default location.'
          );
          // Fall back to default location
          loadData(defaultLocation);
        },
        // Options
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // Browser doesn't support geolocation
      console.log('Geolocation not supported. Using default location.');
      setLocationStatus('error');
      setLocationError('Your browser does not support geolocation. Using default location.');
      loadData(defaultLocation);
    }
  }, [profileType, vehicleType]);

  // Get title based on profile type and vehicle type
  const getTitle = () => {
    if (profileType === 'driver' && vehicleType) {
      const vehicleLabels = {
        'ev': 'Electric Vehicle',
        'car': 'Car',
        'bike': 'Bike'
      };
      return `${vehicleLabels[vehicleType]} Driver`;
    }
    
    const profileLabels = {
      'commuter': 'Commuter',
      'tourist': 'Tourist',
      'driver': 'Driver'
    };
    
    return profileLabels[profileType];
  };

  return (
    <div className="profile-view animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{getTitle()} Dashboard</h2>
        <button 
          onClick={onBack}
          className="btn btn-secondary text-sm px-4 py-2"
        >
          Change Profile
        </button>
      </div>
      
      {loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">
            {locationStatus === 'loading'
              ? 'Getting your location...'
              : 'Loading your personalized dashboard...'}
          </p>
        </div>
      )}
      
      {error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {locationError && !loading && !error && (
        <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">{locationError}</p>
        </div>
      )}
      
      {!loading && !error && data && (
        <SchemaRenderer data={data} />
      )}
    </div>
  );
};

export default ProfileView;
