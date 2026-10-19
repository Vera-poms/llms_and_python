# Project: Self-Attention Heatmap over Real Word Embeddings

## Goal
The question: **when a transformer reads the sentence "the acting was superb and the story was touching", how much does each word "look at" every other word?** You will build a picture that answers this.

To do it, you need a list of numbers (an *embedding*) for each word. Real models learn these. You will make cheap ones from real review text. You count which words tend to come next after each word. Then you run those embeddings through your own attention function and draw the result.

You will:

1. Write `tokenize` to split a sentence into clean lowercase words.
2. Write `bigram_counts` to count which word follows which.
3. Write `build_cooccurrence_embeddings` to turn those counts into a list of 16 numbers for each word.
4. Pick one sentence, look up its word lists and stack them into a grid `X`.
5. Run your `scaled_dot_product_attention` on `X`.
6. Draw the 9x9 attention weights as a heatmap.

Takeaway: attention is just a table of "how much does word A look at word B". You can draw it as a grid of colors.

## What you start with
Already in the notebook:
- `re`, `np` (numpy, the number-grid library) and `plt` (matplotlib.pyplot, the chart library). Plots show inside the notebook.
- `sentences`: a list of 170 review sentences, already lowercase. For example, `sentences[2]` is `"the acting was superb and the story was touching"`.
- `labels`: a list of 170 0s and 1s. You do not need it in this project.

Your own exercise functions **must be defined and run first**. Run the exercise cell, or the solution cell if you are stuck:
- `softmax(x: np.ndarray) -> np.ndarray`: turns each row of raw scores into chances that add up to 1 (it works along the last direction).
- `scaled_dot_product_attention(Q, K, V) -> tuple[np.ndarray, np.ndarray]`: gives back `(output, attention_weights)`.

If you see `NameError: name 'softmax' is not defined`, you skipped that cell.

## Steps

### Step 1: `tokenize(sentence: str) -> list[str]`
Code shape:
```python
def tokenize(sentence):
    return re.findall(..., sentence.lower())
```
A *token* is one word after cleaning. Here a token is a run of letters a-z. Make the sentence lowercase, then keep only the runs of letters a-z. Digits and punctuation vanish and act as separators.

Example (input -> output):
- `"Hello, World! It's 2024."` -> `['hello', 'world', 'it', 's']`

`It's` splits into `it` and `s`, and `2024` disappears.

How: `re.findall(r"[a-z]+", text)` finds every run of letters and gives them back as a list. (`re` is Python's pattern-finding tool, called *regular expressions*.) `str.lower()` makes the text lowercase.

**Check:** `tokenize("the acting was superb")` gives `['the', 'acting', 'was', 'superb']`.

### Step 2: `bigram_counts(sentences: list[str]) -> dict[str, dict[str, int]]`
Code shape:
```python
def bigram_counts(sentences):
    counts = {}
    for sentence in sentences:
        words = ...
        for prev, nxt in zip(..., ...):
            inner = counts.setdefault(prev, {})
            inner[nxt] = ... + 1
    return counts
```
A *bigram* is two words that sit next to each other, in order. In "the acting was", the bigrams are `(the, acting)` and `(acting, was)`. Count how often each word is directly followed by each other word. You give back a dict of dicts: `result[prev][nxt] = count`.

Example with two tiny sentences `["a b a b", "b c"]`:
- Sentence 1 words: `a b a b`. Pairs: `(a,b)`, `(b,a)`, `(a,b)`.
- Sentence 2 words: `b c`. Pair: `(b,c)`.
- Result: `{'a': {'b': 2}, 'b': {'a': 1, 'c': 1}}`

The pair from the end of sentence 1 to the start of sentence 2 is **not** counted. Pairs never cross from one sentence into the next. So split each sentence into words on its own. Then pair up neighbors inside it only.

How: `zip(words, words[1:])` gives every pair of neighbors. `dict.setdefault(key, {})` or `dict.get(key, 0)` lets you add to a count that may not exist yet.

**Check:** on the real data, `bigram_counts(sentences)["acting"]` is `{'was': 1, 'felt': 1}`.

### Step 3: `build_cooccurrence_embeddings(sentences: list[str], dim: int = 16) -> dict[str, np.ndarray]`
Code shape for all four parts:
```python
def build_cooccurrence_embeddings(sentences, dim=16):
    counts = bigram_counts(sentences)
    # 3a
    vocab = sorted(...)
    index = {word: i for i, word in enumerate(vocab)}
    V = len(vocab)
    # 3b
    raw = np.zeros((V, V))
    for prev, inner in counts.items():
        total = ...
        for nxt, count in inner.items():
            raw[index[prev], index[nxt]] = ...
    # 3c
    rng = np.random.default_rng(0)
    projection = ...
    # 3d
    embeddings = ...
    return {word: embeddings[index[word]] for word in vocab}
```
This is the biggest step. It has four parts.

**3a. Vocabulary and index.** The *vocabulary* is the list of every different word in the whole dataset, with no repeats. Collect every word from every sentence, remove repeats, and sort them alphabetically. Its length is `V` (it is 523 on the real data). A word's *index* is its position in this sorted list. For example, `a` is index 0 because it sorts first.

**3b. The `raw` grid, shape `(V, V)`.** Start with all zeros. Row `i` is the word at index `i`. Cell `raw[i, j]` is the fraction of the time that word `i` is followed by word `j`:

`raw[i, j] = count(i followed by j) / total number of times i was followed by anything`

Example: in the real data, `"the"` is followed by something 148 times in total, and by `"movie"` 4 of those times. So `raw[index["the"], index["movie"]] = 4 / 148` (about 0.027). Each row you fill in adds up to 1. A word that is never followed by anything (it only ever ends sentences, like `"touching"`) keeps a row of all zeros. Do not divide by zero for those: only fill rows for words that appear as `prev` in your bigram counts.

Divide each row by its own total (one total per previous word). Do not use one total for the whole grid.

**3c. The projection grid, shape `(V, dim)`.** The raw rows are as long as the whole vocabulary (hundreds of numbers), but we want only 16. A *random projection* means multiplying by a grid of random numbers to squash long lists into short ones. Make it with exactly these two lines:
- make a random number generator: `rng = np.random.default_rng(0)`
- draw the grid: `projection = rng.normal(size=(V, dim))`

The number `0` is the *seed*, a starting number for the generator. The same seed gives the same "random" numbers every run, so your picture matches everyone else's. Use seed `0` and this exact call, once, for the whole vocabulary. Any other seed or call order gives a different picture.

**3d. Embeddings.** `embeddings = raw @ projection`. The shape is `(V, dim)`, which is `(523, 16)`. (`@` is matrix multiplication.) Give back a dict that maps each word to its row, so `result["the"]` is a list of 16 numbers.

Why this works: two words that are followed by similar words get similar rows in `raw`, so they get similar embeddings. It is a cheap stand-in for a trained embedding.

**Check:** `len(embeddings)` is 523, and `embeddings["the"].shape` is `(16,)`. `embeddings["touching"]` is 16 zeros (the word is never followed by anything).

### Step 4: build `embeddings`
Code shape:
```python
embeddings = ...
```
Run `embeddings = build_cooccurrence_embeddings(sentences, dim=16)`.

**Check:** `len(embeddings)` is 523.

### Step 5: `words` and `X`
Code shape:
```python
sentence = ...
words = ...
X = np.stack(...)
```
Use the sentence `"the acting was superb and the story was touching"`. Store it in a variable (you will need it in the title).
- `words = tokenize(sentence)` gives `['the', 'acting', 'was', 'superb', 'and', 'the', 'story', 'was', 'touching']`: 9 words, with `the` and `was` each showing up twice.
- `X` is the 9 matching lists of numbers stacked into a grid, **in sentence order, repeats included**. Shape `(9, 16)`.

How: `np.stack(list_of_1d_arrays)` makes a 2-D grid whose rows are those lists. The list comprehension `[embeddings[w] for w in words]` builds the list.

**Check:** `X.shape == (9, 16)`, and `X[0]` equals `X[5]` (both are `the`).

### Step 6: attention weights
Code shape:
```python
_, weights = scaled_dot_product_attention(..., ..., ...)
```
Call your function with `X` as all three inputs: `scaled_dot_product_attention(X, X, X)`. A real transformer learns different Q, K and V grids, so this is a simpler version. The function gives back two things. Keep the second one, the attention weights, shape `(9, 9)`. In this grid, row `i`, column `j` says how much word `i` looks at word `j`. Each row adds up to 1.

Tip: `_, weights = scaled_dot_product_attention(X, X, X)` throws away the first thing it gives back.

**Check:** `weights.shape == (9, 9)` and `weights.sum(axis=1)` is nine values, all equal to 1 (up to tiny rounding).

### Step 7: the heatmap
Code shape:
```python
plt.figure(...)
plt.imshow(...)
plt.colorbar(...)
plt.xticks(...)
plt.yticks(...)
plt.title(...)
plt.tight_layout()
plt.show()
```
A *heatmap* is a grid drawn as colored squares. `imshow` draws one. Use these exact settings:
- `plt.figure(figsize=(7, 6))`
- `plt.imshow(weights, cmap="magma")`: draws the grid with the magma color scale (dark = small, bright = large).
- `plt.colorbar(label="attention weight")`: the color key, with that label.
- `plt.xticks(range(9), words, rotation=45, ha="right")`: one label per column, tilted 45 degrees, lined up on the right.
- `plt.yticks(range(9), words)`: one label per row.
- `plt.title(...)` with the exact text `Self-attention over: "<the sentence>"`. The sentence is wrapped in double quotes inside the title. For example: `Self-attention over: "the acting was superb and the story was touching"`. An f-string with single quotes outside works: `f'Self-attention over: "{sentence}"'`.
- `plt.tight_layout()` (stops labels being cut off), then `plt.show()`.

**Check:** you see a 9x9 colored grid, word labels on both sides, and a color key on the right.
