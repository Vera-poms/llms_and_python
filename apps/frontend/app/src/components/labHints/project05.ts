import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 5 project starter. `match` picks the cell (a piece of its starter code).
export const project05Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def train_test_split(*arrays, test_fraction, seed):",
    hints: [
      {
        code: "MIN_WORD_COUNT = ...",
        text:
          "**Step 1: Constants**\n" +
          "Settings used later: how rare a word may be, how one-sided it must be, how much data to hide for the test, and the random seed (so the shuffle is the same every run).\n" +
          "**1)** Define `MIN_WORD_COUNT = 3`, `MIN_POLARITY_RATIO = 0.7`, `TEST_FRACTION = 0.2` and `RANDOM_SEED = 0`.",
      },
      {
        code: "y = np.array([... for l in labels])",
        text:
          "**Step 2: Labels as -1 / +1 (`y`)**\n" +
          "You get `labels`, a list of 0s and 1s, like `[1, 0, 1]`.\n" +
          "**1)** Make a list with `1 if l == 1 else -1` for each `l` in `labels`.\n" +
          "**2)** Set `y` to `np.array(...)` of that list. For the example you get `array([ 1, -1,  1])`.\n" +
          "**Check:** `y.shape == (170,)`. 85 values are +1 and 85 are -1.",
      },
      {
        code: "def tok(sentence):",
        block: "function",
        text:
          "**Step 3: `tok(sentence: str) -> list[str]`**\n" +
          "**1)** Make the sentence lowercase.\n" +
          "**2)** Return `re.findall(r\"[a-z]+\", ...)` on it. Repeats stay in.\n" +
          "Example: `tok(\"The plot was great, not bad!\")` gives `['the', 'plot', 'was', 'great', 'not', 'bad']`.\n" +
          "**Check:** `tok(\"i loved every minute of this film\")` has 7 items.",
      },
      {
        code: "def build_vocab(sentences, y):",
        block: "function",
        text:
          "**Step 4: `build_vocab(sentences: list[str], y: np.ndarray) -> list[str]`**\n" +
          "You give back the words that lean strongly positive or strongly negative, most frequent first. Same as lab 4.\n" +
          "**1)** Loop over `zip(sentences, y)`. For each word in `set(tok(sentence))`, add 1 to `pos_counts[word]` if `label` is `+1`. Otherwise add 1 to `neg_counts[word]`. The `set` makes a word count once per sentence.\n" +
          "**2)** Use `d.get(word, 0)` to start a new word from 0.\n" +
          "**3)** For each word in `set(pos_counts) | set(neg_counts)`, set `pos` and `neg` with `.get(word, 0)`, and `total = pos + neg`.\n" +
          "**4)** Skip the word if `total < MIN_WORD_COUNT`, or if `abs(pos - neg) / total < MIN_POLARITY_RATIO`.\n" +
          "**5)** Otherwise add `(word, total)` to `pairs`.\n" +
          "**6)** Sort `pairs` by `total`, biggest first, and return only the words.\n\n" +
          "Worked examples from the real data:\n" +
          "- `the` has `pos = 55`, `neg = 56`, ratio `1/111 = 0.009`, so it is skipped.\n" +
          "- `great` has `pos = 3`, `neg = 0`, total 3, ratio 1.0, so it is kept.\n" +
          "- `felt` has `pos = 1`, `neg = 6`, ratio `5/7 = 0.714`, so it is kept.\n" +
          "- `bad` has total 1, so it is skipped.\n" +
          "**Check:** `len(vocab) == 22`. The first word is `felt` and the second is `fell`. Words with the same total can come out in a different order on different runs. That is fine.",
      },
      {
        code: "def vectorize(sentences, vocab):",
        block: "function",
        text:
          "**Step 5: `vectorize(sentences: list[str], vocab: list[str]) -> np.ndarray`**\n" +
          "You give back a grid with one row per sentence and one column per vocabulary word. Example: `vocab = ['felt', 'flat', 'great']` and the sentence `\"the characters felt flat and the dialogue was awkward\"` give the row `[1.0, 1.0, 0.0]`.\n" +
          "**1)** Make `column`, a dict of each word to its column number, from `enumerate(vocab)`. Do it once, before the loop.\n" +
          "**2)** Set `X` to `np.zeros((len(sentences), len(vocab)))`.\n" +
          "**3)** For each sentence `i`, loop over `set(tok(sentence))`.\n" +
          "**4)** If the word is in `column`, set `X[i, column[word]] = 1.0`. It never counts how many times.\n" +
          "**5)** Return `X`.\n" +
          "**Check:** on all 170 sentences, `X.shape == (170, 22)` and `X.sum() == 78.0`. About 100 rows are all zeros (no vocabulary word). That is expected.",
      },
      {
        code: "def pca_2d(X):",
        block: "function",
        text:
          "**Step 6: `pca_2d(X: np.ndarray) -> np.ndarray`**\n" +
          "You give back the rows of `X` described by just 2 numbers each, only for drawing. Do these steps in this order:\n" +
          "**1)** Set `centered` to `X - X.mean(axis=0)`.\n" +
          "**2)** Set `cov` to `np.cov(centered, rowvar=False)`. The shape is `(22, 22)`.\n" +
          "**3)** Set `eigenvalues, eigenvectors` to `np.linalg.eigh(cov)`. The eigenvalues come back smallest first, and eigenvector `i` is the **column** `eigenvectors[:, i]`.\n" +
          "**4)** Set `order` to `np.argsort(eigenvalues)[::-1]`. This lists the positions from the largest eigenvalue to the smallest.\n" +
          "**5)** Set `top2` to `eigenvectors[:, order[:2]]`. It has shape `(22, 2)`.\n" +
          "**6)** Return `centered @ top2`. The shape is `(n, 2)`.\n" +
          "**Check:** `X2d.shape == (170, 2)`.",
      },
      {
        code: "def train_test_split(*arrays, test_fraction, seed):",
        block: "function",
        text:
          "**Step 7: `train_test_split(*arrays, test_fraction: float, seed: int)`**\n" +
          "You get any number of arrays of the same length. `test_fraction` and `seed` are given by name, like `train_test_split(X, X2d, y, test_fraction=TEST_FRACTION, seed=RANDOM_SEED)`. You give back two lists: the train part of every array, then the test part. All arrays use the **same** shuffled rows, so row 5 of `X` stays the same sentence as row 5 of `y`.\n" +
          "**1)** Set `rng` to `np.random.default_rng(seed)`.\n" +
          "**2)** Set `n` to `len(arrays[0])`.\n" +
          "**3)** Set `indices` to `rng.permutation(n)`. Shuffle once only.\n" +
          "**4)** Set `n_test` to `int(n * test_fraction)`.\n" +
          "**5)** Set `test_idx` to `indices[:n_test]`, and `train_idx` to `indices[n_test:]`.\n" +
          "**6)** Return `[a[train_idx] for a in arrays]` and then `[a[test_idx] for a in arrays]`.\n\n" +
          "Worked example: `n = 10`, `test_fraction = 0.2` and `seed = 0` give `int(10 * 0.2) = 2` test rows. `np.random.default_rng(0).permutation(10)` is `[4 6 2 7 3 5 9 0 8 1]`. So the test rows are `[4, 6]` and the train rows are `[2, 7, 3, 5, 9, 0, 8, 1]`.\n" +
          "**Check:** with `n = 170`, the test part has `int(170 * 0.2) = 34` rows and the train part has 136. All arrays in one part have the same length.",
      },
      {
        code: "def accuracy(model, X, y):",
        block: "function",
        text:
          "**Step 8: `accuracy(model, X, y) -> float`**\n" +
          "You give back the fraction of rows where `model.predict(row)` matches the label, as a number from 0 to 1 (not a percentage). Example: 3 right out of 4 gives `0.75`.\n" +
          "**1)** Set `preds` to `np.array([model.predict(row) for row in X])`.\n" +
          "**2)** Return `float((preds == y).mean())`.\n" +
          "**Check:** on a fresh untrained `Perceptron(n_features=22)`, `accuracy(model, X, y)` on all 170 sentences gives exactly `0.5`. Every prediction is +1, and half the labels are +1.",
      },
      {
        code: "vocab = ...",
        text:
          "**Step 9: Build the pipeline and print the vocabulary**\n" +
          "**1)** Set `vocab` to `build_vocab(sentences, y)`.\n" +
          "**2)** Set `X` to `vectorize(sentences, vocab)`.\n" +
          "**3)** Set `X2d` to `pca_2d(X)`.\n" +
          "**4)** Print `Sentiment vocabulary (22 words): [...]` with an f-string, using `{len(vocab)}` and `{vocab}`. The 22 and the list come from your code.",
      },
      {
        code: "(X_train, X2d_train, y_train), (X_test, X2d_test, y_test) = train_test_split(",
        text:
          "**Step 10: Split**\n" +
          "**1)** Call `train_test_split(X, X2d, y, test_fraction=TEST_FRACTION, seed=RANDOM_SEED)` and unpack the result into exactly these names: `(X_train, X2d_train, y_train), (X_test, X2d_test, y_test)`.\n" +
          "**Check:** `len(X_train) == 136`, `len(X_test) == 34`, `X_train.shape == (136, 22)`, `X2d_test.shape == (34, 2)`.",
      },
      {
        code: "model = Perceptron(n_features=...)",
        text:
          "**Step 11: Train**\n" +
          "An *epoch* is one full pass over the training examples. `train` gives back the number of mistakes in each epoch.\n" +
          "**1)** Set `model` to `Perceptron(n_features=X.shape[1])`. This uses the full features (22), not the 2D ones.\n" +
          "**2)** Set `errors_per_epoch` to `train(model, X_train, y_train, epochs=60, learning_rate=1.0)`. Use only the training part, never the test part.\n" +
          "**3)** Set `accuracy_per_epoch` to `[1 - e / len(X_train) for e in errors_per_epoch]`. Example: 40 mistakes out of 136 gives `1 - 40/136 = 0.706`.\n" +
          "**Check:** `len(errors_per_epoch) == 60` and `len(accuracy_per_epoch) == 60`. With the seed above, the first value of `errors_per_epoch` is 53 (accuracy 0.610). It drops to 40 (accuracy 0.706) by epoch 3.",
      },
      {
        code: "test_acc = ...",
        text:
          "**Step 12: Test accuracy and printing**\n" +
          "Print exactly these two lines (the numbers come from your code):\n" +
          "`Train examples: 136, test examples: 34`\n" +
          "`Held-out test accuracy: 73.53%`\n" +
          "**1)** Set `test_acc` to `accuracy(model, X_test, y_test)`.\n" +
          "**2)** Print the first line with `{len(X_train)}` and `{len(X_test)}`.\n" +
          "**3)** Print the second line with `{test_acc * 100:.2f}%`.\n" +
          "**Check:** with 34 test examples, one more right answer changes the accuracy by 1/34, about 2.94 points. So `test_acc * 34` should be a whole number (here 25).",
      },
      {
        code: "fig, axes = plt.subplots(...)",
        text:
          "**Step 13: The two-panel figure**\n" +
          "**1)** Set `fig, axes` to `plt.subplots(1, 2, figsize=(13, 5))`. `axes[0]` is the left panel and `axes[1]` is the right one.\n" +
          "**2)** Set `preds_test` to `np.array([model.predict(row) for row in X_test])`. Use the full-feature `X_test`.\n" +
          "**3)** Set `correct` to `preds_test == y_test`. This is True or False for each test row.\n" +
          "**4)** Left panel: call `axes[0].plot(range(1, 61), accuracy_per_epoch, marker=\"o\")`.\n" +
          "**5)** Left panel: set x label `epoch`, y label `training accuracy`, title `Learning curve`, with `set_xlabel`, `set_ylabel` and `set_title`.\n" +
          "**6)** Right panel: scatter `X2d_train[y_train == 1]` with `color=\"seagreen\"`, `alpha=0.4`, `label=\"train +\"`.\n" +
          "**7)** Right panel: scatter `X2d_train[y_train == -1]` with `color=\"crimson\"`, `alpha=0.4`, `label=\"train -\"`.\n" +
          "**8)** Right panel: scatter `X2d_test[correct]` with `color=\"royalblue\"`, `marker=\"o\"`, `label=\"test correct\"`.\n" +
          "**9)** Right panel: scatter `X2d_test[~correct]` with `color=\"black\"`, `marker=\"x\"`, `s=80`, `label=\"test wrong\"`.\n" +
          "**10)** Right panel: set x label `PCA component 1 (visualization only)`, y label `PCA component 2 (visualization only)`, and title `f\"Trained perceptron (test accuracy {test_acc:.0%})\"`, which gives `Trained perceptron (test accuracy 74%)`.\n" +
          "**11)** Call `axes[1].legend(fontsize=8)`, then `plt.tight_layout()`, then `plt.show()`.\n\n" +
          "To scatter an `(n, 2)` array of points, use `ax.scatter(*points.T)`. It is the same as `ax.scatter(points[:, 0], points[:, 1])`. \"Correct\" comes from the 22-feature `X_test`, but the dots are drawn at the 2D `X2d_test` positions. The 2D picture is only for looking at.\n" +
          "**Check:** the number of blue dots plus black crosses is 34. With the expected result, that is 25 blue circles and 9 black crosses. The learning curve starts at about 0.61 on epoch 1, rises to about 0.69 on epoch 2, and stays at about 0.706 from epoch 3 on. It stays flat and does not reach 1.0, because no straight line splits this data perfectly. The PCA chart can come out mirrored on some machines. That is harmless.",
      },
      {
        code: "axes[1].scatter(...)",
        text:
          "The right panel draws four groups, in this order: train positives (`seagreen`, `alpha=0.4`, `label=\"train +\"`), train negatives (`crimson`, `alpha=0.4`, `label=\"train -\"`), test correct (`royalblue`, `marker=\"o\"`, `label=\"test correct\"`), test wrong (`black`, `marker=\"x\"`, `s=80`, `label=\"test wrong\"`). Use `ax.scatter(*points.T)` for each group of 2D points.",
      },
    ],
  },
];
