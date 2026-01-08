from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

import os

app = FastAPI()

# In your FastAPI main.py
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- LOAD MODEL & FEATURES ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, "cardio_model1.pkl"))
FEATURES = joblib.load(os.path.join(BASE_DIR, "features.pkl"))

# ---------------- INPUT SCHEMA ----------------
class PatientInput(BaseModel):
    age: int
    height: int
    weight: float
    ap_hi: int
    ap_lo: int
    cholesterol: int
    gluc: int
    smoke: int
    alco: int
    active: int


# ---------------- RISK BAND ----------------
def risk_category(prob):
    if prob < 0.3:
        return "Low Risk"
    elif prob < 0.7:
        return "Moderate Risk"
    return "High Risk"


# ---------------- PREDICTION ----------------
@app.post("/predict")
def predict(data: PatientInput):

    # ---- feature engineering (EXACTLY like notebook) ----
    bmi = data.weight / ((data.height / 100) ** 2)
    pulse_pressure = data.ap_hi - data.ap_lo
    age_years = data.age

    row = {
        "ap_hi": data.ap_hi,
        "ap_lo": data.ap_lo,
        "pulse_pressure": pulse_pressure,
        "age_years": age_years,
        "bmi": bmi,
        "weight": data.weight,
        "smoke": data.smoke,
        "alco": data.alco,
        "active": data.active,
        "cholesterol": data.cholesterol,
        "gluc": data.gluc,

        "bp_category_Elevated": int(120 <= data.ap_hi < 130),
        "bp_category_Hypertension Stage 1": int(130 <= data.ap_hi < 160),
        "bp_category_Hypertension Stage 2": int(data.ap_hi >= 160),

        "bmi_category_Normal": int(18.5 <= bmi < 25),
        "bmi_category_Overweight": int(25 <= bmi < 30),
        "bmi_category_Obese": int(30 <= bmi < 40),
        "bmi_category_Severely Obese": int(bmi >= 40),

        "cholesterol_risk_Normal": int(data.cholesterol == 1),
        "cholesterol_risk_Well Above Normal": int(data.cholesterol == 3),

        "glucose_risk_Normal": int(data.gluc == 1),
        "glucose_risk_Well Above Normal": int(data.gluc == 3),
    }

    # ---- build dataframe in SAME ORDER ----
    df = pd.DataFrame([[row[f] for f in FEATURES]], columns=FEATURES)

    prob = model.predict_proba(df)[0][1]
    category = risk_category(prob)
    advice_list = ["Maintain a balanced diet", "Regular exercise is recommended"];
    if category == "High Risk":
        advice_list = ["Consult a doctor immediately", "Monitor blood pressure daily", "Reduce salt intake"]
    elif category == "Moderate Risk":
        advice_list = ["Increase physical activity", "Reduce fatty foods", "Schedule a check-up"]

    return {
        "risk_probability": round(float(prob), 3),
        "risk_category": category,
        "note": "Population-based risk estimate, not a diagnosis",
        "advice": advice_list  # Sending this ensures the frontend has something to list
    }
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
@app.get("/")
def root():
    return {"status": "Cardio Risk API running"}
