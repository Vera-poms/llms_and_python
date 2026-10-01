# Project: Zero-Shot Sentiment Through a Reusable API Client

**Goal**
Repeat a zero-shot sentiment classification against Groq, but send the request through your `SimpleAPIClient` class instead of the hand-written `requests.post` inside `call_groq`. This shows the five universal API components (endpoint, method, headers, body, response) are the same whatever wraps them.

**What you start with**
Run the setup cell first, then your own Lab 14 exercise code. Available in the kernel:
- From setup: `GROQ_API_KEY`, `GROQ_API_URL`, `DEFAULT_MODEL` (`"llama-3.1-8b-instant"`), `build_request_payload`, `extract_reply`, `call_groq`, and `requests`.
- From YOUR exercise cell (must be defined and run first):
  - `class SimpleAPIClient` with `__init__(self, base_url: str, headers: dict | None = None)` and `post(self, path: str, json_body: dict) -> dict`. `post` joins `base_url + path`, sends a POST with the stored headers and the JSON body, raises on non-2xx, and returns the parsed JSON dict.

**Requirements**
1. Define `build_zero_shot_messages(review: str) -> list[dict]` returning two messages: a `system` message instructing the model to classify the review's sentiment as exactly one word, either `'positive'` or `'negative'`, and to reply with nothing else; then a `user` message whose content is the review text itself.
2. Define `parse_label(reply_text: str) -> str`: strip whitespace and surrounding periods, lowercase; if the result contains `"negative"` return `"negative"`; elif it contains `"positive"` return `"positive"`; otherwise return the normalised text. (Check negative before positive.)
3. Create `groq_client = SimpleAPIClient(base_url="https://api.groq.com/openai/v1", headers={...})`, where the headers contain `Authorization: Bearer <GROQ_API_KEY>` and `Content-Type: application/json`.
4. Use `review = "The battery life on this thing is incredible."`.
5. Call `groq_client.post("/chat/completions", body)` where `body` is a dict with `model` = `DEFAULT_MODEL`, `messages` = `build_zero_shot_messages(review)` and `temperature` = `0.0`. Do NOT use `call_groq` for this request (the point is to go through the client). No max_tokens.
6. Extract the reply text yourself from the returned JSON (the first choice's message content), then print:
   - `Review: <review>`
   - `Predicted sentiment: <parse_label(reply_text)>`

**Expected output**
```
Review: The battery life on this thing is incredible.
Predicted sentiment: positive
```
At temperature 0.0 this should reliably print `positive` (model-dependent in principle).

**Hints on approach**
- The client returns the full response dict, not the text; navigate `choices` to reach the message content.
- The path passed to `post` starts with a slash because the client concatenates it to the base URL.
- The auth header is where the API key goes; the client itself knows nothing about Groq.

**How you'll be graded**
The grader checks behaviour, not exact formatting:
1. `build_zero_shot_messages` returns a system instruction (one-word positive/negative, nothing else) followed by the review as the user message.
2. `parse_label` normalises, maps to `negative`/`positive`, and falls back to the normalised text.
3. A `SimpleAPIClient` is built with the Groq base URL and correct Authorization and Content-Type headers, and the request is sent via its `post` to `/chat/completions` with model, messages and temperature 0.0.
4. The reply text is extracted correctly from the response JSON.
5. Output prints the review and the predicted sentiment (`positive` expected).
