import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 1 project starter (course/projects/lab_01_starter.py).
export const project01Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def sample_next_word(",
    hints: [
      {
        code: "def sample_next_word(distribution, n=5):",
        text:
          "**Step 1: Write `sample_next_word`**\n" +
          "You get `distribution: dict[str, float]` (word -> chance, like `{\"the\": 0.5, \"was\": 0.3, \"great\": 0.2}`) and `n: int = 5`. You give back a `list[str]` of `n` random words. Write the code that does these steps:\n\n" +
          "**1)** Set `words` to `list(distribution.keys())`.\n" +
          "**2)** Set `weights` to `list(distribution.values())`.\n" +
          "**3)** Return `random.choices(words, weights=weights, k=n)`.\n\n" +
          "The same word can come up twice. With `n=5` one possible result is `['the', 'was', 'the', 'the', 'great']`, and another run gives a different list.\n" +
          "**Check:** `len(sample_next_word(dist, n=5)) == 5`, `len(sample_next_word(dist, n=8)) == 8`, and every item is a `str`. Call it with `n=1000` on `dist` and count how often `\"the\"` comes up. It should be close to 100. A bit more or less is fine, because the chance of `the` is about 0.10.",
      },
      {
        code: "words = ...",
        text: "`words` is the list of the words (the keys of `distribution`). Use `list(distribution.keys())`.",
      },
      {
        code: "weights = ...",
        text: "`weights` is the list of their chances, in the same order as `words`. Use `list(distribution.values())`.",
      },
      {
        code: "return ...",
        text: "Give back `n` random picks: `random.choices(words, weights=weights, k=n)`. Likely words get picked more often.",
      },
      {
        code: "counts = ...",
        text:
          "**Step 2: Build `counts` and `dist` from all the sentences**\n" +
          "`counts` is how many times each word shows up. Write the code that does these steps, with these exact names:\n\n" +
          "**1)** Set `counts` to `word_counts(sentences)`.\n" +
          "**2)** Set `dist` to `word_probabilities(counts)`.\n\n" +
          "**Check:** `abs(sum(dist.values()) - 1.0) < 1e-9`. This says the chances add up to 1. Compare with a tiny gap, not `== 1`, because decimal numbers can be a tiny bit off. Also `sum(counts.values())` should be 1473, and `dist[\"the\"]` should be about 0.1005 (`148 / 1473`).",
      },
      {
        code: "dist = ...",
        text: "`dist` is the chance of every word (a distribution). Set it to `word_probabilities(counts)`. The chances add up to 1.",
      },
      {
        code: 'print(f"{...} sentences, {...} unique words.")',
        text:
          "**Step 3: Print the summary line**\n" +
          "Print one line like this, with numbers **worked out by your code** (do not type them in):\n" +
          "`170 sentences, 523 unique words.`\n\n" +
          "**1)** Use `len(sentences)` for the sentence count.\n" +
          "**2)** Use `len(counts)` for the unique word count.\n\n" +
          "**Check:** you should see `170 sentences, 523 unique words.` If your number is different, your `tokenize` is probably keeping punctuation, digits or capital letters.",
      },
      {
        code: "top15 = ...",
        text:
          "**Step 4: Print the 15 most likely words**\n" +
          "`top15` is the 15 pairs `(word, chance)` with the highest chance. Write the code that does these steps:\n\n" +
          "**1)** Set `top15` to `top_k(dist, 15)`.\n" +
          "**2)** Print the line `Most probable words in the corpus:`.\n" +
          "**3)** Loop over `top15` with `for word, prob in top15:`.\n" +
          "**4)** Print `f\"  {word:<12} P={prob:.4f}\"`. That is two spaces, the word padded to 12 characters, a space, `P=`, and the chance with 4 digits after the point.\n\n" +
          "Example: for `(\"the\", 0.10047...)` the line is `  the          P=0.1005`.\n" +
          "**Check:** `len(top15) == 15`, the chances go down as you read the list, and the first line is `the` with `P=0.1005`.",
      },
      {
        code: 'print(f"...")',
        text: "Replace the `...` with `  {word:<12} P={prob:.4f}`: two spaces, the word padded to 12 characters, a space, `P=`, and the chance with 4 digits after the point. `word` and `prob` come from the loop.",
      },
      {
        code: 'print(f"Greedy pick (always highest probability word): {...}")',
        text:
          "**Step 5: Print the greedy pick**\n" +
          "Greedy means always taking the top word. Write the code that does these steps:\n\n" +
          "**1)** Call `print()` with nothing inside, to print an empty line.\n" +
          "**2)** Get the top word with `top_k(dist, 1)[0][0]`. (`top_k(dist, 1)` is a list with one pair, like `[(\"the\", 0.1005)]`. The first `[0]` takes the pair and the second `[0]` takes the word.)\n" +
          "**3)** Print `Greedy pick (always highest probability word): <word>`.\n\n" +
          "**Check:** the word is exactly the word on the first line of the top-15 list (`the`).",
      },
      {
        code: 'print(f"Sampled picks (weighted by probability): {...}")',
        text:
          "**Step 6: Print the sampled picks**\n" +
          "Sampling is random, but weighted by chance. Write the code that does these steps:\n\n" +
          "**1)** Call `sample_next_word(dist, n=5)`.\n" +
          "**2)** Print `Sampled picks (weighted by probability): ` followed by the list, like `Sampled picks (weighted by probability): ['the', 'was', 'and', 'the', 'movie']`.\n\n" +
          "Printing the list directly gives the brackets and quotes. That is fine.\n" +
          "**Check:** exactly 5 words. Run the cell a few times. The list should change, and `the` and `and` should show up more often than rare words.",
      },
      {
        code: "words, probs = ...",
        text:
          "**Step 7: Draw the bar chart**\n" +
          "`words` are the 15 words and `probs` are their 15 chances. Write the code that does these steps:\n\n" +
          "**1)** Set `words, probs` to `zip(*top15)`. This splits the pairs into 15 words and their 15 chances.\n" +
          "**2)** Call `plt.figure(figsize=(9, 5))`.\n" +
          "**3)** Call `plt.bar(words, probs, color=\"steelblue\")`.\n" +
          "**4)** Call `plt.title(\"Word probability distribution over real review sentences\")`.\n" +
          "**5)** Call `plt.ylabel(\"P(word)\")`.\n" +
          "**6)** Call `plt.xticks(rotation=45, ha=\"right\")`.\n" +
          "**7)** Call `plt.tight_layout()`.\n" +
          "**8)** Call `plt.show()`.\n\n" +
          "**Check:** you see 15 blue bars. The tallest is on the left (`the`, about 0.10) and the shortest is on the right (about 0.0075). The title and y-label match the text above.",
      },
    ],
  },
];
