import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 3 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab03Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def bigram_counts(sentences: list[str])",
    hints: [
      {
        code: "def tokenize(sentence: str) -> list[str]:",
        block: "function",
        text: "Already written for you. It turns a sentence into a list of lowercase words, like `\“A b\”` into `[\“a\”, \“b\”]`.",
      },
      {
        code: "def bigram_counts(",
        block: "function",
        text:
          "Counts which word comes right after which. You get a list of sentences, like `[\"a b a c\"]`. You give back " +
          "a dict of dicts: the outer key is a word, its inner dict says which words came right after it and how many times, " +
          "like `{\"a\": {\"b\": 1, \"c\": 1}, \"b\": {\"a\": 1}}`. Pairs never cross from one sentence into the next. Example: `bigram_counts([\"a b a c\"])` gives `{\"a\": {\"b\": 1, \"c\": 1}, \"b\": {\"a\": 1}}`.",
      },
      {
        code: "counts: dict[str, dict[str, int]] = {}",
        text: "An empty dict that will hold the answer: each word, and how many times each other word followed it.",
      },
      {
        code: "sample = [",
        text: "A tiny test: three short sentences to run your functions on.",
      },
      {
        code: "counts = bigram_counts(sample)",
        text: "Runs **your** `bigram_counts` on the test sentences and keeps the answer.",
      },
      {
        code: "assert counts[\"the\"][\"movie\"] == 2",
        text: "A self-check. “the” is followed by “movie” in two sentences, so this count must be `2`. If it is not, the check stops and shows what your code gave back.",
      },
      {
        code: "assert counts[\"the\"][\"food\"] == 1",
        text: "“the” is followed by “food” in one sentence, so this count must be `1`.",
      },
      {
        code: "assert counts[\"was\"][\"great\"] == 2",
        text: "“was” is followed by “great” in two sentences, so this count must be `2`.",
      },
      {
        code: "assert counts[\"was\"][\"long\"] == 1",
        text: "“was” is followed by “long” in one sentence, so this count must be `1`.",
      },
      {
        code: "cond = conditional_probabilities(counts)",
        text: "Runs **your** `conditional_probabilities` on the counts from above.",
      },
      {
        code: "assert abs(sum(cond[\"was\"].values()) - 1.0) < 1e-9",
        text: "A self-check. The numbers after “was” must add up to `1.0`. The tiny `1e-9` allows for small rounding errors.",
      },
      {
        code: "assert abs(cond[\"was\"][\"great\"] - (2 / 3)) < 1e-9",
        text: "After “was”, “great” came 2 times out of 3, so its probability must be `2 / 3` (about 0.667).",
      },
      {
        code: "print(\"All checks passed.\")",
        text: "Only reached when every check above passed.",
      },
      {
        code: 'raise NotImplementedError("bigram_counts()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`for sentence in sentences:` and inside it `words = ...`, then `for prev, nxt in zip(..., ...):`, then `inner = counts.setdefault(prev, {})` and `inner[nxt] = ... + 1`. After the loops, `return counts`.\n\n" +
          "**1)** Set `words` to `tokenize(sentence)`.\n" +
          "**2)** Loop over `zip(words, words[1:])` to get each `prev, nxt` pair of neighbors.\n" +
          "**3)** Get the inner dict with `counts.setdefault(prev, {})`.\n" +
          "**4)** Add 1 to `inner[nxt]`. Use `inner.get(nxt, 0)` so a new word starts from 0.\n" +
          "**5)** Return `counts`.\n\n" +
          "For `[\"a b a c\"]` the pairs are `(a, b)`, `(b, a)`, `(a, c)`. A word that only ends sentences (like `c`) gets no entry, and an empty list gives `{}`.\n" +
          "**Check:** `[\"a b\", \"b c\"]` gives `{\"a\": {\"b\": 1}, \"b\": {\"c\": 1}}`.",
      },
    ],
  },
  {
    match: "def conditional_probabilities(",
    hints: [
      {
        code: "def conditional_probabilities(",
        block: "function",
        text:
          "Divides each previous word's inner dict by its own total, so its values add up to 1. You get the dict from " +
          "`bigram_counts`, like `{\"a\": {\"b\": 1, \"c\": 1}}`. You give back the same keys with each count divided by the total, " +
          "like `{\"a\": {\"b\": 0.5, \"c\": 0.5}}`. Example: `{\"a\": {\"b\": 1, \"c\": 1}, \"b\": {\"a\": 1}}` gives `{\"a\": {\"b\": 0.5, \"c\": 0.5}, \"b\": {\"a\": 1.0}}`.",
      },
      {
        code: 'raise NotImplementedError("conditional_probabilities()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`result = {}`, then `for prev, inner in counts.items():` and inside it `total = ...` and `result[prev] = {nxt: ... for nxt, count in inner.items()}`. After the loop, `return result`.\n\n" +
          "**1)** For each `prev`, set `total` to the sum of `inner.values()`.\n" +
          "**2)** Set `result[prev]` to a dict of each `nxt` with `count / total`.\n" +
          "**3)** Return `result`.\n\n" +
          "**Check:** `a` was followed by `b` once and by `c` once, so the total is 2 and each gets `1/2 = 0.5`. `b` was followed only by `a`, so the total is 1 and `a` gets `1.0`.",
      },
    ],
  },
];
