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
Write `N_SAMPLES = 10`. Use this name everywhere, instead of typing 10 again.

**Check:** `N_SAMPLES` is `10`.

### Step 2: loop over the first 10 pairs
Code shape:
```python
correct = 0
for review, true_label in list(zip(sentences, labels))[:N_SAMPLES]:
    ...
```
Loop over `(review, true_label)` pairs from `zip(sentences, labels)`, but only the first `N_SAMPLES`, in dataset order from the start. `zip(a, b)` walks two lists side by side and gives pairs `(a[0], b[0])`, `(a[1], b[1])`, and so on. You cannot cut `zip` into a slice directly, so wrap it in a list first: `list(zip(sentences, labels))[:N_SAMPLES]`.

Before the loop, make a counter: `correct = 0`.

One pair looks like this: `("i loved every minute of this film", 1)`.

**Check:** the loop runs 10 times.

### Step 3: predict and convert the label
Code shape (inside the loop):
```python
    reply = call_groq(...)
    predicted = ...
    true_str = ...
```
Inside the loop:
1. `reply = call_groq(build_zero_shot_messages(review))`. Pass the **full** review, and no extra arguments (this uses the default model and temperature). The *temperature* is how random the model's choices are. 0 is steady, and higher is more varied. The default here is 0.7, so answers can change from run to run.
2. `predicted = parse_label(reply)`. It is a string like `"positive"`.
3. Turn the true label into a string so the two can be compared: `1` -> `"positive"`, `0` -> `"negative"`. For example, `true_str = "positive" if true_label == 1 else "negative"`.

Why convert? `predicted` is text and `true_label` is a number. `"positive" == 1` is always `False`, so you must compare string to string.

**Check:** `predicted` and `true_str` are both strings.

### Step 4: score it
Code shape (inside the loop):
```python
    correct += ...
```
A prediction is correct when `predicted == true_str`. Add it to your counter. In Python `True` counts as 1 and `False` as 0, so `correct += (predicted == true_str)` works.

**Check:** `correct` goes up by 1 only when the two strings match.

### Step 5: print one line per example
Code shape (inside the loop):
```python
    status = "OK " if ... else "ERR"
    print(f"{status} predicted={...:<9} true={...:<9} {...}")
```
Each line has this layout:
- `OK ` (O, K, space) if correct, or `ERR` if not. Always three characters wide.
- a space, then `predicted=` followed by the predicted label padded to 9 characters (`{predicted:<9}`). Inside an f-string, `{text:<9}` adds spaces on the right of `text` until it is 9 characters wide.
- a space, then `true=` followed by the true label padded to 9 characters.
- a space, then the **first 60 characters** of the review (`review[:60]`). Cut the text only for printing. Send the full review to the model.

Example for `sentences[0]`, if the model says positive (there are two spaces after `positive`: one is the padding, one is the separator):

```
OK  predicted=positive  true=positive  the movie was absolutely wonderful and kept me hooked the wh
```

The snippet is cut at exactly 60 characters, so it can stop in the middle of a word, as above.

**Check:** a correct line begins `OK ` followed by a space (so `OK  predicted=`). A wrong line begins `ERR predicted=`.

### Step 6: print the accuracy
Code shape (after the loop):
```python
print(f"\nAccuracy on {...} real sentences: {...}/{...} = {...:.0%}")
```
After the loop, print a blank line, then:

`Accuracy on <N_SAMPLES> real sentences: <correct>/<N_SAMPLES> = <percent>`

The percent is a whole number with a `%` sign. `f"{correct / N_SAMPLES:.0%}"` does that (`{x:.0%}` shows a fraction as a whole-number percent). For example, 9 correct gives `Accuracy on 10 real sentences: 9/10 = 90%`, and 8 correct gives `... 8/10 = 80%`.

An easy way to print the blank line: start the f-string with `\n`.

The results are **not the same every run**. They depend on the model and the temperature of 0.7, so predictions and accuracy can change. These 10 reviews are all clearly positive, so a good zero-shot prompt usually scores roughly 80-100%. Every `true=` value is `positive` for these 10 items.

**Check:** the number of `OK ` lines equals `<correct>`. If the last line says 9/10, exactly 9 lines start with `OK `.
