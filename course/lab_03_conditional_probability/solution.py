"""Lab 3 solution."""

import re


def tokenize(sentence: str) -> list[str]:
    return re.findall(r"[a-z]+", sentence.lower())


def bigram_counts(sentences: list[str]) -> dict[str, dict[str, int]]:
    counts: dict[str, dict[str, int]] = {}
    for sentence in sentences:
        words = tokenize(sentence)
        for prev, nxt in zip(words, words[1:]):
            inner = counts.setdefault(prev, {})
            inner[nxt] = inner.get(nxt, 0) + 1
    return counts


def conditional_probabilities(counts: dict[str, dict[str, int]]) -> dict[str, dict[str, float]]:
    cond: dict[str, dict[str, float]] = {}
    for prev, next_counts in counts.items():
        total = sum(next_counts.values())
        cond[prev] = {nxt: count / total for nxt, count in next_counts.items()}
    return cond


if __name__ == "__main__":
    sample = ["the movie was great", "the movie was long", "the food was great"]
    cond = conditional_probabilities(bigram_counts(sample))
    print(cond["was"])
