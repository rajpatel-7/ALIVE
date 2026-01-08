import requests
import json

url = "http://127.0.0.1:8000/predict"
data = {
  "age": 50,
  "height": 175,
  "weight": 75,
  "ap_hi": 120,
  "ap_lo": 80,
  "cholesterol": 1,
  "gluc": 1,
  "smoke": 0,
  "alco": 0,
  "active": 1
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
