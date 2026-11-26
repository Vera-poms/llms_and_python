import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 13 project starter. `match` picks the cell (a line of the starter).
export const project13Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "conversation_turns = [",
    hints: [
      {
        code: "my_profile = {",
        text:
          "**Step 1: Define `my_profile`**\n" +
          "A dict that describes you. Replace each `...`. Write the code that does these steps:\n" +
          "**1)** Make a dict `my_profile` with exactly the keys `name`, `role`, `tone`, `facts`, `boundaries`.\n" +
          "**2)** Set `name` to your real name, `role` to one short phrase about your role, and `tone` to a few words for how you talk.\n" +
          "**3)** Set `facts` to a list of at least two true things about you.\n" +
          "**4)** Set `boundaries` to a list of at least one thing the twin must refuse or avoid.\n" +
          "**5)** Use real content, not placeholders like `\"your name\"`.\n" +
          "Example with made-up values (use your own):\n" +
          "`{`\n" +
          "`    \"name\": \"Ada\",`\n" +
          "`    \"role\": \"a data analyst who teaches evening classes\",`\n" +
          "`    \"tone\": \"warm, curious and a little playful\",`\n" +
          "`    \"facts\": [\"likes pandas\", \"runs three times a week\"],`\n" +
          "`    \"boundaries\": [\"do not give medical advice\"],`\n" +
          "`}`\n" +
          "**Check:** `print(type(my_profile[\"facts\"]))` shows `<class 'list'>`, and `len(my_profile[\"facts\"]) >= 2`.",
      },
      {
        code: "messages = [{\"role\": \"system\"",
        text:
          "**Step 2: Start the `messages` list**\n" +
          "`messages` is the whole chat so far. The chat \"memory\" is just this list. Write the code that does these steps:\n" +
          "**1)** Set `messages` to a list with one dict: role `\"system\"`, and as content `build_digital_twin_system_prompt(my_profile)`.\n" +
          "**2)** Call that function only here, not again in the loop.\n" +
          "**Check:** `len(messages)` is `1` and `messages[0][\"role\"]` is `\"system\"`.",
      },
      {
        code: "conversation_turns = [",
        text:
          "**Step 3: Define `conversation_turns`**\n" +
          "The two things the user will say. Write the code that does these steps:\n" +
          "**1)** Make a list `conversation_turns` with exactly these two strings:\n" +
          "`\"Hi! What are you working on lately?\"`\n" +
          "`\"What's your take on learning by building real projects vs. reading theory?\"`\n" +
          "**Check:** `len(conversation_turns)` is `2`.",
      },
      {
        code: "for user_message in conversation_turns:",
        text:
          "**Step 4: Write the chat loop**\n" +
          "Write the code that does these steps, in this order:\n" +
          "**1)** Loop with `for user_message in conversation_turns:`.\n" +
          "**2)** Add `{\"role\": \"user\", \"content\": user_message}` to `messages` with `messages.append(...)`.\n" +
          "**3)** Set `reply` to `call_groq(messages)`. Pass the whole `messages` list. Keep the default model (`llama-3.1-8b-instant`), temperature (0.7), and no `max_tokens`.\n" +
          "**4)** Add `{\"role\": \"assistant\", \"content\": reply}` to `messages`.\n" +
          "**5)** Print `You: ` and the user message.\n" +
          "**6)** Print `Twin: ` and the reply, then a blank line (end with `\\n` or add an empty `print()`).\n" +
          "The second call sees the first question and answer, so the twin can refer back to turn 1.\n" +
          "**Check:** after the loop, `[m[\"role\"] for m in messages]` equals `['system', 'user', 'assistant', 'user', 'assistant']`.",
      },
      {
        code: "reply = call_groq(...)",
        text: "Send the **whole** `messages` list: `call_groq(messages)`. The model has no memory, so it only knows what is in this list.",
      },
      {
        code: "print(f\"Final messages list has {...} turns.\")",
        text:
          "**Step 5: Print the final count**\n" +
          "Write the code that does these steps:\n" +
          "**1)** After the loop (not inside it), print `Final messages list has N turns.` where `N` is `len(messages)`. Use an f-string.\n" +
          "With two turns, `N` is `5` (the system message counts as a turn).\n" +
          "**Check:** the last line printed reads `Final messages list has 5 turns.`",
      },
    ],
  },
];
