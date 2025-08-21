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
      "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImtpZDEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2lkbXNhYy5hcHBsZS5jb20iLCJhdWQiOiJodnlzM2Zjd2N0ZXFydnczcXprdnRrODZ2aXVvcXYiLCJleHAiOjE3NTU3NzE5MDMsImp0aSI6IjhoaUpwdEZ3bU9FTGU1MDNvM3M5X3ciLCJpYXQiOjE3NTU3NjgzMDMsInN1YiI6IjIzMjAyNjIyNzkiLCJkc2lkIjoyMzIwMjYyMjc5LCJncm91cHMiOlsxMzQzODk2NCwxMzU1NDY4MywxMjYzODg4M10sImNsaWVudF90eXBlIjoxMCwidHlwZSI6Im9wZW5pZCIsImdpdmVuX25hbWUiOiJHaXJpIiwibm9uY2UiOiI0TUU5MC9BTTNFL0MwO0lMMU1CPzBRQT1BTDZSQ0ozVDg3ODVIL0xPQT9fOENGRjhIL0c9QlJKOTw7MzJMQzwzLzFDSEk9PjlHN1M7LjVPRTNBPDdQSUU5PlJJOT1VM0M5PE4yRDM9Szs_NUIxNEEvQ1M7TURLP0U8VTw2LjtGLiIsInByc190eXBlIjoxLCJuYmYiOjE3NTU3NjgyNDMsImFjY291bnRuYW1lIjoiZ2lyaV9kb3JuYWxhIiwiYXpwIjoiaHZ5czNmY3djdGVxcnZ3M3F6a3Z0azg2dml1b3F2Iiwic3VibiI6ImRzaWQiLCJuYW1lIjoiR2lyaSBEb3JuYWxhIiwibmlja25hbWUiOiJHaXJpIiwic2Vzc2lvbl90eXBlIjoiRVNBIiwiYXBwX2lkIjo5MjgxNDgsImZhbWlseV9uYW1lIjoiRG9ybmFsYSJ9.rDbyIwg-HDTe0KbCiTi1pPsAD6GZG4kjy2TAbsZ7hSQxRaoj446KYtni-4qJUwwvrChGfftVKbN2quexxZtxhynG_gAk1d7yHCUoQ5hlT5F6Erw1MDF7eQzjiyU-MH753Tx7KGrC8bycx-pSIddAJ0cbv7yvgxBpOsFBdfcRQV0OtC_R3A2PUAd0KKLtEoZSrHZFaso63xmr5FGfW29cdtL87KeU1LQc8LfNglpfGEaulwQxxawTQB9Av1NfsaFq0KVx9TpWaeQcNVA_h2gXxFIWZewOTeVD10bqrwFESUDNM_4mLhM3GlYSnshyTlYFvobJJVCaVK5qrVW_J62aow"
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

async def generate_user_profile_data(
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
            {{"label": "Label 1", "value": numeric_value}},
            {{"label": "Label 2", "value": numeric_value}}
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
        # Use the OpenAI client with gpt-4o-mini model
        response = await client.chat.completions.create(  # Using the correct async method
            model="gpt-4o-mini",  # Using the requested model
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
                        {"label": "8 AM", "value": 45},
                        {"label": "12 PM", "value": 25},
                        {"label": "5 PM", "value": 50}
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
                        {"label": "Food", "value": 30},
                        {"label": "Attractions", "value": 45},
                        {"label": "Transport", "value": 25}
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
                            {"label": "Fast Charger", "value": 3},
                            {"label": "Level 2", "value": 8}
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
                            {"label": "Petrol", "value": 60},
                            {"label": "Diesel", "value": 40}
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
                            {"label": "0 km", "value": 10},
                            {"label": "2 km", "value": 25},
                            {"label": "4 km", "value": 15}
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
