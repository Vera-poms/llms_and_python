import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 11 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab11Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def build_direct_prompt(",
    hints: [
      {
        code: "def build_direct_prompt(",
        block: "function",
        text:
          "Builds a prompt that asks the question directly and wants only a short answer. You get `question`, a string like `\"What is 12 * 13?\"`. " +
          "You give back a list with ONE message dict, like `[{\"role\": \"user\", \"content\": \"What is 12 * 13? Answer in as few words as possible.\"}]` (your words may differ).",
      },
      {
        code: 'raise NotImplementedError("build_direct_prompt()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          '`text = ...` (the question plus a \"short answer\" instruction), then `return [{"role": "user", "content": ...}]`.\n\n' +
          "**1)** Set `text` to the question, a space, then a short-answer request such as `\"Answer in as few words as possible.\"`.\n" +
          "**2)** Return a list with one dict: role `\"user\"` and content `text`.\n\n" +
          "**Check:** `len(build_direct_prompt(\"Hi\"))` is `1`, the item's `\"role\"` is `\"user\"`, and its `\"content\"` contains `\"Hi\"`.",
      },
      {
        code: "def build_cot_prompt(",
        block: "function",
        text:
          "Builds a prompt that asks the model to think step by step first (chain-of-thought). You get `question`, a string like `\"What is 12 * 13?\"`. " +
          "You give back a list with ONE user message. Its content has the question, the phrase `step by step`, and a request to end the reply with a last line like `Answer: <final answer>`. " +
          "That `Answer:` line is the marker that lets `extract_final_answer` find the result later.",
      },
      {
        code: 'raise NotImplementedError("build_cot_prompt()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          '`text = ...` (the question, then \"step by step\", then the Answer: line request), then `return [{"role": "user", "content": ...}]`.\n\n' +
          "**1)** Start `text` with `question`.\n" +
          "**2)** Add an instruction to think `step by step`. Use exactly that phrase, because the checks look for it.\n" +
          "**3)** Add a request to end with a last line like `Answer: <final answer>`.\n" +
          "**4)** Return a list with one dict: role `\"user\"` and content `text`.\n\n" +
          "**Check:** `\"step by step\" in build_cot_prompt(\"What is 12 * 13?\")[0][\"content\"].lower()` is `True`, and the content also has `\"Answer:\"`.",
      },
      {
        code: "def extract_final_answer(",
        block: "function",
        text:
          "Picks the final answer out of a model reply. You get `reply_text`, the whole reply (maybe many lines), and `marker`, which is `\"Answer:\"` unless the caller gives another one. " +
          "You give back everything after the LAST `marker`, with spaces and new lines removed from both ends. If `marker` is not in the reply, you give back the whole reply with the spaces removed. " +
          "Example: `extract_final_answer(\"Let's see... 12*13=156.\\nAnswer: 156\")` gives `\"156\"`, and `\"no marker here\"` gives `\"no marker here\"`.",
      },
      {
        code: 'raise NotImplementedError("extract_final_answer()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`if ... not in reply_text:` and inside it `return ...`. Then `after = reply_text.rsplit(..., 1)[...]` and `return ...`.\n\n" +
          "**1)** If `marker` is not in `reply_text`, return `reply_text.strip()`.\n" +
          "**2)** Otherwise, split with `reply_text.rsplit(marker, 1)` and take the piece after the split (index `1`). It splits at the last marker, so `\"Answer: 1\\nAnswer: 2\"` gives `\"2\"`.\n" +
          "**3)** Return that piece with `.strip()`.\n\n" +
          "The match is exact, so `\"answer:\"` in lowercase does not match.\n\n" +
          "**Check:** `extract_final_answer(\"so... Answer: yes\")` is `\"yes\"`, `extract_final_answer(\"just text\")` is `\"just text\"`, and `extract_final_answer(\"Reasoning\\nFinal: 7\", \"Final:\")` is `\"7\"`.",
      },
      {
        code: 'assert "step by step" in build_cot_prompt(',
        text: "A self-check. The chain-of-thought prompt's content must have `step by step` in it (capital letters are ignored because of `.lower()`). If not, the check stops and shows what your code gave back.",
      },
      {
        code: 'assert extract_final_answer("Let\'s see... 12*13=156.\\nAnswer: 156") == "156"',
        text: "Taking the answer from `\"Let's see... 12*13=156.\\nAnswer: 156\"` must give `\"156\"`.",
      },
      {
        code: 'assert extract_final_answer("no marker here") == "no marker here"',
        text: "A reply with no marker must come back unchanged: `\"no marker here\"`.",
      },
      {
        code: 'print("All checks passed.")',
        text: "If every check above passed, you see this message. If you see `NotImplementedError`, replace the `raise` line in that function with your code.",
      },
    ],
  },
];
