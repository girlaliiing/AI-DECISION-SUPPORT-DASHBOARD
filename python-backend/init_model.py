import torch
import torch.nn as nn
import numpy as np
from sklearn.preprocessing import LabelEncoder

# Load event classes
event_classes = np.load("event_classes.npy", allow_pickle=True)

# Load CLUP program keys
from services_template import CLUP_PROGRAMS
program_keys = list(CLUP_PROGRAMS.keys())

# Encoders
event_encoder = LabelEncoder()
event_encoder.fit(event_classes)

program_encoder = LabelEncoder()
program_encoder.fit(program_keys)

# LSTM Model Definition (MUST MATCH server.py)
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

# Initialize model
model = SessionLSTM(
    input_size=len(event_encoder.classes_),
    hidden_size=128,
    output_size=len(program_keys)
)

# Save random-initialized weights
torch.save(model.state_dict(), "session_lstm.pth")

print("session_lstm.pth initialized successfully.")
