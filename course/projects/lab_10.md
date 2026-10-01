# Project: Few-Shot Structured JSON Sentiment with Groq

**Goal**: Get an LLM to return structured JSON (`sentiment` and `confidence`) for real reviews by showing it worked examples, and validate each reply defensively. Failures are recorded rather than crashing the run. This is a live project and needs your Groq API key.

## What you start with

- Setup cell has run (key in `GROQ_API_KEY`). Available: `json`, `requests`, `GROQ_API_URL`, `DEFAULT_MODEL = "llama-3.1-8b-instant"`, and `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str` (returns the reply text; `response_format` is passed straight into the request body). Do not write your own HTTP code.
- The dataset loader cell has run, giving `sentences` and `labels`.
- Your own exercise functions must be defined and run first (the `json` import is in that cell):
  - `build_few_shot_messages(examples: list[tuple[str, dict]], query: str) -> list[dict]`
  - `parse_json_response(text: str) -> dict` (strips code fences, parses, raises `ValueError` if `sentiment` or `confidence` is missing, and raises `json.JSONDecodeError` on invalid JSON)

## Requirements

1. Define a constant `FEW_SHOT_EXAMPLES`, a list of exactly two `(review_text, result_dict)` tuples:
   - `("This is the best purchase I've made all year.", {"sentiment": "positive", "confidence": 0.97})`
   - `("It broke after two days and support ignored me.", {"sentiment": "negative", "confidence": 0.95})`
2. Define `N_SAMPLES = 8` and a list `results = []`.
3. For each review in `sentences[:N_SAMPLES]`:
   - Call `call_groq` with the messages from `build_few_shot_messages(FEW_SHOT_EXAMPLES, review)`, passing `response_format={"type": "json_object"}` (JSON mode). Keep the default model and temperature.
   - Inside `try`, run the reply through `parse_json_response` and append the tuple `(review, parsed["sentiment"], parsed["confidence"])` to `results`.
   - Catch both `json.JSONDecodeError` and `ValueError`; on failure append `(review, "PARSE ERROR: <the error message>", None)`.
4. After the loop, print one line per result, in order: the sentiment (or error string) left-aligned in a 25-character field, then `conf=<confidence>`, two spaces, then the first 55 characters of the review. Example shape: `positive                  conf=0.95  the movie was absolutely wonderful and kept me hoo`.

## Expected output

Eight lines, one per review, in dataset order. The first 8 reviews are all positive movie reviews, so you should typically see `positive` with a confidence between 0 and 1 (for example 0.9 to 0.99). The exact confidence values and any occasional `PARSE ERROR` entries are model-dependent and not deterministic. Needs network and a valid key.

## Hints on approach

- The few-shot examples appear in the messages as earlier user/assistant turns; your exercise function already handles that.
- `response_format` is a keyword argument of `call_groq`.
- A bad reply should become a result row, not an uncaught exception that stops the loop. Use `except (A, B) as e`.
- `json.JSONDecodeError` is a subclass of `ValueError`, but listing both is clearer.

## How you'll be graded

1. `FEW_SHOT_EXAMPLES` has exactly the two specified examples and `N_SAMPLES` is 8.
2. Each request uses the few-shot messages built by the student's `build_few_shot_messages` and requests JSON mode via `response_format={"type": "json_object"}`.
3. Replies are parsed with `parse_json_response`, with parse/validation errors caught and stored as `PARSE ERROR: ...` rows with `None` confidence rather than crashing.
4. Results are printed one per line, in order, showing sentiment, confidence and a truncated review.
