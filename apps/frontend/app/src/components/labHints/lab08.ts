import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 8 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab08Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "class PromptTemplate:",
    hints: [
      {
        code: "class PromptTemplate:",
        text: "A reusable prompt with blanks. You make one from the template text, like `PromptTemplate(\"Hi {name}\")`, then fill the blanks later with `render`.",
      },
      {
        code: "def __init__(self, template: str):",
        block: "function",
        text:
          "Already written for you. It saves the template text in `self.template` and the set of placeholder names in `self.required_vars`. " +
          "For `\"Classify the sentiment of this review: {review}\"` that set is `{\"review\"}`. You only write `render`.",
      },
      {
        code: "self.required_vars = set(re.findall(",
        text: "Finds every `{name}` blank in the template and keeps just the names in a set. For `\"Hi {name}, you are {age}\"` that is `{\"name\", \"age\"}`.",
      },
      {
        code: "def render(self, **kwargs) -> str:",
        block: "function",
        text:
          "Fills in the template's blanks. You get the values by name, like `render(review=\"Great product!\")`. Inside the method, `kwargs` is a dict: `{\"review\": \"Great product!\"}`. " +
          "Extra names that the template does not use are fine. You give back the filled string, `\"Classify the sentiment of this review: Great product!\"`. " +
          "If a required name is missing, it raises a `ValueError` that lists the missing names. " +
          "Example: with `PromptTemplate(\"Hi {name}, you are {age}\")`, `render(name=\"Ana\", age=30)` gives `\"Hi Ana, you are 30\"`.",
      },
      {
        code: "raise NotImplementedError(\"PromptTemplate.render()",
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`def render(self, **kwargs):`\n`    missing = ... - kwargs.keys()`\n`    if missing:`\n`        raise ValueError(...)`\n`    return self.template.format(...)`\n" +
          "**1)** Set `missing` to `self.required_vars - kwargs.keys()`. These are the required names that were not given.\n" +
          "**2)** If `missing` is not empty, raise a `ValueError`. Its message lists all the missing names (use `sorted`), for example `Missing required variable(s): ['review']`.\n" +
          "**3)** Otherwise, return `self.template.format(**kwargs)`.\n" +
          "**Check (by hand):** with `PromptTemplate(\"Hi {name}, you are {age}\")`, `required_vars` is `{\"name\", \"age\"}`. `render(name=\"Ana\", age=30)` gives `\"Hi Ana, you are 30\"`. `render(name=\"Ana\")` raises a `ValueError` that mentions `age`.",
      },
      {
        code: "greeting = PromptTemplate(",
        text: "Makes a template with one blank, `{review}`, to test your `render` on.",
      },
      {
        code: "assert greeting.required_vars == {\"review\"}",
        text: "A self-check. The only blank in the greeting is `review`. This works already, because `__init__` is written for you.",
      },
      {
        code: "assert greeting.render(review=\"Great product!\") ==",
        text: "Runs **your** `render` and checks it gives exactly `\"Classify the sentiment of this review: Great product!\"`.",
      },
      {
        code: "greeting.render()",
        text: "Calls `render()` with no values on purpose. A value is missing, so your code must raise a `ValueError`.",
      },
      {
        code: "raise AssertionError(\"should have raised ValueError",
        text: "Only runs if `render()` did not raise. If your code gives something back, or raises a different error, the check fails here.",
      },
      {
        code: "except ValueError:",
        text: "A `ValueError` is the right outcome, so we catch it and move on.",
      },
      {
        code: "print(\"All checks passed.\")",
        text: "If all three checks hold, you see this message.",
      },
    ],
  },
];
