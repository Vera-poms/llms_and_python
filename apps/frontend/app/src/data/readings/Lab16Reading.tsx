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

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab slices a <b>list of words</b> instead of a string, but the rule is identical.{" "}
        <Code>words[0:4]</Code> is the first four words, and <Code>words[3:7]</Code> is four words
        starting from position 3. A chunk is nothing more than a slice of the words.
      </Text>
      <Text>
        Before slicing, there is one more thing to know about how a model reads. A model does not
        read characters or even whole words. It reads <b>tokens</b>: small pieces of text. A common
        word like <Code>cat</Code> is often one token. A long or rare word is cut into a few
        pieces. On average a token is a bit shorter than a word, roughly 4 characters of English.
        This lab cuts by <b>words</b> because words are easy to count and easy to see. Real systems
        often cut by tokens, and the idea is the same.
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

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The twin's document has line breaks, a blank line and a run of extra spaces. Before chunking,
        the lab cleans it with <Code>{`" ".join(TWIN_DOC.split())`}</Code>: split into words, join
        back with single spaces. After that every gap is exactly one space, so counting words and
        cutting chunks gives the same answer every time.
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

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This loop is the whole of <Code>chunk_words</Code>. The only change is that the list holds
        words and each slice is glued back into a string with <Code>" ".join(...)</Code>. The jump
        is <Code>size - overlap</Code>, so with <Code>size=12</Code> and <Code>overlap=4</Code> you
        move 8 words each time.
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
        The next labs search through these chunks, so good chunks make good answers later.
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
