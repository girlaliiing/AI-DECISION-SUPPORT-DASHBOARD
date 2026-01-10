import numpy as np

EVENT_CLASSES = [
    # Sanitation & Environment
    "HAS_TOILET",
    "NO_TOILET",
    "HAS_MRF",
    "HAS_GARDEN",

    # Social Protection
    "IS_4PS",
    "IS_IP",

    # Health
    "SMOKER",
    "FAMILY_PLANNING_USER",

    # Age Groups
    "AGE_UNDER_18",
    "AGE_18_59",
    "AGE_60_ABOVE",

    # Sex
    "SEX_FEMALE",
    "SEX_MALE",

    # Civil Status
    "CIVIL_MARRIED",
    "CIVIL_SINGLE",

    # Education
    "EDU_NO_SCHOOL",
    "EDU_ELEMENTARY",
    "EDU_HIGH_SCHOOL",
    "EDU_COLLEGE",

    # Occupation
    "OCCUPATION_HEALTH_WORKER",
    "OCCUPATION_UNEMPLOYED",
    "OCCUPATION_OTHER",

    # Fallback
    "NO_SIGNAL"
]

np.save("event_classes.npy", np.array(EVENT_CLASSES, dtype=object))
print("event_classes.npy generated successfully.")
