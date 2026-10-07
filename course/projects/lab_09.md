# Project: Zero-Shot Sentiment Accuracy with Groq

## Goal

**The question:** if you just tell an LLM "say positive or negative" and give it a review, with no examples, how often does it get the right answer?

*Zero-shot* means "zero examples shown". You will send real requests to Groq (a service that runs LLMs) for a few labelled reviews, compare the model's answers to the true labels, and compute accuracy. This is a **live** project: it needs the internet and your Groq API key.

You will:

1. Choose how many reviews to test (`N_SAMPLES = 10`).
2. Loop over the first 10 reviews and their true labels.
3. For each one, ask the model, clean up its reply, and compare with the truth.
4. Print one result line per review.
5. Print the final accuracy.

**Takeaway:** accuracy is just "right answers divided by total", and you must clean the model's free-text reply before you can compare it.

## Words you will see

- **LLM API / request**: your code sends text over the internet to the model and gets text back. `call_groq` does this for you.
- **API key**: a secret password for the service. The setup cell asked for yours with `getpass`.
- **Messages list**: the input to a chat model, a list of dicts like `{"role": "user", "content": "..."}`. A `system` message gives instructions. A `user` message is the question.
- **Temperature**: how random the model's choices are. 0 is steady, higher is more varied. The default here is 0.7, so answers can change from run to run.
- **Label**: the correct answer. Here `1` means positive and `0` means negative.
- **Accuracy**: correct predictions divided by total predictions.
- **`zip(a, b)`**: walks two lists side by side, giving pairs `(a[0], b[0])`, `(a[1], b[1])`, and so on.
- **f-string padding**: inside an f-string, `{text:<9}` pads `text` with spaces on the right until it is 9 characters wide. `{x:.0%}` shows a fraction as a whole-number percent.
- **Non-deterministic**: the result can differ each run.

## What you start with

Already in the kernel (run the setup cell first):

- `GROQ_API_KEY`, `GROQ_API_URL`, `DEFAULT_MODEL = "llama-3.1-8b-instant"`, `json`, `requests`.
- `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str`: sends the messages and **returns the reply text as a string**, for example `"Positive"` or `"The sentiment is positive."`. Do not write your own HTTP code. Also available: `build_request_payload` and `extract_reply` (used internally).
- `sentences`: list of 170 review strings. `labels`: list of 170 ints, 1 = positive, 0 = negative. The first 10 are all clearly positive movie reviews. Example: `sentences[1]` is `"i loved every minute of this film"` and `labels[1]` is `1`.

Your own exercise functions **must be defined and run first**:

- `build_zero_shot_messages(review: str) -> list[dict]`: returns a system message asking for exactly one word (`positive` or `negative`), then a user message that is the review.
- `parse_label(reply_text: str) -> str`: turns whatever the model said into exactly `"positive"` or `"negative"`. For example `"Positive."` becomes `"positive"`.

## Steps

### Step 1: `N_SAMPLES`

Define `N_SAMPLES = 10`. Use this variable everywhere instead of typing 10 again.

### Step 2: loop over the first 10 pairs

Loop over `(review, true_label)` pairs from `zip(sentences, labels)`, but only the first `N_SAMPLES`, in dataset order from the start. `zip` itself cannot be sliced, so wrap it first: `list(zip(sentences, labels))[:N_SAMPLES]`.

Before the loop, create a counter `correct = 0`.

Example of one pair: `("i loved every minute of this film", 1)`.

### Step 3: predict and convert the label

Inside the loop:

1. `reply = call_groq(build_zero_shot_messages(review))`. Pass the **full** review, and no extra arguments (default model and temperature).
2. `predicted = parse_label(reply)`. It is a string like `"positive"`.
3. Convert the true label to a string so the two can be compared: `1` -> `"positive"`, `0` -> `"negative"`. For example `true_str = "positive" if true_label == 1 else "negative"`.

Why convert? `predicted` is text and `true_label` is a number. `"positive" == 1` is always `False`, so the comparison must be string to string.

### Step 4: score it

A prediction is correct when `predicted == true_str`. Add to your counter. In Python `True` counts as 1 and `False` as 0, so `correct += (predicted == true_str)` works.

### Step 5: print one line per example

Each line, in this exact layout:

- `OK ` (O, K, space) if correct, or `ERR` if not. Always three characters wide.
- a space, then `predicted=` followed by the predicted label padded to 9 characters (`{predicted:<9}`).
- a space, then `true=` followed by the true label padded to 9 characters.
- a space, then the **first 60 characters** of the review (`review[:60]`). Slice only for display. Send the full review to the model.

Worked example for `sentences[0]`, if the model says positive (note two spaces after `positive`: one is the padding, one is the separator):

```
OK  predicted=positive  true=positive  the movie was absolutely wonderful and kept me hooked the wh
```

The snippet is cut at exactly 60 characters, so it can stop mid-word, as above.

**Check:** a correct line begins `OK ` followed by a space (so `OK  predicted=`). A wrong line begins `ERR predicted=`.

### Step 6: print the accuracy

After the loop print a blank line, then:

`Accuracy on <N_SAMPLES> real sentences: <correct>/<N_SAMPLES> = <percent>`

The percent is a whole number with a `%` sign. `f"{correct / N_SAMPLES:.0%}"` does that. Examples: 9 correct gives `Accuracy on 10 real sentences: 9/10 = 90%`, and 8 correct gives `... 8/10 = 80%`.

A simple way to print the blank line: start the f-string with `\n`.

**Check:** the number of `OK ` lines equals `<correct>`.

## What a correct result looks like

- 10 per-example lines, then a blank line, then the accuracy line.
- The results are **not deterministic**. They depend on the model and the temperature of 0.7, so predictions and accuracy can change between runs.
- Since these 10 reviews are all clearly positive, a good zero-shot prompt usually scores roughly 80-100%.
- It needs network access and a valid key. Every `true=` value is `positive` for these 10 items.
- The final line must match the lines above it. If it says 9/10, exactly 9 lines start with `OK `.

## How you'll be graded

1. Exactly `N_SAMPLES = 10` examples are processed, taken in dataset order from the start.
2. Each model call uses `call_groq` with the messages produced by your `build_zero_shot_messages` for the full review text.
3. Replies are normalised via `parse_label` and compared to the string form of the true label.
4. Per-example OK/ERR lines showing predicted, true and a review snippet are printed.
5. The final line reports correct count, total and percentage consistently with the per-example lines.
