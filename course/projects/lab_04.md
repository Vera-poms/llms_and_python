# Project: An Untrained Perceptron on Real Review Sentiment

## Goal
The question: **what does a perceptron know before it has learned anything?** To find out, you give it real review sentences and measure how often it guesses the mood (positive or negative) correctly. A perceptron cannot read text. So first you turn each sentence into a list of numbers.

You will:
1. Define two threshold constants and turn the 0/1 labels into -1/+1 labels (`y`).
2. Write `tok` to split a sentence into lowercase words.
3. Write `build_vocab` to pick a short list of words that clearly lean positive or negative.
4. Write `vectorize` to turn each sentence into a row of 0/1 numbers.
5. Write `pca_2d` to squash that table down to 2 columns, so it can be drawn on a flat chart.
6. Write `plot_boundary` to draw the two classes and (if there is one) the perceptron's decision line.
7. Run the pipeline, print the vocabulary size and the untrained accuracy, and draw the plot.

Takeaway: with all weights at zero, the perceptron gives the same answer for everything. On balanced data it scores exactly 50%, and the result is the same every run. Lab 5 trains it and beats that.

## What you start with
Already in the notebook (run the loader cell first):
- `sentences`: a list of 170 review sentences. For example `sentences[1]` is `"i loved every minute of this film"`.
- `labels`: a list of 0s and 1s, in the same order as `sentences`. `labels[1]` is `1` (positive). There are 85 of each, so the data is *balanced*.
- `re`, `plt` and `np` are already imported. `plt` is the chart library (matplotlib). `np` is numpy, the number-grid library.

You must first run **your own** `Perceptron` class from this lab's exercise cell (or the solution cell). If you skip this, you get a `NameError`. It gives you:
- `Perceptron(n_features: int)`: makes a model with `weights` (a numpy array of zeros, one for each feature) and `bias` (0.0). A *feature* is one input number for the model.
- `net_input(x) -> float`: the score `w . x + b`.
- `activation(z) -> int`: +1 if `z >= 0`, else -1.
- `predict(x) -> int`: gets the score, then turns it into +1 or -1.

## Steps

### Step 1: Constants
Code shape (replace each `...`):
```python
MIN_WORD_COUNT = ...
MIN_POLARITY_RATIO = ...
```
Write the code that does this step:

1. Define `MIN_WORD_COUNT = 3` and `MIN_POLARITY_RATIO = 0.7`.

### Step 2: Labels as -1 / +1 (`y`)
Code shape:
```python
y = np.array([... for l in labels])
```
You get `labels`, a list of 0s and 1s, like `[1, 0, 1]`. Write the code that does these steps:

1. Make a list with `1 if l == 1 else -1` for each `l` in `labels`.
2. Set `y` to `np.array(...)` of that list. For the example you get `array([ 1, -1,  1])`.

**Check:** `y.shape == (170,)`, `(y == 1).sum() == 85`, `(y == -1).sum() == 85`.

### Step 3: `tok(sentence: str) -> list[str]`
Code shape:
```python
def tok(sentence):
    return re.findall(..., ...)
```
You get one sentence. You give back its words as a list, repeats included. Write the code that does these steps:

1. Make the sentence lowercase.
2. Call `re.findall` with the pattern `[a-z]+` on it.
3. Return the list. Digits, spaces and punctuation are dropped.

Example: `tok("The movie was great, the plot too!")` gives `['the', 'movie', 'was', 'great', 'the', 'plot', 'too']`.

**Check:** `tok("i loved every minute of this film")` has 7 items and starts with `'i', 'loved'`.

### Step 4: `build_vocab(sentences: list[str], y: np.ndarray) -> list[str]`
Code shape for all three parts:
```python
def build_vocab(sentences, y):
    # 4a
    pos_counts, neg_counts = {}, {}
    for sentence, label in zip(sentences, y):
        for word in set(tok(sentence)):
            ...
    # 4b and 4c
    pairs = []
    for word in set(pos_counts) | set(neg_counts):
        pos = ...
        neg = ...
        total = pos + neg
        if ...:
            continue
        if ...:
            continue
        pairs.append((word, total))
    pairs = sorted(pairs, key=..., reverse=True)
    return [...]
```
You give back the words that lean strongly toward positive or negative sentences, most frequent first. Do it in three parts.

**4a. Count sentences per class.** Write the code that does these steps:

1. Loop over `zip(sentences, y)`.
2. For each word in `set(tok(sentence))`, add 1 to `pos_counts[word]` if `label` is `+1`. Otherwise add 1 to `neg_counts[word]`. The `set` makes a word count once per sentence.
3. Use `d.get(word, 0)` to start a new word from 0.

**4b. Filter.** For each word in `set(pos_counts) | set(neg_counts)`, write the code that does these steps:

1. Set `pos` to `pos_counts.get(word, 0)`, `neg` to `neg_counts.get(word, 0)`, and `total = pos + neg`.
2. If `total < MIN_WORD_COUNT`, `continue`.
3. If `abs(pos - neg) / total < MIN_POLARITY_RATIO`, `continue`.
4. Otherwise add `(word, total)` to `pairs`.

Worked examples from the real data:
- `the`: `pos = 55`, `neg = 56`, `total = 111`. Ratio `abs(55 - 56) / 111 = 0.009`, below 0.7, so skipped.
- `great`: `pos = 3`, `neg = 0`, `total = 3`. The total is not below 3, and the ratio is `3 / 3 = 1.0`, so **kept**.
- `felt`: `pos = 1`, `neg = 6`, `total = 7`. The ratio is `5 / 7 = 0.714`, at least 0.7, so **kept**.
- `bad`: `pos = 0`, `neg = 1`, `total = 1`. The total is below 3, so skipped even though the ratio is 1.0.

**4c. Sort and give back.** Write the code that does these steps:

1. Sort `pairs` with `sorted(pairs, key=lambda p: p[1], reverse=True)`.
2. Return a list of only the words.

Words with the same `total` may come out in a different order each run. That is fine.

**Check:** `len(vocab) == 22`. The first word is `felt` (total 7), the second is `fell` (total 5), and all 22 words are strings.

### Step 5: `vectorize(sentences: list[str], vocab: list[str]) -> np.ndarray`
Code shape:
```python
def vectorize(sentences, vocab):
    column = {word: j for j, word in enumerate(vocab)}
    X = np.zeros((..., ...))
    for i, sentence in enumerate(sentences):
        for word in set(tok(sentence)):
            if ...:
                X[i, ...] = 1.0
    return X
```
You give back `X`, with one row per sentence and one column per vocabulary word. Entry `[i, j]` is `1.0` if `vocab[j]` is in `sentences[i]`, and `0.0` if not. With `vocab = ['felt', 'flat', 'great']`, the sentence `"the characters felt flat and the dialogue was awkward"` becomes the row `[1.0, 1.0, 0.0]`. Write the code that does these steps:

1. Make `column`, a dict of each word to its column number, from `enumerate(vocab)`. Do it once, before the loop.
2. Set `X` to `np.zeros((len(sentences), len(vocab)))`.
3. For each sentence `i`, loop over `set(tok(sentence))`.
4. If the word is in `column`, set `X[i, column[word]] = 1.0`.
5. Return `X`.

**Check:** `X.shape == (170, 22)`, `X.sum() == 78.0` (78 vocabulary hits in total), and only 0.0 and 1.0 appear. Many rows are all zeros: 100 of the 170 sentences have none of the 22 words. That is expected.

### Step 6: `pca_2d(X: np.ndarray) -> np.ndarray`
Code shape:
```python
def pca_2d(X):
    centered = ...
    cov = ...
    eigenvalues, eigenvectors = ...
    order = ...
    top2 = ...
    return ...
```
You get `X`, the grid from step 5. You give back the same rows described by just 2 numbers each, so they can be drawn. Write the code that does these steps, in this order:

1. Set `centered` to `X - X.mean(axis=0)`.
2. Set `cov` to `np.cov(centered, rowvar=False)`. It has shape `(22, 22)`.
3. Set `eigenvalues, eigenvectors` to `np.linalg.eigh(cov)`. The eigenvalues come back smallest first, and eigenvector `i` is the **column** `eigenvectors[:, i]`.
4. Set `order` to `np.argsort(eigenvalues)[::-1]`. This lists the positions from the largest eigenvalue to the smallest.
5. Set `top2` to `eigenvectors[:, order[:2]]`. It has shape `(22, 2)`.
6. Return `centered @ top2`. The shapes are `(170, 22) @ (22, 2) -> (170, 2)`.

**Check:** `X2d.shape == (170, 2)`, and `X2d.mean(axis=0)` is about `[0, 0]`. Rows with no vocabulary words are all the same, so they land on the exact same point and sit on top of each other in the chart.

### Step 7: `plot_boundary(X2d, y, model, title) -> None`
Code shape:
```python
def plot_boundary(X2d, y, model, title):
    plt.figure(...)
    mask = ...
    plt.scatter(...)    # positive points
    plt.scatter(...)    # negative points
    if ...:
        xs = np.linspace(...)
        ys = ...
        plt.plot(...)
    # then: xlabel, ylabel, title, legend, tight_layout, show
```
You draw the points and the line where the perceptron's score `w0*x + w1*y + b` is 0. Write the code that does these steps:

1. Call `plt.figure(figsize=(7, 6))`.
2. Set `mask` to `(y == 1)`.
3. Draw the positive points with `plt.scatter(X2d[mask, 0], X2d[mask, 1], color="seagreen", label="positive", alpha=0.7)`.
4. Draw the negative points with `X2d[~mask, 0]` and `X2d[~mask, 1]`, `color="crimson"`, `label="negative"`, `alpha=0.7`.
5. Only if `abs(model.weights[1]) > 1e-9`, draw the line. If not, draw no line.
6. Inside the `if`, set `xs` to `np.linspace(min_x - 1, max_x + 1, 100)`, where `min_x` and `max_x` are the smallest and biggest values of `X2d[:, 0]`.
7. Set `ys` to `-(model.weights[0] * xs + model.bias) / model.weights[1]`. Example: `w0 = 1, w1 = 2, b = 4` gives `y = -(x + 4) / 2`, so `y = -2` at `x = 0`.
8. Call `plt.plot(xs, ys, color="black", linestyle="--", label="decision boundary")`.
9. Call `plt.xlabel("PCA component 1")`, `plt.ylabel("PCA component 2")` and `plt.title(title)`.
10. Call `plt.legend()`, `plt.tight_layout()` and `plt.show()`.

**Check:** with an untrained model, the legend lists only `positive` and `negative`. With a model whose weights you set by hand to `[1.0, 2.0]` and bias `4.0`, a dashed line appears.

### Step 8: Run the pipeline and check the accuracy
Code shape:
```python
vocab = ...
X = ...
X2d = ...
model = ...
preds = np.array([... for row in X2d])
accuracy = ...
```
Write the code that does these steps, in this order:

1. Set `vocab` to `build_vocab(sentences, y)`.
2. Set `X` to `vectorize(sentences, vocab)`.
3. Set `X2d` to `pca_2d(X)`.
4. Set `model` to `Perceptron(n_features=2)`. It has 2 weights (one per PCA column), not 22.
5. Set `preds` to `np.array([model.predict(row) for row in X2d])`.
6. Set `accuracy` to `(preds == y).mean()`. This is the fraction of guesses that match, like 0.75 for 3 right out of 4.

**Check:** `len(preds) == 170` and every prediction is `+1`. With `weights = [0, 0]` and `bias = 0.0`, every score is exactly 0, and `activation(0)` is +1. So 85 of the 170 are right.

### Step 9: Print three lines
Code shape:
```python
print(f"Vocabulary size: {...}")
print(f"Untrained perceptron accuracy on real sentiment data: {...:.2f}%")
print("(Weights are all zero, so it predicts the same class for everything - see lab 5.)")
```
Print exactly:
```
Vocabulary size: 22
Untrained perceptron accuracy on real sentiment data: 50.00%
(Weights are all zero, so it predicts the same class for everything - see lab 5.)
```
Write the code that does these steps:

1. Print the first line with `{len(vocab)}`.
2. Print the second line with `{accuracy * 100:.2f}%`.
3. Print the third line as plain text.

### Step 10: Draw the plot
Code shape:
```python
plot_boundary(..., ..., ..., "...")
```
Write the code that does this step:

1. Call `plot_boundary(X2d, y, model, "Untrained perceptron on real review sentiment")`.

**Check:** one scatter chart with green and red points mixed together. Many dots sit on the same spot (the 100 sentences with all zeros). There is no dashed line, and the legend has two entries. The axis ranges are small (about -1.2 to 1.2). The PCA axes may flip sign between runs or machines, so the chart may look mirrored. That is harmless.
