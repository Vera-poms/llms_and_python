# Project: Reusable Prompt Templates (Offline)

## Goal

**The question:** an LLM only ever receives text. If you want to ask the same question about many reviews, how do you build that text cleanly, without copy-pasting? The answer is a *prompt template*: a fixed instruction with a blank to fill in.

You will use the `PromptTemplate` class you wrote in the exercise to:

1. Create two named templates, one for sentiment classification and one for summarizing.
2. Store them in a dict called `TEMPLATES`.
3. Fill each template with real review sentences.
4. Print the exact prompt strings, under a header for each template.

No LLM is called. Labs 9-12 will send these kinds of strings to a model.

**Takeaway:** a prompt is just a string, and a template lets you build it the same way every time.

## Words you will see

- **Prompt**: the text you send to an LLM.
- **Template**: a string with a `{placeholder}` in curly braces, for example `"Review: {review}"`. The placeholder is a gap to fill later.
- **Placeholder / variable**: the name inside the braces. In this lab it is always `review`.
- **Rendering**: filling the placeholders to make the final string. `"Review: {review}"` rendered with `review="great"` gives `"Review: great"`.
- **Keyword argument**: an argument passed by name, like `render(review="great")`. The name must match the placeholder.
- **Dict**: a lookup table of `key: value` pairs. `TEMPLATES["summarize"]` returns the summarize template.
- **`.items()`**: a dict method that gives you each `(key, value)` pair, so a `for name, template in ...` loop gets both.
- **`\n`**: the "new line" character. `\n\n` is two of them, which shows up as one blank line.
- **Implicit string joining**: Python glues string literals that sit side by side, so you can split a long string across lines.

## What you start with

Already in the kernel:

- `sentences`: list of 170 review strings, lowercase. `sentences[0]` is `"the movie was absolutely wonderful and kept me hooked the whole time"` and `sentences[1]` is `"i loved every minute of this film"`.
- `labels`: list of 170 ints (1 = positive). You do not need it here.
- `re`: imported in your exercise cell.

Your own exercise class **must be defined and run first**:

`PromptTemplate(template: str)` has:

- the attribute `template`: the raw string you passed in.
- the attribute `required_vars`: a `set` of the placeholder names found in the template. For `"Hi {name}"` it is `{"name"}`.
- the method `render(**kwargs) -> str`: raises `ValueError` if a required variable is missing, otherwise returns `template.format(**kwargs)`.

If you see `NameError: name 'PromptTemplate' is not defined`, run your exercise or solution cell first.

## Steps

### Step 1: write the `classify_sentiment` template

Build a `PromptTemplate` whose text has this layout:

`<instruction>` + `\n\n` + `Review: {review}`

The instruction must ask the model to classify the sentiment of the review as positive or negative, and to reply with a single word. The wording is yours. For example:

`"Classify the sentiment of this review as positive or negative. Reply with a single word."`

The only placeholder is `{review}`. Do not add other braces anywhere in the text, because `required_vars` would pick them up and `render` would then demand them.

Why the blank line? It keeps the instruction visually separate from the data, which also helps the model.

**Check:** `PromptTemplate(...).required_vars == {"review"}`.

### Step 2: write the `summarize` template

Same layout. The instruction asks the model to summarize the review in one short sentence, for example `"Summarize this review in one short sentence."`, then `\n\n`, then `Review: {review}`.

**Check:** `required_vars == {"review"}`.

### Step 3: build `TEMPLATES`

Make a dict with **exactly two keys**, spelled exactly:

- `"classify_sentiment"` -> the template from step 1
- `"summarize"` -> the template from step 2

Keep that order, because the output order follows it.

### Step 4: the loop and the output

Loop with `for name, template in TEMPLATES.items():`. For each template:

1. Print the header `--- <name> ---`, e.g. `--- classify_sentiment ---`.
2. For each `review` in `sentences[:2]` (the first two sentences only), print `template.render(review=review)`, then print one blank line (`print()`).

You must call the rendering through `render` with the keyword `review=`. Do not use f-strings or `.format` yourself here.

Tool: `sentences[:2]` is a slice, the first two items of a list. `print()` with nothing inside prints an empty line.

**Check:** you see 2 headers and 4 prompts, and nothing else.

## What a correct result looks like

Everything is deterministic. If your instruction is the example above, the output is exactly:

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

Your instruction wording may differ. What must match is the structure: header, then for each of two sentences an instruction, a blank line, `Review: <sentence>`, and a blank line after the prompt. No `{review}` should appear in the output.

## How you'll be graded

1. `TEMPLATES` contains both named templates, each a `PromptTemplate` with `required_vars == {"review"}`.
2. The classify prompt instructs positive/negative classification with a one-word reply, and the summarize prompt instructs a one-sentence summary; both end with `Review: <text>`.
3. The loop prints a `--- name ---` header for each template, then renders exactly the first two dataset sentences for each.
4. Rendered output has the review text substituted correctly (no leftover `{review}`), using `PromptTemplate.render`.
