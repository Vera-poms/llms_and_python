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
You get a sentence, like `"Hello, World! It's 2024."`. You give back `['hello', 'world', 'it', 's']`. Digits and punctuation vanish.

Write the code that does these steps:

1. Make the sentence lowercase with `sentence.lower()`.
2. Call `re.findall(r"[a-z]+", ...)` on it. This finds every run of letters a-z.
3. Return that list.

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
You get a list of sentences, like `["a b a b", "b c"]`. You give back a dict of dicts, `result[prev][nxt] = count`. Here that is `{'a': {'b': 2}, 'b': {'a': 1, 'c': 1}}`. Pairs of neighbor words never cross from one sentence into the next.

Write the code that does these steps:

1. Start with `counts = {}`.
2. Loop over `sentences`. For each one, set `words` to `tokenize(sentence)`.
3. Loop over `zip(words, words[1:])` as `prev, nxt`.
4. Set `inner` to `counts.setdefault(prev, {})`.
5. Set `inner[nxt]` to its old count plus 1. Use `inner.get(nxt, 0)` for the old count.
6. After the loops, return `counts`.

**Check:** on the real data, `bigram_counts(sentences)["acting"]` is `{'was': 1, 'felt': 1}`.

### Step 3: `build_cooccurrence_embeddings(sentences: list[str], dim: int = 16) -> dict[str, np.ndarray]`
Code shape:
```python
def build_cooccurrence_embeddings(sentences, dim=16):
    counts = bigram_counts(sentences)
    vocab = sorted(...)
    index = {word: i for i, word in enumerate(vocab)}
    V = len(vocab)
    raw = np.zeros((V, V))
    for prev, inner in counts.items():
        total = ...
        for nxt, count in inner.items():
            raw[index[prev], index[nxt]] = ...
    rng = np.random.default_rng(0)
    projection = ...
    embeddings = ...
    return {word: embeddings[index[word]] for word in vocab}
```
You get the list of sentences and `dim`. You give back a dict that maps each word to a list of 16 numbers.

Write the code that does these steps:

1. Set `counts` to `bigram_counts(sentences)`.
2. Set `vocab` to the sorted list of every different word in all sentences, with no repeats. Use `tokenize` to get the words. On the real data `len(vocab)` is 523.
3. Set `index` to a dict from each word to its position in `vocab`, and `V` to `len(vocab)`.
4. Set `raw` to `np.zeros((V, V))`.
5. Loop over `counts.items()` as `prev, inner`. Set `total` to the sum of `inner.values()`. This is one total per previous word, not one for the whole grid.
6. Loop over `inner.items()` as `nxt, count`. Set `raw[index[prev], index[nxt]]` to `count / total`. Example: `"the"` is followed by something 148 times, and by `"movie"` 4 times, so that cell is `4 / 148`. Words that are never followed by anything (like `"touching"`) keep a row of zeros. Do not divide by zero for them.
7. Set `rng = np.random.default_rng(0)`, then `projection = rng.normal(size=(V, dim))`. Use seed `0` and this exact call once, or your picture will differ.
8. Set `embeddings` to `raw @ projection`. Its shape is `(V, dim)`, which is `(523, 16)`.
9. Return a dict that maps each word in `vocab` to its row of `embeddings`.

**Check:** `len(embeddings)` is 523, and `embeddings["the"].shape` is `(16,)`. `embeddings["touching"]` is 16 zeros.

### Step 4: Build `embeddings`
Code shape:
```python
embeddings = ...
```
Write the code that does this step:

1. Set `embeddings` to `build_cooccurrence_embeddings(sentences, dim=16)`.

**Check:** `len(embeddings)` is 523.

### Step 5: `words` and `X`
Code shape:
```python
sentence = ...
words = ...
X = np.stack(...)
```
You use the sentence `"the acting was superb and the story was touching"`. Write the code that does these steps:

1. Set `sentence` to that text. You need it again in the title.
2. Set `words` to `tokenize(sentence)`. This gives 9 words: `['the', 'acting', 'was', 'superb', 'and', 'the', 'story', 'was', 'touching']`.
3. Set `X` to `np.stack([embeddings[w] for w in words])`. Keep sentence order, repeats included. The shape is `(9, 16)`.

**Check:** `X.shape == (9, 16)`, and `X[0]` equals `X[5]` (both are `the`).

### Step 6: Attention weights
Code shape:
```python
_, weights = scaled_dot_product_attention(..., ..., ...)
```
Write the code that does this step:

1. Call `scaled_dot_product_attention(X, X, X)` and keep only the second result: `_, weights = ...`. `weights` has shape `(9, 9)`. Row `i`, column `j` says how much word `i` looks at word `j`.

**Check:** `weights.shape == (9, 9)` and `weights.sum(axis=1)` is nine values, all equal to 1 (up to tiny rounding).

### Step 7: The heatmap
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
Write the code that does these steps:

1. Call `plt.figure(figsize=(7, 6))`.
2. Call `plt.imshow(weights, cmap="magma")`. Dark is small and bright is large.
3. Call `plt.colorbar(label="attention weight")`.
4. Call `plt.xticks(range(9), words, rotation=45, ha="right")`.
5. Call `plt.yticks(range(9), words)`.
6. Call `plt.title(...)` with the exact text `Self-attention over: "<the sentence>"`, with the sentence in double quotes. For example: `Self-attention over: "the acting was superb and the story was touching"`. Use `f'Self-attention over: "{sentence}"'`.
7. Call `plt.tight_layout()`, then `plt.show()`.

**Check:** you see a 9x9 colored grid, word labels on both sides, and a color key on the right.
