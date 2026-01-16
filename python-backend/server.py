from fastapi import FastAPI
from pydantic import BaseModel
import torch
import torch.nn as nn
import numpy as np
from sklearn.preprocessing import LabelEncoder
from typing import List, Dict
import datetime
import uvicorn
import uuid
from collections import defaultdict

from services_template import CLUP_PROGRAMS

app = FastAPI()

program_keys = list(CLUP_PROGRAMS.keys())

event_encoder = LabelEncoder()
event_encoder.classes_ = np.load("event_classes.npy", allow_pickle=True)

class SessionLSTM(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.embed = nn.Embedding(input_size, hidden_size)
        self.lstm = nn.LSTM(hidden_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        x = self.embed(x)
        out, _ = self.lstm(x)
        return self.fc(out[:, -1, :])

model = SessionLSTM(len(event_encoder.classes_), 128, len(program_keys))
model.load_state_dict(torch.load("session_lstm.pth", map_location="cpu"))
model.eval()

class RequestBody(BaseModel):
    households: List[Dict]

def household_to_events(h: Dict) -> List[str]:
    events = []
    events.append("HAS_TOILET" if h.get("TOILET") == "Y" else "NO_TOILET")
    if h.get("MRF SEGREGATED") == "Y": events.append("HAS_MRF")
    if h.get("GARDEN") == "Y": events.append("HAS_GARDEN")
    if h.get("4P'S") == "Y": events.append("IS_4PS")
    if h.get("IP'S") == "Y": events.append("IS_IP")
    if h.get("SMOKER") == "Y": events.append("SMOKER")
    if h.get("FAMILY PLANNING"): events.append("FAMILY_PLANNING_USER")
    age = h.get("AGE")
    if isinstance(age, int):
        if age < 18: events.append("AGE_UNDER_18")
        elif age < 60: events.append("AGE_18_59")
        else: events.append("AGE_60_ABOVE")
    if h.get("SEX") == "F": events.append("SEX_FEMALE")
    elif h.get("SEX") == "M": events.append("SEX_MALE")
    if h.get("CIVIL STATUS") == "MARRIED": events.append("CIVIL_MARRIED")
    else: events.append("CIVIL_SINGLE")
    edu = (h.get("EDUCATIONAL ATTAINMENT") or "").upper()
    if "NO" in edu: events.append("EDU_NO_SCHOOL")
    elif "ELEMENTARY" in edu: events.append("EDU_ELEMENTARY")
    elif "HIGH SCHOOL" in edu: events.append("EDU_HIGH_SCHOOL")
    elif "COLLEGE" in edu: events.append("EDU_COLLEGE")
    occ = (h.get("OCCUPATION") or "").upper()
    if "BHW" in occ or "HEALTH" in occ: events.append("OCCUPATION_HEALTH_WORKER")
    elif occ.strip() == "": events.append("OCCUPATION_UNEMPLOYED")
    else: events.append("OCCUPATION_OTHER")
    return events or ["NO_SIGNAL"]

def recommend(events: List[str], top_k=8):
    valid = [e for e in events if e in event_encoder.classes_]
    if not valid: valid = ["NO_SIGNAL"]
    encoded = event_encoder.transform(valid)
    seq = torch.tensor(encoded).unsqueeze(0)
    with torch.no_grad():
        logits = model(seq)
        probs = torch.softmax(logits, dim=1)[0]
    topk = torch.topk(probs, k=top_k)
    max_prob = topk.values[0].item() or 1e-6
    ranked = []
    for rank, (idx, prob) in enumerate(zip(topk.indices.tolist(), topk.values.tolist())):
        normalized = prob / max_prob
        weighted_score = normalized * (1 / (rank + 1))
        ranked.append((program_keys[idx], weighted_score))
    return ranked

@app.post("/run-lstm")
def run_lstm(req: RequestBody):
    households = req.households
    total = len(households)
    program_hits = defaultdict(list)

    # Compute scores for each household
    for h in households:
        ranked = recommend(household_to_events(h))
        for program, score in ranked:
            program_hits[program].append(score)

    results = []

    # Compute avg_score, beneficiaries, coverage
    for program, scores in program_hits.items():
        beneficiaries = len(scores)
        avg_score = sum(scores)/beneficiaries if beneficiaries > 0 else 0
        coverage = beneficiaries / total if total > 0 else 0
        template = CLUP_PROGRAMS[program]
        results.append({
            "id": str(uuid.uuid4()),
            "title": template["title"],
            "description": template["description"],
            "category": template["category"],
            "size": beneficiaries,
            "avg_score": round(avg_score,3),
            "coverage_ratio": round(coverage,3)
        })

    # Sort by need metric (avg_score * size)
    results.sort(key=lambda x: x["avg_score"] * x["size"], reverse=True)

    # Assign priority dynamically: top 1/3 High, middle 1/3 Medium, bottom 1/3 Low
    n = len(results)
    for i, r in enumerate(results):
        if i < n/3:
            r["priority"] = "High"
        elif i < 2*n/3:
            r["priority"] = "Medium"
        else:
            r["priority"] = "Low"

    return results

@app.get("/")
def root():
    return {
        "status": "running",
        "programs": len(program_keys),
        "events": len(event_encoder.classes_)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
