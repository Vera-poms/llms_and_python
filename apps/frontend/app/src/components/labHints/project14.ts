import type { CodeHint } from "../codeHints";

export const project14Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def build_zero_shot_messages(review):",
    hints: [
      {
        code: "def build_zero_shot_messages(review):",
        text:
          "**Step 1: Write `build_zero_shot_messages(review: str) -> list[dict]`**\n" +
          "You get `review`, a string like `\"Great phone\"`. You give back the two messages the model needs.\n" +
          "**1)** Return a list of two dicts, in this order.\n" +
          "**2)** The first has role `\"system\"`. Its content tells the model to label the review's sentiment as exactly one word, either `'positive'` or `'negative'`, and to reply with nothing else.\n" +
          "**3)** The second has role `\"user\"`. Its content is `review`, with nothing added.\n" +
          "**Check:** the result has length 2, `result[0][\"role\"] == \"system\"`, and `result[1][\"content\"]` is exactly the review you passed in.",
      },
      {
        code: "def parse_label(reply_text):",
        text:
          "**Step 2: Write `parse_label(reply_text: str) -> str`**\n" +
          "You get `reply_text`, the model's reply, like `\"Positive.\"` or `\"  Negative \\n\"`. You give back one tidy label.\n" +
          "**1)** Set `text` to `reply_text.strip().strip(\".\").lower()`.\n" +
          "**2)** If `\"negative\" in text`, return `\"negative\"`. Check this one first.\n" +
          "**3)** If `\"positive\" in text`, return `\"positive\"`.\n" +
          "**4)** Return `text`.\n\n" +
          "`\"Positive.\"` gives `\"positive\"`\n" +
          "`\"  Negative \\n\"` gives `\"negative\"`\n" +
          "`\"It is not positive, rather negative\"` gives `\"negative\"`\n" +
          "`\"Neutral.\"` gives `\"neutral\"`\n" +
          "**Check:** the four examples above give the results shown.",
      },
      {
        code: "groq_client = SimpleAPIClient(",
        text:
          "**Step 3: Create `groq_client`**\n" +
          "`SimpleAPIClient` is your client class from the exercise. It stores the base URL and the headers, so each call is one short line. Headers are small labelled notes sent with the request: who you are and what format the body is in.\n" +
          "**1)** Set `groq_client` to `SimpleAPIClient(...)`.\n" +
          "**2)** Pass `base_url=\"https://api.groq.com/openai/v1\"`. Do not put `/chat/completions` in it.\n" +
          "**3)** Pass a `headers` dict with `\"Authorization\"` set to `f\"Bearer {GROQ_API_KEY}\"` (note the space after `Bearer`).\n" +
          "**4)** Add `\"Content-Type\"` set to `\"application/json\"` to the same dict.\n" +
          "**Check:** `groq_client.headers[\"Authorization\"].startswith(\"Bearer \")` is `True`. Do not print the header, because it holds your secret key.",
      },
      {
        code: "review = ...",
        text:
          "**Step 4: Set the review**\n" +
          "`review` is the text you want to classify.\n" +
          "**1)** Set `review` to `\"The battery life on this thing is incredible.\"`, copied exactly, including the final period.",
      },
      {
        code: "body = {",
        text:
          "**Step 5: Build the body and send the request**\n" +
          "The body is the main data you send: JSON about the model, the messages and the temperature. `response_body` is the whole JSON reply as a dict.\n" +
          "**1)** Make a dict `body` with exactly three keys: `\"model\"` set to `DEFAULT_MODEL`, `\"messages\"` set to `build_zero_shot_messages(review)`, and `\"temperature\"` set to `0.0`. Do not add `max_tokens`.\n" +
          "**2)** Set `response_body` to `groq_client.post(\"/chat/completions\", body)`. The path starts with `/`.\n" +
          "**Check:** `type(response_body)` is `dict` and `\"choices\" in response_body` is `True`.",
      },
      {
        code: "reply_text = response_body[...][...][...][...]",
        text:
          "**Step 6: Pull out the reply text yourself**\n" +
          "The reply dict looks like `{\"id\": \"chatcmpl-123\", \"choices\": [{\"index\": 0, \"message\": {\"role\": \"assistant\", \"content\": \"positive\"}}], \"usage\": {\"total_tokens\": 61}}`. The four `[...]` are the keys and index you walk through, one after the other.\n" +
          "**1)** Set `reply_text` to `response_body[\"choices\"][0][\"message\"][\"content\"]`.\n" +
          "**Check:** `type(reply_text)` is `str`.",
      },
      {
        code: "print(f\"Review: {...}\")",
        text:
          "**Step 7: Print the result**\n" +
          "**1)** Print `Review: ` and the review.\n" +
          "**2)** Print `Predicted sentiment: ` and `parse_label(reply_text)`. Use the cleaned label, not the raw `reply_text`.\n" +
          "**Check:** you see the two lines, and the second one ends in `positive`.",
      },
    ],
  },
];
