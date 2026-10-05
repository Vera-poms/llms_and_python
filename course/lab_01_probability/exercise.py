"""Lab 1: Probability - build a word probability distribution from real text.

Fill in the TODOs. Run this file directly to check your work against the
asserts at the bottom.
"""

import re


def tokenize(sentence: str) -> list[str]:
    """Split a sentence into lowercase word tokens (no punctuation)."""
    # TODO: use re.findall to pull out sequences of letters, lowercased.
    raise NotImplementedError("tokenize() is not implemented yet - replace the TODO with your code")


def word_counts(sentences: list[str]) -> dict[str, int]:
    """Count how many times each word appears across all sentences."""
    counts: dict[str, int] = {}
    # TODO: tokenize each sentence and tally word counts into `counts`.
    raise NotImplementedError("word_counts() is not implemented yet - replace the TODO with your code")


def word_probabilities(counts: dict[str, int]) -> dict[str, float]:
    """Turn raw counts into a probability distribution that sums to 1."""
    # TODO: divide each count by the total number of word occurrences.
    raise NotImplementedError("word_probabilities() is not implemented yet - replace the TODO with your code")


def top_k(distribution: dict[str, float], k: int) -> list[tuple[str, float]]:
    """Return the k (word, probability) pairs with the highest probability."""
    # TODO: sort the distribution by probability, descending, and slice to k.
    raise NotImplementedError("top_k() is not implemented yet - replace the TODO with your code")


if __name__ == "__main__":
    sample = ["the movie was great", "the movie was long", "the food was great"]

    got = tokenize("The Movie, was great!")
    assert got == ["the", "movie", "was", "great"], f"tokenize: expected ['the', 'movie', 'was', 'great'], got {got} (lower-case and strip punctuation)"

    counts = word_counts(sample)
    assert counts["the"] == 3, f'word_counts: "the" should be 3, got {counts.get("the")}'
    assert counts["was"] == 3, f'word_counts: "was" should be 3, got {counts.get("was")}'
    assert counts["great"] == 2, f'word_counts: "great" should be 2, got {counts.get("great")}'

    dist = word_probabilities(counts)
    assert abs(sum(dist.values()) - 1.0) < 1e-9, f"word_probabilities: should sum to 1.0, got {sum(dist.values())}"

    top = top_k(dist, 2)
    assert len(top) == 2, f"top_k(dist, 2) should return 2 items, got {len(top)}"
    assert top[0][0] in ("the", "was"), f"top_k: top word should be the or was, got {top[0][0]!r} (sort descending)"

    print("All checks passed.")
