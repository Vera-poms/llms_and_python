# Project: Training a Perceptron on Real Review Sentiment

## Goal
The question: **can a perceptron learn to tell positive reviews from negative ones? And how do we know it learned something real, and did not just remember the answers?** The honest way to find out is to hide some sentences while it learns, and test on them afterwards.

You will:
1. Rebuild lab 4's text-to-numbers pipeline (`tok`, `build_vocab`, `vectorize`, `pca_2d`).
2. Write `train_test_split` to set aside 20% of the data at random as a test set.
3. Write `accuracy` to measure how often the model is right.
4. Train a `Perceptron` with your own `train` function for 60 epochs, and record how accuracy changes.
5. Print the accuracy on the hidden test sentences.
6. Draw a two-panel figure: a learning curve, and a 2D picture of the data with the test results marked.

Takeaway: a straight-line model on messy human text will not be perfect. But it should clearly beat the 50% of the untrained perceptron from lab 4.

## What you start with
Already in the notebook (run the loader cell first):
- `sentences`: a list of 170 review sentences, like `"i loved every minute of this film"`.
- `labels`: a list of 0s and 1s in the same order, like `1` for that sentence.
- `re`, `plt` (the chart library, matplotlib), `np` (numpy, the number-grid library), and the `Perceptron` class from the setup cell. It has `weights` (zeros), `bias` (0.0), `net_input(x)` (the score `w . x + b`), `activation(z)` (+1 if `z >= 0` else -1) and `predict(x)` (score, then activation).

You must first run **your own** exercise function for this lab (the exercise cell, or the solution cell). Otherwise you get a `NameError`.
- `train(model, X, y, epochs: int = 20, learning_rate: float = 0.1) -> list[int]`: goes over `X` for `epochs` rounds and changes `model.weights` and `model.bias` in place. It **gives back a list with the number of mistakes in each epoch** (one integer for each epoch).

An *epoch* is one full pass over all the training examples. The *learning rate* says how big each correction is. Here you use `learning_rate = 1.0`.

The perceptron learning rule in one line: for each example where `predict` is wrong, add `learning_rate * target * x` to the weights, and add `learning_rate * target` to the bias. For example, with `learning_rate = 1.0`, `target = -1` and `x = [1, 0, 1]`, the weights change by `[-1, 0, -1]` and the bias by `-1`. Examples it gets right change nothing.

The helpers `build_vocab`, `vectorize` and `pca_2d` are **not** given in this notebook. You write them again here, the same as in lab 4. Quick recap: the vocabulary is a list of words that lean positive or negative. `X` is a table with one row for each sentence and one 0/1 column for each vocabulary word. PCA squashes `X` to 2 columns, only so it can be drawn.

## Steps

### Step 1: Constants
Code shape (replace each `...`):
```python
MIN_WORD_COUNT = ...
MIN_POLARITY_RATIO = ...
TEST_FRACTION = ...
RANDOM_SEED = ...
```
Write the code that does this step:

1. Define `MIN_WORD_COUNT = 3`, `MIN_POLARITY_RATIO = 0.7`, `TEST_FRACTION = 0.2` and `RANDOM_SEED = 0`.

### Step 2: Labels as -1 / +1 (`y`)
Code shape:
```python
y = np.array([... for l in labels])
```
You get `labels`, a list of 0s and 1s, like `[1, 0, 1]`. Write the code that does these steps:

1. Make a list with `1 if l == 1 else -1` for each `l` in `labels`.
2. Set `y` to `np.array(...)` of that list. For the example you get `array([ 1, -1,  1])`.

**Check:** `y.shape == (170,)`. 85 values are +1 and 85 are -1.

### Step 3: `tok(sentence: str) -> list[str]`
Code shape:
```python
def tok(sentence):
    return re.findall(..., ...)
```
Write the code that does these steps:

1. Make the sentence lowercase.
2. Return `re.findall(r"[a-z]+", ...)` on it. Repeats stay in.

Example: `tok("The plot was great, not bad!")` gives `['the', 'plot', 'was', 'great', 'not', 'bad']`.

**Check:** `tok("i loved every minute of this film")` has 7 items.

### Step 4: `build_vocab(sentences: list[str], y: np.ndarray) -> list[str]`
Code shape:
```python
def build_vocab(sentences, y):
    pos_counts, neg_counts = {}, {}
    for sentence, label in zip(sentences, y):
        for word in set(tok(sentence)):
            ...
    pairs = []
    for word in set(pos_counts) | set(neg_counts):
        pos = ...
        neg = ...
        total = pos + neg
        if ... or ...:
            continue
        pairs.append((word, total))
    pairs = sorted(pairs, key=..., reverse=True)
    return [...]
```
You give back the words that lean strongly positive or strongly negative, most frequent first. Write the code that does these steps:

1. Loop over `zip(sentences, y)`. For each word in `set(tok(sentence))`, add 1 to `pos_counts[word]` if `label` is `+1`. Otherwise add 1 to `neg_counts[word]`. The `set` makes a word count once per sentence.
2. Use `d.get(word, 0)` to start a new word from 0.
3. For each word in `set(pos_counts) | set(neg_counts)`, set `pos` and `neg` with `.get(word, 0)`, and `total = pos + neg`.
4. Skip the word if `total < MIN_WORD_COUNT`, or if `abs(pos - neg) / total < MIN_POLARITY_RATIO`.
5. Otherwise add `(word, total)` to `pairs`.
6. Sort `pairs` by `total`, biggest first, and return only the words.

Worked examples from the real data:
- `the` has `pos = 55`, `neg = 56`, ratio `1/111 = 0.009`, so it is skipped.
- `great` has `pos = 3`, `neg = 0`, total 3, ratio 1.0, so it is kept.
- `felt` has `pos = 1`, `neg = 6`, ratio `5/7 = 0.714`, so it is kept.
- `bad` has total 1, so it is skipped.

**Check:** `len(vocab) == 22`. The first word is `felt` and the second is `fell`. Words with the same total can come out in a different order on different runs. That is fine.

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
You give back a grid with one row per sentence and one column per vocabulary word. Example: `vocab = ['felt', 'flat', 'great']` and the sentence `"the characters felt flat and the dialogue was awkward"` give the row `[1.0, 1.0, 0.0]`. Write the code that does these steps:

1. Make `column`, a dict of each word to its column number, from `enumerate(vocab)`. Do it once, before the loop.
2. Set `X` to `np.zeros((len(sentences), len(vocab)))`.
3. For each sentence `i`, loop over `set(tok(sentence))`.
4. If the word is in `column`, set `X[i, column[word]] = 1.0`. It never counts how many times.
5. Return `X`.

**Check:** on all 170 sentences, `X.shape == (170, 22)` and `X.sum() == 78.0`. About 100 rows are all zeros (no vocabulary word). That is expected.

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
You give back the rows of `X` described by just 2 numbers each, only for drawing. Write the code that does these steps, in this order:

1. Set `centered` to `X - X.mean(axis=0)`.
2. Set `cov` to `np.cov(centered, rowvar=False)`. The shape is `(22, 22)`.
3. Set `eigenvalues, eigenvectors` to `np.linalg.eigh(cov)`. The eigenvalues come back smallest first, and eigenvector `i` is the **column** `eigenvectors[:, i]`.
4. Set `order` to `np.argsort(eigenvalues)[::-1]`. This lists the positions from the largest eigenvalue to the smallest.
5. Set `top2` to `eigenvectors[:, order[:2]]`. It has shape `(22, 2)`.
6. Return `centered @ top2`. The shape is `(n, 2)`.

**Check:** `X2d.shape == (170, 2)`.

### Step 7: `train_test_split(*arrays, test_fraction: float, seed: int)`
Code shape:
```python
def train_test_split(*arrays, test_fraction, seed):
    rng = ...
    n = ...
    indices = ...
    n_test = ...
    test_idx = ...
    train_idx = ...
    return [... for a in arrays], [... for a in arrays]
```
You get any number of arrays of the same length. `test_fraction` and `seed` are given by name, like `train_test_split(X, X2d, y, test_fraction=TEST_FRACTION, seed=RANDOM_SEED)`. You give back two lists: the train part of every array, then the test part. All arrays use the **same** shuffled rows, so row 5 of `X` stays the same sentence as row 5 of `y`. Write the code that does these steps:

1. Set `rng` to `np.random.default_rng(seed)`.
2. Set `n` to `len(arrays[0])`.
3. Set `indices` to `rng.permutation(n)`. Shuffle once only.
4. Set `n_test` to `int(n * test_fraction)`.
5. Set `test_idx` to `indices[:n_test]`, and `train_idx` to `indices[n_test:]`.
6. Return `[a[train_idx] for a in arrays]` and then `[a[test_idx] for a in arrays]`.

Worked example: `n = 10`, `test_fraction = 0.2` and `seed = 0` give `int(10 * 0.2) = 2` test rows. `np.random.default_rng(0).permutation(10)` is `[4 6 2 7 3 5 9 0 8 1]`. So the test rows are `[4, 6]` and the train rows are `[2, 7, 3, 5, 9, 0, 8, 1]`.

**Check:** with `n = 170`, the test part has `int(170 * 0.2) = 34` rows and the train part has 136. All arrays in one part have the same length.

### Step 8: `accuracy(model, X, y) -> float`
Code shape:
```python
def accuracy(model, X, y):
    preds = np.array([... for row in X])
    return float(...)
```
You give back the fraction of rows where `model.predict(row)` matches the label, as a number from 0 to 1 (not a percentage). Example: 3 right out of 4 gives `0.75`. Write the code that does these steps:

1. Set `preds` to `np.array([model.predict(row) for row in X])`.
2. Return `float((preds == y).mean())`.

**Check:** on a fresh untrained `Perceptron(n_features=22)`, `accuracy(model, X, y)` on all 170 sentences gives exactly `0.5`. Every prediction is +1, and half the labels are +1.

### Step 9: Build the pipeline and print the vocabulary
Code shape:
```python
vocab = ...
X = ...
X2d = ...
print(f"Sentiment vocabulary ({...} words): {...}")
```
Write the code that does these steps:

1. Set `vocab` to `build_vocab(sentences, y)`.
2. Set `X` to `vectorize(sentences, vocab)`.
3. Set `X2d` to `pca_2d(X)`.
4. Print `Sentiment vocabulary (22 words): [...]` with an f-string, using `{len(vocab)}` and `{vocab}`. The 22 and the list come from your code.

### Step 10: Split
Code shape:
```python
(X_train, X2d_train, y_train), (X_test, X2d_test, y_test) = train_test_split(
    ..., ..., ..., test_fraction=..., seed=...)
```
Write the code that does this step:

1. Call `train_test_split(X, X2d, y, test_fraction=TEST_FRACTION, seed=RANDOM_SEED)` and unpack the result into exactly these names: `(X_train, X2d_train, y_train), (X_test, X2d_test, y_test)`.

**Check:** `len(X_train) == 136`, `len(X_test) == 34`, `X_train.shape == (136, 22)`, `X2d_test.shape == (34, 2)`.

### Step 11: Train
Code shape:
```python
model = Perceptron(n_features=...)
errors_per_epoch = train(model, ..., ..., epochs=..., learning_rate=...)
accuracy_per_epoch = [... for e in errors_per_epoch]
```
Write the code that does these steps:

1. Set `model` to `Perceptron(n_features=X.shape[1])`. This uses the full features (22), not the 2D ones.
2. Set `errors_per_epoch` to `train(model, X_train, y_train, epochs=60, learning_rate=1.0)`. Use only the training part, never the test part.
3. Set `accuracy_per_epoch` to `[1 - e / len(X_train) for e in errors_per_epoch]`. Example: 40 mistakes out of 136 gives `1 - 40/136 = 0.706`.

**Check:** `len(errors_per_epoch) == 60` and `len(accuracy_per_epoch) == 60`. With the seed above, the first value of `errors_per_epoch` is 53 (accuracy 0.610). It drops to 40 (accuracy 0.706) by epoch 3.

### Step 12: Test accuracy and printing
Code shape:
```python
test_acc = ...
print(f"Train examples: {...}, test examples: {...}")
print(f"Held-out test accuracy: {...:.2f}%")
```
Print exactly these two lines (the numbers come from your code):
```
Train examples: 136, test examples: 34
Held-out test accuracy: 73.53%
```
Write the code that does these steps:

1. Set `test_acc` to `accuracy(model, X_test, y_test)`.
2. Print the first line with `{len(X_train)}` and `{len(X_test)}`.
3. Print the second line with `{test_acc * 100:.2f}%`.

**Check:** with 34 test examples, one more right answer changes the accuracy by 1/34, about 2.94 points. So `test_acc * 34` should be a whole number (here 25).

### Step 13: The two-panel figure
Code shape:
```python
fig, axes = plt.subplots(...)
preds_test = ...
correct = ...
axes[0].plot(...)
# left panel labels
axes[1].scatter(...)    # train positives
axes[1].scatter(...)    # train negatives
axes[1].scatter(...)    # test correct
axes[1].scatter(...)    # test wrong
# right panel labels, legend, then tight_layout and show
```
Write the code that does these steps:

1. Set `fig, axes` to `plt.subplots(1, 2, figsize=(13, 5))`. `axes[0]` is the left panel and `axes[1]` is the right one.
2. Set `preds_test` to `np.array([model.predict(row) for row in X_test])`. Use the full-feature `X_test`.
3. Set `correct` to `preds_test == y_test`. This is True or False for each test row.
4. Left panel: call `axes[0].plot(range(1, 61), accuracy_per_epoch, marker="o")`.
5. Left panel: set x label `epoch`, y label `training accuracy`, title `Learning curve`, with `set_xlabel`, `set_ylabel` and `set_title`.
6. Right panel: scatter `X2d_train[y_train == 1]` with `color="seagreen"`, `alpha=0.4`, `label="train +"`.
7. Right panel: scatter `X2d_train[y_train == -1]` with `color="crimson"`, `alpha=0.4`, `label="train -"`.
8. Right panel: scatter `X2d_test[correct]` with `color="royalblue"`, `marker="o"`, `label="test correct"`.
9. Right panel: scatter `X2d_test[~correct]` with `color="black"`, `marker="x"`, `s=80`, `label="test wrong"`.
10. Right panel: set x label `PCA component 1 (visualization only)`, y label `PCA component 2 (visualization only)`, and title `f"Trained perceptron (test accuracy {test_acc:.0%})"`, which gives `Trained perceptron (test accuracy 74%)`.
11. Call `axes[1].legend(fontsize=8)`, then `plt.tight_layout()`, then `plt.show()`.

To scatter an `(n, 2)` array of points, use `ax.scatter(*points.T)`. It is the same as `ax.scatter(points[:, 0], points[:, 1])`. "Correct" comes from the 22-feature `X_test`, but the dots are drawn at the 2D `X2d_test` positions. The 2D picture is only for looking at.

**Check:** the number of blue dots plus black crosses is 34. With the expected result, that is 25 blue circles and 9 black crosses. The learning curve starts at about 0.61 on epoch 1, rises to about 0.69 on epoch 2, and stays at about 0.706 from epoch 3 on. It stays flat and does not reach 1.0, because no straight line splits this data perfectly. The PCA chart can come out mirrored on some machines. That is harmless.
