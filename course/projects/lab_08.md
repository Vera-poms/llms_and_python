# Project: Reusable Prompt Templates (Offline)

**Goal**: Build a small library of named prompt templates using your `PromptTemplate` class, then render them against real review sentences and print the exact prompt strings. No LLM is called; this is the groundwork that labs 9-12 use to send prompts to a model.

## What you start with

- Your own exercise class must be defined and run first: `PromptTemplate(template: str)`, with attributes `template` and `required_vars` (the set of `{placeholder}` names), and a method `render(**kwargs) -> str` that raises `ValueError` when a required variable is missing and otherwise returns `template.format(**kwargs)`. The `re` module is imported in that exercise cell.
- The dataset loader cell has run, giving `sentences` (list of review strings) and `labels` (list of 0/1 ints, 1 = positive).

## Requirements

1. Define a dict `TEMPLATES` with exactly two keys, each holding a `PromptTemplate` whose only placeholder is `{review}`:
   - `"classify_sentiment"`: asks the model to classify the sentiment of the review as positive or negative, and to reply with a single word. The review follows after a blank line, introduced by the label `Review:`. Layout: instruction text, then `\n\n`, then `Review: {review}`.
   - `"summarize"`: asks the model to summarize the review in one short sentence, then a blank line, then `Review: {review}`.
2. Loop over `TEMPLATES.items()`. For each template print a header line of the form `--- <name> ---`.
3. Under each header, for each of the first two sentences (`sentences[:2]`), print the rendered prompt using `template.render(review=review)`, followed by one blank line.
4. Rendering must go through your `PromptTemplate.render`, with the keyword argument `review`.

## Expected output

For each of the two templates, a header, then two rendered prompts. Each prompt has the instruction line(s), a blank line, then `Review: ` followed by the sentence. The first two sentences are deterministic: `the movie was absolutely wonderful and kept me hooked the whole time` and `i loved every minute of this film`. So the output has 2 headers and 4 prompts, and nothing else. The wording of the instructions is yours to choose as long as it matches the descriptions above.

## Hints on approach

- Python joins adjacent string literals, so a long instruction can be split over several lines.
- `\n\n` makes the blank line between instruction and review.
- The same review variable name in the template and the `render` call is what ties them together.

## How you'll be graded

1. `TEMPLATES` contains both named templates, each a `PromptTemplate` with `required_vars == {"review"}`.
2. The classify prompt instructs positive/negative classification with a one-word reply, and the summarize prompt instructs a one-sentence summary; both end with `Review: <text>`.
3. The loop prints a `--- name ---` header for each template, then renders exactly the first two dataset sentences for each.
4. Rendered output has the review text substituted correctly (no leftover `{review}`), using `PromptTemplate.render`.
