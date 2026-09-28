"""Lab 3: Conditional probability - P(next word | previous word).

A bigram language model: instead of one distribution over all words (lab 1),
we keep a separate distribution *per previous word*. This is the same idea
an LLM uses, just conditioned on one prior token instead of a long context.
"""

import re


def tokenize(sentence: str) -> list[str]:
    return re.findall(r"[a-z]+", sentence.lower())


def bigram_counts(sentences: list[str]) -> dict[str, dict[str, int]]:
    """counts[prev_word][next_word] = how many times next_word followed prev_word."""
    counts: dict[str, dict[str, int]] = {}
    # TODO: for each sentence, tokenize it, then for each consecutive pair
    # (prev, nxt) increment counts[prev][nxt] (creating inner dicts as needed).
    raise NotImplementedError


def conditional_probabilities(counts: dict[str, dict[str, int]]) -> dict[str, dict[str, float]]:
    """Normalize each prev_word's inner dict so its values sum to 1."""
    # TODO: for each prev_word, divide each next_word count by the total
    # count of words that followed prev_word.
    raise NotImplementedError


if __name__ == "__main__":
    sample = ["the movie was great", "the movie was long", "the food was great"]
    counts = bigram_counts(sample)

    assert counts["the"]["movie"] == 2
    assert counts["the"]["food"] == 1
    assert counts["was"]["great"] == 2
    assert counts["was"]["long"] == 1

    cond = conditional_probabilities(counts)
    assert abs(sum(cond["was"].values()) - 1.0) < 1e-9
    assert abs(cond["was"]["great"] - (2 / 3)) < 1e-9

    print("All checks passed.")
