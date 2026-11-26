import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 10 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab10Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def build_few_shot_messages(",
    hints: [
      {
        code: "import json",
        text: "Gives you the `json` tools. You need `json.dumps` to turn a dict into JSON text, and `json.loads` to read JSON text back into a dict.",
      },
      {
        code: "def build_few_shot_messages(",
        block: "function",
        text:
          "Builds the chat messages that make a model reply in JSON. You get `examples` (a list of `(review, result_dict)` pairs, like `[(\"Amazing!\", {\"sentiment\": \"positive\", \"confidence\": 0.95})]`) " +
          "and `query` (the new review, like `\"Terrible.\"`). You give back a list of message dicts: first one `system` message, then a `user` message and an `assistant` message for each example, and last one `user` message with `query`. " +
          "Example: with the pair above and the query `\"Terrible.\"` you get 4 messages, and the last one is `{\"role\": \"user\", \"content\": \"Terrible.\"}`.",
      },
      {
        code: 'raise NotImplementedError("build_few_shot_messages()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          '`messages = [{"role": "system", "content": ...}]`, then `for review, result in examples:` and inside it `messages.append(...)` for the user message and `messages.append(...)` for the assistant message. After the loop, `messages.append(...)` for the last user message, then `return messages`.\n\n' +
          "**1)** Start `messages` with one `system` message. Its content is a sentence telling the model to reply with ONLY a JSON object that has the keys `sentiment` and `confidence`, and no other text.\n" +
          "**2)** For each `(review, result)` in `examples`, add a `user` message whose content is `review`.\n" +
          "**3)** Right after it, add an `assistant` message whose content is `json.dumps(result)`. That is a JSON string, not a dict.\n" +
          '**4)** After the loop, add a last `user` message whose content is `query`.\n' +
          "**5)** Return `messages`.\n\n" +
          '**Check:** with the example above you get 4 messages, and the last one is `{"role": "user", "content": "Terrible."}`.',
      },
      {
        code: "def parse_json_response(",
        block: "function",
        text:
          "Turns a model reply into a dict. You get `text`, the raw reply. It may be plain JSON, like `'{\"sentiment\": \"negative\", \"confidence\": 0.8}'`, or the same JSON inside a fence (three backticks, the word `json`, the JSON, three backticks). " +
          "You give back the dict read from the JSON, like `{\"sentiment\": \"negative\", \"confidence\": 0.8}`. " +
          "It raises `ValueError` if `sentiment` or `confidence` is missing. If the text is not JSON at all, `json.loads` raises `json.JSONDecodeError` (a kind of `ValueError`). Do not catch that one, let it go up.",
      },
      {
        code: 'raise NotImplementedError("parse_json_response()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`text = text.strip()`, then `if text.startswith(...):` and inside it `text = ...` (remove the backticks and the word json). Then `data = json.loads(...)` and `missing = [key for key in (...) if key not in data]`, then `if missing:` with `raise ValueError(...)`. Last, `return data`.\n\n" +
          "**1)** Remove spaces and blank lines from both ends of `text`.\n" +
          "**2)** If it starts with three backticks, remove them and the word `json` after them (if there), then remove the spaces again.\n" +
          "**3)** Read it with `json.loads`. Do not catch its error.\n" +
          "**4)** If `sentiment` or `confidence` is missing, raise `ValueError`.\n" +
          "**5)** Return the dict.\n\n" +
          "**Check:** `parse_json_response('{\"sentiment\": \"positive\", \"confidence\": 1}')` gives back `{\"sentiment\": \"positive\", \"confidence\": 1}`, and `parse_json_response('{\"foo\": 1}')` raises `ValueError`.",
      },
      {
        code: "examples = [",
        text: "A tiny test: one example review with its JSON answer.",
      },
      {
        code: 'messages = build_few_shot_messages(examples, "Terrible.")',
        text: "Runs **your** `build_few_shot_messages` on the example and the query `\"Terrible.\"`, and keeps the messages.",
      },
      {
        code: 'assert messages[0]["role"] == "system"',
        text: "A self-check. The first message must have the role `\"system\"`. If not, the check stops and shows what your code gave back.",
      },
      {
        code: 'assert messages[-1] == {"role": "user", "content": "Terrible."}',
        text: "The last message must be exactly `{\"role\": \"user\", \"content\": \"Terrible.\"}`: a user message holding the query.",
      },
      {
        code: 'assert any(m["role"] == "assistant" for m in messages)',
        text: "At least one message must have the role `\"assistant\"`. That is the example answer you add for each example.",
      },
      {
        code: "parsed = parse_json_response(",
        text: "Runs **your** `parse_json_response` on a reply wrapped in a fence (three backticks and the word `json` around the JSON), and keeps the dict.",
      },
      {
        code: 'assert parsed == {"sentiment": "negative", "confidence": 0.8}',
        text: "A fenced reply must be read as `{\"sentiment\": \"negative\", \"confidence\": 0.8}`. So your code must remove the fence before `json.loads`.",
      },
      {
        code: "try:",
        text: "Starts a test that expects an error. The next lines give a reply with a missing key.",
      },
      {
        code: "parse_json_response('{\"sentiment\": \"negative\"}')",
        text: "This reply has no `confidence` key, so your function must raise `ValueError`.",
      },
      {
        code: 'raise AssertionError("should have raised ValueError for a missing key")',
        text: "Only reached if your function did **not** raise. Then the check fails with this message.",
      },
      {
        code: "except ValueError:",
        text: "Catches the `ValueError` you were supposed to raise. If it was raised, the test is happy and goes on.",
      },
      {
        code: 'print("All checks passed.")',
        text: "If every check above passed, you see this message. If you see `NotImplementedError`, replace the `raise` line in that function with your code.",
      },
    ],
  },
];
