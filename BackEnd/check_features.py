import joblib

try:
    features = joblib.load("d:/MLDL/ALIVE/BackEnd/features.pkl")
    print("--- REQUIRED FEATURES ---")
    for f in features:
        print(f)
except Exception as e:
    print(f"Error: {e}")
