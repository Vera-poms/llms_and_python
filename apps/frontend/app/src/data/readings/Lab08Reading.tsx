import { Heading, Link, OrderedList, UnorderedList } from "@chakra-ui/react";
import { FlatReadingPager } from "../../components/readingLayout";
import { Code, ListItem, RunSubmitKeys, Text } from "../../components/prose";

import { CodeBlock } from "../../components/CodeBlock";
import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";
import { CodeHint } from "../../components/codeHints";

// Shown when the reader hovers the underlined code in the examples below.
// In the text, `backticks` style code and **double stars** bold a key word.
const NAME_HINT: CodeHint = {
  code: 'name = "Vera"',
  text: "Saves the text `Vera` under the label `name`. A piece of text in quote marks is called a **string**.",
};

const CONCAT_HINTS: CodeHint[] = [
  NAME_HINT,
  {
    code: '"Hello, " + name + "!"',
    text:
      'Glues three pieces together: `"Hello, "` + `"Vera"` + `"!"` gives `"Hello, Vera!"`. It works, but ' +
      "it is easy to forget a space or a quote mark.",
  },
];

const FSTRING_HINTS: CodeHint[] = [
  NAME_HINT,
  {
    code: 'f"Hello, {name}!"',
    text:
      "The `f` before the quote marks turns on filling. Python sees the `{name}`, looks up what `name` holds " +
      '("Vera"), and puts it there. The `{name}` is called a **placeholder**: an empty spot with a label.',
  },
];

const FORMAT_HINTS: CodeHint[] = [
  {
    code: 'template = "Hello, {name}!"',
    text: "Here the string has no `f`, so it is just plain text with a placeholder in it.",
  },
  {
    code: "template.format(",
    text: 'Calling `.format` says "fill the blank called `name` with `Vera`".',
  },
  {
    code: 'name="Vera"',
    text: "A **keyword argument**: you give the value together with the label it belongs to.",
  },
];

const COUNTER_HINTS: CodeHint[] = [
  {
    code: "class Counter:",
    block: "class",
    text: "Starts the blueprint. Nothing exists yet. It is only the plan, like a drawing of a house.",
  },
  {
    code: "def __init__(self, start=0):",
    block: "function",
    text:
      "Runs once, by itself, when a new object is made. It stores the starting total inside the object. " +
      "If you pass nothing, `start` is 0.",
  },
  {
    code: "def add(self, amount):",
    block: "function",
    text:
      "A **method**: a function that belongs to the object. It adds `amount` to the stored total and gives back the new total.",
  },
  {
    code: "c = Counter()",
    text:
      'Builds one real **object** from the plan. Python automatically runs `__init__`. The word `self` means "this ' +
      'object". So `self.total = start` stores 0 inside `c`.',
  },
  {
    code: "self.total = start",
    text: 'Stores `start` (0 here) inside this object. `self` means "this object".',
  },
  {
    code: "c.add(5)",
    text:
      'Runs the method on `c`. `self.total += amount` means "add to what is already stored". `0 + 5 = 5`, and 5 is returned.',
  },
  {
    code: "self.total += amount",
    text: 'Means "add to what is already stored".',
  },
  {
    code: "c.add(3)",
    text:
      'Starts from the stored 5, not from 0. `5 + 3 = 8`. This is what "remembers" means: the number is kept inside the object between calls.',
  },
];

export function Lab08Reading() {
  return (
    <FlatReadingPager>
      <Heading as="h2" size="md">Prompt templates: the two Python ideas behind them</Heading>
      <Text>
        A <b>prompt template</b> is a piece of text with blanks in it. You fill the blanks with
        your data and get a finished prompt string, ready to send to a model. This lab builds a{" "}
        <Code>PromptTemplate</Code> that does this, with no live API call yet.
      </Text>
      <Text>Two ordinary Python ideas make it work. This reading explains each from scratch:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <b>String formatting</b> - filling blanks in text with values
        </ListItem>
        <ListItem>
          <b>A class</b> - one object that stores the template and knows how to fill it
        </ListItem>
      </UnorderedList>

      <Heading as="h2" size="md">String formatting: filling blanks in text</Heading>
      <Text>Say you want to greet someone by name, filling a blank in a piece of text with a value.</Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>You could paste strings together:</Text>
      <RunnableExample labId={8} hints={CONCAT_HINTS} code={`name = "Vera"
greeting = "Hello, " + name + "!"
# "Hello, Vera!"`} />
      <Text>
        That works, but gets ugly fast once you have several blanks to fill. Python gives you two
        cleaner ways to do the same thing. An <b>f-string</b> (a string literal prefixed with{" "}
        <Code>f</Code>) lets you drop a variable straight into the text inside <Code>{"{}"}</Code>:
      </Text>
      <RunnableExample labId={8} hints={FSTRING_HINTS} code={`name = "Vera"
greeting = f"Hello, {name}!"
# "Hello, Vera!"`} />
      <Text>
        A close cousin is the <Code>.format()</Code> method, which does the same substitution but on
        a plain string template that isn't tied to variables at the moment it's written:
      </Text>
      <RunnableExample labId={8} hints={FORMAT_HINTS} code={`template = "Hello, {name}!"
template.format(name="Vera")
# "Hello, Vera!"`} />

      <CodeBlock code={`item = "notebook"
qty = 3
message = f"You ordered {qty} {item}(s)."
print(message)  # expected output: You ordered 3 notebook(s).

order_template = "You ordered {qty} {item}(s)."
print(order_template.format(qty=5, item="pen"))  # expected output: You ordered 5 pen(s).`} hints={[
        {
          code: 'f"You ordered {qty} {item}(s)."',
          text:
            "An **f-string**: the `f` before the quote marks fills each `{...}` blank right now. `{qty}` becomes 3 " +
            "and `{item}` becomes notebook. The number is turned into text for you.",
        },
        {
          code: 'order_template = "You ordered {qty} {item}(s)."',
          text: "The same sentence, but with no `f`. It is plain text with two blanks still in it. Nothing is filled yet.",
        },
        {
          code: 'order_template.format(qty=5, item="pen")',
          text:
            "Fills the blanks now, with new values. `qty=5` and `item=\"pen\"` say which value goes in which blank. " +
            "You get `You ordered 5 pen(s).`",
        },
      ]} />
      <PracticeCell labId={8} cellId="concept-1" code={`item = "notebook"
qty = 3
message = f"You ordered {qty} {item}(s)."
print(message)  # expected output: You ordered 3 notebook(s).

order_template = "You ordered {qty} {item}(s)."
print(order_template.format(qty=5, item="pen"))  # expected output: You ordered 5 pen(s).`} expectedOutput={`You ordered 3 notebook(s).
You ordered 5 pen(s).`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>item</Code> holds <Code>"notebook"</Code> and <Code>qty</Code> holds 3.
        </ListItem>
        <ListItem>
          The f-string fills both blanks right away: <Code>{"{qty}"}</Code> becomes 3 and{" "}
          <Code>{"{item}"}</Code> becomes notebook. So <Code>message</Code> is{" "}
          <Code>"You ordered 3 notebook(s)."</Code>. The numbers are turned into text for you.
        </ListItem>
        <ListItem>
          <Code>order_template</Code> has the same sentence, but it is plain text with blanks still
          in it. Nothing is filled yet.
        </ListItem>
        <ListItem>
          <Code>.format(qty=5, item="pen")</Code> fills the blanks now, with new values. The result
          is <Code>"You ordered 5 pen(s)."</Code>. The same template gave a different sentence.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> two lines, <Code>You ordered 3 notebook(s).</Code> and then{" "}
        <Code>You ordered 5 pen(s).</Code>. Try changing <Code>qty=5</Code> to{" "}
        <Code>qty=12</Code> and run it again. Only the number in the second line changes.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: a prompt is just text</Heading>
      <Text>
        A model never sees your Python variables. It only gets one finished piece of text, the <b>prompt</b>. Whatever you want it to do, and whatever it should look at, must be inside that text.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A good prompt has an <b>instruction</b> (what to do) and some <b>data</b> (what to do it on).
        </ListItem>
        <ListItem>
          A blank line between the two keeps the instruction apart from the data. This also helps the model.
        </ListItem>
        <ListItem>
          The prompt counts toward the model's limit, in tokens (lab 16). So the longer it is, the more room it uses.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. One function builds the prompt from an instruction and a review with an f-string. A loop builds a prompt for each of two reviews and prints it with its length.
      </Text>
      <RunnableExample labId={8} code={`def build_prompt(instruction, review):
    return f"{instruction}\\n\\nReview: {review}"


instruction = "Summarize this review in one short sentence."
for review in ["I loved it", "Too slow"]:
    prompt = build_prompt(instruction, review)
    print(prompt)
    print("characters:", len(prompt))
    print("---")`} hints={[
        {
          code: "def build_prompt(instruction, review):",
          block: "function",
          text:
            "Takes an instruction and a review and gives back one finished prompt: the instruction, a blank line, " +
            "then `Review:` and the review.",
        },
        {
          code: 'for review in ["I loved it", "Too slow"]:',
          block: "for loop",
          text:
            "Runs the indented lines once for each review. Each round builds a prompt, prints it, prints its " +
            "length, then prints `---` to keep the two apart.",
        },
        {
          code: 'f"{instruction}\\n\\nReview: {review}"',
          text:
            "An f-string that fills two blanks. `\\n` means \"new line\", so `\\n\\n` ends the instruction line and " +
            "then leaves one empty line before the review.",
        },
        {
          code: "prompt = build_prompt(",
          text: "Calls the function with this round's review. The finished text it gives back is stored in `prompt`.",
        },
        {
          code: "len(prompt)",
          text:
            "Counts the characters in the prompt, spaces and new lines included. The first prompt has 64, the second 62.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>build_prompt</Code> glues three parts: the instruction, a blank line (<Code>\n\n</Code>) and <Code>Review:</Code> plus the review.
        </ListItem>
        <ListItem>
          The prompt for <Code>I loved it</Code> is 64 characters. The one for <Code>Too slow</Code> is 62. The model gets exactly this text and nothing more.
        </ListItem>
        <ListItem>
          The instruction is the same in both. Only the last line changes.
        </ListItem>
        <ListItem>
          Pattern: prompt = instruction + blank line + data, and the model only sees the finished string.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>build_prompt</Code> from the worked example above, exactly as it is.
        </ListItem>
        <ListItem>
          Set <Code>instruction = "Translate this review into French."</Code>.
        </ListItem>
        <ListItem>
          Loop <Code>for review in ["Great film", "Boring plot"]</Code>. Inside the loop, set{" "}
          <Code>prompt = build_prompt(instruction, review)</Code>.
        </ListItem>
        <ListItem>
          Print <Code>prompt</Code>, then print <Code>"characters:"</Code> and{" "}
          <Code>len(prompt)</Code>, then print <Code>"---"</Code>. Use the same{" "}
          <Code>print(...)</Code> lines as the worked example.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={8} cellId="topic-1" withHint code={`def build_prompt(instruction, review):
    return f"{instruction}\\n\\nReview: {review}"


instruction = "Translate this review into French."
for review in ["Great film", "Boring plot"]:
    prompt = build_prompt(instruction, review)
    print(prompt)
    print("characters:", len(prompt))
    print("---")`} expectedOutput={`Translate this review into French.

Review: Great film
characters: 54
---
Translate this review into French.

Review: Boring plot
characters: 55
---`} />
      <Text>
        <b>What you should see:</b> exactly these lines, including the empty lines. If yours
        differ, check the instruction text and the two reviews.
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
        {`Translate this review into French.

Review: Great film
characters: 54
---
Translate this review into French.

Review: Boring plot
characters: 55
---`}
      </Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The instruction <Code>Translate this review into French.</Code> has 34 characters.
        </ListItem>
        <ListItem>
          <Code>Great film</Code> adds 2 for the blank line, 8 for <Code>Review: </Code> and 10 for the review. So <Code>34 + 2 + 8 + 10 = 54</Code> characters.
        </ListItem>
        <ListItem>
          <Code>Boring plot</Code> has 11 characters, so that prompt is 55.
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In this lab, every finished prompt has the same layout: an instruction, a blank line, then{" "}
        <Code>Review:</Code> and the review. The instruction never changes, so it is written once as
        a template. An f-string bakes in its values the moment it is written, but a{" "}
        <Code>.format()</Code> template can be stored and filled in later with different data every
        time you call it. That is exactly what <Code>PromptTemplate</Code> needs, since the same
        template (e.g. "classify this review") gets reused across many different reviews.
      </Text>
      <Text>
        Think of the template as a form with an empty line on it. You print the form once, and you
        fill in one new name each time. Here is the lab's template meeting one review:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The template is{" "}
          <Code>"Summarize this review in one short sentence.\n\nReview: {"{review}"}"</Code>. The{" "}
          <Code>\n\n</Code> inside it means "start a new line, then leave a blank line".
        </ListItem>
        <ListItem>
          Call <Code>.format(review="I loved it")</Code>. The blank <Code>{"{review}"}</Code> is
          replaced by <Code>I loved it</Code>.
        </ListItem>
        <ListItem>
          You get the sentence "Summarize this review in one short sentence.", then a blank line,
          then <Code>Review: I loved it</Code>. That finished text is the prompt.
        </ListItem>
        <ListItem>
          Call it again with <Code>review="Too slow"</Code> and the first part stays the same. Only
          the last line changes.
        </ListItem>
      </UnorderedList>

      <Heading as="h2" size="md">Separating the template from the data</Heading>
      <Text>
        Notice the pattern above: <Code>{"\"Hello, {name}!\""}</Code> is the reusable <b>template</b> -
        the shape of the message that never changes. The word <Code>"Vera"</Code> is the{" "}
        <b>data</b> - it changes every time. Keeping these two separate is a small but powerful idea.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        A function that takes a template and reuses it with different data, nothing LLM-related here:
      </Text>
      <RunnableExample labId={8} code={`template = "Hello, {name}!"

def render(template, **data):
    return template.format(**data)

render(template, name="Vera")  # "Hello, Vera!"
render(template, name="Sam")   # "Hello, Sam!"`} hints={[
        {
          code: "def render(template, **data):",
          block: "function",
          text:
            "Fills any template with any data you pass in, and gives back the finished text. The same function " +
            "works for every template.",
        },
        {
          code: 'template = "Hello, {name}!"',
          text:
            "The **template**: text with a blank called `name`. It has no `f`, so the blank stays empty until " +
            "something fills it.",
        },
        {
          code: ", **data)",
          text:
            "`**data` collects every **keyword argument** (a value given with its label, like `name=\"Vera\"`) " +
            "into one dict. Here `data` becomes `{'name': 'Vera'}`.",
        },
        {
          code: ".format(**data)",
          text:
            "Here `**` works the other way. It spreads the dict back out into labelled values, so this is the same " +
            "as `template.format(name=\"Vera\")`.",
        },
        {
          code: 'render(template, name="Vera")',
          text: "Calls `render` with the template and one labelled value. It gives back `\"Hello, Vera!\"`.",
        },
        {
          code: 'render(template, name="Sam")',
          text: "Same template, new data. This time you get `\"Hello, Sam!\"`.",
        },
      ]} />
      <Text>
        The template gets written once, and reused for as many different pieces of data as you like -
        it means you can write it once, test it once, and reuse it safely for a thousand different
        pieces of data without rewriting any text.
      </Text>

      <Text>Here is what happens when you call <Code>render(template, name="Vera")</Code>:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>def render(template, **data)</Code> - the <Code>**data</Code> part means "collect
          every keyword argument into one dict". Here that gives{" "}
          <Code>{"{'name': 'Vera'}"}</Code>. A <b>dict</b> is a table of labels and values.
        </ListItem>
        <ListItem>
          <Code>template.format(**data)</Code> - now the <Code>**</Code> works the other way. It
          spreads the dict back out into keyword arguments. It is the same as writing{" "}
          <Code>template.format(name="Vera")</Code>.
        </ListItem>
        <ListItem>
          The result is <Code>"Hello, Vera!"</Code>. Call <Code>render</Code> again with{" "}
          <Code>name="Sam"</Code> and you get <Code>"Hello, Sam!"</Code> from the same template.
        </ListItem>
      </UnorderedList>

      <CodeBlock code={`def render(template, **data):
    return template.format(**data)

invoice_template = "Invoice for {customer}: \${amount}"
print(render(invoice_template, customer="Alex", amount=42))  # expected output: Invoice for Alex: $42
print(render(invoice_template, customer="Sam", amount=17))  # expected output: Invoice for Sam: $17`} hints={[
        {
          code: "def render(template, **data):",
          block: "function",
          text: "The same `render` as above. It fills the blanks in any template with the labelled values you pass in.",
        },
        {
          code: ", **data)",
          text: "`**data` collects the labelled values you pass in, like `customer=\"Alex\"`, into one dict called `data`.",
        },
        {
          code: ".format(**data)",
          text: "`**` spreads the dict back out into labelled values, and `.format` puts each one in its blank.",
        },
        {
          code: 'invoice_template = "Invoice for {customer}: ${amount}"',
          text:
            "A template with two blanks, `{customer}` and `{amount}`. The `$` is just a normal character. Only " +
            "curly braces make a blank.",
        },
        {
          code: 'render(invoice_template, customer="Alex", amount=42)',
          text:
            "Inside `render`, `data` becomes `{'customer': 'Alex', 'amount': 42}`. The blanks are filled and you " +
            "get `Invoice for Alex: $42`.",
        },
        {
          code: 'render(invoice_template, customer="Sam", amount=17)',
          text: "Same template, new data. You get `Invoice for Sam: $17`. The template itself is not changed.",
        },
      ]} />
      <PracticeCell labId={8} cellId="concept-2" code={`def render(template, **data):
    return template.format(**data)

invoice_template = "Invoice for {customer}: \${amount}"
print(render(invoice_template, customer="Alex", amount=42))  # expected output: Invoice for Alex: $42
print(render(invoice_template, customer="Sam", amount=17))  # expected output: Invoice for Sam: $17`} expectedOutput={`Invoice for Alex: $42
Invoice for Sam: $17`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>invoice_template</Code> is the reusable text. It has two blanks:{" "}
          <Code>{"{customer}"}</Code> and <Code>{"{amount}"}</Code>. The <Code>$</Code> sign is
          just a normal character. Only curly braces make a blank.
        </ListItem>
        <ListItem>
          First call: <Code>data</Code> becomes{" "}
          <Code>{"{'customer': 'Alex', 'amount': 42}"}</Code>. The blanks are filled, so you get{" "}
          <Code>Invoice for Alex: $42</Code>.
        </ListItem>
        <ListItem>
          Second call: same template, new data (Sam and 17). You get{" "}
          <Code>Invoice for Sam: $17</Code>. The template was not changed or copied.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> two invoice lines, one for Alex and one for Sam. Try adding a
        third call with <Code>customer="Mia", amount=99</Code>. You should get a third line for
        Mia without touching the template.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: one template, many prompts</Heading>
      <Text>
        Working with a model means asking the same thing again and again, for many inputs. If you typed each prompt by hand, small differences would creep in. Then the answers could change for reasons you never planned.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A template fixes the instruction. Only the data changes, so a difference in the answers comes from the data.
        </ListItem>
        <ListItem>
          You can test and improve the template once. Every prompt then gets the improvement.
        </ListItem>
        <ListItem>
          To change the task, swap the template. The same reviews get a new instruction.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. A dict holds two templates. One function fills a template with each review in a list. A loop runs both templates over the same two reviews.
      </Text>
      <RunnableExample labId={8} code={`def make_prompts(template, reviews):
    prompts = []
    for review in reviews:
        prompts.append(template.format(review=review))
    return prompts


templates = {
    "classify": "Classify this review as positive or negative.\\n\\nReview: {review}",
    "summarize": "Summarize this review in one short sentence.\\n\\nReview: {review}",
}
reviews = ["I loved it", "Too slow"]
for name, template in templates.items():
    prompts = make_prompts(template, reviews)
    print(name, "->", len(prompts), "prompts")
    for prompt in prompts:
        task, data = prompt.split("\\n\\n")
        print("  ", task, "|", data)`} hints={[
        {
          code: "def make_prompts(template, reviews):",
          block: "function",
          text:
            "Takes one template and a list of reviews. It fills the template once for each review and gives back " +
            "the list of finished prompts.",
        },
        {
          code: "for review in reviews:",
          block: "for loop",
          text: "Repeats once per review. Each round fills the `{review}` blank and adds the result to the `prompts` list.",
        },
        {
          code: "for name, template in templates.items():",
          block: "for loop",
          text:
            "Runs once for each template in the dict: first `classify`, then `summarize`. Each round makes the " +
            "prompts for both reviews and prints them.",
        },
        {
          code: "for prompt in prompts:",
          block: "for loop",
          text: "Runs once per prompt. It cuts the prompt at the blank line and prints the two parts with a `|` between them.",
        },
        {
          code: "prompts = []",
          text: "Starts an empty list. The loop below adds one prompt to it for each review.",
        },
        {
          code: "prompts.append(",
          text: "`.append` adds one item to the end of a list. Here it adds the filled-in prompt.",
        },
        {
          code: "template.format(review=review)",
          text:
            "Fills the `{review}` blank with this round's review. The left `review` is the blank's name, the right " +
            "`review` is the value.",
        },
        {
          code: "templates = {",
          text:
            "A **dict**: a table of labels and values. Each label (`\"classify\"`, `\"summarize\"`) points to one template.",
        },
        {
          code: "templates.items()",
          text: "`.items()` gives the dict's entries as pairs. `name` gets the label and `template` gets the text.",
        },
        {
          code: 'task, data = prompt.split("\\n\\n")',
          text:
            "`.split` cuts the text at the blank line into a list of two pieces. `task, data = ...` gives each " +
            "piece its own name: the instruction, then the review line.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>make_prompts</Code> loops over the reviews and fills the blank each time. Two reviews give two prompts.
        </ListItem>
        <ListItem>
          Each prompt is cut at its blank line into the task part and the data part. For one template the task part is the same in both prompts, and only the data differs.
        </ListItem>
        <ListItem>
          Switching from <Code>classify</Code> to <Code>summarize</Code> changes the task for the same reviews. 2 templates times 2 reviews makes 4 prompts, and only 2 instructions were written.
        </ListItem>
        <ListItem>
          Pattern: write the instruction once, then make as many prompts as you have data.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>make_prompts</Code> from the worked example above, exactly as it is.
        </ListItem>
        <ListItem>
          Make a dict called <Code>templates</Code> with two entries. The key <Code>"shout"</Code>{" "}
          has the text{" "}
          <Code>{"Rewrite this review in capital letters.\\n\\nReview: {review}"}</Code>. The key{" "}
          <Code>"title"</Code> has the text{" "}
          <Code>{"Give this review a short title.\\n\\nReview: {review}"}</Code>. Write the{" "}
          <Code>{"\\n\\n"}</Code> and the <Code>{"{review}"}</Code> blank just as the worked
          example does.
        </ListItem>
        <ListItem>
          Set <Code>reviews = ["Nice acting", "Too long", "Loved the music"]</Code>.
        </ListItem>
        <ListItem>
          Loop <Code>for name, template in templates.items()</Code>. Inside it, set{" "}
          <Code>prompts = make_prompts(template, reviews)</Code> and print <Code>name</Code>,{" "}
          <Code>"-&gt;"</Code>, <Code>len(prompts)</Code> and <Code>"prompts"</Code>.
        </ListItem>
        <ListItem>
          Then loop <Code>for prompt in prompts</Code>, set{" "}
          <Code>{`task, data = prompt.split("\\n\\n")`}</Code>, and print <Code>"  "</Code> (two
          spaces), <Code>task</Code>, <Code>"|"</Code> and <Code>data</Code>. Use the same{" "}
          <Code>print(...)</Code> lines as the worked example.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={8} cellId="topic-2" withHint code={`def make_prompts(template, reviews):
    prompts = []
    for review in reviews:
        prompts.append(template.format(review=review))
    return prompts


templates = {
    "shout": "Rewrite this review in capital letters.\\n\\nReview: {review}",
    "title": "Give this review a short title.\\n\\nReview: {review}",
}
reviews = ["Nice acting", "Too long", "Loved the music"]
for name, template in templates.items():
    prompts = make_prompts(template, reviews)
    print(name, "->", len(prompts), "prompts")
    for prompt in prompts:
        task, data = prompt.split("\\n\\n")
        print("  ", task, "|", data)`} expectedOutput={`shout -> 3 prompts
   Rewrite this review in capital letters. | Review: Nice acting
   Rewrite this review in capital letters. | Review: Too long
   Rewrite this review in capital letters. | Review: Loved the music
title -> 3 prompts
   Give this review a short title. | Review: Nice acting
   Give this review a short title. | Review: Too long
   Give this review a short title. | Review: Loved the music`} />
      <Text>
        <b>What you should see:</b> exactly these eight lines. If yours differ, check the template
        text, the reviews and the spaces in your print lines.
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
        {`shout -> 3 prompts
   Rewrite this review in capital letters. | Review: Nice acting
   Rewrite this review in capital letters. | Review: Too long
   Rewrite this review in capital letters. | Review: Loved the music
title -> 3 prompts
   Give this review a short title. | Review: Nice acting
   Give this review a short title. | Review: Too long
   Give this review a short title. | Review: Loved the music`}
      </Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>make_prompts</Code> gives 3 prompts for each template, one for each review.
        </ListItem>
        <ListItem>
          <Code>prompt.split("\n\n")</Code> cuts at the blank line into two parts. <Code>task, data = ...</Code> gives each part a name.
        </ListItem>
        <ListItem>
          In all that is 6 prompts, from only 2 instructions. In each group the task is the same on
          every line, and only the review changes. Each printed line starts with 3 spaces: the 2
          you print, plus the 1 that <Code>print</Code> adds between items.
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In this lab's <Code>PromptTemplate</Code>, the template is the string passed into{" "}
        <Code>__init__</Code> (e.g. <Code>"Classify the sentiment of this review: {"{review}"}"</Code>
        ), and the data is whatever gets passed into <Code>.render(review="Great product!")</Code>. The
        template describes the task; the data is one specific review. This split is exactly why the
        notebook can define <Code>TEMPLATES</Code> once and then loop it over many real review
        sentences.
      </Text>
      <Text>
        The notebook builds a <Code>TEMPLATES</Code> dict with two entries,{" "}
        <Code>"classify_sentiment"</Code> and <Code>"summarize"</Code>. Then it loops over the
        first two review sentences and prints each template filled in with each review. That makes 2
        headers and 4 prompts in all. Here is
        what that does with one tiny review, <Code>"the plot was engaging"</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>for name, template in TEMPLATES.items()</Code> takes one entry at a time. First{" "}
          <Code>name</Code> is <Code>"classify_sentiment"</Code>.
        </ListItem>
        <ListItem>
          <Code>template.render(review="the plot was engaging")</Code> gives:{" "}
          <Code>Classify the sentiment of this review as positive or negative. Reply with a single
          word.</Code>, then a blank line, then <Code>Review: the plot was engaging</Code>.
        </ListItem>
        <ListItem>
          Next entry: <Code>"summarize"</Code>. Same review, different task:{" "}
          <Code>Summarize this review in one short sentence.</Code>, a blank line, then{" "}
          <Code>Review: the plot was engaging</Code>.
        </ListItem>
        <ListItem>
          Nothing is sent to an LLM yet. You are only printing the prompts that labs 9 to 12 will
          send for real.
        </ListItem>
      </UnorderedList>

      <Heading as="h2" size="md">A class that stores state and has a method to act on it</Heading>
      <Text>
        A Python <b>class</b> is a blueprint for bundling data together with the functions
        ("methods") that operate on that data.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>Here's the idea with something totally unrelated to LLMs - a class that remembers a running total:</Text>
      <RunnableExample labId={8} hints={COUNTER_HINTS} code={`class Counter:
    def __init__(self, start=0):
        self.total = start  # state stored on the instance

    def add(self, amount):
        self.total += amount
        return self.total

c = Counter()
c.add(5)   # 5
c.add(3)   # 8 - remembers the previous call`} />
      <Text>
        <Code>__init__</Code> runs once, when the object is created, and sets up{" "}
        <Code>self.total</Code> - state that sticks around on that specific instance. <Code>add</Code>{" "}
        is a method: a function attached to the class that can read and update that stored state.
      </Text>

      <CodeBlock code={`class Tally:
    def __init__(self, start=0):
        self.count = start  # state stored on the instance

    def bump(self, n=1):
        self.count += n
        return self.count

t = Tally()
t.bump(2)
print(t.bump(3))  # expected output: 5`} hints={[
        {
          code: "class Tally:",
          block: "class",
          text:
            "A blueprint for a counter object. Each `Tally` you make keeps its own `count` and has a `bump` " +
            "method to add to it.",
        },
        {
          code: "def __init__(self, start=0):",
          block: "function",
          text: "Runs once, by itself, when you make a new `Tally`. It stores the starting count: 0, unless you pass another number.",
        },
        {
          code: "def bump(self, n=1):",
          block: "function",
          text:
            "Adds `n` to the stored count and gives back the new count. `n=1` is a **default**: call `bump()` " +
            "with nothing and `n` is 1.",
        },
        {
          code: "self.count = start",
          text: 'Stores `start` inside this object. `self` means "this object".',
        },
        {
          code: "self.count += n",
          text: "Short for `self.count = self.count + n`: add to what is already stored.",
        },
        {
          code: "t = Tally()",
          text: "Builds one real object from the blueprint. `__init__` runs and `count` starts at 0.",
        },
        {
          code: "t.bump(2)",
          text: "Adds 2, so the count is now 2. It gives back 2, but nothing prints it, so you do not see it.",
        },
        {
          code: "t.bump(3)",
          text: "Adds 3 to the stored 2, giving 5. It sits inside `print`, so the 5 shows on screen.",
        },
      ]} />
      <PracticeCell labId={8} cellId="concept-3" code={`class Tally:
    def __init__(self, start=0):
        self.count = start  # state stored on the instance

    def bump(self, n=1):
        self.count += n
        return self.count

t = Tally()
t.bump(2)
print(t.bump(3))  # expected output: 5`} expectedOutput={`5`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>t = Tally()</Code> makes one object. <Code>__init__</Code> runs and stores{" "}
          <Code>count = 0</Code> inside it.
        </ListItem>
        <ListItem>
          <Code>t.bump(2)</Code> adds 2: <Code>0 + 2 = 2</Code>. It returns 2, but nothing prints it, so you do
          not see it.
        </ListItem>
        <ListItem>
          <Code>t.bump(3)</Code> adds 3 to the stored 2: <Code>2 + 3 = 5</Code>. This one is inside{" "}
          <Code>print</Code>, so the 5 shows on screen.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> a single line, <Code>5</Code>. Try changing{" "}
        <Code>t.bump(3)</Code> to <Code>t.bump()</Code> with nothing in the brackets. The default{" "}
        <Code>n=1</Code> is used, so you should see 3.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: check the prompt before it is sent</Heading>
      <Text>
        A real model will try to answer almost anything you send. It does not tell you that your prompt is broken. A call to a model also takes time and can cost money. So it pays to check a prompt before you send it.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Say a template needs <Code>topic</Code> and <Code>style</Code>, but only <Code>topic</Code> arrives. The prompt is then not what you meant to send.
        </ListItem>
        <ListItem>
          Python's own <Code>.format()</Code> would stop, but only with a bare <Code>KeyError</Code> naming the first missing name.
        </ListItem>
        <ListItem>
          A check made first can list every missing name and say it clearly. This is called failing early.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. One function loops over the names a template needs and collects the ones the data does not have. A second function uses it: if anything is missing, the prompt is not built. Nothing is sent to a real model here.
      </Text>
      <RunnableExample labId={8} code={`def find_missing(required, given):
    missing = []
    for name in required:
        if name not in given:
            missing.append(name)
    return missing


def safe_render(template, required, data):
    missing = find_missing(required, data)
    if missing:
        return "NOT SENT, missing: " + ", ".join(missing)
    return template.format(**data)


template = "Tell me about {topic} in {style} style"
required = ["topic", "style"]
for data in [{"topic": "cats", "style": "funny"}, {"topic": "cats"}, {}]:
    print(safe_render(template, required, data))`} hints={[
        {
          code: "def find_missing(required, given):",
          block: "function",
          text:
            "Goes through the names a template needs and collects the ones the data does not have. It gives back " +
            "that list, which is empty if nothing is missing.",
        },
        {
          code: "for name in required:",
          block: "for loop",
          text: "Checks each needed name, one at a time. Any name that is not in the data is added to `missing`.",
        },
        {
          code: "def safe_render(template, required, data):",
          block: "function",
          text:
            "Builds the prompt only when no name is missing. Otherwise it gives back a `NOT SENT` message that " +
            "lists every missing name.",
        },
        {
          code: 'for data in [{"topic": "cats", "style": "funny"}, {"topic": "cats"}, {}]:',
          block: "for loop",
          text:
            "Tries three dicts of data: one complete, one without `style`, and one empty (`{}`). Each round prints " +
            "what `safe_render` gives back.",
        },
        {
          code: "if name not in given:",
          text: '`not in` asks "is this name missing?" For a dict, it looks at the labels.',
        },
        {
          code: "if missing:",
          text: "An empty list counts as false. So this only runs when at least one name is missing.",
        },
        {
          code: '", ".join(missing)',
          text:
            "Glues the names in the list into one text, with `, ` between them. `[\"topic\", \"style\"]` becomes " +
            "`topic, style`.",
        },
        {
          code: "template.format(**data)",
          text: "Fills the blanks. `**data` spreads the dict out into labelled values, like `topic=\"cats\", style=\"funny\"`.",
        },
        {
          code: 'required = ["topic", "style"]',
          text: "The names the template needs, one for each blank.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The first data has both names, so the prompt is built: <Code>Tell me about cats in funny style</Code>.
        </ListItem>
        <ListItem>
          The second data has no <Code>style</Code>, so you get <Code>NOT SENT, missing: style</Code>.
        </ListItem>
        <ListItem>
          The third data is empty, so both names are listed at once: <Code>topic, style</Code>.
        </ListItem>
        <ListItem>
          Pattern: check first, build second, so a bad prompt never leaves your code.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>find_missing</Code> and <Code>safe_render</Code> from the worked example
          above, exactly as they are.
        </ListItem>
        <ListItem>
          Set <Code>template = "Write a {"{length}"} poem about {"{topic}"}"</Code> and{" "}
          <Code>required = ["length", "topic"]</Code>.
        </ListItem>
        <ListItem>
          Loop over three dicts, in this order:{" "}
          <Code>{`{"length": "short", "topic": "rain"}`}</Code>, <Code>{`{"topic": "rain"}`}</Code>{" "}
          and <Code>{`{"length": "long"}`}</Code>. For each one, print{" "}
          <Code>safe_render(template, required, data)</Code>. Use the same loop shape as the
          worked example.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={8} cellId="topic-3" withHint code={`def find_missing(required, given):
    missing = []
    for name in required:
        if name not in given:
            missing.append(name)
    return missing


def safe_render(template, required, data):
    missing = find_missing(required, data)
    if missing:
        return "NOT SENT, missing: " + ", ".join(missing)
    return template.format(**data)


template = "Write a {length} poem about {topic}"
required = ["length", "topic"]
for data in [{"length": "short", "topic": "rain"}, {"topic": "rain"}, {"length": "long"}]:
    print(safe_render(template, required, data))`} expectedOutput={`Write a short poem about rain
NOT SENT, missing: length
NOT SENT, missing: topic`} />
      <Text>
        <b>What you should see:</b> exactly these three lines. If yours differ, check the template
        text and the order of the three dicts.
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
        {`Write a short poem about rain
NOT SENT, missing: length
NOT SENT, missing: topic`}
      </Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The template <Code>{"Write a {length} poem about {topic}"}</Code> needs two names, in the order <Code>length</Code>, <Code>topic</Code>.
        </ListItem>
        <ListItem>
          The first data has both, so the prompt is built.
        </ListItem>
        <ListItem>
          The second data lacks <Code>length</Code> and the third lacks <Code>topic</Code>, so each one gives a <Code>NOT SENT</Code> line with the missing name.
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>PromptTemplate</Code> follows the exact same shape. Its <Code>__init__</Code> stores{" "}
        <Code>self.template</Code> (the raw string) and computes <Code>self.required_vars</Code> - the
        set of placeholder names found in the template, extracted with a regular expression{" "}
        (<Code>{"re.findall(r\"\\{(\\w+)\\}\", template)"}</Code>). Its <Code>render(**kwargs)</Code>{" "}
        method is where the action happens: it checks that every required variable was supplied
        (raising <Code>ValueError</Code> listing anything missing), then calls{" "}
        <Code>self.template.format(**kwargs)</Code> to produce the final string. Storing the
        template once and validating on every render means a typo in your data (a missing{" "}
        <Code>review=</Code> argument) fails loudly and immediately, with a clear message that lists
        every missing name, before any prompt is built.
      </Text>
      <Text>
        Here is the lab's class on a tiny template with two blanks,{" "}
        <Code>"Tell me about {"{topic}"} in {"{style}"} style"</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>PromptTemplate("Tell me about ...")</Code> runs <Code>__init__</Code>. It saves the
          text in <Code>self.template</Code>.
        </ListItem>
        <ListItem>
          The pattern <Code>{"\\{(\\w+)\\}"}</Code> reads as: a real <Code>{"{"}</Code>, then one
          or more word characters (letters, digits or <Code>_</Code>), then a real{" "}
          <Code>{"}"}</Code>. The round brackets mean "keep only the name inside". So{" "}
          <Code>re.findall</Code> gives <Code>['topic', 'style']</Code>.
        </ListItem>
        <ListItem>
          <Code>set(...)</Code> turns that list into a <b>set</b>: a bag of unique names with no
          repeats and no order. So <Code>self.required_vars</Code> is{" "}
          <Code>{"{'topic', 'style'}"}</Code>.
        </ListItem>
        <ListItem>
          <Code>render(topic="cats", style="funny")</Code>: <Code>kwargs.keys()</Code> is{" "}
          <Code>topic</Code> and <Code>style</Code>. Subtracting them from the required names
          leaves nothing, so <Code>missing</Code> is empty. Python reads an empty set as "false",
          so the <Code>if missing:</Code> check does not fire. The method returns{" "}
          <Code>"Tell me about cats in funny style"</Code>.
        </ListItem>
        <ListItem>
          <Code>render(topic="cats")</Code>: now <Code>style</Code> is left over, so{" "}
          <Code>missing</Code> is <Code>{"{'style'}"}</Code>. The method raises{" "}
          <Code>ValueError: Missing required variable(s): ['style']</Code> before any text is
          built. <Code>sorted(missing)</Code> just puts the names in a tidy order.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Further reading</Heading>
      <Text>
        IBM Think:{" "}
        <Link href="https://www.ibm.com/think/topics/prompt-engineering" isExternal color="blue.500">
          What is prompt engineering?
        </Link>
      </Text>
    </FlatReadingPager>
  );
}
