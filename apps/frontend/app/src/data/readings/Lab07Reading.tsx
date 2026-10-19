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
      <Heading as="h2" size="md">Attention, the short version</Heading>
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

      <Heading as="h2" size="md">Vectors and matrices are just lists of numbers</Heading>
      <Text>
        A <b>vector</b> is nothing more than an ordered list of numbers, like <Code>[1.0, 0.0]</Code>.
        A <b>matrix</b> is a grid of numbers - think of a spreadsheet where every row is one vector
        stacked on top of the next.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>Here's a small matrix that has nothing to do with language models yet - just a 2x2 grid of numbers:</Text>
      <RunnableExample labId={7} code={`M = [[1.0, 0.0],
     [0.0, 1.0]]`} />
      <Text>
        That's a 2-row, 2-column matrix - row 0 is the vector <Code>[1.0, 0.0]</Code>, row 1 is{" "}
        <Code>[0.0, 1.0]</Code>. In numpy this is exactly <Code>np.array([[1.0, 0.0], [0.0, 1.0]])</Code>.
        It's the same grid-of-numbers idea as a table of prices in a spreadsheet, one row per product.
      </Text>
      <Text>Here is how to read it:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A matrix in plain Python is a list of lists. The outer list holds the rows. Each inner
          list is one row.
        </ListItem>
        <ListItem>
          <Code>M[0]</Code> is the first row, <Code>[1.0, 0.0]</Code>. Counting starts at 0, so the
          first row is number 0 and the second row is number 1.
        </ListItem>
        <ListItem>
          <Code>M[1][0]</Code> means "take row 1, then take item 0 of it". That is{" "}
          <Code>0.0</Code>. The first number picks the row. The second number picks the column.
        </ListItem>
        <ListItem>
          The "shape" of this matrix is (2, 2): 2 rows and 2 columns. This particular grid has 1.0
          on the diagonal and 0.0 elsewhere. It is called the identity matrix.
        </ListItem>
      </UnorderedList>

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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          <Code>grid</Code> has two rows: <Code>[10, 20]</Code> is row 0 and <Code>[30, 40]</Code>{" "}
          is row 1.
        </ListItem>
        <ListItem>
          <Code>grid[0]</Code> gives the whole first row, so the first print shows{" "}
          <Code>[10, 20]</Code>.
        </ListItem>
        <ListItem>
          <Code>grid[1][0]</Code> first takes row 1, which is <Code>[30, 40]</Code>. Then it takes
          item 0 of that row, which is 30.
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> two lines, <Code>[10, 20]</Code> and then <Code>30</Code>. Try
        printing <Code>grid[0][1]</Code>. You should see <Code>20</Code>. That is row 0, item 1.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In this lab, every word in a sentence gets turned into a vector (its "embedding" - a list of
        numbers that's supposed to capture something about the word's meaning or usage). Stack all of
        a sentence's word-vectors into one matrix and you have <Code>X</Code>, with one row per word.
        <b> Q</b>, <b>K</b>, and <b>V</b> in the code are exactly this: matrices where each row is one
        word's query/key/value vector.
      </Text>
      <Text>
        Here is a tiny picture. Say a sentence has two words, and each word is described by three
        numbers. Then <Code>X = [[1.0, 0.0, 2.0], [0.0, 1.0, 1.0]]</Code>. Row 0 is the first
        word and row 1 is the second word. The shape is (2, 3): 2 words and 3 numbers each.
      </Text>
      <Text>
        In the notebook's project, the sentence is "the acting was superb and the story was
        touching". It has 9 words, and each word gets 16 numbers. So <Code>X</Code> has shape (9,
        16), built with <Code>np.stack([embeddings[w] for w in words])</Code>. That line looks up
        each word's 16 numbers and stacks the 9 rows into one grid. Later, <Code>X</Code> is passed
        in as <Code>Q</Code>, <Code>K</Code> and <Code>V</Code> at the same time. That is a
        simplification, and a real model learns a different version for each.
      </Text>

      <Heading as="h2" size="md">Matrix multiplication: dot products between many vectors at once</Heading>
      <Text>
        Matrix multiplication is built out of a simpler operation, applied many times at once: the{" "}
        <b>dot product</b>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
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
      <Text>Here is the dot product from that example, one step at a time:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>a[0]*b[0]</Code> is 1 * 4 = 4.
        </ListItem>
        <ListItem>
          <Code>a[1]*b[1]</Code> is 2 * 5 = 10.
        </ListItem>
        <ListItem>
          <Code>a[2]*b[2]</Code> is 3 * 6 = 18. Adding them: 4 + 10 + 18 = 32.
        </ListItem>
        <ListItem>
          The example has no <Code>print</Code>, so the <Code>dot == 32</Code> comment is there to
          tell you the answer.
        </ListItem>
      </UnorderedList>

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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          Think of a shopping list. <Code>prices</Code> says the three items cost 2, 5 and 1.{" "}
          <Code>quantities</Code> says you buy 3, 2 and 4 of them.
        </ListItem>
        <ListItem>
          <Code>zip(prices, quantities)</Code> pairs them up: (2, 3), (5, 2) and (1, 4).
        </ListItem>
        <ListItem>
          <Code>p * q for p, q in ...</Code> multiplies each pair: 6, 10 and 4.{" "}
          <Code>sum(...)</Code> adds them: 6 + 10 + 4 = 20. That is the total bill, and it is a dot
          product.
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> <Code>20</Code>. Try changing the last quantity from 4 to 0. You
        should see <Code>16</Code>, because the 4 from the last pair disappears.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This is exactly what <Code>scores = Q @ K.T</Code> does in{" "}
        <Code>scaled_dot_product_attention</Code>. <Code>K.T</Code> ("K transposed") flips the key
        matrix so its rows become columns. The result: for every query row and every key row, one
        dot-product score describing how relevant that key is to that query - computed for the entire
        sentence in a single matrix multiply, instead of writing a loop over every pair of words. The
        division by <Code>sqrt(d_k)</Code> just keeps those scores from growing huge as the vectors
        get longer, so the next step (softmax) behaves well numerically.
      </Text>
      <Text>
        Here is that line on the lab's small check. Say <Code>Q = [[1, 0], [0, 1]]</Code> and{" "}
        <Code>K = [[1, 0], [0, 1]]</Code>. Each has 2 rows (2 words) and 2 columns.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>d_k = Q.shape[-1]</Code> is 2. It is the number of columns, which is how long each
          query or key is.
        </ListItem>
        <ListItem>
          <Code>K.T</Code> swaps rows and columns. This <Code>K</Code> is its own flip, so it does
          not change here.
        </ListItem>
        <ListItem>
          <Code>Q @ K.T</Code>: query 0 with key 0 is 1 * 1 + 0 * 0 = 1. Query 0 with key 1 is 1 *
          0 + 0 * 1 = 0. Query 1 gives 0 and 1. So the scores are <Code>[[1, 0], [0, 1]]</Code>.
        </ListItem>
        <ListItem>
          Divide by <Code>sqrt(2)</Code>, about 1.414: the scores become about 0.707 and 0.
        </ListItem>
      </UnorderedList>

      <Heading as="h2" size="md">Softmax: turning raw scores into a probability distribution</Heading>
      <Text>Softmax turns a list of raw scores into a list of percentages that add up to 100%.</Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
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
      <Text>Here are the steps with the real numbers:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>math.exp(s)</Code> means e to the power s, where e is about 2.718. It makes every
          number positive. exp(2.0) is about 7.39, exp(1.0) is about 2.72 and exp(0.1) is about
          1.11.
        </ListItem>
        <ListItem>
          <Code>total</Code> adds them: 7.39 + 2.72 + 1.11 is about 11.2. The comment says 11.22
          because it adds the rounded numbers. The exact total rounds to 11.21.
        </ListItem>
        <ListItem>
          Each one is divided by the total: 7.39 / 11.2 is about 0.66, 2.72 / 11.2 is about 0.24
          and 1.11 / 11.2 is about 0.10. The biggest score (2.0) gets the biggest share.
        </ListItem>
        <ListItem>
          <Code>round(x, 2)</Code> just cuts a number to 2 digits after the point, so the print is
          easy to read.
        </ListItem>
      </UnorderedList>

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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          <Code>np.array([3.0, 1.0, 0.0])</Code> makes a numpy array. It is like a list that can do
          math on all its numbers at once.
        </ListItem>
        <ListItem>
          <Code>scores - scores.max()</Code> takes the biggest number (3.0) away from every score.
          That gives <Code>[0, -2, -3]</Code>. This does not change the final answer. It only
          keeps <Code>exp</Code> from getting too big.
        </ListItem>
        <ListItem>
          <Code>np.exp(...)</Code> gives about <Code>[1.0, 0.135, 0.050]</Code>. Their sum is about
          1.185.
        </ListItem>
        <ListItem>
          Divide each by 1.185: 0.844, 0.114 and 0.042. <Code>np.round(probs, 2)</Code> cuts them to{" "}
          <Code>[0.84 0.11 0.04]</Code>. They add up to about 1.
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> <Code>[0.84 0.11 0.04]</Code>. Try changing the first score
        from 3.0 to 1.0. The first two scores are then equal, and you should see{" "}
        <Code>[0.42 0.42 0.16]</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
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
      <Text>
        Here is the lab's <Code>softmax</Code> on the tiny input <Code>[0.0, 1.0]</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>x.max(axis=-1, keepdims=True)</Code> finds the biggest number in each row: 1.0.{" "}
          <Code>axis=-1</Code> means "work along each row". <Code>keepdims=True</Code> keeps the
          answer as a column, so it can be subtracted from every number in its row.
        </ListItem>
        <ListItem>
          <Code>shifted</Code> is <Code>[-1.0, 0.0]</Code>. Then <Code>np.exp</Code> gives about{" "}
          <Code>[0.368, 1.0]</Code>.
        </ListItem>
        <ListItem>
          The row sum is about 1.368. Dividing gives about <Code>[0.269, 0.731]</Code>, the answer
          in the exercise's docstring.
        </ListItem>
        <ListItem>
          With attention scores <Code>[0.707, 0]</Code> from the last section, the same steps give
          weights of about <Code>[0.67, 0.33]</Code>. Word 0 pays about two thirds of its
          attention to key 0 and one third to key 1.
        </ListItem>
      </UnorderedList>

      <Heading as="h2" size="md">Why numpy instead of plain Python lists</Heading>
      <Text>
        You could represent a matrix as a list of lists in plain Python, but doing math on it means
        writing explicit loops: looping over rows, looping over columns, summing products by hand.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
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
      <Text>Here is what the example does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The loop version makes an empty grid of zeros. Then it visits each spot: <Code>i</Code>{" "}
          is the row and <Code>j</Code> is the column. <Code>a[0][0] + b[0][0]</Code> is 1 + 5 = 6.
          It does this 4 times in all, to get <Code>[[6, 8], [10, 12]]</Code>.
        </ListItem>
        <ListItem>
          <Code>np.array(a) + np.array(b)</Code> turns the lists into numpy arrays. Then the plus
          adds matching spots, all at once. It gives the same <Code>[[6, 8], [10, 12]]</Code> with
          no loop.
        </ListItem>
        <ListItem>
          <b>Vectorized</b> means "do it to the whole array in one go". It is faster and shorter.
        </ListItem>
      </UnorderedList>

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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          <Code>manual</Code> uses a loop idea: <Code>[a[i] + b[i] for i in range(len(a))]</Code>.
          <Code> len(a)</Code> is 3, so <Code>i</Code> is 0, 1 and 2. That gives 1 + 10, 2 + 20 and
          3 + 30, which is <Code>[11, 22, 33]</Code>.
        </ListItem>
        <ListItem>
          <Code>np.array(a) + np.array(b)</Code> adds the two arrays spot by spot, with no loop.
          The answer is the same three numbers.
        </ListItem>
        <ListItem>
          <Code>list(vectorized)</Code> turns the numpy array back into a normal list so it prints
          like one.
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> two lists with the numbers 11, 22 and 33. The first is a plain
        list. In the second list, newer numpy versions may print each number as{" "}
        <Code>np.int64(11)</Code>, which is just numpy's way to say "a whole number". The values are
        the same. Try changing <Code>b</Code> to <Code>[1, 2, 3]</Code>. You should then see
        2, 4 and 6.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
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
      <Text>
        Here is <Code>softmax</Code> on a matrix with two rows, <Code>x = [[1, 2, 3], [1, 1, 1]]</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>x.max(axis=-1, keepdims=True)</Code> gives <Code>[[3], [1]]</Code>, one biggest
          number for each row. Because <Code>keepdims</Code> keeps it as a column, numpy can
          subtract row 0's 3 from row 0 and row 1's 1 from row 1. This is called broadcasting.
        </ListItem>
        <ListItem>
          <Code>shifted</Code> is <Code>[[-2, -1, 0], [0, 0, 0]]</Code>.
        </ListItem>
        <ListItem>
          After <Code>exp</Code> and dividing each row by its own sum, row 0 is about{" "}
          <Code>[0.09, 0.24, 0.67]</Code> and row 1 is <Code>[1/3, 1/3, 1/3]</Code>. Equal scores
          give equal shares. This is exactly what the lab's checks test.
        </ListItem>
      </UnorderedList>

      <Heading as="h2" size="md">Deep dive: visualizing a matrix with matplotlib</Heading>
      <Text>
        A matrix of numbers is hard to read at a glance - a colored grid, where color stands in for
        value, is much easier to scan.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
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
      <Text>Here is how that example turns numbers into colors:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>scores</Code> is a 3 by 3 grid. Row 0 is Ana: 92, 78, 85. The columns are math,
          history and art.
        </ListItem>
        <ListItem>
          <Code>plt.imshow(scores, cmap="viridis")</Code> paints one square for each number.{" "}
          <Code>cmap</Code> is the "color map". It decides which colors go with low and high
          numbers. In viridis, low numbers are dark purple and high numbers are bright yellow.
        </ListItem>
        <ListItem>
          The lowest number is Ben's 60 and the highest is Cy's 95. So Ben's math square is the
          darkest and Cy's math square is the brightest.
        </ListItem>
        <ListItem>
          <Code>range(3)</Code> gives the spots 0, 1 and 2. <Code>xticks</Code> and{" "}
          <Code>yticks</Code> put a name at each spot.
        </ListItem>
      </UnorderedList>

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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          <Code>rainfall</Code> has 2 rows (two cities) and 3 columns (three months). CityA had 5,
          2 and 8 mm. CityB had 1, 9 and 3 mm.
        </ListItem>
        <ListItem>
          <Code>plt.imshow(rainfall, cmap="Blues")</Code> paints 6 squares. Low numbers are pale
          blue and high numbers are deep blue. So CityB in Feb (9) is the darkest square, and CityB
          in Jan (1) is the palest.
        </ListItem>
        <ListItem>
          <Code>colorbar</Code> adds a strip that shows which color means which number.{" "}
          <Code>xticks</Code> and <Code>yticks</Code> add the month and city names.{" "}
          <Code>title</Code> adds the heading, and <Code>plt.show()</Code> draws the chart.
        </ListItem>
        <ListItem>
          The last line prints a message.
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> a small blue grid with a color strip, and then the line{" "}
        <Code>plotted a 2x3 rainfall grid</Code>. Try changing the 9 to 0. That square should turn
        the palest, and the darkest one should become CityA's 8 in March.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
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
      <Text>
        Here is a tiny version with two words and the weights <Code>[[0.67, 0.33], [0.33, 0.67]]</Code>{" "}
        from the earlier steps:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The grid is 2 by 2. Row 0 is the first word. Its two squares say how much it attends to
          word 0 (0.67, brighter) and to word 1 (0.33, darker).
        </ListItem>
        <ListItem>
          Each row adds up to 1, because each row came out of softmax. So every row spreads out
          the same total attention in a different way.
        </ListItem>
        <ListItem>
          In the notebook there are 9 words, so <Code>attn_weights</Code> is 9 by 9. The{" "}
          <Code>words</Code> list is used for both the bottom labels and the left labels.{" "}
          <Code>rotation=45, ha="right"</Code> tilts the bottom labels so they do not overlap.{" "}
          <Code>cmap="magma"</Code> goes from dark purple to bright yellow-white, and{" "}
          <Code>colorbar</Code> shows the scale.
        </ListItem>
        <ListItem>
          This picture shows the softmax step from the list at the top of this reading. To read it,
          pick a word on the left and look along its row for the brightest squares.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Notebook</Heading>
      <Text>
        Open <Code>course/notebooks/lab_07_attention.ipynb</Code>. Implement <Code>softmax</Code>{" "}
        and <Code>scaled_dot_product_attention</Code> with plain numpy, then the project reuses
        lab 3's bigram table (re-derived here) as toy word embeddings and runs real tokenized
        review sentences through attention, plotting a word-by-word attention heatmap.
      </Text>

      <Heading as="h3" size="sm">Further reading</Heading>
      <Text>
        IBM Think:{" "}
        <Link href="https://www.ibm.com/think/topics/self-attention" isExternal color="blue.500">
          What is self-attention?
        </Link>
      </Text>
    </VStack>
  );
}
