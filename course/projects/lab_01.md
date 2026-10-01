# Project: Word Probabilities of Real Reviews

## Goal
Apply the tokenize -> count -> normalize pipeline from this lab to a real corpus of review sentences. You will build the corpus-wide word probability distribution, show the most probable words, and contrast "greedy" next-word choice (always the most probable word) with "sampled" choice (random, weighted by probability). Finally you draw a bar chart of the top words, a literal picture of a model's output distribution.

## What you start with
Already in the kernel (run the loader cell first):
- `sentences`: `list[str]`, 170 lowercase review sentences.
- `labels`: `list[int]` (1 = positive, 0 = negative). You do not need it in this project.
- Imports from the setup cell: `random`, `re`, `plt` (matplotlib.pyplot).

Your own exercise functions from this lab MUST be defined and run (the exercise or solution cell) before your project cell:
- `tokenize(sentence: str) -> list[str]`
- `word_counts(sentences: list[str]) -> dict[str, int]`
- `word_probabilities(counts: dict[str, int]) -> dict[str, float]`
- `top_k(distribution: dict[str, float], k: int) -> list[tuple[str, float]]`

Note: the exercise cell also defines a variable named `sample` (a small list). Avoid reusing that name for something else in a confusing way.

## Requirements
1. Define a new function `sample_next_word(distribution: dict[str, float], n: int = 5) -> list[str]`. It draws `n` words at random from the distribution, **with replacement**, where each word's chance of being drawn equals its probability. It returns a list of `n` word strings. (Hint: the standard `random` module has a function for weighted draws.)
2. Build the distribution over the whole corpus using your own functions: counts from `sentences`, then probabilities from those counts. Keep the variable names `counts` and `dist`.
3. Print one summary line in the form `170 sentences, <N> unique words.` where the numbers are computed (not hard-coded) from `sentences` and `counts`.
4. Compute the 15 most probable words with `top_k` (call the result `top15`). Print a header line `Most probable words in the corpus:` and then one line per word, indented two spaces, showing the word left-aligned in a 12-character field and its probability to 4 decimals, e.g. `  the          P=0.0xxx`.
5. Print a blank line, then the greedy pick: the single highest-probability word obtained via `top_k(dist, 1)`. Format: `Greedy pick (always highest probability word): <word>`.
6. Print the sampled picks: call `sample_next_word(dist, n=5)` and print the list on a line starting `Sampled picks (weighted by probability): `.
7. Draw a bar chart of the top 15 words:
   - `plt.figure(figsize=(9, 5))`
   - x = the 15 words, bar height = their probabilities, bar color `"steelblue"`
   - title: `Word probability distribution over real review sentences`
   - y-axis label: `P(word)`
   - x tick labels rotated 45 degrees and right-aligned so they do not overlap
   - call `plt.tight_layout()` then `plt.show()`

## Expected output
- First line reports 170 sentences and a unique-word count (your count depends on your tokenizer; it should match any correct letters-only, lowercased tokenizer).
- 15 lines of words with probabilities in descending order. Function words such as "the" dominate; the top probability is small (a few percent), and all 15 values together are well below 1.
- The greedy pick is deterministic and must be identical to the first word in the top-15 list (it is the same word every run).
- The sampled picks are **random**: five words that change on every run, and frequent words (like "the") will appear more often than rare ones.
- One bar chart, 15 bars from tallest (left) to shortest (right).

## Hints on approach
- The greedy pick and the first entry of `top15` are the same thing seen two ways; this is a good self-check.
- Weighted sampling needs a list of words and a parallel list of weights, both taken from the dictionary in the same order.
- Unpack a list of `(word, prob)` pairs into two sequences before plotting (the `zip(*pairs)` idiom does this).
- Plotting reminder: `plt.bar(x_labels, heights, color=...)`, and `plt.xticks(rotation=..., ha=...)`.

## How you'll be graded
The grader compares behaviour, not exact formatting. These must hold:
1. `sample_next_word` returns exactly `n` words, drawn with replacement and weighted by the given probabilities (not uniformly, not without replacement).
2. The distribution is built from the full `sentences` list using the lab's own `word_counts` / `word_probabilities` (probabilities sum to 1).
3. The top-15 list is sorted by descending probability, with the correct words and probabilities, and the printed probabilities show 4 decimals.
4. The greedy pick is the single most probable word and matches the first top-15 entry.
5. The sentence count and unique-word count are computed from the data and printed.
6. The bar chart plots the top 15 words vs. their probabilities with the specified title, y-label, size, color and rotated labels.
