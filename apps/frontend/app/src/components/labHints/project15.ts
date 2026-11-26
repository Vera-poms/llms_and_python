import type { CodeHint } from "../codeHints";

export const project15Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def real_transport(messages, api_key, model):",
    hints: [
      {
        code: "def build_digital_twin_system_prompt(profile):",
        text:
          "**Step 1: Define `build_digital_twin_system_prompt(profile: dict) -> str`**\n" +
          "You get `profile`, a dict with `name`, `role`, `tone` (strings) and `facts`, `boundaries` (lists of strings). Example: `{\"name\": \"Ada\", \"role\": \"a data analyst\", \"tone\": \"warm, curious\", \"facts\": [\"likes pandas\", \"runs weekly\"], \"boundaries\": [\"no medical advice\"]}`. `lines` is the list of text lines that you join at the end.\n" +
          "**1)** Start a list `lines` with three strings: a line saying the model is role-playing as that person (use the name and role), a line with the tone, and a heading for facts.\n" +
          "**2)** For each fact, add a bullet line `\"- \" + fact` to `lines`.\n" +
          "**3)** Add a heading line for boundaries.\n" +
          "**4)** For each boundary, add a bullet line `\"- \" + boundary`.\n" +
          "**5)** Join `lines` with `\"\\n\"` and return the result.\n\n" +
          "For Ada, one valid result is (your heading words may differ), 7 lines:\n" +
          "`You are role-playing as Ada, a data analyst.`\n" +
          "`Speak in a tone that is warm, curious.`\n" +
          "`Facts you can draw on about this person:`\n" +
          "`- likes pandas`\n" +
          "`- runs weekly`\n" +
          "`Boundaries you must respect:`\n" +
          "`- no medical advice`\n" +
          "**Check:** `print(build_digital_twin_system_prompt(my_profile))` shows one bullet per fact and per boundary, and has your name, role and tone. The result is a `str`.",
      },
      {
        code: "def real_transport(messages, api_key, model):",
        text:
          "**Step 2: Define `real_transport(messages, api_key, model) -> str`**\n" +
          "A transport is a plug-in function that makes the actual network call. Your class calls `transport(messages, api_key, model)` and gets a reply string back.\n" +
          "**1)** Define `real_transport` with the three parameters `messages`, `api_key`, `model`, in this order.\n" +
          "**2)** Return `call_groq(messages, api_key=api_key, model=model)`.\n" +
          "**Check:** `callable(real_transport)` is `True`. Do not call it yet.",
      },
      {
        code: "my_profile = {",
        text:
          "**Step 3: Define `my_profile`**\n" +
          "**1)** Make a dict `my_profile` with exactly the keys `name`, `role`, `tone`, `facts`, `boundaries`.\n" +
          "**2)** Use your own real details: at least two facts and at least one boundary (both lists of strings).\n" +
          "**3)** Use no placeholder text like `\"your name\"`.\n" +
          "**Check:** `len(my_profile[\"facts\"]) >= 2` and `len(my_profile[\"boundaries\"]) >= 1`.",
      },
      {
        code: "twin = GroqClient(",
        text:
          "**Step 4: Create `twin`**\n" +
          "`GroqClient` is your class from the exercise. It owns the messages list.\n" +
          "**1)** Set `twin` to `GroqClient(...)`.\n" +
          "**2)** Pass `api_key=GROQ_API_KEY` and `model=DEFAULT_MODEL`.\n" +
          "**3)** Pass `system_prompt=build_digital_twin_system_prompt(my_profile)`.\n" +
          "**4)** Pass `transport=real_transport`. Write the function name only, with no brackets.\n" +
          "**Check:** `len(twin.history)` is `1` and `twin.history[0][\"role\"]` is `\"system\"`.",
      },
      {
        code: "for user_message in [..., ...]:",
        text:
          "**Step 5: Chat through `twin.send`**\n" +
          "**1)** Loop over a list of exactly these two strings, in this order: `\"Hi! What are you working on lately?\"` and `\"What's the most useful thing you've learned recently?\"`.\n" +
          "**2)** Set `reply` to `twin.send(user_message)`.\n" +
          "**3)** Print `You: ` and the user message.\n" +
          "**4)** Print `Twin: ` and the reply.\n" +
          "**5)** Print a blank line.\n" +
          "Do not call `add_user_message` or `add_assistant_message` here. `send` already does it.\n" +
          "**Check:** after the loop, `len(twin.history)` is `5`.",
      },
      {
        code: "print(\"--- Full messages list ---\")",
        text:
          "**Step 6: Print the full history**\n" +
          "**1)** Print the exact line `--- Full messages list ---`.\n" +
          "**2)** Loop with `for message in twin.history:`.\n" +
          "**3)** Print `f\"{message['role']:<10} {message['content'][:80]}\"`. The role is padded to 10 characters, then one space, then the first 80 characters of the content.\n\n" +
          "Example lines (no quotes in your output):\n" +
          "`system     You are role-playing as Ada, a data analyst.\\nSpeak in a tone that is warm, curio`\n" +
          "`user       Hi!`\n" +
          "A system prompt has several lines, so its first 80 characters may hold a newline. That is normal. Cutting is for display only, so do not shorten the stored content.\n" +
          "**Check:** you see 5 entries in the order system, user, assistant, user, assistant.",
      },
    ],
  },
];
