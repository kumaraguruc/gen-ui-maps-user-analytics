from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict

from .models import UserProfileRequest, UserProfileData
from .ai_service import generate_user_profile_data

app = FastAPI(
    title="GenAI Maps User Analytics API",
    description="API for generating user profile data for maps and analytics",
    version="1.0.0"
)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint to verify the API is running"""
    return {"status": "healthy"}

@app.post("/api/profile", response_model=UserProfileData)
async def get_user_profile(request: UserProfileRequest):
    """
    Get user profile data based on profile type and optional parameters
    
    Args:
        request: UserProfileRequest containing profile_type, vehicle_type, and location
        
    Returns:
        UserProfileData with map, charts, and stats
    """
    try:
        # Validate vehicle type for driver profile
        if request.profile_type == "driver" and not request.vehicle_type:
            raise HTTPException(
                status_code=400,
                detail="Vehicle type is required for driver profile"
            )
        
        # Generate profile data using AI service
        profile_data = generate_user_profile_data(
            profile_type=request.profile_type,
            vehicle_type=request.vehicle_type,
            location=request.location
        )
        
        return profile_data
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating profile data: {str(e)}"
        )

@app.get("/api/profile/{profile_type}")
async def get_profile_by_type(
    profile_type: str,
    vehicle_type: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None
):
    """
    Get user profile data using GET request with path and query parameters
    
    Args:
        profile_type: Type of user profile (commuter, tourist, driver)
        vehicle_type: Type of vehicle if profile_type is driver
        lat: Optional latitude
        lng: Optional longitude
        
    Returns:
        UserProfileData with map, charts, and stats
    """
    try:
        # Validate profile type
        if profile_type not in ["commuter", "tourist", "driver"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid profile type. Must be 'commuter', 'tourist', or 'driver'"
            )
        
        # Validate vehicle type for driver profile
        if profile_type == "driver":
            if not vehicle_type:
                raise HTTPException(
                    status_code=400,
                    detail="Vehicle type is required for driver profile"
                )
            if vehicle_type not in ["ev", "car", "bike"]:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid vehicle type. Must be 'ev', 'car', or 'bike'"
                )
        
        # Build location dict if lat and lng are provided
        location = None
        if lat is not None and lng is not None:
            location = {"lat": lat, "lng": lng}
        
        # Generate profile data using AI service
        profile_data = generate_user_profile_data(
            profile_type=profile_type,
            vehicle_type=vehicle_type,
            location=location
        )
        
        return profile_data
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating profile data: {str(e)}"
        )
