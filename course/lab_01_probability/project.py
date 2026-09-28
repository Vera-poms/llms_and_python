"""Lab 1 project (real-world): word probability distribution over real reviews.

This mirrors, at toy scale, what an LLM does at every generation step: it
holds a probability distribution over its whole vocabulary and then either
picks the top word (greedy) or samples from the distribution (temperature > 0).

Run: python lab_01_probability/project.py
"""

import csv
import random
from pathlib import Path

import matplotlib.pyplot as plt

from solution import tokenize, top_k, word_counts, word_probabilities

DATA_PATH = Path(__file__).parent.parent / "data" / "review_sentences.csv"


def load_sentences(path: Path) -> list[str]:
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return [row["sentence"] for row in reader]


def sample_next_word(distribution: dict[str, float], n: int = 5) -> list[str]:
    words = list(distribution.keys())
    weights = list(distribution.values())
    return random.choices(words, weights=weights, k=n)


def main() -> None:
    sentences = load_sentences(DATA_PATH)
    counts = word_counts(sentences)
    dist = word_probabilities(counts)

    print(f"Loaded {len(sentences)} real sentences, {len(counts)} unique words.")

    top15 = top_k(dist, 15)
    print("Most probable words in the corpus:")
    for word, prob in top15:
        print(f"  {word:<12} P={prob:.4f}")

    print("\nGreedy pick (always highest probability word):", top_k(dist, 1)[0][0])
    print("Sampled picks (weighted by probability):", sample_next_word(dist, n=5))

    words, probs = zip(*top15)
    plt.figure(figsize=(9, 5))
    plt.bar(words, probs, color="steelblue")
    plt.title("Word probability distribution over real review sentences")
    plt.ylabel("P(word)")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    out_path = Path(__file__).parent / "word_distribution.png"
    plt.savefig(out_path)
    print(f"\nSaved plot to {out_path}")


if __name__ == "__main__":
    main()
