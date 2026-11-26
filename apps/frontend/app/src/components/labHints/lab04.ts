import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 4 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab04Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: 'raise NotImplementedError("Perceptron.activation()',
    hints: [
      {
        code: "class Perceptron:",
        text: "A perceptron is a tiny decision maker. It takes a few numbers, mixes them into one score, and answers `+1` or `-1`. The **weights** are one number for each input, saying how much it matters. The **bias** is one extra number added to the score every time.",
      },
      {
        code: "def __init__(self, n_features: int):",
        block: "function",
        text: "Already written for you. It sets up the settings: one weight per input, all `0`, and a bias of `0.0`. Example: `Perceptron(2)` has weights `[0, 0]` and bias `0.0`.",
      },
      {
        code: "self.weights = np.zeros(n_features)",
        text: "One weight for each input, all starting at `0`.",
      },
      {
        code: "self.bias = 0.0",
        text: "The extra number added to the score every time. It starts at `0.0`.",
      },
      {
        code: "def net_input(self, x: np.ndarray) -> float:",
        block: "function",
        text: "Already written for you. It works out the score `z = x[0]*w[0] + x[1]*w[1] + ... + bias` and gives it back as a float. The input `x` is a numpy array, like `np.array([1.0, 0.0])`.",
      },
      {
        code: "return float(np.dot(x, self.weights) + self.bias)",
        text: "Multiplies each input by its weight, adds them up, then adds the bias.",
      },
      {
        code: "def activation(self, z: float) -> int:",
        block: "function",
        text:
          "Turns a score into a class label. You get `z`, the score from `net_input` (a `float`). You give back `1` if `z` is 0 or more, otherwise `-1`. It is always an int, never 0. " +
          "Example: `activation(0.3)` gives `1`, `activation(-0.3)` gives `-1`, `activation(0.0)` gives `1`.",
      },
      {
        code: 'raise NotImplementedError("Perceptron.activation()',
        text:
          "Your turn: replace this line with your code. Write it in this shape (replace each `...`):\n" +
          "`def activation(self, z):` is already there. Inside it write `if ...:` with `return 1` under it, then `return ...` as the last line.\n\n" +
          "**1)** If `z >= 0`, return the integer `1`.\n" +
          "**2)** Otherwise return the integer `-1`.\n\n" +
          "Exactly `0` counts as `+1`.\n" +
          "**Check:** `activation(0.3)` is `1`, `activation(-0.3)` is `-1`, `activation(0.0)` is `1`.",
      },
      {
        code: "def predict(self, x: np.ndarray) -> int:",
        block: "function",
        text:
          "Says `+1` or `-1` for one example. You get `x`, a numpy array with the features of ONE example, like `np.array([1.0, 0.0])`. You give back `1` or `-1`. " +
          "Example: with weights `[1.0, -1.0]` and bias `0.5`, `predict(np.array([1.0, 0.0]))` gives `1` (score 1.5) and `predict(np.array([0.0, 2.0]))` gives `-1` (score -1.5).",
      },
      {
        code: 'raise NotImplementedError("Perceptron.predict()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`z = ...` then `return ...`.\n\n" +
          "**1)** Set `z` to `self.net_input(x)`.\n" +
          "**2)** Return `self.activation(z)`.\n\n" +
          "Do not write the dot product again.\n" +
          "**Check:** with `weights = [1.0, -1.0]` and `bias = 0.5`:\n" +
          "`x = [1.0, 0.0]`: score = `1*1 + (-1)*0 + 0.5 = 1.5`. That is `>= 0`, so the answer is `1`.\n" +
          "`x = [0.0, 2.0]`: score = `1*0 + (-1)*2 + 0.5 = -1.5`. That is below 0, so the answer is `-1`.\n" +
          "A brand-new `Perceptron(2)` has all weights 0 and bias 0. Every score is `0.0`, so it answers `1` for every input.",
      },
      {
        code: "p = Perceptron(n_features=2)",
        text: "Makes a perceptron that takes 2 inputs.",
      },
      {
        code: "p.weights = np.array([1.0, -1.0])",
        text: "Sets the two weights for the test: `1.0` and `-1.0`.",
      },
      {
        code: "p.bias = 0.5",
        text: "Sets the bias for the test to `0.5`.",
      },
      {
        code: "assert p.activation(0.3) == 1",
        text: "A self-check. A score of `0.3` is above 0, so **your** `activation` must give `1`. If not, the check stops and shows what your code gave back.",
      },
      {
        code: "assert p.activation(-0.3) == -1",
        text: "A score of `-0.3` is below 0, so `activation` must give `-1`.",
      },
      {
        code: "assert p.predict(np.array([1.0, 0.0])) == 1",
        text: "The score is `1*1 + (-1)*0 + 0.5 = 1.5`, which is `>= 0`, so `predict` must give `1`.",
      },
      {
        code: "assert p.predict(np.array([0.0, 2.0])) == -1",
        text: "The score is `1*0 + (-1)*2 + 0.5 = -1.5`, which is below 0, so `predict` must give `-1`.",
      },
      {
        code: "print(\"All checks passed.\")",
        text: "Only reached when every check above passed.",
      },
    ],
  },
];
