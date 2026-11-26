import type { CodeHint } from "../codeHints";

export const project18Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "    known = [... for w in words if ...]",
    hints: [
      {
        code: "def embed(text):",
        block: "function",
        text:
          "**Step 1: write `embed(text)`**\n" +
          "You get a sentence, like `\"She bakes bread.\"`. You give back a list of 5 numbers: the average of the vectors of the words it knows. `WORD_VECTORS` maps lowercase words to lists of 5 numbers. Only some words are in it. Write the code that does these steps:\n\n" +
          "**1)** Set `words` to `text.lower().replace(\".\", \"\").replace(\"?\", \"\").split()`.\n" +
          "**2)** Set `known` to `[WORD_VECTORS[w] for w in words if w in WORD_VECTORS]`.\n" +
          "**3)** Return `[sum(column) / len(known) for column in zip(*known)]`. This averages the vectors position by position.\n\n" +
          "**Check:** `embed(\"She bakes bread.\")` has 5 numbers. Only `bakes` and `bread` are known, so its first number is `(0.9 + 1.0) / 2 = 0.95` and the other four are `0.0`.",
      },
      {
        code: "    words = ...",
        text: "The lowercase words of the sentence, with `.` and `?` removed. Use `text.lower().replace(\".\", \"\").replace(\"?\", \"\").split()`.",
      },
      {
        code: "    known = [... for w in words if ...]",
        text: "The vectors of only the words that are in `WORD_VECTORS`. Words like `\"she\"` or `\"does\"` are not in it, so they are skipped. Use `[WORD_VECTORS[w] for w in words if w in WORD_VECTORS]`.",
      },
      {
        code: "fact_vectors = [... for fact in TWIN_FACTS]",
        text:
          "**Step 2: embed the facts**\n" +
          "You get `TWIN_FACTS`, a list of 6 sentences. Write the code that does this step:\n\n" +
          "**1)** Set `fact_vectors` to `[embed(fact) for fact in TWIN_FACTS]`.\n\n" +
          "**Check:** `len(fact_vectors)` is `6`, and each item has `5` numbers.",
      },
      {
        code: "questions = [...]",
        text:
          "**Step 3: score and pick the best**\n" +
          "You get `fact_vectors`, `embed` and `cosine_similarity` (gives a score from -1 to 1 for two vectors, higher means closer in meaning). Write the code that does these steps:\n\n" +
          "**1)** Set `questions` to a list of exactly these three strings, in this order: `\"What food does she cook?\"`, `\"Which countries did she visit?\"`, `\"What programming language does she use?\"`.\n" +
          "**2)** Loop with `for question in questions:`.\n" +
          "**3)** Set `query` to `embed(question)`.\n" +
          "**4)** Set `scores` to `[cosine_similarity(query, vector) for vector in fact_vectors]`.\n" +
          "**5)** Set `best` to `scores.index(max(scores))`.\n\n" +
          "**Check:** for the first question `best` is `1`.",
      },
      {
        code: "print(f\"Q: ...\")",
        text:
          "**Step 4: print the answers**\n" +
          "You get `question`, `best` and `scores` inside the loop. Write the code that does these steps, inside the loop:\n\n" +
          "**1)** Print `f\"Q: {question}\"`.\n" +
          "**2)** Print `f\"A: {TWIN_FACTS[best]} ({scores[best]:.3f})\"`. The `:.3f` gives 3 digits after the decimal point.\n\n" +
          "The output is exactly:\n" +
          "`Q: What food does she cook?`\n" +
          "`A: She bakes bread and cooks spicy soup on weekends. (1.000)`\n" +
          "`Q: Which countries did she visit?`\n" +
          "`A: Last summer she travelled to Accra and Lisbon by plane. (1.000)`\n" +
          "`Q: What programming language does she use?`\n" +
          "`A: Ada writes Python code and builds web apps every day. (0.999)`\n\n" +
          "**Check:** 6 lines in total, and each `A:` line ends with a score such as `(0.xxx)`.",
      },
    ],
  },
];
