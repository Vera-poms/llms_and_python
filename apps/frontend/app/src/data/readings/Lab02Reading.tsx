import { Heading, Link, OrderedList, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, RunSubmitKeys, Text } from "../../components/prose";

import { CodeBlock } from "../../components/CodeBlock";
import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";
import { CodeHint } from "../../components/codeHints";

// Shown when the reader hovers the underlined code in the examples below.
// In the text, `backticks` style code and **double stars** bold a key word.
const FLIPS_HINTS: CodeHint[] = [
  {
    code: "for flip in flips:",
    block: "for loop",
    text: "Goes through the six flips one by one and adds 1 to the count of that flip.",
  },
  {
    code: "counts: dict[str, int] = {}",
    text:
      "`counts` starts empty. The loop looks at each flip. After the six flips it holds " +
      "`{'heads': 4, 'tails': 2}`.",
  },
  {
    code: "counts[flip] = counts.get(flip, 0) + 1",
    text: "It counts the same way as Lab 1: get the old count, or 0, and add 1.",
  },
  {
    code: "lambda outcome: counts[outcome]",
    text:
      "A tiny function with no name. You give it an outcome, and it gives back that outcome's " +
      "count. `max` uses it as a score card.",
  },
  {
    code: "max(counts, key=",
    text:
      "`max` checks `\"heads\"` (score 4) and `\"tails\"` (score 2). The biggest score is 4, so " +
      "it returns `\"heads\"`.",
  },
];

const MSE_HINTS: CodeHint[] = [
  {
    code: "squared_errors = [",
    text:
      "A **list comprehension** is a short way to build a list in one line. Here it builds " +
      "`squared_errors`, which is `[16, 36, 36]`.",
  },
  {
    code: "zip(actual, predicted)",
    text: "Pairs them up: (86, 90), (101, 95), (114, 120).",
  },
  {
    code: "(a - p) ** 2",
    text:
      "For each pair: `(86 - 90) = -4`, squared is 16. `(101 - 95) = 6`, squared is 36. " +
      "`(114 - 120) = -6`, squared is 36. Squaring makes -4 and 4 both become 16, so a miss in " +
      "either direction counts the same. It also makes one big miss hurt more than two small ones.",
  },
  {
    code: "mse = sum(squared_errors) / len(squared_errors)",
    text:
      "MSE is short for **mean squared error**. `mse` = `(16 + 36 + 36) / 3 = 88` / 3, which is " +
      "about 29.33.",
  },
];

const PLOT_HINTS: CodeHint[] = [
  {
    code: "xs = [2, 4, 6, 8, 10]",
    text: "`xs` are the ages. There are five points in all.",
  },
  {
    code: "ys = [86, 101, 114, 128, 139]",
    text: "`ys` are the real heights, one for each age.",
  },
  {
    code: 'plt.scatter(xs, ys, label="real points")',
    text:
      "Puts 5 dots on the chart. A **scatter plot** is a chart of separate dots. Nothing joins " +
      "them.",
  },
  {
    code: "[6.6 * x + 73.7 for x in xs]",
    text:
      "Builds a new list. For age 2 it gives `6.6 * 2 + 73.7 = 86.9`. For age 10 it gives 139.7. " +
      "The other ages fall in between.",
  },
  {
    code: "plt.plot(xs, ",
    text: "Joins those 5 values (the new list) with a line.",
  },
  {
    code: 'color="crimson"',
    text: "Makes the line dark red.",
  },
  {
    code: "plt.legend()",
    text: "Shows a small box that explains the dots and the line.",
  },
];

export function Lab02Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">Two kinds of "simple prediction"</Heading>
      <Text>
        Lab 1 gave you a probability distribution over discrete outcomes (words). Sometimes what
        you want to predict is continuous instead - a number, not a category. This lab contrasts
        the two: a frequency-based guess (predict whichever outcome you've seen most) and linear
        regression (predict a number from another number using a straight-line fit).
      </Text>

      <Heading as="h3" size="sm">Concept 1: a frequency baseline</Heading>
      <Text>
        The simplest possible prediction strategy is "guess whatever you've seen most often."
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>Say you're guessing whether a coin is fair by looking at past flips:</Text>
      <RunnableExample hints={FLIPS_HINTS} labId={2} code={`flips = ["heads", "tails", "heads", "heads", "tails", "heads"]

counts: dict[str, int] = {}
for flip in flips:
    counts[flip] = counts.get(flip, 0) + 1

best_guess = max(counts, key=lambda outcome: counts[outcome])
print(best_guess)  # 'heads'`} />
      <Text>
        <Code>max(iterable, key=...)</Code> walks every key in <Code>counts</Code> and returns the
        one for which <Code>key(item)</Code> is largest - here, the outcome with the highest tally.
      </Text>
      <Text>
        A <b>baseline</b> is a simple guess that you use to compare better models against. Here
        the baseline is "always say heads". It is right 4 times out of 6.
      </Text>

      <CodeBlock code={`weather = ["sunny", "rainy", "sunny", "cloudy", "sunny", "rainy"]

counts: dict[str, int] = {}
for day in weather:
    counts[day] = counts.get(day, 0) + 1

best_guess = max(counts, key=lambda outcome: counts[outcome])
print(best_guess)  # 'sunny'`} hints={[
        {
          code: "for day in weather:",
          block: "for loop",
          text: "Goes through the six days one by one and adds 1 to the count of that day's weather.",
        },
        {
          code: "counts: dict[str, int] = {}",
          text: "Starts as an empty dict. After the loop it holds `{'sunny': 3, 'rainy': 2, 'cloudy': 1}`.",
        },
        {
          code: "counts.get(day, 0) + 1",
          text: "The old count for this weather, or `0` if it is new, plus 1.",
        },
        {
          code: "lambda outcome: counts[outcome]",
          text:
            "A tiny function with no name. You give it a weather word, and it gives back that " +
            "word's count.",
        },
        {
          code: "max(counts, key=",
          text:
            "`max` goes through the keys of `counts` and returns the one with the biggest score from " +
            "`key`. Here that is `\"sunny\"`, with 3.",
        },
      ]} />
      <PracticeCell labId={2} cellId="concept-1" code={`weather = ["sunny", "rainy", "sunny", "cloudy", "sunny", "rainy"]

counts: dict[str, int] = {}
for day in weather:
    counts[day] = counts.get(day, 0) + 1

best_guess = max(counts, key=lambda outcome: counts[outcome])
print(best_guess)  # 'sunny'`} expectedOutput={`sunny`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>weather</Code> is a list of 6 days: sunny 3 times, rainy 2 times, cloudy 1 time.
        </ListItem>
        <ListItem>
          The loop builds <Code>counts</Code>:{" "}
          <Code>{"{'sunny': 3, 'rainy': 2, 'cloudy': 1}"}</Code>. <Code>3 + 2 + 1 = 6</Code>, so every day is
          counted.
        </ListItem>
        <ListItem>
          <Code>max</Code> looks at the three scores (3, 2, 1) and picks the biggest. That is{" "}
          <Code>"sunny"</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> one line, <Code>sunny</Code>. Try adding two more{" "}
        <Code>"rainy"</Code> to the list. Rainy now has 4, so the answer changes to{" "}
        <Code>rainy</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: why every model needs a baseline</Heading>
      <Text>
        A score on its own means little. "90% right" sounds great, but compared to what?
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A <b>baseline</b> gives the score a meaning. It is the lazy guess a model must beat. If
          the model cannot beat it, it has learned nothing.
        </ListItem>
        <ListItem>
          This matters most when one answer is very common. If 9 reviews out of 10 are positive,
          always saying "positive" is already 90% right.
        </ListItem>
        <ListItem>
          People test LLMs the same way: the score is compared with a simple baseline.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. <Code>accuracy</Code> loops over the guesses and counts how many
        match the true labels. <Code>baseline_accuracy</Code> finds how often the most common label
        shows up, which is the score of always guessing that label.
      </Text>
      <RunnableExample labId={2} code={`def accuracy(predictions, labels):
    correct = 0
    for guess, truth in zip(predictions, labels):
        if guess == truth:
            correct = correct + 1
    return correct / len(labels)


def baseline_accuracy(labels):
    counts = {}
    for label in labels:
        counts[label] = counts.get(label, 0) + 1
    return max(counts.values()) / len(labels)


labels = [1, 1, 1, 0, 1, 0, 1, 1]
model = [1, 1, 0, 0, 1, 0, 1, 1]
print("model:", accuracy(model, labels))
print("baseline:", baseline_accuracy(labels))
print("model beats baseline:", accuracy(model, labels) > baseline_accuracy(labels))`} hints={[
        {
          code: "def accuracy(predictions, labels):",
          block: "function",
          text:
            "Counts how many guesses match the true labels, then divides by the number of labels. " +
            "The answer is the **share** that is right.",
        },
        {
          code: "for guess, truth in zip(predictions, labels):",
          block: "for loop",
          text: "Walks the two lists side by side. Each round takes one guess and the true label at the same position.",
        },
        {
          code: "if guess == truth:",
          block: "if block",
          text: "Runs only when the guess is right. Then it adds 1 to `correct`.",
        },
        {
          code: "def baseline_accuracy(labels):",
          block: "function",
          text:
            "Counts each label, takes the biggest count, and divides by the number of labels. That " +
            "is the score of always guessing the most common label.",
        },
        {
          code: "for label in labels:",
          block: "for loop",
          text: "Goes through the labels and adds 1 to the count of each one.",
        },
        {
          code: "zip(predictions, labels)",
          text: "`zip` pairs up the two lists by position: first with first, second with second, and so on.",
        },
        {
          code: "correct / len(labels)",
          text: "Right answers divided by the number of labels. The model gets `7 / 8 = 0.875`.",
        },
        {
          code: "counts.get(label, 0) + 1",
          text: "The label's old count, or `0` if it is new, plus 1.",
        },
        {
          code: "max(counts.values())",
          text: "The biggest count. Label `1` shows up 6 times, so this is 6, and `6 / 8 = 0.75`.",
        },
        {
          code: "accuracy(model, labels) > baseline_accuracy(labels)",
          text: "`>` compares the two scores. It prints `True`, because `0.875` is bigger than `0.75`.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          There are 8 labels: six 1s and two 0s. The baseline always says 1, so it is right 6 times
          out of 8, which is 0.75.
        </ListItem>
        <ListItem>
          The model gets 7 right out of 8, which is 0.875.
        </ListItem>
        <ListItem>
          <Code>0.875 &gt; 0.75</Code>, so the model beats the baseline.
        </ListItem>
        <ListItem>
          Pattern: judge a model against the baseline, not against 100%.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>accuracy</Code> and <Code>baseline_accuracy</Code> from the worked example
          above, exactly as they are.
        </ListItem>
        <ListItem>
          Make <Code>labels</Code> a list of ten numbers: nine <Code>1</Code>s, then one{" "}
          <Code>0</Code>.
        </ListItem>
        <ListItem>
          Make <Code>model</Code> a list of ten numbers: eight <Code>1</Code>s, then two{" "}
          <Code>0</Code>s.
        </ListItem>
        <ListItem>
          Print <Code>"model:"</Code> and <Code>accuracy(model, labels)</Code>. On the next line
          print <Code>"baseline:"</Code> and <Code>baseline_accuracy(labels)</Code>. On the last
          line print <Code>"model beats baseline:"</Code> and{" "}
          <Code>accuracy(model, labels) &gt; baseline_accuracy(labels)</Code>.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={2} cellId="topic-1" withHint code={`def accuracy(predictions, labels):
    correct = 0
    for guess, truth in zip(predictions, labels):
        if guess == truth:
            correct = correct + 1
    return correct / len(labels)


def baseline_accuracy(labels):
    counts = {}
    for label in labels:
        counts[label] = counts.get(label, 0) + 1
    return max(counts.values()) / len(labels)


labels = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
model = [1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
print("model:", accuracy(model, labels))
print("baseline:", baseline_accuracy(labels))
print("model beats baseline:", accuracy(model, labels) > baseline_accuracy(labels))`} expectedOutput={`model: 0.9
baseline: 0.9
model beats baseline: False`} />
      <Text>
        <b>What you should see:</b> exactly these three lines. If yours differ, check the two lists
        of ten numbers.
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
        {`model: 0.9
baseline: 0.9
model beats baseline: False`}
      </Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          There are 10 labels: nine 1s and one 0. The baseline always says 1, so it is right 9 times
          out of 10, which is 0.9.
        </ListItem>
        <ListItem>
          The model misses only the ninth label (it says 0, the truth is 1). The last one it gets
          right. So it is right 9 times out of 10, which is 0.9. It looks good, but it is no better
          than the lazy guess.
        </ListItem>
        <ListItem>
          <Code>0.9 &gt; 0.9</Code> is <Code>False</Code>, so the model does not beat the baseline.
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>most_common_label</Code> is the baseline for a list of <Code>0/1</Code>
        labels: it gives back the label that shows up most. This project does not use it, but it
        uses the same idea for numbers. The baseline always predicts the average word count,
        <Code>mean_baseline</Code> (about 8.66), and its error is a <Code>baseline_mse</Code> of
        about 1.589. The regression line has to beat that.
      </Text>
      <Text>
        Here is the lab's real code. It is the same as the weather cell, but the keys are the
        numbers 0 and 1:
      </Text>
      <CodeBlock code={`def most_common_label(labels):
    counts = {}
    for label in labels:
        counts[label] = counts.get(label, 0) + 1
    return max(counts, key=lambda label: counts[label])`} hints={[
        {
          code: "def most_common_label(labels):",
          block: "function",
          text:
            "Gives back the label that shows up most often. It counts each label, then picks the " +
            "one with the biggest count.",
        },
        {
          code: "for label in labels:",
          block: "for loop",
          text: "Goes through the labels and adds 1 to the count of each one.",
        },
        {
          code: "counts.get(label, 0) + 1",
          text: "The label's old count, or `0` if it is new, plus 1.",
        },
        {
          code: "max(counts, key=lambda label: counts[label])",
          text:
            "Goes through the labels in `counts` and returns the one with the biggest count. The " +
            "`lambda` is a tiny function that gives back a label's count. On a tie, the first one wins.",
        },
      ]} />
      <Text>Take the labels <Code>[1, 0, 1, 1, 0]</Code>:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The loop gives <Code>{"{1: 3, 0: 2}"}</Code>. The label 1 shows up 3 times, and the
          label 0 shows up 2 times.
        </ListItem>
        <ListItem>
          <Code>max</Code> picks the key with the biggest count, so it returns <Code>1</Code>.
        </ListItem>
        <ListItem>
          If there is a tie, like <Code>[0, 1]</Code>, <Code>max</Code> returns the first one it
          saw. That is <Code>0</Code>. This matches the lab rule "the one that came first wins".
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Concept 2: fitting a straight line (linear regression)</Heading>
      <Text>
        Linear regression finds the straight line <Code>y = slope * x + intercept</Code> that best
        fits a set of (x, y) points. "Best" means minimizing the total squared vertical distance
        between the line and every real point (the "least-squares" fit).
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Picture predicting a child's height from their age using a handful of measurements:
      </Text>
      <RunnableExample labId={2} code={`ages =    [2, 4, 6, 8, 10]     # years
heights = [86, 101, 114, 128, 139]  # cm

n = len(ages)
x_mean = sum(ages) / n
y_mean = sum(heights) / n

numerator = sum((x - x_mean) * (y - y_mean) for x, y in zip(ages, heights))
denominator = sum((x - x_mean) ** 2 for x in ages)

slope = numerator / denominator
intercept = y_mean - slope * x_mean
print(slope, intercept)  # roughly 6.6, 73.7 - predict height ≈ 6.6*age + 73.7`} hints={[
        {
          code: "n = len(ages)",
          text: "The number of children: 5.",
        },
        {
          code: "x_mean = sum(ages) / n",
          text: "The **mean** (average) age: `30 / 5 = 6.0`.",
        },
        {
          code: "y_mean = sum(heights) / n",
          text: "The average height: `568 / 5 = 113.6`.",
        },
        {
          code: "numerator = sum(",
          text:
            "`sum(... for x, y in ...)` works out the part inside for every pair and adds the " +
            "results. Here the total is 266.",
        },
        {
          code: "(x - x_mean) * (y - y_mean)",
          text:
            "For one child: how far the age is from the average, times how far the height is from " +
            "the average. For age 2: `-4 * -27.6 = 110.4`.",
        },
        {
          code: "zip(ages, heights)",
          text: "Pairs each age with its height: `(2, 86)`, `(4, 101)` and so on.",
        },
        {
          code: "(x - x_mean) ** 2",
          text:
            "The age gap times itself. `** 2` means \"to the power of 2\". The gaps -4, -2, 0, 2, 4 " +
            "give 16, 4, 0, 4, 16, which add up to 40.",
        },
        {
          code: "slope = numerator / denominator",
          text: "`266 / 40 = 6.65`. Each extra year adds about 6.65 cm.",
        },
        {
          code: "intercept = y_mean - slope * x_mean",
          text:
            "`113.6 - 6.65 * 6`, about 73.7. It moves the line so it goes through the average " +
            "point (6, 113.6).",
        },
      ]} />
      <Text>
        <Code>slope</Code> is the covariance of x and y divided by the variance of x (how much y
        moves together with x, scaled by how spread out x is), and <Code>intercept</Code> shifts
        the line so it passes through the average point.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>slope = cov(x, y) / var(x)</Code>
        </ListItem>
        <ListItem>
          <Code>intercept = mean(y) - slope * mean(x)</Code>
        </ListItem>
      </UnorderedList>
      <Text>
        Some words first. The <b>mean</b> is the average. The <b>slope</b> says how much y goes up
        when x goes up by 1. The <b>intercept</b> is the height of the line when x is 0. Now the
        example with the real numbers:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>n = 5</Code> children. <Code>x_mean</Code> = <Code>(2 + 4 + 6 + 8 + 10) / 5 = 6</Code>.{" "}
          <Code>y_mean</Code> = <Code>(86 + 101 + 114 + 128 + 139) / 5 = 568</Code> / 5 = 113.6.
        </ListItem>
        <ListItem>
          For each child, <Code>x - x_mean</Code> is how far the age is from 6: -4, -2, 0, 2, 4.{" "}
          <Code>y - y_mean</Code> is how far the height is from 113.6: -27.6, -12.6, 0.4, 14.4,
          25.4.
        </ListItem>
        <ListItem>
          <Code>numerator</Code> multiplies each pair and adds: <Code>110.4 + 25.2 + 0 + 28.8 + 101.6</Code> =
          266. <Code>zip</Code> is what walks the two lists together, one pair at a time.
        </ListItem>
        <ListItem>
          <Code>denominator</Code> squares the age gaps and adds: <Code>16 + 4 + 0 + 4 + 16 = 40</Code>.{" "}
          <Code>** 2</Code> means "to the power of 2", so "times itself".
        </ListItem>
        <ListItem>
          <Code>slope</Code> = <Code>266 / 40 = 6.65</Code>. <Code>intercept</Code> = <Code>113.6 - 6.65 * 6</Code> =
          73.7. So the line says: height = 6.65 * age + 73.7. (The comment in the code rounds the
          slope to about 6.6.)
        </ListItem>
      </UnorderedList>

      <CodeBlock code={`hours =  [1, 2, 3, 4, 5]
scores = [52, 58, 65, 71, 78]

n = len(hours)
x_mean = sum(hours) / n
y_mean = sum(scores) / n

numerator = sum((x - x_mean) * (y - y_mean) for x, y in zip(hours, scores))
denominator = sum((x - x_mean) ** 2 for x in hours)

slope = numerator / denominator
intercept = y_mean - slope * x_mean
print(round(slope, 2), round(intercept, 2))  # 6.5, 45.3 - predict score ~= 6.5*hours + 45.3`} hints={[
        {
          code: "x_mean = sum(hours) / n",
          text: "The average hours: `15 / 5 = 3.0`.",
        },
        {
          code: "y_mean = sum(scores) / n",
          text: "The average score: `324 / 5 = 64.8`.",
        },
        {
          code: "numerator = sum(",
          text:
            "`sum(... for x, y in ...)` works out the part inside for every pair and adds the " +
            "results. Here the total is 65.",
        },
        {
          code: "zip(hours, scores)",
          text: "Pairs each hour count with its score: `(1, 52)`, `(2, 58)` and so on.",
        },
        {
          code: "(x - x_mean) ** 2",
          text: "The hour gap times itself. The gaps -2, -1, 0, 1, 2 give 4, 1, 0, 1, 4, which add up to 10.",
        },
        {
          code: "slope = numerator / denominator",
          text: "`65 / 10 = 6.5`. Each extra hour of study adds about 6.5 points.",
        },
        {
          code: "intercept = y_mean - slope * x_mean",
          text: "`64.8 - 6.5 * 3 = 45.3`: the score the line gives for 0 hours.",
        },
        {
          code: "round(slope, 2)",
          text: "Keeps 2 digits after the point, so tiny decimal errors do not show.",
        },
      ]} />
      <PracticeCell labId={2} cellId="concept-2" code={`hours =  [1, 2, 3, 4, 5]
scores = [52, 58, 65, 71, 78]

n = len(hours)
x_mean = sum(hours) / n
y_mean = sum(scores) / n

numerator = sum((x - x_mean) * (y - y_mean) for x, y in zip(hours, scores))
denominator = sum((x - x_mean) ** 2 for x in hours)

slope = numerator / denominator
intercept = y_mean - slope * x_mean
print(round(slope, 2), round(intercept, 2))  # 6.5, 45.3 - predict score ~= 6.5*hours + 45.3`} expectedOutput={`6.5 45.3`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          5 students studied 1 to 5 hours and got scores 52, 58, 65, 71, 78.
        </ListItem>
        <ListItem>
          <Code>x_mean</Code> = <Code>15 / 5 = 3</Code>. <Code>y_mean</Code> = <Code>324 / 5 = 64.8</Code>.
        </ListItem>
        <ListItem>
          Hour gaps from 3: -2, -1, 0, 1, 2. Score gaps from 64.8: -12.8, -6.8, 0.2, 6.2, 13.2.
        </ListItem>
        <ListItem>
          <Code>numerator</Code> = <Code>25.6 + 6.8 + 0 + 6.2 + 26.4 = 65</Code>. <Code>denominator</Code> = 4
          + <Code>1 + 0 + 1 + 4 = 10</Code>.
        </ListItem>
        <ListItem>
          <Code>slope</Code> = <Code>65 / 10 = 6.5</Code>. <Code>intercept</Code> = <Code>64.8 - 6.5 * 3 = 45.3</Code>.{" "}
          <Code>round(..., 2)</Code> keeps 2 numbers after the decimal point.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>6.5 45.3</Code>. It means each extra hour of study adds
        about 6.5 points, and a student with 0 hours would get about 45.3. Try changing the last
        score from 78 to 90 and run it again. The slope should go up.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: a model is a rule with numbers learned from data</Heading>
      <Text>
        A line, <Code>y = slope * x + intercept</Code>, is a tiny model. It is a rule with two
        numbers in it.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The numbers inside a model are called <b>parameters</b>. A big LLM is the same kind of
          thing, but with billions of them.
        </ListItem>
        <ListItem>
          <b>Learning</b> means choosing the numbers that make the error small on the data.
        </ListItem>
        <ListItem>
          This lab finds the two numbers with a formula. Later labs find them with a loop that
          nudges the numbers a little at a time.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. <Code>line_value</Code> is the rule. <Code>total_error</Code>
        loops over the points and adds up the squared miss of each one. Then a loop tries three
        slopes and prints the error of each.
      </Text>
      <RunnableExample labId={2} code={`def line_value(x, slope, intercept):
    return slope * x + intercept


def total_error(points, slope, intercept):
    total = 0
    for x, y in points:
        total = total + (y - line_value(x, slope, intercept)) ** 2
    return total


points = [(1, 3), (2, 5), (3, 7)]
for slope in (1, 2, 3):
    print("slope", slope, "-> error", total_error(points, slope, 1))`} hints={[
        {
          code: "def line_value(x, slope, intercept):",
          block: "function",
          text: "The rule of the model: give it an `x`, and it gives back the height of the line there, `slope * x + intercept`.",
        },
        {
          code: "def total_error(points, slope, intercept):",
          block: "function",
          text:
            "Adds up the squared miss of every point. A miss is the real `y` minus the line's value. " +
            "A smaller total means a better line.",
        },
        {
          code: "for x, y in points:",
          block: "for loop",
          text: "Takes one point at a time. Each point is a pair, so `x, y` splits it into its two numbers.",
        },
        {
          code: "for slope in (1, 2, 3):",
          block: "for loop",
          text: "Tries three slopes, keeping the intercept at 1, and prints the error for each.",
        },
        {
          code: "(y - line_value(x, slope, intercept)) ** 2",
          text:
            "The miss for one point, squared. With slope 1 and the point `(3, 7)`: the line gives 4, " +
            "the miss is 3, and squared it is 9.",
        },
        {
          code: "points = [(1, 3), (2, 5), (3, 7)]",
          text: "Three points, each an `(x, y)` pair. They sit exactly on the line `y = 2x + 1`.",
        },
        {
          code: "total_error(points, slope, 1)",
          text: "The error for this slope, with the intercept fixed at 1.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The three points sit exactly on the line <Code>y = 2x + 1</Code>.
        </ListItem>
        <ListItem>
          With slope 1 the line gives 2, 3 and 4. The misses are 1, 2 and 3, squared 1, 4 and 9, so
          the error is 14.
        </ListItem>
        <ListItem>
          With slope 2 the line gives 3, 5 and 7. Every miss is 0, so the error is 0.
        </ListItem>
        <ListItem>
          With slope 3 the error is 14 again. Pattern: learning is a search for the numbers with the
          smallest error.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>line_value</Code> and <Code>total_error</Code> from the worked example above,
          exactly as they are.
        </ListItem>
        <ListItem>
          Make <Code>points = [(1, 3), (2, 6), (3, 9)]</Code>.
        </ListItem>
        <ListItem>
          Loop with <Code>for slope in (1, 3, 4):</Code> and print <Code>"slope"</Code>,{" "}
          <Code>slope</Code>, <Code>"-&gt; error"</Code> and{" "}
          <Code>total_error(points, slope, 0)</Code> in one <Code>print(...)</Code> call. The
          intercept is <Code>0</Code> this time.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={2} cellId="topic-2" withHint code={`def line_value(x, slope, intercept):
    return slope * x + intercept


def total_error(points, slope, intercept):
    total = 0
    for x, y in points:
        total = total + (y - line_value(x, slope, intercept)) ** 2
    return total


points = [(1, 3), (2, 6), (3, 9)]
for slope in (1, 3, 4):
    print("slope", slope, "-> error", total_error(points, slope, 0))`} expectedOutput={`slope 1 -> error 56
slope 3 -> error 0
slope 4 -> error 14`} />
      <Text>
        <b>What you should see:</b> exactly these three lines. If yours differ, check the points
        and that the intercept is 0.
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
        {`slope 1 -> error 56
slope 3 -> error 0
slope 4 -> error 14`}
      </Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The points sit on <Code>y = 3x</Code>. We try slopes 1, 3 and 4.
        </ListItem>
        <ListItem>
          Slope 1 gives 1, 2 and 3. The misses are 2, 4 and 6, squared 4, 16 and 36, so the error is
          56.
        </ListItem>
        <ListItem>
          Slope 3 hits every point, so the error is 0.
        </ListItem>
        <ListItem>
          Slope 4 gives 4, 8 and 12. The misses are 1, 2 and 3, squared 1, 4 and 9, so the error is
          14.
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>linear_regression_fit(x, y)</Code> does not search. It uses the formula once
        and gives back <Code>(slope, intercept)</Code>. Then <Code>predict(x, slope,
        intercept)</Code> plugs a new x into the line. In the project, the fit on the 170 review
        sentences gives a slope of about 0.108 and an intercept of about 3.380. So a 60-character
        sentence is predicted at about 9.9 words.
      </Text>
      <Text>
        The formula only works because the model is one straight line. Later labs (4-5) predict
        things a straight line can't capture, so they switch to iterative training loops. The goal
        is the same: make the error between predictions and reality small.
      </Text>
      <Text>
        Here is the lab's real function on a tiny input:{" "}
        <Code>linear_regression_fit([1, 2, 3], [3, 5, 7])</Code>. The points sit exactly on a
        line.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>n = 3</Code>, <Code>x_mean</Code> = 2, <Code>y_mean</Code> = 5.
        </ListItem>
        <ListItem>
          <Code>numerator</Code> = <Code>(-1)(-2) + (0)(0) + (1)(2) = 2 + 0 + 2 = 4</Code>.{" "}
          <Code>denominator</Code> = <Code>1 + 0 + 1 = 2</Code>.
        </ListItem>
        <ListItem>
          <Code>slope</Code> = <Code>4 / 2 = 2.0</Code>. <Code>intercept</Code> = <Code>5 - 2.0 * 2 = 1.0</Code>. The
          function returns <Code>(2.0, 1.0)</Code>.
        </ListItem>
        <ListItem>
          <Code>predict(10, 2.0, 1.0)</Code> is <Code>2.0 * 10 + 1.0 = 21.0</Code>. You just plug the new x
          into the line.
        </ListItem>
      </UnorderedList>
      <Text>
        The function does not loop to "learn" anything. It uses the formula once and gives back
        the answer.
      </Text>

      <Heading as="h3" size="sm">Concept 3: measuring error with mean squared error</Heading>
      <Text>How do you know if a fit (or a baseline) is any good?</Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Suppose you predicted three kids' heights and want to score how far off you were:
      </Text>
      <RunnableExample hints={MSE_HINTS} labId={2} code={`actual =    [86, 101, 114]
predicted = [90, 95, 120]

squared_errors = [(a - p) ** 2 for a, p in zip(actual, predicted)]
mse = sum(squared_errors) / len(squared_errors)
print(mse)  # 29.333...`} />
      <Text>
        For every prediction, subtract the true value, square the difference (so being too high
        and too low both count as "bad," and big misses are punished more than small ones), and
        average all those squared differences. A lower MSE means better predictions.
      </Text>

      <CodeBlock code={`actual =    [52, 58, 65]
predicted = [55, 55, 70]

squared_errors = [(a - p) ** 2 for a, p in zip(actual, predicted)]
mse = sum(squared_errors) / len(squared_errors)
print(mse)  # 14.33`} hints={[
        {
          code: "squared_errors = [",
          text:
            "A **list comprehension** builds a list in one line. Here it builds `squared_errors`, " +
            "which is `[9, 9, 25]`.",
        },
        {
          code: "(a - p) ** 2",
          text: "For each pair, the gap times itself: `52 - 55 = -3` gives 9, `58 - 55 = 3` gives 9, `65 - 70 = -5` gives 25.",
        },
        {
          code: "zip(actual, predicted)",
          text: "Pairs them up: (52, 55), (58, 55), (65, 70).",
        },
        {
          code: "mse = sum(squared_errors) / len(squared_errors)",
          text:
            "**Mean squared error**: the average of the squared gaps. `(9 + 9 + 25) / 3 = 43 / 3`, " +
            "about 14.33.",
        },
      ]} />
      <PracticeCell labId={2} cellId="concept-3" code={`actual =    [52, 58, 65]
predicted = [55, 55, 70]

squared_errors = [(a - p) ** 2 for a, p in zip(actual, predicted)]
mse = sum(squared_errors) / len(squared_errors)
print(mse)  # 14.33`} expectedOutput={`14.333333333333334`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The true scores are 52, 58, 65. The guesses are 55, 55, 70.
        </ListItem>
        <ListItem>
          The gaps are <Code>52 - 55 = -3</Code>, <Code>58 - 55 = 3</Code>, and <Code>65 - 70 = -5</Code>. Squared they are 9, 9 and 25.
        </ListItem>
        <ListItem>
          <Code>mse</Code> = <Code>(9 + 9 + 25) / 3 = 43</Code> / 3 = 14.333...
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>14.333333333333334</Code>. The long tail of digits is
        normal for a division that never ends. Try changing the last guess from 70 to 65. The
        last gap is now 0, so MSE drops to <Code>(9 + 9 + 0) / 3 = 6.0</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: loss, the one number training tries to shrink</Heading>
      <Text>
        Training needs one number that says how wrong the model is. That number is called the
        <b>loss</b>. Training means making it smaller.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          How you add up the misses matters. Squaring each miss makes one big miss count much more
          than a few small ones.
        </ListItem>
        <ListItem>
          LLMs use a different loss, based on how much chance the model gave to the true next word.
          The use is the same: lower loss means a better model.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. <Code>average_miss</Code> adds up the plain size of each miss.
        <Code>squared_loss</Code> adds up the squared misses. Both divide by the number of values.
        Two pretend models guess the same four true values.
      </Text>
      <RunnableExample labId={2} code={`def average_miss(truth, guesses):
    total = 0
    for t, g in zip(truth, guesses):
        total = total + abs(t - g)
    return total / len(truth)


def squared_loss(truth, guesses):
    total = 0
    for t, g in zip(truth, guesses):
        total = total + (t - g) ** 2
    return total / len(truth)


truth = [10, 10, 10, 10]
models = {"small misses": [11, 9, 11, 9], "one big miss": [10, 10, 10, 14]}
for name, guesses in models.items():
    print(name, "-> average miss:", average_miss(truth, guesses), "squared loss:", squared_loss(truth, guesses))`} hints={[
        {
          code: "def average_miss(truth, guesses):",
          block: "function",
          text:
            "The average size of the misses. It adds up how far each guess is from the truth, " +
            "ignoring plus or minus, then divides by how many values there are.",
        },
        {
          code: "def squared_loss(truth, guesses):",
          block: "function",
          text: "Like `average_miss`, but each miss is squared first, so one big miss counts a lot more.",
        },
        {
          code: "for t, g in zip(truth, guesses):",
          block: "for loop",
          text: "Walks the two lists side by side. `t` is the true value and `g` is the guess at the same position.",
        },
        {
          code: "for name, guesses in models.items():",
          block: "for loop",
          text: "Runs once per model. `name` is the dict key and `guesses` is its list. Each round prints both scores.",
        },
        {
          code: "abs(t - g)",
          text: "`abs` drops the minus sign. `abs(10 - 14)` is 4, and `abs(10 - 9)` is 1.",
        },
        {
          code: "(t - g) ** 2",
          text: "The miss times itself. A miss of 4 gives 16, but a miss of 1 gives only 1.",
        },
        {
          code: "total / len(truth)",
          text: "Divides the total by the number of values (4) to get the average.",
        },
        {
          code: "models = {",
          text: "A dict with two pretend models. Each key is a name, and each value is that model's list of guesses.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The true values are all 10. The first model is off by 1 every time. The second is exact
          three times, then off by 4.
        </ListItem>
        <ListItem>
          Both have an average miss of 1.0, so that number cannot tell them apart.
        </ListItem>
        <ListItem>
          Squared loss is 1.0 for the first model and <Code>16 / 4 = 4.0</Code> for the second. It
          punishes the one big miss.
        </ListItem>
        <ListItem>
          Pattern: squaring makes a big miss stand out.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>average_miss</Code> and <Code>squared_loss</Code> from the worked example
          above, exactly as they are.
        </ListItem>
        <ListItem>
          Make <Code>truth = [5, 5, 5, 5, 5]</Code>.
        </ListItem>
        <ListItem>
          Make a dict called <Code>models</Code> with two entries, in this order:{" "}
          <Code>"small misses"</Code> with the list <Code>[6, 4, 6, 4, 5]</Code>, then{" "}
          <Code>"one big miss"</Code> with the list <Code>[5, 5, 5, 5, 9]</Code>.
        </ListItem>
        <ListItem>
          Loop over <Code>models.items()</Code> with <Code>name, guesses</Code> and print{" "}
          <Code>name</Code>, <Code>"-&gt; average miss:"</Code>,{" "}
          <Code>average_miss(truth, guesses)</Code>, <Code>"squared loss:"</Code> and{" "}
          <Code>squared_loss(truth, guesses)</Code> in one <Code>print(...)</Code> call, the same
          layout as the worked example.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={2} cellId="topic-3" withHint code={`def average_miss(truth, guesses):
    total = 0
    for t, g in zip(truth, guesses):
        total = total + abs(t - g)
    return total / len(truth)


def squared_loss(truth, guesses):
    total = 0
    for t, g in zip(truth, guesses):
        total = total + (t - g) ** 2
    return total / len(truth)


truth = [5, 5, 5, 5, 5]
models = {"small misses": [6, 4, 6, 4, 5], "one big miss": [5, 5, 5, 5, 9]}
for name, guesses in models.items():
    print(name, "-> average miss:", average_miss(truth, guesses), "squared loss:", squared_loss(truth, guesses))`} expectedOutput={`small misses -> average miss: 0.8 squared loss: 0.8
one big miss -> average miss: 0.8 squared loss: 3.2`} />
      <Text>
        <b>What you should see:</b> exactly these two lines. If yours differ, check the lists and
        the order of the values in the print.
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
        {`small misses -> average miss: 0.8 squared loss: 0.8
one big miss -> average miss: 0.8 squared loss: 3.2`}
      </Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The true values are all 5. The first model is off by 1, 1, 1, 1 and 0. The average miss is{" "}
          <Code>4 / 5 = 0.8</Code>. Each miss squared is still 1 or 0, so the squared loss is{" "}
          <Code>4 / 5 = 0.8</Code> too.
        </ListItem>
        <ListItem>
          The second model is exact four times and off by 4 once. The average miss is{" "}
          <Code>4 / 5 = 0.8</Code> again, but the squared loss is <Code>16 / 5 = 3.2</Code>.
        </ListItem>
        <ListItem>
          Same average miss, different squared loss. Squaring makes the one big miss stand out.
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>mean_squared_error(y_true, y_pred)</Code> is the loss you use here. The
        project uses it twice, on the same true values. The mean baseline (always about 8.66 words)
        scores an MSE of 1.589. The regression line scores 1.143. The lower number wins. The project
        prints both:
      </Text>
      <Text>
        <Code>Naive baseline (always predict mean=8.66): MSE=1.589</Code> and <Code>Linear
        regression (word_count = 0.108 * char_len + 3.380): MSE=1.143</Code>.
      </Text>
      <Text>
        Take true values <Code>[2, 4]</Code> and two strategies:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The mean baseline always guesses the average, 3.0. The guesses are{" "}
          <Code>[3.0, 3.0]</Code>. The gaps are -1 and 1, squared 1 and 1, so MSE = <Code>2 / 2 = 1.0</Code>.
        </ListItem>
        <ListItem>
          A line that predicts exactly <Code>[2, 4]</Code> has gaps of 0 and 0, so MSE = 0.0.
        </ListItem>
        <ListItem>
          The smaller number wins. In the project, the regression MSE is lower than the baseline
          MSE. That shows the line is learning something real and not just guessing the average.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Concept 4: plotting with matplotlib</Heading>
      <Text>
        Seeing the real data alongside a fitted line makes it obvious, at a glance, whether the
        line is actually capturing the trend.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Say you have a handful of (x, y) points and a line you fit to them, and want to see both
        at once:
      </Text>
      <RunnableExample hints={PLOT_HINTS} labId={2} code={`import matplotlib.pyplot as plt

xs = [2, 4, 6, 8, 10]
ys = [86, 101, 114, 128, 139]

plt.scatter(xs, ys, label="real points")
plt.plot(xs, [6.6 * x + 73.7 for x in xs], color="crimson", label="fit line")
plt.legend()
plt.savefig("fit.png")
plt.show()`} />
      <Text>
        <Code>plt.scatter(xs, ys)</Code> draws one dot per (x, y) pair, while{" "}
        <Code>plt.plot(xs, ys)</Code> connects points with a continuous line - here, the line's y
        values come from plugging each x into the fitted equation rather than from real
        measurements. <Code>label</Code> plus <Code>plt.legend()</Code> adds a key so you can tell
        the two apart.
      </Text>

      <CodeBlock code={`import matplotlib.pyplot as plt

xs = [1, 2, 3, 4, 5]
ys = [52, 58, 65, 71, 78]

plt.scatter(xs, ys, label="real points")
plt.plot(xs, [6.5 * x + 45.3 for x in xs], color="crimson", label="fit line")
plt.legend()
plt.show()
print("plotted", len(xs), "points with a fit line")  # plotted 5 points with a fit line`} hints={[
        {
          code: "import matplotlib.pyplot as plt",
          text: "Loads the plotting toolbox with the short nickname `plt`.",
        },
        {
          code: 'plt.scatter(xs, ys, label="real points")',
          text:
            "Draws 5 dots, one per (hours, score) pair. A **scatter plot** is a chart of separate " +
            "dots. `label` names them for the legend.",
        },
        {
          code: "[6.5 * x + 45.3 for x in xs]",
          text:
            "Builds a new list: for each x it works out `6.5 * x + 45.3`. That gives 51.8, 58.3, " +
            "64.8, 71.3 and 77.8.",
        },
        {
          code: "plt.plot(xs, ",
          text: "Joins those 5 values (the new list) with a line.",
        },
        {
          code: 'color="crimson"',
          text: "Makes the line dark red.",
        },
        {
          code: "plt.legend()",
          text: "Shows a small box that explains the dots and the line.",
        },
        {
          code: "len(xs)",
          text: "Counts the points: 5.",
        },
      ]} />
      <PracticeCell labId={2} cellId="concept-4" code={`import matplotlib.pyplot as plt

xs = [1, 2, 3, 4, 5]
ys = [52, 58, 65, 71, 78]

plt.scatter(xs, ys, label="real points")
plt.plot(xs, [6.5 * x + 45.3 for x in xs], color="crimson", label="fit line")
plt.legend()
plt.show()
print("plotted", len(xs), "points with a fit line")  # plotted 5 points with a fit line`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>xs</Code> are hours studied (1 to 5). <Code>ys</Code> are the real scores (52 to
          78).
        </ListItem>
        <ListItem>
          The scatter call draws 5 dots. The line uses the fit from Concept 2, 6.5 * x + 45.3. At
          x = 1 it gives 51.8. At x = 5 it gives 77.8. Those are close to the real 52 and 78, so
          the line runs right through the dots.
        </ListItem>
        <ListItem>
          <Code>len(xs)</Code> counts the points: 5. The last line prints it.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> a chart with 5 dots, a red line close to all of them, and a
        legend. Under the chart you see{" "}
        <Code>plotted 5 points with a fit line</Code>. Try changing the line to{" "}
        <Code>3 * x + 60</Code>. The red line moves away from the dots, because it is a worse
        fit.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: look at the misses, not only the score</Heading>
      <Text>
        One number like the loss can hide things. Two models can have the same score and fail in
        different places.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          So people also look at single examples, row by row, or at a chart.
        </ListItem>
        <ListItem>
          The points where the model is far off show where it is weak.
        </ListItem>
        <ListItem>
          With an LLM it is the same: read some of its answers, do not trust one score alone.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. <Code>show_misses</Code> loops over the points. For each one it
        prints the real value, the line's guess, the miss, and one <Code>#</Code> mark for each
        whole word of miss. The line is the fit from the project, and the points are pretend
        (characters, words) pairs.
      </Text>
      <RunnableExample labId={2} code={`def line_value(x, slope, intercept):
    return slope * x + intercept


def show_misses(points, slope, intercept):
    for x, y in points:
        guess = line_value(x, slope, intercept)
        miss = abs(y - guess)
        marks = "#" * round(miss)
        line = str(x).rjust(3) + " real " + str(y) + " guess " + str(round(guess, 1)) + " miss " + str(round(miss, 1)) + " " + marks
        print(line.rstrip())


points = [(33, 7), (40, 8), (50, 6), (60, 10)]
show_misses(points, 0.108, 3.38)`} hints={[
        {
          code: "def line_value(x, slope, intercept):",
          block: "function",
          text: "The line's rule: give it an `x`, and it gives back `slope * x + intercept`.",
        },
        {
          code: "def show_misses(points, slope, intercept):",
          block: "function",
          text:
            "Prints one line per point: the real value, the line's guess, the miss, and one `#` " +
            "mark for each whole word of miss.",
        },
        {
          code: "for x, y in points:",
          block: "for loop",
          text: "Takes one point at a time: `x` is the number of characters, `y` the real number of words.",
        },
        {
          code: "abs(y - guess)",
          text: "How far the guess is from the real value, with no minus sign. For 50 characters: `abs(6 - 8.78)`, about 2.8.",
        },
        {
          code: '"#" * round(miss)',
          text: "`*` on text repeats it. A miss of 2.8 rounds to 3, so it gives `###`.",
        },
        {
          code: "str(x).rjust(3)",
          text:
            "`str` turns the number into text. `rjust(3)` adds spaces on the left until it is 3 " +
            "characters wide, so the lines line up.",
        },
        {
          code: "round(guess, 1)",
          text: "Keeps 1 digit after the point: `8.78` becomes `8.8`.",
        },
        {
          code: "line.rstrip()",
          text: "Removes spaces at the end of the line. A point with no marks would otherwise end in a space.",
        },
        {
          code: "show_misses(points, 0.108, 3.38)",
          text: "Runs it with the project's line: slope 0.108 and intercept 3.38.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The guess is <Code>0.108 * x + 3.38</Code>. For 33 characters that is about 6.9 words, and
          the real value is 7.
        </ListItem>
        <ListItem>
          Three of the points miss by less than half a word, so they get no marks.
        </ListItem>
        <ListItem>
          The 50-character sentence has 6 words, but the line guesses 8.8. The miss is 2.8, so it
          gets 3 marks. That point stands out.
        </ListItem>
        <ListItem>
          Pattern: look for the points far from the line.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>line_value</Code> and <Code>show_misses</Code> from the worked example above,
          exactly as they are.
        </ListItem>
        <ListItem>
          Make <Code>points = [(35, 8), (45, 11), (55, 9), (65, 5)]</Code>.
        </ListItem>
        <ListItem>
          Call <Code>show_misses(points, 0.1, 4)</Code>. The slope is <Code>0.1</Code> and the
          intercept is <Code>4</Code>. The function does the printing, so you do not need a{" "}
          <Code>print</Code> of your own.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={2} cellId="topic-4" withHint code={`def line_value(x, slope, intercept):
    return slope * x + intercept


def show_misses(points, slope, intercept):
    for x, y in points:
        guess = line_value(x, slope, intercept)
        miss = abs(y - guess)
        marks = "#" * round(miss)
        line = str(x).rjust(3) + " real " + str(y) + " guess " + str(round(guess, 1)) + " miss " + str(round(miss, 1)) + " " + marks
        print(line.rstrip())


points = [(35, 8), (45, 11), (55, 9), (65, 5)]
show_misses(points, 0.1, 4)`} expectedOutput={` 35 real 8 guess 7.5 miss 0.5
 45 real 11 guess 8.5 miss 2.5 ##
 55 real 9 guess 9.5 miss 0.5
 65 real 5 guess 10.5 miss 5.5 ######`} />
      <Text>
        <b>What you should see:</b> exactly these four lines. If yours differ, check the points
        and the slope and intercept. Each line starts with a space, because the number is padded to
        3 characters.
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
        {` 35 real 8 guess 7.5 miss 0.5
 45 real 11 guess 8.5 miss 2.5 ##
 55 real 9 guess 9.5 miss 0.5
 65 real 5 guess 10.5 miss 5.5 ######`}
      </Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The line is <Code>0.1 * x + 4</Code>. At 35 characters it guesses 7.5 and the real value
          is 8, so the miss is 0.5. At 55 characters it guesses 9.5 and the real value is 9, so the
          miss is 0.5 again. Python rounds 0.5 to 0, so both get no marks.
        </ListItem>
        <ListItem>
          The point at 45 characters guesses 8.5 and the real value is 11. The miss is 2.5. That
          gets 2 marks, because Python rounds an exact half to the nearest even number.
        </ListItem>
        <ListItem>
          The point at 65 characters has 5 words, but the line guesses 10.5. The miss is 5.5, so it
          gets 6 marks. That is the worst point.
        </ListItem>
      </UnorderedList>

      <Text fontSize="sm" color="gray.500">
        Further reading: IBM Think -{" "}
        <Link href="https://www.ibm.com/think/topics/linear-regression" isExternal color="blue.500">
          What is linear regression?
        </Link>
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>project.py</Code> does exactly this with the real review data:{" "}
        <Code>plt.scatter(char_lengths, word_counts, ...)</Code> plots every real sentence as a
        dot (character length vs. word count), <Code>plt.plot(xs, [predict(x, slope, intercept)
        ...])</Code> overlays the regression line through those dots, and{" "}
        <Code>plt.axhline(mean_baseline, ...)</Code> draws a flat dashed line for the naive
        "always predict the mean" baseline. Seeing all three together makes it visually obvious why
        the sloped regression line tracks the real data far better than a single flat guess -
        exactly what the lower MSE number from Concept 3 is telling you numerically.
      </Text>
      <Text>The lab's plotting code, one step at a time:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>char_lengths</Code> is the number of characters in each review sentence. For{" "}
          <Code>"i loved it"</Code> that is 10. <Code>word_count_values</Code> is the number of
          words in it: 3.
        </ListItem>
        <ListItem>
          <Code>mean_baseline</Code> is the average word count over all sentences. Say the counts
          were 3, 5 and 7. The average is 5.0, and the baseline guesses 5.0 for every sentence.
        </ListItem>
        <ListItem>
          <Code>plt.scatter(char_lengths, word_count_values, ...)</Code> draws one dot per
          sentence: how long it is, and how many words it has.
        </ListItem>
        <ListItem>
          <Code>xs = sorted(char_lengths)</Code> puts the lengths in order, so the red line is
          drawn from left to right in one clean sweep.
        </ListItem>
        <ListItem>
          <Code>plt.axhline(mean_baseline, ...)</Code> draws a flat dashed line at height 5.0. A
          flat line says "the same guess for every sentence".
        </ListItem>
      </UnorderedList>
      <Text>
        When you see the chart, check where the dots sit. If they hug the red sloped line, longer
        sentences really do have more words, and the regression guess beats the flat one.
      </Text>

    </VStack>
  );
}
