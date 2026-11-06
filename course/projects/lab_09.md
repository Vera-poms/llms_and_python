# Project: Zero-Shot Sentiment Accuracy with Groq

## Goal
The question: **if you just tell an LLM "say positive or negative" and give it a review, with no examples, how often does it get the right answer?**

*Zero-shot* means "zero examples shown". You will send real requests to Groq (a service that runs LLMs) for a few labeled reviews. You compare the model's answers to the true labels and work out the accuracy. This is a **live** project: it needs the internet and your Groq API key. (An *API key* is a secret password for the service. The setup cell asked for yours.)

You will:

1. Choose how many reviews to test (`N_SAMPLES = 10`).
2. Loop over the first 10 reviews and their true labels.
3. For each one, ask the model, clean up its reply, and compare it with the truth.
4. Print one result line for each review.
5. Print the final accuracy.

Takeaway: *accuracy* is just "right answers divided by total". You must clean the model's free-text reply before you can compare it.

## What you start with
Already in the notebook (run the setup cell first):
- `GROQ_API_KEY`, `GROQ_API_URL`, `DEFAULT_MODEL = "llama-3.1-8b-instant"`, `json`, `requests`.
- `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str`: sends the messages and **gives back the reply text as a string**, for example `"Positive"` or `"The sentiment is positive."`. Do not write your own HTTP code. `build_request_payload` and `extract_reply` are also there (used inside `call_groq`).
- `sentences`: a list of 170 review sentences. `labels`: a list of 170 0s and 1s, where 1 = positive and 0 = negative. The first 10 are all clearly positive movie reviews. For example, `sentences[1]` is `"i loved every minute of this film"` and `labels[1]` is `1`.

Your own exercise functions **must be defined and run first**. Run the exercise cell, or the solution cell if you are stuck:
- `build_zero_shot_messages(review: str) -> list[dict]`: gives back a system message asking for exactly one word (`positive` or `negative`), then a user message that is the review. The *messages list* is the input to a chat model: a list of dicts like `{"role": "user", "content": "..."}`. A `system` message gives instructions. A `user` message is the question.
- `parse_label(reply_text: str) -> str`: turns whatever the model said into exactly `"positive"` or `"negative"`. For example, `"Positive."` becomes `"positive"`.

## Steps

### Step 1: `N_SAMPLES`
Code shape:
```python
N_SAMPLES = ...
```
Write the code that does this step:

1. Write `N_SAMPLES = 10`. Use this name everywhere, instead of typing 10 again.

**Check:** `N_SAMPLES` is `10`.

### Step 2: Loop over the first 10 pairs
Code shape:
```python
correct = 0
for review, true_label in list(zip(sentences, labels))[:N_SAMPLES]:
    ...
```
One pair looks like `("i loved every minute of this film", 1)`. Write the code that does these steps:

1. Before the loop, write `correct = 0`.
2. Loop with `for review, true_label in list(zip(sentences, labels))[:N_SAMPLES]:`. The `list(...)` is needed because you cannot slice a `zip` directly.

**Check:** the loop runs 10 times.

### Step 3: Predict and convert the label
Code shape (inside the loop):
```python
    reply = call_groq(...)
    predicted = ...
    true_str = ...
```
Write the code that does these steps inside the loop:

1. Set `reply` to `call_groq(build_zero_shot_messages(review))`. Pass the full review and no extra arguments. This uses the default model and temperature 0.7, so answers can change from run to run.
2. Set `predicted` to `parse_label(reply)`.
3. Set `true_str` to `"positive"` if `true_label == 1`, else `"negative"`. A string can never equal the number `1`, so you must compare string to string.

**Check:** `predicted` and `true_str` are both strings.

### Step 4: Score it
Code shape (inside the loop):
```python
    correct += ...
```
Write the code that does this step inside the loop:

1. Add to `correct` whether `predicted == true_str`: `correct += (predicted == true_str)`. `True` counts as 1 and `False` as 0.

**Check:** `correct` goes up by 1 only when the two strings match.

### Step 5: Print one line per example
Code shape (inside the loop):
```python
    status = "OK " if ... else "ERR"
    print(f"{status} predicted={...:<9} true={...:<9} {...}")
```
Write the code that does these steps inside the loop:

1. Set `status` to `"OK "` (O, K, space) if the prediction is correct, or `"ERR"` if not. It is always three characters wide.
2. Print one line: `status`, a space, `predicted=` and the predicted label padded to 9 characters (`{predicted:<9}`), a space, `true=` and the true label padded to 9 characters, a space, then `review[:60]`. Cut the review only for printing. Send the full review to the model.

Example for `sentences[0]`, if the model says positive (two spaces after `positive`: one is padding, one is the separator):

```
OK  predicted=positive  true=positive  the movie was absolutely wonderful and kept me hooked the wh
```

The snippet is cut at exactly 60 characters, so it can stop in the middle of a word.

**Check:** a correct line begins `OK ` followed by a space (so `OK  predicted=`). A wrong line begins `ERR predicted=`.

### Step 6: Print the accuracy
Code shape (after the loop):
```python
print(f"\nAccuracy on {...} real sentences: {...}/{...} = {...:.0%}")
```
Write the code that does this step after the loop:

1. Print a blank line, then `Accuracy on <N_SAMPLES> real sentences: <correct>/<N_SAMPLES> = <percent>`. Start the f-string with `\n` for the blank line. Get the percent as a whole number with `{correct / N_SAMPLES:.0%}`.

For example, 9 correct gives `Accuracy on 10 real sentences: 9/10 = 90%`, and 8 correct gives `... 8/10 = 80%`.

The results are not the same every run. These 10 reviews are all clearly positive, so every `true=` value is `positive`, and a good zero-shot prompt usually scores roughly 80-100%.

**Check:** the number of `OK ` lines equals `<correct>`. If the last line says 9/10, exactly 9 lines start with `OK `.
