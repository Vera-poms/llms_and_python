"""Lab 2 project (real-world): predicting word count from character length.

Contrasts two "simple prediction" strategies on the real review corpus:
- a naive baseline that always predicts the mean word count
- a linear regression that predicts word count from sentence length in
  characters

Run: python lab_02_prediction/project.py
"""

import csv
from pathlib import Path

import matplotlib.pyplot as plt

from solution import linear_regression_fit, mean_squared_error, predict

DATA_PATH = Path(__file__).parent.parent / "data" / "review_sentences.csv"


def load_sentences(path: Path) -> list[str]:
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return [row["sentence"] for row in reader]


def main() -> None:
    sentences = load_sentences(DATA_PATH)
    char_lengths = [float(len(s)) for s in sentences]
    word_counts = [float(len(s.split())) for s in sentences]

    mean_baseline = sum(word_counts) / len(word_counts)
    baseline_preds = [mean_baseline] * len(word_counts)
    baseline_mse = mean_squared_error(word_counts, baseline_preds)

    slope, intercept = linear_regression_fit(char_lengths, word_counts)
    regression_preds = [predict(x, slope, intercept) for x in char_lengths]
    regression_mse = mean_squared_error(word_counts, regression_preds)

    print(f"Naive baseline (always predict mean={mean_baseline:.2f}): MSE={baseline_mse:.3f}")
    print(f"Linear regression (word_count = {slope:.3f} * char_len + {intercept:.3f}): MSE={regression_mse:.3f}")

    new_sentence_len = 60.0
    print(f"\nPredicted word count for a {int(new_sentence_len)}-character sentence: "
          f"{predict(new_sentence_len, slope, intercept):.1f}")

    plt.figure(figsize=(8, 6))
    plt.scatter(char_lengths, word_counts, alpha=0.6, label="real sentences")
    xs = sorted(char_lengths)
    plt.plot(xs, [predict(x, slope, intercept) for x in xs], color="crimson", label="regression fit")
    plt.axhline(mean_baseline, color="gray", linestyle="--", label="naive mean baseline")
    plt.xlabel("sentence length (characters)")
    plt.ylabel("word count")
    plt.title("Predicting word count from character length")
    plt.legend()
    plt.tight_layout()
    out_path = Path(__file__).parent / "regression_fit.png"
    plt.savefig(out_path)
    print(f"Saved plot to {out_path}")


if __name__ == "__main__":
    main()
