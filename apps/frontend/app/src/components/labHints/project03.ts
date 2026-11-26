import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 3 project starter (course/projects/lab_03_starter.py).
export const project03Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def generate_sentence(",
    hints: [
      {
        code: "def generate_sentence(cond, start, length=10):",
        block: "function",
        text:
          "**Step 1: Write `generate_sentence`**\n" +
          "You get `cond: dict[str, dict[str, float]]` (previous word -> next words and their chances), a `start: str` word, and `length: int = 10`. You give back a `str`: a sentence of at most `length` words, like `\"the movie was great\"`. Write the code that does these steps:\n\n" +
          "**1)** Start `words` as `[start]`, and set `current` to `start`.\n" +
          "**2)** Loop `length - 1` times.\n" +
          "**3)** Set `options` to `cond.get(current)`. This gives `None` instead of crashing when the word is missing.\n" +
          "**4)** If `not options`, `break`. This is a dead end: a word with no next word, so the sentence stops early.\n" +
          "**5)** Otherwise pick one word with `random.choices(list(options.keys()), weights=list(options.values()), k=1)[0]`.\n" +
          "**6)** Add that word to `words`, and set `current` to it.\n" +
          "**7)** After the loop, return `\" \".join(words)`.\n\n" +
          "For example, `generate_sentence(cond, \"great\")` always gives just `\"great\"`, because `great` has no entry.\n" +
          "**Check:** the result is a `str`, it begins with `start`, it has at most `length` words (`len(result.split()) <= length`), and `generate_sentence(cond, \"the\", length=1)` gives just `\"the\"`.",
      },
      {
        code: "options = ...",
        text: "`options` is the next words and their chances after `current`. Use `cond.get(current)`: it gives `None` instead of crashing when the word is missing.",
      },
      {
        code: "if ...:",
        text: "A dead end is a word with no next word. If `not options`, `break` so the sentence stops early.",
      },
      {
        code: "counts = ...",
        text:
          "**Step 2: Build the model from all the sentences**\n" +
          "`counts` is how many times each word came right after each other word. Write the code that does these steps, with these exact names:\n\n" +
          "**1)** Set `counts` to `bigram_counts(sentences)`.\n" +
          "**2)** Set `cond` to `conditional_probabilities(counts)`.\n\n" +
          "**Check:** `counts[\"the\"]` holds 148 pairs in total (`sum(counts[\"the\"].values()) == 148`), and `abs(sum(cond[\"the\"].values()) - 1.0) < 1e-9`. `cond[\"the\"][\"movie\"]` is about `0.027`. Also `len(counts)` is 449 (that is how many different previous words there are).",
      },
      {
        code: "cond = ...",
        text: "`cond` is the chance of each next word given the previous word, `P(next | previous)`. Set it to `conditional_probabilities(counts)`.",
      },
      {
        code: 'print("Generated sentences from the real bigram model:")',
        text:
          "**Step 3: Print the three generated sentences**\n" +
          "Write the code that does these steps:\n\n" +
          "**1)** Print the header `Generated sentences from the real bigram model:`.\n" +
          "**2)** Loop over the seeds `\"the\"`, `\"this\"`, `\"i\"`, in that order.\n" +
          "**3)** For each seed, print `  [<seed>] -> <sentence>`, with two spaces at the start. Make the sentence with `generate_sentence(cond, seed)` (default length of 10).\n\n" +
          "For example (yours will be different):\n" +
          "`  [the] -> the pacing was awful and the story was`\n" +
          "`  [this] -> this movie was a masterpiece that everyone should see`\n" +
          "`  [i] -> i loved every minute of this film`\n\n" +
          "**Check:** three lines, each starting with its seed, and none with more than 10 words after the `->`. Run it twice: the sentences change. Some may be shorter than 10 words if a dead end comes up.",
      },
      {
        code: "for seed in [...]:",
        text: "The three starting words, in this order: `\"the\"`, `\"this\"`, `\"i\"`.",
      },
      {
        code: 'print(f"  [{seed}] -> {...}")',
        text: "Fill the hole with `generate_sentence(cond, seed)`. The line starts with two spaces.",
      },
      {
        code: "totals = {prev: ... for prev, inner in counts.items()}",
        text:
          "**Step 4: Collect the heatmap data** (4a, 4b and 4c)\n" +
          "**4a. `top_prev_words`** (the rows). Write the code that does these steps:\n\n" +
          "**1)** Set `totals` to a dict of each `prev` with `sum(inner.values())`. Use the **counts**, not the chances (the chances in each row always add up to 1).\n" +
          "**2)** Set `top_prev_words` to `sorted(totals, key=totals.get, reverse=True)[:12]`.\n\n" +
          "Expected: `['the', 'and', 'this', 'was', 'i', 'is', 'a', 'to', 'of', 'my', 'were', 'with']`, with totals `148, 95, 60, 57, 33, 33, 22, 15, 14, 13, 12, 11`. (`i` and `is` tie at 33. The one seen first in the data comes first.) These totals are a little lower than lab 1's word counts, because the last word of each sentence has no next word.",
      },
      {
        code: "top_prev_words = ...",
        text: "`top_prev_words` is the 12 most common previous words (the rows). Use `sorted(totals, key=totals.get, reverse=True)[:12]`.",
      },
      {
        code: "next_word_totals = {}",
        text:
          "**4b. `top_next_words`** (the columns). Write the code that does these steps:\n\n" +
          "**1)** Make an empty dict `next_word_totals = {}`.\n" +
          "**2)** For each `prev` in `top_prev_words`, loop over `counts[prev].items()`.\n" +
          "**3)** Add each `count` to `next_word_totals[nxt]`. If a next word shows up under several previous words, the counts add together. For example, `movie` after `the` 4 times and after `this` 7 times gives 11. Use `.get(nxt, 0)` to start from 0.\n" +
          "**4)** Set `top_next_words` to the 12 keys with the biggest totals, biggest first, like in 4a.\n\n" +
          "Expected: `['the', 'movie', 'product', 'book', 'film', 'a', 'story', 'would', 'pacing', 'price', 'hotel', 'is']`, with pooled counts `26, 11, 6, 6, 6, 6, 5, 5, 4, 4, 4, 4`. The last few places are ties. They keep the order the words first entered the dict.",
      },
      {
        code: "top_next_words = ...",
        text: "`top_next_words` is the 12 next words with the biggest pooled totals, biggest first (the columns). Sort `next_word_totals` the same way as in 4a.",
      },
      {
        code: "matrix = np.zeros(...)",
        text:
          "**4c. `matrix`** (the grid of numbers). Write the code that does these steps:\n\n" +
          "**1)** Set `matrix` to `np.zeros((len(top_prev_words), len(top_next_words)))`. This is 12 rows and 12 columns of `0.0`.\n" +
          "**2)** In the two loops, set `matrix[i, j]` to `cond[prev].get(nxt, 0.0)`. Use chances from `cond`, not raw counts. `.get(nxt, 0.0)` gives `0.0` when that pair never shows up.\n\n" +
          "**Check:** `matrix.shape == (12, 12)`. All values are between 0 and 1. Each **row** adds up to at most 1 (only 12 columns are shown). `matrix[0, 0]` is `P(the | the)`, which is 0. The biggest cell is about `0.24`, in the `and` row and the `the` column (`P(the | and)`). About 124 of the 144 cells are exactly 0.",
      },
      {
        code: "matrix[i, j] = ...",
        text: "Row `i` is the previous word and column `j` is the next word. Set it to `cond[prev].get(nxt, 0.0)`: `0.0` when that pair never shows up.",
      },
      {
        code: "plt.figure(...)",
        text:
          "**Step 5: Draw the heatmap**\n" +
          "Write the code that does these steps:\n\n" +
          "**1)** Call `plt.figure(figsize=(8, 7))`.\n" +
          "**2)** Call `plt.imshow(matrix, cmap=\"viridis\", aspect=\"auto\")`.\n" +
          "**3)** Call `plt.colorbar(label=\"P(next word | previous word)\")`.\n" +
          "**4)** Call `plt.xticks(range(len(top_next_words)), top_next_words, rotation=45, ha=\"right\")`.\n" +
          "**5)** Call `plt.yticks(range(len(top_prev_words)), top_prev_words)`.\n" +
          "**6)** Call `plt.xlabel(\"next word\")`, `plt.ylabel(\"previous word\")` and `plt.title(\"Conditional probability heatmap (real review corpus)\")`.\n" +
          "**7)** Call `plt.tight_layout()`, then `plt.show()`.\n\n" +
          "**Check:** 12 words along the bottom (next words) and 12 down the left side (previous words). A color key with the label on the right. Mostly dark squares with a few bright ones.",
      },
    ],
  },
];
