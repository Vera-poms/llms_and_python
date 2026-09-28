"""Lab 4 solution."""

import numpy as np


class Perceptron:
    def __init__(self, n_features: int):
        self.weights = np.zeros(n_features)
        self.bias = 0.0

    def net_input(self, x: np.ndarray) -> float:
        return float(np.dot(x, self.weights) + self.bias)

    def activation(self, z: float) -> int:
        return 1 if z >= 0 else -1

    def predict(self, x: np.ndarray) -> int:
        return self.activation(self.net_input(x))


if __name__ == "__main__":
    p = Perceptron(n_features=2)
    p.weights = np.array([1.0, -1.0])
    p.bias = 0.5
    print(p.predict(np.array([1.0, 0.0])))
