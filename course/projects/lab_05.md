# Project: Training a Perceptron on Real Review Sentiment

## Goal
The question: **can a perceptron learn to tell positive reviews from negative ones, and how do we know it learned something real rather than just memorizing?** The honest way to find out is to hide some sentences during training and test on them afterwards.

You will:
1. Rebuild lab 4's text-to-numbers pipeline (`tok`, `build_vocab`, `vectorize`, `pca_2d`).
2. Write `train_test_split` to randomly set aside 20% of the data as a test set.
3. Write `accuracy` to measure how often the model is right.
4. Train a `Perceptron` with your own `train` function for 60 epochs, recording how accuracy changes.
5. Print the held-out test accuracy.
6. Draw a two-panel figure: a learning curve and a 2D picture of the data with the test results marked.

Takeaway: a linear model on noisy human text will not be perfect, but it should clearly beat the 50% of the untrained perceptron from lab 4.

## Words you will see
- **Training set**: the examples the model is allowed to learn from. **Test set (held-out)**: examples the model never sees while learning, used only for the final score. Why: a model can score well on data it has seen without being any good on new data, so the test score is the honest one.
- **Epoch**: one full pass over the whole training set.
- **Learning rate**: how big each correction is. Here `learning_rate = 1.0`.
- **Learning curve**: a line chart of accuracy (y) against epoch number (x).
- **Random seed**: a number that fixes a random generator so it produces the same "random" numbers every run. Same seed means the same split, so everybody gets the same answer.
- **Permutation**: the numbers `0..n-1` shuffled into a random order.
- **Vocabulary, bag-of-words, binary presence, PCA, document count**: same meaning as in lab 4. Quick recap: the vocabulary is a list of words that lean positive or negative; `X` is a table with one row per sentence and one 0/1 column per vocabulary word; PCA squashes `X` to 2 columns just so it can be drawn.
- **Boolean mask**: an array of True/False used to pick rows. If `y = [1, -1, 1]` then `y == 1` is `[True, False, True]` and `X[y == 1]` keeps rows 0 and 2. `~mask` flips True and False.
- **numpy calls you will use** (`np` is numpy):
  - `np.random.default_rng(seed)` creates a random generator.
  - `rng.permutation(n)` returns a shuffled array of `0..n-1`.
  - `array[index_array]` picks those rows in that order (fancy indexing).
  - `np.array(list)`, `array.mean()`, `np.cov`, `np.linalg.eigh`, `np.argsort`, `@`: as in lab 4.
- **matplotlib calls you will use** (`plt` is matplotlib.pyplot):
  - `fig, axes = plt.subplots(1, 2, figsize=(13, 5))` makes one figure with 1 row and 2 side-by-side panels; `axes[0]` is the left one, `axes[1]` the right one.
  - `ax.plot(xs, ys, marker="o")` draws a line with a circle at each point.
  - `ax.scatter(xs, ys, color=..., alpha=..., marker=..., s=..., label=...)` draws dots (`s` is dot size).
  - `ax.set_xlabel`, `ax.set_ylabel`, `ax.set_title`, `ax.legend(fontsize=8)`.
  - `plt.tight_layout()` then `plt.show()`.
  - `*points.T` unpacks an `(n, 2)` array of points into two separate arguments, all x values and all y values. So `ax.scatter(*points.T)` equals `ax.scatter(points[:, 0], points[:, 1])`.

## What you start with
Already in the kernel (run the loader cell first):
- `sentences`: `list[str]`, 170 review sentences, e.g. `"i loved every minute of this film"`.
- `labels`: `list[int]` of 0/1 in the same order, e.g. `1` for that sentence.
- `re`, `plt`, `np`, and the `Perceptron` class from the setup cell. It has `weights` (zeros), `bias` (0.0), `net_input(x)` (the weighted sum `w . x + b`), `activation(z)` (+1 if `z >= 0` else -1) and `predict(x)` (net input then activation).

You must first run **your own** exercise function for this lab (the exercise or solution cell). Otherwise you get a `NameError`.
- `train(model, X, y, epochs: int = 20, learning_rate: float = 0.1) -> list[int]`: runs the perceptron learning rule over `X` for `epochs` passes, changing `model.weights` and `model.bias` in place, and **returns a list with the number of mistakes made in each epoch** (one integer per epoch).

The perceptron learning rule in one line: for each example where `predict` is wrong, add `learning_rate * target * x` to the weights and `learning_rate * target` to the bias. For example, with `learning_rate = 1.0`, `target = -1`, `x = [1, 0, 1]`: the weights change by `[-1, 0, -1]` and the bias by `-1`. Correct examples change nothing.

The helpers `build_vocab`, `vectorize`, `pca_2d` are **not** provided in this notebook; you write them again here (identical to lab 4).

## Steps

### Step 1: Constants
`MIN_WORD_COUNT = 3`, `MIN_POLARITY_RATIO = 0.7`, `TEST_FRACTION = 0.2`, `RANDOM_SEED = 0`.

### Step 2: Labels as -1 / +1 (`y`)
`y = np.array(...)` of length 170 where label `1` becomes `+1` and `0` becomes `-1`. Why: `predict` returns +1 or -1, so the true labels must use the same values. Example: `[1, 0, 1]` becomes `array([ 1, -1,  1])`.

**Check:** `y.shape == (170,)`; 85 values are +1 and 85 are -1.

### Step 3: `tok(sentence: str) -> list[str]`
Lowercase the sentence and return the runs of letters a-z, in order, repeats included. Example: `tok("The plot was great, not bad!")` returns `['the', 'plot', 'was', 'great', 'not', 'bad']`. Tool: `re.findall(r"[a-z]+", text)` returns all matches of "one or more lowercase letters".

**Check:** `tok("i loved every minute of this film")` has 7 items.

### Step 4: `build_vocab(sentences: list[str], y: np.ndarray) -> list[str]`
Pick words that lean strongly positive or negative.
1. **Tally document counts per class.** For each sentence, take `set(tok(sentence))` (so a word counts once per sentence, even if it appears twice). Add 1 to that word in a positive dict if the sentence's `y` is `+1`, else in a negative dict. Read counts with `d.get(word, 0)` because a word may be absent from one dict. `zip(sentences, y)` walks both together.
2. **Filter** every word seen in either dict. With `pos`, `neg` and `total = pos + neg`: skip if `total < MIN_WORD_COUNT`; skip if `abs(pos - neg) / total < MIN_POLARITY_RATIO`.
3. **Sort** the kept words by `total`, highest first, and return just the words.

Worked examples from the real data: `the` has `pos = 55`, `neg = 56`, ratio `1/111 = 0.009`, skipped. `great` has `pos = 3`, `neg = 0`, total 3, ratio 1.0, kept. `felt` has `pos = 1`, `neg = 6`, ratio `5/7 = 0.714`, kept. `bad` has total 1, skipped.

**Check:** `len(vocab) == 22`; the first word is `felt`, the second is `fell`. Words with the same total can appear in different orders on different runs; that is fine.

### Step 5: `vectorize(sentences: list[str], vocab: list[str]) -> np.ndarray`
Binary presence matrix, shape `(n_sentences, len(vocab))`, entry 1.0 if the vocab word appears in the sentence else 0.0 (never counts). Example: `vocab = ['felt', 'flat', 'great']` and the sentence `"the characters felt flat and the dialogue was awkward"` gives the row `[1.0, 1.0, 0.0]`. Start from `np.zeros((n, len(vocab)))`, and build a `{word: column}` dict once so you can find each column fast.

**Check:** on all 170 sentences, `X.shape == (170, 22)` and `X.sum() == 78.0`. Around 100 rows are all zeros (no vocabulary word); that is expected.

### Step 6: `pca_2d(X: np.ndarray) -> np.ndarray`
Squash `X` to 2 columns for drawing only. In order:
1. `centered = X - X.mean(axis=0)` (subtract each column's mean).
2. `cov = np.cov(centered, rowvar=False)` (`rowvar=False` means columns are variables; shape `(22, 22)`).
3. `eigenvalues, eigenvectors = np.linalg.eigh(cov)`. Eigenvalues come back smallest first, and eigenvector `i` is the **column** `eigenvectors[:, i]`.
4. `order = np.argsort(eigenvalues)[::-1]` (positions from largest eigenvalue to smallest); keep `eigenvectors[:, order[:2]]`, shape `(22, 2)`.
5. Return `centered @ top2`, shape `(n, 2)`.

**Check:** `X2d.shape == (170, 2)`.

### Step 7: `train_test_split(*arrays, test_fraction: float, seed: int)`
Split several arrays of equal length with the **same** random choice of rows. `*arrays` means "any number of positional arrays"; `test_fraction` and `seed` are keyword-only, so the call looks like `train_test_split(X, X2d, y, test_fraction=TEST_FRACTION, seed=RANDOM_SEED)`.

Do exactly this:
1. `rng = np.random.default_rng(seed)`.
2. `n = len(arrays[0])`.
3. One shuffle only: `indices = rng.permutation(n)`.
4. `n_test = int(n * test_fraction)`. The first `n_test` entries of `indices` are the test rows, the rest are the train rows.
5. Return two lists: `[a[train_idx] for a in arrays]` and `[a[test_idx] for a in arrays]`, in the order (train list, test list).

Why one shuffle for all arrays: if `X`, `X2d` and `y` were shuffled separately, row 5 of `X` would no longer be the same sentence as row 5 of `y`.

Worked example: `n = 10`, `test_fraction = 0.2`, `seed = 0` gives `int(10 * 0.2) = 2` test rows. `np.random.default_rng(0).permutation(10)` is `[4 6 2 7 3 5 9 0 8 1]`, so test rows are `[4, 6]` and train rows are `[2, 7, 3, 5, 9, 0, 8, 1]`.

**Check:** with `n = 170`, the test part has `int(170 * 0.2) = 34` rows and the train part 136. All arrays in a part have the same length.

### Step 8: `accuracy(model, X, y) -> float`
The fraction of rows where `model.predict(row) == label`. Build `preds = np.array([model.predict(row) for row in X])`, then `float((preds == y).mean())`. Example: 3 right out of 4 returns `0.75`. Return a fraction between 0 and 1, not a percentage.

**Check:** on a fresh untrained `Perceptron(n_features=22)`, `accuracy(model, X, y)` on all 170 sentences returns exactly `0.5` (every prediction is +1 and half the labels are +1).

### Step 9: Build the pipeline and print the vocabulary
`vocab = build_vocab(sentences, y)`, `X = vectorize(sentences, vocab)`, `X2d = pca_2d(X)`. Then print: `Sentiment vocabulary (22 words): [...]`, using `{len(vocab)}` and `{vocab}` in an f-string. (The 22 and the list come from your code; they are shown here only so you know what to expect.)

### Step 10: Split
```
(X_train, X2d_train, y_train), (X_test, X2d_test, y_test) = train_test_split(
    X, X2d, y, test_fraction=TEST_FRACTION, seed=RANDOM_SEED)
```
This unpacks the returned (train list, test list) into six variables. The names must be exactly these.

**Check:** `len(X_train) == 136`, `len(X_test) == 34`, `X_train.shape == (136, 22)`, `X2d_test.shape == (34, 2)`.

### Step 11: Train
- `model = Perceptron(n_features=X.shape[1])`: **full** features, one weight per vocabulary word (22), not the 2D ones.
- `errors_per_epoch = train(model, X_train, y_train, epochs=60, learning_rate=1.0)`. Use only the training split. Never train on or tune with the test split; otherwise the test score is no longer honest.
- `accuracy_per_epoch = [1 - e / len(X_train) for e in errors_per_epoch]`. Example: 40 mistakes out of 136 gives `1 - 40/136 = 0.706`.

**Check:** `len(errors_per_epoch) == 60` and `len(accuracy_per_epoch) == 60`. With the specified seed the first value of `errors_per_epoch` is 53 (accuracy 0.610) and it drops to 40 (accuracy 0.706) by epoch 3.

### Step 12: Test accuracy and printing
`test_acc = accuracy(model, X_test, y_test)`. Print two lines:
```
Train examples: 136, test examples: 34
Held-out test accuracy: 73.53%
```
Use `{len(X_train)}`, `{len(X_test)}` and `{test_acc * 100:.2f}%` (`:.2f` = 2 decimals). Print your computed values; the numbers above are what to expect.

**Check:** with 34 test examples one extra correct answer changes accuracy by 1/34, about 2.94 points, so `test_acc * 34` should be a whole number (here 25).

### Step 13: The two-panel figure
`fig, axes = plt.subplots(1, 2, figsize=(13, 5))`.

First, which test points are right? `preds_test = np.array([model.predict(row) for row in X_test])` using the **full-feature** `X_test`, then `correct = preds_test == y_test` (True/False per test row).

**Left panel `axes[0]`: learning curve.**
- x values are epoch numbers starting at **1** (so `range(1, 61)`), y values are `accuracy_per_epoch`.
- `axes[0].plot(..., marker="o")`.
- x label `epoch`, y label `training accuracy`, title `Learning curve`.

**Right panel `axes[1]`: 2D scatter** drawn at `X2d` positions. Four `scatter` calls:
- train positives `X2d_train[y_train == 1]`: `"seagreen"`, `alpha=0.4`, label `train +`.
- train negatives `X2d_train[y_train == -1]`: `"crimson"`, `alpha=0.4`, label `train -`.
- correct test points `X2d_test[correct]`: `"royalblue"`, `marker="o"`, label `test correct`.
- wrong test points `X2d_test[~correct]`: `"black"`, `marker="x"`, `s=80`, label `test wrong`.

Important: "correct" is decided by the model working on the 22-feature `X_test`, but the dots are drawn at the 2D `X2d_test` positions. The 2D picture is only for looking at.
- x label `PCA component 1 (visualization only)`, y label `PCA component 2 (visualization only)`.
- title `Trained perceptron (test accuracy 74%)` built with an f-string and `{test_acc:.0%}`, which turns 0.7353 into `74%` (a whole percent).
- `axes[1].legend(fontsize=8)`.

Finish with `plt.tight_layout()` and `plt.show()`.

**Check:** the number of blue dots plus black crosses is 34; with the expected result, 25 blue circles and 9 black crosses.

## What a correct result looks like
- **Deterministic**: every number here is fixed by the seed (no run-to-run randomness in the numbers). Vocabulary size 22. `Train examples: 136, test examples: 34`. Held-out accuracy **73.53%** (25 of 34 correct), clearly above 50%.
- Learning curve: starts at about 0.61 on epoch 1, rises to about 0.69 on epoch 2, then sits flat at about 0.706 from epoch 3 on. It is flat rather than rising to 1.0 because the data is not perfectly separable by a straight line, so the perceptron keeps making the same ~40 mistakes per epoch. Mistakes are counted as the model changes during each epoch, so this is not the same as scoring the final weights on the training set.
- Right panel: green and red faded points mixed together (many stacked on the same spot, since about 100 sentences contain no vocabulary word), most test points blue circles, and 9 black crosses.
- The PCA chart can come out mirrored on some machines; it does not change the numbers.

## How you'll be graded
The grader checks behaviour, not formatting. These must hold:
1. The vocabulary, binary vectors and 2D PCA are built exactly as specified (document-level counts, both thresholds, descending frequency).
2. `train_test_split` shuffles with `np.random.default_rng(seed)`, applies identical indices to all arrays, holds out `int(n * 0.2)` = 34 examples, and returns (train list, test list).
3. The model has one weight per vocabulary word, is trained for 60 epochs at learning rate 1.0 using the student's `train`, and training uses only the training split.
4. Held-out test accuracy is computed with `accuracy` on the test split and printed, along with train and test sizes.
5. A two-panel figure: learning curve of training accuracy per epoch, and a PCA scatter distinguishing train classes and correct/wrong test predictions.
