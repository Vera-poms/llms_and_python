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
Why: the examples are what teach the model your reply shape.

Make a variable named exactly `FEW_SHOT_EXAMPLES`. It is a **list of exactly two tuples**. A *tuple* is a fixed pair like `("some text", {"key": 1})`. Each tuple here is `(review_text, result_dict)`. Use these values exactly:

- `("This is the best purchase I've made all year.", {"sentiment": "positive", "confidence": 0.97})`
- `("It broke after two days and support ignored me.", {"sentiment": "negative", "confidence": 0.95})`

Shape reminder (not your data): `[("some text", {"key": 1}), ("other text", {"key": 2})]`.

Note that `0.97` and `0.95` are numbers, not strings. There are no quotes around them.

**Check:** `len(FEW_SHOT_EXAMPLES)` is `2`, and `FEW_SHOT_EXAMPLES[0][1]["sentiment"]` is `"positive"`.

### Step 2: Define `N_SAMPLES` and `results`
Code shape:
```python
N_SAMPLES = ...
results = ...
```
Why: `N_SAMPLES` keeps the number of live calls small. Each call takes time and counts against your free quota. `results` is where you keep each answer.

Write `N_SAMPLES = 8` and `results = []` (an empty list). Do this before the loop. Then the list starts empty once and is not reset on each pass.

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
`sentences[:N_SAMPLES]` is a *slice*. It gives the first 8 items of the list. For example, `["a", "b", "c"][:2]` is `["a", "b"]`. Write `for review in sentences[:N_SAMPLES]:`.

Inside the loop, do two things for each review.

**3a. Call the model.** Build the messages with your function: `build_few_shot_messages(FEW_SHOT_EXAMPLES, review)`. Give the result to `call_groq` as its first argument. Also give it `response_format={"type": "json_object"}`. You pass this one *by name*, like `response_format=...`. It turns on *JSON mode*, which tells the model its reply must be valid JSON. JSON mode makes bad JSON rarer, but not impossible. It also does not check that your keys are there. Do not change the model or the temperature (the temperature is how random the model's word choice is, 0.7 here). Keep the defaults. The call gives back a plain string, for example `'{"sentiment": "positive", "confidence": 0.95}'`. Save it in a variable such as `reply`.

**3b. Read the reply safely.** Wrap the next lines in `try:`. A `try:` block means: "attempt this. If it fails, jump to `except` and do that instead of crashing."

- Call `parse_json_response(reply)`. It gives back a dict, for example `{"sentiment": "positive", "confidence": 0.95}`.
- Add one tuple to `results`: `(review, parsed["sentiment"], parsed["confidence"])`. That is three items: the review text, the sentiment word, and the confidence number. *Confidence* is a number from 0 to 1 that the model says for how sure it is. It is the model's own claim, not a measured chance. Use `results.append(...)` with the tuple inside, so double brackets: `results.append((a, b, c))`.

**3c. Handle a bad reply.** Add `except (json.JSONDecodeError, ValueError) as e:`. Catch both, as a tuple in brackets. `json.JSONDecodeError` is the error for text that is not valid JSON. `ValueError` is the error your function raises when a key is missing. Inside, add `(review, f"PARSE ERROR: {e}", None)` to `results`. A failure becomes a row whose second item starts with `PARSE ERROR: `, then Python's own error message. Its confidence is `None` (not the string `"None"`).

Why this step exists: a model sometimes gives invalid JSON or forgets a key. If you did not catch the error, one bad reply on review 5 would crash the loop. You would lose the other 7 results.

Example of what goes into `results` (shape only; the confidence numbers will vary):

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
Why: aligned columns make the results easy to scan.

After the loop (not inside it), loop over `results` in order. Print one line per tuple, with exactly this layout:

1. the sentiment (or the error text), left-aligned and padded to 25 characters wide,
2. then `conf=` and the confidence,
3. then two spaces,
4. then the first 55 characters of the review.

An f-string can pad. Inside `{ }`, the part after a colon says how to show the value. `{x:<25}` means "left-align `x` in a 25-wide space". For example, `f"{'hi':<5}|"` gives `hi   |`. The slice `review[:55]` keeps the first 55 characters.

Tip: the sentiment column may be a long error text. If it is longer than 25 characters, padding does nothing and it prints in full. That is fine. A `None` confidence prints as `conf=None`. That is normal for error rows.

Example, using the first review in the data. The sentiment word plus its padding fills 25 characters, then `conf=0.95`, two spaces, then the cut-off review:

```
positive                  conf=0.95  the movie was absolutely wonderful and kept me hooked t
```

The review is cut at exactly 55 characters, which here ends in `hooked t`. Your confidence number will be different.

**Check:** you see 8 lines. In each line the text `conf=` starts in the same column when the sentiment is shorter than 25 characters.
