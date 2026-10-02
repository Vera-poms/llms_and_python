import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab04Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">From distributions to decisions</Heading>
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

      <Heading size="sm">Deep dive: Python classes, from scratch</Heading>
      <Text>
        A <Code>class</Code> is a template for bundling data (called <Code>attributes</Code>)
        together with the functions that act on that data (called <Code>methods</Code>).
      </Text>

      <Heading size="xs" color="gray.600">
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell building a different class from
        scratch - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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

      <Heading size="xs" color="gray.600">
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

      <Heading size="sm">Deep dive: the dot product</Heading>
      <Text>
        A dot product multiplies two lists of numbers position-by-position and adds up the
        results.
      </Text>

      <Heading size="xs" color="gray.600">
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell computing a weighted total for a
        different scenario - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`scores = [90, 80, 70]
weights = [0.5, 0.3, 0.2]
final_grade = sum(s * w for s, w in zip(scores, weights))
print(final_grade)  # 83.0`}
      </Code>
      <PracticeCell labId={4} cellId="concept-2" code={`scores = [90, 80, 70]
weights = [0.5, 0.3, 0.2]
final_grade = sum(s * w for s, w in zip(scores, weights))
print(final_grade)  # 83.0`} expectedOutput={`83.0`} />

      <Heading size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        <Code>np.dot(x, self.weights)</Code> in <Code>net_input</Code> does exactly this: it
        multiplies each input feature by its learned weight and adds them all up, then{" "}
        <Code>+ self.bias</Code> adds one more constant on top. Instead of "quantities times
        prices," a perceptron computes "features times how much the model cares about each
        feature" - the weighted sum is the entire computation that decides which class wins.
      </Text>

      <Heading size="sm">Deep dive: the step (activation) function</Heading>
      <Text>
        The weighted sum <Code>z</Code> from <Code>net_input</Code> can be any real number - it
        doesn't look like a decision yet. An <Code>activation</Code> function converts a number
        into a decision.
      </Text>

      <Heading size="xs" color="gray.600">
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell applying a step function to a
        different scenario - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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

      <Heading size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        This lab's <Code>activation</Code> method is exactly that <Code>step</Code> function:{" "}
        <Code>+1</Code> if <Code>z &gt;= 0</Code>, <Code>-1</Code> otherwise. Modern transformers
        replace this hard step with smoother activation functions (like GELU), which matter for
        training with gradient descent, but the underlying idea - squash a raw number into
        something more meaningful for the next step - is exactly the same one this lab introduces.
      </Text>

      <Heading size="sm">Deep dive: plotting with matplotlib</Heading>
      <Text>
        A plot is just numbers turned into pixels - matplotlib is the standard Python library for
        doing that turn.
      </Text>

      <Heading size="xs" color="gray.600">
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 4 practice" cell plotting a different scatter plot -
        run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
        Further reading:{" "}
        <Link href="https://www.ibm.com/think/topics/neural-networks" isExternal color="blue.500">
          IBM: What Is a Neural Network?
        </Link>{" "}
        covers where the perceptron sits in the history of neural networks and how its weighted-sum-
        plus-activation shape scales up into modern architectures.
      </Text>

      <Heading size="xs" color="gray.600">
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

    </VStack>
  );
}
