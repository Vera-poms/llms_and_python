import { Heading, Link, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab18Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">Embeddings: three Python ideas behind "meaning as numbers"</Heading>
      <Text>
        Searching a document for the exact word "cook" misses the sentence "she makes bread". A
        computer needs a way to compare <b>meaning</b>, not spelling. The trick is an{" "}
        <b>embedding</b>: a list of numbers that stands for the meaning of a word or a sentence.
        Texts with similar meaning get lists that are close together. The comparison itself needs
        only three ordinary Python ideas, and none of them is LLM-specific.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <b>Pairing up lists</b> with <Code>zip</Code>, and the dot product
        </ListItem>
        <ListItem>
          <b>Length</b> of a list of numbers, with <Code>math.sqrt</Code>
        </ListItem>
        <ListItem>
          <b>Averaging and picking the best</b> - <Code>zip(*...)</Code>, <Code>max</Code> and <Code>.index</Code>
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Idea 1: pairing up two lists - the dot product</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        <Code>zip(a, b)</Code> walks two lists side by side and hands you the items that sit in the
        same position as pairs. If you multiply each pair and add up the results, you get the{" "}
        <b>dot product</b>.
      </Text>
      <RunnableExample labId={18} code={`a = [1, 2]
b = [3, 4]
print(list(zip(a, b)))                   # [(1, 3), (2, 4)]
print(sum(x * y for x, y in zip(a, b)))  # 11`} />
      <Text>Here is what each line does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>zip(a, b)</Code> pairs the first items together and the second items together. Wrap
          it in <Code>list(...)</Code> to see the pairs: <Code>[(1, 3), (2, 4)]</Code>.
        </ListItem>
        <ListItem>
          <Code>x * y for x, y in zip(a, b)</Code> multiplies each pair: 1 times 3 is 3, and 2 times
          4 is 8.
        </ListItem>
        <ListItem>
          <Code>sum(...)</Code> adds them up: 3 + 8 = 11. That is the dot product.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has an "Idea 1 practice" cell for this - run it before moving on.
      </Text>
      <PracticeCell labId={18} cellId="concept-1" code={`a = [2, 0, 1]
b = [1, 5, 4]
print(sum(x * y for x, y in zip(a, b)))  # expected output: 6`} expectedOutput={`6`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The pairs are (2, 1), (0, 5) and (1, 4).
        </ListItem>
        <ListItem>
          Multiplying each pair gives 2, 0 and 4. The 0 is a good reminder: a position where one
          list has nothing adds nothing.
        </ListItem>
        <ListItem>
          Adding them gives 6.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>6</Code>. Try changing <Code>b</Code> to{" "}
        <Code>[1, 5, 0]</Code>. The answer drops to 2, because the last pair now adds nothing.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: meaning as numbers</Heading>
      <Text>
        A computer cannot compare meaning, but it can compare numbers. So each word gets a <b>vector</b>: a list of numbers. Picture the vector as an arrow. Each number says how far the arrow goes in one direction, and here each direction is a kind of meaning.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          In the toy table below each word has 2 numbers: how much it means "food" and how much it means "sport". So <Code>[1.0, 0.0]</Code> is all food.
        </ListItem>
        <ListItem>
          Words with similar meaning get similar numbers, and their arrows point the same way.
        </ListItem>
        <ListItem>
          The dot product is large when two arrows point the same way, and 0 when they have nothing in common.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. A small function works out the dot product of two vectors. A loop then compares the word <Code>bread</Code> with every word in the table.
      </Text>
      <RunnableExample labId={18} code={`def dot(a, b):
    total = 0
    for x, y in zip(a, b):
        total = total + x * y
    return total


WORDS = {"bread": [1.0, 0.0], "soup": [0.9, 0.1], "run": [0.0, 1.0]}  # [food, sport]
query = WORDS["bread"]
for word in WORDS:
    print(word, "->", round(dot(query, WORDS[word]), 2))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>dot</Code> loops over the pairs, multiplies each pair and adds it to <Code>total</Code>. That is the dot product from above, now inside a function.
        </ListItem>
        <ListItem>
          <Code>bread</Code> against itself gives 1.0. <Code>soup</Code> is almost all food too, so it gives 0.9.
        </ListItem>
        <ListItem>
          <Code>run</Code> is all sport, so it gives 0.0. Nothing is shared with <Code>bread</Code>. A bigger number means closer in meaning.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same function with a new table and the word <Code>jog</Code> as the query. The first number now means food and the second means sport.
      </Text>
      <PracticeCell labId={18} cellId="topic-1" code={`def dot(a, b):
    total = 0
    for x, y in zip(a, b):
        total = total + x * y
    return total


WORDS = {"tea": [0.8, 0.2], "goal": [0.1, 0.9], "jog": [0.0, 1.0]}
query = WORDS["jog"]
for word in WORDS:
    print(word, "->", round(dot(query, WORDS[word]), 2))`} expectedOutput={`tea -> 0.2
goal -> 0.9
jog -> 1.0`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>jog</Code> is <Code>[0.0, 1.0]</Code>, so it is all sport.
        </ListItem>
        <ListItem>
          <Code>tea</Code> is <Code>[0.8, 0.2]</Code>. Multiplying the pairs gives 0.0 and 0.2, so the score is 0.2.
        </ListItem>
        <ListItem>
          <Code>goal</Code> is <Code>[0.1, 0.9]</Code>, mostly sport. The pairs give 0.0 and 0.9, so the score is 0.9. <Code>jog</Code> against itself is 1.0.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>tea -&gt; 0.2</Code>, <Code>goal -&gt; 0.9</Code> and <Code>jog -&gt; 1.0</Code>. The sport words score high and the food word scores low.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The project gives every word a vector of 5 numbers: how much it means food, tech, sport, travel and school, in that order. For example <Code>WORD_VECTORS["bread"]</Code> is <Code>[1.0, 0.0, 0.0, 0.0, 0.0]</Code>. Only some words are in the table. Words like <Code>she</Code> or <Code>does</Code> are not.
      </Text>
      <Text>
        The dot product is the first half of the lab's <Code>cosine_similarity</Code>. The second half is the length, which is next.
      </Text>

      <Heading as="h3" size="sm">Idea 2: the length of a list of numbers</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        The length of an arrow is the square root of the sum of its squares. <Code>math.sqrt</Code>{" "}
        gives the square root: <Code>math.sqrt(16)</Code> is 4.0, because 4 times 4 is 16.
      </Text>
      <RunnableExample labId={18} code={`import math
print(math.sqrt(16))                      # 4.0
v = [3, 4]
print(math.sqrt(sum(x * x for x in v)))   # 5.0`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>import math</Code> brings in Python's maths tools. You use them as{" "}
          <Code>math.something</Code>.
        </ListItem>
        <ListItem>
          <Code>x * x for x in v</Code> squares each number: 9 and 16. <Code>sum</Code> adds them to
          25.
        </ListItem>
        <ListItem>
          <Code>math.sqrt(25)</Code> is 5.0. So the arrow <Code>[3, 4]</Code> is 5 long. It is the
          long side of a triangle with sides 3 and 4.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has an "Idea 2 practice" cell for this - run it before moving on.
      </Text>
      <PracticeCell labId={18} cellId="concept-2" code={`import math
v = [6, 8]
print(math.sqrt(sum(x * x for x in v)))  # expected output: 10.0`} expectedOutput={`10.0`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          6 squared is 36 and 8 squared is 64. Together they make 100.
        </ListItem>
        <ListItem>
          <Code>math.sqrt(100)</Code> is 10.0. Note it is a decimal number, not 10.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>10.0</Code>. Try <Code>[5, 12]</Code>. You should get{" "}
        <Code>13.0</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: direction matters, size does not</Heading>
      <Text>
        A long text can give a long arrow, and a long arrow gives a big dot product even when it points the wrong way. Meaning is about direction, not size. Dividing the dot product by both lengths removes the size and leaves only the direction. That is <b>cosine similarity</b>.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>1.0</Code> - same direction. Very close in meaning.
        </ListItem>
        <ListItem>
          <Code>0.0</Code> - a right angle. Nothing in common.
        </ListItem>
        <ListItem>
          <Code>-1.0</Code> - opposite directions.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. The question is about food, <Code>[1.0, 0.0]</Code>. Two documents are compared with it: a short note about food and a long essay about sport. For each one the loop prints the raw dot product and the direction-only score.
      </Text>
      <RunnableExample labId={18} code={`import math


def length(v):
    return math.sqrt(sum(x * x for x in v))


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


query = [1.0, 0.0]  # a question about food
docs = {"short food note": [0.9, 0.1], "long sport essay": [2.0, 6.0]}
for name in docs:
    d = docs[name]
    direction = dot(query, d) / (length(query) * length(d))
    print(name, "-> raw dot:", round(dot(query, d), 2), "direction only:", round(direction, 3))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>length</Code> is the square root of the sum of the squares, as above. The direction-only score is the dot product divided by the two lengths.
        </ListItem>
        <ListItem>
          The long sport essay has big numbers, so its raw dot is 2.0. That is more than the 0.9 of the food note. Judged by the raw dot, the wrong document wins.
        </ListItem>
        <ListItem>
          By direction the food note scores 0.994 and the sport essay only 0.316. The right document wins.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on a question about sport, <Code>[0.0, 1.0]</Code>, with a short sport note and a long food essay.
      </Text>
      <PracticeCell labId={18} cellId="topic-2" code={`import math


def length(v):
    return math.sqrt(sum(x * x for x in v))


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


query = [0.0, 1.0]  # a question about sport
docs = {"short sport note": [0.2, 0.8], "long food essay": [5.0, 3.0]}
for name in docs:
    d = docs[name]
    direction = dot(query, d) / (length(query) * length(d))
    print(name, "-> raw dot:", round(dot(query, d), 2), "direction only:", round(direction, 3))`} expectedOutput={`short sport note -> raw dot: 0.8 direction only: 0.97
long food essay -> raw dot: 3.0 direction only: 0.514`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The short sport note is <Code>[0.2, 0.8]</Code>. Its raw dot with the question is 0.8, and its length is about 0.825, so its direction score is 0.97.
        </ListItem>
        <ListItem>
          The long food essay is <Code>[5.0, 3.0]</Code>. Its raw dot is 3.0, bigger than 0.8. Its length is about 5.83, so its direction score is only 0.514.
        </ListItem>
        <ListItem>
          Again the raw dot picks the wrong one and the direction picks the right one.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>short sport note -&gt; raw dot: 0.8 direction only: 0.97</Code>, then <Code>long food essay -&gt; raw dot: 3.0 direction only: 0.514</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>cosine_similarity</Code> does this: the dot product of the two vectors divided by their lengths. A vector of all zeros has length 0, and you cannot divide by 0. The lab gives back <Code>0.0</Code> in that case instead of crashing.
      </Text>
      <Text>
        This is why the project scores are on one scale, from -1 to 1. The best facts in the project score 1.000, 1.000 and 0.999, no matter how many words each fact has.
      </Text>

      <Heading as="h3" size="sm">Idea 3: averaging vectors, and picking the best score</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        <Code>zip(*vectors)</Code> flips a list of lists on its side: it hands you all the first
        numbers together, then all the second numbers, and so on. The <Code>*</Code> unpacks the
        list into separate pieces for <Code>zip</Code>. Averaging each of those groups gives the
        average vector. For picking the best, <Code>max</Code> finds the highest score and{" "}
        <Code>.index</Code> says where it sits in the list.
      </Text>
      <RunnableExample labId={18} code={`vectors = [[1, 0], [3, 2]]
print(list(zip(*vectors)))                              # [(1, 3), (0, 2)]
print([sum(c) / len(vectors) for c in zip(*vectors)])   # [2.0, 1.0]
scores = [0.2, 0.9, 0.4]
print(scores.index(max(scores)))                        # 1`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>zip(*vectors)</Code> gives <Code>(1, 3)</Code> (the first numbers) and{" "}
          <Code>(0, 2)</Code> (the second numbers).
        </ListItem>
        <ListItem>
          For each group <Code>c</Code>, <Code>sum(c) / len(vectors)</Code> is its average: 4 / 2 =
          2.0 and 2 / 2 = 1.0.
        </ListItem>
        <ListItem>
          <Code>max(scores)</Code> is 0.9. <Code>scores.index(0.9)</Code> is 1, because counting
          starts at 0 and 0.9 is the second item.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has an "Idea 3 practice" cell for this - run it before moving on.
      </Text>
      <PracticeCell labId={18} cellId="concept-3" code={`vectors = [[2, 4], [4, 0], [0, 2]]
print([sum(c) / len(vectors) for c in zip(*vectors)])  # expected output: [2.0, 2.0]
scores = [0.1, 0.7, 0.3]
print(scores.index(max(scores)))                       # expected output: 1`} expectedOutput={`[2.0, 2.0]
1`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The first numbers are 2, 4 and 0. Their sum is 6, divided by 3 vectors gives 2.0.
        </ListItem>
        <ListItem>
          The second numbers are 4, 0 and 2. Their sum is 6 too, so that average is also 2.0.
        </ListItem>
        <ListItem>
          The highest of the three scores is 0.7, and it is the second item, so{" "}
          <Code>.index</Code> gives 1.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>[2.0, 2.0]</Code> and then <Code>1</Code>. Try changing the
        score list so the first item is the biggest. The index should become 0.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: finding a match with no shared words</Heading>
      <Text>
        A search for the exact word "cook" misses "She bakes bread". Embeddings fix that. A whole sentence gets one vector, made by averaging the vectors of its words. Then the best match is the fact whose vector points the most the same way as the question's.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The question and the fact do not need a single word in common.
        </ListItem>
        <ListItem>
          Real embeddings are not hand-made. A trained model produces them, with hundreds or thousands of numbers per text, and the directions are not neat labels like "food". The comparison is the same one you write here.
        </ListItem>
        <ListItem>
          Once you have many vectors, you keep them in a <b>vector database</b>, which is the next lab.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. Three small functions: <Code>embed</Code> averages the vectors of the known words in a text, <Code>cosine</Code> scores two vectors by direction, and <Code>shared_words</Code> counts the words two texts have in common. A loop scores two facts for the question <Code>food to cook</Code>.
      </Text>
      <RunnableExample labId={18} code={`import math

WORDS = {"food": [1.0, 0.0], "cook": [0.9, 0.1], "bread": [1.0, 0.0], "soup": [0.9, 0.0], "run": [0.0, 1.0], "park": [0.1, 0.9]}


def embed(text):
    total = [0.0, 0.0]
    count = 0
    for word in text.lower().split():
        if word in WORDS:
            for i in range(2):
                total[i] = total[i] + WORDS[word][i]
            count = count + 1
    return [x / count for x in total]


def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))


def shared_words(a, b):
    count = 0
    for word in a.lower().split():
        if word in b.lower().split():
            count = count + 1
    return count


question = "food to cook"
for fact in ["bread and soup", "run in park"]:
    score = cosine(embed(question), embed(fact))
    print(fact, "-> shared words:", shared_words(question, fact), "meaning score:", round(score, 2))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Words that are not in the table, like <Code>to</Code> and <Code>and</Code>, are skipped. The question becomes the average of <Code>food</Code> and <Code>cook</Code>.
        </ListItem>
        <ListItem>
          Neither fact shares a single word with the question, so a word search finds nothing: 0 shared words twice.
        </ListItem>
        <ListItem>
          By meaning, <Code>bread and soup</Code> scores 1.0 because its words are food words. <Code>run in park</Code> scores 0.1. The meaning score finds the right fact.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same functions on a new question, <Code>jog in the park</Code>, and two new facts.
      </Text>
      <PracticeCell labId={18} cellId="topic-3" code={`import math

WORDS = {"food": [1.0, 0.0], "cook": [0.9, 0.1], "bread": [1.0, 0.0], "soup": [0.9, 0.0], "run": [0.0, 1.0], "park": [0.1, 0.9]}


def embed(text):
    total = [0.0, 0.0]
    count = 0
    for word in text.lower().split():
        if word in WORDS:
            for i in range(2):
                total[i] = total[i] + WORDS[word][i]
            count = count + 1
    return [x / count for x in total]


def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))


def shared_words(a, b):
    count = 0
    for word in a.lower().split():
        if word in b.lower().split():
            count = count + 1
    return count


question = "jog in the park"
for fact in ["soup for lunch", "run fast"]:
    score = cosine(embed(question), embed(fact))
    print(fact, "-> shared words:", shared_words(question, fact), "meaning score:", round(score, 2))`} expectedOutput={`soup for lunch -> shared words: 0 meaning score: 0.11
run fast -> shared words: 0 meaning score: 0.99`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Only <Code>park</Code> is in the table, so the question's vector is the one for <Code>park</Code>: mostly sport.
        </ListItem>
        <ListItem>
          <Code>soup for lunch</Code> has only the food word <Code>soup</Code>, so it scores 0.11. <Code>run fast</Code> has the sport word <Code>run</Code>, so it scores 0.99.
        </ListItem>
        <ListItem>
          No fact shares a word with the question, so both counts are 0. Only the meaning score tells them apart.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>soup for lunch -&gt; shared words: 0 meaning score: 0.11</Code>, then <Code>run fast -&gt; shared words: 0 meaning score: 0.99</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The project averages the 5-number vectors of the known words in a sentence, in your <Code>embed</Code>. Then every one of the 6 facts about Ada is a vector, and so is the question. Scoring the question against each fact with <Code>cosine_similarity</Code> and taking the highest score with <Code>max</Code> and <Code>.index</Code> finds the fact that is closest in meaning.
      </Text>
      <Text>
        Here is how it looks for the question "What food does she cook?":
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Only <Code>food</Code> and <Code>cook</Code> are in the word table. Both point mostly in the "food" direction, so the question's vector does too.
        </ListItem>
        <ListItem>
          The fact "She bakes bread and cooks spicy soup on weekends." has food words, so its vector points the same way. The score is close to 1.0.
        </ListItem>
        <ListItem>
          The fact about running has sport words. Its vector points elsewhere, so the score is close to 0.
        </ListItem>
      </UnorderedList>
      <Text>
        The three questions of the project find three different facts, with scores of 1.000, 1.000 and 0.999.
      </Text>

      <Heading as="h3" size="sm">Further reading</Heading>
      <Text>
        Google:{" "}
        <Link href="https://developers.google.com/machine-learning/crash-course/embeddings" isExternal color="blue.500">
          Machine Learning Crash Course - Embeddings
        </Link>
      </Text>
      <Text>
        Jay Alammar:{" "}
        <Link href="https://jalammar.github.io/illustrated-word2vec/" isExternal color="blue.500">
          The Illustrated Word2vec
        </Link>
      </Text>
    </VStack>
  );
}
