import { Code, Heading, Link, Text, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab01Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Why probability?</Heading>
      <Text>
        An LLM never "knows" the next word for certain. At every step it produces a probability
        distribution over its entire vocabulary - a number for every possible next token that all
        add up to 1 - and then either takes the highest one (greedy decoding) or samples from the
        distribution (what "temperature" controls). Everything else in this course sits on top of
        that one idea, so we build the whole pipeline from scratch, on real text, in this lab.
      </Text>

      <Heading size="sm">Concept 1: Python modules and imports</Heading>
      <Text>
        Every file in this course opens with a handful of <Code>import</Code> lines before any
        real logic starts - worth understanding before anything else, since the rest of this lab
        leans on them immediately.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Python ships with a large standard library, and countless more packages are one{" "}
        <Code>pip install</Code> away. <Code>import</Code> pulls one of those in and hands you its
        functions and tools. The alternative - writing everything yourself - is like carving your
        own screw holes with a knife instead of borrowing a power drill: possible, but nobody does
        it once a good tool already exists.
      </Text>
      <RunnableExample labId={1} code={`import math

# without the module, you'd have to write your own algorithm
def my_sqrt(x: float, guess: float = 1.0) -> float:
    for _ in range(20):
        guess = (guess + x / guess) / 2
    return guess

print(my_sqrt(2))    # 1.4142135623746899 - close, hand-rolled
print(math.sqrt(2))  # 1.4142135623730951 - exact, one line, battle-tested`} />
      <Text>
        <Code>import math</Code> gives the whole file access to Python's built-in math module,
        including a <Code>sqrt</Code> that's already correct, fast, and tested by millions of other
        programs. Writing your own version is a fine way to learn how square roots work, but
        nobody ships the hand-rolled one - that's the entire point of <Code>import</Code>: borrow a
        specialized, already-tested tool instead of reinventing it.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell comparing a hand-rolled mean to{" "}
        <Code>statistics.mean</Code> - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`import statistics

def my_mean(values: list[float]) -> float:
    return sum(values) / len(values)

nums = [4, 8, 15, 16, 23, 42]
print(my_mean(nums))              # 18.0 - hand-rolled
print(statistics.mean(nums))      # 18 - same answer, from the standard library`}
      </Code>
      <PracticeCell labId={1} cellId="concept-1" code={`import statistics

def my_mean(values: list[float]) -> float:
    return sum(values) / len(values)

nums = [4, 8, 15, 16, 23, 42]
print(my_mean(nums))              # 18.0 - hand-rolled
print(statistics.mean(nums))      # 18 - same answer, from the standard library`} expectedOutput={`18.0
18`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This lab's notebook opens with exactly three imports: <Code>import random</Code>,{" "}
        <Code>import re</Code>, and <Code>import matplotlib.pyplot as plt</Code>. <Code>re</Code>{" "}
        is Python's regex module - it's what <Code>tokenize</Code> uses to pull words out of raw
        sentences (Concept 2, below). <Code>random</Code> provides{" "}
        <Code>random.choices</Code>, which <Code>sample_next_word</Code> uses to weight-sample a
        word from the probability distribution - the same "roll the dice according to these odds"
        step a real LLM performs when temperature is greater than 0. And{" "}
        <Code>matplotlib.pyplot</Code>, conventionally aliased to <Code>plt</Code> so you don't
        have to type the full name every time, is the plotting library behind the bar chart at the
        end of <Code>project.py</Code> (Concept 6, below). None of these are things you'd want to
        build from scratch - a correct regex engine and a plotting library are exactly the kind of
        infrastructure <Code>import</Code> lets every Python program share.
      </Text>

      <Heading size="sm">Concept 2: turning text into tokens with regex</Heading>
      <Text>
        Before you can count words, you have to decide what counts as a "word." The string{" "}
        <Code>"The Movie, was great!"</Code> has capital letters and punctuation glued to it -{" "}
        <Code>"Movie,"</Code> and <Code>"movie"</Code> should count as the same word. A{" "}
        <Code>regex</Code> (regular expression) is a tiny pattern language for describing "shapes"
        of text so you can pull matching pieces out of a bigger string.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Forget language for a second. Say you have a messy string of prices scraped from a
        webpage and you just want the numbers:
      </Text>
      <RunnableExample labId={1} code={`import re

text = "apples: $3, bananas: $1, a gift bag (free!)"
numbers = re.findall(r"[0-9]+", text)
print(numbers)  # ['3', '1']`} />
      <Text>
        <Code>re.findall(pattern, text)</Code> scans the string and returns every non-overlapping
        chunk that matches <Code>pattern</Code>. <Code>[0-9]+</Code> means "one or more digit
        characters in a row." It completely ignores everything that isn't a digit - the dollar
        signs, the colons, the words - which is exactly the point: you describe what you want, not
        what you want to skip.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell pulling hashtags out of a post with{" "}
        <Code>re.findall</Code> - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`import re

post = "Loved the #SunsetHike, best #hiking trip of the #Summer2024!"
hashtags = re.findall(r"#[A-Za-z0-9]+", post)
print(hashtags)  # ['#SunsetHike', '#hiking', '#Summer2024']`}
      </Code>
      <PracticeCell labId={1} cellId="concept-2" code={`import re

post = "Loved the #SunsetHike, best #hiking trip of the #Summer2024!"
hashtags = re.findall(r"#[A-Za-z0-9]+", post)
print(hashtags)  # ['#SunsetHike', '#hiking', '#Summer2024']`} expectedOutput={`['#SunsetHike', '#hiking', '#Summer2024']`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>tokenize</Code> function does the same trick, but with letters instead of
        digits: <Code>re.findall(r"[a-z]+", sentence.lower())</Code>. Lowercasing first means{" "}
        <Code>"Movie"</Code> and <Code>"movie"</Code> become identical strings, and{" "}
        <Code>[a-z]+</Code> grabs runs of letters while silently dropping commas, periods, and
        exclamation marks. This is the same job a real LLM's tokenizer does (just with a much
        richer vocabulary of sub-word pieces instead of whole words) - splitting free-form text
        into the discrete units the model actually counts and predicts over.
      </Text>

      <Heading size="sm">Concept 3: counting things with a dictionary</Heading>
      <Text>
        A Python <Code>dict</Code> maps keys to values, and it's the natural tool any time you
        need to tally "how many of each thing."
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>Imagine counting fruit in a basket:</Text>
      <RunnableExample labId={1} code={`basket = ["apple", "pear", "apple", "apple", "pear", "fig"]

counts: dict[str, int] = {}
for fruit in basket:
    counts[fruit] = counts.get(fruit, 0) + 1

print(counts)  # {'apple': 3, 'pear': 2, 'fig': 1}`} />
      <Text>
        <Code>counts.get(fruit, 0)</Code> reads "give me the current count for this fruit, or 0 if
        we've never seen it before" - that's what lets the loop work whether the key already
        exists or not. Adding 1 and writing it back is the entire counting algorithm.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell that tallies letters in a word the
        same way - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`word = "mississippi"

letter_counts: dict[str, int] = {}
for letter in word:
    letter_counts[letter] = letter_counts.get(letter, 0) + 1

print(letter_counts)  # {'m': 1, 'i': 4, 's': 4, 'p': 2}`}
      </Code>
      <PracticeCell labId={1} cellId="concept-3" code={`word = "mississippi"

letter_counts: dict[str, int] = {}
for letter in word:
    letter_counts[letter] = letter_counts.get(letter, 0) + 1

print(letter_counts)  # {'m': 1, 'i': 4, 's': 4, 'p': 2}`} expectedOutput={`{'m': 1, 'i': 4, 's': 4, 'p': 2}`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>word_counts</Code> function is precisely this loop, just counting tokens
        instead of fruit: it tokenizes every sentence and tallies each word into a{" "}
        <Code>dict[str, int]</Code>. Every large language model starts its training the same
        way - a giant tally of how often each token appears across billions of words - before
        anything resembling "intelligence" enters the picture.
      </Text>

      <Heading size="sm">Concept 4: from counts to a probability distribution</Heading>
      <Text>
        A probability distribution is just a set of numbers that (a) are all between 0 and 1 and
        (b) add up to exactly 1.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Think of a six-sided die: each face has probability <Code>1/6</Code>, and{" "}
        <Code>1/6 * 6 = 1</Code>. If you rolled a die 60 times and it came up "3" twenty times, you
        could estimate <Code>P(3) ≈ 20/60 ≈ 0.333</Code> - count divided by total rolls.
      </Text>
      <RunnableExample labId={1} code={`roll_counts = {1: 8, 2: 11, 3: 20, 4: 9, 5: 7, 6: 5}
total = sum(roll_counts.values())  # 60
distribution = {face: c / total for face, c in roll_counts.items()}
print(distribution[3])  # 0.333...
print(sum(distribution.values()))  # 1.0`} />

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 4 practice" cell normalizing poll counts into a
        distribution - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`poll_counts = {"pizza": 12, "tacos": 18, "sushi": 10}
total = sum(poll_counts.values())  # 40
distribution = {food: c / total for food, c in poll_counts.items()}
print(distribution["tacos"])          # 0.45
print(sum(distribution.values()))     # 1.0`}
      </Code>
      <PracticeCell labId={1} cellId="concept-4" code={`poll_counts = {"pizza": 12, "tacos": 18, "sushi": 10}
total = sum(poll_counts.values())  # 40
distribution = {food: c / total for food, c in poll_counts.items()}
print(distribution["tacos"])          # 0.45
print(sum(distribution.values()))     # 1.0`} expectedOutput={`0.45
1.0`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>word_probabilities</Code> applies exactly this normalization to word counts: divide
        every count by the sum of all counts, and the raw frequencies become a valid distribution
        over your vocabulary. This is precisely what sits behind an LLM's output layer at every
        single generation step - a distribution over every possible next token, produced (in a
        real model) by a "softmax" function instead of simple division, but conceptually the same
        normalize-so-it-sums-to-1 idea.
      </Text>

      <Heading size="sm">Concept 5: sorting to find the top-k</Heading>
      <Text>
        Once you have a distribution, a common next question is "what are the most likely
        outcomes?"
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Python's <Code>sorted()</Code> takes a <Code>key</Code> function that tells it what to
        sort by, and <Code>reverse=True</Code> flips it to descending order:
      </Text>
      <RunnableExample labId={1} code={`scores = {"alice": 91, "bob": 78, "cara": 95}
ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
print(ranked[:2])  # [('cara', 95), ('alice', 91)]`} />

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 5 practice" cell ranking game runtimes with the same{" "}
        <Code>sorted(..., key=..., reverse=True)</Code> pattern - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`runtimes = {"level1": 42.1, "level2": 30.5, "level3": 55.8}
fastest = sorted(runtimes.items(), key=lambda item: item[1])[:2]
print(fastest)  # [('level2', 30.5), ('level1', 42.1)]`}
      </Code>
      <PracticeCell labId={1} cellId="concept-5" code={`runtimes = {"level1": 42.1, "level2": 30.5, "level3": 55.8}
fastest = sorted(runtimes.items(), key=lambda item: item[1])[:2]
print(fastest)  # [('level2', 30.5), ('level1', 42.1)]`} expectedOutput={`[('level2', 30.5), ('level1', 42.1)]`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>top_k</Code> sorts a <Code>(word, probability)</Code> distribution the same way and
        slices the first <Code>k</Code> entries. "Greedy decoding" - one of the two ways an LLM
        turns a distribution into an actual word - is just <Code>top_k(distribution, 1)</Code>:
        always take the single most probable next token.
      </Text>

      <Heading size="sm">Concept 6: plotting with matplotlib</Heading>
      <Text>
        A distribution is easier to feel in a picture than in a list of numbers, and{" "}
        <Code>matplotlib</Code> is Python's standard plotting library.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Say you surveyed people's favorite color and want to see the results as a bar chart:
      </Text>
      <RunnableExample labId={1} code={`import matplotlib.pyplot as plt

colors = ["red", "blue", "green"]
votes = [8, 15, 5]

plt.bar(colors, votes, color=colors)
plt.ylabel("votes")
plt.title("Favorite color survey")
plt.savefig("colors.png")
plt.show()`} />
      <Text>
        <Code>plt.bar(labels, heights)</Code> draws one bar per label, as tall as its
        corresponding number. <Code>ylabel</Code> and <Code>title</Code> label the axis and the
        whole chart, and <Code>plt.savefig(...)</Code> writes the finished figure to an image file
        instead of (or in addition to) popping up a window.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 6 practice" cell plotting a small bar chart with{" "}
        <Code>plt.bar</Code> - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`import matplotlib.pyplot as plt

topics = ["regex", "dicts", "sorting"]
votes = [6, 9, 4]

plt.bar(topics, votes, color="salmon")
plt.ylabel("votes")
plt.title("Favorite practice topic")
plt.show()
print(topics[votes.index(max(votes))])  # dicts`}
      </Code>
      <PracticeCell labId={1} cellId="concept-6" code={`import matplotlib.pyplot as plt

topics = ["regex", "dicts", "sorting"]
votes = [6, 9, 4]

plt.bar(topics, votes, color="salmon")
plt.ylabel("votes")
plt.title("Favorite practice topic")
plt.show()
print(topics[votes.index(max(votes))])  # dicts`} />

      <Text fontSize="sm" color="gray.500">
        Further reading: IBM Think -{" "}
        <Link href="https://www.ibm.com/think/topics/llm-temperature" isExternal color="blue.500">
          What is LLM temperature?
        </Link>{" "}
        explains how a model's output distribution is turned into greedy picks or random samples,
        and how "temperature" reshapes that distribution.
      </Text>

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>project.py</Code> does the same thing with real numbers: it takes the top 15{" "}
        <Code>(word, probability)</Code> pairs from <Code>top_k(dist, 15)</Code> and calls{" "}
        <Code>plt.bar(words, probs, color="steelblue")</Code>, rotates the word labels on the
        x-axis so long ones don't overlap, and saves the result to{" "}
        <Code>word_distribution.png</Code>. The chart turns "the model's output distribution" from
        an abstract phrase into a literal picture: the tallest bar is exactly what greedy decoding
        would pick, and every bar's height is exactly the weight <Code>sample_next_word</Code> uses
        to sample a word at random.
      </Text>

    </VStack>
  );
}
