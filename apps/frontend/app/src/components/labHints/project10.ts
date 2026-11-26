import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 10 project starter. `match` picks the cell (a piece of its starter code).
export const project10Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "FEW_SHOT_EXAMPLES = [",
    hints: [
      {
        code: "FEW_SHOT_EXAMPLES = [",
        text:
          "**Step 1: Define `FEW_SHOT_EXAMPLES`**\n" +
          "Two worked examples that show the model the exact reply shape you want (*few-shot prompting*). Replace each `...`. Make a list with exactly two `(review_text, result_dict)` tuples. Use these values exactly:\n\n" +
          "**1)** `(\"This is the best purchase I've made all year.\", {\"sentiment\": \"positive\", \"confidence\": 0.97})`\n" +
          "**2)** `(\"It broke after two days and support ignored me.\", {\"sentiment\": \"negative\", \"confidence\": 0.95})`\n\n" +
          "`0.97` and `0.95` are numbers, not strings.\n\n" +
          "**Check:** `len(FEW_SHOT_EXAMPLES)` is `2`, and `FEW_SHOT_EXAMPLES[0][1][\"sentiment\"]` is `\"positive\"`.",
      },
      {
        code: "N_SAMPLES = ...",
        text:
          "**Step 2: Define `N_SAMPLES` and `results`**\n" +
          "`N_SAMPLES` is how many reviews to test. `results` is an empty list that collects one row per review. Write these two lines before the loop:\n\n" +
          "**1)** `N_SAMPLES = 8`\n" +
          "**2)** `results = []`\n\n" +
          "**Check:** `N_SAMPLES == 8` and `results == []`.",
      },
      {
        code: "for review in sentences[:N_SAMPLES]:",
        text:
          "**Step 3: Loop over the first 8 reviews**\n" +
          "`sentences[:N_SAMPLES]` gives the first 8 reviews. A *message* is one chat turn like `{\"role\": \"user\", \"content\": \"Hello\"}`. `build_few_shot_messages(examples, query)` (your exercise function) builds the full list: a system message, then a user and an assistant message for each example, then the real `query` as the last user message. `parse_json_response(text)` (also yours) removes the code fence, reads the JSON, and raises `ValueError` if `sentiment` or `confidence` is missing. If the text is not JSON at all, `json.JSONDecodeError` happens.\n\n" +
          "**1)** Loop with `for review in sentences[:N_SAMPLES]:`.\n" +
          "**2)** Inside the loop, set `messages` to `build_few_shot_messages(FEW_SHOT_EXAMPLES, review)`.\n" +
          "**3)** Set `reply` to `call_groq(messages, response_format={\"type\": \"json_object\"})`. Keep the default model and temperature.\n" +
          "**4)** Start a `try:` block. Inside it, set `parsed` to `parse_json_response(reply)`.\n" +
          "**5)** Still inside `try:`, add `(review, parsed[\"sentiment\"], parsed[\"confidence\"])` to `results` with `results.append((a, b, c))`.\n" +
          "**6)** Add `except (json.JSONDecodeError, ValueError) as e:`. Inside it, add `(review, f\"PARSE ERROR: {e}\", None)` to `results`. The confidence is `None`, not the string `\"None\"`.\n\n" +
          "A bad reply becomes an error row instead of crashing the loop.\n\n" +
          "Rows in `results` look like this (the confidence numbers vary):\n" +
          "`(\"the movie was absolutely wonderful and kept me hooked the whole time\", \"positive\", 0.95)`\n" +
          "`(\"some review\", \"PARSE ERROR: Expecting value: line 1 column 1 (char 0)\", None)`\n\n" +
          "**Check:** after the loop, `len(results) == 8`. Every item is a tuple of length 3, even for failures.",
      },
      {
        code: "except (..., ...) as e:",
        text: "Catches the two kinds of bad reply: `json.JSONDecodeError` (not JSON at all) and `ValueError` (a key is missing). `e` holds the error message for the row.",
      },
      {
        code: "for review, sentiment, confidence in results:",
        text:
          "**Step 4: Print one aligned line per result**\n" +
          "Do this after the loop above (not inside it).\n\n" +
          "**1)** Loop over `results` with `for review, sentiment, confidence in results:`.\n" +
          "**2)** Print one line made of: the sentiment (or error text) left-aligned in 25 characters (`{sentiment:<25}`), then `conf=` and the confidence, then two spaces, then `review[:55]`.\n\n" +
          "A long error text or a `None` confidence prints as it is. That is fine.\n\n" +
          "Example, using the first review in the data:\n" +
          "`positive                  conf=0.95  the movie was absolutely wonderful and kept me hooked t`\n\n" +
          "**Check:** you see 8 lines. In each line, `conf=` starts in the same column when the sentiment is shorter than 25 characters.",
      },
    ],
  },
];
