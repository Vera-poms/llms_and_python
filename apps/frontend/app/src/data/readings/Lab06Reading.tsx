import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab06Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">What's actually inside a transformer</Heading>
      <Text>
        A decoder-only LLM (GPT-style) is, at a high level, a stack of identical blocks wrapped
        around a vocabulary embedding and an output head: a <Code>token embedding</Code> lookup
        table, <Code>N</Code> transformer blocks (each with multi-head self-attention, a
        feed-forward network, layer norms, and residual connections), and an{" "}
        <Code>output head</Code> projecting back to vocabulary size, turned into a probability
        distribution by softmax - literally lab 1's <Code>word_probabilities</Code>, just computed
        from a learned linear layer instead of counting real text.
      </Text>
      <Text>
        Every one of those pieces is just a matrix of learned numbers - "parameters". Counting
        them tells you a lot about a model before you ever run it.
      </Text>

      <Heading size="sm">Deep dive: counting things programmatically</Heading>
      <Text>
        A parameter count is just repeated multiplication of sizes.
      </Text>

      <Heading size="xs" color="gray.600">
        In plain Python
      </Heading>
      <Text>
        Before any LLM math, here's the same idea for a much smaller problem: how many tiles do
        you need to cover a rectangular floor?
      </Text>
      <RunnableExample labId={6} code={`rows = 12
cols = 8
tiles_needed = rows * cols  # 96`} />
      <Text>
        Nothing fancy - the floor is a grid, and a grid's total cell count is always{" "}
        <Code>rows * cols</Code>, whether the cells are floor tiles or numbers in a table.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell counting a different grid of items -
        run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`rows = 20
seats_per_row = 15
total_seats = rows * seats_per_row
print(total_seats)  # 300`}
      </Code>
      <PracticeCell labId={6} cellId="concept-1" code={`rows = 20
seats_per_row = 15
total_seats = rows * seats_per_row
print(total_seats)  # 300`} expectedOutput={`300`} />

      <Heading size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        A weight matrix works the same way: a table with <Code>vocab_size</Code> rows and{" "}
        <Code>d_model</Code> columns has <Code>vocab_size * d_model</Code> individual numbers in
        it, exactly like a floor with <Code>rows * cols</Code> tiles. This lab's{" "}
        <Code>embedding_params</Code>, <Code>attention_params_per_layer</Code>, and{" "}
        <Code>feed_forward_params_per_layer</Code> methods are all doing this same multiplication
        for different-shaped matrices, then adding the pieces up. Multiply that out for GPT-2
        small's real dimensions and you land within about 1% of 124,439,808 - which is exactly why
        that model is nicknamed "124M."
      </Text>

      <Heading size="sm">Deep dive: dataclasses as config objects</Heading>
      <Text>
        A <Code>dataclass</Code> is a shortcut for writing a class whose entire job is to hold a
        fixed set of named values.
      </Text>

      <Heading size="xs" color="gray.600">
        In plain Python
      </Heading>
      <Text>Compare it to describing a rectangle:</Text>
      <RunnableExample labId={6} code={`from dataclasses import dataclass

@dataclass
class Rectangle:
    width: float
    height: float

    def area(self) -> float:
        return self.width * self.height

r = Rectangle(width=4, height=3)
print(r.area())  # 12.0`} />
      <Text>
        Without <Code>@dataclass</Code> you'd have to hand-write an <Code>__init__</Code> that
        assigns each field to <Code>self</Code>, exactly like lab 4's <Code>Perceptron</Code>{" "}
        constructor - the decorator just generates that boilerplate for you from the type-annotated
        fields.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell building a different dataclass -
        run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`from dataclasses import dataclass

@dataclass
class Car:
    mpg: float
    tank_gallons: float

    def range_miles(self) -> float:
        return self.mpg * self.tank_gallons

c = Car(mpg=30.0, tank_gallons=12.0)
print(c.range_miles())  # 360.0`}
      </Code>
      <PracticeCell labId={6} cellId="concept-2" code={`from dataclasses import dataclass

@dataclass
class Car:
    mpg: float
    tank_gallons: float

    def range_miles(self) -> float:
        return self.mpg * self.tank_gallons

c = Car(mpg=30.0, tank_gallons=12.0)
print(c.range_miles())  # 360.0`} expectedOutput={`360.0`} />

      <Heading size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        This lab's <Code>ModelConfig</Code> dataclass is the same pattern applied to a model's
        hyperparameters: <Code>vocab_size</Code>, <Code>d_model</Code>, <Code>n_layers</Code>,{" "}
        <Code>n_heads</Code>, and <Code>d_ff</Code> are just named numbers bundled together, with
        methods (like <Code>count_parameters</Code>) that compute things from them - a config
        object playing the same "bundle of data plus behavior" role a class always does.
      </Text>

      <Heading size="sm">Deep dive: config dicts as the shape of a real model</Heading>
      <Text>
        Real models describe their architecture as a small dictionary (or JSON file) of
        hyperparameters rather than code.
      </Text>

      <Heading size="xs" color="gray.600">
        In plain Python
      </Heading>
      <Text>GPT-2 small's real configuration looks like this:</Text>
      <RunnableExample labId={6} code={`gpt2_small_config = {
    "vocab_size": 50257,
    "d_model": 768,
    "n_layers": 12,
    "n_heads": 12,
    "d_ff": 3072,
}`} />
      <Text>
        It's a plain dictionary - no classes, no code, just named numbers - which is exactly why
        it's easy to save as JSON, load in any language, and diff between model versions.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell reading a different config dict -
        run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`server_config = {
    "host": "localhost",
    "port": 8080,
    "workers": 4,
    "timeout_seconds": 30,
}
print(server_config["workers"])  # 4`}
      </Code>
      <PracticeCell labId={6} cellId="concept-3" code={`server_config = {
    "host": "localhost",
    "port": 8080,
    "workers": 4,
    "timeout_seconds": 30,
}
print(server_config["workers"])  # 4`} expectedOutput={`4`} />

      <Heading size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        This is exactly what gets loaded from a Hugging Face <Code>config.json</Code> before a
        model's weights are even downloaded - it's how tools know how much memory a model will
        need, how many layers to expect, and how to shape every matrix correctly, all before
        running a single line of the model itself. The <Code>REAL_CONFIGS</Code> dictionary in
        this lab's project cell is the same structure: real published numbers, not made up ones,
        driving the same <Code>count_parameters</Code> math you implemented in the exercise.
      </Text>

      <Heading size="sm">Deep dive: plotting with matplotlib</Heading>
      <Text>
        A grouped bar chart puts two related bars next to each other for every category, which is
        the natural way to compare "two numbers per item" side by side.
      </Text>

      <Heading size="xs" color="gray.600">
        In plain Python
      </Heading>
      <Text>
        Here's a grouped bar chart comparing predicted vs. actual votes for a couple of candidates,
        nothing to do with LLMs:
      </Text>
      <RunnableExample labId={6} code={`import matplotlib.pyplot as plt

names = ["Alicia", "Ben"]
predicted = [420, 380]
actual = [410, 400]
x = range(len(names))

plt.bar([i - 0.2 for i in x], predicted, width=0.4, label="predicted")
plt.bar([i + 0.2 for i in x], actual, width=0.4, label="actual")
plt.xticks(list(x), names)
plt.ylabel("votes")
plt.legend()
plt.savefig("votes.png")
plt.show()`} />
      <Text>
        Each candidate gets two bars, shifted left and right by <Code>0.2</Code> so they sit
        side-by-side instead of on top of each other; <Code>xticks</Code> labels each pair with the
        candidate's name, and <Code>legend</Code> says which bar color means which series.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 4 practice" cell plotting a different grouped bar
        chart - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`import matplotlib.pyplot as plt

quarters = ["Q1", "Q2"]
budget = [100, 120]
actual = [90, 130]
x = range(len(quarters))

plt.bar([i - 0.2 for i in x], budget, width=0.4, label="budget")
plt.bar([i + 0.2 for i in x], actual, width=0.4, label="actual")
plt.xticks(list(x), quarters)
plt.ylabel("$ thousands")
plt.legend()
plt.savefig("budget_vs_actual.png")
print("Saved grouped bar chart to budget_vs_actual.png")  # Saved grouped bar chart to budget_vs_actual.png`}
      </Code>
      <PracticeCell labId={6} cellId="concept-4" code={`import matplotlib.pyplot as plt

quarters = ["Q1", "Q2"]
budget = [100, 120]
actual = [90, 130]
x = range(len(quarters))

plt.bar([i - 0.2 for i in x], budget, width=0.4, label="budget")
plt.bar([i + 0.2 for i in x], actual, width=0.4, label="actual")
plt.xticks(list(x), quarters)
plt.ylabel("$ thousands")
plt.legend()
plt.savefig("budget_vs_actual.png")
print("Saved grouped bar chart to budget_vs_actual.png")  # Saved grouped bar chart to budget_vs_actual.png`} />

      <Text>
        Further reading:{" "}
        <Link href="https://www.ibm.com/think/topics/llm-parameters" isExternal color="blue.500">
          IBM: What Are LLM Parameters?
        </Link>{" "}
        covers what parameters are, why parameter count is used as a rough proxy for model
        capability, and how it relates to compute and memory cost - directly relevant to why this
        lab bothers counting them by hand.
      </Text>

      <Heading size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        The notebook's project cell does the exact same shifted-pair trick, one pair per model:{" "}
        <Code>plt.bar([i - 0.2 for i in x], computed, width=0.4, label="computed (tied)")</Code>{" "}
        next to <Code>plt.bar([i + 0.2 for i in x], published, ...)</Code>, with{" "}
        <Code>xticks</Code> labeling the pairs "GPT-2 small" and "GPT-2 medium." Visually, it's
        answering the same question as the votes example - "how close are two related numbers per
        category?" - except here the two numbers are this lab's hand-computed parameter total
        (with the tied embedding/output-head duplicate subtracted out) and the model's real
        published parameter count. Bars nearly the same height is the chart's way of showing that
        the formulas you implemented in the exercise actually match reality.
      </Text>

      <Heading size="sm">Notebook</Heading>
      <Text>
        Open <Code>course/notebooks/lab_06_llm_architecture.ipynb</Code> (upload it to{" "}
        <Code>colab.research.google.com</Code>, or run it locally in Jupyter). Implement a
        dataclass-based parameter counter, then compare against real published GPT-2 configs and
        see how close a simple formula gets to the real numbers.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>Exercise: implement per-component parameter counts on a small config</ListItem>
        <ListItem>Solution: the filled-in counter</ListItem>
        <ListItem>
          Project: real GPT-2 small/medium configs vs. their real published parameter totals, with
          a bar chart of the breakdown
        </ListItem>
      </UnorderedList>
    </VStack>
  );
}
