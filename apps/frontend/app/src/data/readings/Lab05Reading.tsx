import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab05Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">The perceptron learning rule</Heading>
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

      <Heading as="h3" size="sm">Deep dive: looping over epochs and data</Heading>
      <Text>
        A "for loop" repeats a block of code once per item in a sequence.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>Here is the loop, one flip at a time. Some words first:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A <b>list</b> is items in order inside square brackets, like{" "}
          <Code>["H", "T", "H"]</Code>. A <b>for loop</b> takes the items one by one and runs the
          indented lines once for each item.
        </ListItem>
        <ListItem>
          <Code>==</Code> asks "are these two the same?" and gives <Code>True</Code> or{" "}
          <Code>False</Code>. A single <Code>=</Code> is different. It stores a value.{" "}
          <Code>heads_count += 1</Code> means "add 1 to <Code>heads_count</Code>".
        </ListItem>
        <ListItem>
          Start: <Code>heads_count</Code> is 0. Flip 1 is <Code>"H"</Code>, so it goes up to 1.
          Flip 2 is <Code>"T"</Code>, so nothing changes (still 1).
        </ListItem>
        <ListItem>
          Flip 3 is <Code>"H"</Code>: 2. Flip 4 is <Code>"H"</Code>: 3. Flip 5 is{" "}
          <Code>"T"</Code>: still 3. The loop ends and <Code>print</Code> shows <Code>3</Code>.
        </ListItem>
      </UnorderedList>

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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          <Code>rounds</Code> is a list that holds three smaller lists. Each small list is one
          round of three dice rolls.
        </ListItem>
        <ListItem>
          The outer loop takes one round at a time. The inner loop takes one roll from that round.
          So the inner loop runs 3 times for every turn of the outer loop: 9 rolls in all.
        </ListItem>
        <ListItem>
          Round <Code>[3, 5, 2]</Code> has no 6, so the counter stays 0. Round{" "}
          <Code>[6, 6, 1]</Code> has two 6s, so the counter goes to 2. Round{" "}
          <Code>[4, 4, 4]</Code> has none, so it stays 2.
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> the single number <Code>2</Code>. Try changing one of the 4s
        to a 6 and run it again. You should now see <Code>3</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>
        Here is the real shape of the loop in the lab. An <b>epoch</b> is one full walk through
        all the training examples. <Code>zip(X, y)</Code> glues two lists together so you get
        one pair at a time. For example, <Code>zip([1, 2], ["a", "b"])</Code> gives{" "}
        <Code>(1, "a")</Code> and then <Code>(2, "b")</Code>. In the lab, each pair is an example
        and its true label.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The toy data has 4 examples, and we ask for 3 epochs. So the inner loop runs 4 times in
          each epoch, and 12 times in all.
        </ListItem>
        <ListItem>
          <Code>for _ in range(epochs)</Code> just repeats the block 3 times. The name{" "}
          <Code>_</Code> means "I do not need the counter number".
        </ListItem>
        <ListItem>
          At the start of each epoch, <Code>errors = 0</Code> resets the mistake counter. At the
          end, <Code>errors_per_epoch.append(errors)</Code> saves it. After 3 epochs the list has 3
          numbers, one for each epoch.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Deep dive: the perceptron learning rule</Heading>
      <Text>
        The update rule is <Code>weight_update = learning_rate * error * input</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>Here is that recipe example with the real numbers:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>learning_rate * went_too_flat * butter_amount</Code> is 0.1 * -1 * 2.0 = -0.2. The
          minus sign means "go down".
        </ListItem>
        <ListItem>
          <Code>butter_amount += adjustment</Code> is 2.0 + (-0.2) = 1.8. That is a small step, and
          not a jump to 0.
        </ListItem>
        <ListItem>
          If <Code>butter_amount</Code> were 0, the adjustment would be 0.1 * -1 * 0 = 0. An
          ingredient that was not there is not blamed.
        </ListItem>
      </UnorderedList>

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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          The brew time was 5.0 minutes and the coffee was too bitter. <Code>too_bitter</Code> is{" "}
          <Code>-1</Code>, which means "go down".
        </ListItem>
        <ListItem>
          <Code>adjustment</Code> is 0.2 * -1 * 5.0 = -1.0. The step is 20% of the brew time, and
          it points down.
        </ListItem>
        <ListItem>
          <Code>brew_minutes += adjustment</Code> is 5.0 + (-1.0) = 4.0. The last line prints it.
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> <Code>4.0</Code>. Try changing <Code>too_bitter</Code> to{" "}
        <Code>1</Code> ("too weak"). The adjustment becomes +1.0 and you should see{" "}
        <Code>6.0</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>
        Here is one real update from the lab's toy data. A <b>weight</b> is a number that says how
        much one input matters. The <b>bias</b> is a number added at the end. A{" "}
        <b>feature</b> is one number that describes an example. Say the weights are{" "}
        <Code>[0.0, 0.0]</Code>, the bias is <Code>0.0</Code> and <Code>learning_rate</Code> is
        0.1. The example is <Code>xi = [-2.0, -2.0]</Code> and its true label is{" "}
        <Code>target = -1</Code>.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>predict</Code> works out 0 * -2 + 0 * -2 + 0 = 0. The perceptron says "+1 when the
          number is 0 or more", so it answers <Code>+1</Code>. That does not match{" "}
          <Code>-1</Code>, so it is a mistake.
        </ListItem>
        <ListItem>
          <Code>update = learning_rate * target</Code> is 0.1 * -1 = -0.1.
        </ListItem>
        <ListItem>
          <Code>update * xi</Code> is -0.1 * [-2.0, -2.0] = [0.2, 0.2]. Both weights go up to{" "}
          <Code>[0.2, 0.2]</Code>.
        </ListItem>
        <ListItem>
          <Code>model.bias += update</Code> makes the bias -0.1.
        </ListItem>
        <ListItem>
          Check: now the number for this example is 0.2 * -2 + 0.2 * -2 + (-0.1) = -0.9. That is
          below 0, so the perceptron now says <Code>-1</Code>. It is fixed.
        </ListItem>
      </UnorderedList>
      <Text>
        If one feature were 0, such as <Code>xi = [-2.0, 0.0]</Code>, then <Code>update * xi</Code>{" "}
        would be [0.2, 0.0]. The second weight would not move at all.
      </Text>

      <Heading as="h3" size="sm">Deep dive: error, loss, and mutating state</Heading>
      <Text>
        "Error" here just means "how many examples did the model get wrong in this epoch" -
        counted in <Code>errors_per_epoch</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>With the bank numbers, the steps are:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>balance = 100</Code> stores 100.
        </ListItem>
        <ListItem>
          <Code>balance += 50</Code> is the short way to write <Code>balance = balance + 50</Code>.
          It reads 100, adds 50 and writes 150 back.
        </ListItem>
        <ListItem>
          <Code>balance += 20</Code> reads 150, adds 20 and writes 170. The print shows{" "}
          <Code>170</Code>.
        </ListItem>
      </UnorderedList>

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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          <Code>score = 0</Code> starts the game with no points.
        </ListItem>
        <ListItem>
          <Code>score += 10</Code> changes the same variable to 0 + 10 = 10.
        </ListItem>
        <ListItem>
          <Code>score += 25</Code> starts from the 10 that is already there: 10 + 25 = 35.
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> <Code>35</Code>. Try adding one more line,{" "}
        <Code>score += 5</Code>, before the print. You should now see <Code>40</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>
        Here is the lab's toy run, with 4 examples, from zero weights. The examples are{" "}
        <Code>[2, 2]</Code> (+1), <Code>[3, 3]</Code> (+1), <Code>[-2, -2]</Code> (-1) and{" "}
        <Code>[-3, -1]</Code> (-1). The learning rate is 0.1. <Code>train</Code> returns{" "}
        <Code>[1, 0, 0]</Code> for 3 epochs.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Epoch 1, examples 1 and 2: the number is 0, so the perceptron says +1. That is right, so
          nothing changes.
        </ListItem>
        <ListItem>
          Epoch 1, example 3: it says +1 but the label is -1. A mistake. The weights become{" "}
          <Code>[0.2, 0.2]</Code>, the bias becomes -0.1 and <Code>errors</Code> is 1.
        </ListItem>
        <ListItem>
          Epoch 1, example 4: 0.2 * -3 + 0.2 * -1 - 0.1 = -0.9. It says -1, which is right. The
          epoch ends with 1 mistake, so <Code>1</Code> is added to the list.
        </ListItem>
        <ListItem>
          Epoch 2: <Code>errors</Code> starts at 0 again, but the weights are kept. Example 1 gives
          0.4 + 0.4 - 0.1 = 0.7, which is +1 and right. All four are right, so 0 is added.
          Epoch 3 is the same. The list is <Code>[1, 0, 0]</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        See what is kept and what is reset. <Code>errors</Code> is reset every epoch, because we
        want a fresh count each time. The weights and bias are never reset, because that is what
        the model has learned.
      </Text>

      <Heading as="h3" size="sm">Deep dive: plotting with matplotlib</Heading>
      <Text>
        matplotlib can draw more than one chart in a single figure, which is useful when two plots
        tell a story better side by side than apart.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          <Code>plt.subplots(1, 2, figsize=(8, 3))</Code> makes one picture with 1 row and 2
          columns of charts. <Code>figsize</Code> is the size in inches: 8 wide and 3 tall. The
          two charts are saved in <Code>axes</Code>.
        </ListItem>
        <ListItem>
          <Code>axes[0].plot([1, 2, 3], [10, 20, 15])</Code> draws a line on the left chart through
          the points (1, 10), (2, 20) and (3, 15). It goes up and then down a little.
        </ListItem>
        <ListItem>
          <Code>axes[1].bar(["tea", "coffee"], [5, 9])</Code> draws two bars on the right chart.
          Tea is 5 tall and coffee is 9 tall.
        </ListItem>
        <ListItem>
          <Code>set_title</Code> puts a name on each chart. <Code>tight_layout()</Code> spaces the
          charts so the text does not overlap.
        </ListItem>
        <ListItem>
          <Code>savefig</Code> writes the picture to a file. The last line prints a message.
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> the line <Code>Saved side-by-side charts to two_panels.png</Code>.
        This cell saves the picture to a file and does not call <Code>plt.show()</Code>, so you may
        not see the chart on screen. Try changing the coffee number from 9 to 2. The right bar
        would then be shorter than the tea bar.
      </Text>

      <Text>
        Further reading:{" "}
        <Link href="https://www.ibm.com/think/topics/loss-function" isExternal color="blue.500">
          IBM: What Is Loss Function?
        </Link>{" "}
        explains how modern networks generalize this lab's simple "count the mistakes" signal into
        a differentiable loss that gradient descent can optimize.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">
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
      <Text>Here is how each panel is built, with small numbers:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Left panel: <Code>accuracy_per_epoch = [1 - e / len(X_train) for e in errors_per_epoch]</Code>.
          <b> Accuracy</b> is the share of examples that were right. Say there are 80 training
          examples and the mistakes per epoch are <Code>[10, 4, 0]</Code>. Then the accuracy is 1 -
          10/80 = 0.875, then 1 - 4/80 = 0.95, then 1 - 0/80 = 1.0. The line climbs.
        </ListItem>
        <ListItem>
          <Code>range(1, len(errors_per_epoch) + 1)</Code> gives the epoch numbers 1, 2, 3 for the
          x-axis. <Code>marker="o"</Code> puts a dot on each epoch.
        </ListItem>
        <ListItem>
          Right panel: <Code>correct = predictions_test == y_test</Code> compares the guesses to the
          true labels and gives <Code>True</Code> or <Code>False</Code> for each test point. If the
          guesses are <Code>[1, -1, 1]</Code> and the labels are <Code>[1, 1, 1]</Code>, then{" "}
          <Code>correct</Code> is <Code>[True, False, True]</Code>.
        </ListItem>
        <ListItem>
          <Code>X2d_test[correct]</Code> keeps only the right points (blue circles).{" "}
          <Code>X2d_test[~correct]</Code> keeps only the wrong points. The <Code>~</Code> flips
          True and False, so those are drawn as black X's.
        </ListItem>
      </UnorderedList>
      <Text>
        The 2D positions here come from PCA, which squashes many features down to 2 numbers so the
        points fit on a flat chart. It is only for drawing. The perceptron itself still uses all
        the original features.
      </Text>

    </VStack>
  );
}
