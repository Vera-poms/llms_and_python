import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

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
      <Text>Here is what each line of that example does, with the real numbers:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>counts</Code> starts empty. The loop looks at each flip. After the six flips it
          holds <Code>{"{'heads': 4, 'tails': 2}"}</Code>. (It counts the same way as Lab 1: get
          the old count, or 0, and add 1.)
        </ListItem>
        <ListItem>
          <Code>lambda outcome: counts[outcome]</Code> is a tiny function with no name. You give
          it an outcome, and it gives back that outcome's count. <Code>max</Code> uses it as a
          score card.
        </ListItem>
        <ListItem>
          <Code>max</Code> checks <Code>"heads"</Code> (score 4) and <Code>"tails"</Code> (score
          2). The biggest score is 4, so it returns <Code>"heads"</Code>.
        </ListItem>
        <ListItem>
          A <b>baseline</b> is a simple guess that you use to compare better models against. Here
          the baseline is "always say heads". It is right 4 times out of 6.
        </ListItem>
      </UnorderedList>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell guessing the most common weather
        outcome the same way - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          <Code>weather</Code> is a list of 6 days: sunny 3 times, rainy 2 times, cloudy 1 time.
        </ListItem>
        <ListItem>
          The loop builds <Code>counts</Code>:{" "}
          <Code>{"{'sunny': 3, 'rainy': 2, 'cloudy': 1}"}</Code>. 3 + 2 + 1 = 6, so every day is
          counted.
        </ListItem>
        <ListItem>
          <Code>max</Code> looks at the three scores (3, 2, 1) and picks the biggest. That is{" "}
          <Code>"sunny"</Code>.
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> one line, <Code>sunny</Code>. Try adding two more{" "}
        <Code>"rainy"</Code> to the list. Rainy now has 4, so the answer changes to{" "}
        <Code>rainy</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>most_common_label</Code> is this exact pattern applied to a list of 0/1
        labels: it's the "dumbest possible baseline" you always compare a smarter model against, to
        make sure the smarter model is actually earning its complexity.
      </Text>
      <Text>
        Here is the lab's real code. It is the same as the weather cell, but the keys are the
        numbers 0 and 1:
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`def most_common_label(labels):
    counts = {}
    for label in labels:
        counts[label] = counts.get(label, 0) + 1
    return max(counts, key=lambda label: counts[label])`}
      </Code>
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
      <Text>
        Some words first. The <b>mean</b> is the average. The <b>slope</b> says how much y goes up
        when x goes up by 1. The <b>intercept</b> is the height of the line when x is 0. Now the
        example with the real numbers:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>n = 5</Code> children. <Code>x_mean</Code> = (2 + 4 + 6 + 8 + 10) / 5 = 6.{" "}
          <Code>y_mean</Code> = (86 + 101 + 114 + 128 + 139) / 5 = 568 / 5 = 113.6.
        </ListItem>
        <ListItem>
          For each child, <Code>x - x_mean</Code> is how far the age is from 6: -4, -2, 0, 2, 4.{" "}
          <Code>y - y_mean</Code> is how far the height is from 113.6: -27.6, -12.6, 0.4, 14.4,
          25.4.
        </ListItem>
        <ListItem>
          <Code>numerator</Code> multiplies each pair and adds: 110.4 + 25.2 + 0 + 28.8 + 101.6 =
          266. <Code>zip</Code> is what walks the two lists together, one pair at a time.
        </ListItem>
        <ListItem>
          <Code>denominator</Code> squares the age gaps and adds: 16 + 4 + 0 + 4 + 16 = 40.{" "}
          <Code>** 2</Code> means "to the power of 2", so "times itself".
        </ListItem>
        <ListItem>
          <Code>slope</Code> = 266 / 40 = 6.65. <Code>intercept</Code> = 113.6 - 6.65 * 6 =
          73.7. So the line says: height = 6.65 * age + 73.7. (The comment in the code rounds the
          slope to about 6.6.)
        </ListItem>
      </UnorderedList>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell fitting a line to study hours vs.
        exam scores - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          5 students studied 1 to 5 hours and got scores 52, 58, 65, 71, 78.
        </ListItem>
        <ListItem>
          <Code>x_mean</Code> = 15 / 5 = 3. <Code>y_mean</Code> = 324 / 5 = 64.8.
        </ListItem>
        <ListItem>
          Hour gaps from 3: -2, -1, 0, 1, 2. Score gaps from 64.8: -12.8, -6.8, 0.2, 6.2, 13.2.
        </ListItem>
        <ListItem>
          <Code>numerator</Code> = 25.6 + 6.8 + 0 + 6.2 + 26.4 = 65. <Code>denominator</Code> = 4
          + 1 + 0 + 1 + 4 = 10.
        </ListItem>
        <ListItem>
          <Code>slope</Code> = 65 / 10 = 6.5. <Code>intercept</Code> = 64.8 - 6.5 * 3 = 45.3.{" "}
          <Code>round(..., 2)</Code> keeps 2 numbers after the decimal point.
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> <Code>6.5 45.3</Code>. It means each extra hour of study adds
        about 6.5 points, and a student with 0 hours would get about 45.3. Try changing the last
        score from 78 to 90 and run it again. The slope should go up.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This closed-form formula is exactly what the lab's <Code>linear_regression_fit</Code>{" "}
        implements. Once you have <Code>slope</Code> and <Code>intercept</Code>,{" "}
        <Code>predict(x, slope, intercept)</Code> just plugs a new x into the line equation - no
        training loop, no iteration, just algebra. This closed form only works because the model is
        a single straight line. Later labs (4-5) predict things a straight line can't capture, so
        they switch to iterative training loops instead - but the goal is identical: minimize the
        error between predictions and reality.
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
          <Code>numerator</Code> = (-1)(-2) + (0)(0) + (1)(2) = 2 + 0 + 2 = 4.{" "}
          <Code>denominator</Code> = 1 + 0 + 1 = 2.
        </ListItem>
        <ListItem>
          <Code>slope</Code> = 4 / 2 = 2.0. <Code>intercept</Code> = 5 - 2.0 * 2 = 1.0. The
          function returns <Code>(2.0, 1.0)</Code>.
        </ListItem>
        <ListItem>
          <Code>predict(10, 2.0, 1.0)</Code> is 2.0 * 10 + 1.0 = 21.0. You just plug the new x
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
      <RunnableExample labId={2} code={`actual =    [86, 101, 114]
predicted = [90, 95, 120]

squared_errors = [(a - p) ** 2 for a, p in zip(actual, predicted)]
mse = sum(squared_errors) / len(squared_errors)
print(mse)  # 29.333...`} />
      <Text>
        For every prediction, subtract the true value, square the difference (so being too high
        and too low both count as "bad," and big misses are punished more than small ones), and
        average all those squared differences. A lower MSE means better predictions.
      </Text>
      <Text>
        Here is what each line does. (MSE is short for <b>mean squared error</b>.) A list
        comprehension is a short way to build a list in one line:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>zip(actual, predicted)</Code> pairs them up: (86, 90), (101, 95), (114, 120).
        </ListItem>
        <ListItem>
          <Code>(a - p) ** 2</Code> for each pair: (86 - 90) = -4, squared is 16. (101 - 95) = 6,
          squared is 36. (114 - 120) = -6, squared is 36. So{" "}
          <Code>squared_errors</Code> is <Code>[16, 36, 36]</Code>.
        </ListItem>
        <ListItem>
          <Code>mse</Code> = (16 + 36 + 36) / 3 = 88 / 3, which is about 29.33.
        </ListItem>
        <ListItem>
          Squaring makes -4 and 4 both become 16, so a miss in either direction counts the same.
          It also makes one big miss hurt more than two small ones.
        </ListItem>
      </UnorderedList>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell scoring a different set of
        predictions with MSE - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          The true scores are 52, 58, 65. The guesses are 55, 55, 70.
        </ListItem>
        <ListItem>
          The gaps are 52 - 55 = -3, 58 - 55 = 3, and 65 - 70 = -5. Squared they are 9, 9 and 25.
        </ListItem>
        <ListItem>
          <Code>mse</Code> = (9 + 9 + 25) / 3 = 43 / 3 = 14.333...
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> <Code>14.333333333333334</Code>. The long tail of digits is
        normal for a division that never ends. Try changing the last guess from 70 to 65. The
        last gap is now 0, so MSE drops to (9 + 9 + 0) / 3 = 6.0.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>mean_squared_error</Code> is precisely this computation, applied to whatever
        predictions and true values you hand it. This is exactly how the project compares the
        naive mean-baseline against the regression fit - same metric, two different prediction
        strategies.
      </Text>
      <Text>
        Take true values <Code>[2, 4]</Code> and two strategies:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The mean baseline always guesses the average, 3.0. The guesses are{" "}
          <Code>[3.0, 3.0]</Code>. The gaps are -1 and 1, squared 1 and 1, so MSE = 2 / 2 = 1.0.
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
      <Text>Here is what each line does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>xs</Code> are the ages and <Code>ys</Code> are the real heights. Five points in
          all.
        </ListItem>
        <ListItem>
          <Code>plt.scatter(xs, ys, label="real points")</Code> puts 5 dots on the chart. A{" "}
          <b>scatter plot</b> is a chart of separate dots. Nothing joins them.
        </ListItem>
        <ListItem>
          <Code>[6.6 * x + 73.7 for x in xs]</Code> builds a new list. For age 2 it gives 6.6 * 2
          + 73.7 = 86.9. For age 10 it gives 139.7. The other ages fall in between.
        </ListItem>
        <ListItem>
          <Code>plt.plot(xs, those_values, ...)</Code> joins those 5 values with a line.{" "}
          <Code>color="crimson"</Code> makes it dark red.
        </ListItem>
        <ListItem>
          <Code>plt.legend()</Code> shows a small box that explains the dots and the line.
        </ListItem>
      </UnorderedList>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 4 practice" cell plotting the study-hours fit line the
        same way - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
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
      <Text fontSize="sm">
        <b>What you should see:</b> a chart with 5 dots, a red line close to all of them, and a
        legend. Under the chart you see{" "}
        <Code>plotted 5 points with a fit line</Code>. Try changing the line to{" "}
        <Code>3 * x + 60</Code>. The red line moves away from the dots, because it is a worse
        fit.
      </Text>

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
