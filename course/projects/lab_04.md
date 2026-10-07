# Project: An Untrained Perceptron on Real Review Sentiment

## Goal
The question: **what does a perceptron know before it has learned anything?** To find out, you will feed it real, human-written review sentences and measure how often it guesses the sentiment correctly. A perceptron cannot read text, so first you must turn each sentence into a list of numbers.

You will:
1. Define two threshold constants and turn the 0/1 labels into -1/+1 labels (`y`).
2. Write `tok` to split a sentence into lowercase words.
3. Write `build_vocab` to pick a short list of words that clearly lean positive or negative.
4. Write `vectorize` to turn each sentence into a row of 0/1 numbers (a word-presence table).
5. Write `pca_2d` to squash that table down to 2 columns so it can be drawn on a flat chart.
6. Write `plot_boundary` to draw the two classes and (if there is one) the perceptron's decision line.
7. Run the pipeline, print the vocabulary size and the untrained accuracy, and draw the plot.

Takeaway: with all weights at zero the perceptron predicts the same class for everything, so on a balanced dataset it scores exactly 50%. Lab 5 trains it and beats that.

## Words you will see
- **Token / tokenize**: a token is one word cut out of a sentence. Tokenizing means cutting a sentence into its words.
- **Vocabulary (`vocab`)**: the list of words we choose to pay attention to. Every other word is ignored.
- **Document count**: the number of *sentences* a word appears in. A word that appears 3 times in one sentence still counts once for that sentence. Here a "document" is one sentence.
- **Bag-of-words**: describing a sentence only by which vocabulary words it contains, ignoring word order.
- **Binary / presence**: the value is 1.0 if the word is there and 0.0 if not. It is never 2.0 or 3.0, even if the word appears twice.
- **Feature**: one input number for the model. Here, one feature = one vocabulary word.
- **Feature matrix `X`**: a 2D numpy array with one row per sentence and one column per feature. Shape is `(n_rows, n_columns)`.
- **PCA (principal component analysis)**: a method that finds the 2 directions along which the data varies the most, and re-describes every row using just those 2 numbers. We use it only to draw the data. The perceptron here is run on the 2 PCA columns.
- **Covariance matrix**: a square table that says how each pair of columns moves together. For 22 columns it has shape `(22, 22)`.
- **Eigenvectors / eigenvalues**: for a covariance matrix, each eigenvector is a direction and its eigenvalue says how much the data spreads along that direction. Bigger eigenvalue = more important direction.
- **Decision boundary**: the line where the perceptron's score `w0*x + w1*y + b` equals 0. Points on one side are predicted +1, the other side -1.
- **Accuracy**: the fraction of predictions that match the true label.
- **numpy calls you will use** (`np` is numpy):
  - `np.array(list)` makes an array from a list.
  - `np.zeros((r, c))` makes an `r` by `c` array of 0.0.
  - `array.mean(axis=0)` averages each column (one number per column).
  - `np.cov(M, rowvar=False)` covariance of the columns of `M`.
  - `np.linalg.eigh(C)` returns `(eigenvalues, eigenvectors)` for a symmetric matrix `C`. Eigenvalues come back **smallest first**, and the eigenvector for `eigenvalues[i]` is the **column** `eigenvectors[:, i]`.
  - `np.argsort(v)` gives the positions that would sort `v` from smallest to largest; `[::-1]` reverses that list.
  - `A @ B` is matrix multiplication.
  - `np.linspace(a, b, n)` gives `n` evenly spaced numbers from `a` to `b`.
- **matplotlib calls you will use** (`plt` is matplotlib.pyplot):
  - `plt.figure(figsize=(7, 6))` starts a new chart 7 by 6 inches.
  - `plt.scatter(xs, ys, color=..., alpha=..., label=...)` draws dots. `alpha` is transparency (0 to 1).
  - `plt.plot(xs, ys, color=..., linestyle="--", label=...)` draws a line (`"--"` = dashed).
  - `plt.xlabel`, `plt.ylabel`, `plt.title`, `plt.legend()`, `plt.tight_layout()`, `plt.show()`.

## What you start with
Already in the kernel (run the loader cell first):
- `sentences`: `list[str]`, 170 review sentences. For example `sentences[1]` is `"i loved every minute of this film"`.
- `labels`: `list[int]` of 0/1, same order as `sentences`. `labels[1]` is `1` (positive). There are 85 of each, so the data is balanced.
- `re`, `plt` (matplotlib.pyplot), `np` (numpy), already imported in the setup cell.

You must first run **your own** `Perceptron` class from this lab's exercise (or solution) cell. If you skip this you get a `NameError`. It provides:
- `Perceptron(n_features: int)`: makes a model with `weights` (a numpy array of zeros, one per feature) and `bias` (0.0).
- `net_input(x) -> float`: the weighted sum `w . x + b`.
- `activation(z) -> int`: +1 if `z >= 0`, else -1.
- `predict(x) -> int`: net input, then activation.

## Steps

### Step 1: Constants
Define `MIN_WORD_COUNT = 3` and `MIN_POLARITY_RATIO = 0.7`. Why: the vocabulary filter in Step 4 uses them, and naming them keeps the numbers in one place.

### Step 2: Labels as -1 / +1 (`y`)
Make `y`, a numpy array of the same length as `labels`, where label `1` becomes `+1` and label `0` becomes `-1`. Why: the perceptron's `predict` returns +1 or -1, so the true answers must use the same two values to be comparable.

Example: `labels = [1, 0, 1]` gives `y = array([ 1, -1,  1])`.

Use `np.array([...])` on a list comprehension such as `[1 if l == 1 else -1 for l in labels]`.

**Check:** `y.shape == (170,)`, `(y == 1).sum() == 85`, `(y == -1).sum() == 85`.

### Step 3: `tok(sentence: str) -> list[str]`
Lowercase the sentence, then return every run of letters a to z, in order, as a list of strings. Digits, spaces and punctuation are separators and are dropped. Repeated words stay repeated here (de-duplication happens later).

Example: `tok("The movie was great, the plot too!")` returns `['the', 'movie', 'was', 'great', 'the', 'plot', 'too']`.

Tool: `re.findall(pattern, text)` returns all non-overlapping matches of a regular-expression `pattern` as a list. The pattern `[a-z]+` means "one or more lowercase letters in a row". `str.lower()` lowercases a string.

**Check:** `tok("i loved every minute of this film")` has 7 items and starts with `'i', 'loved'`.

### Step 4: `build_vocab(sentences: list[str], y: np.ndarray) -> list[str]`
Goal: keep only words that lean strongly toward positive or toward negative sentences. Why: very common words like `the` and `was` appear equally in both classes and tell a classifier nothing.

Do it in three parts.

**4a. Count document counts per class.** For each sentence, turn `tok(sentence)` into a `set` (this removes repeats, so a word counts at most once per sentence). Add 1 to that word's count in the positive tally if that sentence's `y` is `+1`, otherwise in the negative tally. Use two dicts (positive and negative). A word may be missing from one dict, so read counts with `d.get(word, 0)`. Loop over `zip(sentences, y)` to walk the sentences and labels together.

**4b. Filter.** For every word seen in either dict (the union of the keys), let `pos` and `neg` be its two counts and `total = pos + neg`.
- Skip it if `total < MIN_WORD_COUNT`. (Rare words are unreliable.)
- Skip it if `abs(pos - neg) / total < MIN_POLARITY_RATIO`. (Skip words that do not lean clearly one way.)

Worked examples from the real data:
- `the`: `pos = 55`, `neg = 56`, `total = 111`. Ratio `abs(55 - 56) / 111 = 0.009`, below 0.7, so skipped.
- `great`: `pos = 3`, `neg = 0`, `total = 3`. Total is not below 3, and ratio `3 / 3 = 1.0`, so **kept**.
- `felt`: `pos = 1`, `neg = 6`, `total = 7`. Ratio `5 / 7 = 0.714`, at least 0.7, so **kept**.
- `bad`: `pos = 0`, `neg = 1`, `total = 1`. Total below 3, so skipped even though the ratio is 1.0.

**4c. Sort and return.** Return the kept words as a `list[str]`, ordered by `total` descending (most frequent first). Tip: build a list of `(word, total)` pairs, sort it with `sorted(pairs, key=lambda p: p[1], reverse=True)`, then return only the words. Words with equal `total` may come out in any order from run to run (sets have no fixed order). That is fine, because the set of words and the size do not change.

**Check:** `len(vocab) == 22`. The first word is `felt` (total 7), the second is `fell` (total 5), and all 22 words are strings.

### Step 5: `vectorize(sentences: list[str], vocab: list[str]) -> np.ndarray`
Build the feature matrix `X`. Shape `(len(sentences), len(vocab))`. Entry `[i, j]` is `1.0` if `vocab[j]` appears in `sentences[i]`, else `0.0`. Presence only, never counts.

Worked example: with `vocab = ['felt', 'flat', 'great']`, the sentence `"the characters felt flat and the dialogue was awkward"` becomes row `[1.0, 1.0, 0.0]`.

How: start with `np.zeros((n_sentences, n_vocab))`. For each sentence row `i`, loop over the words in `set(tok(sentence))`; if a word is in the vocab, set `X[i, position_of_word] = 1.0`. To find a word's column quickly, build a dict `{word: column}` from `enumerate(vocab)` once, before the loop.

**Check:** `X.shape == (170, 22)`, `X.sum() == 78.0` (78 vocabulary hits in total), and only 0.0 and 1.0 appear. Many rows are all zeros: 100 of the 170 sentences contain none of the 22 words. That is expected.

### Step 6: `pca_2d(X: np.ndarray) -> np.ndarray`
Project `X` down to 2 columns, doing the PCA by hand with numpy. Do exactly these steps, in order:
1. **Center**: `centered = X - X.mean(axis=0)`. This subtracts each column's average so every column is centered on 0. Example: a column `[0, 1, 1]` has mean 0.667, so it becomes `[-0.667, 0.333, 0.333]`.
2. **Covariance**: `cov = np.cov(centered, rowvar=False)`. `rowvar=False` tells numpy that columns are the variables. For 22 columns `cov` has shape `(22, 22)`.
3. **Eigen-decomposition**: `eigenvalues, eigenvectors = np.linalg.eigh(cov)`.
4. **Top two**: `order = np.argsort(eigenvalues)[::-1]` lists positions from largest eigenvalue to smallest. Take `order[:2]` and select those **columns** of `eigenvectors` (`eigenvectors[:, order[:2]]`). The result `top2` has shape `(22, 2)`, with the largest-eigenvalue direction first.
5. **Project**: `centered @ top2`. Shapes: `(170, 22) @ (22, 2) -> (170, 2)`.

Return that `(n_samples, 2)` array. The output is for visualization only.

**Check:** `X2d.shape == (170, 2)`, and `X2d.mean(axis=0)` is approximately `[0, 0]` (centered data stays centered). Rows with no vocabulary words are identical, so they land on the exact same point and overlap on the chart.

### Step 7: `plot_boundary(X2d, y, model, title) -> None`
Draw the data and the decision line. Details:
- Start with `plt.figure(figsize=(7, 6))`.
- Positive points (`y == 1`): `plt.scatter` in `"seagreen"`, label `positive`, `alpha=0.7`. Negative points (`y == -1`): `"crimson"`, label `negative`, `alpha=0.7`. Select rows with a boolean mask: `mask = (y == 1)`, then `X2d[mask, 0]` are the x values and `X2d[mask, 1]` the y values.
- The perceptron's boundary is the set of points with `w0*x + w1*y + b = 0`. Solve for `y`: `y = -(w0*x + b) / w1`. Worked example: `w0 = 1, w1 = 2, b = 4` gives `y = -(x + 4) / 2`; at `x = 0` that is `y = -2`.
- Only draw it **if `abs(model.weights[1]) > 1e-9`**. Dividing by a weight of 0 is impossible, so with a (near-)zero second weight draw no line at all.
- When drawn: use `xs = np.linspace(min_x - 1, max_x + 1, 100)` where `min_x`/`max_x` are the smallest and largest first-column values of `X2d`. Compute `ys` from the formula (numpy applies it to all 100 values at once). Plot with `plt.plot(xs, ys, color="black", linestyle="--", label="decision boundary")`.
- Finish with `plt.xlabel("PCA component 1")`, `plt.ylabel("PCA component 2")`, `plt.title(title)`, `plt.legend()`, `plt.tight_layout()`, `plt.show()`.

**Check:** with an untrained model the legend lists only `positive` and `negative`. With a model whose weights you set by hand to `[1.0, 2.0]` and bias `4.0`, a dashed line appears.

### Step 8: Run the pipeline and evaluate
In this order:
1. `vocab = build_vocab(sentences, y)`
2. `X = vectorize(sentences, vocab)`
3. `X2d = pca_2d(X)`
4. `model = Perceptron(n_features=2)` (untrained, one weight per PCA column, so 2 weights, not 22).
5. Predict every row of `X2d`: loop over the rows (`for row in X2d`) calling `model.predict(row)`. Collect the results into a numpy array `preds`.
6. `accuracy = (preds == y).mean()`. Comparing two arrays with `==` gives an array of True/False; `.mean()` treats True as 1 and False as 0, so it is the fraction correct. Example: 3 correct out of 4 gives 0.75.

**Check:** `len(preds) == 170` and every prediction is `+1`. Why: with `weights = [0, 0]` and `bias = 0.0`, every net input is exactly 0, `activation(0)` is +1, so all 170 are predicted +1. 85 of them are right.

### Step 9: Print three lines
Exactly:
```
Vocabulary size: 22
Untrained perceptron accuracy on real sentiment data: 50.00%
(Weights are all zero, so it predicts the same class for everything - see lab 5.)
```
Use f-strings: `{len(vocab)}` for the size, and `{accuracy * 100:.2f}%` for the percentage (`:.2f` means 2 digits after the decimal point). Print the real values your code computed; the text above shows what they should be.

### Step 10: Draw the plot
Call `plot_boundary(X2d, y, model, "Untrained perceptron on real review sentiment")`.

## What a correct result looks like
- **Deterministic** (no randomness anywhere): vocabulary size **22**, accuracy **exactly 50.00%**. The order of vocabulary words with equal frequency can vary between runs, but the 22 words themselves cannot.
- The 22 words (for example `felt`, `fell`, `dull`, `stale`, `not`, `flat`, `perfectly`, `excellent`, `great`) mostly lean on sentiment; none of them is `the` or `was`.
- The chart is one scatter plot with green and red points mixed together, many dots stacked on the same spot (the 100 all-zero sentences), and **no** dashed line. The legend has two entries. The axis ranges are small (roughly -1.2 to 1.2).
- The PCA axes may flip sign between runs or machines (a mirrored chart). That is harmless: it does not change the numbers above.

## How you'll be graded
The grader checks behaviour, not formatting. These must hold:
1. `build_vocab` uses document-level (per-sentence-set) counts, the `MIN_WORD_COUNT` and `MIN_POLARITY_RATIO` filters exactly as described, and sorts by total frequency descending.
2. `vectorize` produces a binary presence matrix of shape (170, len(vocab)).
3. `pca_2d` centers the data and projects onto the top-2 eigenvectors of the covariance matrix, giving shape (170, 2).
4. The untrained `Perceptron(n_features=2)` is evaluated on `X2d` against `y` in {-1, +1}, yielding 50.00% accuracy, and the vocabulary size and accuracy are printed.
5. `plot_boundary` colors the two classes and draws a boundary line only when the second weight is non-negligible.
