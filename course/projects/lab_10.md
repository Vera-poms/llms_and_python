# Project: Few-Shot Structured JSON Sentiment with Groq

## Goal
The question: **can we get a model to reply in the same shape every time? And what do we do on the rare day it does not?**

A program can only use a model's answer if the answer has a shape it can read. A sentence like "I think this review is pretty positive!" is hard for code to read. A *JSON* object like `{"sentiment": "positive", "confidence": 0.95}` is easy. JSON is a text format for data, and Python reads it into a `dict`.

This is a live project. It sends real requests to Groq, so it needs your Groq API key. Groq is the website that runs the model for you.

You will:

1. Write down two worked examples (`FEW_SHOT_EXAMPLES`) that show the model the exact reply shape you want.
2. Choose how many reviews to test (`N_SAMPLES = 8`) and make an empty list (`results`) to collect answers.
3. Loop over the first 8 reviews. For each one, ask the model for JSON and read the reply.
4. Catch any bad reply and store it as an error row, so the program does not crash.
5. Print one neat, aligned line per review.

Takeaway: showing the model examples (called *few-shot prompting*) and expecting some bad replies gives you data you can trust. A bad reply becomes a row in a table, not a crash.

## What you start with
The setup cell and the dataset cell have already run. These names exist in the notebook:

| Name | What it is | Example |
|---|---|---|
| `GROQ_API_KEY` | your key, typed in with getpass | a long string; do not print it |
| `json`, `requests` | libraries that are already imported | |
| `GROQ_API_URL` | the Groq web address | `"https://api.groq.com/openai/v1/chat/completions"` |
| `DEFAULT_MODEL` | the model name | `"llama-3.1-8b-instant"` |
| `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str` | sends a chat request and gives back the reply text. `response_format` goes straight into the request. | `call_groq([{"role": "user", "content": "Hi"}])` gives something like `"Hello!"` |
| `sentences` | a list of review strings | `["the movie was absolutely wonderful and kept me hooked the whole time", "i loved every minute of this film", ...]` |
| `labels` | a list of 0s and 1s, in the same order as `sentences` (you do not need it here) | `[1, 1, 1, ...]` |

A *message* is one chat turn, written as a dict like `{"role": "user", "content": "Hello"}`. The `role` is `"system"` (standing rules), `"user"` (the person asking) or `"assistant"` (the model). A list of messages is what you send to `call_groq`.

Do not write your own web code. Use `call_groq`.

You must have already written and run these two functions in the exercise cell (the `json` import is in the setup cell):

- `build_few_shot_messages(examples: list[tuple[str, dict]], query: str) -> list[dict]`: builds the full list of messages. First comes a system message. Then one user message and one assistant message for each example. The real `query` is the last user message.
- `parse_json_response(text: str) -> dict`: removes the code fence (the three-backtick `json` wrapper some models add), reads the JSON, and raises `ValueError` if `sentiment` or `confidence` is missing. If the text is not JSON at all, `json.JSONDecodeError` happens.

If you get `NameError` or `NotImplementedError`, go back. Finish the exercise cell and run it first.

## Steps

### Step 1: Define `FEW_SHOT_EXAMPLES`
Code shape (replace each `...`):
```python
FEW_SHOT_EXAMPLES = [
    (..., {"sentiment": ..., "confidence": ...}),
    (..., {"sentiment": ..., "confidence": ...}),
]
```
Make a list called `FEW_SHOT_EXAMPLES` with exactly two `(review_text, result_dict)` tuples. Use these values exactly:

1. `("This is the best purchase I've made all year.", {"sentiment": "positive", "confidence": 0.97})`
2. `("It broke after two days and support ignored me.", {"sentiment": "negative", "confidence": 0.95})`

`0.97` and `0.95` are numbers, not strings.

**Check:** `len(FEW_SHOT_EXAMPLES)` is `2`, and `FEW_SHOT_EXAMPLES[0][1]["sentiment"]` is `"positive"`.

### Step 2: Define `N_SAMPLES` and `results`
Code shape:
```python
N_SAMPLES = ...
results = ...
```
Write these two lines before the loop:

1. `N_SAMPLES = 8`
2. `results = []`

**Check:** `N_SAMPLES == 8` and `results == []`.

### Step 3: Loop over the first 8 reviews
Code shape:
```python
for review in sentences[:N_SAMPLES]:
    messages = ...
    reply = call_groq(..., response_format=...)
    try:
        parsed = ...
        results.append((..., ..., ...))
    except (..., ...) as e:
        results.append((..., ..., ...))
```
`sentences[:N_SAMPLES]` gives the first 8 reviews. Write the code that does these steps:

1. Loop with `for review in sentences[:N_SAMPLES]:`.
2. Inside the loop, set `messages` to `build_few_shot_messages(FEW_SHOT_EXAMPLES, review)`.
3. Set `reply` to `call_groq(messages, response_format={"type": "json_object"})`. Keep the default model and temperature.
4. Start a `try:` block. Inside it, set `parsed` to `parse_json_response(reply)`.
5. Still inside `try:`, add `(review, parsed["sentiment"], parsed["confidence"])` to `results` with `results.append((a, b, c))`.
6. Add `except (json.JSONDecodeError, ValueError) as e:`. Inside it, add `(review, f"PARSE ERROR: {e}", None)` to `results`. The confidence is `None`, not the string `"None"`.

A bad reply becomes an error row instead of crashing the loop.

Rows in `results` look like this (the confidence numbers vary):

```
("the movie was absolutely wonderful and kept me hooked the whole time", "positive", 0.95)
("some review", "PARSE ERROR: Expecting value: line 1 column 1 (char 0)", None)
```

**Check:** after the loop, `len(results) == 8`. Every item is a tuple of length 3, even for failures.

### Step 4: Print one aligned line per result
Code shape:
```python
for review, sentiment, confidence in results:
    print(f"{...:<25} conf={...}  {...}")
```
After the loop (not inside it), write the code that does these steps:

1. Loop over `results` with `for review, sentiment, confidence in results:`.
2. Print one line made of: the sentiment (or error text) left-aligned in 25 characters (`{sentiment:<25}`), then `conf=` and the confidence, then two spaces, then `review[:55]`.

A long error text or a `None` confidence prints as it is. That is fine.

Example, using the first review in the data:

```
positive                  conf=0.95  the movie was absolutely wonderful and kept me hooked t
```

**Check:** you see 8 lines. In each line, `conf=` starts in the same column when the sentiment is shorter than 25 characters.
