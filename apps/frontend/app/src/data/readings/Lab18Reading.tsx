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

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        A list of numbers like <Code>[0.9, 0.0, 0.1]</Code> is called a <b>vector</b>. Picture it as
        an arrow, and each number tells how far the arrow goes in one direction. Here the
        directions are meanings: how much a word means "food", how much "sport", and so on. Two
        words with similar meanings have arrows that point the same way. The dot product is large
        when two arrows point the same way and zero when they have nothing in common. It is the
        first half of the lab's <Code>cosine_similarity</Code>.
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

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        Why do we need the length? Compare a short arrow and a long arrow that point the same way.
        Their meaning is the same, but the long one gives a bigger dot product. Dividing the dot
        product by both lengths removes that size effect and leaves only the direction. That is{" "}
        <b>cosine similarity</b>:
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
        <ListItem>
          A vector of all zeros has length 0, and you cannot divide by 0. The lab gives back{" "}
          <Code>0.0</Code> in that case instead of crashing.
        </ListItem>
      </UnorderedList>

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

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The project gives every word a tiny vector of 5 numbers. A sentence is embedded by
        averaging the vectors of its words. Then every fact about Ada is a vector, and so is the
        question. Scoring the question against each fact with <Code>cosine_similarity</Code> and
        taking the highest score with <Code>max</Code> and <Code>.index</Code> finds the fact that
        is closest in meaning.
      </Text>
      <Text>Here is how it looks for the question "What food does she cook?":</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Only <Code>food</Code> and <Code>cook</Code> are in the word table. Both point mostly in
          the "food" direction, so the question's vector does too.
        </ListItem>
        <ListItem>
          The fact "She bakes bread and cooks spicy soup on weekends." has food words, so its
          vector points the same way. The score is close to 1.0.
        </ListItem>
        <ListItem>
          The fact about running has sport words. Its vector points elsewhere, so the score is close
          to 0.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>A fair warning:</b> real embeddings are not hand-made. A trained model produces them, with
        hundreds or thousands of numbers per text, and the directions are not neat labels like "food".
        The model learns them from huge amounts of text. But the comparison is the same one you
        write in this lab. Once you have many vectors, you keep them in a{" "}
        <b>vector database</b>, which is the next lab.
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
