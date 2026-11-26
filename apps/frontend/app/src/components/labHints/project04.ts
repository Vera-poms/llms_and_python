import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 4 project starter. `match` picks the cell (a piece of its starter code).
export const project04Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def plot_boundary(X2d, y, model, title):",
    hints: [
      {
        code: "MIN_WORD_COUNT = ...",
        text:
          "**Step 1: Constants**\n" +
          "Two numbers that decide which words are kept for the vocabulary. `MIN_WORD_COUNT` is how few sentences a word may appear in. `MIN_POLARITY_RATIO` is how one-sided a word must be (0 to 1).\n" +
          "**1)** Define `MIN_WORD_COUNT = 3` and `MIN_POLARITY_RATIO = 0.7`.",
      },
      {
        code: "y = np.array([... for l in labels])",
        text:
          "**Step 2: Labels as -1 / +1 (`y`)**\n" +
          "You get `labels`, a list of 0s and 1s, like `[1, 0, 1]`. The perceptron wants -1 and +1 instead.\n" +
          "**1)** Make a list with `1 if l == 1 else -1` for each `l` in `labels`.\n" +
          "**2)** Set `y` to `np.array(...)` of that list. For the example you get `array([ 1, -1,  1])`.\n" +
          "**Check:** `y.shape == (170,)`, `(y == 1).sum() == 85`, `(y == -1).sum() == 85`.",
      },
      {
        code: "def tok(sentence):",
        block: "function",
        text:
          "**Step 3: `tok(sentence: str) -> list[str]`**\n" +
          "You get one sentence. You give back its words as a list, repeats included.\n" +
          "**1)** Make the sentence lowercase.\n" +
          "**2)** Call `re.findall` with the pattern `[a-z]+` on it.\n" +
          "**3)** Return the list. Digits, spaces and punctuation are dropped.\n" +
          "Example: `tok(\"The movie was great, the plot too!\")` gives `['the', 'movie', 'was', 'great', 'the', 'plot', 'too']`.\n" +
          "**Check:** `tok(\"i loved every minute of this film\")` has 7 items and starts with `'i', 'loved'`.",
      },
      {
        code: "def build_vocab(sentences, y):",
        block: "function",
        text:
          "**Step 4: `build_vocab(sentences: list[str], y: np.ndarray) -> list[str]`**\n" +
          "You give back the words that lean strongly toward positive or negative sentences, most frequent first. Do it in three parts (4a, 4b, 4c). Hover over the lines inside for each part.\n" +
          "**Check:** `len(vocab) == 22`. The first word is `felt` (total 7), the second is `fell` (total 5), and all 22 words are strings.",
      },
      {
        code: "pos_counts, neg_counts = {}, {}",
        text:
          "**4a. Count sentences per class.**\n" +
          "`pos_counts` and `neg_counts` map each word to how many positive (or negative) sentences it appears in.\n" +
          "**1)** Loop over `zip(sentences, y)`.\n" +
          "**2)** For each word in `set(tok(sentence))`, add 1 to `pos_counts[word]` if `label` is `+1`. Otherwise add 1 to `neg_counts[word]`. The `set` makes a word count once per sentence.\n" +
          "**3)** Use `d.get(word, 0)` to start a new word from 0.",
      },
      {
        code: "pos = ...",
        text:
          "**4b. Filter.** For each word in `set(pos_counts) | set(neg_counts)`:\n" +
          "**1)** Set `pos` to `pos_counts.get(word, 0)`, `neg` to `neg_counts.get(word, 0)`, and `total = pos + neg`.\n" +
          "**2)** If `total < MIN_WORD_COUNT`, `continue`.\n" +
          "**3)** If `abs(pos - neg) / total < MIN_POLARITY_RATIO`, `continue`.\n" +
          "**4)** Otherwise add `(word, total)` to `pairs`.\n\n" +
          "Worked examples from the real data:\n" +
          "- `the`: `pos = 55`, `neg = 56`, `total = 111`. Ratio `abs(55 - 56) / 111 = 0.009`, below 0.7, so skipped.\n" +
          "- `great`: `pos = 3`, `neg = 0`, `total = 3`. The total is not below 3, and the ratio is `3 / 3 = 1.0`, so **kept**.\n" +
          "- `felt`: `pos = 1`, `neg = 6`, `total = 7`. The ratio is `5 / 7 = 0.714`, at least 0.7, so **kept**.\n" +
          "- `bad`: `pos = 0`, `neg = 1`, `total = 1`. The total is below 3, so skipped even though the ratio is 1.0.",
      },
      {
        code: "pairs = sorted(pairs, key=..., reverse=True)",
        text:
          "**4c. Sort and give back.**\n" +
          "**1)** Sort `pairs` with `sorted(pairs, key=lambda p: p[1], reverse=True)`.\n" +
          "**2)** Return a list of only the words.\n" +
          "Words with the same `total` may come out in a different order each run. That is fine.",
      },
      {
        code: "def vectorize(sentences, vocab):",
        block: "function",
        text:
          "**Step 5: `vectorize(sentences: list[str], vocab: list[str]) -> np.ndarray`**\n" +
          "You give back `X`, with one row per sentence and one column per vocabulary word. Entry `[i, j]` is `1.0` if `vocab[j]` is in `sentences[i]`, and `0.0` if not. With `vocab = ['felt', 'flat', 'great']`, the sentence `\"the characters felt flat and the dialogue was awkward\"` becomes the row `[1.0, 1.0, 0.0]`.\n" +
          "**1)** Make `column`, a dict of each word to its column number, from `enumerate(vocab)`. Do it once, before the loop.\n" +
          "**2)** Set `X` to `np.zeros((len(sentences), len(vocab)))`.\n" +
          "**3)** For each sentence `i`, loop over `set(tok(sentence))`.\n" +
          "**4)** If the word is in `column`, set `X[i, column[word]] = 1.0`.\n" +
          "**5)** Return `X`.\n" +
          "**Check:** `X.shape == (170, 22)`, `X.sum() == 78.0` (78 vocabulary hits in total), and only 0.0 and 1.0 appear. Many rows are all zeros: 100 of the 170 sentences have none of the 22 words. That is expected.",
      },
      {
        code: "def pca_2d(X):",
        block: "function",
        text:
          "**Step 6: `pca_2d(X: np.ndarray) -> np.ndarray`**\n" +
          "You get `X`, the grid from step 5. You give back the same rows described by just 2 numbers each, so they can be drawn. Do these steps in this order:\n" +
          "**1)** Set `centered` to `X - X.mean(axis=0)`.\n" +
          "**2)** Set `cov` to `np.cov(centered, rowvar=False)`. It has shape `(22, 22)`.\n" +
          "**3)** Set `eigenvalues, eigenvectors` to `np.linalg.eigh(cov)`. The eigenvalues come back smallest first, and eigenvector `i` is the **column** `eigenvectors[:, i]`.\n" +
          "**4)** Set `order` to `np.argsort(eigenvalues)[::-1]`. This lists the positions from the largest eigenvalue to the smallest.\n" +
          "**5)** Set `top2` to `eigenvectors[:, order[:2]]`. It has shape `(22, 2)`.\n" +
          "**6)** Return `centered @ top2`. The shapes are `(170, 22) @ (22, 2) -> (170, 2)`.\n" +
          "**Check:** `X2d.shape == (170, 2)`, and `X2d.mean(axis=0)` is about `[0, 0]`. Rows with no vocabulary words are all the same, so they land on the exact same point and sit on top of each other in the chart.",
      },
      {
        code: "def plot_boundary(X2d, y, model, title):",
        block: "function",
        text:
          "**Step 7: `plot_boundary(X2d, y, model, title) -> None`**\n" +
          "You draw the points and the line where the perceptron's score `w0*x + w1*y + b` is 0.\n" +
          "**1)** Call `plt.figure(figsize=(7, 6))`.\n" +
          "**2)** Set `mask` to `(y == 1)`.\n" +
          "**3)** Draw the positive points with `plt.scatter(X2d[mask, 0], X2d[mask, 1], color=\"seagreen\", label=\"positive\", alpha=0.7)`.\n" +
          "**4)** Draw the negative points with `X2d[~mask, 0]` and `X2d[~mask, 1]`, `color=\"crimson\"`, `label=\"negative\"`, `alpha=0.7`.\n" +
          "**5)** Only if `abs(model.weights[1]) > 1e-9`, draw the line. If not, draw no line.\n" +
          "**6)** Inside the `if`, set `xs` to `np.linspace(min_x - 1, max_x + 1, 100)`, where `min_x` and `max_x` are the smallest and biggest values of `X2d[:, 0]`.\n" +
          "**7)** Set `ys` to `-(model.weights[0] * xs + model.bias) / model.weights[1]`. Example: `w0 = 1, w1 = 2, b = 4` gives `y = -(x + 4) / 2`, so `y = -2` at `x = 0`.\n" +
          "**8)** Call `plt.plot(xs, ys, color=\"black\", linestyle=\"--\", label=\"decision boundary\")`.\n" +
          "**9)** Call `plt.xlabel(\"PCA component 1\")`, `plt.ylabel(\"PCA component 2\")` and `plt.title(title)`.\n" +
          "**10)** Call `plt.legend()`, `plt.tight_layout()` and `plt.show()`.\n" +
          "**Check:** with an untrained model, the legend lists only `positive` and `negative`. With a model whose weights you set by hand to `[1.0, 2.0]` and bias `4.0`, a dashed line appears.",
      },
      {
        code: "vocab = ...",
        text:
          "**Step 8: Run the pipeline and check the accuracy**\n" +
          "**1)** Set `vocab` to `build_vocab(sentences, y)`.\n" +
          "**2)** Set `X` to `vectorize(sentences, vocab)`.\n" +
          "**3)** Set `X2d` to `pca_2d(X)`.\n" +
          "**4)** Set `model` to `Perceptron(n_features=2)`. It has 2 weights (one per PCA column), not 22.\n" +
          "**5)** Set `preds` to `np.array([model.predict(row) for row in X2d])`.\n" +
          "**6)** Set `accuracy` to `(preds == y).mean()`. This is the fraction of guesses that match, like 0.75 for 3 right out of 4.\n" +
          "**Check:** `len(preds) == 170` and every prediction is `+1`. With `weights = [0, 0]` and `bias = 0.0`, every score is exactly 0, and `activation(0)` is +1. So 85 of the 170 are right.",
      },
      {
        code: "print(f\"Vocabulary size: {...}\")",
        text:
          "**Step 9: Print three lines**\n" +
          "Print exactly:\n" +
          "`Vocabulary size: 22`\n" +
          "`Untrained perceptron accuracy on real sentiment data: 50.00%`\n" +
          "`(Weights are all zero, so it predicts the same class for everything - see lab 5.)`\n" +
          "**1)** Print the first line with `{len(vocab)}`.\n" +
          "**2)** Print the second line with `{accuracy * 100:.2f}%`.\n" +
          "**3)** Print the third line as plain text.",
      },
      {
        code: "plot_boundary(..., ..., ..., \"...\")",
        text:
          "**Step 10: Draw the plot**\n" +
          "**1)** Call `plot_boundary(X2d, y, model, \"Untrained perceptron on real review sentiment\")`.\n" +
          "**Check:** one scatter chart with green and red points mixed together. Many dots sit on the same spot (the 100 sentences with all zeros). There is no dashed line, and the legend has two entries. The axis ranges are small (about -1.2 to 1.2). The PCA axes may flip sign between runs or machines, so the chart may look mirrored. That is harmless.",
      },
    ],
  },
];
