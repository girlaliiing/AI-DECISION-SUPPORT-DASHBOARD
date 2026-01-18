import pandas as pd
from pymongo import MongoClient
import pickle
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

os.makedirs("models", exist_ok=True)

client = MongoClient("mongodb://localhost:27017")

db_ai = client["ai_decision_support"]
db_budget = client["budget_records"]

budget_cols = [
    "api",
    "budget_and_sources",
    "expenditures",
    "issues_and_concerns"
]

# ==========================================
# LOAD RNN RECOMMENDATIONS
# ==========================================
doc = db_ai["rnn_recommendations"].find_one({"_id": "LATEST"})
if not doc:
    raise RuntimeError("No recommendations stored in rnn_recommendations")

program_titles = [x["title"].lower() for x in doc.get("recommendations", [])]

def to_float(v):
    if isinstance(v, str):
        v = v.replace(",", "").strip()
    try:
        return float(v)
    except:
        return 0.0

rows = []

# ==========================================
# SCAN BUDGET HISTORY
# ==========================================
for col_name in budget_cols:
    col = db_budget[col_name]

    for r in col.find({}):

        # Combine all possible text fields
        all_text = " ".join([
            str(r.get("Program/ Project/ Activity Description", "")),
            str(r.get("ISSUES AND CONCERN", "")),
            str(r.get("POLICIES, PROGRAMS, PROJECTS AND ACTIVITIES", "")),
            str(r.get("Object of Expenditure", "")),
            str(r.get("Particulars", "")),
        ]).lower()

        # Must match any recommended program
        if not any(p in all_text for p in program_titles):
            continue

        ps = to_float(r.get("Personal Services (PS)", 0))
        mooe = to_float(r.get("Maintenance and Other Operating Expenses (MOOE)", 0))
        co = to_float(r.get("Capital Outlay") or r.get("Capital Outlay (CO)") or 0)

        total = ps + mooe + co
        if total <= 0:
            continue

        rows.append({
            "Program": "matched",
            "Funding Source": str(r.get("Funding Source", "Unknown")),
            "Year": int(r.get("Year")),
            "PS": ps,
            "MOOE": mooe,
            "CO": co,
            "Total": total
        })

df = pd.DataFrame(rows)
if df.empty:
    raise RuntimeError("No matched budget records for RF training")

priors = {
    "PS_mean": df["PS"].mean(),
    "MOOE_mean": df["MOOE"].mean(),
    "CO_mean": df["CO"].mean(),
}

# ==========================================
# ENCODING
# ==========================================
encoders = {}
for col in ["Program", "Funding Source"]:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

features = ["Program", "Funding Source", "Year"]
X = df[features]

# ==========================================
# TRAIN RF MODELS
# ==========================================
rf_ps = RandomForestRegressor(n_estimators=300, random_state=42)
rf_mooe = RandomForestRegressor(n_estimators=300, random_state=42)
rf_co = RandomForestRegressor(n_estimators=300, random_state=42)

rf_ps.fit(X, df["PS"])
rf_mooe.fit(X, df["MOOE"])
rf_co.fit(X, df["CO"])

pickle.dump(rf_ps, open("models/rf_ps.pkl", "wb"))
pickle.dump(rf_mooe, open("models/rf_mooe.pkl", "wb"))
pickle.dump(rf_co, open("models/rf_co.pkl", "wb"))
pickle.dump(encoders, open("models/rf_encoders.pkl", "wb"))
pickle.dump(features, open("models/rf_features.pkl", "wb"))
pickle.dump(priors, open("models/rf_priors.pkl", "wb"))

print("✔ Budget models retrained using RNN recommendations")
