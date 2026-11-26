import type { CodeHint } from "../codeHints";

export const project19Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "    results = store.search(..., 2)",
    hints: [
      {
        code: "store = VectorStore()",
        text:
          "**Step 1: fill the store**\n" +
          "You get `TWIN_FACTS` (6 sentences), `embed` (turns a sentence into a vector) and `VectorStore` (`store.add(text, vector)` puts a text and its vector in it). Write the code that does these steps:\n\n" +
          "**1)** Set `store` to `VectorStore()`.\n" +
          "**2)** Loop with `for fact in TWIN_FACTS:`.\n" +
          "**3)** Call `store.add(fact, embed(fact))`.\n\n" +
          "**Check:** `len(store.items)` is `6`.",
      },
      {
        code: "questions = [...]",
        text:
          "**Step 2: retrieve for each question**\n" +
          "You get `store` and `embed`. `store.search(query_vector, k)` gives back a list of at most `k` pairs `(score, text)`, best first. Write the code that does these steps:\n\n" +
          "**1)** Set `questions` to a list of exactly these two strings, in this order: `\"Which sport team does she follow?\"`, `\"Where has she travelled?\"`.\n" +
          "**2)** Loop with `for question in questions:`.\n" +
          "**3)** Set `results` to `store.search(embed(question), 2)`. Each item is a `(score, text)` pair.\n\n" +
          "**Check:** `len(results)` is `2`. For the first question the best text is `\"Her favorite team is Hearts of Oak and she watches every match.\"`",
      },
      {
        code: "context = \"\\n\".join(f\"- {...}\" for pair in results)",
        text:
          "**Step 3: build the prompt**\n" +
          "You get `results` (pairs like `(0.9, \"some fact\")`) and `question`. Write the code that does these steps, inside the loop:\n\n" +
          "**1)** Set `context` to `\"\\n\".join(f\"- {text}\" for _, text in results)`. The `_` is the score, which you do not need. (The starter writes `for pair in results` and `{...}` as a stand-in. Change both to match.)\n" +
          "**2)** Set `prompt` with an f-string in this exact layout:\n" +
          "`Answer using only this context.`\n" +
          "(blank line)\n" +
          "`Context:`\n" +
          "`<context>`\n" +
          "(blank line)\n" +
          "`Question: <question>`\n" +
          "There is a blank line after the first line and after `<context>`.\n\n" +
          "**Check:** `prompt` starts with `Answer using only this context.` and ends with `Question: ` plus the question.",
      },
      {
        code: "print(prompt)",
        text:
          "**Step 4: print it**\n" +
          "You get `prompt`. Write the code that does these steps, inside the loop:\n\n" +
          "**1)** Print `prompt`.\n" +
          "**2)** Print `\"=\" * 20`.\n\n" +
          "The output is exactly:\n" +
          "`Answer using only this context.`\n" +
          "(blank line)\n" +
          "`Context:`\n" +
          "`- Her favorite team is Hearts of Oak and she watches every match.`\n" +
          "`- On Saturdays she runs five kilometers in the park.`\n" +
          "(blank line)\n" +
          "`Question: Which sport team does she follow?`\n" +
          "`====================`\n" +
          "`Answer using only this context.`\n" +
          "(blank line)\n" +
          "`Context:`\n" +
          "`- Last summer she travelled to Accra and Lisbon by plane.`\n" +
          "`- On Saturdays she runs five kilometers in the park.`\n" +
          "(blank line)\n" +
          "`Question: Where has she travelled?`\n" +
          "`====================`\n\n" +
          "**Check:** two prompts, each followed by a line of 20 `=` characters, and nothing else.",
      },
    ],
  },
];
