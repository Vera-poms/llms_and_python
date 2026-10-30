import { Heading, Link, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab19Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">RAG: three Python ideas behind a twin that remembers your documents</Heading>
      <Text>
        A model only knows what it was trained on. It has never read your CV, your notes or your
        bio. <b>RAG</b> (Retrieval-Augmented Generation) fixes that without any training. It works
        in three steps:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <b>Retrieve</b> - find the few chunks of your text that best match the question
        </ListItem>
        <ListItem>
          <b>Augment</b> - paste those chunks into the prompt, next to the question
        </ListItem>
        <ListItem>
          <b>Generate</b> - the model answers, reading the chunks you gave it
        </ListItem>
      </UnorderedList>
      <Text>
        The chunk vectors live in a <b>vector database</b>. This lab builds a tiny one, then stops
        at step 2 and prints the prompt a real call would send. Three ordinary Python ideas do the
        work:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <b>A class that holds a list</b> - the store
        </ListItem>
        <ListItem>
          <b>Sorting pairs and taking the top few</b> - the search
        </ListItem>
        <ListItem>
          <b>Building a prompt from a list</b> - the augmenting
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Idea 1: a class that holds a list</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        A <b>class</b> bundles data with the functions that work on it. A <b>method</b> is a
        function inside a class, and <Code>self</Code> is the object itself. Think of a bookshelf:
        the shelf holds a list of books, and <Code>add</Code> puts a new one on the end.
      </Text>
      <RunnableExample labId={19} code={`class Shelf:
    def __init__(self):
        self.books = []

    def add(self, title):
        self.books.append(title)

shelf = Shelf()
shelf.add("Python")
shelf.add("Maths")
print(shelf.books)   # ['Python', 'Maths']`} />
      <Text>Here is what each part does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>__init__</Code> runs once when you write <Code>Shelf()</Code>. It gives the new
          shelf an empty list called <Code>self.books</Code>.
        </ListItem>
        <ListItem>
          <Code>shelf.add("Python")</Code> calls the method. Inside it, <Code>self</Code> is{" "}
          <Code>shelf</Code>, so it appends to that shelf's own list.
        </ListItem>
        <ListItem>
          Each shelf keeps its own list. A second <Code>Shelf()</Code> would start empty.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has an "Idea 1 practice" cell for this - run it before moving on.
      </Text>
      <PracticeCell labId={19} cellId="concept-1" code={`class Basket:
    def __init__(self):
        self.items = []

    def add(self, name, price):
        self.items.append((name, price))

basket = Basket()
basket.add("pen", 2)
basket.add("book", 7)
print(basket.items)       # expected output: [('pen', 2), ('book', 7)]
print(len(basket.items))  # expected output: 2`} expectedOutput={`[('pen', 2), ('book', 7)]
2`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>Basket()</Code> makes a basket with an empty <Code>items</Code> list.
        </ListItem>
        <ListItem>
          Each <Code>add</Code> call appends one <b>pair</b> in round brackets, called a tuple: the
          name together with its price. Two calls make two pairs.
        </ListItem>
        <ListItem>
          <Code>len(basket.items)</Code> counts the pairs: 2.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> the list of two pairs, then <Code>2</Code>. Try one more{" "}
        <Code>basket.add("cup", 4)</Code> before the prints. You should see three pairs and a 3.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        A vector database is, at heart, this class. Each item is a pair: a piece of text and its
        vector. <Code>add(text, vector)</Code> appends one pair. Real ones, such as Chroma, FAISS
        and pgvector, add things you do not need yet: they save to disk, handle millions of items
        and use clever shortcuts so they do not compare against every vector. Yours compares
        against all of them, which is fine for six facts.
      </Text>

      <Heading as="h3" size="sm">Idea 2: sorting pairs and taking the top few</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        When you sort a list of pairs, Python compares the <b>first</b> item of each pair first.{" "}
        <Code>reverse=True</Code> puts the biggest first. A slice <Code>pairs[:2]</Code> then takes
        the first two.
      </Text>
      <RunnableExample labId={19} code={`pairs = [(0.2, "b"), (0.9, "a"), (0.5, "c")]
pairs.sort(reverse=True)
print(pairs)        # [(0.9, 'a'), (0.5, 'c'), (0.2, 'b')]
print(pairs[:2])    # [(0.9, 'a'), (0.5, 'c')]
print(len(pairs[:10]))   # 3`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The scores come first in each pair, so sorting orders the pairs by score. The biggest,
          0.9, goes to the front.
        </ListItem>
        <ListItem>
          <Code>pairs[:2]</Code> keeps the two best.
        </ListItem>
        <ListItem>
          Asking for 10 when there are only 3 is not an error. A slice gives you what exists, so you
          get all 3.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has an "Idea 2 practice" cell for this - run it before moving on.
      </Text>
      <PracticeCell labId={19} cellId="concept-2" code={`scores = [(3, "x"), (8, "y"), (5, "z")]
scores.sort(reverse=True)
print(scores[:2])        # expected output: [(8, 'y'), (5, 'z')]
print(len(scores[:10]))  # expected output: 3`} expectedOutput={`[(8, 'y'), (5, 'z')]
3`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          After the sort the order is 8, 5, 3, so the list is{" "}
          <Code>[(8, 'y'), (5, 'z'), (3, 'x')]</Code>.
        </ListItem>
        <ListItem>
          <Code>scores[:2]</Code> keeps the first two pairs.
        </ListItem>
        <ListItem>
          <Code>scores[:10]</Code> has all 3 pairs, because there are not 10.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> the two best pairs, then <Code>3</Code>. Try{" "}
        <Code>scores[:1]</Code>. You should get just <Code>[(8, 'y')]</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>search</Code> is exactly this. For every stored pair it works out a score, the cosine
        similarity between the question's vector and the stored vector, and makes a new pair{" "}
        <Code>(score, text)</Code>. It sorts them with the highest score first and keeps the top{" "}
        <Code>k</Code>. That is called a <b>top-k search</b>.
      </Text>
      <Text>Why top-k and not just the top 1?</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          One chunk may not hold the whole answer. Two or three give the model more to work with.
        </ListItem>
        <ListItem>
          If the best match is wrong, a second chance helps. Yet a larger <Code>k</Code> also lets in
          weaker, only loosely related chunks. In the project, the second hit for the travel
          question is the running fact, because it mentions kilometres. Choosing <Code>k</Code> is a
          trade-off.
        </ListItem>
        <ListItem>
          Every chunk you add uses up the context window from lab 2, so <Code>k</Code> cannot be
          big.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Idea 3: building a prompt from a list</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        <Code>"\n".join(lines)</Code> glues a list of strings together with a new line between
        each. An f-string then drops the result into a bigger piece of text.
      </Text>
      <RunnableExample labId={19} code={`facts = ["She bakes bread.", "She runs daily."]
context = "\\n".join(f"- {f}" for f in facts)
prompt = f"Context:\\n{context}\\n\\nQuestion: What does she bake?"
print(prompt)`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>{`f"- {f}" for f in facts`}</Code> makes one line per fact, each starting with a dash.
        </ListItem>
        <ListItem>
          <Code>"\n".join(...)</Code> puts those lines one under the other.
        </ListItem>
        <ListItem>
          In the f-string, <Code>\n\n</Code> makes a blank line. The result is a small block of
          text with the context, a blank line, then the question.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has an "Idea 3 practice" cell for this - run it before moving on.
      </Text>
      <PracticeCell labId={19} cellId="concept-3" code={`notes = ["tea", "toast"]
lines = "\\n".join(f"- {n}" for n in notes)
print(lines)  # expected output: two lines, each starting with "- "`} expectedOutput={`- tea
- toast`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The part inside <Code>join</Code> makes the two strings <Code>"- tea"</Code> and{" "}
          <Code>"- toast"</Code>.
        </ListItem>
        <ListItem>
          <Code>"\n".join(...)</Code> puts a new line between them, so <Code>print</Code> shows them
          on two lines.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>- tea</Code> and <Code>- toast</Code> on two lines. Try
        adding <Code>"jam"</Code> to <Code>notes</Code>. A third line appears.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This is the <b>augment</b> step. The retrieved chunks become the context lines, and the
        question goes underneath. The instruction at the top, "Answer using only this context",
        tells the model to rely on your text instead of guessing. Here is the whole pipeline of this
        week in one place:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Lab 1: cut your document into clean chunks.
        </ListItem>
        <ListItem>
          Lab 3: turn each chunk, and the question, into a vector.
        </ListItem>
        <ListItem>
          This lab: <Code>store.add</Code> keeps the vectors, <Code>store.search</Code> finds the
          best chunks, and the prompt carries them to the model.
        </ListItem>
        <ListItem>
          Lab 2 reminds you that the finished prompt still has to fit the context window.
        </ListItem>
      </UnorderedList>
      <Text>
        The last step, <b>generate</b>, is the call you already know from week 1. Pass this prompt
        as the user message to your <Code>GroqClient</Code> and the twin answers from your own
        text. RAG is only as good as its retrieval: if the right chunk is not found, the model has
        nothing to read and may guess.
      </Text>

      <Heading as="h3" size="sm">Further reading</Heading>
      <Text>
        Lewis et al.:{" "}
        <Link href="https://arxiv.org/abs/2005.11401" isExternal color="blue.500">
          Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
        </Link>
      </Text>
      <Text>
        Pinecone:{" "}
        <Link href="https://www.pinecone.io/learn/vector-database/" isExternal color="blue.500">
          What is a vector database?
        </Link>
      </Text>
    </VStack>
  );
}
