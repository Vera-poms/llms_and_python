import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 17 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab17Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def trim_messages(",
    hints: [
      {
        code: "def count_tokens(text: str) -> int:",
        block: "function",
        text: "Already written for you. It gives the rough size of a text: about 4 characters make 1 token, and never less than 1. For example `count_tokens(\"Hi there!\")` is `3`.",
      },
      {
        code: "def trim_messages(",
        block: "function",
        text:
          "Shrinks a chat history until it fits in a token budget. You get `messages` (a list of dicts like `{\"role\": \"user\", \"content\": \"Hi!\"}`, oldest first) and `max_tokens`. You give back a new list: the system message first, then the newest messages that fit, in their original order. The list you were given must not change. Example: with a budget of 12, the test history below gives back the system message and the last user message.",
      },
      {
        code: "raise NotImplementedError(\"trim_messages()",
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`def trim_messages(messages, max_tokens):`\n" +
          "`    system = messages[:1] if ... else []`\n" +
          "`    rest = messages[len(system):]`\n" +
          "`    used = ...`\n" +
          "`    kept = []`\n" +
          "`    for message in reversed(rest):`\n" +
          "`        cost = ...`\n" +
          "`        if ...:`\n" +
          "`            break`\n" +
          "`        kept.append(message)`\n" +
          "`        used += cost`\n" +
          "`    kept.reverse()`\n" +
          "`    return system + kept`\n" +
          "(keep the `def` line that is already there, and replace each `...`)\n" +
          "**1)** Set `system` to `messages[:1]` if the first message has the role `\"system\"`, otherwise to `[]`.\n" +
          "**2)** Set `rest` to `messages[len(system):]`.\n" +
          "**3)** Set `used` to the sum of `count_tokens(m[\"content\"])` over `system` (0 if empty). The system message stays even if it is over the budget.\n" +
          "**4)** Start `kept` as an empty list.\n" +
          "**5)** Loop over `reversed(rest)`, newest first.\n" +
          "**6)** For each `message`, set `cost` to `count_tokens(message[\"content\"])`.\n" +
          "**7)** If `used + cost > max_tokens`, `break`. Do not skip the message and go on.\n" +
          "**8)** Otherwise add `message` to `kept` and add `cost` to `used`.\n" +
          "**9)** After the loop, call `kept.reverse()` and return `system + kept`.\n" +
          "Do not change the list you were given.\n" +
          "**Check:** with a system message of 5 tokens and a budget of 12, a newest message of 6 tokens fits (5 + 6 = 11). An older message of 3 tokens does not (11 + 3 = 14).",
      },
      {
        code: "history = [",
        text: "A test chat of four messages: one system message, then user, assistant and user.",
      },
      {
        code: "# token sizes: 5, 3, 9, 5",
        text: "How many tokens each message costs, in order. All four add up to 22.",
      },
      {
        code: "assert trim_messages(history, 100) == history",
        text: "A self-check. A big budget of 100 must keep all four messages. If it does not, the check stops and shows what your code gave back.",
      },
      {
        code: "assert trim_messages(history, 12)",
        text: "A small budget of 12 must keep the system message (5) and only the newest turn (5): 5 + 5 = 10 fits, but adding the 9-token reply would make 19.",
      },
      {
        code: "assert len(history) == 4",
        text: "Your function must not change the list it was given, so `history` must still have four messages.",
      },
      {
        code: "assert trim_messages(history, 1)",
        text: "With a budget of 1 nothing else fits, but the system message always stays. So only the system message is left.",
      },
      {
        code: "print(\"All checks passed.\")",
        text: "You only reach this line if all four checks held.",
      },
    ],
  },
];
