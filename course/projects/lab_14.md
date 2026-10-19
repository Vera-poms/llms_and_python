# Project: Zero-Shot Sentiment Through a Reusable API Client

## Goal
The question: **what is actually inside an API call? Does it still work the same if you send it through your own small client class, not a ready-made helper?**

An *API* (web API) is a program on a server that you talk to by sending requests over the internet. Every API call is made of the same five parts, whatever the service:

1. **Endpoint**: the full web address you send to. Here: `https://api.groq.com/openai/v1/chat/completions`.
2. **Method**: the kind of request. `POST` means "send data and get a result back".
3. **Headers**: small labelled notes sent with the request. Ours say who you are and what format the body is in.
4. **Body**: the main data you send. Ours is JSON about the model, the messages and the temperature.
5. **Response**: what comes back, also JSON.

*JSON* is a text format that looks like a Python dict. In Python it becomes a dict (or list) of plain values.

You will do a sentiment check against Groq, but you send it with your own `SimpleAPIClient`, not with `call_groq`. Sentiment here means "positive or negative". You will:

1. Write `build_zero_shot_messages(review)`. It builds the two messages the model needs.
2. Write `parse_label(reply_text)`. It cleans the model's reply into one tidy label.
3. Create `groq_client`, a `SimpleAPIClient` that points at Groq and has the right headers.
4. Build the request body, send it with `groq_client.post(...)`, dig the reply text out of the response, and print the review and the predicted sentiment.

Takeaway: endpoint, method, headers, body and response are the same five parts, whatever wraps them.

## What you start with
Run the **setup cell** first, then **your own Lab 14 exercise cell**. After both, these exist in the notebook.

From the setup cell:
- `GROQ_API_KEY`: your key as a string.
- `GROQ_API_URL`: the full chat endpoint string. You will NOT use it here.
- `DEFAULT_MODEL`: the string `"llama-3.1-8b-instant"`.
- `build_request_payload`, `extract_reply`, `call_groq`: the lab 13 helpers. Do NOT use `call_groq` for this request. The point is to go through your client.
- `requests`: the library (module) for web calls.

From YOUR exercise cell (it must be defined and run first):
- `class SimpleAPIClient` (a *client class* stores shared settings, like the base URL and headers, so each call is one short line)
  - `__init__(self, base_url: str, headers: dict | None = None)`: stores the base URL and the default headers.
  - `post(self, path: str, json_body: dict) -> dict`: joins `base_url + path` and sends a POST with the stored headers and the JSON body. It raises an error if the status is not 2xx. It gives back the JSON reply as a **dict** (the whole response, not just the text).

The base URL and the path are the endpoint split in two. Base URL: `https://api.groq.com/openai/v1`. Path: `/chat/completions`. Joined, they make the endpoint.

What the dict from `post` looks like (shortened, the values are examples):

```python
{
    "id": "chatcmpl-123",
    "choices": [
        {"index": 0, "message": {"role": "assistant", "content": "positive"}}
    ],
    "usage": {"total_tokens": 61},
}
```

If you see `NameError: name 'SimpleAPIClient' is not defined`, run your exercise cell.

## Steps

### Step 1: Write `build_zero_shot_messages(review: str) -> list[dict]`
Code shape (replace each `...`):
```python
def build_zero_shot_messages(review):
    return [
        {"role": "system", "content": ...},
        {"role": "user", "content": ...},
    ]
```
Why: the model needs rules (the system message) and the thing to judge (the user message). This is *zero-shot* work: you ask the model to label something with instructions only and no worked examples. A message is a dict like `{"role": "system", "content": "..."}`.

Give back a **list of two dicts**, in this order:

1. A `system` message. Its content must tell the model to label the review's sentiment as exactly one word, either `'positive'` or `'negative'`, and to reply with nothing else.
2. A `user` message. Its content is the review text itself, with nothing added.

Shape, with an invented review:

```python
build_zero_shot_messages("Great phone")
# [
#   {"role": "system", "content": "<your instruction>"},
#   {"role": "user",   "content": "Great phone"},
# ]
```

**Check:** the result has length 2, `result[0]["role"] == "system"`, and `result[1]["content"]` is exactly the review you passed in.

### Step 2: Write `parse_label(reply_text: str) -> str`
Code shape:
```python
def parse_label(reply_text):
    text = ...            # clean it up first
    if ... in text:
        return ...
    if ... in text:
        return ...
    return text
```
Why: models sometimes reply `"Positive."` or `" positive\n"` even when told not to. This function makes the answers easy to compare.

Follow these rules in this order:

1. Clean the text into one standard form. Remove spaces at both ends, then remove periods at both ends, then make it lowercase. The methods are `.strip()`, `.strip(".")` and `.lower()`.
2. If the result **contains** the text `"negative"`, give back `"negative"`.
3. Otherwise, if it contains `"positive"`, give back `"positive"`.
4. Otherwise give back the cleaned text as it is.

Check **negative before positive**. A reply such as `"not positive, negative"` mentions both, and negative is the safer answer.

Examples (from running the reference solution):

| `reply_text` | You give back |
|---|---|
| `"Positive."` | `"positive"` |
| `"  Negative \n"` | `"negative"` |
| `"It is not positive, rather negative"` | `"negative"` |
| `"Neutral."` | `"neutral"` |

"Contains" means the Python test `"negative" in text`.

**Check:** the four rows above give the results shown.

### Step 3: Create `groq_client`
Code shape:
```python
groq_client = SimpleAPIClient(
    base_url=...,
    headers={
        "Authorization": ...,
        "Content-Type": ...,
    },
)
```
Why: the client is where the base URL and your key live. So each later call needs only a path and a body.

```python
groq_client = SimpleAPIClient(base_url="https://api.groq.com/openai/v1", headers={...})
```

The `headers` dict must have these two entries:

- `"Authorization"`: the header that carries your secret key. Its value is `Bearer ` (with a space at the end), then your key. Use an f-string: `f"Bearer {GROQ_API_KEY}"`.
- `"Content-Type"`: tells the server the body is JSON. Its value is `"application/json"`.

Do not put `/chat/completions` in the base URL. It belongs in the path in Step 5.

**Check:** `groq_client.headers["Authorization"].startswith("Bearer ")` is `True`. Do not print the whole header, because it holds your secret key.

### Step 4: Set the review
Code shape:
```python
review = ...
```
```python
review = "The battery life on this thing is incredible."
```

Copy it exactly, including the final period.

### Step 5: Build the body and send the request
Code shape:
```python
body = {
    "model": ...,
    "messages": ...,
    "temperature": ...,
}
response_body = groq_client.post(..., body)
```
Why: this is the body part of the five. The model reads exactly what you put here.

Make a dict `body` with exactly three keys:

| Key | Value |
|---|---|
| `"model"` | `DEFAULT_MODEL` |
| `"messages"` | `build_zero_shot_messages(review)` |
| `"temperature"` | `0.0` |

Temperature is a randomness setting. `0.0` means "pick the most likely answer", so the output is almost always the same. Do not add `max_tokens`. Then send it:

```python
response_body = groq_client.post("/chat/completions", body)
```

- The path starts with `/` because the client simply glues `base_url + path` together. `"/chat/completions"` gives `https://api.groq.com/openai/v1/chat/completions`. Without the slash you would get `.../v1chat/completions`, which is wrong.
- `response_body` is a **dict**, not text.

**Check:** `type(response_body)` is `dict` and `"choices" in response_body` is `True`.

### Step 6: Pull out the reply text yourself
Code shape:
```python
reply_text = response_body[...][...][...][...]
```
Why: `call_groq` used to do this for you. Now you read the response dict yourself.

The text is at: the first item of `choices`, then its `message`, then its `content`. In Python, chain the lookups: `response_body["choices"][0]["message"]["content"]`. Read it in order:

- `["choices"]` gives a list.
- `[0]` takes the first item (lists start counting at 0).
- `["message"]` gives a dict with `role` and `content`.
- `["content"]` gives the reply text as a string.

Store it in `reply_text`.

**Check:** `type(reply_text)` is `str`.

### Step 7: Print the result
Code shape:
```python
print(f"Review: {...}")
print(f"Predicted sentiment: {...}")
```
Print exactly two lines:

```
Review: <review>
Predicted sentiment: <parse_label(reply_text)>
```

Use f-strings. Print the *cleaned* label from `parse_label`, not the raw `reply_text`.

**Check:** you see the two lines, and the second one ends in `positive`.
