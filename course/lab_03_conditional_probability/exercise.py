"""Lab 3: Conditional probability - P(next word | previous word).

A bigram language model: instead of one distribution over all words (lab 1),
we keep a separate distribution *per previous word*. This is the same idea
an LLM uses, just conditioned on one prior token instead of a long context.
"""

import re


def tokenize(sentence: str) -> list[str]:
    return re.findall(r"[a-z]+", sentence.lower())


def bigram_counts(sentences: list[str]) -> dict[str, dict[str, int]]:
    """counts[prev_word][next_word] = how many times next_word followed prev_word.

    Args:
        sentences: a list of sentences, e.g. ["a b a c"]

    Returns:
        A dict of dicts. The outer key is a word, the inner dict maps each
        word that came right after it to a count, e.g.
        {"a": {"b": 1, "c": 1}, "b": {"a": 1}}.
        Pairs never cross from one sentence into the next. A word that only
        ever ends sentences, or a one-word sentence, adds no outer key.

    Example:
        bigram_counts(["a b a c"]) -> {"a": {"b": 1, "c": 1}, "b": {"a": 1}}
    """
    counts: dict[str, dict[str, int]] = {}
    # TODO:
    # 1. Loop over the sentences and turn each one into a list of words
    #    with tokenize().
    # 2. Walk through the consecutive pairs (prev, nxt) of that list
    #    (zip(words, words[1:]) gives them).
    # 3. Make sure counts[prev] exists (counts.setdefault(prev, {}) does
    #    that), then add 1 to its entry for nxt (starting from 0).
    # 4. Return `counts` after all sentences are done.
    raise NotImplementedError("bigram_counts() is not implemented yet - replace the TODO with your code")


def conditional_probabilities(counts: dict[str, dict[str, int]]) -> dict[str, dict[str, float]]:
    """Normalize each prev_word's inner dict so its values sum to 1.

    Args:
        counts: the output of bigram_counts, e.g. {"a": {"b": 1, "c": 1}}

    Returns:
        A dict of dicts with the same keys, where each count is divided by
        the total of its own inner dict, e.g. {"a": {"b": 0.5, "c": 0.5}}.
        Each inner dict sums to 1.0.

    Example:
        conditional_probabilities({"a": {"b": 1, "c": 1}, "b": {"a": 1}})
        -> {"a": {"b": 0.5, "c": 0.5}, "b": {"a": 1.0}}
    """
    # TODO:
    # 1. Loop over each prev_word and its inner dict of next-word counts.
    # 2. Add up that inner dict's counts to get its own total.
    # 3. Build a new inner dict: each next_word's count divided by that total.
    # 4. Collect the new inner dicts in a result dict and return it.
    raise NotImplementedError("conditional_probabilities() is not implemented yet - replace the TODO with your code")


if __name__ == "__main__":
    sample = ["the movie was great", "the movie was long", "the food was great"]
    counts = bigram_counts(sample)

    assert counts["the"]["movie"] == 2, 'counts["the"]["movie"] should be ' + repr(2) + ", got " + repr(counts["the"]["movie"])
    assert counts["the"]["food"] == 1, 'counts["the"]["food"] should be ' + repr(1) + ", got " + repr(counts["the"]["food"])
    assert counts["was"]["great"] == 2, 'counts["was"]["great"] should be ' + repr(2) + ", got " + repr(counts["was"]["great"])
    assert counts["was"]["long"] == 1, 'counts["was"]["long"] should be ' + repr(1) + ", got " + repr(counts["was"]["long"])

    cond = conditional_probabilities(counts)
    assert abs(sum(cond["was"].values()) - 1.0) < 1e-9, 'sum(cond["was"].values()) should be about ' + repr(1.0) + ", got " + repr(sum(cond["was"].values()))
    assert abs(cond["was"]["great"] - (2 / 3)) < 1e-9, 'cond["was"]["great"] should be about ' + repr(2 / 3) + ", got " + repr(cond["was"]["great"])

    print("All checks passed.")
