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
You get `review`, a string like `"Great phone"`. Write the code that does these steps:

1. Return a list of two dicts, in this order.
2. The first has role `"system"`. Its content tells the model to label the review's sentiment as exactly one word, either `'positive'` or `'negative'`, and to reply with nothing else.
3. The second has role `"user"`. Its content is `review`, with nothing added.

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
You get `reply_text`, the model's reply, like `"Positive."` or `"  Negative \n"`. Write the code that does these steps:

1. Set `text` to `reply_text.strip().strip(".").lower()`.
2. If `"negative" in text`, return `"negative"`. Check this one first.
3. If `"positive" in text`, return `"positive"`.
4. Return `text`.

| `reply_text` | You give back |
|---|---|
| `"Positive."` | `"positive"` |
| `"  Negative \n"` | `"negative"` |
| `"It is not positive, rather negative"` | `"negative"` |
| `"Neutral."` | `"neutral"` |

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
Write the code that does these steps:

1. Set `groq_client` to `SimpleAPIClient(...)`.
2. Pass `base_url="https://api.groq.com/openai/v1"`. Do not put `/chat/completions` in it.
3. Pass a `headers` dict with `"Authorization"` set to `f"Bearer {GROQ_API_KEY}"` (note the space after `Bearer`).
4. Add `"Content-Type"` set to `"application/json"` to the same dict.

**Check:** `groq_client.headers["Authorization"].startswith("Bearer ")` is `True`. Do not print the header, because it holds your secret key.

### Step 4: Set the review
Code shape:
```python
review = ...
```
Write the code that does these steps:

1. Set `review` to `"The battery life on this thing is incredible."`, copied exactly, including the final period.

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
Write the code that does these steps:

1. Make a dict `body` with exactly three keys: `"model"` set to `DEFAULT_MODEL`, `"messages"` set to `build_zero_shot_messages(review)`, and `"temperature"` set to `0.0`. Do not add `max_tokens`.
2. Set `response_body` to `groq_client.post("/chat/completions", body)`. The path starts with `/`.

**Check:** `type(response_body)` is `dict` and `"choices" in response_body` is `True`.

### Step 6: Pull out the reply text yourself
Code shape:
```python
reply_text = response_body[...][...][...][...]
```
Write the code that does these steps:

1. Set `reply_text` to `response_body["choices"][0]["message"]["content"]`.

**Check:** `type(reply_text)` is `str`.

### Step 7: Print the result
Code shape:
```python
print(f"Review: {...}")
print(f"Predicted sentiment: {...}")
```
Write the code that does these steps:

1. Print `Review: ` and the review.
2. Print `Predicted sentiment: ` and `parse_label(reply_text)`. Use the cleaned label, not the raw `reply_text`.

**Check:** you see the two lines, and the second one ends in `positive`.
