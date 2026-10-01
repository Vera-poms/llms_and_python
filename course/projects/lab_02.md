# Project: Predicting Word Count from Sentence Length

## Goal
Use the simple prediction tools from this lab on real data: predict how many words a review sentence has from how many characters it has. You will compare a naive baseline (always predict the average) against your least-squares regression line, score both with mean squared error, and plot everything. The point is the habit of checking that a fitted model actually beats a trivial baseline before trusting it.

## What you start with
Already in the kernel (run the loader cell first):
- `sentences`: `list[str]`, 170 review sentences.
- `labels`: `list[int]` (0/1 sentiment). Not needed in this project.
- `plt` (matplotlib.pyplot), imported in the setup cell.

Your own exercise functions from this lab MUST be defined and run (exercise or solution cell) before your project cell:
- `most_common_label(labels: list[int]) -> int`
- `linear_regression_fit(x: list[float], y: list[float]) -> tuple[float, float]` (returns `(slope, intercept)`)
- `predict(x: float, slope: float, intercept: float) -> float`
- `mean_squared_error(y_true: list[float], y_pred: list[float]) -> float`

This project needs no new functions; use the four above (only the last three are actually used).

## Requirements
1. Build two parallel lists of floats, one entry per sentence, in the same order as `sentences`:
   - `char_lengths`: the number of characters in the sentence (`len` of the string).
   - `word_count_values`: the number of words in the sentence, counted by splitting on whitespace.
2. Naive baseline: compute `mean_baseline`, the average of `word_count_values`. Create `baseline_preds`, a list containing that same mean repeated once per sentence. Compute `baseline_mse` with `mean_squared_error(word_count_values, baseline_preds)`.
3. Regression: with `linear_regression_fit(char_lengths, word_count_values)` get `slope, intercept` (x = characters, y = words). Build `regression_preds` by applying `predict` to every character length. Compute `regression_mse` against `word_count_values`.
4. Print two lines:
   - `Naive baseline (always predict mean=<mean, 2 decimals>): MSE=<baseline mse, 3 decimals>`
   - `Linear regression (word_count = <slope, 3 dec> * char_len + <intercept, 3 dec>): MSE=<regression mse, 3 dec>`
5. Print a blank line, then predict for a new sentence of length `new_sentence_len = 60.0` characters and print: `Predicted word count for a 60-character sentence: <value, 1 decimal>` (the 60 comes from the variable, shown as an int).
6. Plot (single figure, `plt.figure(figsize=(8, 6))`):
   - scatter of `char_lengths` (x) vs `word_count_values` (y), `alpha=0.6`, label `"real sentences"`
   - the regression line in `"crimson"`, label `"regression fit"`, drawn over the x values sorted ascending
   - a horizontal dashed gray line at the baseline mean, label `"naive mean baseline"`
   - x label `sentence length (characters)`, y label `word count`, title `Predicting word count from character length`
   - `plt.legend()`, `plt.tight_layout()`, `plt.show()`

## Expected output
- Two printed lines. The mean word count is about 8.66 (deterministic). The regression MSE must be **lower** than the baseline MSE, because sentence length in characters strongly tracks word count. The slope is small and positive (about 0.108 words per character) with an intercept of about 3.4.
- One prediction line for a 60-character sentence, about 9.9 words.
- A scatter cloud rising left to right, a red upward line through it, and a flat dashed gray line crossing it.
- All of the above is deterministic (no randomness).

## Hints on approach
- Words by whitespace: the string method `split()` with no arguments does it.
- The baseline "model" is a constant, so its prediction list is the same number repeated.
- Evaluate both models with the same metric on the same targets so the comparison is fair.
- Plot reminders: `plt.scatter(x, y, alpha=..., label=...)`, `plt.plot(xs, ys, color=..., label=...)`, `plt.axhline(y, linestyle="--")`.

## How you'll be graded
The grader checks behaviour rather than formatting. These must hold:
1. Features and targets are correct: x = character length, y = whitespace-split word count, as floats, for all 170 sentences.
2. The baseline is the constant mean of the word counts and its MSE is computed with `mean_squared_error`.
3. The regression uses `linear_regression_fit` / `predict` with x = chars and y = words (not reversed), and its MSE is lower than the baseline's.
4. The printed lines report the mean, both MSEs, the slope and intercept, and the prediction for 60 characters.
5. The plot has the scatter, the regression line, the dashed baseline line, axis labels, title and legend.
