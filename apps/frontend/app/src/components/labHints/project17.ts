import type { CodeHint } from "../codeHints";

export const project17Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "before = sum(... for m in CHAT_HISTORY)",
    hints: [
      {
        code: "before = sum(... for m in CHAT_HISTORY)",
        text:
          "**Step 1: measure the full history**\n" +
          "You get `CHAT_HISTORY` (a list of message dicts, each with `\"role\"` and `\"content\"`) and `count_tokens` (gives a rough token count for a string). Write the code that does this step:\n\n" +
          "**1)** Set `before` to `sum(count_tokens(m[\"content\"]) for m in CHAT_HISTORY)`.\n\n" +
          "**Check:** `before` is `101`.",
      },
      {
        code: "trimmed = trim_messages(..., ...)",
        text:
          "**Step 2: trim to the budget**\n" +
          "You get `CHAT_HISTORY` and your `trim_messages`. It gives back a **new** list with the system message and the newest messages that fit in the budget. Write the code that does this step:\n\n" +
          "**1)** Set `trimmed` to `trim_messages(CHAT_HISTORY, 60)`.\n\n" +
          "**Check:** `trimmed` is a list of `5` messages. The first one is still the `\"system\"` message. `CHAT_HISTORY` still has 9 messages.",
      },
      {
        code: "after = sum(... for m in trimmed)",
        text:
          "**Step 3: measure the trimmed history**\n" +
          "You get `trimmed`. Write the code that does this step:\n\n" +
          "**1)** Set `after` to `sum(count_tokens(m[\"content\"]) for m in trimmed)`.\n\n" +
          "**Check:** `after` is `59`, and it is not more than `60`.",
      },
      {
        code: "print(f\"before: ... messages, ... tokens\")",
        text:
          "**Step 4: print the result**\n" +
          "You get `before`, `after`, `CHAT_HISTORY` and `trimmed`. Write the code that does these steps:\n\n" +
          "**1)** Print `f\"before: {len(CHAT_HISTORY)} messages, {before} tokens\"`.\n" +
          "**2)** Print `f\"after: {len(trimmed)} messages, {after} tokens\"`.\n" +
          "**3)** Loop with `for message in trimmed:`.\n" +
          "**4)** Print `<role>: <content>` for each message. In an f-string with double quotes, use single quotes for the key: `f\"{message['role']}\"`.\n\n" +
          "The output is exactly:\n" +
          "`before: 9 messages, 101 tokens`\n" +
          "`after: 5 messages, 59 tokens`\n" +
          "`system: You are Ada's digital twin. Answer as Ada, in a warm and short way.`\n" +
          "`user: And what does she do for fun?`\n" +
          "`assistant: She bakes bread, runs in the park and watches football.`\n" +
          "`user: Has she travelled anywhere lately?`\n" +
          "`assistant: Last summer she flew to Accra and Lisbon.`\n\n" +
          "**Check:** two summary lines, then `5` message lines, and nothing else.",
      },
    ],
  },
];
