import pandas as pd
import json
import random

# Load CSV
df = pd.read_csv(
    "hospital_directory.csv",
    low_memory=False
)

# Filter only West Bengal
df = df[df["State"] == "West Bengal"]

# Major cities only
# Leave this empty to include all West Bengal districts.
major_cities = []

if major_cities:
    df = df[df["District"].isin(major_cities)]

hospitals = []

for _, row in df.iterrows():

    # Phone selection
    phone = str(row["Mobile_Number"])

    if phone in ["0", "nan", "None"]:
        phone = str(row["Telephone"])

    # Specialty cleanup
    raw_specialties = str(row["Specialties"])

    if raw_specialties.lower() in ["nan", "none", "0", ""]:
        specialty = "General Medicine"
    else:
        specialty_list = []

        for item in raw_specialties.split(","):
            cleaned_item = item.strip()

            if cleaned_item in ["", "0", "nan", "None"]:
                cleaned_item = "General Medicine"

            if cleaned_item not in specialty_list:
                specialty_list.append(cleaned_item)

        specialty = ", ".join(specialty_list) if specialty_list else "General Medicine"

    # Beds
    beds = (
        int(row["Total_Num_Beds"])
        if pd.notna(row["Total_Num_Beds"])
        else 0
    )

    # Emergency detection
    emergency = str(
        row["Emergency_Services"]
    ).lower()

    hospital_emergency = (
        emergency not in [
            "0",
            "nan",
            "false",
            "none"
        ]
    )

    hospital = {
        "name": str(
            row["Hospital_Name"]
        ).strip(),

        "city": str(
            row["District"]
        ).strip(),

        "address": str(
            row["Address_Original_First_Line"]
        ).strip(),

        "phone": phone,

        "specialty": specialty,

        "website": str(
            row["Website"]
        ),

        "beds": beds,

        # Random realistic values
        "rating": round(
            random.uniform(3.8, 4.9),
            1
        ),

        "avgCost": random.randint(
            30000,
            120000
        ),

        "emergency": hospital_emergency,

        # Assume larger hospitals have ICU
        "icu": beds > 50
    }

    hospitals.append(hospital)

# Save JSON
with open(
    "hospital-data.json",
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        hospitals,
        f,
        indent=2,
        ensure_ascii=False
    )

print(df["District"].value_counts())

print(
    f"Generated {len(hospitals)} hospitals"
)