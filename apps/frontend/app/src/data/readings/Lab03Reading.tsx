import { Code, Heading, Link, Text, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab03Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Conditioning the distribution</Heading>
      <Text>
        Lab 1's distribution was global: one <Code>P(word)</Code> for the whole corpus, ignoring
        context entirely. Real language depends heavily on what came before - "the" is far more
        likely to be followed by a noun than a verb. Conditional probability captures that:{" "}
        <Code>P(next_word | previous_word)</Code> is a separate distribution for every possible
        previous word. This is exactly what an LLM does, just conditioned on the entire preceding
        context instead of a single word.
      </Text>

      <Heading size="sm">Concept 1: a dictionary of dictionaries</Heading>
      <Text>
        To keep "a separate distribution per previous word," you need a dictionary whose values
        are themselves dictionaries - a dict-of-dicts.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell grouping zoo animals by category the
        same way - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>bigram_counts</Code> uses precisely this pattern:{" "}
        <Code>counts[prev_word][next_word]</Code> is "how many times did{" "}
        <Code>next_word</Code> immediately follow <Code>prev_word</Code> anywhere in the corpus,"
        built with <Code>counts.setdefault(prev, {})</Code> the same way the pantry example builds
        per-shelf counts.
      </Text>

      <Heading size="sm">Concept 2: bigrams and conditional probability</Heading>
      <Text>
        A "bigram" is just a pair of consecutive words - in <Code>"the movie was great"</Code>,
        the bigrams are <Code>(the, movie)</Code>, <Code>(movie, was)</Code>, and{" "}
        <Code>(was, great)</Code>. Conditional probability asks: out of everything that followed
        word X, what fraction of the time was it word Y?
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell computing P(biscuit | tea) the same
        way - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`after_tea = {"biscuit": 4, "scone": 1}
total = sum(after_tea.values())  # 5
p_biscuit_given_tea = after_tea["biscuit"] / total
print(p_biscuit_given_tea)  # 0.8 -> P(biscuit | tea) = 0.8`}
      </Code>
      <PracticeCell labId={3} cellId="concept-2" code={`after_tea = {"biscuit": 4, "scone": 1}
total = sum(after_tea.values())  # 5
p_biscuit_given_tea = after_tea["biscuit"] / total
print(p_biscuit_given_tea)  # 0.8 -> P(biscuit | tea) = 0.8`} expectedOutput={`0.8`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
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

      <Heading size="sm">Concept 3: plotting with matplotlib</Heading>
      <Text>
        A whole table of conditional probabilities - one row per previous word, one column per
        next word - is hard to read as numbers but easy to read as a heatmap: a grid of colored
        cells where color stands in for a value.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell plotting a small heatmap with{" "}
        <Code>plt.imshow</Code> - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
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

    </VStack>
  );
}
