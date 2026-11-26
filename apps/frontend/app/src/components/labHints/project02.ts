import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 2 project starter (course/projects/lab_02_starter.py).
export const project02Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "char_lengths = [float(",
    hints: [
      {
        code: "char_lengths = [float(...) for sentence in sentences]",
        text:
          "**Step 1: Build `char_lengths` and `word_count_values`**\n" +
          "`sentences` is a list of 170 review strings, like `\"i loved every minute of this film\"` (33 characters, 7 words). Write the code that does these steps:\n\n" +
          "**1)** Set `char_lengths` to a list with `float(len(sentence))` for each sentence. Spaces count as characters.\n" +
          "**2)** Set `word_count_values` to a list with `float(len(sentence.split()))` for each sentence.\n\n" +
          "Both lists keep the order of `sentences`. For the example sentence, the entries are `33.0` and `7.0`.\n" +
          "**Check:** both lists have 170 entries. `char_lengths` goes from `32.0` to `68.0`, and `word_count_values` goes from `6.0` to `12.0`. The third sentence in the file has 9 words, so `word_count_values[2] == 9.0`.",
      },
      {
        code: "word_count_values = [float(...) for sentence in sentences]",
        text: "`word_count_values` is the number of words in each sentence, as floats. Use `float(len(sentence.split()))`.",
      },
      {
        code: "mean_baseline = ...",
        text:
          "**Step 2: The lazy baseline**\n" +
          "The baseline ignores the sentence and always predicts the average word count. Write the code that does these steps, with these exact names:\n\n" +
          "**1)** Set `mean_baseline` to `sum(word_count_values) / len(word_count_values)`.\n" +
          "**2)** Set `baseline_preds` to `[mean_baseline] * len(word_count_values)`. That is 170 copies.\n" +
          "**3)** Set `baseline_mse` to `mean_squared_error(word_count_values, baseline_preds)`.\n\n" +
          "**Check:** `mean_baseline` is about `8.6588`, `len(baseline_preds) == 170`, and `baseline_mse` is about `1.589`.",
      },
      {
        code: "baseline_preds = ...",
        text: "`baseline_preds` is the lazy guess for every sentence: the same average, 170 times. Use `[mean_baseline] * len(word_count_values)`.",
      },
      {
        code: "baseline_mse = ...",
        text: "`baseline_mse` is the score of the lazy guess (lower is better, 0 is perfect). Use `mean_squared_error(word_count_values, baseline_preds)`: true values first, predictions second.",
      },
      {
        code: "slope, intercept = ...",
        text:
          "**Step 3: The straight-line model**\n" +
          "`slope` is how much the word count goes up when the characters go up by 1. `intercept` is the word count at 0 characters. Write the code that does these steps:\n\n" +
          "**1)** Set `slope, intercept` to `linear_regression_fit(char_lengths, word_count_values)`. The order matters: characters (x) first, words (y) second.\n" +
          "**2)** Set `regression_preds` to a list with `predict(x, slope, intercept)` for each `x` in `char_lengths`.\n" +
          "**3)** Set `regression_mse` to `mean_squared_error(word_count_values, regression_preds)`.\n\n" +
          "**Check:** `slope` is about `0.108`, `intercept` is about `3.380`, `len(regression_preds) == 170`, and `regression_mse` is about `1.143`. It must be **lower** than `baseline_mse`.",
      },
      {
        code: "regression_preds = [... for x in char_lengths]",
        text: "`regression_preds` is the line's guess for each sentence. Use `predict(x, slope, intercept)` for each `x`.",
      },
      {
        code: "regression_mse = ...",
        text: "`regression_mse` is the score of the line. Use `mean_squared_error(word_count_values, regression_preds)`. It must be lower than `baseline_mse`.",
      },
      {
        code: 'print(f"Naive baseline (always predict mean={...:.2f}): MSE={...:.3f}")',
        text:
          "**Step 4: Print the two result lines**\n" +
          "Print exactly two lines, with the values your code worked out (do not type the numbers in):\n\n" +
          "`Naive baseline (always predict mean=8.66): MSE=1.589`\n" +
          "`Linear regression (word_count = 0.108 * char_len + 3.380): MSE=1.143`\n\n" +
          "**1)** Print the first line with `mean_baseline` as `:.2f` and `baseline_mse` as `:.3f`.\n" +
          "**2)** Print the second line with `slope`, `intercept` and `regression_mse`, each as `:.3f`.\n\n" +
          "**Check:** your output matches the two lines above exactly. There is no randomness, so it must.",
      },
      {
        code: 'print(f"Linear regression (word_count = {...:.3f} * char_len + {...:.3f}): MSE={...:.3f}")',
        text: "The second result line. Fill the three holes with `slope`, `intercept` and `regression_mse`, in that order, each shown with 3 digits after the point.",
      },
      {
        code: "new_sentence_len = 60.0",
        text:
          "**Step 5: Predict for a new sentence**\n" +
          "Write the code that does these steps:\n\n" +
          "**1)** Set `new_sentence_len = 60.0`.\n" +
          "**2)** Call `print()` with nothing inside, to print an empty line.\n" +
          "**3)** Print `Predicted word count for a 60-character sentence: <value>`. Use `int(new_sentence_len)` for the 60, so it does not print `60.0`.\n" +
          "**4)** The value is `predict(new_sentence_len, slope, intercept)`, shown with `:.1f`.\n\n" +
          "**Check:** `0.108 * 60 + 3.380` is about 9.87, so the line says `Predicted word count for a 60-character sentence: 9.9`.",
      },
      {
        code: 'print(f"Predicted word count for a {...}-character sentence: {...:.1f}")',
        text: "First hole: `int(new_sentence_len)` (so it prints 60, not 60.0). Second hole: `predict(new_sentence_len, slope, intercept)`, shown with 1 digit after the point.",
      },
      {
        code: "plt.figure(...)",
        text:
          "**Step 6: Plot everything in one figure**\n" +
          "`xs` is the x positions for the line and `ys` is the line's value at each one. Write the code that does these steps:\n\n" +
          "**1)** Call `plt.figure(figsize=(8, 6))`.\n" +
          "**2)** Call `plt.scatter(char_lengths, word_count_values, alpha=0.6, label=\"real sentences\")`.\n" +
          "**3)** Set `xs` to `sorted(char_lengths)`. Sorting keeps the line from zig-zagging.\n" +
          "**4)** Set `ys` to `predict(x, slope, intercept)` for each `x` in `xs`.\n" +
          "**5)** Call `plt.plot(xs, ys, color=\"crimson\", label=\"regression fit\")`.\n" +
          "**6)** Call `plt.axhline(mean_baseline, color=\"gray\", linestyle=\"--\", label=\"naive mean baseline\")`.\n" +
          "**7)** Call `plt.xlabel(\"sentence length (characters)\")`, `plt.ylabel(\"word count\")` and `plt.title(\"Predicting word count from character length\")`.\n" +
          "**8)** Call `plt.legend()`, then `plt.tight_layout()`, then `plt.show()`.\n\n" +
          "**Check:** you see a cloud of dots that rises from lower left to upper right. A straight red line goes through it. A dashed gray line runs flat across the chart and crosses the red line near the middle. The key has three entries.",
      },
      {
        code: "xs = ...",
        text: "`xs` is the x positions for the line: `sorted(char_lengths)`. Sorting keeps the line from zig-zagging.",
      },
      {
        code: "ys = [... for x in xs]",
        text: "`ys` is the line's value at each `x` in `xs`. Use `predict(x, slope, intercept)`.",
      },
    ],
  },
];
