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

      <Heading as="h4" size="xs" color="gray.600">Up close: a vector database keeps text next to its vector</Heading>
      <Text>
        Search by meaning works on vectors, but the model needs to read words. So a vector database keeps each piece of text <b>together with</b> its vector. You find the best vector, then hand back the text that goes with it.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Real ones, such as Chroma, FAISS and pgvector, add things you do not need yet. They save to disk, handle millions of items and use clever shortcuts so they do not compare against every vector.
        </ListItem>
        <ListItem>
          The core idea is small: a list of (text, vector) pairs, plus a way to add to it.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. A tiny store class holds the pairs. A function fills it from a table, and a loop prints what was stored. The vectors here are made up, with 2 numbers each.
      </Text>
      <RunnableExample labId={19} code={`class TinyStore:
    def __init__(self):
        self.items = []

    def add(self, text, vector):
        self.items.append((text, vector))


def fill(store, table):
    for text, vector in table:
        store.add(text, vector)


table = [("She bakes bread.", [1.0, 0.0]), ("She runs daily.", [0.0, 1.0])]
store = TinyStore()
fill(store, table)
print(len(store.items), "items stored")
for text, vector in store.items:
    print(len(vector), "numbers ->", text)`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>TinyStore</Code> starts with an empty <Code>items</Code> list. <Code>add</Code> appends one pair, the text and its vector.
        </ListItem>
        <ListItem>
          <Code>fill</Code> loops over the table and calls <Code>store.add</Code> for each row.
        </ListItem>
        <ListItem>
          The result is 2 items. Each one still has its readable text and a vector of 2 numbers. Later, the search finds a vector and your code returns the text next to it.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same class and function on a new table of three items. The vectors now have 3 numbers.
      </Text>
      <PracticeCell labId={19} cellId="topic-1" code={`class TinyStore:
    def __init__(self):
        self.items = []

    def add(self, text, vector):
        self.items.append((text, vector))


def fill(store, table):
    for text, vector in table:
        store.add(text, vector)


table = [("Kofi teaches maths.", [0.0, 0.2, 1.0]), ("Kofi codes at night.", [0.1, 1.0, 0.0]), ("Kofi cooks rice.", [1.0, 0.0, 0.0])]
store = TinyStore()
fill(store, table)
print(len(store.items), "items stored")
for text, vector in store.items:
    print(len(vector), "numbers ->", text)`} expectedOutput={`3 items stored
3 numbers -> Kofi teaches maths.
3 numbers -> Kofi codes at night.
3 numbers -> Kofi cooks rice.`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The table has three rows, so <Code>fill</Code> calls <Code>add</Code> three times.
        </ListItem>
        <ListItem>
          <Code>len(store.items)</Code> is 3.
        </ListItem>
        <ListItem>
          The loop prints the size of each vector, 3, and the text it belongs to.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>3 items stored</Code>, then three lines that start with <Code>3 numbers -&gt;</Code>, one for each text.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In the project you make a <Code>VectorStore</Code> named <Code>store</Code> and loop over <Code>TWIN_FACTS</Code>. For each fact you call <Code>store.add(fact, embed(fact))</Code>, so every fact is kept next to its vector of 5 numbers. After the loop, <Code>len(store.items)</Code> is 6.
      </Text>
      <Text>
        Yours compares the question against every stored vector, which is fine for six facts.
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

      <Heading as="h4" size="xs" color="gray.600">Up close: top-k: how many chunks to send</Heading>
      <Text>
        Why top-k and not just the top 1? Each extra chunk has a benefit and a cost.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          One chunk may not hold the whole answer. Two or three give the model more to work with.
        </ListItem>
        <ListItem>
          If the best match is wrong, a second chance helps. Yet a larger <Code>k</Code> also lets in weaker, only loosely related chunks.
        </ListItem>
        <ListItem>
          Every chunk you add uses up room in the context window, so <Code>k</Code> cannot be big. Choosing <Code>k</Code> is a trade-off.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. Three chunks come with made-up scores for a question about food. A small function sorts them and keeps the best <Code>k</Code>. A loop tries three values of <Code>k</Code> and counts the token cost of the chunks, with a budget of 20 tokens.
      </Text>
      <RunnableExample labId={19} code={`def count_tokens(text):
    return len(text) // 4 + 1


def top_k(scored, k):
    ranked = sorted(scored, reverse=True)
    return ranked[:k]


scored = [
    (0.35, "She runs five kilometers on Saturdays."),
    (0.91, "She bakes bread and cooks spicy soup."),
    (0.12, "She flew to Lisbon last summer."),
]
budget = 20
for k in (1, 2, 3):
    chosen = top_k(scored, k)
    cost = 0
    for score, text in chosen:
        cost = cost + count_tokens(text)
    print("k", k, "-> best score", chosen[0][0], "tokens", cost, "fits:", cost <= budget)`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>top_k</Code> sorts the pairs with the highest score first and keeps the first <Code>k</Code>. The score comes first in each pair, so it decides the order.
        </ListItem>
        <ListItem>
          With <Code>k</Code> 1 you get the bread and soup chunk, 10 tokens. With <Code>k</Code> 2 you add the running chunk, 20 tokens. It still fits the budget, but it is only loosely related to the question.
        </ListItem>
        <ListItem>
          With <Code>k</Code> 3 the cost is 28 tokens, over the budget of 20. More chunks cost room, and the extra ones help less and less.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on four new chunks, with a budget of 24 tokens.
      </Text>
      <PracticeCell labId={19} cellId="topic-2" code={`def count_tokens(text):
    return len(text) // 4 + 1


def top_k(scored, k):
    ranked = sorted(scored, reverse=True)
    return ranked[:k]


scored = [
    (0.22, "Kofi codes at night."),
    (0.88, "Kofi teaches maths at a school in Kumasi."),
    (0.64, "Kofi grades tests on Friday evenings."),
    (0.05, "Kofi cooks rice on Sundays."),
]
budget = 24
for k in (1, 2, 3):
    chosen = top_k(scored, k)
    cost = 0
    for score, text in chosen:
        cost = cost + count_tokens(text)
    print("k", k, "-> best score", chosen[0][0], "tokens", cost, "fits:", cost <= budget)`} expectedOutput={`k 1 -> best score 0.88 tokens 11 fits: True
k 2 -> best score 0.88 tokens 21 fits: True
k 3 -> best score 0.88 tokens 27 fits: False`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The scores are 0.22, 0.88, 0.64 and 0.05. The sort puts them in the order 0.88, 0.64, 0.22, 0.05.
        </ListItem>
        <ListItem>
          <Code>k</Code> 1 costs 11 tokens. <Code>k</Code> 2 adds 10 more, so 21. Both are within 24.
        </ListItem>
        <ListItem>
          <Code>k</Code> 3 adds 6 more, so 27. That is over 24.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>k 1 -&gt; best score 0.88 tokens 11 fits: True</Code>, then the same with 21 tokens and <Code>True</Code>, then 27 tokens and <Code>False</Code>. The best score never changes. Only the cost grows.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>search</Code> works like <Code>top_k</Code>, with one extra step. For every stored pair it works out a score, the cosine similarity between the question's vector and the stored vector, and makes a new pair <Code>(score, text)</Code>. It sorts them with the highest score first and keeps the top <Code>k</Code>.
      </Text>
      <Text>
        The project uses <Code>k</Code> of 2. For the sport question the best hit is the Hearts of Oak fact. For the travel question the best is the Lisbon trip, and the second hit is the running fact, because it mentions kilometers. That is a weaker match let in by a larger <Code>k</Code>.
      </Text>

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

      <Heading as="h4" size="xs" color="gray.600">Up close: grounding the model in your text</Heading>
      <Text>
        The <b>augment</b> step puts the retrieved chunks into the prompt. The instruction "Answer using only this context" tells the model to rely on your text instead of guessing from what it learned in training.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          If the right chunk is in the prompt, the model can read the answer there.
        </ListItem>
        <ListItem>
          If it is not, the model has nothing to read and may guess, and a guess can sound sure and still be wrong.
        </ListItem>
        <ListItem>
          So RAG is only as good as its retrieval. Check the chunks before you blame the model.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. One function builds the prompt from the chunks and the question. Another checks whether a keyword appears in the chunks. A loop runs two cases for the same question. The first case has the right chunk and the second does not.
      </Text>
      <RunnableExample labId={19} code={`def build_prompt(question, chunks):
    lines = "\\n".join(f"- {c}" for c in chunks)
    return f"Answer using only this context.\\n\\nContext:\\n{lines}\\n\\nQuestion: {question}"


def can_answer(chunks, keyword):
    for chunk in chunks:
        if keyword in chunk.lower():
            return True
    return False


cases = [
    ["She bakes bread.", "She runs daily."],
    ["She runs daily.", "She flew to Lisbon."],
]
for chunks in cases:
    print(build_prompt("What does she bake?", chunks))
    print("answer is in the context:", can_answer(chunks, "bread"))
    print("-" * 10)`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>build_prompt</Code> joins the chunks into dash lines, then puts the instruction at the top and the question at the bottom.
        </ListItem>
        <ListItem>
          In case 1 the chunk <Code>She bakes bread.</Code> is in the context. <Code>can_answer</Code> is <Code>True</Code>, so the model can read the answer.
        </ListItem>
        <ListItem>
          In case 2 the retrieval found other chunks. <Code>can_answer</Code> is <Code>False</Code>, so the model would have to guess. The prompt looks fine, but the answer is missing.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on a new question about what Kofi teaches.
      </Text>
      <PracticeCell labId={19} cellId="topic-3" code={`def build_prompt(question, chunks):
    lines = "\\n".join(f"- {c}" for c in chunks)
    return f"Answer using only this context.\\n\\nContext:\\n{lines}\\n\\nQuestion: {question}"


def can_answer(chunks, keyword):
    for chunk in chunks:
        if keyword in chunk.lower():
            return True
    return False


cases = [
    ["Kofi teaches maths.", "Kofi codes at night."],
    ["Kofi cooks rice.", "Kofi codes at night."],
]
for chunks in cases:
    print(build_prompt("What does Kofi teach?", chunks))
    print("answer is in the context:", can_answer(chunks, "maths"))
    print("-" * 10)`} expectedOutput={`Answer using only this context.

Context:
- Kofi teaches maths.
- Kofi codes at night.

Question: What does Kofi teach?
answer is in the context: True
----------
Answer using only this context.

Context:
- Kofi cooks rice.
- Kofi codes at night.

Question: What does Kofi teach?
answer is in the context: False
----------`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Case 1 has the chunk <Code>Kofi teaches maths.</Code>, so the keyword <Code>maths</Code> is found: <Code>True</Code>.
        </ListItem>
        <ListItem>
          Case 2 has the chunks about rice and coding, so <Code>maths</Code> is not found: <Code>False</Code>.
        </ListItem>
        <ListItem>
          The prompt layout is the same both times. Only the chunks differ.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> two prompts, each followed by <Code>answer is in the context:</Code> and a line of 10 dashes. The first says <Code>True</Code> and the second says <Code>False</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This is Step 3 of the project. The retrieved facts become the context lines, and the question goes underneath, in the exact layout you print: the instruction, a blank line, <Code>Context:</Code>, the dash lines, a blank line and <Code>Question: ...</Code>. Here is the whole pipeline of this week in one place:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Lab 1: cut your document into clean chunks.
        </ListItem>
        <ListItem>
          Lab 3: turn each chunk, and the question, into a vector.
        </ListItem>
        <ListItem>
          This lab: <Code>store.add</Code> keeps the vectors, <Code>store.search</Code> finds the best chunks, and the prompt carries them to the model.
        </ListItem>
        <ListItem>
          Lab 2 reminds you that the finished prompt still has to fit the context window.
        </ListItem>
      </UnorderedList>
      <Text>
        The last step, <b>generate</b>, is the call you already know from week 1. Pass this prompt as the user message to your <Code>GroqClient</Code> and the twin answers from your own text.
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
