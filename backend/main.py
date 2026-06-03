from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib

from symptom_matcher import detect_specialty

app = FastAPI()

# ADD THIS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("models/specialty_model.pkl")

class SymptomRequest(BaseModel):
    symptoms: str

@app.get("/")
def home():
    return {
        "message": "Hospital AI API Running"
    }

@app.post("/predict")
def predict(data: SymptomRequest):

    keyword_match = detect_specialty(data.symptoms)

    if keyword_match is not None:
        return {
            "specialty": keyword_match.specialty,
            "matchedKeyword": keyword_match.keyword,
            "source": keyword_match.source,
        }

    prediction = model.predict(
        [data.symptoms]
    )

    return {
        "specialty": prediction[0],
        "matchedKeyword": None,
        "source": "model"
    }