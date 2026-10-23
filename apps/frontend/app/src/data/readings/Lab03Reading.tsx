import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab03Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">Conditioning the distribution</Heading>
      <Text>
        Lab 1's distribution was global: one <Code>P(word)</Code> for the whole corpus, ignoring
        context entirely. Real language depends heavily on what came before - "the" is far more
        likely to be followed by a noun than a verb. Conditional probability captures that:{" "}
        <Code>P(next_word | previous_word)</Code> is a separate distribution for every possible
        previous word. This is exactly what an LLM does, just conditioned on the entire preceding
        context instead of a single word.
      </Text>

      <Heading as="h3" size="sm">Concept 1: a dictionary of dictionaries</Heading>
      <Text>
        To keep "a separate distribution per previous word," you need a dictionary whose values
        are themselves dictionaries - a dict-of-dicts.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>Think of organizing a pantry by shelf, then by item on each shelf:</Text>
      <RunnableExample labId={3} code={`pantry: dict[str, dict[str, int]] = {}

items = [("top shelf", "pasta"), ("top shelf", "rice"),
         ("top shelf", "pasta"), ("bottom shelf", "cans")]

for shelf, item in items:
    shelf_counts = pantry.setdefault(shelf, {})
    shelf_counts[item] = shelf_counts.get(item, 0) + 1

print(pantry)
# {'top shelf': {'pasta': 2, 'rice': 1}, 'bottom shelf': {'cans': 1}}`} />
      <Text>
        <Code>dict.setdefault(key, {})</Code> is the key trick: it returns the inner dict for{" "}
        <Code>key</Code> if one already exists, and otherwise creates an empty one, stores it, and
        returns that - so you never have to write an <Code>if key not in pantry</Code> check by
        hand.
      </Text>
      <Text>
        A dict-of-dicts is like a cupboard with labeled shelves. The outer dict finds the shelf.
        The inner dict counts the items on that shelf. Here is the loop, one pair at a time:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>for shelf, item in items</Code> splits each pair into two names.{" "}
          <Code>("top shelf", "pasta")</Code> gives <Code>shelf = "top shelf"</Code> and{" "}
          <Code>item = "pasta"</Code>.
        </ListItem>
        <ListItem>
          Pair 1: there is no <Code>"top shelf"</Code> yet, so <Code>setdefault</Code> makes an
          empty inner dict. Then <Code>get("pasta", 0) + 1</Code> = 1. Now{" "}
          <Code>{"{'top shelf': {'pasta': 1}}"}</Code>.
        </ListItem>
        <ListItem>
          Pair 2 adds rice to the same shelf: <Code>{"{'pasta': 1, 'rice': 1}"}</Code>.
        </ListItem>
        <ListItem>
          Pair 3 is pasta again. The shelf already exists, so <Code>setdefault</Code> just hands
          it back. The pasta count goes from 1 to 2.
        </ListItem>
        <ListItem>
          Pair 4 is a new shelf, <Code>"bottom shelf"</Code>, with <Code>cans</Code> at 1. That
          gives the final answer in the comment.
        </ListItem>
      </UnorderedList>
      <Text>
        Reading it back: <Code>pantry["top shelf"]["pasta"]</Code> is 2. The first{" "}
        <Code>[...]</Code> picks the shelf. The second picks the item.
      </Text>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell grouping zoo animals by category the
        same way - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`zoo: dict[str, dict[str, int]] = {}

sightings = [("mammals", "lion"), ("mammals", "zebra"),
             ("mammals", "lion"), ("birds", "owl")]

for category, animal in sightings:
    counts = zoo.setdefault(category, {})
    counts[animal] = counts.get(animal, 0) + 1

print(zoo)
# {'mammals': {'lion': 2, 'zebra': 1}, 'birds': {'owl': 1}}`}
      </Code>
      <PracticeCell labId={3} cellId="concept-1" code={`zoo: dict[str, dict[str, int]] = {}

sightings = [("mammals", "lion"), ("mammals", "zebra"),
             ("mammals", "lion"), ("birds", "owl")]

for category, animal in sightings:
    counts = zoo.setdefault(category, {})
    counts[animal] = counts.get(animal, 0) + 1

print(zoo)
# {'mammals': {'lion': 2, 'zebra': 1}, 'birds': {'owl': 1}}`} expectedOutput={`{'mammals': {'lion': 2, 'zebra': 1}, 'birds': {'owl': 1}}`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>sightings</Code> has 4 pairs: a category and an animal seen in it.
        </ListItem>
        <ListItem>
          <Code>("mammals", "lion")</Code>: a new category, so <Code>setdefault</Code> makes an
          empty dict. Lion gets 1.
        </ListItem>
        <ListItem>
          <Code>("mammals", "zebra")</Code>: same category, new animal. Zebra gets 1.
        </ListItem>
        <ListItem>
          <Code>("mammals", "lion")</Code> again: lion goes from 1 to 2.
        </ListItem>
        <ListItem>
          <Code>("birds", "owl")</Code>: a new category. Owl gets 1.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b>{" "}
        <Code>{"{'mammals': {'lion': 2, 'zebra': 1}, 'birds': {'owl': 1}}"}</Code>. Try adding{" "}
        <Code>("birds", "owl")</Code> to the list one more time. The owl count should become 2.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>bigram_counts</Code> uses precisely this pattern:{" "}
        <Code>counts[prev_word][next_word]</Code> is "how many times did{" "}
        <Code>next_word</Code> immediately follow <Code>prev_word</Code> anywhere in the corpus,"
        built with <Code>counts.setdefault(prev, {})</Code> the same way the pantry example builds
        per-shelf counts.
      </Text>
      <Text>
        Here is the lab's real code. The "shelf" is the previous word, and the "item" is the word
        that comes next:
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`for sentence in sentences:
    words = tokenize(sentence)
    for prev, nxt in zip(words, words[1:]):
        inner = counts.setdefault(prev, {})
        inner[nxt] = inner.get(nxt, 0) + 1`}
      </Code>
      <Text>
        Take one sentence, <Code>"a b a c"</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>tokenize</Code> (from Lab 1) gives <Code>["a", "b", "a", "c"]</Code>.
        </ListItem>
        <ListItem>
          <Code>words[1:]</Code> is the same list without the first word:{" "}
          <Code>["b", "a", "c"]</Code>. <Code>zip</Code> pairs the two lists up, and it stops when
          the shorter one ends. The pairs are (a, b), (b, a) and (a, c). Each pair is one bigram.
        </ListItem>
        <ListItem>
          (a, b): <Code>counts["a"]</Code> is made, and b gets 1. (b, a): <Code>counts["b"]</Code>{" "}
          is made, and a gets 1. (a, c): the "a" shelf already exists, and c gets 1.
        </ListItem>
        <ListItem>
          Result: <Code>{"{'a': {'b': 1, 'c': 1}, 'b': {'a': 1}}"}</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        Notice that <Code>"c"</Code> has no entry of its own. Nothing came after it, so it is
        never a "previous word". The lab says this too. Pairs also never cross from one sentence
        into the next, because each sentence has its own <Code>zip</Code>.
      </Text>

      <Heading as="h3" size="sm">Concept 2: bigrams and conditional probability</Heading>
      <Text>
        A "bigram" is just a pair of consecutive words - in <Code>"the movie was great"</Code>,
        the bigrams are <Code>(the, movie)</Code>, <Code>(movie, was)</Code>, and{" "}
        <Code>(was, great)</Code>. Conditional probability asks: out of everything that followed
        word X, what fraction of the time was it word Y?
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Suppose you tracked what people ordered after each drink at a cafe:
      </Text>
      <RunnableExample labId={3} code={`after_coffee = {"croissant": 6, "muffin": 3, "nothing": 1}
total = sum(after_coffee.values())  # 10
p_croissant_given_coffee = after_coffee["croissant"] / total
print(p_croissant_given_coffee)  # 0.6 -> P(croissant | coffee) = 0.6`} />
      <Text>
        Dividing each count by the total for that condition (here, "given coffee") turns raw
        tallies into a proper distribution - one that sums to 1 across everything that could come
        next after that specific starting point.
      </Text>
      <Text>
        The symbol <Code>P(croissant | coffee)</Code> is read "the chance of croissant, given
        coffee". The bar <Code>|</Code> means "given", so "if we already know the person had
        coffee". Here is the example with the numbers:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>after_coffee</Code> says: of the people who had coffee, 6 then ordered a croissant,
          3 a muffin and 1 nothing.
        </ListItem>
        <ListItem>
          <Code>total</Code> = <Code>6 + 3 + 1 = 10</Code> people who had coffee.
        </ListItem>
        <ListItem>
          <Code>6 / 10 = 0.6</Code>. Muffin would be <Code>3 / 10 = 0.3</Code> and nothing <Code>1 / 10 = 0.1</Code>. These add up to
          1.0.
        </ListItem>
        <ListItem>
          We only look at coffee drinkers. Tea drinkers would get their own separate counts and
          their own total. That is the "conditional" part.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell computing P(biscuit | tea) the same
        way - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`after_tea = {"biscuit": 4, "scone": 1}
total = sum(after_tea.values())  # 5
p_biscuit_given_tea = after_tea["biscuit"] / total
print(p_biscuit_given_tea)  # 0.8 -> P(biscuit | tea) = 0.8`}
      </Code>
      <PracticeCell labId={3} cellId="concept-2" code={`after_tea = {"biscuit": 4, "scone": 1}
total = sum(after_tea.values())  # 5
p_biscuit_given_tea = after_tea["biscuit"] / total
print(p_biscuit_given_tea)  # 0.8 -> P(biscuit | tea) = 0.8`} expectedOutput={`0.8`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>after_tea</Code> says: of the people who had tea, 4 ordered a biscuit and 1 ordered
          a scone.
        </ListItem>
        <ListItem>
          <Code>total</Code> = <Code>4 + 1 = 5</Code>.
        </ListItem>
        <ListItem>
          <Code>after_tea["biscuit"] / total</Code> = <Code>4 / 5 = 0.8</Code>. The scone chance is <Code>1 / 5</Code> =
          0.2, and <Code>0.8 + 0.2 = 1.0</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>0.8</Code>. Try changing the scone count to 4. The total
        becomes 8, so the biscuit chance drops to <Code>4 / 8 = 0.5</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        That's exactly what <Code>conditional_probabilities</Code> computes, but per previous
        word instead of per drink: for every <Code>prev_word</Code>, it takes that word's inner
        count dictionary and divides each entry by the total count of words that ever followed{" "}
        <Code>prev_word</Code>, so <Code>cond[prev_word]</Code> is a full probability distribution
        that sums to 1 - one distribution per previous word, instead of lab 1's single global one.
        Stacking one of these per-word distributions on top of another lets you generate whole
        sentences: sample a next word, then treat it as the new "previous word" and sample again.
        A modern LLM does the same generation loop, just conditioning each step on thousands of
        prior tokens (via attention) instead of exactly one.
      </Text>
      <Text>Here is the lab's real code:</Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`for prev, next_counts in counts.items():
    total = sum(next_counts.values())
    cond[prev] = {nxt: count / total for nxt, count in next_counts.items()}`}
      </Code>
      <Text>
        Take the counts from the last section, <Code>{"{'a': {'b': 1, 'c': 1}, 'b': {'a': 1}}"}</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>prev = "a"</Code>: the inner counts are <Code>{"{'b': 1, 'c': 1}"}</Code>. The
          total is <Code>1 + 1 = 2</Code>. So b gets <Code>1 / 2 = 0.5</Code> and c gets <Code>1 / 2 = 0.5</Code>. The row is{" "}
          <Code>{"{'b': 0.5, 'c': 0.5}"}</Code>.
        </ListItem>
        <ListItem>
          <Code>prev = "b"</Code>: the inner counts are <Code>{"{'a': 1}"}</Code>. The total is 1.
          So a gets <Code>1 / 1 = 1.0</Code>. After "b" the next word is always "a".
        </ListItem>
        <ListItem>
          Each row adds up to 1.0 on its own. The total is worked out per previous word, not once
          for the whole corpus. That is the difference from Lab 1.
        </ListItem>
      </UnorderedList>
      <Text>
        This is also how a sentence gets made. Say the last word was "a". You roll a dice with a
        50% chance of "b" and 50% of "c", and write down the result. Then you use that word to
        pick the next row.
      </Text>

      <Heading as="h3" size="sm">Concept 3: plotting with matplotlib</Heading>
      <Text>
        A whole table of conditional probabilities - one row per previous word, one column per
        next word - is hard to read as numbers but easy to read as a heatmap: a grid of colored
        cells where color stands in for a value.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Say you have a small grid of numbers you want to see as colors instead of digits:
      </Text>
      <RunnableExample labId={3} code={`import matplotlib.pyplot as plt
import numpy as np

grid = np.array([[0.1, 0.9], [0.7, 0.3]])

plt.imshow(grid, cmap="viridis")
plt.colorbar(label="value")
plt.xticks([0, 1], ["col A", "col B"])
plt.yticks([0, 1], ["row A", "row B"])
plt.savefig("heatmap.png")
plt.show()`} />
      <Text>
        <Code>plt.imshow(grid, cmap=...)</Code> paints each cell of a 2D array as a colored square
        - bigger numbers get one end of the color scale ("viridis" runs dark purple to bright
        yellow), smaller numbers the other end. <Code>plt.colorbar()</Code> adds the legend that
        maps color back to a number, and <Code>xticks</Code>/<Code>yticks</Code> label the rows
        and columns instead of leaving them as bare 0, 1, 2, ...
      </Text>
      <Text>Here is what each line does with the real numbers:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>import numpy as np</Code> loads numpy, a toolbox for grids of numbers.{" "}
          <Code>np.array([[0.1, 0.9], [0.7, 0.3]])</Code> makes a grid with 2 rows and 2 columns.
          Each inner list is one row.
        </ListItem>
        <ListItem>
          <Code>plt.imshow(grid, cmap="viridis")</Code> paints one square per number.{" "}
          <Code>cmap</Code> (color map) is the color scale. 0.9 is the brightest yellow square. 0.1
          is the darkest purple.
        </ListItem>
        <ListItem>
          <Code>plt.colorbar(label="value")</Code> adds a strip on the side that shows which color
          means which number.
        </ListItem>
        <ListItem>
          <Code>plt.xticks([0, 1], ["col A", "col B"])</Code> says: put the name "col A" at
          column position 0, and "col B" at position 1. Counting starts at 0. <Code>yticks</Code>{" "}
          does the same for rows.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell plotting a small heatmap with{" "}
        <Code>plt.imshow</Code> - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`import matplotlib.pyplot as plt
import numpy as np

grid = np.array([[0.2, 0.8], [0.6, 0.4]])

plt.imshow(grid, cmap="viridis")
plt.colorbar(label="score")
plt.xticks([0, 1], ["team A", "team B"])
plt.yticks([0, 1], ["round 1", "round 2"])
plt.show()
print(grid.shape)  # (2, 2)`}
      </Code>
      <PracticeCell labId={3} cellId="concept-3" code={`import matplotlib.pyplot as plt
import numpy as np

grid = np.array([[0.2, 0.8], [0.6, 0.4]])

plt.imshow(grid, cmap="viridis")
plt.colorbar(label="score")
plt.xticks([0, 1], ["team A", "team B"])
plt.yticks([0, 1], ["round 1", "round 2"])
plt.show()
print(grid.shape)  # (2, 2)`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>grid</Code> has two rows: <Code>[0.2, 0.8]</Code> for round 1 and{" "}
          <Code>[0.6, 0.4]</Code> for round 2. The columns are team A and team B.
        </ListItem>
        <ListItem>
          <Code>imshow</Code> paints 4 squares. The brightest is 0.8 (round 1, team B). The darkest
          is 0.2 (round 1, team A).
        </ListItem>
        <ListItem>
          <Code>grid.shape</Code> tells you how big the grid is: 2 rows and 2 columns, written{" "}
          <Code>(2, 2)</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> a 2 by 2 picture with a color bar labeled "score", and the
        text <Code>(2, 2)</Code> under it. Try changing 0.8 to 0.1. That square turns dark, and the
        colors on the whole chart shift to match the new range.
      </Text>

      <Text fontSize="sm" color="gray.500">
        Further reading: IBM Think -{" "}
        <Link href="https://www.ibm.com/think/topics/bayesian-statistics" isExternal color="blue.500">
          What are Bayesian statistics?
        </Link>{" "}
        covers conditional probability in depth, and{" "}
        <Link href="https://www.ibm.com/think/topics/speech-recognition" isExternal color="blue.500">
          IBM's overview of speech recognition
        </Link>{" "}
        explains n-gram language models (bigrams are the simplest, two-word case).
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>project.py</Code> builds exactly this kind of grid from real conditional
        probabilities: it picks the 12 most frequent previous words and the 12 most frequent next
        words, fills a matrix where cell <Code>[i, j]</Code> is <Code>cond[prev_word].get(next_word,
        0.0)</Code>, and calls <Code>plt.imshow(matrix, cmap="viridis", aspect="auto")</Code> with
        the previous words labeling the rows and the next words labeling the columns. Bright cells
        are word pairs that follow each other often - the conditional-probability analogue of lab
        1's bar chart, except now every row is its own separate distribution instead of one global
        one.
      </Text>
      <Text>Here is how the matrix gets filled, on a tiny version with 2 previous words and 2 next words:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Say <Code>cond</Code> is <Code>{"{'a': {'b': 0.5, 'c': 0.5}, 'b': {'a': 1.0}}"}</Code>.
          Rows are <Code>["a", "b"]</Code>. Columns are <Code>["b", "a"]</Code>.
        </ListItem>
        <ListItem>
          <Code>np.zeros((2, 2))</Code> starts with a grid full of 0.0.
        </ListItem>
        <ListItem>
          <Code>enumerate</Code> gives each word with its position number. For row 0 ("a") and
          column 0 ("b"), the cell gets <Code>cond["a"].get("b", 0.0)</Code> = 0.5.
        </ListItem>
        <ListItem>
          Row 0, column 1 ("a" then "a"): <Code>"a"</Code> never followed "a", so{" "}
          <Code>get</Code> uses its default, 0.0. That is why we use <Code>get</Code> and not{" "}
          <Code>[...]</Code>. A missing pair does not crash.
        </ListItem>
        <ListItem>
          Row 1 ("b"): column 0 ("b" then "b") is 0.0 and column 1 ("b" then "a") is 1.0. The
          final matrix is <Code>[[0.5, 0.0], [0.0, 1.0]]</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        In the real chart the grid is 12 by 12. Read it one row at a time. Each row is one previous
        word, and its colors show how likely each next word is. A row with one very bright cell
        means that word is almost always followed by the same word.
      </Text>

    </VStack>
  );
}
