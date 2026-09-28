"""Lab 1: Probability - build a word probability distribution from real text.

Fill in the TODOs. Run this file directly to check your work against the
asserts at the bottom.
"""

import re


def tokenize(sentence: str) -> list[str]:
    """Split a sentence into lowercase word tokens (no punctuation)."""
    # TODO: use re.findall to pull out sequences of letters, lowercased.
    raise NotImplementedError


def word_counts(sentences: list[str]) -> dict[str, int]:
    """Count how many times each word appears across all sentences."""
    counts: dict[str, int] = {}
    # TODO: tokenize each sentence and tally word counts into `counts`.
    raise NotImplementedError


def word_probabilities(counts: dict[str, int]) -> dict[str, float]:
    """Turn raw counts into a probability distribution that sums to 1."""
    # TODO: divide each count by the total number of word occurrences.
    raise NotImplementedError


def top_k(distribution: dict[str, float], k: int) -> list[tuple[str, float]]:
    """Return the k (word, probability) pairs with the highest probability."""
    # TODO: sort the distribution by probability, descending, and slice to k.
    raise NotImplementedError


if __name__ == "__main__":
    sample = ["the movie was great", "the movie was long", "the food was great"]

    assert tokenize("The Movie, was great!") == ["the", "movie", "was", "great"]

    counts = word_counts(sample)
    assert counts["the"] == 3
    assert counts["was"] == 3
    assert counts["great"] == 2

    dist = word_probabilities(counts)
    assert abs(sum(dist.values()) - 1.0) < 1e-9

    top = top_k(dist, 2)
    assert top[0][0] in ("the", "was")

    print("All checks passed.")
