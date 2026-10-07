# Project: Predicting Word Count from Sentence Length

## Goal
The question you are answering: **if all you know about a review sentence is how many characters it has, can you guess how many words it has, and is a fitted model really better than a lazy guess?**

You will use the prediction tools from this lab on real data (170 review sentences). You will:

1. Build two lists of numbers from `sentences`: characters per sentence and words per sentence.
2. Make a lazy baseline: always predict the average word count. Score it.
3. Fit a least-squares regression line (characters -> words). Score it with the same metric.
4. Print both scores in a fixed format.
5. Use the line to predict the word count of a new 60-character sentence.
6. Plot the points, the regression line and the baseline together.

Takeaway: before you trust a model, check that it beats a trivial baseline. If it does not, the model has learned nothing.

## Words you will see
- **Feature (`x`) and target (`y`)**: the feature is what you know (characters in a sentence). The target is what you want to predict (words in that sentence).
- **Parallel lists**: two lists of the same length where position `i` in both describes the same sentence. `char_lengths[5]` and `word_count_values[5]` belong to `sentences[5]`.
- **Characters vs words**: `len("i loved")` is 7 characters (letters and the space all count). `"i loved".split()` is `["i", "loved"]`, which has 2 words.
- **`str.split()`**: with no argument it cuts a string at any run of whitespace and returns a list of the pieces. Count the pieces with `len(...)`.
- **Baseline**: a trivial model used as a yardstick. Here it ignores the sentence and always predicts the mean (average) word count.
- **Linear regression / least squares**: finding the straight line `y = slope * x + intercept` that sits closest to all points. The *slope* is how many extra words each extra character adds on average. The *intercept* is the prediction at 0 characters (just where the line starts).
- **Prediction**: the value the model says `y` should be for a given `x`.
- **Mean squared error (MSE)**: for each sentence, take (true - predicted), square it, then average over all sentences. Lower is better, 0 is perfect. Example: truths `[2, 4]`, predictions `[3, 3]` gives errors `-1` and `1`, squares `1` and `1`, average `1.0`. Squaring makes big misses count extra and removes the sign.
- **Deterministic**: no randomness, so you get the same numbers every run.
- **matplotlib / `plt`**: the plotting library. You will use these calls:
  - `plt.scatter(x, y, alpha=..., label=...)`: one dot per `(x, y)`. `alpha` is transparency (0 invisible, 1 solid).
  - `plt.plot(xs, ys, color=..., label=...)`: a line through the points in the order given.
  - `plt.axhline(y, ...)`: a horizontal line across the whole plot at height `y`. `linestyle="--"` makes it dashed.
  - `plt.legend()`: shows a key built from every `label=`.
- **f-string format codes**: `{x:.2f}` shows `x` with 2 decimals. `{x:.3f}` is 3 decimals. `{x:.1f}` is 1 decimal.

## What you start with
Already in the kernel (run the loader cell first):
- `sentences`: `list[str]`, 170 review sentences, e.g. `"i loved every minute of this film"`.
- `labels`: `list[int]` (0/1 sentiment). Not needed in this project.
- `plt` (matplotlib.pyplot), imported in the setup cell.

Your own exercise functions from this lab **must be defined and run first** (run the exercise cell, or the solution cell if you are stuck). You will call:
- `linear_regression_fit(x: list[float], y: list[float]) -> tuple[float, float]`: returns `(slope, intercept)` of the best-fit line. Toy check: `x=[1,2,3,4,5]`, `y=[2,4,6,8,10]` gives `(2.0, 0.0)`.
- `predict(x: float, slope: float, intercept: float) -> float`: returns `slope * x + intercept` for **one** `x`. With slope 2.0 and intercept 0.0, `predict(6, 2.0, 0.0)` is `12.0`.
- `mean_squared_error(y_true: list[float], y_pred: list[float]) -> float`: the MSE described above. `mean_squared_error([1, 2, 3], [1, 2, 3])` is `0`.
- `most_common_label` is also in the lab, but this project does not use it.

This project needs no new functions.

## Steps

### Step 1: Build `char_lengths` and `word_count_values`
Make two lists of **floats**, one entry per sentence, in the same order as `sentences`:
- `char_lengths`: the number of characters in each sentence, `len(sentence)`.
- `word_count_values`: the number of words in each sentence, `len(sentence.split())`.

Why floats: your regression and MSE functions are written for numbers like `33.0`. Wrap each value in `float(...)`.

Worked example: the sentence `"i loved every minute of this film"` has 33 characters (spaces count) and 7 words. So its entries are `33.0` and `7.0`.

**Check:** both lists have length 170. `char_lengths` ranges from `32.0` to `68.0`, and `word_count_values` ranges from `6.0` to `12.0`. The third sentence in the file has 9 words, so `word_count_values[2] == 9.0`.

### Step 2: The naive baseline
Compute, in this order, with these exact names:
1. `mean_baseline`: the average of `word_count_values`. That is `sum(...) / len(...)`. It is one float.
2. `baseline_preds`: a list holding `mean_baseline` repeated once per sentence (170 copies). `[m] * n` builds a list of `n` copies of `m`.
3. `baseline_mse = mean_squared_error(word_count_values, baseline_preds)`.

Why: the baseline is the score to beat. It says "what error do I get if I use no information about the sentence at all?"

Worked example: for the 7-word sentence above, the baseline predicts 8.66, so its squared error there is (7 - 8.66)^2, about 2.75.

**Check:** `mean_baseline` is about `8.6588`, `len(baseline_preds) == 170`, and `baseline_mse` is about `1.589`.

### Step 3: The regression
1. `slope, intercept = linear_regression_fit(char_lengths, word_count_values)`. **Order matters**: x = characters first, y = words second. Reversing them would predict characters from words, which is a different line.
2. `regression_preds`: a list with one prediction per sentence, made by calling `predict(x, slope, intercept)` for every `x` in `char_lengths`. `predict` takes one number at a time, so you need a loop or a list comprehension.
3. `regression_mse = mean_squared_error(word_count_values, regression_preds)`. Use the same `y_true` as in step 2, so the comparison is fair.

Worked example: for the 33-character sentence, the line predicts about `0.108 * 33 + 3.380 = 6.95` words. The true value is 7, so the squared error is almost 0. The baseline's error there was 2.75.

**Check:** `slope` is about `0.108`, `intercept` about `3.380`, `len(regression_preds) == 170`, and `regression_mse` is about `1.143`. It must be **lower** than `baseline_mse`.

### Step 4: Print the two result lines
Print exactly two lines, filling in the computed values:

`Naive baseline (always predict mean=<mean, 2 decimals>): MSE=<baseline mse, 3 decimals>`
`Linear regression (word_count = <slope, 3 dec> * char_len + <intercept, 3 dec>): MSE=<regression mse, 3 dec>`

With the real data they look like:
```
Naive baseline (always predict mean=8.66): MSE=1.589
Linear regression (word_count = 0.108 * char_len + 3.380): MSE=1.143
```
Use f-strings with `:.2f` for the mean and `:.3f` for the other numbers. Do not type the numbers in by hand.

**Check:** your output matches the two lines above character for character (since there is no randomness).

### Step 5: Predict for a new sentence
1. Set `new_sentence_len = 60.0` (a variable, so you can change it later).
2. Print a blank line, then:
   `Predicted word count for a 60-character sentence: <value, 1 decimal>`
3. The value is `predict(new_sentence_len, slope, intercept)`, shown with `:.1f`. The `60` in the text must come from the variable and be shown as an int, so use `int(new_sentence_len)` (otherwise it would print `60.0`).

**Check:** `0.108 * 60 + 3.380` is about 9.87, so the line reads `Predicted word count for a 60-character sentence: 9.9`.

### Step 6: Plot everything in one figure
In this order:
1. `plt.figure(figsize=(8, 6))`: a new 8-by-6-inch figure.
2. `plt.scatter(char_lengths, word_count_values, alpha=0.6, label="real sentences")`: the 170 data points. Several sentences share the same (chars, words) pair, so `alpha=0.6` helps overlapping dots look darker.
3. The regression line in `"crimson"`, label `"regression fit"`. Make `xs = sorted(char_lengths)` (the x values from smallest to largest). Draw `plt.plot(xs, ys, color="crimson", label="regression fit")` where `ys` is `predict(x, slope, intercept)` for each `x` in `xs`. Sorting matters: `plt.plot` joins points in the order given, so unsorted x values would zig-zag.
4. The baseline: `plt.axhline(mean_baseline, color="gray", linestyle="--", label="naive mean baseline")`. This is a flat, dashed gray line at height 8.66.
5. `plt.xlabel("sentence length (characters)")`, `plt.ylabel("word count")`, `plt.title("Predicting word count from character length")`.
6. `plt.legend()`, then `plt.tight_layout()`, then `plt.show()`.

**Check:** you see a cloud of dots rising from lower left to upper right, a straight red line through it, a dashed gray horizontal line crossing the red line near the middle, and a legend with three entries.

## What a correct result looks like
Everything here is **deterministic**.
```
Naive baseline (always predict mean=8.66): MSE=1.589
Linear regression (word_count = 0.108 * char_len + 3.380): MSE=1.143

Predicted word count for a 60-character sentence: 9.9
```
- The regression MSE is lower than the baseline MSE. Longer sentences in characters tend to have more words, so using that information helps.
- The slope is small and positive: about 0.108 extra words for each extra character (roughly one word per 9 characters).
- The chart is a rising scatter cloud, a crimson upward line, and a flat dashed gray line.
- The numbers do not drop to zero. Words vary in length, so characters only predict word count roughly.

## How you'll be graded
The grader checks behaviour rather than formatting. These must hold:
1. Features and targets are correct: x = character length, y = whitespace-split word count, as floats, for all 170 sentences.
2. The baseline is the constant mean of the word counts and its MSE is computed with `mean_squared_error`.
3. The regression uses `linear_regression_fit` / `predict` with x = chars and y = words (not reversed), and its MSE is lower than the baseline's.
4. The printed lines report the mean, both MSEs, the slope and intercept, and the prediction for 60 characters.
5. The plot has the scatter, the regression line, the dashed baseline line, axis labels, title and legend.
