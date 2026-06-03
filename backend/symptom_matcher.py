from __future__ import annotations

import os
import re
from dataclasses import dataclass

import pandas as pd


@dataclass(frozen=True)
class MatchResult:
    specialty: str
    keyword: str
    source: str


_WORD_RE = re.compile(r"[^a-z0-9\s]+")
_SPACE_RE = re.compile(r"\s+")


def _normalize(text: str) -> str:
    text = str(text).lower().strip()
    text = _WORD_RE.sub(" ", text)
    text = _SPACE_RE.sub(" ", text)
    return text


def _load_symptom_rows():
    base_dir = os.path.dirname(__file__)
    symptoms_path = os.path.join(base_dir, "data", "symptoms.csv")
    df = pd.read_csv(symptoms_path)
    rows = []

    for _, row in df.iterrows():
        symptom = _normalize(row.get("symptoms", ""))
        specialty = str(row.get("specialty", "")).strip() or "General Medicine"

        if symptom:
                        rows.append((symptom, specialty))

    rows.sort(key=lambda item: len(item[0]), reverse=True)
    return rows


SYMPTOM_ROWS = _load_symptom_rows()


def detect_specialty(symptoms: str) -> MatchResult | None:
    normalized = _normalize(symptoms)
    if not normalized:
        return None

    best_match = None
    best_score = -1

    for symptom_keyword, specialty in SYMPTOM_ROWS:
        if symptom_keyword in normalized:
            score = len(symptom_keyword)

            if normalized == symptom_keyword:
                score += 1000

            if score > best_score:
                best_score = score
                best_match = MatchResult(
                    specialty=specialty,
                    keyword=symptom_keyword,
                    source="keyword-match",
                )

    return best_match