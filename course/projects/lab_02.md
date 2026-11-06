# Project: Predicting Word Count from Sentence Length

## Goal
The question: **if all you know about a review sentence is how many characters it has, can you guess how many words it has? And is a fitted model really better than a lazy guess?**

You will use the prediction tools from this lab on 170 real review sentences. You will:

1. Make two lists of numbers from `sentences`: the characters in each sentence, and the words in each sentence.
2. Make a lazy guess (the *baseline*): always predict the average word count. Score it.
3. Fit a straight line to the data (characters -> words). Score it in the same way.
4. Print both scores in a fixed format.
5. Use the line to predict the word count of a new 60-character sentence.
6. Plot the points, the line and the baseline together.

Takeaway: before you trust a model, check that it beats a simple lazy guess. If it does not, the model has learned nothing.

## What you start with
Already in the notebook (run the loader cell first):
- `sentences`: a list of 170 review sentences, like `"i loved every minute of this film"`.
- `labels`: a list of 0s and 1s (negative or positive). You do not need it in this project.
- `plt`, the chart library (matplotlib), is already imported.

Your own exercise functions from this lab **must be defined and run first**. Run the exercise cell, or the solution cell if you are stuck. You will call these:
- `linear_regression_fit(x, y)`: gives back `(slope, intercept)` of the straight line `y = slope * x + intercept` that sits closest to the points. The *slope* is how much `y` goes up when `x` goes up by 1. The *intercept* is the value of `y` where `x` is 0. Small check: `x=[1,2,3,4,5]`, `y=[2,4,6,8,10]` gives `(2.0, 0.0)`.
- `predict(x, slope, intercept)`: gives back `slope * x + intercept` for **one** `x`. With slope 2.0 and intercept 0.0, `predict(6, 2.0, 0.0)` is `12.0`.
- `mean_squared_error(y_true, y_pred)`: scores the predictions. For each sentence it takes (true value - predicted value), squares it, then averages over all sentences. Lower is better, and 0 is perfect. Example: true values `[2, 4]` and predictions `[3, 3]` give gaps `-1` and `1`, squares `1` and `1`, and an average of `1.0`. `mean_squared_error([1, 2, 3], [1, 2, 3])` is `0`.
- `most_common_label` is also in the lab, but this project does not use it.

This project needs no new functions.

## Steps

### Step 1: Build `char_lengths` and `word_count_values`
Code shape:
```python
char_lengths = [float(...) for sentence in sentences]
word_count_values = [float(...) for sentence in sentences]
```
You get `sentences`, a list of 170 review strings, like `"i loved every minute of this film"` (33 characters, 7 words). Write the code that does these steps:

1. Set `char_lengths` to a list with `float(len(sentence))` for each sentence. Spaces count as characters.
2. Set `word_count_values` to a list with `float(len(sentence.split()))` for each sentence.

Both lists keep the order of `sentences`. For the example sentence, the entries are `33.0` and `7.0`.

**Check:** both lists have 170 entries. `char_lengths` goes from `32.0` to `68.0`, and `word_count_values` goes from `6.0` to `12.0`. The third sentence in the file has 9 words, so `word_count_values[2] == 9.0`.

### Step 2: The lazy baseline
Code shape:
```python
mean_baseline = ...
baseline_preds = ...
baseline_mse = ...
```
The baseline ignores the sentence and always predicts the average word count. Write the code that does these steps, with these exact names:

1. Set `mean_baseline` to `sum(word_count_values) / len(word_count_values)`.
2. Set `baseline_preds` to `[mean_baseline] * len(word_count_values)`. That is 170 copies.
3. Set `baseline_mse` to `mean_squared_error(word_count_values, baseline_preds)`.

**Check:** `mean_baseline` is about `8.6588`, `len(baseline_preds) == 170`, and `baseline_mse` is about `1.589`.

### Step 3: The straight-line model
Code shape:
```python
slope, intercept = ...
regression_preds = [... for x in char_lengths]
regression_mse = ...
```
Write the code that does these steps:

1. Set `slope, intercept` to `linear_regression_fit(char_lengths, word_count_values)`. The order matters: characters (x) first, words (y) second.
2. Set `regression_preds` to a list with `predict(x, slope, intercept)` for each `x` in `char_lengths`.
3. Set `regression_mse` to `mean_squared_error(word_count_values, regression_preds)`.

**Check:** `slope` is about `0.108`, `intercept` is about `3.380`, `len(regression_preds) == 170`, and `regression_mse` is about `1.143`. It must be **lower** than `baseline_mse`.

### Step 4: Print the two result lines
Code shape:
```python
print(f"Naive baseline (always predict mean={...:.2f}): MSE={...:.3f}")
print(f"Linear regression (word_count = {...:.3f} * char_len + {...:.3f}): MSE={...:.3f}")
```
Print exactly two lines, with the values your code worked out (do not type the numbers in):

```
Naive baseline (always predict mean=8.66): MSE=1.589
Linear regression (word_count = 0.108 * char_len + 3.380): MSE=1.143
```

Write the code that does these steps:

1. Print the first line with `mean_baseline` as `:.2f` and `baseline_mse` as `:.3f`.
2. Print the second line with `slope`, `intercept` and `regression_mse`, each as `:.3f`.

**Check:** your output matches the two lines above exactly. There is no randomness, so it must.

### Step 5: Predict for a new sentence
Code shape:
```python
new_sentence_len = 60.0
print()
print(f"Predicted word count for a {...}-character sentence: {...:.1f}")
```
Write the code that does these steps:

1. Set `new_sentence_len = 60.0`.
2. Call `print()` with nothing inside, to print an empty line.
3. Print `Predicted word count for a 60-character sentence: <value>`. Use `int(new_sentence_len)` for the 60, so it does not print `60.0`.
4. The value is `predict(new_sentence_len, slope, intercept)`, shown with `:.1f`.

**Check:** `0.108 * 60 + 3.380` is about 9.87, so the line says `Predicted word count for a 60-character sentence: 9.9`.

### Step 6: Plot everything in one figure
Code shape:
```python
plt.figure(...)
plt.scatter(...)
xs = ...
ys = [... for x in xs]
plt.plot(xs, ys, ...)
plt.axhline(...)
# then: xlabel, ylabel, title, legend, tight_layout, show
```
Write the code that does these steps:

1. Call `plt.figure(figsize=(8, 6))`.
2. Call `plt.scatter(char_lengths, word_count_values, alpha=0.6, label="real sentences")`.
3. Set `xs` to `sorted(char_lengths)`. Sorting keeps the line from zig-zagging.
4. Set `ys` to `predict(x, slope, intercept)` for each `x` in `xs`.
5. Call `plt.plot(xs, ys, color="crimson", label="regression fit")`.
6. Call `plt.axhline(mean_baseline, color="gray", linestyle="--", label="naive mean baseline")`.
7. Call `plt.xlabel("sentence length (characters)")`, `plt.ylabel("word count")` and `plt.title("Predicting word count from character length")`.
8. Call `plt.legend()`, then `plt.tight_layout()`, then `plt.show()`.

**Check:** you see a cloud of dots that rises from lower left to upper right. A straight red line goes through it. A dashed gray line runs flat across the chart and crosses the red line near the middle. The key has three entries.
