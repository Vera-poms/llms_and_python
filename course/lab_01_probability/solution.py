"""Lab 1 solution. Compare against your own exercise.py once you've tried it."""

import re


def tokenize(sentence: str) -> list[str]:
    return re.findall(r"[a-z]+", sentence.lower())


def word_counts(sentences: list[str]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for sentence in sentences:
        for word in tokenize(sentence):
            counts[word] = counts.get(word, 0) + 1
    return counts


def word_probabilities(counts: dict[str, int]) -> dict[str, float]:
    total = sum(counts.values())
    return {word: count / total for word, count in counts.items()}


def top_k(distribution: dict[str, float], k: int) -> list[tuple[str, float]]:
    return sorted(distribution.items(), key=lambda item: item[1], reverse=True)[:k]


if __name__ == "__main__":
    sample = ["the movie was great", "the movie was long", "the food was great"]
    counts = word_counts(sample)
    dist = word_probabilities(counts)
    print(top_k(dist, 3))
