import torch
import torch.nn as nn

class LSTMModel(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(LSTMModel, self).__init__()

        # Main LSTM layer
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            batch_first=True
        )

        # Final dense layer
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        # x shape: (batch_size, seq_len, input_size)

        lstm_out, _ = self.lstm(x)

        # Take only the LAST time step → (batch_size, hidden_size)
        last_step = lstm_out[:, -1, :]

        # Pass through output layer
        output = self.fc(last_step)

        return output
