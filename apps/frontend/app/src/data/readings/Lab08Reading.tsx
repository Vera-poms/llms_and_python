import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab08Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">The map before the territory</Heading>
      <Text>Labs 9-15 each cover one way of shaping a prompt to get better results from an LLM:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <b>Zero-shot</b> (lab 9) - just ask, no examples
        </ListItem>
        <ListItem>
          <b>Few-shot</b> (lab 10) - show worked examples first, often to steer structured output
        </ListItem>
        <ListItem>
          <b>Chain-of-thought</b> (lab 11) - ask the model to reason step by step before answering
        </ListItem>
        <ListItem>
          <b>System instructions</b> (lab 12) - a persistent instruction shaping every reply
        </ListItem>
      </UnorderedList>
      <Text>
        All of these are really about building the right <b>messages list</b> to send to the API
        (lab 15 goes deep on that). This lab builds the reusable piece underneath all of them - a
        template system for turning "a task plus some data" into a finished prompt string, with no
        live API call yet. The rest of this reading explains, from scratch, the two Python ideas
        that <Code>PromptTemplate</Code> is built from: string formatting, and a class that stores
        state and knows how to act on it.
      </Text>

      <Heading size="md">String formatting: filling blanks in text</Heading>
      <Text>Say you want to greet someone by name, filling a blank in a piece of text with a value.</Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell comparing an f-string to a{" "}
        <Code>.format()</Code> template - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        That distinction matters: an f-string bakes in its values immediately, but a{" "}
        <Code>.format()</Code> template can be written once, stored, and filled in later with
        different data every time you call it - which is exactly what <Code>PromptTemplate</Code>{" "}
        needs, since the same template (e.g. "classify this review") gets reused across hundreds of
        different reviews.
      </Text>

      <Heading size="md">Separating the template from the data</Heading>
      <Text>
        Notice the pattern above: <Code>{"\"Hello, {name}!\""}</Code> is the reusable <b>template</b> -
        the shape of the message that never changes. The word <Code>"Vera"</Code> is the{" "}
        <b>data</b> - it changes every time. Keeping these two separate is a small but powerful idea.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell reusing one template with different data -
        run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In this lab's <Code>PromptTemplate</Code>, the template is the string passed into{" "}
        <Code>__init__</Code> (e.g. <Code>"Classify the sentiment of this review: {"{review}"}"</Code>
        ), and the data is whatever gets passed into <Code>.render(review="Great product!")</Code>. The
        template describes the task; the data is one specific review. This split is exactly why the
        notebook can define <Code>TEMPLATES</Code> once and then loop it over many real review
        sentences.
      </Text>

      <Heading size="md">A class that stores state and has a method to act on it</Heading>
      <Text>
        A Python <b>class</b> is a blueprint for bundling data together with the functions
        ("methods") that operate on that data.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell with a small stateful class of its own -
        run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>PromptTemplate</Code> follows the exact same shape. Its <Code>__init__</Code> stores{" "}
        <Code>self.template</Code> (the raw string) and computes <Code>self.required_vars</Code> - the
        set of placeholder names found in the template, extracted with a regular expression{" "}
        (<Code>{"re.findall(r\"\\{(\\w+)\\}\", template)"}</Code>). Its <Code>render(**kwargs)</Code>{" "}
        method is where the action happens: it checks that every required variable was supplied
        (raising <Code>ValueError</Code> listing anything missing), then calls{" "}
        <Code>self.template.format(**kwargs)</Code> to produce the final string. Storing the
        template once and validating on every render means a typo in your data (a missing{" "}
        <Code>review=</Code> argument) fails loudly and immediately, instead of silently sending a
        broken prompt to an LLM.
      </Text>

      <Heading size="sm">Notebook</Heading>
      <Text>
        Open <Code>course/notebooks/lab_08_prompting_techniques.ipynb</Code>. Implement a{" "}
        <Code>PromptTemplate</Code> class (template + required variables + validation), then the
        project renders a small template library against real review sentences - no API key needed
        yet, this lab is fully offline.
      </Text>

      <Heading size="sm">Further reading</Heading>
      <Text>
        IBM Think:{" "}
        <Link href="https://www.ibm.com/think/topics/prompt-engineering" isExternal color="blue.500">
          What is prompt engineering?
        </Link>
      </Text>
    </VStack>
  );
}
