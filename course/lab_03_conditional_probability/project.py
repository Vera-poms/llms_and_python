"""Lab 3 project (real-world): a bigram language model over real reviews.

Builds P(next_word | prev_word) from the real review corpus, uses it to
generate new sentences by sampling, and plots a heatmap of the conditional
distribution for the most frequent words.

Run: python lab_03_conditional_probability/project.py
"""

import csv
import random
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

from solution import bigram_counts, conditional_probabilities, tokenize

DATA_PATH = Path(__file__).parent.parent / "data" / "review_sentences.csv"


def load_sentences(path: Path) -> list[str]:
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return [row["sentence"] for row in reader]


def generate_sentence(cond: dict[str, dict[str, float]], start: str, length: int = 10) -> str:
    words = [start]
    current = start
    for _ in range(length - 1):
        options = cond.get(current)
        if not options:
            break
        next_words = list(options.keys())
        weights = list(options.values())
        current = random.choices(next_words, weights=weights, k=1)[0]
        words.append(current)
    return " ".join(words)


def main() -> None:
    sentences = load_sentences(DATA_PATH)
    counts = bigram_counts(sentences)
    cond = conditional_probabilities(counts)

    print("Generated sentences from the real bigram model:")
    for seed in ("the", "this", "i"):
        print(f"  [{seed}] -> {generate_sentence(cond, seed)}")

    total_next_counts = {prev: sum(inner.values()) for prev, inner in counts.items()}
    top_prev_words = sorted(total_next_counts, key=total_next_counts.get, reverse=True)[:12]

    next_word_totals: dict[str, int] = {}
    for prev in top_prev_words:
        for nxt, c in counts[prev].items():
            next_word_totals[nxt] = next_word_totals.get(nxt, 0) + c
    top_next_words = sorted(next_word_totals, key=next_word_totals.get, reverse=True)[:12]

    matrix = np.zeros((len(top_prev_words), len(top_next_words)))
    for i, prev in enumerate(top_prev_words):
        for j, nxt in enumerate(top_next_words):
            matrix[i, j] = cond[prev].get(nxt, 0.0)

    plt.figure(figsize=(8, 7))
    plt.imshow(matrix, cmap="viridis", aspect="auto")
    plt.colorbar(label="P(next word | previous word)")
    plt.xticks(range(len(top_next_words)), top_next_words, rotation=45, ha="right")
    plt.yticks(range(len(top_prev_words)), top_prev_words)
    plt.xlabel("next word")
    plt.ylabel("previous word")
    plt.title("Conditional probability heatmap (real review corpus)")
    plt.tight_layout()
    out_path = Path(__file__).parent / "conditional_heatmap.png"
    plt.savefig(out_path)
    print(f"\nSaved heatmap to {out_path}")


if __name__ == "__main__":
    main()
