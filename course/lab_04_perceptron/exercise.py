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
        """Turn a score into a class label.

        Args:
            z: the net input (score), a single number.

        Returns:
            1 if z >= 0, otherwise -1 (an int, never 0).

        Example:
            activation(0.3) -> 1, activation(-0.3) -> -1, activation(0.0) -> 1

        TODO:
            1. Compare z with 0 (remember: exactly 0 counts as the +1 side).
            2. Return 1 for the "yes" side and -1 for the "no" side.
        """
        raise NotImplementedError("Perceptron.activation() is not implemented yet - replace the TODO with your code")

    def predict(self, x: np.ndarray) -> int:
        """Classify one example.

        Args:
            x: numpy array of features for ONE example, e.g. np.array([1.0, 0.0]).

        Returns:
            1 or -1.

        Example:
            with weights [1.0, -1.0] and bias 0.5:
            predict(np.array([1.0, 0.0])) -> 1   (score 1.5)
            predict(np.array([0.0, 2.0])) -> -1  (score -1.5)

        TODO:
            1. Get the score for x by calling the existing self.net_input.
            2. Pass that score to self.activation.
            3. Return what activation gives back.
        """
        raise NotImplementedError("Perceptron.predict() is not implemented yet - replace the TODO with your code")


if __name__ == "__main__":
    p = Perceptron(n_features=2)
    p.weights = np.array([1.0, -1.0])
    p.bias = 0.5

    assert p.activation(0.3) == 1, 'p.activation(0.3) should be ' + repr(1) + ", got " + repr(p.activation(0.3))
    assert p.activation(-0.3) == -1, 'p.activation(-0.3) should be ' + repr(-1) + ", got " + repr(p.activation(-0.3))

    assert p.predict(np.array([1.0, 0.0])) == 1, 'p.predict(np.array([1.0, 0.0])) should be ' + repr(1) + ", got " + repr(p.predict(np.array([1.0, 0.0])))   # net = 1*1 + -1*0 + 0.5 = 1.5
    assert p.predict(np.array([0.0, 2.0])) == -1, 'p.predict(np.array([0.0, 2.0])) should be ' + repr(-1) + ", got " + repr(p.predict(np.array([0.0, 2.0])))  # net = 0 + -2 + 0.5 = -1.5

    print("All checks passed.")
