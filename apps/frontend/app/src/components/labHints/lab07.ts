import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 7 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab07Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def scaled_dot_product_attention(",
    hints: [
      {
        code: "def softmax(x: np.ndarray)",
        block: "function",
        text:
          "Turns raw scores into chances that add up to 1. You get `x`, a numpy array of raw scores, like `np.array([[1.0, 2.0, 3.0], [1.0, 1.0, 1.0]])`. It works for any number of dimensions, and every row (the last axis) is handled on its own. " +
          "You give back a new array with the same shape where each row is positive and adds up to 1. Example: that array gives about `[[0.090, 0.245, 0.665], [0.333, 0.333, 0.333]]`, and `softmax(np.array([0.0, 1.0]))` gives about `[0.269, 0.731]`.",
      },
      {
        code: "def scaled_dot_product_attention(",
        block: "function",
        text:
          "Works out scaled dot-product attention. You get three numpy arrays: `Q` (the queries) with shape `(n_queries, d_k)`, `K` (the keys) with shape `(n_keys, d_k)` (same number of columns as `Q`) and `V` (the values) with shape `(n_keys, d_v)`. " +
          "You give back a tuple `(output, attention_weights)`. `output` has shape `(n_queries, d_v)`. `attention_weights` has shape `(n_queries, n_keys)`, and each row adds up to 1. " +
          "Example: with `Q = [[0, 0]]`, `K = [[1, 0], [0, 1]]`, `V = [[10, 0], [0, 20]]` the weights are `[[0.5, 0.5]]` and the output is `[[5, 10]]`.",
      },
      {
        code: "scores = np.array(",
        text: "A tiny test array of raw scores: one row of `1, 2, 3` and one row of equal scores `1, 1, 1`. It is used to test `softmax`.",
      },
      {
        code: "Q = np.array(",
        text: "The queries for the test: two queries, each with 2 numbers.",
      },
      {
        code: "K = np.array(",
        text: "The keys for the test: two keys, each with 2 numbers. They are the same as `Q`, so query 0 matches key 0 best.",
      },
      {
        code: "V = np.array(",
        text: "The values (the “contents”) for the test: one row for each key. These are what gets blended by the attention weights.",
      },
      {
        code: "probs = softmax(scores)",
        text: "Runs **your** `softmax` on the test scores and keeps the answer.",
      },
      {
        code: "assert np.allclose(probs.sum(axis=-1), 1.0)",
        text: "A self-check. Every row of `softmax` must add up to `1`. If not, the check stops and shows what your code gave back.",
      },
      {
        code: "assert np.allclose(probs[1], [1 / 3, 1 / 3, 1 / 3])",
        text: "The second row has equal scores `[1, 1, 1]`, so each must become `1/3`.",
      },
      {
        code: "output, weights = scaled_dot_product_attention(Q, K, V)",
        text: "Runs **your** `scaled_dot_product_attention` on the test arrays and keeps both parts of the answer.",
      },
      {
        code: "assert np.allclose(weights.sum(axis=-1), 1.0)",
        text: "A self-check. Every row of the attention weights must add up to `1`.",
      },
      {
        code: "assert weights[0, 0] > weights[0, 1]",
        text: "Query 0 must pay more attention to key 0 than to key 1, because `Q[0]` matches `K[0]` best.",
      },
      {
        code: "print(\"All checks passed.\")",
        text: "Only reached when every check above passed.",
      },
      {
        code: 'raise NotImplementedError("softmax()',
        text:
          "Your turn: replace this line with your code. Write it in this shape (replace each `...`):\n" +
          "`shifted = x - ...`, then `exps = np.exp(...)`, then `return exps / ...`.\n\n" +
          "Work along the last direction (`axis=-1`) and use `keepdims=True` on the max and on the sum.\n" +
          "**1)** Set `shifted` to `x` minus the largest number of its row (`x.max(axis=-1, keepdims=True)`). This stops `np.exp` from making huge numbers. Do not change `x` itself.\n" +
          "**2)** Set `exps` to `np.exp(shifted)`.\n" +
          "**3)** Return `exps` divided by the sum of its row (sum along `axis=-1`, `keepdims=True` so the shapes line up).\n\n" +
          "**Check:** `softmax(np.array([0.0, 0.0]))` is `[0.5, 0.5]`. `softmax(np.array([0.0, 1.0]))` is about `[0.269, 0.731]`. `softmax(np.array([1000.0, 1000.0]))` is `[0.5, 0.5]`, not `nan`.",
      },
      {
        code: 'raise NotImplementedError("scaled_dot_product_attention()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`d_k = ...`, then `scores = ... / np.sqrt(d_k)`, then `weights = softmax(...)`, then `output = ...`, then `return ..., ...`.\n\n" +
          "**1)** Set `d_k` to `Q.shape[-1]` (the number of columns in `Q`).\n" +
          "**2)** Set `scores` to `Q @ K.T` divided by `np.sqrt(d_k)`. It has shape `(n_queries, n_keys)`.\n" +
          "**3)** Set `weights` to `softmax(scores)`, using your own `softmax`.\n" +
          "**4)** Set `output` to `weights @ V`.\n" +
          "**5)** Return `(output, weights)` in that order.\n\n" +
          "**Check (by hand):** take `Q = [[0, 0]]`, `K = [[1, 0], [0, 1]]`, `V = [[10, 0], [0, 20]]`. The scores are `[0, 0]`, the weights are `[0.5, 0.5]`, and the output is `[[5, 10]]`. For the notebook's own `Q`, `K`, `V`, the weights for row 0 come out as about `[0.670, 0.330]`, and the output is about `[[6.70, 6.60], [3.30, 13.40]]`.",
      },
    ],
  },
];
