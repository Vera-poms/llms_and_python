# Project: Zero-Shot Sentiment Through a Reusable API Client

## Goal

**The question you are answering:** what is actually inside an API call, and does it still work the same if you send it through your own small client class instead of a ready-made helper?

Every web API call, whatever the service, is made of the same five parts. You will repeat a sentiment classification against Groq, but this time you send it with your own `SimpleAPIClient` instead of `call_groq`. You will:

1. Write `build_zero_shot_messages(review)` to build the two messages the model needs.
2. Write `parse_label(reply_text)` to clean the model's reply into one tidy label.
3. Create `groq_client`, a `SimpleAPIClient` pointed at Groq with the right headers.
4. Build the request body, send it with `groq_client.post(...)`, dig the reply text out of the response, and print the review and the predicted sentiment.

**Takeaway:** endpoint, method, headers, body and response are the same five parts no matter what wraps them.

## Words you will see

- **API (web API)**: a program on a server that you talk to by sending requests over the internet.
- **The five universal components**:
  1. **Endpoint**: the full web address you send to. Here: `https://api.groq.com/openai/v1/chat/completions`.
  2. **Method**: the kind of request. `POST` means "send data and get a result back".
  3. **Headers**: small labelled notes sent with the request. Ours say who you are and what format the body is in.
  4. **Body**: the main data you send. Ours is JSON describing the model, the messages and the temperature.
  5. **Response**: what comes back, also JSON.
- **JSON**: a text format that looks like a Python dict. In Python it becomes a dict (or list) of plain values.
- **Base URL and path**: the endpoint split in two. Base URL: `https://api.groq.com/openai/v1`. Path: `/chat/completions`. Joined, they make the endpoint.
- **Authorization header**: the header that carries your secret key. The format is `Bearer <key>`. The word `Bearer` and a space come first.
- **Content-Type header**: tells the server the body is JSON: `application/json`.
- **Client class**: a class that stores shared settings (base URL, headers) so each call is one short line.
- **Zero-shot classification**: asking a model to label something (here: positive or negative) with instructions only and no worked examples.
- **System message / user message**: a message dict such as `{"role": "system", "content": "..."}`. The system message gives the rules. The user message gives the input.
- **Temperature**: a randomness setting. `0.0` means "pick the most likely answer", so output is almost always the same.
- **Normalise**: clean text into one standard form (trim spaces, remove a trailing period, make lowercase) so it can be compared.
- **`requests`**: a Python library for web calls. `requests.post(url, headers=..., json=...)` sends a POST. You will not call it directly here, because your client does it.

## What you start with

Run the **setup cell** first, then **your own Lab 14 exercise cell**. After both, these exist in the kernel.

From the setup cell:

- `GROQ_API_KEY`: your key as a string.
- `GROQ_API_URL`: the full chat endpoint string. You will NOT use it here.
- `DEFAULT_MODEL`: the string `"llama-3.1-8b-instant"`.
- `build_request_payload`, `extract_reply`, `call_groq`: the Lab 13 helpers. Do NOT use `call_groq` for this request. The point is to go through your client.
- `requests`: the library module.

From YOUR exercise cell (it must be defined and run first):

- `class SimpleAPIClient`
  - `__init__(self, base_url: str, headers: dict | None = None)`: stores the base URL and default headers.
  - `post(self, path: str, json_body: dict) -> dict`: joins `base_url + path`, sends a POST with the stored headers and the JSON body, raises an error on a non-2xx status, and returns the parsed JSON as a **dict** (the whole response, not just the text).

What the dict returned by `post` looks like (shortened, values are examples):

```python
{
    "id": "chatcmpl-123",
    "choices": [
        {"index": 0, "message": {"role": "assistant", "content": "positive"}}
    ],
    "usage": {"total_tokens": 61},
}
```

If you get `NameError: name 'SimpleAPIClient' is not defined`, run your exercise cell.

## Steps

### Step 1: Write `build_zero_shot_messages(review: str) -> list[dict]`

Why: the model needs rules (the system message) and the thing to judge (the user message).

Return a **list of two dicts**, in this order:

1. A `system` message. Its content must tell the model to classify the review's sentiment as exactly one word, either `'positive'` or `'negative'`, and to reply with nothing else.
2. A `user` message whose content is the review text itself, with nothing added.

Shape, with an invented review:

```python
build_zero_shot_messages("Great phone")
# [
#   {"role": "system", "content": "<your instruction>"},
#   {"role": "user",   "content": "Great phone"},
# ]
```

**Check:** the result has length 2, `result[0]["role"] == "system"`, `result[1]["content"]` is exactly the review you passed in.

### Step 2: Write `parse_label(reply_text: str) -> str`

Why: models sometimes reply `"Positive."` or `" positive\n"` even when told not to. This function makes the answer comparable.

Follow these rules in this order:

1. Normalise: remove whitespace at both ends, then remove periods at both ends, then make it lowercase. The methods are `.strip()`, `.strip(".")` and `.lower()`.
2. If the result **contains** the text `"negative"`, return `"negative"`.
3. Otherwise, if it contains `"positive"`, return `"positive"`.
4. Otherwise return the normalised text unchanged.

Check **negative before positive**. Reason: a reply such as `"not positive, negative"` mentions both, and negative is the safer answer.

Worked examples (I ran these):

| `reply_text` | Returns |
|---|---|
| `"Positive."` | `"positive"` |
| `"  Negative \n"` | `"negative"` |
| `"It is not positive, rather negative"` | `"negative"` |
| `"Neutral."` | `"neutral"` |

"Contains" means the Python test `"negative" in text`.

**Check:** the four rows above give the results shown.

### Step 3: Create `groq_client`

Why: the client is where the base URL and your key live, so each later call needs only a path and a body.

```python
groq_client = SimpleAPIClient(base_url="https://api.groq.com/openai/v1", headers={...})
```

The `headers` dict must contain these two entries:

- `"Authorization"`: the string `Bearer ` (with a trailing space) followed by your key. Use an f-string: `f"Bearer {GROQ_API_KEY}"`.
- `"Content-Type"`: the string `"application/json"`.

Do not include `/chat/completions` in the base URL. That belongs in the path in Step 5.

**Check:** `groq_client.headers["Authorization"].startswith("Bearer ")` is `True`. Do not print the whole header: it contains your secret key.

### Step 4: Set the review

```python
review = "The battery life on this thing is incredible."
```

Copy it exactly, including the final period.

### Step 5: Build the body and send the request

Why: this is the body component of the five. The model will read exactly what you put here.

Create a dict `body` with exactly three keys:

| Key | Value |
|---|---|
| `"model"` | `DEFAULT_MODEL` |
| `"messages"` | `build_zero_shot_messages(review)` |
| `"temperature"` | `0.0` |

Do not add `max_tokens`. Then send it:

```python
response_body = groq_client.post("/chat/completions", body)
```

- The path starts with `/` because the client simply glues `base_url + path` together. `"/chat/completions"` gives `https://api.groq.com/openai/v1/chat/completions`. Without the slash you would get `.../v1chat/completions`, which is wrong.
- `response_body` is a **dict**, not text.

**Check:** `type(response_body)` is `dict` and `"choices" in response_body` is `True`.

### Step 6: Extract the reply text yourself

Why: `call_groq` used to do this for you. Now you must read the response dict.

The text is at: first item of `choices`, then its `message`, then its `content`. In Python, chain the lookups: `response_body["choices"][0]["message"]["content"]`. Read it in order:

- `["choices"]` gives a list.
- `[0]` takes the first item (lists count from 0).
- `["message"]` gives a dict with `role` and `content`.
- `["content"]` gives the reply text as a string.

Store it in `reply_text`.

**Check:** `type(reply_text)` is `str`.

### Step 7: Print the result

Print exactly two lines:

```
Review: <review>
Predicted sentiment: <parse_label(reply_text)>
```

Use f-strings. Print the *parsed* label, not the raw `reply_text`.

## What a correct result looks like

```
Review: The battery life on this thing is incredible.
Predicted sentiment: positive
```

- Two lines only, nothing else.
- At temperature `0.0` the reply is almost always the same, so you should see `positive`. It is still model-dependent in principle, so I cannot promise it will never vary.
- There is no chart. The real work is in the request you built, not the output.

## How you'll be graded

The grader checks behaviour, not exact formatting:

1. `build_zero_shot_messages` returns a system instruction (one-word positive/negative, nothing else) followed by the review as the user message.
2. `parse_label` normalises, maps to `negative`/`positive`, and falls back to the normalised text.
3. A `SimpleAPIClient` is built with the Groq base URL and correct Authorization and Content-Type headers, and the request is sent via its `post` to `/chat/completions` with model, messages and temperature 0.0.
4. The reply text is extracted correctly from the response JSON.
5. Output prints the review and the predicted sentiment (`positive` expected).
