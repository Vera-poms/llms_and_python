import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 8 project starter. `match` picks the cell (a piece of its starter code).
export const project08Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "classify_sentiment = PromptTemplate(",
    hints: [
      {
        code: "classify_sentiment = PromptTemplate(",
        text:
          "**Step 1: Write the `classify_sentiment` template**\n" +
          "You make a `PromptTemplate` with the layout `<instruction>` + `\\n\\n` + `Review: {review}`. A *template* is a prompt with a blank in curly braces, and the blank (`{review}`) is called a *placeholder*. `required_vars` is the set of placeholder names the template finds, and `render` asks for each of them. Your own `PromptTemplate` class from the exercise must be defined and run first.\n\n" +
          "**1)** Write an instruction that asks the model to classify the sentiment of the review as positive or negative, and to reply with a single word. The wording is yours. For example: `\"Classify the sentiment of this review as positive or negative. Reply with a single word.\"`\n" +
          "**2)** After it, add the string `\"\\n\\n\"` (this shows up as one blank line).\n" +
          "**3)** End with the string `\"Review: {review}\"`.\n" +
          "**4)** Do not add any other curly braces. `required_vars` would pick them up, and `render` would then ask for them.\n\n" +
          "**Check:** `PromptTemplate(...).required_vars == {\"review\"}`.",
      },
      {
        code: "summarize = PromptTemplate(",
        text:
          "**Step 2: Write the `summarize` template**\n" +
          "It has the same layout as Step 1: `<instruction>` + `\\n\\n` + `Review: {review}`.\n\n" +
          "**1)** Write an instruction that asks the model to summarize the review in one short sentence, for example `\"Summarize this review in one short sentence.\"`\n" +
          "**2)** After it, add `\"\\n\\n\"`.\n" +
          "**3)** End with `\"Review: {review}\"`.\n\n" +
          "**Check:** `required_vars == {\"review\"}`.",
      },
      {
        code: "TEMPLATES = {",
        text:
          "**Step 3: Build `TEMPLATES`**\n" +
          "A dict that holds both templates under a name each, so you can loop over them.\n\n" +
          "**1)** Make a dict called `TEMPLATES` with exactly two keys, spelled exactly as in the code: `\"classify_sentiment\"` and `\"summarize\"`.\n" +
          "**2)** Set `\"classify_sentiment\"` to the template from Step 1.\n" +
          "**3)** Set `\"summarize\"` to the template from Step 2.\n\n" +
          "Keep that order, because the output follows it.\n\n" +
          "**Check:** `list(TEMPLATES)` is `[\"classify_sentiment\", \"summarize\"]`.",
      },
      {
        code: "for name, template in TEMPLATES.items():",
        text:
          "**Step 4: The loop and the output**\n" +
          "`sentences` is the list of review sentences already in the notebook (all lowercase). `sentences[0]` is `\"the movie was absolutely wonderful and kept me hooked the whole time\"` and `sentences[1]` is `\"i loved every minute of this film\"`. *Rendering* means filling the blanks to make the final text.\n\n" +
          "**1)** Loop with `for name, template in TEMPLATES.items():`.\n" +
          "**2)** Print the header `--- <name> ---`, for example `--- classify_sentiment ---`.\n" +
          "**3)** Inside it, loop with `for review in sentences[:2]:` (the first two sentences only).\n" +
          "**4)** Print `template.render(review=review)`. Do not use f-strings or `.format` yourself.\n" +
          "**5)** Print one blank line with `print()`.\n\n" +
          "If your instructions are the examples above, the output is exactly:\n" +
          "`--- classify_sentiment ---`\n" +
          "`Classify the sentiment of this review as positive or negative. Reply with a single word.`\n" +
          "`(blank line)`\n" +
          "`Review: the movie was absolutely wonderful and kept me hooked the whole time`\n" +
          "`(blank line)`\n" +
          "`Classify the sentiment of this review as positive or negative. Reply with a single word.`\n" +
          "`(blank line)`\n" +
          "`Review: i loved every minute of this film`\n" +
          "`(blank line)`\n" +
          "`--- summarize ---`\n" +
          "`Summarize this review in one short sentence.`\n" +
          "`(blank line)`\n" +
          "`Review: the movie was absolutely wonderful and kept me hooked the whole time`\n" +
          "`(blank line)`\n" +
          "`Summarize this review in one short sentence.`\n" +
          "`(blank line)`\n" +
          "`Review: i loved every minute of this film`\n" +
          "`(blank line)`\n\n" +
          "Your instruction wording may differ. The structure must match: a header, then for each of two sentences an instruction, a blank line, `Review: <sentence>`, and a blank line after the prompt. No `{review}` should show up in the output.\n\n" +
          "**Check:** you see 2 headers and 4 prompts, and nothing else.",
      },
      {
        code: "for review in sentences[:2]:",
        text: "Only the first two sentences, so the output stays short: 2 prompts for each template.",
      },
    ],
  },
];
