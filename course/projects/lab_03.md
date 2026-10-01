# Project: A Bigram Text Generator and Heatmap

## Goal
Turn the bigram model from this lab into a tiny text generator trained on real reviews, and then visualize what it learned. You will sample new sentences one word at a time from `P(next | previous)`, which is the same loop an LLM uses, only with one word of context. You will then draw a heatmap of the conditional probabilities for the most frequent words.

## What you start with
Already in the kernel (run the loader cell first):
- `sentences`: `list[str]`, 170 review sentences. `labels`: `list[int]` (not needed here).
- `random`, `re`, `plt` (matplotlib.pyplot) and `np` (numpy), imported in the setup cell.

Your own exercise functions from this lab MUST be defined and run (exercise or solution cell) before your project cell:
- `tokenize(sentence: str) -> list[str]` (lowercase letter-only tokens; given in the exercise cell)
- `bigram_counts(sentences: list[str]) -> dict[str, dict[str, int]]`, where `counts[prev][next]` is how many times `next` followed `prev` within a sentence
- `conditional_probabilities(counts) -> dict[str, dict[str, float]]`, where each inner dict sums to 1

## Requirements
1. Define `generate_sentence(cond: dict[str, dict[str, float]], start: str, length: int = 10) -> str`:
   - Start the word list with `start`.
   - Repeat up to `length - 1` more times: look up the options for the current word in `cond`. If the current word has no entry or its options are empty (a dead end, e.g. a word that only ever ends sentences), stop early.
   - Otherwise choose ONE next word at random, weighted by its conditional probability, append it, and make it the current word.
   - Return the words joined with single spaces. The result has at most `length` words and always begins with `start`.
2. Build the model on the whole corpus: `counts = bigram_counts(sentences)` and `cond = conditional_probabilities(counts)`.
3. Print the header `Generated sentences from the real bigram model:`, then for each seed in `"the"`, `"this"`, `"i"` (in that order) print one line `  [<seed>] -> <generated sentence>` (two leading spaces).
4. Heatmap data:
   - For each previous word compute its total outgoing count (sum of its inner count dict). Take the 12 previous words with the largest totals, in descending order: `top_prev_words`.
   - Pool the counts of all following words that occur after those 12 previous words (summing across them) and take the 12 most frequent following words, descending: `top_next_words`.
   - Build a 12 x 12 numpy array `matrix` with rows = `top_prev_words`, columns = `top_next_words`, where each entry is `cond[prev]` probability of `nxt` (0.0 if that pair never occurs).
5. Plot `matrix` as an image:
   - `plt.figure(figsize=(8, 7))`, `plt.imshow(matrix, cmap="viridis", aspect="auto")`
   - colorbar labeled `P(next word | previous word)`
   - x ticks = `top_next_words`, rotated 45 degrees and right-aligned; y ticks = `top_prev_words`
   - x label `next word`, y label `previous word`, title `Conditional probability heatmap (real review corpus)`
   - `plt.tight_layout()` then `plt.show()`

## Expected output
- Three generated lines. **They are random** and will differ every run. They start with the seed, read like slightly odd review phrases, are at most 10 words long, and may be shorter if a dead-end word is hit.
- A 12 x 12 heatmap. The row for a word like "the" will have a few bright cells; common words like "the", "was", "and", "i", "this" appear among the top previous words (this part is deterministic given the data). Rows with a single dominant continuation show one very bright cell.

## Hints on approach
- Use the same weighted-choice idea as in lab 1: parallel lists of candidate words and their probabilities, one draw.
- `dict.get(key)` returns `None` for unknown keys, a convenient way to detect a dead end.
- For ranking dictionaries by a value, `sorted(d, key=d.get, reverse=True)` returns the keys ordered by value.
- Do the "pooling" step with a plain dict accumulator.
- `np.zeros((rows, cols))` makes the matrix, then fill by nested loops with `enumerate`.
- Remember that probabilities (not raw counts) go into the heatmap.

## How you'll be graded
The grader checks behaviour, not exact text. These must hold:
1. `generate_sentence` starts with the seed, samples each next word with weights from `cond`, stops early on a dead end, and never exceeds `length` words.
2. The model is built from the full `sentences` using the lab's `bigram_counts` and `conditional_probabilities`.
3. Sentences are generated and printed for the three seeds "the", "this", "i".
4. The 12 most frequent previous words are chosen by total outgoing count, and the 12 most frequent next words are chosen by pooled counts from those rows.
5. The heatmap matrix contains conditional probabilities (0 for unseen pairs), with correct row/column orientation and labels.
6. The plot is an `imshow` heatmap with colorbar, tick labels, axis labels and title as specified.
