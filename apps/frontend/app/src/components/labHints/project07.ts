import type { CodeHint } from "../codeHints";

export const project07Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "_, weights = scaled_dot_product_attention(..., ..., ...)",
    hints: [
      {
        code: "def tokenize(sentence):",
        text:
          "**Step 1: `tokenize(sentence: str) -> list[str]`**\n" +
          "You get a sentence, like `\"Hello, World! It's 2024.\"`. You give back `['hello', 'world', 'it', 's']`. Digits and punctuation vanish. `re` is already imported.\n" +
          "**1)** Make the sentence lowercase with `sentence.lower()`.\n" +
          "**2)** Call `re.findall(r\"[a-z]+\", ...)` on it. This finds every run of letters a-z.\n" +
          "**3)** Return that list.\n" +
          "**Check:** `tokenize(\"the acting was superb\")` gives `['the', 'acting', 'was', 'superb']`.",
      },
      {
        code: "def bigram_counts(sentences):",
        text:
          "**Step 2: `bigram_counts(sentences: list[str]) -> dict[str, dict[str, int]]`**\n" +
          "You get a list of sentences, like `[\"a b a b\", \"b c\"]`. You give back a dict of dicts, `result[prev][nxt] = count`. Here that is `{'a': {'b': 2}, 'b': {'a': 1, 'c': 1}}`. Pairs of neighbor words never cross from one sentence into the next.\n" +
          "**1)** Start with `counts = {}`.\n" +
          "**2)** Loop over `sentences`. For each one, set `words` to `tokenize(sentence)`.\n" +
          "**3)** Loop over `zip(words, words[1:])` as `prev, nxt`.\n" +
          "**4)** Set `inner` to `counts.setdefault(prev, {})`.\n" +
          "**5)** Set `inner[nxt]` to its old count plus 1. Use `inner.get(nxt, 0)` for the old count.\n" +
          "**6)** After the loops, return `counts`.\n" +
          "**Check:** on the real data, `bigram_counts(sentences)[\"acting\"]` is `{'was': 1, 'felt': 1}`.",
      },
      {
        code: "def build_cooccurrence_embeddings(sentences, dim=16):",
        text:
          "**Step 3: `build_cooccurrence_embeddings(sentences: list[str], dim: int = 16) -> dict[str, np.ndarray]`**\n" +
          "You get the list of sentences and `dim`. You give back a dict that maps each word to a list of 16 numbers (an *embedding*).\n" +
          "**1)** Set `counts` to `bigram_counts(sentences)`.\n" +
          "**2)** Set `vocab` to the sorted list of every different word in all sentences, with no repeats. Use `tokenize` to get the words. On the real data `len(vocab)` is 523.\n" +
          "**3)** Set `index` to a dict from each word to its position in `vocab`, and `V` to `len(vocab)`.\n" +
          "**4)** Set `raw` to `np.zeros((V, V))`.\n" +
          "**5)** Loop over `counts.items()` as `prev, inner`. Set `total` to the sum of `inner.values()`. This is one total per previous word, not one for the whole grid.\n" +
          "**6)** Loop over `inner.items()` as `nxt, count`. Set `raw[index[prev], index[nxt]]` to `count / total`. Example: `\"the\"` is followed by something 148 times, and by `\"movie\"` 4 times, so that cell is `4 / 148`. Words that are never followed by anything (like `\"touching\"`) keep a row of zeros. Do not divide by zero for them.\n" +
          "**7)** Set `rng = np.random.default_rng(0)`, then `projection = rng.normal(size=(V, dim))`. Use seed `0` and this exact call once, or your picture will differ.\n" +
          "**8)** Set `embeddings` to `raw @ projection`. Its shape is `(V, dim)`, which is `(523, 16)`.\n" +
          "**9)** Return a dict that maps each word in `vocab` to its row of `embeddings`.\n" +
          "**Check:** `len(embeddings)` is 523, and `embeddings[\"the\"].shape` is `(16,)`. `embeddings[\"touching\"]` is 16 zeros.",
      },
      {
        code: "total = ...",
        text: "One total per previous word: `sum(inner.values())`. Not one total for the whole grid.",
      },
      {
        code: "projection = ...",
        text: "`rng.normal(size=(V, dim))`, called once with seed `0` (the line above). Another seed or a second call changes your picture.",
      },
      {
        code: "embeddings = build_cooccurrence_embeddings(...)",
        text:
          "**Step 4: Build `embeddings`**\n" +
          "**1)** Set `embeddings` to `build_cooccurrence_embeddings(sentences, dim=16)`. `sentences` is the list of 170 review sentences already in the notebook.\n" +
          "**Check:** `len(embeddings)` is 523.",
      },
      {
        code: "X = np.stack(...)",
        text:
          "**Step 5: `words` and `X`**\n" +
          "You use the sentence `\"the acting was superb and the story was touching\"`.\n" +
          "**1)** Set `sentence` to that text. You need it again in the title.\n" +
          "**2)** Set `words` to `tokenize(sentence)`. This gives 9 words: `['the', 'acting', 'was', 'superb', 'and', 'the', 'story', 'was', 'touching']`.\n" +
          "**3)** Set `X` to `np.stack([embeddings[w] for w in words])`. Keep sentence order, repeats included. The shape is `(9, 16)`.\n" +
          "**Check:** `X.shape == (9, 16)`, and `X[0]` equals `X[5]` (both are `the`).",
      },
      {
        code: "_, weights = scaled_dot_product_attention(",
        text:
          "**Step 6: Attention weights**\n" +
          "Your own exercise `scaled_dot_product_attention(Q, K, V)` gives back `(output, attention_weights)`. It and `softmax` must be defined and run first (otherwise you get a `NameError`).\n" +
          "**1)** Call `scaled_dot_product_attention(X, X, X)` and keep only the second result: `_, weights = ...`. `weights` has shape `(9, 9)`. Row `i`, column `j` says how much word `i` looks at word `j`.\n" +
          "**Check:** `weights.shape == (9, 9)` and `weights.sum(axis=1)` is nine values, all equal to 1 (up to tiny rounding).",
      },
      {
        code: "plt.figure(...)",
        text:
          "**Step 7: The heatmap**\n" +
          "`plt` is already imported.\n" +
          "**1)** Call `plt.figure(figsize=(7, 6))`.\n" +
          "**2)** Call `plt.imshow(weights, cmap=\"magma\")`. Dark is small and bright is large.\n" +
          "**3)** Call `plt.colorbar(label=\"attention weight\")`.\n" +
          "**4)** Call `plt.xticks(range(9), words, rotation=45, ha=\"right\")`.\n" +
          "**5)** Call `plt.yticks(range(9), words)`.\n" +
          "**6)** Call `plt.title(...)` with the exact text `Self-attention over: \"<the sentence>\"`, with the sentence in double quotes. For example: `Self-attention over: \"the acting was superb and the story was touching\"`. Use `f'Self-attention over: \"{sentence}\"'`.\n" +
          "**7)** Call `plt.tight_layout()`, then `plt.show()`.\n" +
          "**Check:** you see a 9x9 colored grid, word labels on both sides, and a color key on the right.",
      },
    ],
  },
];
