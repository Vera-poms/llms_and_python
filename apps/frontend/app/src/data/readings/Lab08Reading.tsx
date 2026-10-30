import { Heading, Link, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab08Reading() {
  return (
    <VStack align="stretch" spacing={4}>
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
      <RunnableExample labId={8} code={`name = "Vera"
greeting = "Hello, " + name + "!"
# "Hello, Vera!"`} />
      <Text>
        That works, but gets ugly fast once you have several blanks to fill. Python gives you two
        cleaner ways to do the same thing. An <b>f-string</b> (a string literal prefixed with{" "}
        <Code>f</Code>) lets you drop a variable straight into the text inside <Code>{"{}"}</Code>:
      </Text>
      <RunnableExample labId={8} code={`name = "Vera"
greeting = f"Hello, {name}!"
# "Hello, Vera!"`} />
      <Text>
        A close cousin is the <Code>.format()</Code> method, which does the same substitution but on
        a plain string template that isn't tied to variables at the moment it's written:
      </Text>
      <RunnableExample labId={8} code={`template = "Hello, {name}!"
template.format(name="Vera")
# "Hello, Vera!"`} />

      <Text>Here is what each of the three examples does, one step at a time:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>name = "Vera"</Code> saves the text <Code>Vera</Code> under the label{" "}
          <Code>name</Code>. A piece of text in quote marks is called a <b>string</b>.
        </ListItem>
        <ListItem>
          <Code>"Hello, " + name + "!"</Code> glues three pieces together: <Code>"Hello, "</Code>{" "}
          + <Code>"Vera"</Code> + <Code>"!"</Code> gives <Code>"Hello, Vera!"</Code>. It works, but
          it is easy to forget a space or a quote mark.
        </ListItem>
        <ListItem>
          <Code>f"Hello, {"{name}"}!"</Code> - the <Code>f</Code> before the quote marks turns on
          filling. Python sees the <Code>{"{name}"}</Code>, looks up what <Code>name</Code> holds
          ("Vera"), and puts it there. The <Code>{"{name}"}</Code> is called a{" "}
          <b>placeholder</b>: an empty spot with a label.
        </ListItem>
        <ListItem>
          <Code>template.format(name="Vera")</Code> - here the string has no <Code>f</Code>, so it
          is just plain text with a placeholder in it. Calling <Code>.format</Code> says "fill the
          blank called <Code>name</Code> with <Code>Vera</Code>". The <Code>name="Vera"</Code> part
          is a <b>keyword argument</b>: you give the value together with the label it belongs to.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell comparing an f-string to a{" "}
        <Code>.format()</Code> template - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`item = "notebook"
qty = 3
message = f"You ordered {qty} {item}(s)."
print(message)  # expected output: You ordered 3 notebook(s).

order_template = "You ordered {qty} {item}(s)."
print(order_template.format(qty=5, item="pen"))  # expected output: You ordered 5 pen(s).`}
      </Code>
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
    print("---")`} />
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

      <Text color="gray.600">
        Try it: use the same function with a new instruction and two new reviews.
      </Text>
      <PracticeCell labId={8} cellId="topic-1" code={`def build_prompt(instruction, review):
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
        <b>What this cell does, step by step:</b>
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
      <Text>
        <b>What you should see:</b> two prompts, each with its instruction, a blank line, a review line and a length line, then <Code>---</Code>. The lengths are 54 and 55.
      </Text>

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
render(template, name="Sam")   # "Hello, Sam!"`} />
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

      <Text color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell reusing one template with different data -
        run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`def render(template, **data):
    return template.format(**data)

invoice_template = "Invoice for {customer}: \${amount}"
print(render(invoice_template, customer="Alex", amount=42))  # expected output: Invoice for Alex: $42
print(render(invoice_template, customer="Sam", amount=17))  # expected output: Invoice for Sam: $17`}
      </Code>
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
        print("  ", task, "|", data)`} />
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

      <Text color="gray.600">
        Try it: use the same function with two new templates and three reviews.
      </Text>
      <PracticeCell labId={8} cellId="topic-2" code={`def make_prompts(template, reviews):
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
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>make_prompts</Code> gives 3 prompts for each template, one for each review.
        </ListItem>
        <ListItem>
          <Code>prompt.split("\n\n")</Code> cuts at the blank line into two parts. <Code>task, data = ...</Code> gives each part a name.
        </ListItem>
        <ListItem>
          In all that is 6 prompts, from only 2 instructions.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> two groups. <Code>shout -&gt; 3 prompts</Code> and <Code>title -&gt; 3 prompts</Code>, each with three lines. In each group the task is the same on every line, and only the review changes.
      </Text>

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
      <RunnableExample labId={8} code={`class Counter:
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

      <Text>Here is the <Code>Counter</Code> example, line by line:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>class Counter:</Code> starts the blueprint. Nothing exists yet. It is only the
          plan, like a drawing of a house.
        </ListItem>
        <ListItem>
          <Code>c = Counter()</Code> builds one real <b>object</b> from the plan. Python
          automatically runs <Code>__init__</Code>. The word <Code>self</Code> means "this
          object". So <Code>self.total = start</Code> stores 0 inside <Code>c</Code>.
        </ListItem>
        <ListItem>
          <Code>c.add(5)</Code> runs the method on <Code>c</Code>. <Code>self.total += amount</Code>{" "}
          means "add to what is already stored". <Code>0 + 5 = 5</Code>, and 5 is returned.
        </ListItem>
        <ListItem>
          <Code>c.add(3)</Code> starts from the stored 5, not from 0. <Code>5 + 3 = 8</Code>. This is what
          "remembers" means: the number is kept inside the object between calls.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell with a small stateful class of its own -
        run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`class Tally:
    def __init__(self, start=0):
        self.count = start  # state stored on the instance

    def bump(self, n=1):
        self.count += n
        return self.count

t = Tally()
t.bump(2)
print(t.bump(3))  # expected output: 5`}
      </Code>
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
    print(safe_render(template, required, data))`} />
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

      <Text color="gray.600">
        Try it: use the same two functions on a new template.
      </Text>
      <PracticeCell labId={8} cellId="topic-3" code={`def find_missing(required, given):
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
        <b>What this cell does, step by step:</b>
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
      <Text>
        <b>What you should see:</b> <Code>Write a short poem about rain</Code>, then <Code>NOT SENT, missing: length</Code>, then <Code>NOT SENT, missing: topic</Code>.
      </Text>

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
    </VStack>
  );
}
