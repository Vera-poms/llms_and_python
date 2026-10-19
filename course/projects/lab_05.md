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
Define `MIN_WORD_COUNT = 3`, `MIN_POLARITY_RATIO = 0.7`, `TEST_FRACTION = 0.2` and `RANDOM_SEED = 0`.

A *random seed* is a number that fixes a random generator, so it gives the same "random" numbers every run. The same seed means the same split, so everybody gets the same answer.

### Step 2: Labels as -1 / +1 (`y`)
Code shape:
```python
y = np.array([... for l in labels])
```
Make `y = np.array(...)` of length 170. Label `1` becomes `+1` and label `0` becomes `-1`.

Why: `predict` gives back +1 or -1, so the true labels must use the same values.

Example: `[1, 0, 1]` becomes `array([ 1, -1,  1])`.

**Check:** `y.shape == (170,)`. 85 values are +1 and 85 are -1.

### Step 3: `tok(sentence: str) -> list[str]`
Code shape:
```python
def tok(sentence):
    return re.findall(..., ...)
```
Make the sentence lowercase. Give back the runs of letters a-z, in order, repeats included.

Example: `tok("The plot was great, not bad!")` gives `['the', 'plot', 'was', 'great', 'not', 'bad']`.

How: `re.findall(r"[a-z]+", text)` gives all the matches of "one or more lowercase letters in a row".

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
Pick the words that lean strongly positive or strongly negative.
1. **Count sentences per class.** For each sentence, take `set(tok(sentence))`. A set drops repeats, so a word counts once for each sentence, even if it shows up twice. Add 1 to that word in a positive dict if the sentence's `y` is `+1`. Otherwise add 1 in a negative dict. Read counts with `d.get(word, 0)`, because a word may be missing from one dict. `zip(sentences, y)` walks both lists together.
2. **Filter** every word seen in either dict. Let `pos` and `neg` be its two counts, and `total = pos + neg`. Skip it if `total < MIN_WORD_COUNT`. Skip it if `abs(pos - neg) / total < MIN_POLARITY_RATIO`.
3. **Sort** the kept words by `total`, biggest first, and give back only the words.

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
Build a grid of 0s and 1s with shape `(n_sentences, len(vocab))`. An entry is 1.0 if the vocabulary word is in the sentence, and 0.0 if not. It never counts how many times.

Example: `vocab = ['felt', 'flat', 'great']` and the sentence `"the characters felt flat and the dialogue was awkward"` give the row `[1.0, 1.0, 0.0]`.

How: start from `np.zeros((n, len(vocab)))`. Make a `{word: column}` dict once, so you can find each column fast.

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
Squash `X` to 2 columns, only for drawing. *PCA* finds the 2 directions along which the data spreads the most, and describes every row with 2 numbers. In this order:
1. `centered = X - X.mean(axis=0)`. This takes each column's average away.
2. `cov = np.cov(centered, rowvar=False)`. The *covariance matrix* says how each pair of columns moves together. `rowvar=False` means the columns are the variables. The shape is `(22, 22)`.
3. `eigenvalues, eigenvectors = np.linalg.eigh(cov)`. Each *eigenvector* is a direction. Its *eigenvalue* says how much the data spreads along it. The eigenvalues come back smallest first. Eigenvector `i` is the **column** `eigenvectors[:, i]`.
4. `order = np.argsort(eigenvalues)[::-1]` gives the positions from the largest eigenvalue to the smallest. Keep `eigenvectors[:, order[:2]]`. It has shape `(22, 2)`.
5. Give back `centered @ top2`. (`@` is matrix multiplication.) The shape is `(n, 2)`.

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
Split several arrays of the same length, using the **same** random choice of rows for all of them. `*arrays` means "any number of arrays". `test_fraction` and `seed` must be given by name. The call looks like `train_test_split(X, X2d, y, test_fraction=TEST_FRACTION, seed=RANDOM_SEED)`.

Do exactly this:
1. `rng = np.random.default_rng(seed)`. This makes a random generator.
2. `n = len(arrays[0])`.
3. Shuffle once only: `indices = rng.permutation(n)`. A *permutation* is the numbers `0..n-1` in a random order.
4. `n_test = int(n * test_fraction)`. The first `n_test` entries of `indices` are the test rows. The rest are the train rows.
5. Give back two lists, in this order: `[a[train_idx] for a in arrays]` and then `[a[test_idx] for a in arrays]`. (`array[index_array]` picks those rows, in that order.)

Why one shuffle for all arrays: if `X`, `X2d` and `y` were shuffled on their own, row 5 of `X` would no longer be the same sentence as row 5 of `y`.

Worked example: `n = 10`, `test_fraction = 0.2` and `seed = 0` give `int(10 * 0.2) = 2` test rows. `np.random.default_rng(0).permutation(10)` is `[4 6 2 7 3 5 9 0 8 1]`. So the test rows are `[4, 6]` and the train rows are `[2, 7, 3, 5, 9, 0, 8, 1]`.

**Check:** with `n = 170`, the test part has `int(170 * 0.2) = 34` rows and the train part has 136. All arrays in one part have the same length.

### Step 8: `accuracy(model, X, y) -> float`
Code shape:
```python
def accuracy(model, X, y):
    preds = np.array([... for row in X])
    return float(...)
```
This is the fraction of rows where `model.predict(row) == label`. Build `preds = np.array([model.predict(row) for row in X])`. Then give back `float((preds == y).mean())`. Comparing two arrays with `==` gives True and False for each row. `.mean()` counts True as 1, so you get the fraction right.

Example: 3 right out of 4 gives `0.75`. Give back a fraction between 0 and 1, not a percentage.

**Check:** on a fresh untrained `Perceptron(n_features=22)`, `accuracy(model, X, y)` on all 170 sentences gives exactly `0.5`. Every prediction is +1, and half the labels are +1.

### Step 9: Build the pipeline and print the vocabulary
Code shape:
```python
vocab = ...
X = ...
X2d = ...
print(f"Sentiment vocabulary ({...} words): {...}")
```
`vocab = build_vocab(sentences, y)`, `X = vectorize(sentences, vocab)`, `X2d = pca_2d(X)`. Then print `Sentiment vocabulary (22 words): [...]`. Use `{len(vocab)}` and `{vocab}` in an f-string. The 22 and the list come from your code. They are shown here so you know what to expect.

### Step 10: Split
Code shape:
```python
(X_train, X2d_train, y_train), (X_test, X2d_test, y_test) = train_test_split(
    ..., ..., ..., test_fraction=..., seed=...)
```
Write:
```
(X_train, X2d_train, y_train), (X_test, X2d_test, y_test) = train_test_split(
    X, X2d, y, test_fraction=TEST_FRACTION, seed=RANDOM_SEED)
```
This unpacks the returned (train list, test list) into six variables. The names must be exactly these.

**Check:** `len(X_train) == 136`, `len(X_test) == 34`, `X_train.shape == (136, 22)`, `X2d_test.shape == (34, 2)`.

### Step 11: Train
Code shape:
```python
model = Perceptron(n_features=...)
errors_per_epoch = train(model, ..., ..., epochs=..., learning_rate=...)
accuracy_per_epoch = [... for e in errors_per_epoch]
```
- `model = Perceptron(n_features=X.shape[1])`. Use the **full** features: one weight for each vocabulary word (22), not the 2D ones.
- `errors_per_epoch = train(model, X_train, y_train, epochs=60, learning_rate=1.0)`. Use only the training part. Never train on the test part, or tune anything with it. If you do, the test score is no longer honest.
- `accuracy_per_epoch = [1 - e / len(X_train) for e in errors_per_epoch]`. Example: 40 mistakes out of 136 gives `1 - 40/136 = 0.706`.

**Check:** `len(errors_per_epoch) == 60` and `len(accuracy_per_epoch) == 60`. With the seed above, the first value of `errors_per_epoch` is 53 (accuracy 0.610). It drops to 40 (accuracy 0.706) by epoch 3.

### Step 12: Test accuracy and printing
Code shape:
```python
test_acc = ...
print(f"Train examples: {...}, test examples: {...}")
print(f"Held-out test accuracy: {...:.2f}%")
```
`test_acc = accuracy(model, X_test, y_test)`. The *test set* is the examples the model never saw while learning. Print two lines:
```
Train examples: 136, test examples: 34
Held-out test accuracy: 73.53%
```
Use `{len(X_train)}`, `{len(X_test)}` and `{test_acc * 100:.2f}%` (`:.2f` means 2 digits after the point). Print the values your code worked out. The numbers above are what to expect.

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
`fig, axes = plt.subplots(1, 2, figsize=(13, 5))`. This makes one figure with 1 row and 2 panels side by side. `axes[0]` is the left one and `axes[1]` is the right one.

First, which test points are right? `preds_test = np.array([model.predict(row) for row in X_test])`. Use the **full-feature** `X_test`. Then `correct = preds_test == y_test`. This is True or False for each test row. (A True/False array like this is called a *mask*. `X[mask]` keeps only the rows where it is True, and `~mask` flips True and False.)

**Left panel `axes[0]`: learning curve.** A *learning curve* is a line chart of accuracy (up) against epoch number (across).
- The x values are epoch numbers starting at **1** (so `range(1, 61)`). The y values are `accuracy_per_epoch`.
- `axes[0].plot(..., marker="o")`. This draws a line with a circle at each point.
- x label `epoch`, y label `training accuracy`, title `Learning curve`.

**Right panel `axes[1]`: 2D scatter** drawn at the `X2d` positions. Make four `scatter` calls. `ax.scatter(xs, ys, color=..., alpha=..., marker=..., s=..., label=...)` draws dots (`s` is the dot size).
- Train positives `X2d_train[y_train == 1]`: `"seagreen"`, `alpha=0.4`, label `train +`.
- Train negatives `X2d_train[y_train == -1]`: `"crimson"`, `alpha=0.4`, label `train -`.
- Correct test points `X2d_test[correct]`: `"royalblue"`, `marker="o"`, label `test correct`.
- Wrong test points `X2d_test[~correct]`: `"black"`, `marker="x"`, `s=80`, label `test wrong`.

Tip: `*points.T` turns an `(n, 2)` array of points into two arguments, all the x values and all the y values. So `ax.scatter(*points.T)` is the same as `ax.scatter(points[:, 0], points[:, 1])`.

Important: "correct" comes from the model working on the 22-feature `X_test`. But the dots are drawn at the 2D `X2d_test` positions. The 2D picture is only for looking at.
- x label `PCA component 1 (visualization only)`, y label `PCA component 2 (visualization only)`.
- Title `Trained perceptron (test accuracy 74%)`, made with an f-string and `{test_acc:.0%}`. That turns 0.7353 into `74%` (a whole percent).
- `axes[1].legend(fontsize=8)`.

Set labels and titles with `ax.set_xlabel`, `ax.set_ylabel` and `ax.set_title`. Finish with `plt.tight_layout()` and `plt.show()`.

**Check:** the number of blue dots plus black crosses is 34. With the expected result, that is 25 blue circles and 9 black crosses. The learning curve starts at about 0.61 on epoch 1, rises to about 0.69 on epoch 2, and stays at about 0.706 from epoch 3 on. It stays flat and does not reach 1.0, because no straight line splits this data perfectly. The PCA chart can come out mirrored on some machines. That is harmless.
