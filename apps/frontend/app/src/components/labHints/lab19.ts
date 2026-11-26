import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 19 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab19Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def search(self, query_vector: list[float]",
    hints: [
      {
        code: "def cosine_similarity(a: list[float], b: list[float]) -> float:",
        block: "function",
        text: "Already written for you. It scores how much two vectors point the same way, from -1.0 to 1.0, like `cosine_similarity([1, 0], [1, 1])` gives about `0.707`.",
      },
      {
        code: "class VectorStore:",
        text: "A tiny vector database. It keeps texts together with their vectors (lists of numbers) and can find the best matches for a new vector.",
      },
      {
        code: "def __init__(self):",
        block: "function",
        text: "Already written for you. It starts a new, empty store.",
      },
      {
        code: "self.items = []",
        text: "A list of `(text, vector)` pairs. `search` reads from it.",
      },
      {
        code: "def add(self, text: str, vector: list[float]) -> None:",
        block: "function",
        text: "Already written for you. It saves one text with its vector, like `store.add(\"a\", [1, 0])`.",
      },
      {
        code: "def search(self, query_vector: list[float], k: int) -> list[tuple[float, str]]:",
        block: "function",
        text:
          "Finds the `k` texts whose vectors are closest to `query_vector`. You get `query_vector` (a list of numbers) and `k` (how many results). `self.items` is a list of `(text, vector)` pairs. You give back at most `k` pairs `(score, text)`, best match first, where score is the cosine similarity between `query_vector` and the vector of the text, like `[(1.0, \"a\"), (0.707, \"c\")]`.",
      },
      {
        code: "raise NotImplementedError(\"VectorStore.search()",
        text:
          "Your turn: replace this line with your code. Write it in this shape (replace each `...`):\n" +
          "`scored = [(..., text) for text, vector in self.items]`\n`scored.sort(...)`\n`return scored[:k]`\n" +
          "**1)** Set `scored` to a list with one pair `(cosine_similarity(query_vector, vector), text)` for each `(text, vector)` in `self.items`.\n" +
          "**2)** Sort `scored` with `scored.sort(reverse=True)`, so the highest score comes first.\n" +
          "**3)** Return `scored[:k]`.\n" +
          "**Check:** a store with `\"a\"` at `[1, 0]`, `\"b\"` at `[0, 1]` and `\"c\"` at `[1, 1]`. Searching with `[1, 0]` and `k=2` gives `[(1.0, \"a\"), (0.707..., \"c\")]`.",
      },
      {
        code: "store = VectorStore()",
        text: "Makes an empty store, then the next three lines add the three test items: `\"a\"` at `[1, 0]`, `\"b\"` at `[0, 1]` and `\"c\"` at `[1, 1]`.",
      },
      {
        code: "top = store.search([1, 0], 2)",
        text: "Runs **your** `search` with `[1, 0]` and asks for the best 2 matches.",
      },
      {
        code: "assert len(top) == 2",
        text: "A self-check. Asking for 2 results must give exactly 2. If not, the check stops and shows what your code gave back.",
      },
      {
        code: "assert [text for _, text in top] == [\"a\", \"c\"]",
        text: "The texts must come back in the order `\"a\"` first (a perfect match), then `\"c\"`.",
      },
      {
        code: "assert round(top[0][0], 3) == 1.0",
        text: "The first score must be `1.0` and the second `0.707` (rounded to 3 decimal places).",
      },
      {
        code: "assert len(store.search([1, 0], 10)) == 3",
        text: "Asking for more results than the store holds must give all 3 items, not crash.",
      },
      {
        code: "assert VectorStore().search([1, 0], 2) == []",
        text: "An empty store must give `[]`.",
      },
      {
        code: "print(\"All checks passed.\")",
        text: "Only reached if all checks above hold.",
      },
    ],
  },
];
