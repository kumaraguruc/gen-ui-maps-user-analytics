import os
import json
from typing import Dict, Optional, Literal
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client with the specified configuration
client = OpenAI(
    base_url="https://floodgate.g.apple.com/api/openai/v1",
    api_key=os.getenv("OPENAI_API_KEY"),
    default_headers={
      "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImtpZDEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2lkbXNhYy5hcHBsZS5jb20iLCJhdWQiOiJodnlzM2Zjd2N0ZXFydnczcXprdnRrODZ2aXVvcXYiLCJleHAiOjE3NTU4NDMyMjcsImp0aSI6InV6N1pZNGllUUI2M2ZnaEMyVXBZeFEiLCJpYXQiOjE3NTU4Mzk2MjcsInN1YiI6IjIzMjA1NzkyOTIiLCJkc2lkIjoyMzIwNTc5MjkyLCJncm91cHMiOlsxMjYzODg4MywxMzU1NDY4MywxMzQzODk2NF0sImNsaWVudF90eXBlIjoxMCwidHlwZSI6Im9wZW5pZCIsImdpdmVuX25hbWUiOiJLdW1hcmEiLCJ0b2tlbl90eXBlIjoiSSIsIm5vbmNlIjoiSjcxPj9UUjM5Qk1TR0g3OzxJPDtVRzdNPjg3Ny9QMTg2NC5INjtPUEVFOUE1Pk4zTFAzPD8wTElASTBMODFTMkI1S0JKRi9FOEo3Ry4-QTA4SUtNPUhPNC5EPExUTUYzNzIyVTVEMU9OUjUxMlE3NUVMQTNPN0cvSTBCOThRM0AiLCJwcnNfdHlwZSI6NCwid2lmaV9pcCI6IjEyMi4xNzcuMjQ3LjEyMCIsIm5iZiI6MTc1NTgzOTU2NywiYWNjb3VudG5hbWUiOiJrdW1hcmFfZ3VydSIsImF6cCI6Imh2eXMzZmN3Y3RlcXJ2dzNxemt2dGs4NnZpdW9xdiIsInN1Ym4iOiJkc2lkIiwibmFtZSI6Ikt1bWFyYSBHdXJ1Iiwibmlja25hbWUiOiJLdW1hcmEiLCJzZXNzaW9uX3R5cGUiOiJFU0EiLCJhcHBfaWQiOjkyODE0OCwiZmFtaWx5X25hbWUiOiJHdXJ1In0.AOTSOeUGlXloGWWPZzAHNxIoOzeKfjjAwj1bGqxI44TEb2ogQr_apoiTW9kXp9F8PI99TNe7w3rTw_Z_V6Ff2bQMPHCE2BB4i4r4REQAO1HRo7u99mEEQqJkrNPDanP_ufGrABR-1HDO2kaa6Yjf90goClIWYw_CpSom0QVE3xtumEwgp6pj11qdEtpztEBcIdXnz5uOGO3bCEpnF4RlOoSJm7jrAbszJu_DvN8hDYyHFvsW9GHKvLVhdfx_iWVXN41-1B0yAqwuO3dKM_Am9EnOVnaO5CymG23resWWaasFP5RUFxcPW61absRqvFmnM9unQcYQpxe_CBKCyK-lYQ"
    }
)

# Profile type descriptions for AI context
PROFILE_DESCRIPTIONS = {
    "commuter": "A user who regularly travels between home and work, interested in travel time stats and congestion heatmaps.",
    "tourist": "A visitor exploring new places, interested in points of interest, walking tours, and cost breakdowns.",
    "driver": {
        "ev": "An electric vehicle driver interested in charging stations and range planning.",
        "car": "A car driver interested in fuel stations and parking options.",
        "bike": "A cyclist interested in cycling routes and bike-friendly paths."
    }
}

def generate_user_profile_data(
    profile_type: Literal["commuter", "tourist", "driver"],
    vehicle_type: Optional[Literal["ev", "car", "bike"]] = None,
    location: Optional[Dict[str, float]] = None
):
    """
    Generate user profile data using OpenAI API based on the profile type and optional parameters.
    
    Args:
        profile_type: The type of user profile (commuter, tourist, driver)
        vehicle_type: The type of vehicle if profile_type is driver
        location: Optional location data with lat and lng
        
    Returns:
        JSON schema with map data, charts, and stats based on the profile
    """
    # Build the prompt based on profile type
    if profile_type == "driver" and vehicle_type:
        profile_desc = PROFILE_DESCRIPTIONS[profile_type][vehicle_type]
    else:
        profile_desc = PROFILE_DESCRIPTIONS[profile_type]
    
    location_str = ""
    user_lat = 13.0827  # Default Chennai coordinates
    user_lng = 80.2707
    
    if location:
        user_lat = location['lat']
        user_lng = location['lng']
        location_str = f"The user is currently at latitude {user_lat} and longitude {user_lng}."
    
    prompt = f"""
    Generate a JSON schema for a {profile_type} user interface. {profile_desc} {location_str}
    
    The schema should include:
    1. Map data with pins or heatmap based on the user profile
    2. Relevant charts with appropriate data
    3. Key statistics that would be useful for this user type
    
    IMPORTANT: Use the user's EXACT location coordinates ({user_lat}, {user_lng}) as the center point for all map data.
    Generate realistic points of interest, traffic data, or service locations within 1-2 kilometers of the user's actual location.
    DO NOT use dummy or placeholder coordinates - the map pins must be based on the user's real location.
    
    Follow this exact JSON structure:
    {{
      "map": {{ "type": "pins" or "heatmap", "data": [array of map points with the user's location as the center point] }},
      "charts": [
        {{
          "type": "bar" or "line" or "pie" or "area",
          "title": "Chart title",
          "data": [
            {{"label": "Label 1", "value": numeric_value, "unit": "appropriate unit (e.g., 'km', '%', 'hours')"}},
            {{"label": "Label 2", "value": numeric_value, "unit": "appropriate unit (e.g., 'km', '%', 'hours')"}}
          ]
        }}
      ],
      "stats": [
        {{"label": "Stat 1", "value": "Value 1"}},
        {{"label": "Stat 2", "value": "Value 2"}}
      ]
    }}
    
    Ensure the data is realistic and relevant to a {profile_type} user at their specific location.
    """
    
    try:
        # Use the OpenAI client with Claude model
        response = client.chat.completions.create(  # Using synchronous method
            model="aws:anthropic.claude-3-5-sonnet-20241022-v2:0",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates JSON data for a maps and analytics application."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        # Extract and parse the JSON response
        json_str = response.choices[0].message.content.strip()
        
        # Handle potential markdown code blocks in the response
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0].strip()
        elif "```" in json_str:
            json_str = json_str.split("```")[1].strip()
            
        return json.loads(json_str)
    
    except Exception as e:
        # If there's an error with the API or parsing, return fallback data
        print(f"Error generating data with OpenAI: {str(e)}")
        return generate_fallback_data(profile_type, vehicle_type, location)


def generate_fallback_data(profile_type, vehicle_type=None, location=None):
    """Generate fallback data if the OpenAI API call fails"""
    
    # Use user's location if available, otherwise default to Chennai
    user_lat = 13.0827
    user_lng = 80.2707
    
    if location:
        user_lat = location['lat']
        user_lng = location['lng']
    
    # Generate points around the user's location
    nearby_points = [
        {"lat": user_lat, "lng": user_lng},  # User's exact location
        {"lat": user_lat + 0.005, "lng": user_lng + 0.005},  # ~500m NE
        {"lat": user_lat - 0.005, "lng": user_lng - 0.005},  # ~500m SW
        {"lat": user_lat + 0.008, "lng": user_lng - 0.003},  # ~800m SE
        {"lat": user_lat - 0.003, "lng": user_lng + 0.007}   # ~700m NW
    ]
    
    if profile_type == "commuter":
        return {
            "map": {
                "type": "heatmap",
                "data": [
                    {"lat": nearby_points[0]["lat"], "lng": nearby_points[0]["lng"], "label": "High Traffic"},
                    {"lat": nearby_points[1]["lat"], "lng": nearby_points[1]["lng"], "label": "Medium Traffic"},
                    {"lat": nearby_points[2]["lat"], "lng": nearby_points[2]["lng"], "label": "Low Traffic"}
                ]
            },
            "charts": [
                {
                    "type": "bar",
                    "title": "Travel Time by Hour",
                    "data": [
                        {"label": "8 AM", "value": 45, "unit": "min"},
                        {"label": "12 PM", "value": 25, "unit": "min"},
                        {"label": "5 PM", "value": 50, "unit": "min"}
                    ]
                }
            ],
            "stats": [
                {"label": "Average Commute", "value": "32 min"},
                {"label": "Time Saved", "value": "15 min"}
            ]
        }
    
    elif profile_type == "tourist":
        return {
            "map": {
                "type": "pins",
                "data": [
                    {"lat": nearby_points[0]["lat"], "lng": nearby_points[0]["lng"], "label": "You Are Here"},
                    {"lat": nearby_points[1]["lat"], "lng": nearby_points[1]["lng"], "label": "Museum"},
                    {"lat": nearby_points[2]["lat"], "lng": nearby_points[2]["lng"], "label": "Park"},
                    {"lat": nearby_points[3]["lat"], "lng": nearby_points[3]["lng"], "label": "Historic Site"}
                ]
            },
            "charts": [
                {
                    "type": "pie",
                    "title": "Cost Breakdown",
                    "data": [
                        {"label": "Food", "value": 30, "unit": "%"},
                        {"label": "Attractions", "value": 45, "unit": "%"},
                        {"label": "Transport", "value": 25, "unit": "%"}
                    ]
                }
            ],
            "stats": [
                {"label": "Top Attraction", "value": "City Museum"},
                {"label": "Walking Tour", "value": "2.5 hours • $25"}
            ]
        }
    
    elif profile_type == "driver":
        if vehicle_type == "ev":
            return {
                "map": {
                    "type": "pins",
                    "data": [
                        {"lat": nearby_points[0]["lat"], "lng": nearby_points[0]["lng"], "label": "You Are Here"},
                        {"lat": nearby_points[1]["lat"], "lng": nearby_points[1]["lng"], "label": "Fast Charger"},
                        {"lat": nearby_points[2]["lat"], "lng": nearby_points[2]["lng"], "label": "Level 2 Charger"}
                    ]
                },
                "charts": [
                    {
                        "type": "bar",
                        "title": "Charging Stations by Type",
                        "data": [
                            {"label": "Fast Charger", "value": 3, "unit": "stations"},
                            {"label": "Level 2", "value": 8, "unit": "stations"}
                        ]
                    }
                ],
                "stats": [
                    {"label": "Nearest Station", "value": "Fast Charger - 1.2 km"},
                    {"label": "Est. Range", "value": "142 miles"}
                ]
            }
        elif vehicle_type == "car":
            return {
                "map": {
                    "type": "pins",
                    "data": [
                        {"lat": nearby_points[0]["lat"], "lng": nearby_points[0]["lng"], "label": "You Are Here"},
                        {"lat": nearby_points[1]["lat"], "lng": nearby_points[1]["lng"], "label": "Gas Station - ₹103/L"},
                        {"lat": nearby_points[2]["lat"], "lng": nearby_points[2]["lng"], "label": "Gas Station - ₹104/L"}
                    ]
                },
                "charts": [
                    {
                        "type": "bar",
                        "title": "Fuel Types Available",
                        "data": [
                            {"label": "Petrol", "value": 60, "unit": "%"},
                            {"label": "Diesel", "value": 40, "unit": "%"}
                        ]
                    }
                ],
                "stats": [
                    {"label": "Nearest Station", "value": "Indian Oil - 1.5 km"},
                    {"label": "Average Price", "value": "₹103/L"}
                ]
            }
        elif vehicle_type == "bike":
            return {
                "map": {
                    "type": "pins",
                    "data": [
                        {"lat": nearby_points[0]["lat"], "lng": nearby_points[0]["lng"], "label": "You Are Here"},
                        {"lat": nearby_points[1]["lat"], "lng": nearby_points[1]["lng"], "label": "Bike Path Start"},
                        {"lat": nearby_points[2]["lat"], "lng": nearby_points[2]["lng"], "label": "Bike Rental"}
                    ]
                },
                "charts": [
                    {
                        "type": "line",
                        "title": "Elevation Profile",
                        "data": [
                            {"label": "0 km", "value": 10, "unit": "m"},
                            {"label": "2 km", "value": 25, "unit": "m"},
                            {"label": "4 km", "value": 15, "unit": "m"}
                        ]
                    }
                ],
                "stats": [
                    {"label": "Route Length", "value": "5.2 km"},
                    {"label": "Bike Friendly Places", "value": "3 nearby"}
                ]
            }
        else:
            return {
                "map": {"type": "pins", "data": []},
                "charts": [],
                "stats": [{"label": "Error", "value": "Please select a vehicle type"}]
            }
    
    else:
        return {
            "map": {"type": "pins", "data": []},
            "charts": [],
            "stats": [{"label": "Error", "value": "Invalid profile type"}]
        }
