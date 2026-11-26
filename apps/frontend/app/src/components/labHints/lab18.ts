import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 18 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab18Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "assert cosine_similarity([0, 0], [1, 2]) == 0.0",
    hints: [
      {
        code: "def cosine_similarity(a: list[float], b: list[float]) -> float:",
        block: "function",
        text:
          "Scores how much two vectors point the same way, from -1.0 to 1.0. A vector is a list of numbers. You get two lists of numbers, `a` and `b`, with the same length. You give back one float: `dot(a, b) / (length of a * length of b)`, or `0.0` if either length is `0`. Example: `cosine_similarity([3, 4], [3, 4])` gives `1.0`.",
      },
      {
        code: "raise NotImplementedError(\"cosine_similarity()",
        text:
          "Your turn: replace this line with your code. Write it in this shape (replace each `...`):\n" +
          "`dot = sum(... for x, y in zip(a, b))`\n`length_a = math.sqrt(...)`\n`length_b = math.sqrt(...)`\n`if ... or ...:`\n`    return 0.0`\n`return ...`\n" +
          "**1)** Set `dot` to the sum of `x * y` over `zip(a, b)`.\n" +
          "**2)** Set `length_a` to `math.sqrt(sum(x * x for x in a))`.\n" +
          "**3)** Set `length_b` the same way for `b`.\n" +
          "**4)** If `length_a` is `0` or `length_b` is `0`, return `0.0`.\n" +
          "**5)** Otherwise return `dot / (length_a * length_b)`.\n" +
          "**Check:** `cosine_similarity([3, 4], [3, 4])` is `25 / (5 * 5) = 1.0`.",
      },
      {
        code: "assert round(cosine_similarity([3, 4], [3, 4]), 6) == 1.0",
        text: "A self-check. The same vector against itself must give `1.0`. If not, the check stops and shows what your code gave back.",
      },
      {
        code: "assert round(cosine_similarity([1, 0], [0, 1]), 6) == 0.0",
        text: "`[1, 0]` and `[0, 1]` point in completely different directions, so the score must be `0.0`.",
      },
      {
        code: "assert round(cosine_similarity([1, 2, 3], [2, 4, 6]), 6) == 1.0",
        text: "`[2, 4, 6]` is the same direction as `[1, 2, 3]`, only longer, so the score must be `1.0` (rounded to 6 decimal places).",
      },
      {
        code: "assert round(cosine_similarity([1, 0], [-1, 0]), 6) == -1.0",
        text: "Opposite vectors must give `-1.0`.",
      },
      {
        code: "assert cosine_similarity([0, 0], [1, 2]) == 0.0",
        text: "A vector of zeros has length `0`. Your code must give `0.0` here and not crash by dividing by zero.",
      },
      {
        code: "print(\"All checks passed.\")",
        text: "Only reached if all five checks above hold.",
      },
    ],
  },
];
