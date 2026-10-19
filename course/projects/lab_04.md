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
Define `MIN_WORD_COUNT = 3` and `MIN_POLARITY_RATIO = 0.7`.

Why: the word filter in Step 4 uses them. Giving them names keeps the numbers in one place.

### Step 2: Labels as -1 / +1 (`y`)
Code shape:
```python
y = np.array([... for l in labels])
```
Make `y`, a numpy array as long as `labels`. Label `1` becomes `+1` and label `0` becomes `-1`.

Why: `predict` gives back +1 or -1. The true answers must use the same two values, so you can compare them.

Example: `labels = [1, 0, 1]` gives `y = array([ 1, -1,  1])`.

How: use `np.array([...])` on a list comprehension such as `[1 if l == 1 else -1 for l in labels]`.

**Check:** `y.shape == (170,)`, `(y == 1).sum() == 85`, `(y == -1).sum() == 85`.

### Step 3: `tok(sentence: str) -> list[str]`
Code shape:
```python
def tok(sentence):
    return re.findall(..., ...)
```
Make the sentence lowercase. Then give back every run of letters a to z, in order, as a list of strings. Digits, spaces and punctuation are only separators, so they are dropped. Repeated words stay repeated here. You remove repeats later.

Example: `tok("The movie was great, the plot too!")` gives `['the', 'movie', 'was', 'great', 'the', 'plot', 'too']`.

How: `re.findall(pattern, text)` gives a list of everything in `text` that matches `pattern`. The pattern `[a-z]+` means "one or more lowercase letters in a row". `str.lower()` makes a string lowercase.

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
Goal: keep only the words that lean strongly toward positive sentences or toward negative ones. The list of words you keep is the *vocabulary* (`vocab`). Every other word is ignored.

Why: very common words like `the` and `was` show up equally in both kinds of sentence. They tell the perceptron nothing.

Do it in three parts.

**4a. Count sentences per class.** The *document count* of a word is the number of **sentences** it is in. A word used 3 times in one sentence still counts once. Here a "document" is one sentence.
- For each sentence, turn `tok(sentence)` into a `set`. A set drops repeats, so a word counts at most once per sentence.
- Add 1 to that word's count in the positive dict if that sentence's `y` is `+1`. Otherwise add 1 in the negative dict.
- A word may be missing from one dict, so read counts with `d.get(word, 0)`.
- Loop over `zip(sentences, y)` to walk the sentences and labels together.

**4b. Filter.** For every word seen in either dict (all the keys of both), let `pos` and `neg` be its two counts, and `total = pos + neg`.
- Skip it if `total < MIN_WORD_COUNT`. Rare words are not reliable.
- Skip it if `abs(pos - neg) / total < MIN_POLARITY_RATIO`. Skip words that do not clearly lean one way.

Worked examples from the real data:
- `the`: `pos = 55`, `neg = 56`, `total = 111`. Ratio `abs(55 - 56) / 111 = 0.009`, below 0.7, so skipped.
- `great`: `pos = 3`, `neg = 0`, `total = 3`. The total is not below 3, and the ratio is `3 / 3 = 1.0`, so **kept**.
- `felt`: `pos = 1`, `neg = 6`, `total = 7`. The ratio is `5 / 7 = 0.714`, at least 0.7, so **kept**.
- `bad`: `pos = 0`, `neg = 1`, `total = 1`. The total is below 3, so skipped even though the ratio is 1.0.

**4c. Sort and give back.** Give back the kept words as a `list[str]`, with the most frequent (biggest `total`) first.
- Make a list of `(word, total)` pairs.
- Sort it with `sorted(pairs, key=lambda p: p[1], reverse=True)`.
- Give back only the words.
- Words with the same `total` may come out in a different order each run, because sets have no fixed order. That is fine. The words and the size stay the same.

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
Build `X`, a grid of numbers. It has one row for each sentence and one column for each vocabulary word, so its shape is `(len(sentences), len(vocab))`. Entry `[i, j]` is `1.0` if `vocab[j]` is in `sentences[i]`, and `0.0` if not. It only says "is the word there", never how many times. The order of the words is ignored too.

Worked example: with `vocab = ['felt', 'flat', 'great']`, the sentence `"the characters felt flat and the dialogue was awkward"` becomes the row `[1.0, 1.0, 0.0]`.

How:
- Make a dict `{word: column}` from `enumerate(vocab)` once, before the loop. Then you can find a word's column fast.
- Start with `np.zeros((n_sentences, n_vocab))`.
- For each sentence row `i`, loop over the words in `set(tok(sentence))`. If a word is in the vocab, set `X[i, column_of_word] = 1.0`.

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
You cannot draw 22 columns on a flat chart. *PCA* is a way to find the 2 directions along which the data spreads out the most, and describe every row with just 2 numbers. You do it by hand with numpy. Use it only to draw the data. The perceptron here runs on the 2 PCA columns. Do exactly these steps, in this order:
1. **Center**: `centered = X - X.mean(axis=0)`. `X.mean(axis=0)` gives the average of each column. Taking it away puts every column around 0. Example: the column `[0, 1, 1]` has mean 0.667, so it becomes `[-0.667, 0.333, 0.333]`.
2. **Covariance**: `cov = np.cov(centered, rowvar=False)`. The *covariance matrix* is a square table that says how each pair of columns moves together. `rowvar=False` tells numpy that the columns are the variables. For 22 columns, `cov` has shape `(22, 22)`.
3. **Eigen step**: `eigenvalues, eigenvectors = np.linalg.eigh(cov)`. Each *eigenvector* is a direction. Its *eigenvalue* says how much the data spreads along that direction. A bigger eigenvalue means a more important direction. The eigenvalues come back **smallest first**. The eigenvector for `eigenvalues[i]` is the **column** `eigenvectors[:, i]`.
4. **Top two**: `order = np.argsort(eigenvalues)[::-1]` lists the positions from the largest eigenvalue to the smallest. (`np.argsort(v)` gives the positions that would sort `v` from smallest to largest, and `[::-1]` flips that list.) Take `order[:2]` and pick those **columns** of `eigenvectors`: `eigenvectors[:, order[:2]]`. The result `top2` has shape `(22, 2)`. The direction with the biggest eigenvalue is first.
5. **Project**: `centered @ top2`. `A @ B` is matrix multiplication. The shapes are `(170, 22) @ (22, 2) -> (170, 2)`.

Give back that `(n_samples, 2)` array.

**Check:** `X2d.shape == (170, 2)`, and `X2d.mean(axis=0)` is about `[0, 0]` (centered data stays centered). Rows with no vocabulary words are all the same, so they land on the exact same point and sit on top of each other in the chart.

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
The *decision boundary* is the line where the perceptron's score `w0*x + w1*y + b` is 0. Points on one side get +1, points on the other side get -1. Draw the data and that line:
- Start with `plt.figure(figsize=(7, 6))`. This starts a new chart 7 by 6 inches.
- Positive points (`y == 1`): `plt.scatter` in `"seagreen"`, label `positive`, `alpha=0.7`. (`alpha` is how see-through the dots are, from 0 to 1.) Negative points (`y == -1`): `"crimson"`, label `negative`, `alpha=0.7`.
- Pick rows with a True/False mask: `mask = (y == 1)`. Then `X2d[mask, 0]` are the x values and `X2d[mask, 1]` are the y values.
- The boundary is where `w0*x + w1*y + b = 0`. Solve for `y`: `y = -(w0*x + b) / w1`. Worked example: `w0 = 1, w1 = 2, b = 4` gives `y = -(x + 4) / 2`. At `x = 0` that is `y = -2`.
- Only draw it **if `abs(model.weights[1]) > 1e-9`**. You cannot divide by a weight of 0. So if the second weight is (almost) zero, draw no line.
- When you draw it, use `xs = np.linspace(min_x - 1, max_x + 1, 100)`. `np.linspace(a, b, n)` gives `n` evenly spaced numbers from `a` to `b`. Here `min_x` and `max_x` are the smallest and biggest values in the first column of `X2d`. Work out `ys` from the formula. numpy does all 100 values at once. Then draw it with `plt.plot(xs, ys, color="black", linestyle="--", label="decision boundary")`. (`"--"` means a dashed line.)
- Finish with `plt.xlabel("PCA component 1")`, `plt.ylabel("PCA component 2")`, `plt.title(title)`, `plt.legend()`, `plt.tight_layout()` and `plt.show()`.

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
In this order:
1. `vocab = build_vocab(sentences, y)`
2. `X = vectorize(sentences, vocab)`
3. `X2d = pca_2d(X)`
4. `model = Perceptron(n_features=2)`. It is untrained. It has one weight for each PCA column, so 2 weights, not 22.
5. Predict every row of `X2d`. Loop over the rows (`for row in X2d`) and call `model.predict(row)`. Put the results in a numpy array `preds`.
6. `accuracy = (preds == y).mean()`. *Accuracy* is the fraction of guesses that match the true label. Comparing two arrays with `==` gives an array of True and False. `.mean()` counts True as 1 and False as 0, so you get the fraction right. Example: 3 right out of 4 gives 0.75.

**Check:** `len(preds) == 170` and every prediction is `+1`. Why: with `weights = [0, 0]` and `bias = 0.0`, every score is exactly 0. `activation(0)` is +1, so all 170 are predicted +1. 85 of them are right.

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
Use f-strings: `{len(vocab)}` for the size, and `{accuracy * 100:.2f}%` for the percentage. (`:.2f` means 2 digits after the point.) Print the real values your code worked out. The text above shows what they should be.

### Step 10: Draw the plot
Code shape:
```python
plot_boundary(..., ..., ..., "...")
```
Call `plot_boundary(X2d, y, model, "Untrained perceptron on real review sentiment")`.

**Check:** one scatter chart with green and red points mixed together. Many dots sit on the same spot (the 100 sentences with all zeros). There is no dashed line, and the legend has two entries. The axis ranges are small (about -1.2 to 1.2). The PCA axes may flip sign between runs or machines, so the chart may look mirrored. That is harmless.
