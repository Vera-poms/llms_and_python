# Project: An Untrained Perceptron on Real Review Sentiment

## Goal
Turn real, human-written review sentences into numeric vectors, feed them to the `Perceptron` you built in this lab, and measure how well it classifies sentiment before any training. Because all weights start at zero, the perceptron knows nothing, and the experiment shows exactly that: chance-level accuracy. You also build the text-to-vector pipeline (vocabulary selection, bag-of-words, 2D projection) that lab 5 will reuse.

## What you start with
Already in the kernel (run the loader cell first):
- `sentences`: `list[str]`, 170 review sentences. `labels`: `list[int]` of 0/1 (85 of each, a balanced set).
- `re`, `plt` (matplotlib.pyplot), `np` (numpy), imported in the setup cell.

Your own `Perceptron` class from this lab's exercise (or solution) cell MUST be defined and run before the project cell:
- `Perceptron(n_features: int)` with attributes `weights` (zeros), `bias` (0.0), and methods `net_input(x) -> float`, `activation(z) -> int` (+1 if z >= 0 else -1), `predict(x) -> int`.

## Requirements
1. Constants: `MIN_WORD_COUNT = 3` and `MIN_POLARITY_RATIO = 0.7`.
2. Convert labels to `y`, a numpy array where label 1 becomes `+1` and label 0 becomes `-1`.
3. Define `tok(sentence: str) -> list[str]`: lowercase the sentence and return the runs of letters a-z.
4. Define `build_vocab(sentences: list[str], y: np.ndarray) -> list[str]` that selects "sentiment-leaning" words:
   - For each sentence, take its **set** of distinct words (a word counts at most once per sentence) and tally document counts separately for positive (`y == 1`) and negative sentences.
   - For every word seen anywhere, let `pos` and `neg` be its document counts and `total = pos + neg`.
   - Skip the word if `total < MIN_WORD_COUNT`.
   - Skip the word if `abs(pos - neg) / total < MIN_POLARITY_RATIO` (keep only words that lean strongly to one side).
   - Return the kept words sorted by `total` descending (most frequent first).
5. Define `vectorize(sentences: list[str], vocab: list[str]) -> np.ndarray`: binary bag-of-words. Result shape `(len(sentences), len(vocab))`, entry 1.0 if the vocab word appears in the sentence, else 0.0 (presence, not counts).
6. Define `pca_2d(X: np.ndarray) -> np.ndarray` that projects to 2 dimensions with PCA computed by hand: center the columns by subtracting the column means, compute the covariance matrix of the features, get its eigenvectors with `np.linalg.eigh`, keep the two with the largest eigenvalues (largest first), and return the centered data multiplied by those two eigenvectors. Result shape `(n_samples, 2)`.
7. Define `plot_boundary(X2d, y, model, title) -> None` (figure size `(7, 6)`):
   - scatter positive points (y == 1) in `"seagreen"` labeled `positive`, negative points in `"crimson"` labeled `negative`, both `alpha=0.7`
   - if `abs(model.weights[1]) > 1e-9`, also draw the decision line `w0*x + w1*y + b = 0` solved for y, as a black dashed line labeled `decision boundary`, over 100 evenly spaced x values from `(min x - 1)` to `(max x + 1)`; if that weight is ~0 draw no line
   - axis labels `PCA component 1` / `PCA component 2`, the given title, legend, `tight_layout`, `show`
8. Run it: `vocab = build_vocab(sentences, y)`, `X = vectorize(sentences, vocab)`, `X2d = pca_2d(X)`. Create `model = Perceptron(n_features=2)` (untrained, operating on the 2D data), predict every row of `X2d`, and compute `accuracy` as the fraction of predictions equal to `y`.
9. Print three lines:
   - `Vocabulary size: <len(vocab)>`
   - `Untrained perceptron accuracy on real sentiment data: <accuracy as a percentage with 2 decimals>`
   - `(Weights are all zero, so it predicts the same class for everything - see lab 5.)`
10. Call `plot_boundary(X2d, y, model, "Untrained perceptron on real review sentiment")`.

## Expected output
- Vocabulary size is a deterministic number (a few dozen words) that depends on your thresholds being applied exactly as above.
- Accuracy is **exactly 50.00%**: with zero weights and zero bias every net input is 0, `activation(0)` is +1, so every sentence is predicted positive, and the dataset is balanced.
- One scatter plot with green and red points mixed together and **no** decision line (the second weight is zero).

## Hints on approach
- Count each word once per sentence by converting the token list to a `set` before tallying.
- Keep one dict for positive counts and one for negative counts; a word may appear in only one, so use `.get(word, 0)`.
- `np.cov(M, rowvar=False)` treats columns as variables. `np.argsort(values)[::-1]` gives indices largest first.
- The `@` operator is matrix multiplication.
- Line algebra: on the boundary, solve the equation for the vertical coordinate in terms of the horizontal one.

## How you'll be graded
The grader checks behaviour, not formatting. These must hold:
1. `build_vocab` uses document-level (per-sentence-set) counts, the `MIN_WORD_COUNT` and `MIN_POLARITY_RATIO` filters exactly as described, and sorts by total frequency descending.
2. `vectorize` produces a binary presence matrix of shape (170, len(vocab)).
3. `pca_2d` centers the data and projects onto the top-2 eigenvectors of the covariance matrix, giving shape (170, 2).
4. The untrained `Perceptron(n_features=2)` is evaluated on `X2d` against `y` in {-1, +1}, yielding 50.00% accuracy, and the vocabulary size and accuracy are printed.
5. `plot_boundary` colors the two classes and draws a boundary line only when the second weight is non-negligible.
