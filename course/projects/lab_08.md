# Project: Reusable Prompt Templates (Offline)

## Goal
The question: **an LLM only ever gets text. If you want to ask the same question about many reviews, how do you build that text cleanly, without copy-pasting?** The answer is a *prompt template*: a fixed instruction with a blank to fill in.

You will use the `PromptTemplate` class you wrote in the exercise to:

1. Create two named templates, one for sentiment classification and one for summarizing.
2. Store them in a dict called `TEMPLATES`.
3. Fill each template with real review sentences.
4. Print the exact prompt strings, under a header for each template.

No LLM is called here. Labs 9-12 will send these kinds of strings to a model.

Takeaway: a prompt is just a string, and a template lets you build it the same way every time.

## What you start with
Already in the notebook:
- `sentences`: a list of 170 review sentences, all lowercase. `sentences[0]` is `"the movie was absolutely wonderful and kept me hooked the whole time"` and `sentences[1]` is `"i loved every minute of this film"`.
- `labels`: a list of 170 0s and 1s (1 = positive). You do not need it here.
- `re`: imported in your exercise cell.

Your own exercise class **must be defined and run first**. Run the exercise cell, or the solution cell if you are stuck.

A *prompt* is the text you send to an LLM. A *template* is a prompt with a blank in curly braces, like `"Review: {review}"`. The blank is called a *placeholder*. *Rendering* means filling the blanks to make the final text: `"Review: {review}"` rendered with `review="great"` gives `"Review: great"`.

`PromptTemplate(template: str)` has:
- the attribute `template`: the text you passed in.
- the attribute `required_vars`: a set of the placeholder names found in the template. For `"Hi {name}"` it is `{"name"}`.
- the method `render(**kwargs) -> str`: you give it the values by name, like `render(review="great")`. It raises a `ValueError` if a required name is missing. Otherwise it gives back `template.format(**kwargs)`.

If you see `NameError: name 'PromptTemplate' is not defined`, run your exercise or solution cell first.

## Steps

### Step 1: Write the `classify_sentiment` template
Code shape:
```python
classify_sentiment = PromptTemplate(
    "..."
    "\n\n"
    "Review: {review}"
)
```
You make a `PromptTemplate` with the layout `<instruction>` + `\n\n` + `Review: {review}`. Write the code that does these steps:

1. Write an instruction that asks the model to classify the sentiment of the review as positive or negative, and to reply with a single word. The wording is yours. For example: `"Classify the sentiment of this review as positive or negative. Reply with a single word."`
2. After it, add the string `"\n\n"` (this shows up as one blank line).
3. End with the string `"Review: {review}"`.
4. Do not add any other curly braces. `required_vars` would pick them up, and `render` would then ask for them.

**Check:** `PromptTemplate(...).required_vars == {"review"}`.

### Step 2: Write the `summarize` template
Code shape:
```python
summarize = PromptTemplate(
    "..."
    "\n\n"
    "Review: {review}"
)
```
It has the same layout. Write the code that does these steps:

1. Write an instruction that asks the model to summarize the review in one short sentence, for example `"Summarize this review in one short sentence."`
2. After it, add `"\n\n"`.
3. End with `"Review: {review}"`.

**Check:** `required_vars == {"review"}`.

### Step 3: Build `TEMPLATES`
Code shape:
```python
TEMPLATES = {
    "classify_sentiment": ...,
    "summarize": ...,
}
```
Write the code that does these steps:

1. Make a dict called `TEMPLATES` with exactly two keys, spelled exactly as below.
2. Set `"classify_sentiment"` to the template from Step 1.
3. Set `"summarize"` to the template from Step 2.

Keep that order, because the output follows it.

**Check:** `list(TEMPLATES)` is `["classify_sentiment", "summarize"]`.

### Step 4: The loop and the output
Code shape:
```python
for name, template in TEMPLATES.items():
    print(...)
    for review in sentences[:2]:
        print(...)
        print()
```
Write the code that does these steps:

1. Loop with `for name, template in TEMPLATES.items():`.
2. Print the header `--- <name> ---`, for example `--- classify_sentiment ---`.
3. Inside it, loop with `for review in sentences[:2]:` (the first two sentences only).
4. Print `template.render(review=review)`. Do not use f-strings or `.format` yourself.
5. Print one blank line with `print()`.

If your instructions are the examples above, the output is exactly:

```
--- classify_sentiment ---
Classify the sentiment of this review as positive or negative. Reply with a single word.

Review: the movie was absolutely wonderful and kept me hooked the whole time

Classify the sentiment of this review as positive or negative. Reply with a single word.

Review: i loved every minute of this film

--- summarize ---
Summarize this review in one short sentence.

Review: the movie was absolutely wonderful and kept me hooked the whole time

Summarize this review in one short sentence.

Review: i loved every minute of this film

```

Your instruction wording may differ. The structure must match: a header, then for each of two sentences an instruction, a blank line, `Review: <sentence>`, and a blank line after the prompt. No `{review}` should show up in the output.

**Check:** you see 2 headers and 4 prompts, and nothing else.
