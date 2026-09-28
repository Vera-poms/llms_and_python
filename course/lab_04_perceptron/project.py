"""Lab 4 project (real-world): perceptron before training.

Turns real review sentences into bag-of-words vectors, projects them to 2D
with PCA (implemented with plain numpy, no sklearn), and shows what an
*untrained* perceptron predicts - motivation for lab 5, where we actually
train it.

Run: python lab_04_perceptron/project.py
"""

import csv
import re
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

from perceptron import Perceptron

DATA_PATH = Path(__file__).parent.parent / "data" / "review_sentences.csv"
MIN_WORD_COUNT = 3
MIN_POLARITY_RATIO = 0.7


def tokenize(sentence: str) -> list[str]:
    return re.findall(r"[a-z]+", sentence.lower())


def load_dataset(path: Path) -> tuple[list[str], np.ndarray]:
    sentences, labels = [], []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            sentences.append(row["sentence"])
            labels.append(1 if row["label"] == "1" else -1)
    return sentences, np.array(labels)


def build_vocab(sentences: list[str], y: np.ndarray) -> list[str]:
    """Pick words whose presence strongly leans toward one label.

    A plain "most frequent words" vocabulary would be dominated by
    stopwords like "the" and "was", which appear equally in both classes
    and give a linear classifier nothing to separate on. Instead we keep
    words that are lopsided between positive and negative sentences -
    a simple stand-in for a sentiment lexicon.
    """
    pos_doc_counts: dict[str, int] = {}
    neg_doc_counts: dict[str, int] = {}
    for sentence, label in zip(sentences, y):
        bucket = pos_doc_counts if label == 1 else neg_doc_counts
        for word in set(tokenize(sentence)):
            bucket[word] = bucket.get(word, 0) + 1

    vocab = []
    for word in set(pos_doc_counts) | set(neg_doc_counts):
        pos, neg = pos_doc_counts.get(word, 0), neg_doc_counts.get(word, 0)
        total = pos + neg
        if total < MIN_WORD_COUNT:
            continue
        if abs(pos - neg) / total < MIN_POLARITY_RATIO:
            continue
        vocab.append((word, total))

    vocab.sort(key=lambda pair: pair[1], reverse=True)
    return [word for word, _ in vocab]


def vectorize(sentences: list[str], vocab: list[str]) -> np.ndarray:
    """Binary bag-of-words: 1 if the vocab word appears in the sentence, else 0."""
    index = {word: i for i, word in enumerate(vocab)}
    X = np.zeros((len(sentences), len(vocab)))
    for row, s in enumerate(sentences):
        for w in set(tokenize(s)):
            if w in index:
                X[row, index[w]] = 1.0
    return X


def pca_2d(X: np.ndarray) -> np.ndarray:
    centered = X - X.mean(axis=0)
    cov = np.cov(centered, rowvar=False)
    eigenvalues, eigenvectors = np.linalg.eigh(cov)
    top2 = eigenvectors[:, np.argsort(eigenvalues)[::-1][:2]]
    return centered @ top2


def plot_boundary(X2d: np.ndarray, y: np.ndarray, model: Perceptron, title: str, out_path: Path) -> None:
    plt.figure(figsize=(7, 6))
    for label, color, name in ((1, "seagreen", "positive"), (-1, "crimson", "negative")):
        mask = y == label
        plt.scatter(X2d[mask, 0], X2d[mask, 1], color=color, alpha=0.7, label=name)

    x_min, x_max = X2d[:, 0].min() - 1, X2d[:, 0].max() + 1
    if abs(model.weights[1]) > 1e-9:
        xs = np.linspace(x_min, x_max, 100)
        ys = -(model.weights[0] * xs + model.bias) / model.weights[1]
        plt.plot(xs, ys, color="black", linestyle="--", label="decision boundary")

    plt.xlabel("PCA component 1")
    plt.ylabel("PCA component 2")
    plt.title(title)
    plt.legend()
    plt.tight_layout()
    plt.savefig(out_path)


def main() -> None:
    sentences, y = load_dataset(DATA_PATH)
    vocab = build_vocab(sentences, y)
    X = vectorize(sentences, vocab)
    X2d = pca_2d(X)

    model = Perceptron(n_features=2)
    predictions = np.array([model.predict(x) for x in X2d])
    accuracy = (predictions == y).mean()

    print(f"Vocabulary size: {len(vocab)}")
    print(f"Untrained perceptron accuracy on real sentiment data: {accuracy:.2%}")
    print("(Weights are all zero, so it predicts the same class for everything - see lab 5.)")

    out_path = Path(__file__).parent / "untrained_boundary.png"
    plot_boundary(X2d, y, model, "Untrained perceptron on real review sentiment", out_path)
    print(f"Saved plot to {out_path}")


if __name__ == "__main__":
    main()
