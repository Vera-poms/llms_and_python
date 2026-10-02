import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab05Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">The perceptron learning rule</Heading>
      <Text>
        Training means adjusting <Code>weights</Code> and <Code>bias</Code> so the perceptron
        stops getting things wrong. The rule is almost embarrassingly simple: for every example it
        misclassifies, nudge the weights a little in the direction that would have made that
        example correct. Repeat over the whole dataset for several "epochs" until it converges (or
        you decide it's close enough).
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>if prediction is right: do nothing</ListItem>
        <ListItem>
          if prediction is wrong: <Code>weights += learning_rate * true_label * x</Code>,{" "}
          <Code>bias += learning_rate * true_label</Code>
        </ListItem>
      </UnorderedList>
      <Text>
        This is the same shape as every training loop you'll ever see, including how transformer
        weights get updated - just with a much simpler update rule than gradient descent on a loss
        function.
      </Text>

      <Heading size="sm">Deep dive: looping over epochs and data</Heading>
      <Text>
        A "for loop" repeats a block of code once per item in a sequence.
      </Text>

      <Heading size="xs" color="gray.600">
        In plain Python
      </Heading>
      <Text>
        Before touching any machine learning, here's a loop that just counts how many times a coin
        flip comes up heads across several rounds:
      </Text>
      <RunnableExample labId={5} code={`flips = ["H", "T", "H", "H", "T"]
heads_count = 0
for flip in flips:
    if flip == "H":
        heads_count += 1
print(heads_count)  # 3`} />
      <Text>
        The loop visits each element of <Code>flips</Code> in order, binding it to{" "}
        <Code>flip</Code>, and <Code>heads_count</Code> keeps a running tally that survives across
        iterations - nothing resets it between flips.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell looping over a different nested
        dataset - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`rounds = [[3, 5, 2], [6, 6, 1], [4, 4, 4]]
total_sixes = 0
for round_rolls in rounds:
    for roll in round_rolls:
        if roll == 6:
            total_sixes += 1
print(total_sixes)  # 2`}
      </Code>
      <PracticeCell labId={5} cellId="concept-1" code={`rounds = [[3, 5, 2], [6, 6, 1], [4, 4, 4]]
total_sixes = 0
for round_rolls in rounds:
    for roll in round_rolls:
        if roll == 6:
            total_sixes += 1
print(total_sixes)  # 2`} expectedOutput={`2`} />

      <Heading size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        <Code>train.py</Code>'s <Code>train</Code> function nests exactly this shape two levels
        deep: an outer loop over <Code>epochs</Code> (how many times to walk through the whole
        dataset), and an inner loop over <Code>zip(X, y)</Code> (every training example, once per
        epoch). Nothing about the loop itself is special to machine learning - it's the same
        "repeat this for every item" pattern as the coin-flip counter, just repeated for a fixed
        number of passes over the data instead of stopping after one pass.
      </Text>

      <Heading size="sm">Deep dive: the perceptron learning rule</Heading>
      <Text>
        The update rule is <Code>weight_update = learning_rate * error * input</Code>.
      </Text>

      <Heading size="xs" color="gray.600">
        In plain Python
      </Heading>
      <Text>
        Think of it like adjusting a recipe after a bad batch of cookies: if the cookies came out
        too flat and you used a lot of butter, you cut the butter next time - the ingredient that
        was heavily present when things went wrong gets adjusted the most:
      </Text>
      <RunnableExample labId={5} code={`butter_amount = 2.0     # cups used in the bad batch
went_too_flat = -1      # -1 means "too flat", +1 would mean "too puffy"
learning_rate = 0.1

adjustment = learning_rate * went_too_flat * butter_amount
butter_amount += adjustment
print(butter_amount)  # 1.8 - a little less butter next time`} />
      <Text>
        Break the update into its three pieces: <Code>went_too_flat</Code> is which direction
        things were wrong in, <Code>butter_amount</Code> is how present that ingredient was (an
        ingredient you didn't use at all wouldn't get blamed), and <Code>learning_rate</Code>{" "}
        controls how big a step to take - too big and the recipe swings wildly between batches,
        too small and it takes forever to improve.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell applying the update rule to a
        different scenario - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`brew_minutes = 5.0  # minutes used in the too-bitter batch
too_bitter = -1     # -1 means "too bitter", +1 would mean "too weak"
learning_rate = 0.2

adjustment = learning_rate * too_bitter * brew_minutes
brew_minutes += adjustment
print(brew_minutes)  # 4.0 - a little less brew time next time`}
      </Code>
      <PracticeCell labId={5} cellId="concept-2" code={`brew_minutes = 5.0  # minutes used in the too-bitter batch
too_bitter = -1     # -1 means "too bitter", +1 would mean "too weak"
learning_rate = 0.2

adjustment = learning_rate * too_bitter * brew_minutes
brew_minutes += adjustment
print(brew_minutes)  # 4.0 - a little less brew time next time`} expectedOutput={`4.0`} />

      <Heading size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        <Code>update * xi</Code> in <Code>train.py</Code> is the exact same computation:{" "}
        <Code>update = learning_rate * target</Code> plays the role of "which direction and how
        big a step," and multiplying by <Code>xi</Code> (the input features) means features that
        were "on" for this example get nudged more than features that were "off" (zero), since a
        zero feature contributed nothing to the wrong prediction in the first place. If the true
        label is <Code>+1</Code> but the perceptron said <Code>-1</Code>, that's a strong signal to
        push the weights toward predicting <Code>+1</Code> for inputs like this one.
      </Text>

      <Heading size="sm">Deep dive: error, loss, and mutating state</Heading>
      <Text>
        "Error" here just means "how many examples did the model get wrong in this epoch" -
        counted in <Code>errors_per_epoch</Code>.
      </Text>

      <Heading size="xs" color="gray.600">
        In plain Python
      </Heading>
      <Text>
        Notice that a running total which changes in place, rather than getting rebuilt from
        scratch, is "mutating state" - exactly like a bank balance that keeps growing across many
        deposits rather than resetting to zero each time:
      </Text>
      <RunnableExample labId={5} code={`balance = 100
balance += 50   # mutates balance in place
balance += 20
print(balance)  # 170 - remembers every deposit before it`} />
      <Text>
        Each <Code>+=</Code> reads the current value, adds to it, and writes the result back into
        the same variable - the next line sees the updated number, not the original one.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell mutating a running total in place -
        run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`score = 0
score += 10  # mutates score in place
score += 25
print(score)  # 35 - remembers every point scored before it`}
      </Code>
      <PracticeCell labId={5} cellId="concept-3" code={`score = 0
score += 10  # mutates score in place
score += 25
print(score)  # 35 - remembers every point scored before it`} expectedOutput={`35`} />

      <Heading size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        <Code>model.weights += update * xi</Code> changes the same <Code>Perceptron</Code> object
        across every iteration of the loop, the same way <Code>balance</Code> kept accumulating
        deposits above. The model doesn't get rebuilt from scratch each epoch; it remembers what it
        learned in every previous epoch and keeps adjusting from there. Bigger neural networks
        (including every transformer) replace this simple mistake-count with a "loss function" - a
        number that measures not just whether a prediction was wrong, but by how much, so that
        gradient-descent-based training can make smoother, more informed updates - but the
        underlying pattern of state that persists and improves over time is identical.
      </Text>

      <Heading size="sm">Deep dive: plotting with matplotlib</Heading>
      <Text>
        matplotlib can draw more than one chart in a single figure, which is useful when two plots
        tell a story better side by side than apart.
      </Text>

      <Heading size="xs" color="gray.600">
        In plain Python
      </Heading>
      <Text>
        Here's a figure with two small, unrelated charts placed next to each other:
      </Text>
      <RunnableExample labId={5} code={`import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(10, 4))

axes[0].plot([1, 2, 3, 4], [68, 70, 71, 73])
axes[0].set_title("temperature over 4 days")

axes[1].bar(["cats", "dogs", "birds"], [12, 19, 7])
axes[1].set_title("pet votes")

plt.tight_layout()
plt.savefig("two_charts.png")
plt.show()`} />
      <Text>
        <Code>plt.subplots(1, 2, ...)</Code> creates one figure with a 1-row-by-2-column grid of
        axes and hands them back as a list; each entry in <Code>axes</Code> is then a normal,
        independent chart you draw on with <Code>.plot</Code>, <Code>.bar</Code>, and{" "}
        <Code>.set_title</Code>, exactly like you would on a single-plot figure.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 4 practice" cell plotting two different side-by-side
        charts - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(8, 3))
axes[0].plot([1, 2, 3], [10, 20, 15])
axes[0].set_title("daily steps")
axes[1].bar(["tea", "coffee"], [5, 9])
axes[1].set_title("drink orders")
plt.tight_layout()
plt.savefig("two_panels.png")
print("Saved side-by-side charts to two_panels.png")  # Saved side-by-side charts to two_panels.png`}
      </Code>
      <PracticeCell labId={5} cellId="concept-4" code={`import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(8, 3))
axes[0].plot([1, 2, 3], [10, 20, 15])
axes[0].set_title("daily steps")
axes[1].bar(["tea", "coffee"], [5, 9])
axes[1].set_title("drink orders")
plt.tight_layout()
plt.savefig("two_panels.png")
print("Saved side-by-side charts to two_panels.png")  # Saved side-by-side charts to two_panels.png`} />

      <Text>
        Further reading:{" "}
        <Link href="https://www.ibm.com/think/topics/loss-function" isExternal color="blue.500">
          IBM: What Is Loss Function?
        </Link>{" "}
        explains how modern networks generalize this lab's simple "count the mistakes" signal into
        a differentiable loss that gradient descent can optimize.
      </Text>

      <Heading size="xs" color="gray.600">
        Applied to this lab
      </Heading>
      <Text>
        <Code>project.py</Code>'s <Code>main</Code> function calls{" "}
        <Code>plt.subplots(1, 2, figsize=(13, 5))</Code> for exactly this reason: <Code>axes[0]</Code>{" "}
        is a line plot of <Code>accuracy_per_epoch</Code> - the training accuracy curve climbing
        (hopefully) upward as the epochs in the deep dive above tick by - and <Code>axes[1]</Code>{" "}
        is a scatter plot, in the same PCA space from lab 4, of the held-out test points: correct
        predictions in blue circles, wrong ones as black X's, against the training data's positive
        and negative clusters in the background. Side by side, the two panels answer two different
        questions in one glance - "did training actually improve things over time?" on the left,
        and "where, geometrically, does the trained model still get confused?" on the right - saved
        together to <Code>training_results.png</Code>.
      </Text>

    </VStack>
  );
}
