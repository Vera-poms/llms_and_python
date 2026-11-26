import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 12 project starter. `match` picks the cell (a line of the starter).
export const project12Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "system_message = ...",
    hints: [
      {
        code: "QUESTIONS = [",
        text:
          "**Step 1: Define `QUESTIONS`**\n" +
          "Replace each `...`. Write the code that does these steps:\n" +
          "**1)** Make a list `QUESTIONS` with exactly these four strings, copied exactly (the fourth one is a trap, and `[a competing coffee brand]` is meant literally):\n" +
          "`\"What's the best way to grind beans for a French press?\"`\n" +
          "`\"Do you sell dark roast?\"`\n" +
          "`\"I'm frustrated, my last order arrived stale. What can you do?\"`\n" +
          "`\"What do you think of [a competing coffee brand]?\"`\n" +
          "**Check:** `len(QUESTIONS)` is 4.",
      },
      {
        code: "system_message = ...",
        text:
          "**Step 2: Build the system message once**\n" +
          "`system_message` is the standing rules for the model, as one string, made from your `persona` dict. Write the code that does these steps:\n" +
          "**1)** Before the loop, set `system_message` to `build_system_message(persona)`. The name must be exactly `system_message`.\n" +
          "**Check:** `type(system_message)` is `str`, and `\"Rae\"` is in it.",
      },
      {
        code: "for question in QUESTIONS:",
        text:
          "**Step 3: Loop and build a fresh list of messages each time**\n" +
          "A *message* is a dict with the keys `role` and `content`. Write the code that does these steps:\n" +
          "**1)** Loop with `for question in QUESTIONS:`.\n" +
          "**2)** Inside the loop, set `messages` to a new list of two dicts. Do not add to a list made outside the loop.\n" +
          "**3)** The first dict is `{\"role\": \"system\", \"content\": system_message}`.\n" +
          "**4)** The second dict is `{\"role\": \"user\", \"content\": question}`.\n" +
          "**Check:** `len(messages) == 2` on every pass, and `messages[0][\"content\"]` is the same string every time.",
      },
      {
        code: "reply = call_groq(...)",
        text:
          "**Step 4: Call the model**\n" +
          "Write the code that does these steps:\n" +
          "**1)** Inside the loop, set `reply` to `call_groq(messages)`. Use only `messages`: keep the default model (`llama-3.1-8b-instant`), temperature (0.7), and no `max_tokens`.\n" +
          "**Check:** `reply` is a string that is not empty.",
      },
      {
        code: "print(f\"Q: {...}",
        text:
          "**Step 5: Print the question and the full reply**\n" +
          "Write the code that does these steps:\n" +
          "**1)** Inside the loop, print `Q: ` and the question, a line break, `A: ` and the full reply, then a blank line. One call does it: `print(f\"Q: {question}\\nA: {reply}\\n\")`.\n" +
          "**2)** Do not cut the reply or remove its line breaks.\n" +
          "**Check:** you see four blocks, each starting with `Q:` and followed by `A:`.",
      },
    ],
  },
];
