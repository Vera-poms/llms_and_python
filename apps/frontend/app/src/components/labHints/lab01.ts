import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 1 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab01Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def word_probabilities(counts: dict[str, int])",
    hints: [
      {
        code: "def tokenize(sentence: str) -> list[str]:",
        block: "function",
        text:
          "Splits one sentence into lowercase words, with no punctuation. You get one sentence (a `str`), like `\"The Movie, was great!\"`. " +
          "You give back its words as a list, in the same order: `[\"the\", \"movie\", \"was\", \"great\"]`. Only letters stay. Spaces and punctuation are dropped. An empty string gives `[]`. " +
          "Example: `tokenize(\"The Movie, was great!\")` gives `[\"the\", \"movie\", \"was\", \"great\"]`.",
      },
      {
        code: "def word_counts(sentences: list[str])",
        block: "function",
        text:
          "Counts how many times each word shows up in all the sentences. You get a list of sentences, like `[\"a b\", \"b c b\"]`. " +
          "You give back a dict of word -> count, like `{\"a\": 1, \"b\": 3, \"c\": 1}`. An empty list gives `{}`. " +
          "Example: `word_counts([\"a b\", \"b c b\"])` gives `{\"a\": 1, \"b\": 3, \"c\": 1}`.",
      },
      {
        code: "def word_probabilities(counts: dict[str, int])",
        block: "function",
        text:
          "Turns counts into probabilities that add up to 1. You get a dict of word -> count, like `{\"a\": 1, \"b\": 3}`. " +
          "You give back a dict with the same words. Each value is the word's count divided by the total of all the counts, like `{\"a\": 0.25, \"b\": 0.75}`. " +
          "The values add up to 1.0. An empty dict gives `{}`. Example: `word_probabilities({\"a\": 1, \"b\": 3})` gives `{\"a\": 0.25, \"b\": 0.75}`.",
      },
      {
        code: "def top_k(distribution: dict[str, float], k: int)",
        block: "function",
        text:
          "Gives back the `k` (word, probability) pairs with the highest probability. You get a dict of word -> probability, like `{\"a\": 0.5, \"b\": 0.25, \"c\": 0.25}`, " +
          "and `k`, how many pairs you want, like `2`. You give back a list of `(word, probability)` pairs, highest first, with at most `k` pairs (fewer if the dict is smaller). " +
          "Words with the same probability stay in the order they had in the dict. Example: `top_k({\"a\": 0.5, \"b\": 0.25, \"c\": 0.25}, 2)` gives `[(\"a\", 0.5), (\"b\", 0.25)]`.",
      },
      {
        code: "counts: dict[str, int] = {}",
        text: "An empty dict that will hold the answer: each word, and how many times it showed up.",
      },
      {
        code: "sample = [",
        text: "A tiny test: three short sentences to run your functions on.",
      },
      {
        code: "got = tokenize(",
        text: "Runs **your** `tokenize` on a sentence with capital letters and punctuation, and keeps the answer.",
      },
      {
        code: "assert got == [",
        text: "A self-check. `tokenize` must lowercase the words and drop the punctuation. If it does not, the check stops and shows what your code gave back.",
      },
      {
        code: "counts = word_counts(sample)",
        text: "Runs **your** `word_counts` on the three test sentences and keeps the answer.",
      },
      {
        code: "assert counts[\"the\"] == 3",
        text: "A self-check. “the” shows up once in each of the three sentences, so its count must be `3`.",
      },
      {
        code: "assert counts[\"was\"] == 3",
        text: "“was” shows up once in each of the three sentences, so its count must be `3`.",
      },
      {
        code: "assert counts[\"great\"] == 2",
        text: "“great” shows up in two sentences, so its count must be `2`.",
      },
      {
        code: "dist = word_probabilities(counts)",
        text: "Runs **your** `word_probabilities` on the counts from above.",
      },
      {
        code: "assert abs(sum(dist.values()) - 1.0) < 1e-9",
        text: "A self-check. The probabilities must add up to `1.0` (there are 12 words in total, so “the” is `3/12 = 0.25`). The tiny `1e-9` allows for small rounding errors.",
      },
      {
        code: "top = top_k(dist, 2)",
        text: "Runs **your** `top_k` to get the 2 most likely words.",
      },
      {
        code: "assert len(top) == 2",
        text: "A self-check. You asked for 2 pairs, so you must get exactly 2.",
      },
      {
        code: "assert top[0][0] in (",
        text: "A self-check. The first word must be “the” or “was”. They tie at 0.25, and nothing is more likely.",
      },
      {
        code: "print(\"All checks passed.\")",
        text: "Only reached when every check above passed. If one check fails, its message shows what it expected and what your code gave back.",
      },
      {
        code: 'raise NotImplementedError("tokenize()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`return re.findall(..., ...)` with a pattern for letters, on lowercase text.\n\n" +
          "**1)** Make the sentence lowercase.\n" +
          "**2)** Call `re.findall` with the pattern `[a-z]+` on it. (`re` is already imported.) This gives every run of letters, so `\"don't\"` becomes `[\"don\", \"t\"]`, digits are dropped, and `\"\"` gives `[]`.\n" +
          "**3)** Return that list.\n\n" +
          "**Check:** `tokenize(\"Hi, you!\")` is `[\"hi\", \"you\"]`.",
      },
      {
        code: 'raise NotImplementedError("word_counts()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`for sentence in sentences:` and inside it `for word in ...:` and `counts[word] = ... + 1`. After the loops, `return counts`.\n\n" +
          "**1)** For each word in `tokenize(sentence)`, add 1 to `counts[word]`.\n" +
          "**2)** Use `counts.get(word, 0)` so a new word starts from 0.\n" +
          "**3)** Return `counts`. An empty list gives `{}`.\n\n" +
          "**Check:** for `[\"a b\", \"b c b\"]`, `b` shows up once in the first sentence and twice in the second, so its count is 3.",
      },
      {
        code: 'raise NotImplementedError("word_probabilities()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`total = ...` and then `return {word: ... for word, count in counts.items()}`.\n\n" +
          "**1)** Set `total` to the sum of `counts.values()`.\n" +
          "**2)** Build a dict with each word and `count / total`. Do not change the dict you were given.\n" +
          "**3)** Return it. An empty dict gives `{}`.\n\n" +
          "**Check:** the total is `1 + 3 = 4`, so `a` is `1/4 = 0.25` and `b` is `3/4 = 0.75`.",
      },
      {
        code: 'raise NotImplementedError("top_k()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`pairs = ...`, then `ordered = sorted(pairs, key=..., reverse=True)`, then `return ...`.\n\n" +
          "**1)** Set `pairs` to `list(distribution.items())`.\n" +
          "**2)** Sort `pairs` by the probability (the second item of each pair), biggest first, with `sorted(..., key=lambda p: p[1], reverse=True)`. Words with the same probability keep their old dict order (`b` before `c` in the example above).\n" +
          "**3)** Return the first `k` pairs with `ordered[:k]`. If `k` is bigger than the dict, you get all the pairs.\n\n" +
          "**Check:** with `{\"a\": 0.25, \"b\": 0.25, \"c\": 0.5}` and `k=2` you get `[(\"c\", 0.5), (\"a\", 0.25)]`.",
      },
    ],
  },
];
