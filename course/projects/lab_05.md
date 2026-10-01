# Project: Training a Perceptron on Real Review Sentiment

## Goal
Train the perceptron from this lab on real review sentences and evaluate it honestly on data it never saw. You rebuild the text-to-vector pipeline from lab 4 (vocabulary, bag-of-words, 2D projection), split the data into train and test sets, train with your `train` function, and report held-out accuracy. A linear model on noisy human text will not be perfect, but it should clearly beat the 50% of an untrained perceptron.

## What you start with
Already in the kernel (run the loader cell first):
- `sentences`: `list[str]`, 170 review sentences. `labels`: `list[int]` of 0/1.
- `re`, `plt`, `np`, and the `Perceptron` class (from the setup cell: `weights` zeros, `bias` 0.0, `net_input`, `activation` returning +1 if z >= 0 else -1, `predict`).

Your own exercise function from this lab MUST be defined and run (exercise or solution cell) before your project cell:
- `train(model, X, y, epochs: int = 20, learning_rate: float = 0.1) -> list[int]`, the perceptron learning rule, returning the number of mistakes in each epoch.

The helpers `build_vocab`, `vectorize`, `pca_2d` are NOT provided in this notebook; you write them here (they are the same as lab 4's).

## Requirements
1. Constants: `MIN_WORD_COUNT = 3`, `MIN_POLARITY_RATIO = 0.7`, `TEST_FRACTION = 0.2`, `RANDOM_SEED = 0`.
2. `y = np.array(...)` with label 1 mapped to `+1` and label 0 mapped to `-1`.
3. `tok(sentence: str) -> list[str]`: lowercase, runs of letters a-z.
4. `build_vocab(sentences: list[str], y: np.ndarray) -> list[str]`:
   - tally per-class **document** counts (each distinct word counted once per sentence) for positive and negative sentences;
   - for each word, `pos`, `neg`, `total = pos + neg`; skip if `total < MIN_WORD_COUNT`; skip if `abs(pos - neg) / total < MIN_POLARITY_RATIO`;
   - return kept words sorted by `total`, descending.
5. `vectorize(sentences: list[str], vocab: list[str]) -> np.ndarray`: binary presence matrix of shape `(n_sentences, len(vocab))` (1.0 if the word appears, else 0.0).
6. `pca_2d(X: np.ndarray) -> np.ndarray`: center the columns, covariance of features (`rowvar=False`), `np.linalg.eigh`, take the eigenvectors of the two largest eigenvalues (largest first), return centered data times those two vectors, shape `(n, 2)`. Used for visualization only.
7. `train_test_split(*arrays, test_fraction: float, seed: int)`: build a random generator with `np.random.default_rng(seed)`, make one random permutation of the indices `0..n-1` (n = length of the first array), take the first `int(n * test_fraction)` indices as test and the rest as train. Apply the SAME indices to every array passed in. Return two lists: `[train version of each array...]` and `[test version of each array...]`. `test_fraction` and `seed` are keyword arguments.
8. `accuracy(model, X, y) -> float`: fraction of rows where `model.predict(row) == label`.
9. Pipeline: `vocab`, `X`, `X2d` as in lab 4; print `Sentiment vocabulary (<len(vocab)> words): <the vocab list>`.
10. Split `X`, `X2d`, `y` together using `TEST_FRACTION` and `RANDOM_SEED`, unpacking into `X_train, X2d_train, y_train` and `X_test, X2d_test, y_test`. This gives 136 training and 34 test examples.
11. Create `model = Perceptron(n_features=X.shape[1])` (full-dimensional features, not the 2D ones). Train for **60 epochs** with **learning_rate = 1.0** on the training split with your `train`; keep the returned `errors_per_epoch`. Compute `accuracy_per_epoch = [1 - e / len(X_train) for e in errors_per_epoch]`.
12. Compute `test_acc` on the test split and print two lines:
    - `Train examples: <n_train>, test examples: <n_test>`
    - `Held-out test accuracy: <test_acc as percentage, 2 decimals>`
13. Plot one figure with two side-by-side panels via `plt.subplots(1, 2, figsize=(13, 5))`:
    - Left: line plot of `accuracy_per_epoch` against epoch numbers starting at 1 (circle markers); x label `epoch`, y label `training accuracy`, title `Learning curve`.
    - Right: 2D PCA scatter: train positives (`"seagreen"`, alpha 0.4, label `train +`), train negatives (`"crimson"`, alpha 0.4, label `train -`), correctly classified test points (`"royalblue"`, circles, label `test correct`) and wrongly classified test points (`"black"`, `x` markers, size 80, label `test wrong`). "Correct" is judged by the model's predictions on the full-feature `X_test`; the points are drawn at their `X2d_test` positions. Axis labels `PCA component 1 (visualization only)` and `PCA component 2 (visualization only)`, title `Trained perceptron (test accuracy <test_acc as whole percent>)`, legend with `fontsize=8`.
    - `plt.tight_layout()` then `plt.show()`.

## Expected output
- The vocabulary list is deterministic; its size is a few dozen words.
- `Train examples: 136, test examples: 34` (deterministic).
- Held-out accuracy is deterministic given the seed and is typically in the 70s-percent range (with 34 test examples it moves in steps of about 2.9 points); it must be clearly above 50%.
- A learning curve that rises (noisily) from the first epoch and plateaus below or near 100%, and a scatter where most test points are blue circles with a few black x marks.

## Hints on approach
- Reuse the lab 4 pipeline unchanged; the new parts are the split, the training call and the evaluation.
- For the split, the generator's `permutation` method gives one shuffle you can reuse for every array. Index each array with the resulting index arrays.
- Because the split is done once with the same indices, the 2D version and the full version of the same sentence stay aligned.
- Boolean masks (`y == 1`, `~correct`) select subsets of rows for plotting; `ax.scatter(*points.T, ...)` unpacks the two columns as x and y.
- Train only on the training split. Never train on or tune with the test split.

## How you'll be graded
The grader checks behaviour, not formatting. These must hold:
1. The vocabulary, binary vectors and 2D PCA are built exactly as specified (document-level counts, both thresholds, descending frequency).
2. `train_test_split` shuffles with `np.random.default_rng(seed)`, applies identical indices to all arrays, holds out `int(n * 0.2)` = 34 examples, and returns (train list, test list).
3. The model has one weight per vocabulary word, is trained for 60 epochs at learning rate 1.0 using the student's `train`, and training uses only the training split.
4. Held-out test accuracy is computed with `accuracy` on the test split and printed, along with train and test sizes.
5. A two-panel figure: learning curve of training accuracy per epoch, and a PCA scatter distinguishing train classes and correct/wrong test predictions.
