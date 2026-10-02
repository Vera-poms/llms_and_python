import {
  Code,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab07Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Attention, the short version</Heading>
      <Text>
        Self-attention lets every word in a sequence look at every other word and decide how much
        to "pay attention" to it. For each word, three vectors are derived from its embedding: a{" "}
        <Code>query</Code> (what am I looking for?), a <Code>key</Code> (what do I offer?), and a{" "}
        <Code>value</Code> (what do I actually contribute if attended to?).
      </Text>
      <Text>Scaled dot-product attention:</Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Score every (query, key) pair: <Code>scores = Q @ K.T / sqrt(d_k)</Code>
        </ListItem>
        <ListItem>
          Turn each row into a probability distribution with <Code>softmax</Code> - the exact same
          operation from lab 1, just vectorized
        </ListItem>
        <ListItem>
          Take a weighted average of the value vectors: <Code>output = attention_weights @ V</Code>
        </ListItem>
      </OrderedList>
      <Text>
        That's it - the entire mechanism is one matrix multiply, one softmax, and another matrix
        multiply. The rest of this reading breaks each of those pieces down from scratch, since the
        notebook code leans on them without re-explaining them.
      </Text>

      <Heading size="md">Vectors and matrices are just lists of numbers</Heading>
      <Text>
        A <b>vector</b> is nothing more than an ordered list of numbers, like <Code>[1.0, 0.0]</Code>.
        A <b>matrix</b> is a grid of numbers - think of a spreadsheet where every row is one vector
        stacked on top of the next.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>Here's a small matrix that has nothing to do with language models yet - just a 2x2 grid of numbers:</Text>
      <RunnableExample labId={7} code={`M = [[1.0, 0.0],
     [0.0, 1.0]]`} />
      <Text>
        That's a 2-row, 2-column matrix - row 0 is the vector <Code>[1.0, 0.0]</Code>, row 1 is{" "}
        <Code>[0.0, 1.0]</Code>. In numpy this is exactly <Code>np.array([[1.0, 0.0], [0.0, 1.0]])</Code>.
        It's the same grid-of-numbers idea as a table of prices in a spreadsheet, one row per product.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell for indexing into a small matrix - run it
        before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`grid = [[10, 20], [30, 40]]  # a 2x2 matrix: row 0 and row 1
print(grid[0])  # expected output: [10, 20]
print(grid[1][0])  # expected output: 30`}
      </Code>
      <PracticeCell labId={7} cellId="concept-1" code={`grid = [[10, 20], [30, 40]]  # a 2x2 matrix: row 0 and row 1
print(grid[0])  # expected output: [10, 20]
print(grid[1][0])  # expected output: 30`} expectedOutput={`[10, 20]
30`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In this lab, every word in a sentence gets turned into a vector (its "embedding" - a list of
        numbers that's supposed to capture something about the word's meaning or usage). Stack all of
        a sentence's word-vectors into one matrix and you have <Code>X</Code>, with one row per word.
        <b> Q</b>, <b>K</b>, and <b>V</b> in the code are exactly this: matrices where each row is one
        word's query/key/value vector.
      </Text>

      <Heading size="md">Matrix multiplication: dot products between many vectors at once</Heading>
      <Text>
        Matrix multiplication is built out of a simpler operation, applied many times at once: the{" "}
        <b>dot product</b>.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        A dot product multiplies two vectors element-by-element, then adds up the results:
      </Text>
      <RunnableExample labId={7} code={`a = [1, 2, 3]
b = [4, 5, 6]
dot = a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
# dot == 32`} />
      <Text>
        It's a single number that measures how "aligned" two vectors are - two vectors pointing in a
        similar direction produce a large dot product; unrelated vectors produce something close to
        zero. Matrix multiplication just does this dot-product computation for every row of one
        matrix against every column of another, all at once. If <Code>A</Code> has shape (rows=3,
        cols=2) and <Code>B</Code> has shape (rows=2, cols=4), then <Code>A @ B</Code> has shape (3, 4):
        entry <Code>(i, j)</Code> of the result is the dot product of row <Code>i</Code> of{" "}
        <Code>A</Code> with column <Code>j</Code> of <Code>B</Code>. Picture two spreadsheets side by
        side - for every row in the left sheet and every column in the right sheet, you multiply
        matching cells and sum them into one output cell.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell computing a dot product by hand - run it
        before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`prices = [2, 5, 1]
quantities = [3, 2, 4]
total = sum(p * q for p, q in zip(prices, quantities))
print(total)  # expected output: 20`}
      </Code>
      <PracticeCell labId={7} cellId="concept-2" code={`prices = [2, 5, 1]
quantities = [3, 2, 4]
total = sum(p * q for p, q in zip(prices, quantities))
print(total)  # expected output: 20`} expectedOutput={`20`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This is exactly what <Code>scores = Q @ K.T</Code> does in{" "}
        <Code>scaled_dot_product_attention</Code>. <Code>K.T</Code> ("K transposed") flips the key
        matrix so its rows become columns. The result: for every query row and every key row, one
        dot-product score describing how relevant that key is to that query - computed for the entire
        sentence in a single matrix multiply, instead of writing a loop over every pair of words. The
        division by <Code>sqrt(d_k)</Code> just keeps those scores from growing huge as the vectors
        get longer, so the next step (softmax) behaves well numerically.
      </Text>

      <Heading size="md">Softmax: turning raw scores into a probability distribution</Heading>
      <Text>Softmax turns a list of raw scores into a list of percentages that add up to 100%.</Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Suppose you have three raw scores: <Code>[2.0, 1.0, 0.1]</Code>. You'd like to turn them into
        percentages that sum to 1.0, where a bigger score gets a bigger share. Softmax does exactly
        this: exponentiate every value (so everything becomes positive, and bigger numbers grow
        disproportionately larger), then divide each by the total:
      </Text>
      <RunnableExample labId={7} code={`import math

scores = [2.0, 1.0, 0.1]
exp_scores = [math.exp(s) for s in scores]  # [7.39, 2.72, 1.11]
total = sum(exp_scores)                     # 11.22
softmax = [e / total for e in exp_scores]   # [0.66, 0.24, 0.10]
print([round(e, 2) for e in exp_scores])
print(round(total, 2))
print([round(s, 2) for s in softmax])`} />
      <Text>
        Those three outputs sum to 1.0 and are all positive - a genuine probability distribution.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell running softmax on a different set of
        scores - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`import numpy as np

scores = np.array([3.0, 1.0, 0.0])
exp_scores = np.exp(scores - scores.max())
probs = exp_scores / exp_scores.sum()
print(np.round(probs, 2))  # expected output: [0.84 0.11 0.04]`}
      </Code>
      <PracticeCell labId={7} cellId="concept-3" code={`import numpy as np

scores = np.array([3.0, 1.0, 0.0])
exp_scores = np.exp(scores - scores.max())
probs = exp_scores / exp_scores.sum()
print(np.round(probs, 2))  # expected output: [0.84 0.11 0.04]`} expectedOutput={`[0.84 0.11 0.04]`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This is the same operation from lab 1's <Code>word_probabilities</Code>, just applied to
        attention scores instead of word counts, and vectorized with numpy so it works on a whole row
        (or a whole matrix of rows) at once via <Code>axis=-1</Code>. In the notebook's{" "}
        <Code>softmax</Code>, subtracting the row max before exponentiating is a stability trick - it
        doesn't change the final probabilities (since it cancels out in the division), but it keeps{" "}
        <Code>exp()</Code> from overflowing on large scores. In attention, softmax is what turns raw{" "}
        <Code>Q @ K.T</Code> scores into <Code>attention_weights</Code>: for each word (each row), a
        distribution over "how much should I listen to every other word," always summing to 1. That's
        why the notebook's assertion <Code>weights.sum(axis=-1) == 1.0</Code> has to hold - it's the
        defining property of softmax.
      </Text>

      <Heading size="md">Why numpy instead of plain Python lists</Heading>
      <Text>
        You could represent a matrix as a list of lists in plain Python, but doing math on it means
        writing explicit loops: looping over rows, looping over columns, summing products by hand.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <RunnableExample labId={7} code={`a = [[1, 2], [3, 4]]
b = [[5, 6], [7, 8]]

# manual loop, element by element
result = [[0, 0], [0, 0]]
for i in range(2):
    for j in range(2):
        result[i][j] = a[i][j] + b[i][j]

# numpy: no loop needed
import numpy as np
result = np.array(a) + np.array(b)`} />
      <Text>
        Numpy's <Code>np.array</Code> gives you two things plain lists of lists don't:{" "}
        <b>vectorized operations</b> (add, multiply, or matrix-multiply an entire array at once, in
        fast compiled code, instead of a Python-level loop over every element) and{" "}
        <b>broadcasting and axis control</b> (operations can apply along a chosen dimension - rows vs.
        columns - without you writing the loop that decides which).
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 4 practice" cell comparing a manual loop to a vectorized
        numpy operation - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`import numpy as np

a = [1, 2, 3]
b = [10, 20, 30]

# manual loop, element by element
manual = [a[i] + b[i] for i in range(len(a))]

# numpy: no loop needed
vectorized = np.array(a) + np.array(b)
print(manual, list(vectorized))  # expected output: [11, 22, 33] [11, 22, 33]`}
      </Code>
      <PracticeCell labId={7} cellId="concept-4" code={`import numpy as np

a = [1, 2, 3]
b = [10, 20, 30]

# manual loop, element by element
manual = [a[i] + b[i] for i in range(len(a))]

# numpy: no loop needed
vectorized = np.array(a) + np.array(b)
print(manual, list(vectorized))  # expected output: [11, 22, 33] [11, 22, 33]`} expectedOutput={`[11, 22, 33] [np.int64(11), np.int64(22), np.int64(33)]`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>softmax</Code> and <Code>scaled_dot_product_attention</Code> lean on exactly those two
        things:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <b>Vectorized operations</b> - <Code>Q @ K.T</Code>, <Code>x.max(axis=-1)</Code>, and{" "}
          <Code>exp / sum</Code> all operate on the whole array at once, in fast compiled code,
          instead of a Python-level loop over every element.
        </ListItem>
        <ListItem>
          <b>Broadcasting and axis control</b> - <Code>keepdims=True</Code> and <Code>axis=-1</Code>{" "}
          let <Code>softmax</Code> work identically whether <Code>x</Code> is a single row of scores
          or a whole matrix of them (one row per word), without changing the code.
        </ListItem>
      </UnorderedList>
      <Text>
        This is why the entire attention mechanism - two matrix multiplies and a softmax - fits in
        about five lines: numpy is doing the heavy lifting that would otherwise be nested loops.
      </Text>

      <Heading size="md">Deep dive: visualizing a matrix with matplotlib</Heading>
      <Text>
        A matrix of numbers is hard to read at a glance - a colored grid, where color stands in for
        value, is much easier to scan.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Here's a small, non-LLM example: a mock grid of exam scores, one row per student, one column
        per subject, turned into a heatmap with <Code>plt.imshow</Code>:
      </Text>
      <RunnableExample labId={7} code={`import matplotlib.pyplot as plt

scores = [[92, 78, 85],
          [60, 88, 74],
          [95, 91, 89]]

plt.imshow(scores, cmap="viridis")
plt.colorbar(label="score")
plt.xticks(range(3), ["math", "history", "art"])
plt.yticks(range(3), ["Ana", "Ben", "Cy"])
plt.show()`} />
      <Text>
        <Code>plt.imshow</Code> takes any 2D grid of numbers and paints each cell a color based on its
        value - here, brighter colors for higher exam scores. <Code>plt.colorbar</Code> adds the
        legend mapping color to value, and the <Code>xticks</Code>/<Code>yticks</Code> calls label the
        rows and columns so the grid reads like a table instead of an anonymous block of color.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 5 practice" cell plotting a different toy grid as a heatmap -
        run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`rainfall = [[5, 2, 8], [1, 9, 3]]
plt.imshow(rainfall, cmap="Blues")
plt.colorbar(label="mm")
plt.xticks(range(3), ["Jan", "Feb", "Mar"])
plt.yticks(range(2), ["CityA", "CityB"])
plt.title("Monthly rainfall")
plt.show()
print("plotted a 2x3 rainfall grid")  # expected output: plotted a 2x3 rainfall grid`}
      </Code>
      <PracticeCell labId={7} cellId="concept-5" code={`rainfall = [[5, 2, 8], [1, 9, 3]]
plt.imshow(rainfall, cmap="Blues")
plt.colorbar(label="mm")
plt.xticks(range(3), ["Jan", "Feb", "Mar"])
plt.yticks(range(2), ["CityA", "CityB"])
plt.title("Monthly rainfall")
plt.show()
print("plotted a 2x3 rainfall grid")  # expected output: plotted a 2x3 rainfall grid`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The notebook does exactly this with <Code>attn_weights</Code>, the matrix{" "}
        <Code>scaled_dot_product_attention</Code> returns: <Code>plt.imshow(attn_weights, cmap="magma")</Code>{" "}
        plots it as a heatmap, with <Code>plt.xticks</Code> and <Code>plt.yticks</Code> labeling both
        axes with the actual words of the sentence instead of student names and subjects. Row{" "}
        <Code>i</Code>, column <Code>j</Code> of that heatmap shows how much word <Code>i</Code> attends
        to word <Code>j</Code> - a bright cell means "this word is paying a lot of attention to that
        word," which is the same softmax-produced probability distribution described above, just made
        visible instead of read as raw numbers.
      </Text>

      <Heading size="sm">Notebook</Heading>
      <Text>
        Open <Code>course/notebooks/lab_07_attention.ipynb</Code>. Implement <Code>softmax</Code>{" "}
        and <Code>scaled_dot_product_attention</Code> with plain numpy, then the project reuses
        lab 3's bigram table (re-derived here) as toy word embeddings and runs real tokenized
        review sentences through attention, plotting a word-by-word attention heatmap.
      </Text>

      <Heading size="sm">Further reading</Heading>
      <Text>
        IBM Think:{" "}
        <Link href="https://www.ibm.com/think/topics/self-attention" isExternal color="blue.500">
          What is self-attention?
        </Link>
      </Text>
    </VStack>
  );
}
