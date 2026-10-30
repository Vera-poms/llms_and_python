import {
  Heading,
  Link,
  OrderedList,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab07Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">How attention works: scores, softmax, weighted average</Heading>
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

      <Text color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell for indexing into a small matrix - run it
        before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`grid = [[10, 20], [30, 40]]  # a 2x2 matrix: row 0 and row 1
print(grid[0])  # expected output: [10, 20]
print(grid[1][0])  # expected output: 30`}
      </Code>
      <PracticeCell labId={7} cellId="concept-1" code={`grid = [[10, 20], [30, 40]]  # a 2x2 matrix: row 0 and row 1
print(grid[0])  # expected output: [10, 20]
print(grid[1][0])  # expected output: 30`} expectedOutput={`[10, 20]
30`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
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
      <Text>
        <b>What you should see:</b> two lines, <Code>[10, 20]</Code> and then <Code>30</Code>. Try
        printing <Code>grid[0][1]</Code>. You should see <Code>20</Code>. That is row 0, item 1.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: words as lists of numbers</Heading>
      <Text>
        A model cannot do math on words. So the first thing it does is swap each word for a list of numbers. That list is called an <b>embedding</b>.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Words that are used in similar ways get lists that look alike. For example, <Code>cat</Code> and <Code>dog</Code> get close numbers.
        </ListItem>
        <ListItem>
          A sentence then becomes a grid: one row for each word, and each row is that word's list.
        </ListItem>
        <ListItem>
          Every row has the same length, so the grid has a <b>shape</b>: (number of words, numbers per word).
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. A tiny table gives each word 3 numbers. The numbers are made up, so they mean nothing yet. Two small functions turn a sentence into a grid: one looks up each word's row, and one reports the shape of the grid.
      </Text>
      <RunnableExample labId={7} code={`def embed_sentence(words, table):
    rows = []
    for word in words:
        rows.append(table[word])
    return rows


def shape(matrix):
    return (len(matrix), len(matrix[0]))


table = {"the": [1.0, 0.0, 2.0], "acting": [0.0, 1.0, 1.0], "was": [0.5, 0.5, 0.5]}
words = ["the", "acting", "was", "the"]
X = embed_sentence(words, table)
for word, row in zip(words, X):
    print(word, row)
print("shape:", shape(X))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>embed_sentence</Code> loops over the words and collects each word's row from the table. A sentence of 4 words gives 4 rows.
        </ListItem>
        <ListItem>
          <Code>the</Code> appears twice, so its row <Code>[1.0, 0.0, 2.0]</Code> appears twice. The same word always gets the same row, wherever it sits in the sentence.
        </ListItem>
        <ListItem>
          <Code>shape</Code> gives <Code>(4, 3)</Code>: 4 words, 3 numbers each.
        </ListItem>
        <ListItem>
          Pattern: one row for each word, so a sentence is a grid of numbers.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on a new table and a new sentence. Each word has 2 numbers this time.
      </Text>
      <PracticeCell labId={7} cellId="topic-1" code={`def embed_sentence(words, table):
    rows = []
    for word in words:
        rows.append(table[word])
    return rows


def shape(matrix):
    return (len(matrix), len(matrix[0]))


table = {"dog": [2.0, 1.0], "ran": [0.0, 3.0], "a": [1.0, 1.0]}
words = ["a", "dog", "ran", "a", "dog"]
X = embed_sentence(words, table)
for word, row in zip(words, X):
    print(word, row)
print("shape:", shape(X))`} expectedOutput={`a [1.0, 1.0]
dog [2.0, 1.0]
ran [0.0, 3.0]
a [1.0, 1.0]
dog [2.0, 1.0]
shape: (5, 2)`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The sentence has 5 words, so the grid has 5 rows. Each print line shows one word and its row.
        </ListItem>
        <ListItem>
          <Code>a</Code> and <Code>dog</Code> each appear twice, and they get the same row both times.
        </ListItem>
        <ListItem>
          <Code>shape</Code> uses <Code>len(matrix)</Code>, the number of rows (5), and <Code>len(matrix[0])</Code>, the length of the first row (2). So the shape is <Code>(5, 2)</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> five lines, each with a word and its two numbers, then <Code>shape: (5, 2)</Code>. Try adding <Code>"ran"</Code> to the end of the sentence. The shape becomes <Code>(6, 2)</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In this lab the embeddings are not made by hand like the table above. The project builds them
        from real review text. <Code>build_cooccurrence_embeddings</Code> gives each of the 523
        different words a list of 16 numbers. Then the rows of one sentence are stacked into{" "}
        <Code>X</Code>, with one row per word. <b>Q</b>, <b>K</b> and <b>V</b> in the code are
        matrices like this: each row is one word's query, key or value list.
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
        each word's 16 numbers and stacks the 9 rows into one grid. The word <Code>the</Code> appears twice, so rows 0 and 5 of <Code>X</Code> are the same. Later, <Code>X</Code> is passed
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
          <Code>a[0]*b[0]</Code> is <Code>1 * 4 = 4</Code>.
        </ListItem>
        <ListItem>
          <Code>a[1]*b[1]</Code> is <Code>2 * 5 = 10</Code>.
        </ListItem>
        <ListItem>
          <Code>a[2]*b[2]</Code> is <Code>3 * 6 = 18</Code>. Adding them: <Code>4 + 10 + 18 = 32</Code>.
        </ListItem>
        <ListItem>
          The example has no <Code>print</Code>, so the <Code>dot == 32</Code> comment is there to
          tell you the answer.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell computing a dot product by hand - run it
        before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`prices = [2, 5, 1]
quantities = [3, 2, 4]
total = sum(p * q for p, q in zip(prices, quantities))
print(total)  # expected output: 20`}
      </Code>
      <PracticeCell labId={7} cellId="concept-2" code={`prices = [2, 5, 1]
quantities = [3, 2, 4]
total = sum(p * q for p, q in zip(prices, quantities))
print(total)  # expected output: 20`} expectedOutput={`20`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Think of a shopping list. <Code>prices</Code> says the three items cost 2, 5 and 1.{" "}
          <Code>quantities</Code> says you buy 3, 2 and 4 of them.
        </ListItem>
        <ListItem>
          <Code>zip(prices, quantities)</Code> pairs them up: (2, 3), (5, 2) and (1, 4).
        </ListItem>
        <ListItem>
          <Code>p * q for p, q in ...</Code> multiplies each pair: 6, 10 and 4.{" "}
          <Code>sum(...)</Code> adds them: <Code>6 + 10 + 4 = 20</Code>. That is the total bill, and it is a dot
          product.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>20</Code>. Try changing the last quantity from 4 to 0. You
        should see <Code>16</Code>, because the 4 from the last pair disappears.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: scoring how well two words match</Heading>
      <Text>
        Attention starts with one question: how much does word A matter to word B? The model answers with a number for every pair of words. That number is a <b>score</b>.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Each word makes a <b>query</b>: a list of numbers that says what it is looking for.
        </ListItem>
        <ListItem>
          Each word also makes a <b>key</b>: a list of numbers that says what it offers.
        </ListItem>
        <ListItem>
          The score for a pair is the dot product of a query and a key. A big score means a good match.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. Three words have made-up lists of 3 numbers. To keep it small, each word is used as both the query and the key. One function does a dot product, one scores a query against every key, and a loop does it for each word.
      </Text>
      <RunnableExample labId={7} code={`def dot(a, b):
    total = 0
    for x, y in zip(a, b):
        total = total + x * y
    return total


def scores_for(query, keys):
    scores = []
    for key in keys:
        scores.append(dot(query, key))
    return scores


words = ["cat", "dog", "car"]
vectors = [[3, 1, 0], [2, 2, 0], [0, 1, 3]]
for word, query in zip(words, vectors):
    print(word, scores_for(query, vectors))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>dot</Code> multiplies matching numbers and adds them up, like the shopping bill above.
        </ListItem>
        <ListItem>
          <Code>scores_for</Code> scores one query against all the keys and gives back one score for each word.
        </ListItem>
        <ListItem>
          <Code>cat</Code> scores <Code>[10, 8, 1]</Code>. It matches itself best (10) and <Code>dog</Code> almost as well (8). It hardly matches <Code>car</Code> at all (1), because their numbers are not alike.
        </ListItem>
        <ListItem>
          Pattern: lists that look alike give big scores, and lists that differ give small scores. The 3 lines together make a table of 3 by 3 scores.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on three new words. Each word has 2 numbers.
      </Text>
      <PracticeCell labId={7} cellId="topic-2" code={`def dot(a, b):
    total = 0
    for x, y in zip(a, b):
        total = total + x * y
    return total


def scores_for(query, keys):
    scores = []
    for key in keys:
        scores.append(dot(query, key))
    return scores


words = ["tea", "coffee", "bus"]
vectors = [[3, 1], [2, 2], [0, 4]]
for word, query in zip(words, vectors):
    print(word, scores_for(query, vectors))`} expectedOutput={`tea [10, 8, 4]
coffee [8, 8, 8]
bus [4, 8, 16]`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>tea</Code> is <Code>[3, 1]</Code>. Against itself: <Code>3 * 3 + 1 * 1 = 10</Code>. Against <Code>coffee</Code> <Code>[2, 2]</Code>: <Code>3 * 2 + 1 * 2 = 8</Code>. Against <Code>bus</Code> <Code>[0, 4]</Code>: <Code>3 * 0 + 1 * 4 = 4</Code>.
        </ListItem>
        <ListItem>
          <Code>coffee</Code> scores 8 against every word, so it matches everything equally.
        </ListItem>
        <ListItem>
          <Code>bus</Code> matches itself best (16) and tea worst (4).
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> three lines: <Code>tea [10, 8, 4]</Code>, <Code>coffee [8, 8, 8]</Code> and <Code>bus [4, 8, 16]</Code>. Each word scores highest against itself, or ties for it.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This is the same job as <Code>scores_for</Code>, done for every word at once by{" "}
        <Code>scores = Q @ K.T</Code> in{" "}
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
          <Code>Q @ K.T</Code>: query 0 with key 0 is <Code>1 * 1 + 0 * 0 = 1</Code>. Query 0 with key 1 is 1 *
          <Code>0 + 0 * 1 = 0</Code>. Query 1 gives 0 and 1. So the scores are <Code>[[1, 0], [0, 1]]</Code>.
        </ListItem>
        <ListItem>
          Divide by <Code>sqrt(2)</Code>, about 1.414: the scores become about 0.707 and 0.
        </ListItem>
        <ListItem>
          In the project, <Code>X</Code> is passed as both <Code>Q</Code> and <Code>K</Code>. So{" "}
          <Code>Q @ K.T</Code> is a 9 by 9 table: one score for every pair of the 9 words. Each is
          divided by <Code>sqrt(16)</Code>, which is 4.
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
          <Code>total</Code> adds them: <Code>7.39 + 2.72 + 1.11</Code> is about 11.2. The comment says 11.22
          because it adds the rounded numbers. The exact total rounds to 11.21.
        </ListItem>
        <ListItem>
          Each one is divided by the total: <Code>7.39 / 11.2</Code> is about 0.66, <Code>2.72 / 11.2</Code> is about 0.24
          and <Code>1.11 / 11.2</Code> is about 0.10. The biggest score (2.0) gets the biggest share.
        </ListItem>
        <ListItem>
          <Code>round(x, 2)</Code> just cuts a number to 2 digits after the point, so the print is
          easy to read.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell running softmax on a different set of
        scores - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
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
      <Text>
        <b>What you should see:</b> <Code>[0.84 0.11 0.04]</Code>. Try changing the first score
        from 3.0 to 1.0. The first two scores are then equal, and you should see{" "}
        <Code>[0.42 0.42 0.16]</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: attention weights are shares</Heading>
      <Text>
        Raw scores are hard to use. They can be any size, and they do not add up to anything. So the model turns each row of scores into <b>attention weights</b>: positive shares that add up to 1.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A weight of 0.67 means "give about two thirds of my attention to this word".
        </ListItem>
        <ListItem>
          A word has only 1 whole of attention to give. A bigger share for one word means smaller shares for the others.
        </ListItem>
        <ListItem>
          The biggest score always gets the biggest share. Softmax also stretches the gaps: scores of 3 and 2 become shares of 0.67 and 0.24.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. A word is looking at 3 words. One function turns scores into shares, and a loop runs two cases: one clear favourite, and one with all scores equal.
      </Text>
      <RunnableExample labId={7} code={`import math


def softmax(scores):
    exps = []
    for s in scores:
        exps.append(math.exp(s))
    total = sum(exps)
    shares = []
    for e in exps:
        shares.append(e / total)
    return shares


words = ["the", "cat", "sat"]
for scores in ([1.0, 3.0, 2.0], [1.0, 1.0, 1.0]):
    weights = softmax(scores)
    print("scores", scores)
    for word, weight in zip(words, weights):
        print("  ", word, round(weight, 2))
    print("  total", round(sum(weights), 2))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>softmax</Code> has two loops. The first makes each score positive with <Code>math.exp</Code> and adds them up. The second divides each one by the total.
        </ListItem>
        <ListItem>
          Scores <Code>[1.0, 3.0, 2.0]</Code> give 0.09, 0.67 and 0.24. <Code>cat</Code> has the biggest score, so it gets about two thirds of the attention.
        </ListItem>
        <ListItem>
          Equal scores give 0.33 each. Nothing stands out, so the attention is spread evenly.
        </ListItem>
        <ListItem>
          In both cases the total is 1.0. Pattern: scores go in, shares come out, and the shares always add up to 1.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same function on two new sets of scores.
      </Text>
      <PracticeCell labId={7} cellId="topic-3" code={`import math


def softmax(scores):
    exps = []
    for s in scores:
        exps.append(math.exp(s))
    total = sum(exps)
    shares = []
    for e in exps:
        shares.append(e / total)
    return shares


words = ["a", "dog", "barked"]
for scores in ([0.0, 2.0, 1.0], [2.0, 2.0, 0.0]):
    weights = softmax(scores)
    print("scores", scores)
    for word, weight in zip(words, weights):
        print("  ", word, round(weight, 2))
    print("  total", round(sum(weights), 2))`} expectedOutput={`scores [0.0, 2.0, 1.0]
   a 0.09
   dog 0.67
   barked 0.24
  total 1.0
scores [2.0, 2.0, 0.0]
   a 0.47
   dog 0.47
   barked 0.06
  total 1.0`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>[0.0, 2.0, 1.0]</Code> is the first example's scores with 1 taken off each. The gaps are the same, so the shares are the same: 0.09, 0.67 and 0.24. This is why the lab can subtract the biggest score from each row without changing the answer.
        </ListItem>
        <ListItem>
          <Code>[2.0, 2.0, 0.0]</Code> has two scores tied at the top. <Code>a</Code> and <Code>dog</Code> get 0.47 each, and <Code>barked</Code> gets 0.06.
        </ListItem>
        <ListItem>
          <Code>round(weight, 2)</Code> cuts each share to 2 digits, and the totals still show 1.0.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> two groups of lines, each with three words and a total of <Code>1.0</Code>. The first group matches the worked example. In the second group two words share most of the attention.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This is the same operation as lab 1's <Code>word_probabilities</Code>, applied to attention
        scores instead of word counts. The lab's <Code>softmax</Code> uses numpy, so it works on a
        whole matrix of rows at once via <Code>axis=-1</Code>. It subtracts the row max before
        exponentiating. That does not change the final probabilities, because it cancels out in the
        division, but it keeps <Code>exp()</Code> from overflowing on large scores. The output is{" "}
        <Code>attention_weights</Code>, one row of shares for each word. Every row adds up to 1, so
        the notebook's assertion <Code>weights.sum(axis=-1) == 1.0</Code> has to hold.
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
          is the row and <Code>j</Code> is the column. <Code>a[0][0] + b[0][0]</Code> is <Code>1 + 5 = 6</Code>.
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

      <Text color="gray.600">
        Try it: the notebook has a "Concept 4 practice" cell comparing a manual loop to a vectorized
        numpy operation - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>manual</Code> uses a loop idea: <Code>[a[i] + b[i] for i in range(len(a))]</Code>.
          <Code> len(a)</Code> is 3, so <Code>i</Code> is 0, 1 and 2. That gives <Code>1 + 10</Code>, <Code>2 + 20</Code> and
          <Code>3 + 30</Code>, which is <Code>[11, 22, 33]</Code>.
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
      <Text>
        <b>What you should see:</b> two lists with the numbers 11, 22 and 33. The first is a plain
        list. In the second list, newer numpy versions may print each number as{" "}
        <Code>np.int64(11)</Code>, which is just numpy's way to say "a whole number". The values are
        the same. Try changing <Code>b</Code> to <Code>[1, 2, 3]</Code>. You should then see
        2, 4 and 6.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: why attention gets expensive</Heading>
      <Text>
        In attention, every word is scored against every other word. So the work does not grow in step with the length of the text. It grows much faster.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A sentence of n words makes n times n scores.
        </ListItem>
        <ListItem>
          Each score is a dot product, which uses one multiplication for each number in the word's list.
        </ListItem>
        <ListItem>
          Double the length and you get 4 times as many scores. This is one reason a model's window is limited, and why models run on chips that do many multiplications at the same time.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. Two small functions count the work with loops. Each word has 16 numbers, the size the lab uses.
      </Text>
      <RunnableExample labId={7} code={`def count_pairs(n_words):
    pairs = 0
    for i in range(n_words):
        for j in range(n_words):
            pairs = pairs + 1
    return pairs


def count_multiplications(n_words, dim):
    return count_pairs(n_words) * dim


dim = 16
for n_words in (9, 50, 200):
    print(n_words, "words ->", count_pairs(n_words), "scores,", count_multiplications(n_words, dim), "multiplications")`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>count_pairs</Code> has two loops, one inside the other. It counts every pair of (word i, word j), which gives n times n.
        </ListItem>
        <ListItem>
          <Code>count_multiplications</Code> multiplies the pairs by <Code>dim</Code>, because each score needs one multiplication for each of the 16 numbers.
        </ListItem>
        <ListItem>
          9 words give 81 scores and 1296 multiplications. That is the size of the lab's own sentence.
        </ListItem>
        <ListItem>
          50 words give 2500 scores. 200 words give 40000. Going from 50 to 200 words is 4 times longer, but the scores go up 16 times.
        </ListItem>
        <ListItem>
          Pattern: a longer text costs much more than a proportion of the extra length.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions with 8 numbers per word and three new lengths.
      </Text>
      <PracticeCell labId={7} cellId="topic-4" code={`def count_pairs(n_words):
    pairs = 0
    for i in range(n_words):
        for j in range(n_words):
            pairs = pairs + 1
    return pairs


def count_multiplications(n_words, dim):
    return count_pairs(n_words) * dim


dim = 8
for n_words in (5, 20, 40):
    print(n_words, "words ->", count_pairs(n_words), "scores,", count_multiplications(n_words, dim), "multiplications")`} expectedOutput={`5 words -> 25 scores, 200 multiplications
20 words -> 400 scores, 3200 multiplications
40 words -> 1600 scores, 12800 multiplications`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          5 words give <Code>5 * 5 = 25</Code> scores, and <Code>25 * 8 = 200</Code> multiplications.
        </ListItem>
        <ListItem>
          20 words give 400 scores and 3200 multiplications. That is 4 times the words and 16 times the scores.
        </ListItem>
        <ListItem>
          40 words give 1600 scores and 12800 multiplications.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> three lines, from <Code>5 words -&gt; 25 scores, 200 multiplications</Code> to <Code>40 words -&gt; 1600 scores, 12800 multiplications</Code>. Try a length of 80 words. The scores are 6400.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In the lab, this is why <Code>Q @ K.T</Code> is a single line. For the 9-word sentence with 16
        numbers per word it makes 81 scores and 1296 multiplications, as in the worked example. A
        Python loop would do them one by one. numpy does them all at once, in fast compiled code.
      </Text>
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

      <Text color="gray.600">
        Try it: the notebook has a "Concept 5 practice" cell plotting a different toy grid as a heatmap -
        run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
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
      <Text>
        <b>What you should see:</b> a small blue grid with a color strip, and then the line{" "}
        <Code>plotted a 2x3 rainfall grid</Code>. Try changing the 9 to 0. That square should turn
        the palest, and the darkest one should become CityA's 8 in March.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: reading an attention picture</Heading>
      <Text>
        A model holds millions of numbers, and it is hard to see what it is doing. Attention weights are one of the few things you can look at. Draw them as a grid and you can see which words a word is looking at.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Row <Code>i</Code> is the word that is looking. Column <Code>j</Code> is the word being looked at.
        </ListItem>
        <ListItem>
          A bright cell is a big weight: a strong link between the two words.
        </ListItem>
        <ListItem>
          Be careful. The picture shows where the attention goes, but it does not prove why the model gave its answer. It is a clue.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. There is no picture library here. Two small functions turn weights into text symbols: <Code>#</Code> for a big weight, <Code>+</Code> for a medium one and <Code>.</Code> for a small one. A loop prints one row for each word.
      </Text>
      <RunnableExample labId={7} code={`def shade(weight):
    if weight >= 0.5:
        return "#"
    if weight >= 0.25:
        return "+"
    return "."


def brightest(words, row):
    best = 0
    for j in range(len(row)):
        if row[j] > row[best]:
            best = j
    return words[best]


words = ["the", "dog", "barked"]
weights = [[0.6, 0.3, 0.1], [0.2, 0.5, 0.3], [0.1, 0.6, 0.3]]
for word, row in zip(words, weights):
    picture = ""
    for w in row:
        picture = picture + shade(w)
    print(word.ljust(7), picture, "looks most at", brightest(words, row))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>shade</Code> turns a number into a symbol. 0.5 or more is <Code>#</Code>, 0.25 or more is <Code>+</Code>, and anything less is <Code>.</Code>.
        </ListItem>
        <ListItem>
          <Code>brightest</Code> loops along a row to find the biggest weight and gives back that word.
        </ListItem>
        <ListItem>
          The row for <Code>the</Code> is <Code>#+.</Code>, so it looks mostly at itself. The row for <Code>barked</Code> is <Code>.#+</Code>, so it looks most at <Code>dog</Code>.
        </ListItem>
        <ListItem>
          Pattern: turn numbers into a picture, and the strongest links show up at a glance.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on new words and new weights.
      </Text>
      <PracticeCell labId={7} cellId="topic-5" code={`def shade(weight):
    if weight >= 0.5:
        return "#"
    if weight >= 0.25:
        return "+"
    return "."


def brightest(words, row):
    best = 0
    for j in range(len(row)):
        if row[j] > row[best]:
            best = j
    return words[best]


words = ["she", "read", "books"]
weights = [[0.7, 0.2, 0.1], [0.6, 0.1, 0.3], [0.1, 0.3, 0.6]]
for word, row in zip(words, weights):
    picture = ""
    for w in row:
        picture = picture + shade(w)
    print(word.ljust(7), picture, "looks most at", brightest(words, row))`} expectedOutput={`she     #.. looks most at she
read    #.+ looks most at she
books   .+# looks most at books`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>she</Code> has weights <Code>[0.7, 0.2, 0.1]</Code>. 0.7 is big, so <Code>#</Code>. 0.2 and 0.1 are under 0.25, so both are <Code>.</Code>.
        </ListItem>
        <ListItem>
          <Code>read</Code> has <Code>[0.6, 0.1, 0.3]</Code>, which is <Code>#.+</Code>. Its biggest weight is on <Code>she</Code>.
        </ListItem>
        <ListItem>
          <Code>books</Code> has <Code>[0.1, 0.3, 0.6]</Code>, which is <Code>.+#</Code>. It looks most at itself.
        </ListItem>
        <ListItem>
          <Code>word.ljust(7)</Code> pads the word with spaces to 7 characters, so the pictures line up.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> three lines, one for each word, each with a three-symbol picture and the word it looks at most. Try changing one weight in a row to make a different symbol.
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
