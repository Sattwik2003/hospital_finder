import joblib

from symptom_matcher import detect_specialty

model = joblib.load(
    "models/specialty_model.pkl"
)

while True:
    symptom = input(
        "\nEnter symptoms: "
    )

    keyword_match = detect_specialty(symptom)

    if keyword_match is not None:
        print(
            f"Predicted Specialty: {keyword_match.specialty}"
        )
        print(
            f"Matched Keyword: {keyword_match.keyword}"
        )
        continue

    prediction = model.predict(
        [symptom]
    )

    print(
        f"Predicted Specialty: {prediction[0]}"
    )