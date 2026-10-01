import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab02Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Two kinds of "simple prediction"</Heading>
      <Text>
        Lab 1 gave you a probability distribution over discrete outcomes (words). Sometimes what
        you want to predict is continuous instead - a number, not a category. This lab contrasts
        the two: a frequency-based guess (predict whichever outcome you've seen most) and linear
        regression (predict a number from another number using a straight-line fit).
      </Text>

      <Heading size="sm">Concept 1: a frequency baseline</Heading>
      <Text>
        The simplest possible prediction strategy is "guess whatever you've seen most often."
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>Say you're guessing whether a coin is fair by looking at past flips:</Text>
      <RunnableExample labId={2} code={`flips = ["heads", "tails", "heads", "heads", "tails", "heads"]

counts: dict[str, int] = {}
for flip in flips:
    counts[flip] = counts.get(flip, 0) + 1

best_guess = max(counts, key=lambda outcome: counts[outcome])
print(best_guess)  # 'heads'`} />
      <Text>
        <Code>max(iterable, key=...)</Code> walks every key in <Code>counts</Code> and returns the
        one for which <Code>key(item)</Code> is largest - here, the outcome with the highest tally.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell guessing the most common weather
        outcome the same way - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`weather = ["sunny", "rainy", "sunny", "cloudy", "sunny", "rainy"]

counts: dict[str, int] = {}
for day in weather:
    counts[day] = counts.get(day, 0) + 1

best_guess = max(counts, key=lambda outcome: counts[outcome])
print(best_guess)  # 'sunny'`}
      </Code>
      <PracticeCell labId={2} cellId="concept-1" code={`weather = ["sunny", "rainy", "sunny", "cloudy", "sunny", "rainy"]

counts: dict[str, int] = {}
for day in weather:
    counts[day] = counts.get(day, 0) + 1

best_guess = max(counts, key=lambda outcome: counts[outcome])
print(best_guess)  # 'sunny'`} expectedOutput={`sunny`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>most_common_label</Code> is this exact pattern applied to a list of 0/1
        labels: it's the "dumbest possible baseline" you always compare a smarter model against, to
        make sure the smarter model is actually earning its complexity.
      </Text>

      <Heading size="sm">Concept 2: fitting a straight line (linear regression)</Heading>
      <Text>
        Linear regression finds the straight line <Code>y = slope * x + intercept</Code> that best
        fits a set of (x, y) points. "Best" means minimizing the total squared vertical distance
        between the line and every real point (the "least-squares" fit).
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
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
print(slope, intercept)  # roughly 6.6, 73.7 - predict height ≈ 6.6*age + 73.7`} />
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell fitting a line to study hours vs.
        exam scores - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`hours =  [1, 2, 3, 4, 5]
scores = [52, 58, 65, 71, 78]

n = len(hours)
x_mean = sum(hours) / n
y_mean = sum(scores) / n

numerator = sum((x - x_mean) * (y - y_mean) for x, y in zip(hours, scores))
denominator = sum((x - x_mean) ** 2 for x in hours)

slope = numerator / denominator
intercept = y_mean - slope * x_mean
print(round(slope, 2), round(intercept, 2))  # 6.5, 45.3 - predict score ~= 6.5*hours + 45.3`}
      </Code>
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

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This closed-form formula is exactly what the lab's <Code>linear_regression_fit</Code>{" "}
        implements. Once you have <Code>slope</Code> and <Code>intercept</Code>,{" "}
        <Code>predict(x, slope, intercept)</Code> just plugs a new x into the line equation - no
        training loop, no iteration, just algebra. This closed form only works because the model is
        a single straight line. Later labs (4-5) predict things a straight line can't capture, so
        they switch to iterative training loops instead - but the goal is identical: minimize the
        error between predictions and reality.
      </Text>

      <Heading size="sm">Concept 3: measuring error with mean squared error</Heading>
      <Text>How do you know if a fit (or a baseline) is any good?</Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Suppose you predicted three kids' heights and want to score how far off you were:
      </Text>
      <RunnableExample labId={2} code={`actual =    [86, 101, 114]
predicted = [90, 95, 120]

squared_errors = [(a - p) ** 2 for a, p in zip(actual, predicted)]
mse = sum(squared_errors) / len(squared_errors)
print(mse)  # 28.67`} />
      <Text>
        For every prediction, subtract the true value, square the difference (so being too high
        and too low both count as "bad," and big misses are punished more than small ones), and
        average all those squared differences. A lower MSE means better predictions.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell scoring a different set of
        predictions with MSE - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`actual =    [52, 58, 65]
predicted = [55, 55, 70]

squared_errors = [(a - p) ** 2 for a, p in zip(actual, predicted)]
mse = sum(squared_errors) / len(squared_errors)
print(mse)  # 14.33`}
      </Code>
      <PracticeCell labId={2} cellId="concept-3" code={`actual =    [52, 58, 65]
predicted = [55, 55, 70]

squared_errors = [(a - p) ** 2 for a, p in zip(actual, predicted)]
mse = sum(squared_errors) / len(squared_errors)
print(mse)  # 14.33`} expectedOutput={`14.333333333333334`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>mean_squared_error</Code> is precisely this computation, applied to whatever
        predictions and true values you hand it. This is exactly how the project compares the
        naive mean-baseline against the regression fit - same metric, two different prediction
        strategies.
      </Text>

      <Heading size="sm">Concept 4: plotting with matplotlib</Heading>
      <Text>
        Seeing the real data alongside a fitted line makes it obvious, at a glance, whether the
        line is actually capturing the trend.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Say you have a handful of (x, y) points and a line you fit to them, and want to see both
        at once:
      </Text>
      <RunnableExample labId={2} code={`import matplotlib.pyplot as plt

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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 4 practice" cell plotting the study-hours fit line the
        same way - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`import matplotlib.pyplot as plt

xs = [1, 2, 3, 4, 5]
ys = [52, 58, 65, 71, 78]

plt.scatter(xs, ys, label="real points")
plt.plot(xs, [6.5 * x + 45.3 for x in xs], color="crimson", label="fit line")
plt.legend()
plt.show()
print("plotted", len(xs), "points with a fit line")  # plotted 5 points with a fit line`}
      </Code>
      <PracticeCell labId={2} cellId="concept-4" code={`import matplotlib.pyplot as plt

xs = [1, 2, 3, 4, 5]
ys = [52, 58, 65, 71, 78]

plt.scatter(xs, ys, label="real points")
plt.plot(xs, [6.5 * x + 45.3 for x in xs], color="crimson", label="fit line")
plt.legend()
plt.show()
print("plotted", len(xs), "points with a fit line")  # plotted 5 points with a fit line`} />

      <Text fontSize="sm" color="gray.500">
        Further reading: IBM Think -{" "}
        <Link href="https://www.ibm.com/think/topics/linear-regression" isExternal color="blue.500">
          What is linear regression?
        </Link>
      </Text>

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
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

    </VStack>
  );
}
