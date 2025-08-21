import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import UserTypeSelection from './components/UserTypeSelection'
import ProfileView from './components/ProfileView'
import type { UserProfileType, VehicleType } from './types/schema'

function App() {
  const [appState, setAppState] = useState<'dashboard' | 'selection' | 'profile'>('dashboard');
  const [profileType, setProfileType] = useState<UserProfileType | null>(null);
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  
  // After 4 seconds (3s display + 1s animation), transition from dashboard to selection
  useEffect(() => {
    if (appState === 'dashboard') {
      const timer = setTimeout(() => {
        setAppState('selection');
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleUserTypeSelection = (type: UserProfileType, vehicle?: VehicleType) => {
    setProfileType(type);
    if (vehicle) {
      setVehicleType(vehicle);
    }
    setAppState('profile');
  };

  const handleBackToSelection = () => {
    setAppState('selection');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {appState === 'dashboard' && (
          <Dashboard />
        )}
        
        {appState === 'selection' && (
          <UserTypeSelection onSelectUserType={handleUserTypeSelection} />
        )}
        
        {appState === 'profile' && profileType && (
          <ProfileView 
            profileType={profileType} 
            vehicleType={vehicleType || undefined} 
            onBack={handleBackToSelection}
          />
        )}
      </div>
    </div>
  )
}

export default App
