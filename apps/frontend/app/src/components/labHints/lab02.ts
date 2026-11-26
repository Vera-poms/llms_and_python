import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 2 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab02Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def most_common_label(",
    hints: [
      {
        code: "def most_common_label(",
        block: "function",
        text:
          "Makes a guess from how often each label shows up. You get a list of 0/1 labels, like `[1, 0, 1, 1, 0]`. " +
          "You give back the label that shows up most often, as an `int`: `1`. If two labels tie, the one that came first in the list wins " +
          "(`[1, 0]` gives `1`, `[0, 1]` gives `0`). Example: `most_common_label([1, 0, 1, 1, 0])` gives `1`.",
      },
      {
        code: "def linear_regression_fit(",
        block: "function",
        text:
          "Finds the straight line `y = slope * x + intercept` that sits closest to the points. You get two lists of numbers with the same length, " +
          "like `x = [0, 1, 2]` and `y = [1, 3, 5]`. You give back a pair `(slope, intercept)` for the best line: `(2.0, 1.0)`. " +
          "It uses the least-squares formulas: `slope = sum((x_i - x_mean) * (y_i - y_mean)) / sum((x_i - x_mean) ** 2)` and `intercept = y_mean - slope * x_mean`. " +
          "Example: `linear_regression_fit([1, 2, 3, 4, 5], [2, 4, 6, 8, 10])` gives `(2.0, 0.0)`.",
      },
      {
        code: "def predict(",
        block: "function",
        text:
          "Uses the line to predict `y` for one value of `x`. You get one number `x`, and the line's `slope` and `intercept`. " +
          "You give back the predicted `y` as a float: `slope * x + intercept`. Example: `predict(6, 2.0, 0.0)` gives `12.0`.",
      },
      {
        code: "def mean_squared_error(",
        block: "function",
        text:
          "Scores the predictions: the average of the squared gaps between real and predicted values. You get two lists of numbers with the same length: " +
          "the real values and the predictions, like `[2, 4]` and `[3, 3]`. You give back one float, the average of `(y_true_i - y_pred_i) ** 2`: `1.0`. " +
          "0 means every prediction was perfect. Lower is better. Example: `mean_squared_error([2, 4], [3, 3])` gives `1.0`.",
      },
      {
        code: "x_toy = [1, 2, 3, 4, 5]",
        text: "A tiny test: five `x` values.",
      },
      {
        code: "y_toy = [2, 4, 6, 8, 10]",
        text: "The matching `y` values. Every `y` is exactly twice its `x`, so a perfect line fits them.",
      },
      {
        code: "assert most_common_label([1, 0, 1, 1, 0]) == 1",
        text: "A self-check. `1` shows up three times and `0` twice, so the answer must be `1`. If it is not, the check stops and shows what your code gave back.",
      },
      {
        code: "slope, intercept = linear_regression_fit(x_toy, y_toy)",
        text: "Runs **your** `linear_regression_fit` on the toy points and keeps the slope and intercept.",
      },
      {
        code: "assert abs(slope - 2.0) < 1e-9",
        text: "Every `y` is twice `x`, so the slope must be `2.0`. The tiny `1e-9` allows for small rounding errors.",
      },
      {
        code: "assert abs(intercept - 0.0) < 1e-9",
        text: "The line goes through the start `(0, 0)`, so the intercept must be `0.0`.",
      },
      {
        code: "assert abs(predict(6, slope, intercept) - 12.0) < 1e-9",
        text: "With slope `2.0` and intercept `0.0`, the prediction for `x = 6` must be `12.0`.",
      },
      {
        code: "assert mean_squared_error([1, 2, 3], [1, 2, 3]) == 0",
        text: "Identical lists have no error, so the score must be `0`.",
      },
      {
        code: "print(\"All checks passed.\")",
        text: "Only reached when every check above passed. If one fails, it prints what it expected and what your code gave back.",
      },
      {
        code: 'raise NotImplementedError("most_common_label()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`counts = {}`, then `for label in labels:` and inside it `counts[label] = ... + 1`. After the loop, `return max(counts, key=...)`.\n\n" +
          "**1)** For each label, add 1 to `counts[label]`. Use `counts.get(label, 0)` so a new label starts from 0.\n" +
          "**2)** Return the label with the biggest count: `max(counts, key=lambda k: counts[k])`.\n\n" +
          "If two labels tie, the one that came first in the list wins (`[1, 0]` gives `1`, `[0, 1]` gives `0`).\n" +
          "**Check:** `[0, 0, 1]` has two 0s and one 1, so the answer is `0`.",
      },
      {
        code: 'raise NotImplementedError("linear_regression_fit()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`x_mean = ...`, `y_mean = ...`, `top = sum(... for xi, yi in zip(x, y))`, `bottom = sum(... for xi in x)`, `slope = ...`, `intercept = ...`, then `return slope, intercept`.\n\n" +
          "**1)** Set `x_mean` to `sum(x) / len(x)`, and `y_mean` to `sum(y) / len(y)`.\n" +
          "**2)** Set `top` to the sum of `(xi - x_mean) * (yi - y_mean)` over `zip(x, y)`.\n" +
          "**3)** Set `bottom` to the sum of `(xi - x_mean) ** 2` over `x`.\n" +
          "**4)** Set `slope = top / bottom`.\n" +
          "**5)** Set `intercept = y_mean - slope * x_mean`.\n" +
          "**6)** Return `slope, intercept`.\n\n" +
          "**Check:** `x = [0, 1, 2]`, `y = [1, 3, 5]`: `x_mean = 1`, `y_mean = 3`, top = `(-1)(-2) + (0)(0) + (1)(2) = 4`, bottom = `1 + 0 + 1 = 2`. " +
          "Slope = `4 / 2 = 2.0`, intercept = `3 - 2.0 * 1 = 1.0`. So the answer is `(2.0, 1.0)`. " +
          "Another: `x = [1, 2, 3]`, `y = [1, 3, 2]` gives `(0.5, 1.0)`.",
      },
      {
        code: 'raise NotImplementedError("predict()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`return ...`\n\n" +
          "**1)** Return `slope * x + intercept`.\n\n" +
          "**Check:** `predict(6, 2.0, 0.0)` is `12.0`, and `predict(10, 0.5, 1.0)` is `6.0`.",
      },
      {
        code: 'raise NotImplementedError("mean_squared_error()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`squares = [... for t, p in zip(y_true, y_pred)]`, then `return ...`\n\n" +
          "**1)** For each pair `t, p`, make `(t - p) ** 2` and put it in `squares`.\n" +
          "**2)** Return the sum of `squares` divided by `len(squares)`.\n\n" +
          "**Check:** `[2, 4]` vs `[3, 3]`: the gaps are `-1` and `1`, the squares are `1` and `1`, the average is `1.0`. " +
          "Also `[1, 2, 3]` vs `[2, 2, 5]`: the squares are `1, 0, 4`, the sum is 5, the average is `5/3`, about `1.667`.",
      },
    ],
  },
];
