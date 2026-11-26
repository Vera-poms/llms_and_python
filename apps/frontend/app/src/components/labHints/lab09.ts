import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 9 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab09Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def build_zero_shot_messages(review: str)",
    hints: [
      {
        code: "def build_zero_shot_messages(review: str) -> list[dict]:",
        block: "function",
        text:
          "Packages the request the way a chat model expects it. You get `review`, a string like `\"This product is amazing!\"`. " +
          "You give back a list of two message dicts, the system message first and the user message last: " +
          "`[{\"role\": \"system\", \"content\": \"...instructions...\"}, {\"role\": \"user\", \"content\": \"This product is amazing!\"}]`.",
      },
      {
        code: "raise NotImplementedError(\"build_zero_shot_messages()",
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`def build_zero_shot_messages(review):`\n`    instruction = \"...\"`\n`    system_message = {\"role\": \"system\", \"content\": ...}`\n`    user_message = {\"role\": ..., \"content\": ...}`\n`    return [..., ...]`\n" +
          "**1)** Set `instruction` to a sentence that tells the model to classify the sentiment as exactly one word, `positive` or `negative`, and to reply with nothing else.\n" +
          "**2)** Set `system_message` to a dict with role `\"system\"` and content `instruction`.\n" +
          "**3)** Set `user_message` to a dict with role `\"user\"` and content `review`.\n" +
          "**4)** Return `[system_message, user_message]`.\n" +
          "**Check:** `build_zero_shot_messages(\"Great!\")[-1]` is `{\"role\": \"user\", \"content\": \"Great!\"}`, and `len(...)` is 2.",
      },
      {
        code: "def parse_label(reply_text: str) -> str:",
        block: "function",
        text:
          "Cleans up a model reply into a tidy label. You get `reply_text`, what the model said, like `\"Positive.\"`, `\"  NEGATIVE\"` with a new line after it, or `\"The sentiment is negative\"`. " +
          "You give back `\"positive\"` or `\"negative\"` if the reply mentions one of them. If it mentions neither, you give back the cleaned text (no extra spaces or dots, all lowercase). " +
          "Those three examples give `\"positive\"`, `\"negative\"` and `\"negative\"`.",
      },
      {
        code: "raise NotImplementedError(\"parse_label()",
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`def parse_label(reply_text):`\n`    cleaned = reply_text.strip()...`\n`    if ... in cleaned:`\n`        return \"negative\"`\n`    if ... in cleaned:`\n`        return \"positive\"`\n`    return ...`\n" +
          "**1)** Set `cleaned` to `reply_text` with spaces cut from both ends (`.strip()`), then dots cut from both ends (`.strip(\".\")`), then made lowercase (`.lower()`).\n" +
          "**2)** If `\"negative\"` is in `cleaned`, return `\"negative\"`.\n" +
          "**3)** If `\"positive\"` is in `cleaned`, return `\"positive\"`.\n" +
          "**4)** Otherwise, return `cleaned` as it is, so you can see what the model said.\n" +
          "**Check:** `parse_label(\"Negative.\")` is `\"negative\"`. `parse_label(\"  Maybe  \")` is `\"maybe\"`.",
      },
      {
        code: "messages = build_zero_shot_messages(",
        text: "Runs **your** `build_zero_shot_messages` on one review and keeps the list it gives back.",
      },
      {
        code: "assert messages[-1][\"role\"] == \"user\"",
        text: "A self-check. The last message must be the user message, so its role must be `\"user\"`.",
      },
      {
        code: "assert \"This product is amazing!\" in messages[-1][\"content\"]",
        text: "The user message's content must contain the review text.",
      },
      {
        code: "assert parse_label(\"Positive.\")",
        text: "`\"Positive.\"` has a dot and a capital letter. After cleaning, your code must give back `\"positive\"`.",
      },
      {
        code: "assert parse_label(\"  NEGATIVE",
        text: "Extra spaces and a new line around a capitalised word. Your code must give back `\"negative\"`.",
      },
      {
        code: "assert parse_label(\"The sentiment is positive\")",
        text: "The label is hidden inside a longer sentence. Your code must still give back `\"positive\"`.",
      },
      {
        code: "print(\"All checks passed.\")",
        text: "If everything passes, you see this message. Your two helpers are then ready to use with a real model later.",
      },
    ],
  },
];
