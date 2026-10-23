import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab08Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">The map before the territory</Heading>
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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
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
      <Text fontSize="sm">
        <b>What you should see:</b> two lines, <Code>You ordered 3 notebook(s).</Code> and then{" "}
        <Code>You ordered 5 pen(s).</Code>. Try changing <Code>qty=5</Code> to{" "}
        <Code>qty=12</Code> and run it again. Only the number in the second line changes.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        That distinction matters: an f-string bakes in its values immediately, but a{" "}
        <Code>.format()</Code> template can be written once, stored, and filled in later with
        different data every time you call it - which is exactly what <Code>PromptTemplate</Code>{" "}
        needs, since the same template (e.g. "classify this review") gets reused across hundreds of
        different reviews.
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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
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
      <Text fontSize="sm">
        <b>What you should see:</b> two invoice lines, one for Alex and one for Sam. Try adding a
        third call with <Code>customer="Mia", amount=99</Code>. You should get a third line for
        Mia without touching the template.
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
        first two review sentences and prints each template filled in with each review. Here is
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
          means "add to what is already stored". 0 + 5 = 5, and 5 is returned.
        </ListItem>
        <ListItem>
          <Code>c.add(3)</Code> starts from the stored 5, not from 0. 5 + 3 = 8. This is what
          "remembers" means: the number is kept inside the object between calls.
        </ListItem>
      </UnorderedList>

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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          <Code>t = Tally()</Code> makes one object. <Code>__init__</Code> runs and stores{" "}
          <Code>count = 0</Code> inside it.
        </ListItem>
        <ListItem>
          <Code>t.bump(2)</Code> adds 2: 0 + 2 = 2. It returns 2, but nothing prints it, so you do
          not see it.
        </ListItem>
        <ListItem>
          <Code>t.bump(3)</Code> adds 3 to the stored 2: 2 + 3 = 5. This one is inside{" "}
          <Code>print</Code>, so the 5 shows on screen.
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> a single line, <Code>5</Code>. Try changing{" "}
        <Code>t.bump(3)</Code> to <Code>t.bump()</Code> with nothing in the brackets. The default{" "}
        <Code>n=1</Code> is used, so you should see 3.
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
        <Code>review=</Code> argument) fails loudly and immediately, instead of silently sending a
        broken prompt to an LLM.
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
