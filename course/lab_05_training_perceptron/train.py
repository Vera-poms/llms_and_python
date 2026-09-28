"""Lab 5: Training a simple perceptron.

The perceptron learning rule: for each misclassified example, nudge the
weights and bias in the direction that would have gotten it right.
Repeat over the dataset for several epochs until it (hopefully) converges.

This module imports `Perceptron` from lab_04_perceptron/perceptron.py -
practice reading how a sibling folder becomes an importable module via
sys.path.
"""

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent.parent / "lab_04_perceptron"))
from perceptron import Perceptron  # noqa: E402


def train(
    model: Perceptron,
    X: np.ndarray,
    y: np.ndarray,
    epochs: int = 20,
    learning_rate: float = 0.1,
) -> list[int]:
    """Run the perceptron learning rule. Returns mistakes made per epoch."""
    errors_per_epoch = []
    for _ in range(epochs):
        errors = 0
        for xi, target in zip(X, y):
            prediction = model.predict(xi)
            if prediction != target:
                update = learning_rate * target
                model.weights += update * xi
                model.bias += update
                errors += 1
        errors_per_epoch.append(errors)
    return errors_per_epoch


if __name__ == "__main__":
    # a tiny linearly separable toy set, just to sanity check the loop itself
    X = np.array([[2.0, 2.0], [3.0, 3.0], [-2.0, -2.0], [-3.0, -1.0]])
    y = np.array([1, 1, -1, -1])

    model = Perceptron(n_features=2)
    errors = train(model, X, y, epochs=10, learning_rate=0.1)

    assert errors[-1] == 0, "should converge to zero training errors on a linearly separable set"
    for xi, target in zip(X, y):
        assert model.predict(xi) == target

    print("Training converged. Errors per epoch:", errors)
