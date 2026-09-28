"""The Perceptron: the simplest possible neuron.

This is the reusable module - lab_05 imports `Perceptron` from here to
practice Python's module system across folders. Training (fitting weights
from data) is deliberately left out; that's lab 5's job.
"""

import numpy as np


class Perceptron:
    def __init__(self, n_features: int):
        self.weights = np.zeros(n_features)
        self.bias = 0.0

    def net_input(self, x: np.ndarray) -> float:
        """The weighted sum before the activation step: w . x + b."""
        return float(np.dot(x, self.weights) + self.bias)

    def activation(self, z: float) -> int:
        """Step function: +1 if z >= 0, else -1."""
        return 1 if z >= 0 else -1

    def predict(self, x: np.ndarray) -> int:
        """Run x through the perceptron: net_input, then activation."""
        return self.activation(self.net_input(x))
