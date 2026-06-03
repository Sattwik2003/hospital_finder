import pandas as pd
import joblib

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

print("Loading dataset...")

df = pd.read_csv("data/symptoms.csv")

model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", MultinomialNB())
])

print("Training model...")

model.fit(
    df["symptoms"],
    df["specialty"]
)

joblib.dump(
    model,
    "models/specialty_model.pkl"
)

print("Model trained successfully!")