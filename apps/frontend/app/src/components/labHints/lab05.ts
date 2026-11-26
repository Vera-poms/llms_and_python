import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 5 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab05Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def train(",
    hints: [
      {
        code: "def train(",
        block: "function",
        text:
          "Teaches the perceptron by nudging its weights whenever it answers wrongly. You get a `Perceptron` called `model`, a numpy array `X` of shape `(n_examples, n_features)`, a numpy array `y` of `+1` / `-1` labels, the number of passes `epochs`, and the step size `learning_rate`. " +
          "The model is changed in place, so you do not give it back. You give back a `list[int]` of length `epochs`: the number of mistakes in each pass, like `[1, 0, 0]`. " +
          "Example: on the small data set below, starting from zero weights and `learning_rate` 0.1, `train(model, X_toy, y_toy, epochs=3)` gives `[1, 0, 0]`.",
      },
      {
        code: "X_toy = np.array(",
        text: "A tiny data set: 4 points with 2 features each. `X_toy.shape` is `(4, 2)`. The first two points are on the `+1` side and the last two are on the `-1` side.",
      },
      {
        code: "y_toy = np.array(",
        text: "The right label for each row of `X_toy`: `+1` for the first two points and `-1` for the last two.",
      },
      {
        code: "model = Perceptron(n_features=2)",
        text: "A fresh perceptron from the last lab. It starts with `weights = [0, 0]` and `bias = 0`, so it knows nothing yet.",
      },
      {
        code: "errors = train(model, X_toy, y_toy",
        text: "Runs **your** `train` for 10 passes with a step size of 0.1, and keeps the list of mistakes made in each pass.",
      },
      {
        code: "assert errors[-1] == 0",
        text: "A self-check. The last pass must make 0 mistakes, because the 4 points can be split by a line, so the perceptron has to learn it. If not, the check stops and shows this message.",
      },
      {
        code: "for xi, target in zip(X_toy, y_toy):",
        text: "Goes through each training point with its right label.",
      },
      {
        code: "assert model.predict(xi) == target",
        text: "A self-check. After training, the model must predict every training point's target correctly. If one is wrong, the check stops and shows what it expected and what you got.",
      },
      {
        code: "print(\"Training converged.",
        text: "Only reached when every check above passed. It shows the list of mistakes for each epoch.",
      },
      {
        code: 'raise NotImplementedError("train()',
        text:
          "Your turn: replace this line with your code. Write it in this shape (replace each `...`):\n" +
          "`errors_per_epoch = []`, then `for _ in range(...):` and inside it `mistakes = 0`, then `for xi, target in zip(X, y):`, then `if ...:` and inside it `update = ...`, `model.weights += ...`, `model.bias += ...` and `mistakes += 1`. " +
          "At the end of each pass, `errors_per_epoch.append(...)`. After the loops, `return errors_per_epoch`.\n\n" +
          "**1)** Loop `epochs` times. At the start of each pass, set `mistakes = 0`.\n" +
          "**2)** Loop over `zip(X, y)` to get each `xi, target`.\n" +
          "**3)** If `model.predict(xi) != target`, it is a mistake. Ask the model fresh for every example.\n" +
          "**4)** On a mistake, set `update = learning_rate * target`.\n" +
          "**5)** Then do `model.weights += update * xi` and `model.bias += update`.\n" +
          "**6)** Then add 1 to `mistakes`.\n" +
          "**7)** At the end of the pass, add `mistakes` to `errors_per_epoch`.\n" +
          "**8)** Return `errors_per_epoch`. With `epochs=0` you give back `[]` and do not touch the model.\n\n" +
          "**Check (by hand):** start with `weights = [0, 0]`, `bias = 0` and `learning_rate = 0.1` on the small data set.\n" +
          "`[2, 2]` (target `+1`): the score is `0`, which counts as `+1`. Right, no change.\n" +
          "`[3, 3]` (target `+1`): the score is `0`, so the answer is `+1`. Right.\n" +
          "`[-2, -2]` (target `-1`): the score `0` gives `+1`. **Mistake.** `update = 0.1 * -1 = -0.1`. The weights become `[0 + (-0.1)*(-2), 0 + (-0.1)*(-2)] = [0.2, 0.2]` and the bias becomes `-0.1`.\n" +
          "`[-3, -1]` (target `-1`): the score is `0.2*-3 + 0.2*-1 - 0.1 = -0.9`, so the answer is `-1`. Right.\n\n" +
          "So epoch 1 has 1 mistake. In epoch 2 all four examples are right (0 mistakes). So `train(model, X_toy, y_toy, epochs=10, learning_rate=0.1)` should give back `[1, 0, 0, 0, 0, 0, 0, 0, 0, 0]`. It should leave `weights = [0.2, 0.2]` and `bias = -0.1`.",
      },
    ],
  },
];
