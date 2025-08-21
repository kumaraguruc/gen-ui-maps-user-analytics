import React, { useState } from 'react';
import type { UserProfileType, VehicleType } from '../types/schema';

interface UserTypeSelectionProps {
  onSelectUserType: (type: UserProfileType, vehicleType?: VehicleType) => void;
}

const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelectUserType }) => {
  const [showVehicleOptions, setShowVehicleOptions] = useState(false);
  const [selectedType, setSelectedType] = useState<UserProfileType | null>(null);

  const handleUserTypeClick = (type: UserProfileType) => {
    if (type === 'driver') {
      setSelectedType('driver');
      setShowVehicleOptions(true);
    } else {
      onSelectUserType(type);
    }
  };

  const handleVehicleTypeClick = (vehicleType: VehicleType) => {
    if (selectedType) {
      onSelectUserType(selectedType, vehicleType);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <h2 className="text-3xl font-semibold text-center mb-12 tracking-tight">
        How will you be using the app today?
      </h2>
      
      {!showVehicleOptions ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Commuter Option */}
          <button 
            className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border-t-4 border-primary-600 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => handleUserTypeClick('commuter')}
          >
            <div className="w-20 h-20 flex items-center justify-center text-4xl bg-gray-50 rounded-full mb-4">
              🚇
            </div>
            <h3 className="text-xl font-semibold mb-2">Commuter</h3>
            <p className="text-gray-500 text-center">
              Travel time stats, congestion heatmap
            </p>
          </button>
          
          {/* Tourist Option */}
          <button 
            className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border-t-4 border-tourist-600 hover:bg-purple-50 transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => handleUserTypeClick('tourist')}
          >
            <div className="w-20 h-20 flex items-center justify-center text-4xl bg-gray-50 rounded-full mb-4">
              🏙️
            </div>
            <h3 className="text-xl font-semibold mb-2">Tourist</h3>
            <p className="text-gray-500 text-center">
              POI cards, walking tours, cost breakdown
            </p>
          </button>
          
          {/* Driver Option */}
          <button 
            className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border-t-4 border-driver-600 hover:bg-pink-50 transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => handleUserTypeClick('driver')}
          >
            <div className="w-20 h-20 flex items-center justify-center text-4xl bg-gray-50 rounded-full mb-4">
              🚗
            </div>
            <h3 className="text-xl font-semibold mb-2">Driver</h3>
            <p className="text-gray-500 text-center">
              Vehicle-specific navigation options
            </p>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-center mb-6">Select your vehicle type</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* EV Option */}
            <button 
              className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border-t-4 border-ev-600 hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => handleVehicleTypeClick('ev')}
            >
              <div className="w-20 h-20 flex items-center justify-center text-4xl bg-gray-50 rounded-full mb-4">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-2">Electric Vehicle</h3>
              <p className="text-gray-500 text-center">
                Charging stations and range planning
              </p>
            </button>
            
            {/* Car Option */}
            <button 
              className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border-t-4 border-car-600 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => handleVehicleTypeClick('car')}
            >
              <div className="w-20 h-20 flex items-center justify-center text-4xl bg-gray-50 rounded-full mb-4">
                🚗
              </div>
              <h3 className="text-xl font-semibold mb-2">Car</h3>
              <p className="text-gray-500 text-center">
                Fuel stations and parking options
              </p>
            </button>
            
            {/* Bike Option */}
            <button 
              className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border-t-4 border-bike-600 hover:bg-yellow-50 transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => handleVehicleTypeClick('bike')}
            >
              <div className="w-20 h-20 flex items-center justify-center text-4xl bg-gray-50 rounded-full mb-4">
                🚲
              </div>
              <h3 className="text-xl font-semibold mb-2">Bike</h3>
              <p className="text-gray-500 text-center">
                Cycling routes and bike-friendly paths
              </p>
            </button>
          </div>
          
          <div className="flex justify-center mt-8">
            <button 
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setShowVehicleOptions(false)}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTypeSelection;
