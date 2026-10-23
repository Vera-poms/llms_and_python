import { Heading, Link, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab04Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">From distributions to decisions</Heading>
      <Text>
        Labs 1-3 built distributions over words. A perceptron does something different: given a
        vector of numbers describing some input, it decides between two classes. It's the
        simplest possible artificial neuron, and every layer inside a transformer is, at its core,
        a bank of these wired together with better activation functions.
      </Text>
      <Text>A perceptron is three things:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>weights</Code> - one number per input feature, learned from data
        </ListItem>
        <ListItem>
          <Code>bias</Code> - one extra learned number, a constant offset
        </ListItem>
        <ListItem>
          <Code>net_input(x) = w . x + b</Code> - a weighted sum, then a step function:{" "}
          <Code>+1</Code> if it's non-negative, <Code>-1</Code> otherwise
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Deep dive: Python classes, from scratch</Heading>
      <Text>
        A <Code>class</Code> is a template for bundling data (called <Code>attributes</Code>)
        together with the functions that act on that data (called <Code>methods</Code>).
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
        In plain Python
      </Heading>
      <Text>
        Here's the smallest useful example, nothing to do with machine learning at all:
      </Text>
      <RunnableExample labId={4} code={`class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner      # instance attribute
        self.balance = balance  # instance attribute

    def deposit(self, amount):
        self.balance += amount

account = BankAccount("Vera", 100)
account.deposit(50)
print(account.balance)  # 150`} />
      <Text>
        <Code>__init__</Code> is the constructor: it runs once, when you write{" "}
        <Code>BankAccount("Vera", 100)</Code>, and its job is to set up the object's starting
        state. <Code>self</Code> is just a name for "this particular account" - it's how a method
        reaches back into the object it was called on to read or change its attributes. Every
        method's first parameter is <Code>self</Code>, and Python fills it in automatically when
        you call <Code>account.deposit(50)</Code>.
      </Text>
      <Text>Here is what happens, line by line, with the real numbers:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>class BankAccount:</Code> only describes the template. Nothing is made yet. An{" "}
          <b>attribute</b> is a piece of data that belongs to an object, like a name tag. A{" "}
          <b>method</b> is a function that belongs to an object.
        </ListItem>
        <ListItem>
          <Code>BankAccount("Vera", 100)</Code> makes one real account (an <b>object</b>). Python
          runs <Code>__init__</Code> with <Code>owner = "Vera"</Code> and{" "}
          <Code>balance = 100</Code>. It stores them as <Code>self.owner</Code> and{" "}
          <Code>self.balance</Code>.
        </ListItem>
        <ListItem>
          <Code>account.deposit(50)</Code> runs the method. Here <Code>self</Code> is{" "}
          <Code>account</Code> and <Code>amount</Code> is 50.{" "}
          <Code>self.balance += 50</Code> is short for "new balance = old balance + 50". So 100 +
          50 = 150.
        </ListItem>
        <ListItem>
          <Code>print(account.balance)</Code> reads the attribute back: 150. Another account made
          with <Code>BankAccount("Sam", 10)</Code> would have its own balance. They do not share.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell building a different class from
        scratch - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`class Playlist:
    def __init__(self, name, songs):
        self.name = name    # instance attribute
        self.songs = songs  # instance attribute

    def add_song(self, song):
        self.songs.append(song)

mix = Playlist("Road Trip", ["Song A"])
mix.add_song("Song B")
print(mix.songs)  # ['Song A', 'Song B']`}
      </Code>
      <PracticeCell labId={4} cellId="concept-1" code={`class Playlist:
    def __init__(self, name, songs):
        self.name = name    # instance attribute
        self.songs = songs  # instance attribute

    def add_song(self, song):
        self.songs.append(song)

mix = Playlist("Road Trip", ["Song A"])
mix.add_song("Song B")
print(mix.songs)  # ['Song A', 'Song B']`} expectedOutput={`['Song A', 'Song B']`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>Playlist("Road Trip", ["Song A"])</Code> makes a playlist object.{" "}
          <Code>__init__</Code> saves <Code>self.name = "Road Trip"</Code> and{" "}
          <Code>self.songs = ["Song A"]</Code>.
        </ListItem>
        <ListItem>
          <Code>mix.add_song("Song B")</Code> runs the method. <Code>self.songs.append(song)</Code>{" "}
          adds "Song B" to the end of the list. <Code>append</Code> changes the list that is
          already stored. It does not make a new one.
        </ListItem>
        <ListItem>
          <Code>print(mix.songs)</Code> shows the list: two songs now.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>['Song A', 'Song B']</Code>. Try adding a line{" "}
        <Code>mix.add_song("Song C")</Code> before the print. The list should grow to three songs.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        The <Code>Perceptron</Code> class in this lab is the exact same pattern.{" "}
        <Code>self.weights</Code> and <Code>self.bias</Code> are instance attributes - the
        perceptron's entire "memory" of what it has learned - and <Code>net_input</Code>,{" "}
        <Code>activation</Code>, and <Code>predict</Code> are methods that read those attributes
        to make a decision. A bank account bundles an owner and a balance; a perceptron bundles
        weights and a bias. Same idea, different data.
      </Text>
      <Text>Here is the lab's real class, in short:</Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`class Perceptron:
    def __init__(self, n_features):
        self.weights = np.zeros(n_features)
        self.bias = 0.0

    def net_input(self, x):
        return float(np.dot(x, self.weights) + self.bias)

    def activation(self, z):
        return 1 if z >= 0 else -1

    def predict(self, x):
        return self.activation(self.net_input(x))`}
      </Code>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>Perceptron(n_features=2)</Code> runs <Code>__init__</Code>. <Code>np.zeros(2)</Code>{" "}
          makes <Code>[0.0, 0.0]</Code> for the weights. The bias starts at 0.0. A new perceptron
          knows nothing yet.
        </ListItem>
        <ListItem>
          The lab then sets <Code>p.weights = np.array([1.0, -1.0])</Code> and{" "}
          <Code>p.bias = 0.5</Code> by hand. You can change attributes from outside the class.
        </ListItem>
        <ListItem>
          <Code>p.predict(np.array([1.0, 0.0]))</Code>: <Code>self</Code> is <Code>p</Code> and{" "}
          <Code>x</Code> is <Code>[1.0, 0.0]</Code>. <Code>predict</Code> calls{" "}
          <Code>self.net_input(x)</Code>, then passes the result to <Code>self.activation</Code>.
          The next two sections show those two steps with numbers.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Deep dive: the dot product</Heading>
      <Text>
        A dot product multiplies two lists of numbers position-by-position and adds up the
        results.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
        In plain Python
      </Heading>
      <Text>
        Say you're at a grocery checkout: you bought 3 apples at $0.50 each and 2 loaves of bread
        at $2.00 each. Your total is a dot product of quantities and prices:
      </Text>
      <RunnableExample labId={4} code={`quantities = [3, 2]
prices = [0.50, 2.00]
total = sum(q * p for q, p in zip(quantities, prices))
# total = 3*0.50 + 2*2.00 = 5.50`} />
      <Text>
        <Code>zip</Code> pairs up the two lists position-by-position, <Code>q * p</Code> multiplies
        each pair, and <Code>sum</Code> adds all the products together - three apples' worth of
        price, plus two breads' worth of price, collapsed into one number.
      </Text>
      <Text>Here is what each part does with the real numbers:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>zip(quantities, prices)</Code> pairs the lists up: (3, 0.50) and (2, 2.00).
        </ListItem>
        <ListItem>
          <Code>q * p</Code> multiplies each pair: <Code>3 * 0.50 = 1.50</Code> for the apples, and <Code>2 * 2.00</Code> =
          4.00 for the bread.
        </ListItem>
        <ListItem>
          <Code>sum(...)</Code> adds them: <Code>1.50 + 4.00 = 5.50</Code>.
        </ListItem>
        <ListItem>
          The two lists must be the same length. Position 0 goes with position 0, and position 1
          goes with position 1.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell computing a weighted total for a
        different scenario - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`scores = [90, 80, 70]
weights = [0.5, 0.3, 0.2]
final_grade = sum(s * w for s, w in zip(scores, weights))
print(final_grade)  # 83.0`}
      </Code>
      <PracticeCell labId={4} cellId="concept-2" code={`scores = [90, 80, 70]
weights = [0.5, 0.3, 0.2]
final_grade = sum(s * w for s, w in zip(scores, weights))
print(final_grade)  # 83.0`} expectedOutput={`83.0`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>scores</Code> are three marks: 90, 80 and 70. <Code>weights</Code> say how much
          each mark counts: 50%, 30% and 20%.
        </ListItem>
        <ListItem>
          The products are <Code>90 * 0.5 = 45.0</Code>, <Code>80 * 0.3 = 24.0</Code> and <Code>70 * 0.2 = 14.0</Code>.
        </ListItem>
        <ListItem>
          <Code>45.0 + 24.0 + 14.0 = 83.0</Code>. This is a dot product, just like the grocery total.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>83.0</Code>. Try swapping the weights to{" "}
        <Code>[0.2, 0.3, 0.5]</Code>. Now the 70 counts the most, and the grade falls to <Code>18 + 24</Code> +
        35 = 77.0.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        <Code>np.dot(x, self.weights)</Code> in <Code>net_input</Code> does exactly this: it
        multiplies each input feature by its learned weight and adds them all up, then{" "}
        <Code>+ self.bias</Code> adds one more constant on top. Instead of "quantities times
        prices," a perceptron computes "features times how much the model cares about each
        feature" - the weighted sum is the entire computation that decides which class wins.
      </Text>
      <Text>
        Take the lab's perceptron with <Code>weights = [1.0, -1.0]</Code>, <Code>bias = 0.5</Code>{" "}
        and input <Code>x = [1.0, 0.0]</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>np.dot(x, self.weights)</Code> = <Code>1.0 * 1.0 + 0.0 * (-1.0) = 1.0 + 0.0 = 1.0</Code>.{" "}
          <Code>np</Code> is numpy, a toolbox for lists of numbers.
        </ListItem>
        <ListItem>
          <Code>+ self.bias</Code> adds 0.5, so the score is 1.5. <Code>float(...)</Code> makes
          sure it is a plain decimal number.
        </ListItem>
        <ListItem>
          A positive weight (1.0) means "this feature pushes toward yes". A negative weight (-1.0)
          means "this feature pushes toward no". A weight of 0 means "ignore this feature". A new
          perceptron has all weights at 0, so it ignores everything.
        </ListItem>
        <ListItem>
          The bias moves the score up or down for every input. It is like starting a race a little
          ahead of the line.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Deep dive: the step (activation) function</Heading>
      <Text>
        The weighted sum <Code>z</Code> from <Code>net_input</Code> can be any real number - it
        doesn't look like a decision yet. An <Code>activation</Code> function converts a number
        into a decision.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
        In plain Python
      </Heading>
      <Text>
        The perceptron uses the simplest possible activation, a step function - the same shape as
        "if your test score is 60 or above, you pass; otherwise, you fail," a hard cutoff with only
        two possible outcomes on either side:
      </Text>
      <RunnableExample labId={4} code={`def step(z):
    return 1 if z >= 0 else -1

print(step(3))    # 1
print(step(-2))   # -1`} />
      <Text>
        No matter how large or small <Code>z</Code> is, <Code>step</Code> only ever returns one of
        two values - it throws away the magnitude of the number and keeps only which side of zero
        it landed on.
      </Text>
      <Text>Here is what each line does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>1 if z &gt;= 0 else -1</Code> is a one-line "if". It reads: give back 1 if{" "}
          <Code>z</Code> is 0 or more, otherwise give back -1. <Code>&gt;=</Code> means "greater
          than or equal to".
        </ListItem>
        <ListItem>
          <Code>step(3)</Code>: 3 is bigger than 0, so the answer is 1.
        </ListItem>
        <ListItem>
          <Code>step(-2)</Code>: -2 is less than 0, so the answer is -1.
        </ListItem>
        <ListItem>
          <Code>step(0)</Code> is 1, because the test says "or equal". Exactly 0 goes to the +1
          side. <Code>step(1000)</Code> and <Code>step(0.001)</Code> both give 1. Only the side
          matters, not the size.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell applying a step function to a
        different scenario - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`def freeze_alert(temp_c):
    return 1 if temp_c <= 0 else -1

print(freeze_alert(-5))  # 1
print(freeze_alert(10))  # -1`}
      </Code>
      <PracticeCell labId={4} cellId="concept-3" code={`def freeze_alert(temp_c):
    return 1 if temp_c <= 0 else -1

print(freeze_alert(-5))  # 1
print(freeze_alert(10))  # -1`} expectedOutput={`1
-1`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>freeze_alert</Code> is a step function with the test turned around:{" "}
          <Code>&lt;=</Code> means "less than or equal to". At 0 degrees or colder it gives 1
          (alert). Otherwise it gives -1 (no alert).
        </ListItem>
        <ListItem>
          <Code>freeze_alert(-5)</Code>: -5 is below 0, so the result is 1.
        </ListItem>
        <ListItem>
          <Code>freeze_alert(10)</Code>: 10 is above 0, so the result is -1.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> two lines, <Code>1</Code> and then <Code>-1</Code>. Try{" "}
        <Code>print(freeze_alert(0))</Code>. You get 1, because 0 is "less than or equal to" 0.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        This lab's <Code>activation</Code> method is exactly that <Code>step</Code> function:{" "}
        <Code>+1</Code> if <Code>z &gt;= 0</Code>, <Code>-1</Code> otherwise. Modern transformers
        replace this hard step with smoother activation functions (like GELU), which matter for
        training with gradient descent, but the underlying idea - squash a raw number into
        something more meaningful for the next step - is exactly the same one this lab introduces.
      </Text>
      <Text>
        Finish the example from the dot product section. The score <Code>z</Code> was 1.5 for{" "}
        <Code>x = [1.0, 0.0]</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>self.activation(1.5)</Code>: 1.5 is 0 or more, so the answer is <Code>1</Code>.
          The class is +1.
        </ListItem>
        <ListItem>
          Try a second input, <Code>x = [0.0, 2.0]</Code>. The dot product is <Code>0.0 * 1.0 + 2.0</Code> *
          (-1.0) = -2.0. Add the bias 0.5 and the score is -1.5. That is below 0, so{" "}
          <Code>activation</Code> gives <Code>-1</Code>.
        </ListItem>
        <ListItem>
          So <Code>predict</Code> is two steps in a row: first a score, then a decision. The
          decision is always exactly 1 or -1, never 0.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Deep dive: plotting with matplotlib</Heading>
      <Text>
        A plot is just numbers turned into pixels - matplotlib is the standard Python library for
        doing that turn.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
        In plain Python
      </Heading>
      <Text>
        Here's a scatter plot of a few (x, y) points, nothing to do with perceptrons:
      </Text>
      <RunnableExample labId={4} code={`import matplotlib.pyplot as plt

hours_studied = [1, 2, 3, 4, 5]
exam_score = [50, 55, 65, 70, 90]
plt.scatter(hours_studied, exam_score)
plt.xlabel("hours studied")
plt.ylabel("exam score")
plt.savefig("scores.png")
plt.show()`} />
      <Text>
        <Code>plt.scatter</Code> places one dot per (x, y) pair, <Code>xlabel</Code>/
        <Code>ylabel</Code> label the axes, and <Code>savefig</Code> writes the finished picture to
        a file instead of popping up a window - handy when you're running a script rather than a
        notebook.
      </Text>
      <Text>Here is what each line does with the real numbers:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>hours_studied</Code> goes on the x axis (the sideways one). <Code>exam_score</Code>{" "}
          goes on the y axis (the up-and-down one). They are paired by position: (1, 50), (2, 55),
          (3, 65), (4, 70), (5, 90).
        </ListItem>
        <ListItem>
          <Code>plt.scatter</Code> draws 5 dots. The dots go up from left to right, so more study
          hours go with higher scores.
        </ListItem>
        <ListItem>
          <Code>plt.xlabel</Code> and <Code>plt.ylabel</Code> write the names beside the axes.
        </ListItem>
        <ListItem>
          <Code>plt.savefig("scores.png")</Code> saves the picture as a file called{" "}
          <Code>scores.png</Code>. <Code>plt.show()</Code> then shows it on screen.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 4 practice" cell plotting a different scatter plot -
        run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`import matplotlib.pyplot as plt

city_temp = [30, 45, 60, 75, 90]
ice_cream_sales = [10, 25, 40, 70, 95]
plt.scatter(city_temp, ice_cream_sales)
plt.xlabel("temperature (F)")
plt.ylabel("ice cream sales")
plt.savefig("ice_cream.png")
print("Saved scatter plot to ice_cream.png")  # Saved scatter plot to ice_cream.png`}
      </Code>
      <PracticeCell labId={4} cellId="concept-4" code={`import matplotlib.pyplot as plt

city_temp = [30, 45, 60, 75, 90]
ice_cream_sales = [10, 25, 40, 70, 95]
plt.scatter(city_temp, ice_cream_sales)
plt.xlabel("temperature (F)")
plt.ylabel("ice cream sales")
plt.savefig("ice_cream.png")
print("Saved scatter plot to ice_cream.png")  # Saved scatter plot to ice_cream.png`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>city_temp</Code> has 5 temperatures (30 to 90). <Code>ice_cream_sales</Code> has 5
          sales numbers (10 to 95). Position by position they make the dots (30, 10), (45, 25),
          (60, 40), (75, 70) and (90, 95).
        </ListItem>
        <ListItem>
          <Code>plt.scatter(city_temp, ice_cream_sales)</Code> draws those 5 dots. The warmer it
          is, the higher the dot.
        </ListItem>
        <ListItem>
          The two label lines name the axes. <Code>plt.savefig("ice_cream.png")</Code> writes the
          picture to a file.
        </ListItem>
        <ListItem>
          The last line prints a plain message, so you know the save worked.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> a chart of dots climbing to the right, and the text{" "}
        <Code>Saved scatter plot to ice_cream.png</Code>. Try changing the last sales number from
        95 to 5. The last dot drops to the bottom right.
      </Text>

      <Text>
        Further reading:{" "}
        <Link href="https://www.ibm.com/think/topics/neural-networks" isExternal color="blue.500">
          IBM: What Is a Neural Network?
        </Link>{" "}
        covers where the perceptron sits in the history of neural networks and how its weighted-sum-
        plus-activation shape scales up into modern architectures.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        <Code>project.py</Code>'s <Code>plot_boundary</Code> function does the same
        <Code>scatter</Code> call twice - once per class, colored <Code>"seagreen"</Code> for
        positive reviews and <Code>"crimson"</Code> for negative ones - then overlays a dashed line
        computed from <Code>model.weights</Code> and <Code>model.bias</Code>: the perceptron's
        decision boundary. The x and y axes are the two PCA components from earlier in the file,
        not real features, so the plot is a 2D shadow of a much higher-dimensional bag-of-words
        space. Because the perceptron here is untrained (all weights zero), the boundary line
        can't actually separate the two colors - the picture, saved to{" "}
        <Code>untrained_boundary.png</Code>, is a visual version of "50% accuracy, no better than
        guessing."
      </Text>
      <Text>Here is how to read that plot:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Each dot is one review. Green dots are positive reviews (label +1). Red dots are negative
          ones (label -1). Two scatter calls are used so each class gets its own color.
        </ListItem>
        <ListItem>
          PCA is a way to squash many numbers per review down to 2, so the review fits on a flat
          chart. The two squashed numbers become x and y. The chart is a flat shadow of the real
          data.
        </ListItem>
        <ListItem>
          The dashed line is where the score is exactly 0. A perceptron says "+1" on one side of
          it and "-1" on the other. With a trained model, green dots would sit on one side, and
          red dots on the other.
        </ListItem>
        <ListItem>
          Here the weights are all 0, so every score is 0 + bias 0.0 = 0.0. Since{" "}
          <Code>activation(0.0)</Code> is +1, the untrained model says "+1" for every review. It is
          right for the positive ones and wrong for the negative ones. That is why the line cannot
          split the two colors.
        </ListItem>
      </UnorderedList>

    </VStack>
  );
}
