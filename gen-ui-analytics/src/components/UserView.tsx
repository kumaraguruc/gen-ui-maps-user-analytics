import React from 'react';
import './UserView.css';

type UserType = 'commuter' | 'tourist' | 'driver';
type VehicleType = 'ev' | 'car' | 'bike';

interface UserViewProps {
  userType: UserType;
  vehicleType?: VehicleType;
}

const UserView: React.FC<UserViewProps> = ({ userType, vehicleType }) => {
  const renderContent = () => {
    switch (userType) {
      case 'commuter':
        return (
          <div className="commuter-view">
            <h2>Commuter Dashboard</h2>
            <div className="view-content">
              <div className="stats-card">
                <h3>Travel Time Stats</h3>
                <div className="stat-item">
                  <span className="stat-label">Average commute:</span>
                  <span className="stat-value">32 min</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Fastest route:</span>
                  <span className="stat-value">28 min</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Time saved this week:</span>
                  <span className="stat-value">45 min</span>
                </div>
              </div>
              <div className="heatmap-card">
                <h3>Congestion Heatmap</h3>
                <div className="heatmap-placeholder">
                  <div className="heatmap-legend">
                    <span className="legend-item low">Low</span>
                    <span className="legend-item medium">Medium</span>
                    <span className="legend-item high">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'tourist':
        return (
          <div className="tourist-view">
            <h2>Tourist Explorer</h2>
            <div className="view-content">
              <div className="poi-cards">
                <h3>Points of Interest</h3>
                <div className="card-grid">
                  <div className="poi-card">
                    <div className="poi-image placeholder"></div>
                    <h4>City Museum</h4>
                    <p>4.8 ★ • 0.8 miles away</p>
                  </div>
                  <div className="poi-card">
                    <div className="poi-image placeholder"></div>
                    <h4>Central Park</h4>
                    <p>4.9 ★ • 1.2 miles away</p>
                  </div>
                  <div className="poi-card">
                    <div className="poi-image placeholder"></div>
                    <h4>Historic District</h4>
                    <p>4.7 ★ • 0.5 miles away</p>
                  </div>
                </div>
              </div>
              <div className="tour-cost">
                <h3>Walking Tours</h3>
                <div className="tour-item">
                  <h4>City Highlights</h4>
                  <p>2.5 hours • $25</p>
                </div>
                <div className="tour-item">
                  <h4>Historical Walk</h4>
                  <p>1.5 hours • $15</p>
                </div>
                <h3>Cost Breakdown</h3>
                <div className="cost-item">
                  <span>Transportation</span>
                  <span>$45/day</span>
                </div>
                <div className="cost-item">
                  <span>Attractions</span>
                  <span>$75/day</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'driver':
        if (vehicleType === 'ev') {
          return (
            <div className="driver-view ev-view">
              <h2>EV Driver</h2>
              <div className="view-content">
                <div className="charging-stations">
                  <h3>Nearby Charging Stations</h3>
                  <div className="station-item">
                    <h4>Downtown Supercharger</h4>
                    <p>0.8 miles • 8/12 available</p>
                  </div>
                  <div className="station-item">
                    <h4>Mall Parking Level 2</h4>
                    <p>1.5 miles • 3/6 available</p>
                  </div>
                </div>
                <div className="range-planning">
                  <h3>Range Planning</h3>
                  <div className="range-circle">
                    <span className="range-value">142</span>
                    <span className="range-unit">miles</span>
                  </div>
                  <p>Estimated range remaining</p>
                </div>
              </div>
            </div>
          );
        } else if (vehicleType === 'car') {
          return (
            <div className="driver-view car-view">
              <h2>Car Driver</h2>
              <div className="view-content">
                <div className="fuel-stations">
                  <h3>Nearby Fuel Stations</h3>
                  <div className="station-item">
                    <h4>City Gas Station</h4>
                    <p>0.5 miles • $3.45/gal</p>
                  </div>
                  <div className="station-item">
                    <h4>Highway Express</h4>
                    <p>1.2 miles • $3.29/gal</p>
                  </div>
                </div>
                <div className="parking-options">
                  <h3>Parking Options</h3>
                  <div className="parking-item">
                    <h4>Downtown Garage</h4>
                    <p>0.3 miles • $15/hour</p>
                  </div>
                  <div className="parking-item">
                    <h4>Street Parking</h4>
                    <p>Available • $2.50/hour</p>
                  </div>
                </div>
              </div>
            </div>
          );
        } else if (vehicleType === 'bike') {
          return (
            <div className="driver-view bike-view">
              <h2>Cyclist</h2>
              <div className="view-content">
                <div className="cycling-routes">
                  <h3>Cycling Routes</h3>
                  <div className="route-item">
                    <h4>Riverside Path</h4>
                    <p>5.2 miles • Scenic route</p>
                  </div>
                  <div className="route-item">
                    <h4>City Bike Lanes</h4>
                    <p>3.8 miles • Direct route</p>
                  </div>
                </div>
                <div className="bike-friendly">
                  <h3>Bike-Friendly Places</h3>
                  <div className="place-item">
                    <h4>Central Park</h4>
                    <p>Bike racks • Repair station</p>
                  </div>
                  <div className="place-item">
                    <h4>Downtown Plaza</h4>
                    <p>Bike share • Secure parking</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return <div>Please select a vehicle type</div>;
      
      default:
        return <div>Please select a user type</div>;
    }
  };

  return (
    <div className="user-view">
      {renderContent()}
    </div>
  );
};

export default UserView;
