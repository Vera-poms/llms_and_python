"""Lab 1: Probability - build a word probability distribution from real text.

Fill in the TODOs. Run this file directly to check your work against the
asserts at the bottom.
"""

import re


def tokenize(sentence: str) -> list[str]:
    """Split a sentence into lowercase word tokens (no punctuation).

    Args:
        sentence: one sentence as a string, e.g. "The Movie, was great!"

    Returns:
        A list of lowercase words made only of letters, in the order they
        appear. Punctuation and spaces are dropped. An empty string gives [].

    Example:
        tokenize("The Movie, was great!") -> ["the", "movie", "was", "great"]
    """
    # TODO:
    # 1. Lowercase the sentence with sentence.lower().
    # 2. Call re.findall with a pattern that matches each run of letters a-z.
    # 3. Return the list that re.findall gives you.
    raise NotImplementedError("tokenize() is not implemented yet - replace the TODO with your code")


def word_counts(sentences: list[str]) -> dict[str, int]:
    """Count how many times each word appears across all sentences.

    Args:
        sentences: a list of sentences, e.g. ["a b", "b c b"]

    Returns:
        A dict mapping each word to how many times it occurred in total,
        e.g. {"a": 1, "b": 3, "c": 1}. An empty list gives {}.

    Example:
        word_counts(["a b", "b c b"]) -> {"a": 1, "b": 3, "c": 1}
    """
    counts: dict[str, int] = {}
    # TODO:
    # 1. Loop over each sentence and turn it into words with tokenize().
    # 2. Loop over each word. If it is already in `counts`, add 1 to its
    #    count; if not, start it at 1 (counts.get(word, 0) helps here).
    # 3. Return `counts` once every sentence has been processed.
    raise NotImplementedError("word_counts() is not implemented yet - replace the TODO with your code")


def word_probabilities(counts: dict[str, int]) -> dict[str, float]:
    """Turn raw counts into a probability distribution that sums to 1.

    Args:
        counts: word -> count, e.g. {"a": 1, "b": 3}

    Returns:
        A dict with the same words, where each value is that word's count
        divided by the total of all counts, e.g. {"a": 0.25, "b": 0.75}.
        The values add up to 1.0. An empty dict gives {}.

    Example:
        word_probabilities({"a": 1, "b": 3}) -> {"a": 0.25, "b": 0.75}
    """
    # TODO:
    # 1. Add up all the counts (sum(counts.values())) to get the total.
    # 2. Build a new dict: for every word, its count divided by the total.
    # 3. Return the new dict (do not change the input dict).
    raise NotImplementedError("word_probabilities() is not implemented yet - replace the TODO with your code")


def top_k(distribution: dict[str, float], k: int) -> list[tuple[str, float]]:
    """Return the k (word, probability) pairs with the highest probability.

    Args:
        distribution: word -> probability, e.g. {"a": 0.5, "b": 0.25, "c": 0.25}
        k: how many pairs to return, e.g. 2

    Returns:
        A list of (word, probability) tuples, highest probability first,
        at most k long (fewer if the dict is smaller). Words with equal
        probability keep the order they had in the dict.

    Example:
        top_k({"a": 0.5, "b": 0.25, "c": 0.25}, 2) -> [("a", 0.5), ("b", 0.25)]
    """
    # TODO:
    # 1. Get the (word, probability) pairs with distribution.items().
    # 2. Sort them by the probability, biggest first
    #    (sorted(..., key=..., reverse=True)).
    # 3. Keep only the first k pairs with a slice, and return that list.
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
