"""Lab 5 project (real-world): train a sentiment perceptron on real reviews.

Reuses lab 4's feature pipeline (a discriminative bag-of-words vocabulary)
and its Perceptron class, then actually trains it with a proper train/test
split, tracks training accuracy per epoch, and reports held-out test
accuracy. PCA (also from lab 4) is used only to make a 2D picture of data
that actually lives in a higher-dimensional word-presence space.

Run: python lab_05_training_perceptron/project.py
"""

import sys
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

sys.path.insert(0, str(Path(__file__).parent.parent / "lab_04_perceptron"))
from perceptron import Perceptron  # noqa: E402
from project import DATA_PATH, build_vocab, load_dataset, pca_2d, vectorize  # noqa: E402

from train import train

TEST_FRACTION = 0.2
RANDOM_SEED = 0


def train_test_split(*arrays: np.ndarray, test_fraction: float, seed: int):
    rng = np.random.default_rng(seed)
    n = len(arrays[0])
    indices = rng.permutation(n)
    n_test = int(n * test_fraction)
    test_idx, train_idx = indices[:n_test], indices[n_test:]
    return [a[train_idx] for a in arrays], [a[test_idx] for a in arrays]


def accuracy(model: Perceptron, X: np.ndarray, y: np.ndarray) -> float:
    predictions = np.array([model.predict(x) for x in X])
    return float((predictions == y).mean())


def main() -> None:
    sentences, y = load_dataset(DATA_PATH)
    vocab = build_vocab(sentences, y)
    X = vectorize(sentences, vocab)
    X2d = pca_2d(X)
    print(f"Sentiment vocabulary ({len(vocab)} words): {vocab}")

    (X_train, X2d_train, y_train), (X_test, X2d_test, y_test) = train_test_split(
        X, X2d, y, test_fraction=TEST_FRACTION, seed=RANDOM_SEED
    )

    model = Perceptron(n_features=X.shape[1])
    errors_per_epoch = train(model, X_train, y_train, epochs=60, learning_rate=1.0)
    accuracy_per_epoch = [1 - e / len(X_train) for e in errors_per_epoch]

    test_acc = accuracy(model, X_test, y_test)
    print(f"Train examples: {len(X_train)}, test examples: {len(X_test)}")
    print(f"Training errors by epoch: {errors_per_epoch}")
    print(f"Held-out test accuracy: {test_acc:.2%}")

    predictions_test = np.array([model.predict(x) for x in X_test])
    correct = predictions_test == y_test

    fig, axes = plt.subplots(1, 2, figsize=(13, 5))
    axes[0].plot(range(1, len(errors_per_epoch) + 1), accuracy_per_epoch, marker="o")
    axes[0].set_xlabel("epoch")
    axes[0].set_ylabel("training accuracy")
    axes[0].set_title("Learning curve")

    axes[1].scatter(*X2d_train[y_train == 1].T, color="seagreen", alpha=0.4, label="train +")
    axes[1].scatter(*X2d_train[y_train == -1].T, color="crimson", alpha=0.4, label="train -")
    axes[1].scatter(*X2d_test[correct].T, color="royalblue", marker="o", label="test correct")
    axes[1].scatter(*X2d_test[~correct].T, color="black", marker="x", s=80, label="test wrong")
    axes[1].set_xlabel("PCA component 1 (visualization only)")
    axes[1].set_ylabel("PCA component 2 (visualization only)")
    axes[1].set_title(f"Trained perceptron (test accuracy {test_acc:.0%})")
    axes[1].legend(fontsize=8)

    plt.tight_layout()
    out_path = Path(__file__).parent / "training_results.png"
    plt.savefig(out_path)
    print(f"\nSaved plot to {out_path}")


if __name__ == "__main__":
    main()
