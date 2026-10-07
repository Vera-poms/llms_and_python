# Project: Few-Shot Structured JSON Sentiment with Groq

## Goal

A program can only use a language model's answer if the answer has a predictable shape. A sentence like "I think this review is pretty positive!" is hard for code to read. A JSON object like `{"sentiment": "positive", "confidence": 0.95}` is easy. The real question here is: **can we get a model to reply in the same machine-readable shape every time, and what do we do on the rare occasion it does not?**

This is a live project. It sends real requests to Groq, so it needs your Groq API key.

You will:

1. Write down two worked examples (`FEW_SHOT_EXAMPLES`) that show the model the exact reply shape you want.
2. Choose how many reviews to test (`N_SAMPLES = 8`) and make an empty list (`results`) to collect answers.
3. Loop over the first 8 reviews. For each one, ask the model for JSON and parse the reply.
4. Catch any bad reply and store it as an error row instead of letting the program crash.
5. Print one neat, aligned line per review.

Takeaway: showing the model examples (few-shot prompting) plus defensive parsing gives you structured data you can trust, and bad replies become rows in a table rather than crashes.

## Words you will see

- **LLM**: a large language model, a program that continues text. Here it is `llama-3.1-8b-instant`, running on Groq.
- **API call**: your code sends a request over the internet and gets a reply back. `call_groq` does this for you.
- **Message**: one turn of a chat, written as a dictionary like `{"role": "user", "content": "Hello"}`. The `role` is `"system"` (standing instructions), `"user"` (the person asking) or `"assistant"` (the model).
- **Few-shot prompting**: putting a few worked examples (the "shots") into the messages before your real question. The model copies the pattern. Your function `build_few_shot_messages` does this by replaying each example as a fake earlier user turn and assistant turn.
- **JSON**: a text format for data. `{"sentiment": "positive", "confidence": 0.95}` is JSON. Python reads it into a `dict`.
- **JSON mode**: a setting you send to the API (`response_format={"type": "json_object"}`) that tells the model its reply must be valid JSON. It makes bad JSON rarer but does not make it impossible, and it does not check that your keys are present.
- **Keyword argument**: an argument passed by name, like `response_format=...`. You pass it to `call_groq` by name.
- **Confidence**: a number between 0 and 1 that the model reports for how sure it is. It is the model's own claim, not a measured probability.
- **Defensive parsing**: assuming the reply might be broken and wrapping the parse in `try`/`except`.
- **`try` / `except`**: Python's way to say "attempt this; if it raises this kind of error, do that instead of crashing".
- **`json.JSONDecodeError`**: the error raised when text is not valid JSON.
- **`ValueError`**: a general "bad value" error. Your `parse_json_response` raises it when `sentiment` or `confidence` is missing. `JSONDecodeError` is a special kind of `ValueError`.
- **Non-deterministic**: the output can change from run to run. The model samples its words with some randomness (temperature 0.7), so two runs can differ.

## What you start with

The setup cell and the dataset cell have already run. These names exist in the notebook:

| Name | What it is | Example |
|---|---|---|
| `GROQ_API_KEY` | your key, typed in via getpass | a long string; do not print it |
| `json`, `requests` | imported libraries | |
| `GROQ_API_URL` | the Groq web address | `"https://api.groq.com/openai/v1/chat/completions"` |
| `DEFAULT_MODEL` | model name | `"llama-3.1-8b-instant"` |
| `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str` | sends a chat request and returns the reply text. `response_format` is put straight into the request body. | `call_groq([{"role": "user", "content": "Hi"}])` returns something like `"Hello!"` |
| `sentences` | list of review strings | `["the movie was absolutely wonderful and kept me hooked the whole time", "i loved every minute of this film", ...]` |
| `labels` | list of 0/1 ground-truth labels, same order as `sentences` (not needed in this project) | `[1, 1, 1, ...]` |

Do not write your own HTTP code. Use `call_groq`.

You must have already written and run these two functions in the exercise cell (the `json` import is in the setup cell):

- `build_few_shot_messages(examples: list[tuple[str, dict]], query: str) -> list[dict]`: builds the full messages list: a system instruction, then one user turn and one assistant turn per example, then the real `query` as the last user turn.
- `parse_json_response(text: str) -> dict`: strips code fences (the ```` ```json ```` wrapper some models add), parses the JSON, raises `ValueError` if `sentiment` or `confidence` is missing, and lets `json.JSONDecodeError` happen if the text is not valid JSON.

If you get `NameError` or `NotImplementedError`, go back and finish and run the exercise cell first.

## Steps

### Step 1: Define `FEW_SHOT_EXAMPLES`

Why: the examples are what teach the model your reply shape.

Create a variable named exactly `FEW_SHOT_EXAMPLES`. It is a **list of exactly two tuples**. Each tuple is `(review_text, result_dict)`. Use these values exactly:

- `("This is the best purchase I've made all year.", {"sentiment": "positive", "confidence": 0.97})`
- `("It broke after two days and support ignored me.", {"sentiment": "negative", "confidence": 0.95})`

Shape reminder (not your data): `[("some text", {"key": 1}), ("other text", {"key": 2})]`.

Note that `0.97` and `0.95` are numbers (floats), not strings. There are no quotes around them.

**Check:** `len(FEW_SHOT_EXAMPLES)` is `2`, and `FEW_SHOT_EXAMPLES[0][1]["sentiment"]` is `"positive"`.

### Step 2: Define `N_SAMPLES` and `results`

Why: `N_SAMPLES` keeps the number of live calls small (each call takes time and counts against your free quota). `results` is where you collect each answer.

Write `N_SAMPLES = 8` and `results = []` (an empty list). Do this before the loop, so the list starts empty once and is not reset each iteration.

**Check:** `N_SAMPLES == 8` and `results == []`.

### Step 3: Loop over the first 8 reviews

`sentences[:N_SAMPLES]` is a slice. It gives the first 8 items of the list. For example, `["a", "b", "c"][:2]` is `["a", "b"]`. Write `for review in sentences[:N_SAMPLES]:`.

Inside the loop, do two things for each review.

**3a. Call the model.** Build the messages with your function: `build_few_shot_messages(FEW_SHOT_EXAMPLES, review)`. Pass the result to `call_groq` as its first argument. Also pass `response_format={"type": "json_object"}` as a keyword argument. This switches on JSON mode. Do not change the model or the temperature. Keep the defaults. The call returns a plain string, for example `'{"sentiment": "positive", "confidence": 0.95}'`. Save it in a variable such as `reply`.

Library call to know: `call_groq(messages, response_format=...)`. It sends the request and gives back the reply text.

**3b. Parse the reply safely.** Wrap the next lines in `try:`.

- Call `parse_json_response(reply)`. It returns a dict, for example `{"sentiment": "positive", "confidence": 0.95}`.
- Append one tuple to `results`: `(review, parsed["sentiment"], parsed["confidence"])`. That is three items: the review text, the sentiment string, the confidence number. Use `results.append(...)` with the tuple inside, so double brackets: `results.append((a, b, c))`.

**3c. Handle a bad reply.** Add `except (json.JSONDecodeError, ValueError) as e:`. Catch both, as a tuple in brackets. Inside it, append `(review, f"PARSE ERROR: {e}", None)`. So a failure becomes a row whose second item starts with `PARSE ERROR: `, followed by Python's own error message, and whose confidence is `None` (not the string `"None"`).

Why this step exists: a model sometimes returns invalid JSON or forgets a key. If you did not catch the error, one bad reply on review 5 would crash the loop and you would lose the other 7 results.

Worked example of what goes into `results` (shape only; the confidence values will vary):

```
("the movie was absolutely wonderful and kept me hooked the whole time", "positive", 0.95)
("some review", "PARSE ERROR: Expecting value: line 1 column 1 (char 0)", None)
```

**Check:** after the loop, `len(results) == 8`. Every item is a tuple of length 3, even for failures.

### Step 4: Print one aligned line per result

Why: aligned columns make a table of results easy to scan.

After the loop (not inside it), loop over `results` in order and print one line per tuple, with exactly this layout:

1. the sentiment (or error string), left-aligned and padded to 25 characters wide,
2. then `conf=` and the confidence,
3. then two spaces,
4. then the first 55 characters of the review.

Library idea: an f-string can pad. Inside `{ }`, the part after a colon is a format spec. `{x:<25}` means "left-align `x` in a 25-wide field". For example `f"{'hi':<5}|"` gives `hi   |`. The slice `review[:55]` keeps the first 55 characters.

Tip: the sentiment column may be a long error string. If it is longer than 25 characters, padding does nothing and it just prints in full. That is fine. Also a `None` confidence prints as `conf=None`. That is expected for error rows.

Worked example, using the first dataset review (verified). Note that the sentiment word plus its padding fills 25 characters, then `conf=0.95`, two spaces, then the cut-off review:

```
positive                  conf=0.95  the movie was absolutely wonderful and kept me hooked t
```

The review is cut at exactly 55 characters, which here ends in `hooked t`. Your confidence number will differ.

**Check:** you see 8 lines, and in each line the text `conf=` starts in the same column when the sentiment is shorter than 25 characters.

## What a correct result looks like

- Exactly 8 printed lines, one per review, in the same order as the dataset.
- The first 8 reviews are all positive movie reviews. You should usually see `positive` on each line, with a confidence between 0 and 1 (often 0.9 to 0.99).
- Values are **not deterministic**. The confidence numbers will change between runs. An occasional line like `PARSE ERROR: ...   conf=None` can appear. That is fine, and it shows your error handling working.
- Deterministic parts: there are always 8 lines, they are in dataset order, and the review text on each line is always the same.
- Needs network access and a valid key. A `401` error means the key is wrong. A `429` error means you called too fast, so wait a minute and re-run.

## How you'll be graded

1. `FEW_SHOT_EXAMPLES` has exactly the two specified examples and `N_SAMPLES` is 8.
2. Each request uses the few-shot messages built by the student's `build_few_shot_messages` and requests JSON mode via `response_format={"type": "json_object"}`.
3. Replies are parsed with `parse_json_response`, with parse/validation errors caught and stored as `PARSE ERROR: ...` rows with `None` confidence rather than crashing.
4. Results are printed one per line, in order, showing sentiment, confidence and a truncated review.
