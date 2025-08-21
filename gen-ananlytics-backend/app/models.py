from typing import List, Dict, Optional, Union, Literal
from pydantic import BaseModel, Field


class MapPin(BaseModel):
    lat: float
    lng: float
    label: str


class MapData(BaseModel):
    type: Literal["pins", "heatmap"] = "pins"
    data: List[MapPin]


class ChartDataPoint(BaseModel):
    label: str
    value: float


class Chart(BaseModel):
    type: Literal["bar", "line", "pie", "area"]
    title: str
    data: List[ChartDataPoint]


class Stat(BaseModel):
    label: str
    value: str


class UserProfileData(BaseModel):
    map: Optional[MapData] = None
    charts: List[Chart] = []
    stats: List[Stat] = []
    message: Optional[str] = None


class UserProfileRequest(BaseModel):
    profile_type: Literal["commuter", "tourist", "driver"]
    vehicle_type: Optional[Literal["ev", "car", "bike"]] = None
    location: Optional[Dict[str, float]] = None  # {"lat": float, "lng": float}
