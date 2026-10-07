# Project: Self-Attention Heatmap over Real Word Embeddings

## Goal

**The question:** when a transformer reads the sentence "the acting was superb and the story was touching", how much does each word "look at" every other word? You will build a picture that answers this.

To do it, you need a number-list (an *embedding*) for each word. Real models learn these. You will make cheap ones from real review text by counting which words tend to come next after each word. Then you will run those embeddings through your own attention function and draw the result.

You will:

1. Write `tokenize` to split a sentence into clean lowercase words.
2. Write `bigram_counts` to count which word follows which.
3. Write `build_cooccurrence_embeddings` to turn those counts into a 16-number vector per word.
4. Pick one sentence, look up its word vectors and stack them into a matrix `X`.
5. Run your `scaled_dot_product_attention` on `X`.
6. Draw the 9x9 attention weights as a heatmap.

**Takeaway:** attention is just a table of "how much does word A pay attention to word B", and you can draw it as a grid of colours.

## Words you will see

- **Token**: one word after cleaning. In this lab, a token is a run of letters a-z.
- **Bigram**: two words that sit next to each other, in order. In "the acting was", the bigrams are `(the, acting)` and `(acting, was)`.
- **Vocabulary**: the list of every different word in the whole dataset, with no repeats.
- **Embedding**: a list of numbers that stands for a word. Here each embedding has 16 numbers.
- **Vector / matrix**: a vector is a 1-D list of numbers. A matrix is a 2-D grid. A matrix with shape `(9, 16)` has 9 rows and 16 columns.
- **Random projection**: multiplying by a matrix of random numbers to squash long vectors into short ones. We use it because the raw count rows are as long as the whole vocabulary (hundreds of numbers) and we want only 16.
- **Seed**: a starting number for a random generator. The same seed gives the same "random" numbers every time, so your picture matches everyone else's.
- **Attention weights**: a grid where row `i`, column `j` says how much word `i` attends to word `j`. Each row adds up to 1.
- **Heatmap**: a picture where each cell of a grid is coloured by its number. `imshow` draws one.
- **Regular expression (regex)**: a pattern for finding text. `re.findall(pattern, text)` returns every match as a list.
- **numpy (`np`)**: the library for fast number grids. `@` is matrix multiplication. `np.stack` glues vectors into a matrix.

## What you start with

Already in the kernel:

- `re`, `np` (numpy), `plt` (matplotlib.pyplot). Plots show inside the notebook.
- `sentences`: a list of 170 review strings, already lowercase. Example: `sentences[2]` is `"the acting was superb and the story was touching"`.
- `labels`: a list of 170 ints (0 or 1). You do not need it in this project.

Your own exercise functions **must be defined and run first** (run the exercise or solution cell):

- `softmax(x: np.ndarray) -> np.ndarray`: turns each row of raw scores into probabilities that sum to 1 (works over the last axis).
- `scaled_dot_product_attention(Q, K, V) -> tuple[np.ndarray, np.ndarray]`: returns `(output, attention_weights)`.

If you see `NameError: name 'softmax' is not defined`, you skipped that cell.

## Steps

### Step 1: `tokenize(sentence: str) -> list[str]`

Lowercase the sentence, then keep only runs of the letters a-z. Digits and punctuation vanish and act as separators.

Worked example (input -> output):

- `"Hello, World! It's 2024."` -> `['hello', 'world', 'it', 's']`

Notice that `It's` splits into `it` and `s`, and `2024` disappears.

Tool: `re.findall(r"[a-z]+", text)` returns every run of letters as a list. `str.lower()` handles the lowercasing.

**Check:** `tokenize("the acting was superb")` returns `['the', 'acting', 'was', 'superb']`.

### Step 2: `bigram_counts(sentences: list[str]) -> dict[str, dict[str, int]]`

Count how often each word is directly followed by each other word. The result is a dict of dicts: `result[prev][nxt] = count`.

Worked example with two tiny sentences `["a b a b", "b c"]`:

- Sentence 1 tokens: `a b a b`. Pairs: `(a,b)`, `(b,a)`, `(a,b)`.
- Sentence 2 tokens: `b c`. Pair: `(b,c)`.
- Result: `{'a': {'b': 2}, 'b': {'a': 1, 'c': 1}}`

Note that the pair `(b, b)` from the end of sentence 1 to the start of sentence 2 is **not** counted. Pairs never cross a sentence boundary. So tokenize each sentence on its own, then pair up neighbours inside it only.

Tool: `zip(words, words[1:])` gives every neighbouring pair. `dict.setdefault(key, {})` or `dict.get(key, 0)` lets you add to a count that may not exist yet.

**Check:** on the real data, `bigram_counts(sentences)["acting"]` is `{'was': 1, 'felt': 1}`.

### Step 3: `build_cooccurrence_embeddings(sentences: list[str], dim: int = 16) -> dict[str, np.ndarray]`

This is the biggest step. It has four parts.

**3a. Vocabulary and index.** Collect every token from every sentence, remove repeats, and sort alphabetically. Call it the vocabulary. Its length is `V` (it is 523 on the real data). A word's index is its position in this sorted list. For example, `a` is index 0 because it sorts first.

**3b. The `raw` matrix, shape `(V, V)`.** Start with all zeros. Row `i` is the word at index `i`. Cell `raw[i, j]` is the fraction of the time that word `i` is followed by word `j`:

`raw[i, j] = count(i followed by j) / total number of times i was followed by anything`

Worked example. In the real data, `"the"` is followed by something 148 times in total, and by `"movie"` 4 of those times. So `raw[index["the"], index["movie"]] = 4 / 148` (about 0.027). Each row you fill in sums to 1. A word that is never followed by anything (it only ever ends sentences, like `"touching"`) keeps an all-zero row. Do not divide by zero for those: you only fill rows for words that appear as `prev` in your bigram counts.

Normalise per row (per preceding word), not over the whole matrix.

**3c. The projection matrix, shape `(V, dim)`.** Create it with exactly these two lines of idea:

- make a generator: `rng = np.random.default_rng(0)`
- draw the matrix: `projection = rng.normal(size=(V, dim))`

Use seed `0` and this exact call, once, for the whole vocabulary. Any other seed or call order gives a different picture.

**3d. Embeddings.** `embeddings = raw @ projection`. The shape is `(V, dim)`: `(523, 16)`. Return a dict mapping each word to its row, so `result["the"]` is a 1-D array of 16 floats.

Why this works: two words that are followed by similar words get similar rows in `raw`, and so similar embeddings. It is a cheap stand-in for a trained embedding.

**Check:** `len(embeddings)` is 523, and `embeddings["the"].shape` is `(16,)`. `embeddings["touching"]` is 16 zeros (the word is never followed by anything).

### Step 4: build `embeddings`

Call `embeddings = build_cooccurrence_embeddings(sentences, dim=16)`.

### Step 5: `words` and `X`

Use the sentence `"the acting was superb and the story was touching"`. Store it in a variable (you will need it in the title).

- `words = tokenize(sentence)` gives `['the', 'acting', 'was', 'superb', 'and', 'the', 'story', 'was', 'touching']`: 9 words, with `the` and `was` each appearing twice.
- `X` is the 9 matching vectors stacked into a matrix, **in sentence order, repeats included**. Shape `(9, 16)`.

Tool: `np.stack(list_of_1d_arrays)` makes a 2-D array whose rows are those arrays. A list comprehension `[embeddings[w] for w in words]` builds the list.

**Check:** `X.shape == (9, 16)`, and `X[0]` equals `X[5]` (both are `the`).

### Step 6: attention weights

Call your function with `X` as all three inputs: `scaled_dot_product_attention(X, X, X)`. This is a simplification (a real transformer learns different Q, K and V matrices). The function returns two things. Keep the second one, the attention weights, shape `(9, 9)`.

Tip: `_, weights = scaled_dot_product_attention(X, X, X)` throws away the first return value.

**Check:** `weights.shape == (9, 9)` and `weights.sum(axis=1)` is nine values all equal to 1 (up to tiny rounding).

### Step 7: the heatmap

Draw it with these exact settings:

- `plt.figure(figsize=(7, 6))`
- `plt.imshow(weights, cmap="magma")`: draws the grid with the magma colour scale (dark = small, bright = large).
- `plt.colorbar(label="attention weight")`: the colour legend, with that label.
- `plt.xticks(range(9), words, rotation=45, ha="right")`: one label per column, tilted 45 degrees, right-aligned.
- `plt.yticks(range(9), words)`: one label per row.
- `plt.title(...)` with the exact text `Self-attention over: "<the sentence>"`. The sentence is wrapped in double quotes inside the title. Example: `Self-attention over: "the acting was superb and the story was touching"`. An f-string with single quotes outside works: `f'Self-attention over: "{sentence}"'`.
- `plt.tight_layout()` (stops labels being cut off), then `plt.show()`.

**Check:** you see a 9x9 coloured grid, word labels on both axes, a colourbar on the right.

## What a correct result looks like

- Nothing is printed. The deliverable is the heatmap.
- Everything is deterministic. The seed makes the "random" projection identical on every run, so your picture should look the same as the reference one.
- The grid is 9x9. Every **row** sums to 1.
- The two `the` rows (positions 0 and 5) are identical. So are the two `was` rows (2 and 7). The two `the` columns and two `was` columns are also identical, because the same vector always gives the same scores.
- With the reference solution, the row for `superb` is almost entirely one bright cell on itself (about 0.995). The row for `touching` is flat at about 0.111 in every cell (1/9), because its vector is all zeros, so every score is 0 and softmax spreads attention evenly. Use these to sanity-check your picture.

## How you'll be graded

1. `tokenize` and `bigram_counts` behave as specified (lowercase letter-runs only, bigrams within a sentence only).
2. Embeddings come from row-normalised bigram frequencies projected through the seeded `default_rng(0)` normal matrix, giving 16-dimensional vectors for every vocabulary word.
3. `X` is built in the sentence's word order, and attention is computed with the student's own `scaled_dot_product_attention` with `X` used as Q, K and V.
4. The heatmap has word labels on both axes, a colorbar, a title containing the sentence, and a 9x9 shape whose rows sum to 1.
