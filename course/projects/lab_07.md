# Project: Self-Attention Heatmap over Real Word Embeddings

**Goal**: Build cheap word embeddings from a real review corpus by using bigram statistics (which words follow each word). Then feed one real sentence through your own scaled dot-product attention and visualise how much each word attends to every other word. This connects the attention math from the exercise to something you can see.

## What you start with

- Setup cell has run: `re`, `numpy as np`, `matplotlib.pyplot as plt` are imported, and `%matplotlib inline` is active.
- The dataset loader cell has run, giving `sentences` (list of review strings, already lowercase) and `labels` (list of 0/1).
- Your own exercise functions must be defined and run first:
  - `softmax(x: np.ndarray) -> np.ndarray` (normalises over the last axis)
  - `scaled_dot_product_attention(Q, K, V) -> tuple[np.ndarray, np.ndarray]` returning `(output, attention_weights)`

## Requirements

1. `tokenize(sentence: str) -> list[str]`: lowercase the sentence and return all runs of letters a-z as a list of words, so digits and punctuation are dropped.
2. `bigram_counts(sentences: list[str]) -> dict[str, dict[str, int]]`: for every sentence, tokenize it and for every adjacent pair `(prev, nxt)` count occurrences. The result maps `prev -> {nxt: count}`. Pairs never cross sentence boundaries.
3. `build_cooccurrence_embeddings(sentences: list[str], dim: int = 16) -> dict[str, np.ndarray]`:
   - Vocabulary = sorted set of all tokens across all sentences. Give each word an index by its position in this sorted list.
   - Build a matrix `raw` of shape `(V, V)` where `raw[i, j]` is the fraction of times word `j` follows word `i`: count of the pair divided by the total number of times `i` was followed by anything. Rows for words that are never followed by anything stay all zeros.
   - Make a random projection matrix of shape `(V, dim)` from `np.random.default_rng(0)` with `rng.normal(size=(V, dim))`. The seed 0 and this exact call make results reproducible.
   - Embeddings = `raw @ projection`. Return a dict mapping each word to its `dim`-length row vector.
4. Call it with `dim=16` to get `embeddings`.
5. Use the sentence `"the acting was superb and the story was touching"`. Tokenize it into `words` (9 words, repeated words such as "the" and "was" appear twice), and stack the matching embeddings into a matrix `X` of shape `(9, 16)`.
6. Run `scaled_dot_product_attention(X, X, X)` (same matrix as Q, K and V; a simplification) and keep the attention weights, shape `(9, 9)`.
7. Plot a heatmap of the attention weights: `figsize=(7, 6)`, `imshow` with the `"magma"` colormap, a colorbar labelled `attention weight`, x ticks = the words (rotated 45 degrees, right-aligned), y ticks = the words, title `Self-attention over: "<the sentence>"` (with the quotes), `tight_layout()`, then show.

## Expected output

- No required printed text. The deliverable is the heatmap: a 9x9 grid where every row sums to 1.
- Rows for the same word (for example the two "the" or the two "was") are identical, because the same vector gives the same scores. Columns for repeated words are identical too.
- The exact colours depend on the seeded random projection, so use seed 0 as specified and the picture is reproducible.

## Hints on approach

- Reuse lab 3's bigram idea. `dict.setdefault` or `.get(key, 0)` makes counting concise.
- Normalise per row (per preceding word), not over the whole matrix.
- `np.stack` of a list of vectors gives the `(n_words, dim)` matrix.
- Draw the projection once for the whole vocabulary, not once per word.

## How you'll be graded

1. `tokenize` and `bigram_counts` behave as specified (lowercase letter-runs only, bigrams within a sentence only).
2. Embeddings come from row-normalised bigram frequencies projected through the seeded `default_rng(0)` normal matrix, giving 16-dimensional vectors for every vocabulary word.
3. `X` is built in the sentence's word order, and attention is computed with the student's own `scaled_dot_product_attention` with `X` used as Q, K and V.
4. The heatmap has word labels on both axes, a colorbar, a title containing the sentence, and a 9x9 shape whose rows sum to 1.
