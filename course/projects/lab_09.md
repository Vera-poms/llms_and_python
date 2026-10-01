# Project: Zero-Shot Sentiment Accuracy with Groq

**Goal**: Measure how well an LLM classifies review sentiment with no examples, just an instruction. You will send real requests to Groq for a handful of labelled sentences and compute accuracy against the true labels. This is a live project and needs your Groq API key.

## What you start with

- Setup cell has run (it asks for your key with `getpass` and stores it in `GROQ_API_KEY`). Available: `json`, `requests`, `GROQ_API_URL`, `DEFAULT_MODEL = "llama-3.1-8b-instant"`, and `build_request_payload(messages, model, temperature, response_format)`, `extract_reply(response_json)`, and `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str`, which returns the assistant's reply text. Do not write your own HTTP code; call `call_groq`.
- The dataset loader cell has run, giving `sentences` and `labels` (1 = positive, 0 = negative). The first 10 items are all clearly positive movie reviews.
- Your own exercise functions must be defined and run first:
  - `build_zero_shot_messages(review: str) -> list[dict]` (a system message asking for exactly one word, `positive` or `negative`, then a user message that is the review)
  - `parse_label(reply_text: str) -> str` (normalises the reply to `"positive"` or `"negative"`)

## Requirements

1. Define `N_SAMPLES = 10`.
2. Loop over the first `N_SAMPLES` pairs of `(review, true_label)` from `zip(sentences, labels)`.
3. For each: call `call_groq(build_zero_shot_messages(review))` using default model and temperature (no extra arguments), run the reply through `parse_label`, and convert the integer true label to the string `"positive"` (1) or `"negative"` (0).
4. A prediction is correct when the parsed label equals the true string. Keep a running count of correct ones.
5. Print one line per example in this layout: `OK ` or `ERR` (three characters wide), then `predicted=<label padded to 9>`, `true=<label padded to 9>`, then the first 60 characters of the review. For example: `OK  predicted=positive  true=positive  the movie was absolutely wonderful and kept me hooked the`.
6. After the loop print a blank line and then `Accuracy on <N_SAMPLES> real sentences: <correct>/<N_SAMPLES> = <percent>`, with the percent formatted as a whole number such as `90%`.

## Expected output

10 per-example lines then the accuracy summary line. Results depend on the model and the temperature of 0.7, so exact predictions and accuracy are not deterministic. In practice a good zero-shot prompt scores high (roughly 80-100%) on these easy, clearly positive sentences. Needs network and a valid key.

## Hints on approach

- Booleans count as 0/1, so adding the comparison result to a counter works.
- Pad strings in f-strings with `:<9`.
- Slice the review with `[:60]` for display only; send the full review to the model.
- If you get an HTTP error, check the key you entered in the setup cell.

## How you'll be graded

1. Exactly `N_SAMPLES = 10` examples are processed, taken in dataset order from the start.
2. Each model call uses `call_groq` with the messages produced by your `build_zero_shot_messages` for the full review text.
3. Replies are normalised via `parse_label` and compared to the string form of the true label.
4. Per-example OK/ERR lines showing predicted, true and a review snippet are printed.
5. The final line reports correct count, total and percentage consistently with the per-example lines.
