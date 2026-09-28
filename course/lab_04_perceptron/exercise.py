"""Lab 4: The perceptron - your own copy of the class to fill in.

This mirrors perceptron.py. Once these TODOs pass, compare against
perceptron.py / solution.py.
"""

import numpy as np


class Perceptron:
    def __init__(self, n_features: int):
        self.weights = np.zeros(n_features)
        self.bias = 0.0

    def net_input(self, x: np.ndarray) -> float:
        return float(np.dot(x, self.weights) + self.bias)

    def activation(self, z: float) -> int:
        """TODO: return +1 if z >= 0, else -1."""
        raise NotImplementedError

    def predict(self, x: np.ndarray) -> int:
        """TODO: run x through net_input then activation."""
        raise NotImplementedError


if __name__ == "__main__":
    p = Perceptron(n_features=2)
    p.weights = np.array([1.0, -1.0])
    p.bias = 0.5

    assert p.activation(0.3) == 1
    assert p.activation(-0.3) == -1

    assert p.predict(np.array([1.0, 0.0])) == 1   # net = 1*1 + -1*0 + 0.5 = 1.5
    assert p.predict(np.array([0.0, 2.0])) == -1  # net = 0 + -2 + 0.5 = -1.5

    print("All checks passed.")
