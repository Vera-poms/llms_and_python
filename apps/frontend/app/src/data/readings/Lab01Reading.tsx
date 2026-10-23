import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab01Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">Why probability?</Heading>
      <Text>
        An LLM never "knows" the next word for certain. At every step it produces a probability
        distribution over its entire vocabulary - a number for every possible next token that all
        add up to 1 - and then either takes the highest one (greedy decoding) or samples from the
        distribution (what "temperature" controls). Everything else in this course sits on top of
        that one idea, so we build the whole pipeline from scratch, on real text, in this lab.
      </Text>

      <Heading as="h3" size="sm">Concept 1: Python modules and imports</Heading>
      <Text>
        Every file in this course opens with a handful of <Code>import</Code> lines before any
        real logic starts - worth understanding before anything else, since the rest of this lab
        leans on them immediately.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
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
      <Text>Here is what each line of that example does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>import math</Code> - loads the math tools. After this line you can write{" "}
          <Code>math.sqrt</Code>, <Code>math.pi</Code> and more. The name before the dot says
          which toolbox the tool comes from.
        </ListItem>
        <ListItem>
          <Code>def my_sqrt(...)</Code> - your own square root. It starts with a guess and
          improves the guess 20 times. It works, but it took you 5 lines and it is a little bit
          off.
        </ListItem>
        <ListItem>
          <Code>print(math.sqrt(2))</Code> - the ready-made tool gives the answer in one line.
        </ListItem>
      </UnorderedList>
      <Text>
        There are three ways to write an import. They all do the same job. They only change how
        you type the name later:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>import math</Code> - then you write <Code>math.sqrt(2)</Code>.
        </ListItem>
        <ListItem>
          <Code>from math import sqrt</Code> - then you write just <Code>sqrt(2)</Code>.
        </ListItem>
        <ListItem>
          <Code>import matplotlib.pyplot as plt</Code> - <Code>as plt</Code> gives the toolbox a
          short nickname, so you write <Code>plt.bar(...)</Code> and not{" "}
          <Code>matplotlib.pyplot.bar(...)</Code>.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell comparing a hand-rolled mean to{" "}
        <Code>statistics.mean</Code> - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>import statistics</Code> loads another toolbox. It has tools for averages.
        </ListItem>
        <ListItem>
          <Code>my_mean</Code> is the hand-made version. <Code>sum(values)</Code> adds the numbers
          up: <Code>4 + 8 + 15 + 16 + 23 + 42 = 108</Code>. <Code>len(values)</Code> counts them: 6. Then 108 /
          6 = 18.0.
        </ListItem>
        <ListItem>
          <Code>statistics.mean(nums)</Code> does the same job in one call. It prints{" "}
          <Code>18</Code> and not <Code>18.0</Code>. The value is the same. Only the way it is
          written is a little different.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> two lines, <Code>18.0</Code> and then <Code>18</Code>. Press{" "}
        <b>Run</b> to check. Then try changing a number in <Code>nums</Code> and run it again. Both
        answers should change together.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
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
      <Text>
        Look at the top of the notebook. You will see these three lines near the top, and you do
        not need to change them. When the notebook runs, they load the toolboxes first. After that
        every function in the lab can use <Code>re</Code>, <Code>random</Code> and{" "}
        <Code>plt</Code>. If you ever see <Code>NameError: name 're' is not defined</Code>, it
        usually means the cell with the imports was not run yet. Run it first, then try again.
      </Text>

      <Heading as="h3" size="sm">Concept 2: turning text into tokens with regex</Heading>
      <Text>
        Before you can count words, you have to decide what counts as a "word." The string{" "}
        <Code>"The Movie, was great!"</Code> has capital letters and punctuation glued to it -{" "}
        <Code>"Movie,"</Code> and <Code>"movie"</Code> should count as the same word. A{" "}
        <Code>regex</Code> (regular expression) is a tiny pattern language for describing "shapes"
        of text so you can pull matching pieces out of a bigger string.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
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
      <Text>Here is how <Code>re.findall</Code> reads the text, one step at a time:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          It starts at the first character and looks for the pattern. The first{" "}
          <Code>a</Code> of "apples" is not a digit, so it moves on.
        </ListItem>
        <ListItem>
          At <Code>3</Code> it finds a digit. It keeps going while the next character is also a
          digit. The next character is <Code>,</Code>, so the match stops. It saves{" "}
          <Code>"3"</Code>.
        </ListItem>
        <ListItem>
          It keeps scanning to the end of the text. The next match is <Code>"1"</Code>. The result
          is <Code>['3', '1']</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        The pattern uses a few small symbols. You only need these three for the lab:{" "}
        <Code>[0-9]</Code> means "any one digit", <Code>[a-z]</Code> means "any one lowercase
        letter", and <Code>+</Code> means "one or more of the thing before me, in a row". The{" "}
        <Code>r</Code> before the quote marks (<Code>r"..."</Code>) tells Python to leave the
        backslashes and brackets alone. It is a good habit for every pattern.
      </Text>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell pulling hashtags out of a post with{" "}
        <Code>re.findall</Code> - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`import re

post = "Loved the #SunsetHike, best #hiking trip of the #Summer2024!"
hashtags = re.findall(r"#[A-Za-z0-9]+", post)
print(hashtags)  # ['#SunsetHike', '#hiking', '#Summer2024']`}
      </Code>
      <PracticeCell labId={1} cellId="concept-2" code={`import re

post = "Loved the #SunsetHike, best #hiking trip of the #Summer2024!"
hashtags = re.findall(r"#[A-Za-z0-9]+", post)
print(hashtags)  # ['#SunsetHike', '#hiking', '#Summer2024']`} expectedOutput={`['#SunsetHike', '#hiking', '#Summer2024']`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>post</Code> is a sentence with three hashtags hidden in it.
        </ListItem>
        <ListItem>
          The pattern <Code>#[A-Za-z0-9]+</Code> reads as: a <Code>#</Code> sign, then one or more
          letters (big or small) or digits in a row. The hashtag stops at the first space or
          punctuation mark.
        </ListItem>
        <ListItem>
          That is why <Code>#SunsetHike,</Code> gives <Code>'#SunsetHike'</Code>. The comma is not
          a letter or digit, so it is left out.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> a list with the three hashtags. Try changing the pattern to{" "}
        <Code>r"[A-Za-z]+"</Code> and run it again. You get every word now, and the{" "}
        <Code>#</Code> signs and digits are gone.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>tokenize</Code> function does the same trick, but with letters instead of
        digits: <Code>re.findall(r"[a-z]+", sentence.lower())</Code>. Lowercasing first means{" "}
        <Code>"Movie"</Code> and <Code>"movie"</Code> become identical strings, and{" "}
        <Code>[a-z]+</Code> grabs runs of letters while silently dropping commas, periods, and
        exclamation marks. This is the same job a real LLM's tokenizer does (just with a much
        richer vocabulary of sub-word pieces instead of whole words) - splitting free-form text
        into the discrete units the model actually counts and predicts over.
      </Text>
      <Text>Here is <Code>tokenize</Code> on one sentence, one step at a time:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Start: <Code>"The Movie, was great!"</Code>
        </ListItem>
        <ListItem>
          After <Code>.lower()</Code>: <Code>"the movie, was great!"</Code>
        </ListItem>
        <ListItem>
          After <Code>re.findall(r"[a-z]+", ...)</Code>:{" "}
          <Code>["the", "movie", "was", "great"]</Code>. The comma and the{" "}
          <Code>!</Code> are not letters, so they are skipped.
        </ListItem>
      </UnorderedList>
      <Text>
        Two things to remember. An empty string <Code>""</Code> gives <Code>[]</Code>, because
        there is nothing to match. And <Code>"don't"</Code> becomes <Code>["don", "t"]</Code>,
        because the apostrophe is not a letter. That is fine for this lab.
      </Text>

      <Heading as="h3" size="sm">Concept 3: counting things with a dictionary</Heading>
      <Text>
        A Python <Code>dict</Code> maps keys to values, and it's the natural tool any time you
        need to tally "how many of each thing."
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
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
      <Text>Here is the loop, one fruit at a time:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>"apple"</Code>: not in <Code>counts</Code> yet, so <Code>get</Code> gives 0.{" "}
          <Code>0 + 1 = 1</Code>. Now <Code>counts</Code> is <Code>{"{'apple': 1}"}</Code>.
        </ListItem>
        <ListItem>
          <Code>"pear"</Code>: new too. <Code>{"{'apple': 1, 'pear': 1}"}</Code>.
        </ListItem>
        <ListItem>
          <Code>"apple"</Code> again: <Code>get</Code> now gives 1. <Code>1 + 1 = 2</Code>. The apple entry is
          replaced with 2.
        </ListItem>
        <ListItem>
          The rest of the basket works the same way. At the end:{" "}
          <Code>{"{'apple': 3, 'pear': 2, 'fig': 1}"}</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        A dict is like a table with two columns: the thing you look up (the <b>key</b>) and what
        you stored for it (the <b>value</b>). <Code>counts[fruit] = ...</Code> writes a row, and{" "}
        <Code>counts.get(fruit, 0)</Code> reads one safely. If you wrote{" "}
        <Code>counts[fruit]</Code> for a new fruit, Python would stop with a <Code>KeyError</Code>.
        That is why we use <Code>get</Code> with a default of 0.
      </Text>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell that tallies letters in a word the
        same way - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>for letter in word</Code> walks through <Code>"mississippi"</Code> one letter at a
          time. A string works like a list of letters.
        </ListItem>
        <ListItem>
          For each letter, <Code>letter_counts.get(letter, 0) + 1</Code> reads the old count (or 0
          if the letter is new) and adds 1.
        </ListItem>
        <ListItem>
          The word has 11 letters: 1 m, 4 i, 4 s and 2 p. <Code>1 + 4 + 4 + 2 = 11</Code>, so nothing is lost.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>{"{'m': 1, 'i': 4, 's': 4, 'p': 2}"}</Code>. The letters
        come out in the order they first showed up. Try a different word, like{" "}
        <Code>"banana"</Code>, and check the counts by hand.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>word_counts</Code> function is precisely this loop, just counting tokens
        instead of fruit: it tokenizes every sentence and tallies each word into a{" "}
        <Code>dict[str, int]</Code>. Every large language model starts its training the same
        way - a giant tally of how often each token appears across billions of words - before
        anything resembling "intelligence" enters the picture.
      </Text>
      <Text>
        The lab version has one more loop than the fruit example, because it starts with a list of
        sentences and not a list of words. Take <Code>["a b", "b c b"]</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Sentence <Code>"a b"</Code> becomes <Code>["a", "b"]</Code> with{" "}
          <Code>tokenize</Code>. The counts are <Code>{"{'a': 1, 'b': 1}"}</Code>.
        </ListItem>
        <ListItem>
          Sentence <Code>"b c b"</Code> becomes <Code>["b", "c", "b"]</Code>. The counts keep
          growing in the same dict: <Code>{"{'a': 1, 'b': 3, 'c': 1}"}</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        The key point is that you make <Code>counts</Code> once, before the loops, and keep adding
        to the same dict. If you made a new empty dict for each sentence, you would lose the
        earlier counts.
      </Text>

      <Heading as="h3" size="sm">Concept 4: from counts to a probability distribution</Heading>
      <Text>
        A probability distribution is just a set of numbers that (a) are all between 0 and 1 and
        (b) add up to exactly 1.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Think of a six-sided die: each face has probability <Code>1/6</Code>, and{" "}
        <Code>1/6 * 6 = 1</Code>. Why must it add up to 1? Because something always happens: one
        of the faces must come up, so all the chances together make 100%. If you rolled a die 60 times and it came up "3" twenty times, you
        could estimate <Code>P(3) ≈ 20/60 ≈ 0.333</Code> - count divided by total rolls.
      </Text>
      <RunnableExample labId={1} code={`roll_counts = {1: 8, 2: 11, 3: 20, 4: 9, 5: 7, 6: 5}
total = sum(roll_counts.values())  # 60
distribution = {face: c / total for face, c in roll_counts.items()}
print(distribution[3])  # 0.333...
print(sum(distribution.values()))  # 1.0`} />
      <Text>
        Here is what each line does. <Code>sum(roll_counts.values())</Code> adds the six counts:
        <Code>8 + 11 + 20 + 9 + 7 + 5 = 60</Code>. The dict comprehension{" "}
        <Code>{"{face: c / total for face, c in roll_counts.items()}"}</Code> is a short way to
        say "build a new dict. For each face and its count, store count divided by total." So face
        3 gets <Code>20 / 60 = 0.333</Code>, and face 6 gets <Code>5 / 60 = 0.083</Code>. The last line adds all the new
        values and gets 1.0. This is how you check that you did it right.
      </Text>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 4 practice" cell normalizing poll counts into a
        distribution - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>poll_counts</Code> says 12 people picked pizza, 18 picked tacos and 10 picked
          sushi.
        </ListItem>
        <ListItem>
          <Code>total</Code> is <Code>12 + 18 + 10 = 40</Code> people.
        </ListItem>
        <ListItem>
          Each count is divided by 40: pizza <Code>12/40 = 0.3</Code>, tacos <Code>18/40 = 0.45</Code>, sushi <Code>10/40 = 0.25</Code>.
        </ListItem>
        <ListItem>
          <Code>0.3 + 0.45 + 0.25 = 1.0</Code>. The first print shows the tacos chance (0.45). The second
          print shows the total (1.0).
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>0.45</Code> and then <Code>1.0</Code>. If the second
        line is not 1.0, check that you divided by the <b>total</b> and not by one of the counts.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>word_probabilities</Code> applies exactly this normalization to word counts: divide
        every count by the sum of all counts, and the raw frequencies become a valid distribution
        over your vocabulary. This is precisely what sits behind an LLM's output layer at every
        single generation step - a distribution over every possible next token, produced (in a
        real model) by a "softmax" function instead of simple division, but conceptually the same
        normalize-so-it-sums-to-1 idea.
      </Text>
      <Text>
        Take the counts <Code>{"{'a': 1, 'b': 3}"}</Code> from the lab:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>total = sum(counts.values())</Code> gives <Code>1 + 3 = 4</Code>.
        </ListItem>
        <ListItem>
          <Code>a</Code> gets <Code>1 / 4 = 0.25</Code>. <Code>b</Code> gets <Code>3 / 4 = 0.75</Code>.
        </ListItem>
        <ListItem>
          <Code>0.25 + 0.75 = 1.0</Code>, so it is a valid distribution. It also means "if I pick a random word
          from the text, there is a 75% chance it is <Code>b</Code>."
        </ListItem>
      </UnorderedList>
      <Text>
        An empty dict has a total of 0, and dividing by 0 is an error. The lab says an empty dict
        gives back <Code>{"{}"}</Code>. The dict comprehension handles this by itself, because
        with no words the division never runs.
      </Text>

      <Heading as="h3" size="sm">Concept 5: sorting to find the top-k</Heading>
      <Text>
        Once you have a distribution, a common next question is "what are the most likely
        outcomes?"
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Python's <Code>sorted()</Code> takes a <Code>key</Code> function that tells it what to
        sort by, and <Code>reverse=True</Code> flips it to descending order:
      </Text>
      <RunnableExample labId={1} code={`scores = {"alice": 91, "bob": 78, "cara": 95}
ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
print(ranked[:2])  # [('cara', 95), ('alice', 91)]`} />
      <Text>
        Here is what each part does. <Code>scores.items()</Code> turns the dict into a list of
        pairs: <Code>[('alice', 91), ('bob', 78), ('cara', 95)]</Code>.{" "}
        <Code>key=lambda item: item[1]</Code> tells <Code>sorted</Code> to look at the second part
        of each pair (the score) when it compares them. A <Code>lambda</Code> is a tiny function
        with no name. <Code>item[1]</Code> means "the item at position 1", and counting starts at
        0, so position 1 is the second part. <Code>reverse=True</Code> puts the biggest first.
        Finally <Code>[:2]</Code> keeps the first two pairs. This is called a slice.
      </Text>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 5 practice" cell ranking game runtimes with the same{" "}
        <Code>sorted(..., key=..., reverse=True)</Code> pattern - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`runtimes = {"level1": 42.1, "level2": 30.5, "level3": 55.8}
fastest = sorted(runtimes.items(), key=lambda item: item[1])[:2]
print(fastest)  # [('level2', 30.5), ('level1', 42.1)]`}
      </Code>
      <PracticeCell labId={1} cellId="concept-5" code={`runtimes = {"level1": 42.1, "level2": 30.5, "level3": 55.8}
fastest = sorted(runtimes.items(), key=lambda item: item[1])[:2]
print(fastest)  # [('level2', 30.5), ('level1', 42.1)]`} expectedOutput={`[('level2', 30.5), ('level1', 42.1)]`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>runtimes.items()</Code> gives the pairs: level1 42.1, level2 30.5, level3 55.8.
        </ListItem>
        <ListItem>
          This time there is no <Code>reverse=True</Code>, so <Code>sorted</Code> goes from the
          smallest number to the biggest: level2 (30.5), level1 (42.1), level3 (55.8).
        </ListItem>
        <ListItem>
          <Code>[:2]</Code> keeps the first two. For a speed run the smallest time is the best, so
          these are the two fastest levels.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>[('level2', 30.5), ('level1', 42.1)]</Code>. Try adding{" "}
        <Code>reverse=True</Code> and run it again. Now you get the two slowest levels.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>top_k</Code> sorts a <Code>(word, probability)</Code> distribution the same way and
        slices the first <Code>k</Code> entries. "Greedy decoding" - one of the two ways an LLM
        turns a distribution into an actual word - is just <Code>top_k(distribution, 1)</Code>:
        always take the single most probable next token.
      </Text>
      <Text>
        Take <Code>{"{'a': 0.25, 'b': 0.25, 'c': 0.5}"}</Code> with <Code>k=2</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>distribution.items()</Code> gives the pairs <Code>("a", 0.25)</Code>,{" "}
          <Code>("b", 0.25)</Code>, <Code>("c", 0.5)</Code>.
        </ListItem>
        <ListItem>
          Sorted by probability, biggest first: <Code>("c", 0.5)</Code>, then{" "}
          <Code>("a", 0.25)</Code>, then <Code>("b", 0.25)</Code>.
        </ListItem>
        <ListItem>
          <Code>[:2]</Code> keeps the first two: <Code>[("c", 0.5), ("a", 0.25)]</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        Notice that <Code>a</Code> and <Code>b</Code> tie. Python's <Code>sorted</Code> keeps tied
        items in their old order, so <Code>a</Code> stays before <Code>b</Code>. If{" "}
        <Code>k</Code> is bigger than the dict, the slice just gives you everything. It does not
        raise an error.
      </Text>

      <Heading as="h3" size="sm">Concept 6: plotting with matplotlib</Heading>
      <Text>
        A distribution is easier to feel in a picture than in a list of numbers, and{" "}
        <Code>matplotlib</Code> is Python's standard plotting library.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
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
      <Text>The steps always go in this order:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Draw: <Code>plt.bar(colors, votes, ...)</Code> puts three bars on the chart. The first
          list says what to call each bar. The second list says how tall each one is. The two
          lists must be the same length.
        </ListItem>
        <ListItem>
          Label: <Code>plt.ylabel(...)</Code> and <Code>plt.title(...)</Code> tell the reader what
          the numbers mean. A chart with no labels is hard to read.
        </ListItem>
        <ListItem>
          Show or save: <Code>plt.show()</Code> displays the chart. <Code>plt.savefig(...)</Code>{" "}
          writes it to a file. Call <Code>savefig</Code> before <Code>show</Code>, because after
          the chart is shown the page can be empty.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 6 practice" cell plotting a small bar chart with{" "}
        <Code>plt.bar</Code> - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>topics</Code> and <Code>votes</Code> are two lists in the same order: regex has 6
          votes, dicts has 9, sorting has 4.
        </ListItem>
        <ListItem>
          <Code>plt.bar(topics, votes, color="salmon")</Code> draws three pink bars. The dicts bar
          is the tallest.
        </ListItem>
        <ListItem>
          <Code>max(votes)</Code> is 9. <Code>votes.index(9)</Code> says where 9 is in the list:
          position 1. <Code>topics[1]</Code> is <Code>"dicts"</Code>. So the last line prints the
          name of the winner.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> a bar chart with three bars, and then the word{" "}
        <Code>dicts</Code> under it. Try changing a vote count so another topic wins. The chart
        and the printed name should both change.
      </Text>

      <Text fontSize="sm" color="gray.500">
        Further reading: IBM Think -{" "}
        <Link href="https://www.ibm.com/think/topics/llm-temperature" isExternal color="blue.500">
          What is LLM temperature?
        </Link>{" "}
        explains how a model's output distribution is turned into greedy picks or random samples,
        and how "temperature" reshapes that distribution.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
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
      <Text>The lab's chart code is the same four steps as the color survey:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>words, probs = zip(*top15)</Code> splits the list of pairs into two lists: one
          with the 15 words, one with their chances. This gives <Code>plt.bar</Code> the two
          same-length lists it needs.
        </ListItem>
        <ListItem>
          <Code>plt.bar(words, probs, color="steelblue")</Code> draws one bar per word.
        </ListItem>
        <ListItem>
          <Code>plt.title</Code> and <Code>plt.ylabel("P(word)")</Code> label the chart.{" "}
          <Code>P(word)</Code> is a short way to write "the chance of this word".
        </ListItem>
        <ListItem>
          <Code>plt.xticks(rotation=45, ha="right")</Code> tilts the word labels so long words do
          not run into each other. <Code>plt.show()</Code> then draws the chart.
        </ListItem>
      </UnorderedList>
      <Text>
        When you see the chart, look for two things. The tallest bar is the word that{" "}
        <Code>top_k(dist, 1)</Code> picks. And the bars are not all the same height, so a random
        pick from <Code>sample_next_word</Code> will often be a tall-bar word, but sometimes a
        short-bar word too.
      </Text>

    </VStack>
  );
}
