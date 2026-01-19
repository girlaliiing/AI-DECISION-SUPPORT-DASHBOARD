from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
import pickle
import pandas as pd
import numpy as np
import os
import re

app = FastAPI()

# ==================================================
# LOAD MODELS
# ==================================================
rf_ps = pickle.load(open("models/rf_ps.pkl", "rb"))
rf_mooe = pickle.load(open("models/rf_mooe.pkl", "rb"))
rf_co = pickle.load(open("models/rf_co.pkl", "rb"))
encoders = pickle.load(open("models/rf_encoders.pkl", "rb"))
features = pickle.load(open("models/rf_features.pkl", "rb"))
priors = pickle.load(open("models/rf_priors.pkl", "rb"))

# ==================================================
# DATABASE
# ==================================================
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db_ai = client["ai_decision_support"]
db_budget = client["budget_records"]

budget_cols = ["api", "budget_and_sources", "expenditures", "issues_and_concerns"]
total_budget_col = db_budget["total_budget"]

# ==================================================
class BudgetRequest(BaseModel):
    year: int

# ==================================================
def normalize(text: str) -> set:
    return set(re.findall(r"[a-z]+", text.lower()))

def program_matches(a: str, b: str) -> bool:
    a_set, b_set = normalize(a), normalize(b)
    if not a_set or not b_set:
        return False
    return len(a_set & b_set) / len(a_set | b_set) >= 0.20

# ==================================================
def get_latest_total_budget():
    latest = total_budget_col.find_one(sort=[("Year", -1)])
    if not latest:
        raise HTTPException(400, "No Total_Budget record found")
    return float(str(latest["Total Budget"]).replace(",", ""))

# ==================================================
def fetch_context(program: str, year: int):
    rows = []
    for col_name in budget_cols:
        col = db_budget[col_name]
        for r in col.find({}):
            text_fields = [
                "Program/ Project/ Activity Description",
                "ISSUES AND CONCERN",
                "POLICIES, PROGRAMS, PROJECTS AND ACTIVITIES",
                "Object of Expenditure",
                "Particulars"
            ]

            match_text = " ".join(str(r.get(f, "")) for f in text_fields)

            if program_matches(program, match_text):
                rows.append({
                    "Program": program.lower(),
                    "Funding Source": str(r.get("Funding Source", "Unknown")),
                    "Year": int(r.get("Year")),
                })
    return rows

# ==================================================
@app.post("/predict-budget")
def predict_budget(req: BudgetRequest):

    doc = db_ai["rnn_recommendations"].find_one({"_id": "LATEST"})
    if not doc:
        raise HTTPException(400, "No RNN recommendations stored")

    programs = [x["title"] for x in doc["recommendations"]]

    raw_predictions = []

    for program in programs:
        context = fetch_context(program, req.year)
        if not context:
            context = [{
                "Program": program.lower(),
                "Funding Source": "Unknown",
                "Year": req.year
            }]

        df = pd.DataFrame(context)

        for col, enc in encoders.items():
            df[col] = df[col].astype(str)
            df[col] = df[col].apply(lambda v: v if v in enc.classes_ else enc.classes_[0])
            df[col] = enc.transform(df[col])

        X = df[features]

        ps = max(np.mean(rf_ps.predict(X)), priors["PS_mean"] * 0.25)
        mooe = max(np.mean(rf_mooe.predict(X)), priors["MOOE_mean"] * 0.25)
        co = max(np.mean(rf_co.predict(X)), priors["CO_mean"] * 0.25)

        raw_predictions.append({
            "program": program,
            "ps": ps,
            "mooe": mooe,
            "co": co,
            "raw_total": ps + mooe + co
        })

    raw_total = sum(r["raw_total"] for r in raw_predictions)
    official_total = get_latest_total_budget()

    scale = official_total / raw_total if raw_total else 1

    final = []
    for r in raw_predictions:
        ps = r["ps"] * scale
        mooe = r["mooe"] * scale
        co = r["co"] * scale

        final.append({
            "program": r["program"],
            "ps": round(ps, 2),
            "mooe": round(mooe, 2),
            "co": round(co, 2),
            "total": round(ps + mooe + co, 2)
        })

    # ==================================================
    # 🔥 SAVE BUDGETS BACK INTO rnn_recommendations (LATEST)
    # ==================================================
    updated_recs = []
    for rec in doc["recommendations"]:
        match = next((b for b in final if b["program"] == rec["title"]), None)
        updated_recs.append({
            **rec,
            "budget": match or None
        })

    db_ai["rnn_recommendations"].update_one(
        {"_id": "LATEST"},
        {"$set": {"recommendations": updated_recs}}
    )

    return {
        "year": req.year,
        "official_total_budget": round(official_total, 2),
        "computed_total_budget": round(sum(x["total"] for x in final), 2),
        "budgets": final,
        "saved_to_db": True
    }
