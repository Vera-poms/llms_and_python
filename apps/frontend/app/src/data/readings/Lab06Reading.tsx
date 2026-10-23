import { Heading, Link, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab06Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">What's actually inside a transformer</Heading>
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

      <Heading as="h3" size="sm">Deep dive: counting things programmatically</Heading>
      <Text>
        A parameter count is just repeated multiplication of sizes.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>Here is what each line does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>rows = 12</Code> and <Code>cols = 8</Code> store two numbers. A name like{" "}
          <Code>rows</Code> is called a <b>variable</b>. It is a label stuck on a value.
        </ListItem>
        <ListItem>
          <Code>rows * cols</Code> multiplies them: <Code>12 * 8 = 96</Code>. Picture 12 lines of 8 tiles. That
          is 96 tiles.
        </ListItem>
        <ListItem>
          Everything after <Code>#</Code> is a <b>comment</b>. Python ignores it. It is a note for
          people.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell counting a different grid of items -
        run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`rows = 20
seats_per_row = 15
total_seats = rows * seats_per_row
print(total_seats)  # 300`}
      </Code>
      <PracticeCell labId={6} cellId="concept-1" code={`rows = 20
seats_per_row = 15
total_seats = rows * seats_per_row
print(total_seats)  # 300`} expectedOutput={`300`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A hall has 20 rows, with 15 seats in each row. The two numbers are stored in{" "}
          <Code>rows</Code> and <Code>seats_per_row</Code>.
        </ListItem>
        <ListItem>
          <Code>total_seats = rows * seats_per_row</Code> is <Code>20 * 15 = 300</Code>.
        </ListItem>
        <ListItem>
          <Code>print</Code> shows the number.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>300</Code>. Try changing <Code>rows</Code> to 10. You
        should now see <Code>150</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>
        Here are the lab's methods on a tiny model. A <b>parameter</b> is one number the model
        learns. The settings are <Code>vocab_size=1000</Code> (how many different tokens it
        knows), <Code>d_model=64</Code> (how many numbers describe each token),{" "}
        <Code>n_layers=2</Code> (how many blocks are stacked) and <Code>d_ff=256</Code> (the
        width of the feed-forward step inside each block).
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>embedding_params</Code>: a table with 1000 rows and 64 columns. <Code>1000 * 64 = 64,000</Code>.
        </ListItem>
        <ListItem>
          <Code>attention_params_per_layer</Code>: 4 tables (query, key, value and output), each 64
          by 64. <Code>4 * 64 * 64 = 16,384</Code> for one block.
        </ListItem>
        <ListItem>
          <Code>feed_forward_params_per_layer</Code>: one 64 by 256 table and one 256 by 64 table.
          <Code>64 * 256 + 256 * 64 = 32,768</Code> for one block.
        </ListItem>
        <ListItem>
          <Code>layernorm_params_per_layer</Code>: <Code>2 * 2 * 64 = 256</Code> for one block.{" "}
          <Code>output_head_params</Code>: <Code>64 * 1000 = 64,000</Code>.
        </ListItem>
        <ListItem>
          <Code>count_parameters</Code> multiplies the per-block numbers by 2 blocks: attention
          32,768, feed-forward 65,536, layer norm 512. It adds the embedding and the head. The
          total is <Code>64,000 + 32,768 + 65,536 + 512 + 64,000 = 226,816</Code>.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Deep dive: dataclasses as config objects</Heading>
      <Text>
        A <Code>dataclass</Code> is a shortcut for writing a class whose entire job is to hold a
        fixed set of named values.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>Here is what each part of that example does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A <b>class</b> is a blueprint for one kind of thing. <Code>Rectangle</Code> says "every
          rectangle has a width and a height".
        </ListItem>
        <ListItem>
          <Code>@dataclass</Code> sits on top of the class. It is called a <b>decorator</b>, and it
          adds extra features. Here it writes the setup code for you.
        </ListItem>
        <ListItem>
          <Code>width: float</Code> and <Code>height: float</Code> are the <b>fields</b>. The word
          after the colon is a hint about the kind of value. Python does not force it.
        </ListItem>
        <ListItem>
          <Code>Rectangle(width=4, height=3)</Code> builds one rectangle. <Code>r.area()</Code>{" "}
          calls the method. Inside it, <Code>self</Code> means "this rectangle", so{" "}
          <Code>self.width * self.height</Code> is <Code>4 * 3 = 12</Code>. Because 4 and 3 are whole numbers,
          printing it shows <Code>12</Code>. It would show <Code>12.0</Code> if you used 4.0 and
          3.0.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell building a different dataclass -
        run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>Car</Code> is a blueprint with two fields: <Code>mpg</Code> (miles per gallon) and{" "}
          <Code>tank_gallons</Code> (the size of the fuel tank).
        </ListItem>
        <ListItem>
          <Code>Car(mpg=30.0, tank_gallons=12.0)</Code> builds one car and stores it in{" "}
          <Code>c</Code>. This car goes 30 miles on one gallon and holds 12 gallons.
        </ListItem>
        <ListItem>
          <Code>c.range_miles()</Code> multiplies <Code>30.0 * 12.0 = 360.0</Code>. That is how far it can go on
          a full tank.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>360.0</Code>. Try changing <Code>tank_gallons</Code> to{" "}
        <Code>10.0</Code>. You should now see <Code>300.0</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        This lab's <Code>ModelConfig</Code> dataclass is the same pattern applied to a model's
        hyperparameters: <Code>vocab_size</Code>, <Code>d_model</Code>, <Code>n_layers</Code>,{" "}
        <Code>n_heads</Code>, and <Code>d_ff</Code> are just named numbers bundled together, with
        methods (like <Code>count_parameters</Code>) that compute things from them - a config
        object playing the same "bundle of data plus behavior" role a class always does.
      </Text>
      <Text>Here it is on the tiny model from before:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>cfg = ModelConfig(vocab_size=1000, d_model=64, n_layers=2, n_heads=4, d_ff=256)</Code>{" "}
          stores the five numbers in one object.
        </ListItem>
        <ListItem>
          <Code>cfg.d_model</Code> gives back 64. A dot reads one field.
        </ListItem>
        <ListItem>
          <Code>cfg.embedding_params()</Code> runs <Code>self.vocab_size * self.d_model</Code>, and{" "}
          <Code>self</Code> is <Code>cfg</Code>. So it is <Code>1000 * 64 = 64,000</Code>.
        </ListItem>
        <ListItem>
          <Code>cfg.count_parameters()</Code> calls the other methods and returns a dict with the
          pieces: embedding, attention, feed_forward, layernorm, output_head and total. A{" "}
          <b>dict</b> is a set of labeled values.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Deep dive: config dicts as the shape of a real model</Heading>
      <Text>
        Real models describe their architecture as a small dictionary (or JSON file) of
        hyperparameters rather than code.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>Here is how to read it:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A dict is a set of <b>key: value</b> pairs inside curly braces. The key is the label and
          the value is what is stored. <Code>"d_model": 768</Code> means "the label d_model holds
          768".
        </ListItem>
        <ListItem>
          <Code>gpt2_small_config["n_layers"]</Code> gives <Code>12</Code>. You look up a value by
          its key, in square brackets.
        </ListItem>
        <ListItem>
          The five keys match the five fields of <Code>ModelConfig</Code>. Those numbers are all
          you need to work out how big the model is.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell reading a different config dict -
        run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>server_config</Code> holds four settings for a made-up server: its address (
          <Code>host</Code>), the door number it listens on (<Code>port</Code>), how many helpers it
          runs (<Code>workers</Code>) and how long it waits (<Code>timeout_seconds</Code>).
        </ListItem>
        <ListItem>
          <Code>server_config["workers"]</Code> looks up the key <Code>"workers"</Code> and gives
          its value, 4.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>4</Code>. Try printing <Code>server_config["port"]</Code>{" "}
        instead. You should see <Code>8080</Code>. If you misspell a key, like{" "}
        <Code>"worker"</Code>, Python stops with a <Code>KeyError</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>
        In the notebook, <Code>REAL_CONFIGS</Code> is a dict whose keys are model names. Each value
        is a pair: a <Code>ModelConfig</Code> and the real published total. The loop{" "}
        <Code>for name, (config, real_total) in REAL_CONFIGS.items()</Code> takes one model at a
        time and splits the pair into two names. Here are the steps for GPT-2 small:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>config.count_parameters()</Code> runs your formulas on 50,257 tokens, 768 numbers
          per token, 12 blocks and a feed-forward width of 3,072. The embedding alone is 50,257 *
          768 = 38,597,376.
        </ListItem>
        <ListItem>
          GPT-2 uses the same table for the input and for the output head. So the real model counts
          it once. The notebook subtracts <Code>breakdown["output_head"]</Code> to match.
        </ListItem>
        <ListItem>
          The computed total is 123,568,896. The published total is 124,439,808. The difference is
          870,912, which is about 0.7%. The formulas leave out some small parts, such as the bias
          numbers and the table that tells the model where each word sits in the sentence.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Deep dive: plotting with matplotlib</Heading>
      <Text>
        A grouped bar chart puts two related bars next to each other for every category, which is
        the natural way to compare "two numbers per item" side by side.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>Here are the numbers in that example:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>range(len(names))</Code> is <Code>range(2)</Code>, which gives 0 and 1. Think of
          them as the spot for each candidate on the bottom line.
        </ListItem>
        <ListItem>
          <Code>[i - 0.2 for i in x]</Code> gives <Code>[-0.2, 0.8]</Code>. These are the spots for
          the "predicted" bars, a little to the left. <Code>[i + 0.2 for i in x]</Code> gives{" "}
          <Code>[0.2, 1.2]</Code> for the "actual" bars, a little to the right.
        </ListItem>
        <ListItem>
          <Code>width=0.4</Code> makes each bar 0.4 wide. The two bars are 0.4 apart, so they touch
          side by side and do not overlap.
        </ListItem>
        <ListItem>
          <Code>plt.xticks(list(x), names)</Code> puts "Alicia" under spot 0 and "Ben" under spot
          1. The pair sits around the name.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 4 practice" cell plotting a different grouped bar
        chart - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          There are two quarters. Q1 had a budget of 100 and spent 90. Q2 had a budget of 120 and
          spent 130 (in thousands of dollars).
        </ListItem>
        <ListItem>
          The first <Code>plt.bar</Code> draws the budget bars at spots -0.2 and 0.8, with heights
          100 and 120. The second draws the actual bars at spots 0.2 and 1.2, with heights 90 and
          130.
        </ListItem>
        <ListItem>
          <Code>xticks</Code> writes Q1 and Q2 under the pairs. <Code>ylabel</Code> names the
          up-and-down axis. <Code>legend</Code> says which color is budget and which is actual.
        </ListItem>
        <ListItem>
          <Code>savefig</Code> saves the picture to a file, then the cell prints a message.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> the line{" "}
        <Code>Saved grouped bar chart to budget_vs_actual.png</Code>. This cell does not call{" "}
        <Code>plt.show()</Code>, so you may not see the chart on screen. Try changing the Q1
        actual from 90 to 150. In the saved chart that bar would be taller than its budget bar.
      </Text>

      <Text>
        Further reading:{" "}
        <Link href="https://www.ibm.com/think/topics/llm-parameters" isExternal color="blue.500">
          IBM: What Are LLM Parameters?
        </Link>{" "}
        covers what parameters are, why parameter count is used as a rough proxy for model
        capability, and how it relates to compute and memory cost - directly relevant to why this
        lab bothers counting them by hand.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>
        Here is how it lines up with the numbers. The loop first fills three lists:{" "}
        <Code>names</Code>, <Code>computed</Code> and <Code>published</Code>. Each has one entry
        per model, in the same order. For the two models they hold the names, about 123.6 million
        and 353.6 million, and then 124.4 million and 354.8 million.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>x = range(len(names))</Code> is 0 for GPT-2 small and 1 for GPT-2 medium.
        </ListItem>
        <ListItem>
          The "computed" bars sit at -0.2 and 0.8. The "published" bars sit at 0.2 and 1.2.
        </ListItem>
        <ListItem>
          For each model, the two bars are almost the same height. That is the 0.7% and 0.4% gaps
          you see in the printed <Code>diff</Code>.
        </ListItem>
      </UnorderedList>
    </VStack>
  );
}
