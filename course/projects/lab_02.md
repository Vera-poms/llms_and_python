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
In prediction, the number you know (`x`) is the *feature*, and the number you want to guess (`y`) is the *target*. Here the feature is the characters in a sentence, and the target is the words in it.

Make two lists of **floats** (numbers like `33.0`). Each has one entry per sentence, in the same order as `sentences`. So position `i` in both lists is about `sentences[i]`.
- `char_lengths`: the number of characters in each sentence, `len(sentence)`. Spaces count as characters.
- `word_count_values`: the number of words in each sentence, `len(sentence.split())`. `sentence.split()` cuts the sentence at its spaces and gives a list of the words.

Why floats: your regression and error functions expect numbers like `33.0`. Wrap each value in `float(...)`.

Example: the sentence `"i loved every minute of this film"` has 33 characters and 7 words. So its entries are `33.0` and `7.0`.

**Check:** both lists have 170 entries. `char_lengths` goes from `32.0` to `68.0`, and `word_count_values` goes from `6.0` to `12.0`. The third sentence in the file has 9 words, so `word_count_values[2] == 9.0`.

### Step 2: The lazy baseline
Code shape:
```python
mean_baseline = ...
baseline_preds = ...
baseline_mse = ...
```
A *baseline* is a very simple guess that you compare your real model against. Here the baseline ignores the sentence and always predicts the average word count.

Work out these, in this order, with these exact names:
1. `mean_baseline`: the average of `word_count_values`. That is `sum(...) / len(...)`. It is one float.
2. `baseline_preds`: a list with `mean_baseline` repeated once for each sentence (170 copies). `[m] * n` makes a list of `n` copies of `m`.
3. `baseline_mse = mean_squared_error(word_count_values, baseline_preds)`.

Why: the baseline is the score to beat. It answers: "what error do I get if I use no information about the sentence at all?"

Example: for the 7-word sentence above, the baseline predicts 8.66. Its squared error there is (7 - 8.66)^2, about 2.75.

**Check:** `mean_baseline` is about `8.6588`, `len(baseline_preds) == 170`, and `baseline_mse` is about `1.589`.

### Step 3: The straight-line model
Code shape:
```python
slope, intercept = ...
regression_preds = [... for x in char_lengths]
regression_mse = ...
```
1. `slope, intercept = linear_regression_fit(char_lengths, word_count_values)`. **The order matters**: characters first (x), words second (y). If you swap them, you predict characters from words, which is a different line.
2. `regression_preds`: a list with one prediction for each sentence. Call `predict(x, slope, intercept)` for every `x` in `char_lengths`. `predict` takes one number at a time, so use a loop or a list comprehension.
3. `regression_mse = mean_squared_error(word_count_values, regression_preds)`. Use the same true values as in step 2, so the comparison is fair.

Example: for the 33-character sentence, the line predicts about `0.108 * 33 + 3.380 = 6.95` words. The true value is 7, so the squared error is almost 0. The baseline's error there was 2.75.

**Check:** `slope` is about `0.108`, `intercept` is about `3.380`, `len(regression_preds) == 170`, and `regression_mse` is about `1.143`. It must be **lower** than `baseline_mse`.

### Step 4: Print the two result lines
Code shape:
```python
print(f"Naive baseline (always predict mean={...:.2f}): MSE={...:.3f}")
print(f"Linear regression (word_count = {...:.3f} * char_len + {...:.3f}): MSE={...:.3f}")
```
Print exactly two lines, with the values your code worked out:

`Naive baseline (always predict mean=<mean, 2 decimals>): MSE=<baseline mse, 3 decimals>`
`Linear regression (word_count = <slope, 3 decimals> * char_len + <intercept, 3 decimals>): MSE=<regression mse, 3 decimals>`

With the real data they look like this:
```
Naive baseline (always predict mean=8.66): MSE=1.589
Linear regression (word_count = 0.108 * char_len + 3.380): MSE=1.143
```
Use f-strings. Inside the braces, `:.2f` shows 2 digits after the point, `:.3f` shows 3, and `:.1f` shows 1. Use `:.2f` for the mean and `:.3f` for the other numbers. Do not type the numbers in by hand.

**Check:** your output matches the two lines above exactly. There is no randomness, so it must.

### Step 5: Predict for a new sentence
Code shape:
```python
new_sentence_len = 60.0
print()
print(f"Predicted word count for a {...}-character sentence: {...:.1f}")
```
1. Set `new_sentence_len = 60.0` (a variable, so you can change it later).
2. Print an empty line, then:
   `Predicted word count for a 60-character sentence: <value, 1 decimal>`
3. The value is `predict(new_sentence_len, slope, intercept)`, shown with `:.1f`. The `60` in the text must come from the variable. Show it as a whole number with `int(new_sentence_len)`, or it would print `60.0`.

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
Do these in order:
1. `plt.figure(figsize=(8, 6))`: a new figure 8 inches wide and 6 tall.
2. `plt.scatter(char_lengths, word_count_values, alpha=0.6, label="real sentences")`: one dot for each sentence. Some sentences share the same (characters, words) pair. `alpha=0.6` makes the dots a bit see-through, so stacked dots look darker.
3. The straight line, in `"crimson"`, with the label `"regression fit"`. Make `xs = sorted(char_lengths)` (the x values from smallest to largest). Draw `plt.plot(xs, ys, color="crimson", label="regression fit")`, where `ys` is `predict(x, slope, intercept)` for each `x` in `xs`. Sorting matters: `plt.plot` joins the points in the order you give them, so unsorted x values would zig-zag.
4. The baseline: `plt.axhline(mean_baseline, color="gray", linestyle="--", label="naive mean baseline")`. This draws a flat, dashed gray line across the chart at height 8.66.
5. `plt.xlabel("sentence length (characters)")`, `plt.ylabel("word count")`, `plt.title("Predicting word count from character length")`.
6. `plt.legend()` (shows a key built from every `label=`), then `plt.tight_layout()`, then `plt.show()`.

**Check:** you see a cloud of dots that rises from lower left to upper right. A straight red line goes through it. A dashed gray line runs flat across the chart and crosses the red line near the middle. The key has three entries.
