import { Heading, Link, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab16Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">String surgery: the three Python ideas behind reading text</Heading>
      <Text>
        This week your digital twin learns to use text it was never trained on, like your CV or your
        notes. The first step is not clever at all: <b>cut the text into small, clean pieces</b>. A
        model cannot take a whole book in one go, and a search over one giant block of text is
        useless. So your code reads the document first. Three ordinary Python ideas do all the work
        here, and none of them is LLM-specific.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <b>Slicing</b> - taking a piece out of a string
        </ListItem>
        <ListItem>
          <b>Split and join</b> - turning text into a list of words and back
        </ListItem>
        <ListItem>
          <b>Stepping through a list</b> - walking along it in jumps, with each piece overlapping the last
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Idea 1: slicing - taking a piece out of a string</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        A string is a row of characters, and every character has a position. The first one is
        position 0. A <b>slice</b> takes a stretch of them: <Code>word[2:5]</Code> means "from
        position 2 up to, but not including, position 5".
      </Text>
      <RunnableExample labId={16} code={`word = "retrieval"
print(word[0])      # r
print(word[:5])     # retri
print(word[-3:])    # val
print(len(word))    # 9`} />
      <Text>Here is what each line does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>word[0]</Code> is the first character, <Code>r</Code>. Counting starts at 0, not 1.
        </ListItem>
        <ListItem>
          <Code>word[:5]</Code> leaves the start empty, so it starts at the beginning. It stops
          before position 5, so you get the first 5 characters: <Code>retri</Code>.
        </ListItem>
        <ListItem>
          <Code>word[-3:]</Code> uses a negative number, which counts from the end. It means "the
          last 3 characters": <Code>val</Code>.
        </ListItem>
        <ListItem>
          <Code>len(word)</Code> counts the characters: 9.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has an "Idea 1 practice" cell for this - run it before moving on.
      </Text>
      <PracticeCell labId={16} cellId="concept-1" code={`title = "digital twin"
print(title[:7])   # expected output: digital
print(title[-4:])  # expected output: twin
print(len(title))  # expected output: 12`} expectedOutput={`digital
twin
12`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>title[:7]</Code> takes the first 7 characters. <Code>digital</Code> has 7 letters,
          so the slice stops right before the space.
        </ListItem>
        <ListItem>
          <Code>title[-4:]</Code> takes the last 4 characters, <Code>twin</Code>.
        </ListItem>
        <ListItem>
          <Code>len(title)</Code> is 12: 7 letters, 1 space and 4 letters.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> three lines, <Code>digital</Code>, <Code>twin</Code> and{" "}
        <Code>12</Code>. Try <Code>title[8:]</Code> too. Leaving the end empty means "all the way to
        the end", so you get <Code>twin</Code> again.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: how a model sees text</Heading>
      <Text>
        Slicing works on characters. A model does not read characters, and it does not read whole
        words either. It reads <b>tokens</b>: small pieces of text.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A common word like <Code>cat</Code> is often one token.
        </ListItem>
        <ListItem>
          A long or rare word is cut into a few tokens, so <Code>retrieval</Code> may become two or
          three pieces.
        </ListItem>
        <ListItem>
          On average a token is a bit shorter than a word, roughly 4 characters of English.
        </ListItem>
      </UnorderedList>
      <Text>
        This matters because a model can only take in a limited number of tokens at once. So the
        size of a piece of text is counted in tokens, not in characters or words. You can see the
        real split in the tokenizer link at the bottom of this page.
      </Text>
      <Text>
        Here is a worked example. It builds two small functions, the way the lab does. One adds up
        the token cost of a text, using a toy rule of 1 token for every 4 characters of a word. The
        other asks if that text fits in the model's window. A real tokenizer is smarter, but it
        behaves the same way.
      </Text>
      <RunnableExample labId={16} code={`def toy_token_count(text):
    total = 0
    for word in text.split():
        total = total + (len(word) + 3) // 4  # a toy rule: about 4 characters per token
    return total


def fits(text, window):
    return toy_token_count(text) <= window


window = 6
for text in ["cat sat", "retrieval makes tokenization costly"]:
    print(text, "->", toy_token_count(text), "tokens, fits:", fits(text, window))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>toy_token_count</Code> loops over the words. Each word costs its length divided by 4,
          rounded up. <Code>total</Code> grows by that cost, and the function gives back the total.
        </ListItem>
        <ListItem>
          <Code>cat sat</Code> costs 1 + 1 = 2 tokens. <Code>retrieval makes tokenization costly</Code>{" "}
          is only 4 words, but the long ones cost more: 3 + 2 + 3 + 2 = 10 tokens.
        </ListItem>
        <ListItem>
          <Code>fits</Code> compares the cost to the window of 6. The first text fits and the second
          does not. The model's limit is counted in tokens, so the number of words alone does not
          tell you if a text fits.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on two new texts, with a window of 6 tokens.
      </Text>
      <PracticeCell labId={16} cellId="topic-1" code={`def toy_token_count(text):
    total = 0
    for word in text.split():
        total = total + (len(word) + 3) // 4
    return total


def fits(text, window):
    return toy_token_count(text) <= window


window = 6
for text in ["dog barks", "tokenization of weekends matters"]:
    print(text, "->", toy_token_count(text), "tokens, fits:", fits(text, window))`} expectedOutput={`dog barks -> 3 tokens, fits: True
tokenization of weekends matters -> 8 tokens, fits: False`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>dog barks</Code>: <Code>dog</Code> costs 1 and <Code>barks</Code> costs 2, so 3
          tokens. That is within the window of 6.
        </ListItem>
        <ListItem>
          <Code>tokenization of weekends matters</Code>: 3 + 1 + 2 + 2 = 8 tokens. That is over the
          window of 6.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>dog barks -&gt; 3 tokens, fits: True</Code>, then{" "}
        <Code>tokenization of weekends matters -&gt; 8 tokens, fits: False</Code>. The second text
        has 4 words, just like the first example, and is still too big for the window.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This lab cuts by <b>words</b>, not tokens, because words are easy to count and easy to see.
        Real systems often cut by tokens, and the idea is the same.
      </Text>
      <Text>
        So the lab slices a <b>list of words</b> instead of a string, and the rule is identical.{" "}
        <Code>words[0:4]</Code> is the first four words, and <Code>words[3:7]</Code> is four words
        starting from position 3. In <Code>chunk_words</Code>, a chunk is nothing more than a slice
        of the words: <Code>words[start:start + size]</Code>.
      </Text>

      <Heading as="h3" size="sm">Idea 2: split and join - text to words and back</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Text copied from a real file is messy: extra spaces, new lines, capital letters.{" "}
        <Code>split()</Code> cuts a string into a list of words and throws away all the extra gaps.{" "}
        <Code>" ".join(words)</Code> does the opposite and glues the words back together with one
        space between each.
      </Text>
      <RunnableExample labId={16} code={`messy = "  Hello    World \\n again "
words = messy.split()
print(words)            # ['Hello', 'World', 'again']
print(" ".join(words))  # Hello World again
print("Hello".lower())  # hello`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>messy</Code> has spaces at the start, a run of spaces in the middle and a new line
          (<Code>\n</Code>). <Code>split()</Code> with nothing inside the brackets treats all of
          those as one gap, so <Code>words</Code> is <Code>['Hello', 'World', 'again']</Code>.
        </ListItem>
        <ListItem>
          <Code>" ".join(words)</Code> puts one space between each word. The text is clean now.
        </ListItem>
        <ListItem>
          <Code>.lower()</Code> makes every letter small. It is handy when you want{" "}
          <Code>Hello</Code> and <Code>hello</Code> to count as the same word.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has an "Idea 2 practice" cell for this - run it before moving on.
      </Text>
      <PracticeCell labId={16} cellId="concept-2" code={`note = "  buy   MILK  and   eggs \\n"
words = note.lower().split()
print(words)            # expected output: ['buy', 'milk', 'and', 'eggs']
print(" ".join(words))  # expected output: buy milk and eggs`} expectedOutput={`['buy', 'milk', 'and', 'eggs']
buy milk and eggs`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>note.lower()</Code> turns <Code>MILK</Code> into <Code>milk</Code>. The result is a
          new string, and the extra spaces are still there.
        </ListItem>
        <ListItem>
          <Code>.split()</Code> is called right after on that new string. It cuts at every gap and
          drops the empty bits, so you get four words.
        </ListItem>
        <ListItem>
          <Code>" ".join(words)</Code> glues them into <Code>buy milk and eggs</Code>, with exactly
          one space between each.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> the list of four words, then the clean sentence. Try changing{" "}
        <Code>.lower()</Code> to <Code>.upper()</Code> and run it again. The words come out in
        capitals.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: why clean text first</Heading>
      <Text>
        Real documents come with mess: line breaks from a PDF, double spaces, a blank line between
        paragraphs. A person does not notice any of it. The model does, because it all counts
        toward its limit.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Extra spaces and line breaks use up space in the model's limited window without adding any
          meaning.
        </ListItem>
        <ListItem>
          If two gaps look different (one space or three), counting words or measuring size can give
          a different answer for text that says the same thing.
        </ListItem>
        <ListItem>
          So the first step in almost every system that reads documents is to make the spacing
          the same everywhere. Cleaning like this is called <b>normalising</b> the text.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. A pretend model has a window of only 8 tokens. This time the
        token cost is the rule of thumb of 1 token for every 4 characters of the whole text, spaces
        and line breaks included. Three small functions clean a note, estimate its cost and check if
        it fits. Then a loop runs the same note before and after cleaning.
      </Text>
      <RunnableExample labId={16} code={`def clean_text(raw):
    return " ".join(raw.split())


def estimate_tokens(text):
    return len(text) // 4  # rule of thumb: about 4 characters per token


def fits(text, window):
    return estimate_tokens(text) <= window


window = 8
raw = "Ada   writes\\n\\n\\nPython    code   daily"
for name, text in [("raw", raw), ("clean", clean_text(raw))]:
    print(name, estimate_tokens(text), "tokens, fits:", fits(text, window))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>raw</Code> is 37 characters, about 9 tokens. That is over the window of 8, so the
          model could not take it in.
        </ListItem>
        <ListItem>
          <Code>clean_text(raw)</Code> says exactly the same thing in 28 characters, about 7 tokens.
          It fits.
        </ListItem>
        <ListItem>
          The mess had no meaning, but it cost room. Cleaning gave that room back.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same three functions on a different note, with a window of 10 tokens.
      </Text>
      <PracticeCell labId={16} cellId="topic-2" code={`def clean_text(raw):
    return " ".join(raw.split())


def estimate_tokens(text):
    return len(text) // 4


def fits(text, window):
    return estimate_tokens(text) <= window


window = 10
raw = "Kofi   teaches\\n\\nmaths    and   codes   at   night"
for name, text in [("raw", raw), ("clean", clean_text(raw))]:
    print(name, estimate_tokens(text), "tokens, fits:", fits(text, window))`} expectedOutput={`raw 12 tokens, fits: False
clean 9 tokens, fits: True`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>raw</Code> is 49 characters, so about 12 tokens. That is more than the window of 10.
        </ListItem>
        <ListItem>
          <Code>clean_text(raw)</Code> is 37 characters, about 9 tokens. It fits.
        </ListItem>
        <ListItem>
          The loop runs the same line for each version, so the two answers are easy to compare.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>raw 12 tokens, fits: False</Code>, then{" "}
        <Code>clean 9 tokens, fits: True</Code>. Cleaning decided whether the note could be used at
        all.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This is Step 1 of the project. The twin's document has line breaks, a blank line and a run
        of extra spaces in the middle, like text pasted from a real file. You clean it with{" "}
        <Code>{`" ".join(TWIN_DOC.split())`}</Code> and call the result <Code>clean</Code>.
      </Text>
      <Text>
        After that every gap is exactly one space, and <Code>clean</Code> has 59 words. Cutting it
        into chunks gives the same answer every time you run it, and <Code>chunk_words</Code> never
        has to deal with mess.
      </Text>

      <Heading as="h3" size="sm">Idea 3: stepping through a list, with overlap</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        <Code>range(0, 7, 3)</Code> counts 0, 3, 6: it starts at 0, stops before 7 and jumps by 3.
        Use each number as the start of a slice and you walk along a list in equal jumps.
      </Text>
      <RunnableExample labId={16} code={`letters = ["a", "b", "c", "d", "e", "f", "g"]
for start in range(0, len(letters), 3):
    print(start, letters[start:start + 3])`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>len(letters)</Code> is 7, so <Code>start</Code> takes the values 0, 3 and 6.
        </ListItem>
        <ListItem>
          At 0 the slice is <Code>letters[0:3]</Code>, which is <Code>['a', 'b', 'c']</Code>. At 3 it
          is <Code>['d', 'e', 'f']</Code>.
        </ListItem>
        <ListItem>
          At 6 the slice asks for positions 6 to 8, but the list ends at 6. Python does not
          complain. It just gives what is there: <Code>['g']</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        Now make the slice longer than the jump. If the slice is 4 long and the jump is only 2, each
        piece shares 2 items with the next. That sharing is the <b>overlap</b>.
      </Text>

      <Text color="gray.600">
        Try it: the notebook has an "Idea 3 practice" cell for this - run it before moving on.
      </Text>
      <PracticeCell labId={16} cellId="concept-3" code={`numbers = [1, 2, 3, 4, 5, 6, 7, 8]
for start in range(0, len(numbers), 2):
    print(numbers[start:start + 4])
# expected output: four lines, each 4 long except the last`} expectedOutput={`[1, 2, 3, 4]
[3, 4, 5, 6]
[5, 6, 7, 8]
[7, 8]`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>range(0, 8, 2)</Code> gives the starts 0, 2, 4 and 6.
        </ListItem>
        <ListItem>
          Each slice is 4 long but the start moves by only 2. So <Code>[1, 2, 3, 4]</Code> and{" "}
          <Code>[3, 4, 5, 6]</Code> share <Code>3, 4</Code>. That is an overlap of 2.
        </ListItem>
        <ListItem>
          The third line, <Code>[5, 6, 7, 8]</Code>, already reaches the end of the list. The fourth
          line, <Code>[7, 8]</Code>, adds nothing new. It only repeats numbers you already have.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> the four lines above. That useless last line is why the lab's
        function stops as soon as a chunk reaches the end of the text.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: chunking and overlap</Heading>
      <Text>
        A model cannot take a whole book in one go, and searching one giant block of text is
        useless. So long text is cut into <b>chunks</b>: pieces small enough to fit in the model's
        window and focused enough to search. Later, the model is only shown the chunks that look
        useful for the question. Whatever is not in those chunks, the model never sees.
      </Text>
      <Text>Why overlap at all? Picture this sentence sitting right on a cut:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Without overlap, chunk 1 ends with "Ada bakes" and chunk 2 starts with "bread on
          weekends". Neither piece says what Ada does.
        </ListItem>
        <ListItem>
          With overlap, the end of chunk 1 is repeated at the start of chunk 2. The whole sentence
          shows up complete in at least one chunk.
        </ListItem>
        <ListItem>
          The price is that a few words are stored twice. That is a fair trade for not losing facts
          on the cuts.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. A fact the model should be able to find is{" "}
        <Code>maths on Fridays</Code>. We cut the text into 4-word chunks twice, with no overlap and
        with an overlap of 2, and count how many chunks hold the whole fact. Two functions do the
        work: one cuts the words into chunks, and one counts the chunks that contain the fact.
      </Text>
      <RunnableExample labId={16} code={`def make_chunks(words, size, jump):
    chunks = []
    for start in range(0, len(words), jump):
        chunks.append(" ".join(words[start:start + size]))
    return chunks


def count_with_fact(chunks, fact):
    count = 0
    for chunk in chunks:
        if fact in chunk:
            count = count + 1
    return count


words = "Kofi teaches maths on Fridays and codes at night".split()
fact = "maths on Fridays"
for jump in (4, 2):  # 4 = no overlap, 2 = overlap of 2
    chunks = make_chunks(words, 4, jump)
    print("jump", jump, "->", len(chunks), "chunks,", count_with_fact(chunks, fact), "hold the whole fact")`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>make_chunks</Code> is a small version of the lab's <Code>chunk_words</Code>. It loops
          from the start of the list in steps of <Code>jump</Code>, takes <Code>size</Code> words
          each time and glues them into a string.
        </ListItem>
        <ListItem>
          With a jump of 4 (no overlap) you get 3 chunks, and none holds the whole fact. It is cut
          between <Code>Kofi teaches maths on</Code> and <Code>Fridays and codes at</Code>. If the
          model only gets one chunk, it never sees the whole fact.
        </ListItem>
        <ListItem>
          With a jump of 2 (an overlap of 2) you get 5 chunks, and one of them,{" "}
          <Code>maths on Fridays and</Code>, holds the whole fact. It survived the cut. The price is
          2 more chunks to store.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on a new sentence and a new fact.
      </Text>
      <PracticeCell labId={16} cellId="topic-3" code={`def make_chunks(words, size, jump):
    chunks = []
    for start in range(0, len(words), jump):
        chunks.append(" ".join(words[start:start + size]))
    return chunks


def count_with_fact(chunks, fact):
    count = 0
    for chunk in chunks:
        if fact in chunk:
            count = count + 1
    return count


words = "Ada bakes bread on weekends and sells it".split()
fact = "bread on weekends"
for jump in (4, 2):
    chunks = make_chunks(words, 4, jump)
    print("jump", jump, "->", len(chunks), "chunks,", count_with_fact(chunks, fact), "hold the whole fact")`} expectedOutput={`jump 4 -> 2 chunks, 0 hold the whole fact
jump 2 -> 4 chunks, 1 hold the whole fact`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The text has 8 words. With a jump of 4 you get 2 chunks, and the fact{" "}
          <Code>bread on weekends</Code> is cut between them. The count is 0.
        </ListItem>
        <ListItem>
          With a jump of 2 you get 4 chunks. The second one is <Code>bread on weekends and</Code>,
          so it holds the whole fact. The count is 1.
        </ListItem>
        <ListItem>
          <Code>fact in chunk</Code> is <Code>True</Code> when the fact is found inside the chunk.
          Each time, <Code>count</Code> goes up by 1.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>0 hold the whole fact</Code> for jump 4, and{" "}
        <Code>1 hold the whole fact</Code> for jump 2. Same text, same chunk size. Only the overlap
        decides whether the model can ever find the fact. The next labs search through these chunks, so good chunks
        make good answers later.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This loop is the whole of <Code>chunk_words</Code>. The list holds words, and each slice is
        glued back into a string with <Code>" ".join(...)</Code>. The jump is{" "}
        <Code>size - overlap</Code>, and the function stops as soon as a chunk reaches the end.
      </Text>
      <Text>
        In the project you call it as <Code>chunk_words(clean, 12, 4)</Code>. Each chunk is 12 words
        and shares 4 words with the next, so you move 8 words each time. The 59 clean words of the
        twin's document come out as 7 chunks, and a sentence on a cut still shows up whole in at
        least one of them.
      </Text>

      <Heading as="h3" size="sm">Further reading</Heading>
      <Text>
        OpenAI:{" "}
        <Link href="https://platform.openai.com/tokenizer" isExternal color="blue.500">
          Tokenizer - see how text is split into tokens
        </Link>
      </Text>
      <Text>
        Pinecone:{" "}
        <Link href="https://www.pinecone.io/learn/chunking-strategies/" isExternal color="blue.500">
          Chunking strategies for LLM applications
        </Link>
      </Text>
    </VStack>
  );
}
