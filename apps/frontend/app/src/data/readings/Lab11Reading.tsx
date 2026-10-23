import { Heading, Link, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab11Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">Making the model show its work</Heading>
      <Text>
        For tasks that involve any reasoning (arithmetic, logic, multi-step inference), asking a
        model to think step by step before answering - chain-of-thought - measurably improves
        accuracy over asking for the answer directly. The model generates its reasoning as regular
        text, so you need a clear final-answer marker to reliably pull the actual answer back out.
      </Text>

      <Heading as="h3" size="sm">Concept: comparing two approaches side by side</Heading>
      <Text>
        Chain-of-thought is the difference between blurting out an answer and showing your work.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Suppose you need <Code>17 * 24</Code>. You could blurt out a guess from memory, or you
        could work it out on paper:
      </Text>
      <RunnableExample labId={11} code={`def guess_directly(a, b):
    """Straight to an answer - fast, but nothing to check if it's wrong."""
    return a * b  # a person doing this "in their head" might misremember a step

def show_the_work(a, b):
    """Break it into steps you can each verify."""
    step1 = a * 20      # 17 * 20 = 340
    step2 = a * 4       # 17 * 4  = 68
    total = step1 + step2
    return f"{a}*20={step1}, {a}*4={step2}, total={total}"

print(guess_directly(17, 24))   # 408 - correct, but you'd have to trust it
print(show_the_work(17, 24))    # shows each intermediate number, easy to audit`} />
      <Text>
        Both approaches can land on the right number, but the second one produces a trail of
        intermediate steps - a <b>reasoning trace</b> - that you (or anyone else) can check for
        mistakes along the way. For a person, and it turns out for language models too, actually
        writing out the intermediate steps tends to catch errors that jumping straight to an
        answer would miss.
      </Text>

      <Text>Here is what the two functions do with 17 and 24:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>guess_directly(17, 24)</Code> multiplies in one go: <Code>17 * 24 = 408</Code>. You get the
          answer, but no steps to look at.
        </ListItem>
        <ListItem>
          <Code>show_the_work</Code> splits 24 into <Code>20 + 4</Code>. <Code>step1</Code> is <Code>17 * 20 = 340</Code>.{" "}
          <Code>step2</Code> is <Code>17 * 4 = 68</Code>.
        </ListItem>
        <ListItem>
          <Code>total = step1 + step2</Code> is <Code>340 + 68 = 408</Code>. The same answer, reached in small
          pieces.
        </ListItem>
        <ListItem>
          The returned text is <Code>"17*20=340, 17*4=68, total=408"</Code>. If one number were
          wrong, you could spot which step broke. The <Code>f</Code> before the quote marks fills
          the <Code>{"{...}"}</Code> blanks with the values.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`def guess_total(price, tax_rate):
    """Straight to an answer - fast, but nothing to check if it's wrong."""
    return price + price * tax_rate

def show_total_steps(price, tax_rate):
    """Break it into steps you can each verify."""
    tax = price * tax_rate
    total = price + tax
    return f"tax={tax:.2f}, total={total:.2f}"

print(guess_total(50, 0.08))        # expected output: 54.0
print(show_total_steps(50, 0.08))   # expected output: tax=4.00, total=54.00`}
      </Code>
      <PracticeCell labId={11} cellId="concept-1" code={`def guess_total(price, tax_rate):
    """Straight to an answer - fast, but nothing to check if it's wrong."""
    return price + price * tax_rate

def show_total_steps(price, tax_rate):
    """Break it into steps you can each verify."""
    tax = price * tax_rate
    total = price + tax
    return f"tax={tax:.2f}, total={total:.2f}"

print(guess_total(50, 0.08))        # expected output: 54.0
print(show_total_steps(50, 0.08))   # expected output: tax=4.00, total=54.00`} expectedOutput={`54.0
tax=4.00, total=54.00`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The goal: a price of 50 plus 8% tax (0.08 is 8 out of 100).
        </ListItem>
        <ListItem>
          <Code>guess_total(50, 0.08)</Code> does it all in one line: <Code>50 + 50 * 0.08 = 50</Code> + 4.0 =
          54.0. Only the final number comes back.
        </ListItem>
        <ListItem>
          <Code>show_total_steps(50, 0.08)</Code> works in two steps. <Code>tax = 50 * 0.08</Code>{" "}
          is 4.0. <Code>total = 50 + 4.0</Code> is 54.0.
        </ListItem>
        <ListItem>
          <Code>{"{tax:.2f}"}</Code> means "show this number with exactly 2 digits after the
          point". So 4.0 is written <Code>4.00</Code> and 54.0 is written <Code>54.00</Code>. The
          result is the text <Code>"tax=4.00, total=54.00"</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>54.0</Code> and then <Code>tax=4.00, total=54.00</Code>.
        Try changing 50 to 80 in both calls. You should see <Code>86.4</Code> and then{" "}
        <Code>tax=6.40, total=86.40</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>build_direct_prompt(question)</Code> asks for a short answer immediately
        (the "guess directly" path), while <Code>build_cot_prompt(question)</Code> explicitly asks
        the model to "think step by step, then end with a final line 'Answer: &lt;your
        answer&gt;'" - the "show the work" path. The real-world project cell runs both prompts on
        the same three reasoning questions (train speeds, discounts, ratios) and prints both
        replies side by side, so you can see chain-of-thought's reasoning trace actually land on
        the correct number more often than the rushed direct answer.
      </Text>
      <Text>
        Both functions return a list with one message in it. Here they are on the question{" "}
        <Code>"What is 12 * 13?"</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>build_direct_prompt</Code> joins the question and the sentence "Answer in as few
          words as possible." The message content is{" "}
          <Code>"What is 12 * 13? Answer in as few words as possible."</Code>. The model is pushed
          to blurt out a number.
        </ListItem>
        <ListItem>
          <Code>build_cot_prompt</Code> writes the question, then <Code>\n\n</Code> (a new line and
          a blank line), then "Think step by step, then end your reply with a final line in exactly
          this form: 'Answer: &lt;your answer&gt;'". The model is pushed to write its steps first.
        </ListItem>
        <ListItem>
          A good chain-of-thought reply might be: "<Code>12 * 10 = 120</Code>. <Code>12 * 3 = 36</Code>. <Code>120 + 36 = 156</Code>."
          then a new line, <Code>Answer: 156</Code>. The last line is the part your code will pull
          out.
        </ListItem>
        <ListItem>
          Why a fixed ending? The reasoning text is different each time. A fixed label like{" "}
          <Code>Answer:</Code> gives your code something to search for.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Concept: pulling a value out of a larger string</Heading>
      <Text>
        Once the model has "shown its work," your code still needs to lift just the final answer
        back out of all that reasoning text.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Imagine a receipt printed as one block of text, and you just want the total:
      </Text>
      <RunnableExample labId={11} code={`receipt = "2x Coffee  $8.00\\n1x Muffin  $3.50\\nTotal: $11.50"

def extract_total(text: str, marker: str = "Total:") -> str:
    if marker not in text:
        return text.strip()
    return text.rsplit(marker, 1)[1].strip()

print(extract_total(receipt))  # "$11.50"`} />
      <Text>
        <Code>str.rsplit(marker, 1)</Code> splits the string into two pieces at the{" "}
        <i>last</i> occurrence of <Code>marker</Code>, and <Code>[1]</Code> grabs everything after
        it - exactly the "just give me what comes after the label" pattern.
      </Text>

      <Text>Here is <Code>extract_total</Code> on the receipt, one step at a time:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>receipt</Code> is one string with three lines. The <Code>\n</Code> inside means "new
          line". So the text is "2x Coffee $8.00", then "1x Muffin $3.50", then "Total: $11.50".
        </ListItem>
        <ListItem>
          <Code>marker not in text</Code> checks that the label <Code>"Total:"</Code> is somewhere
          in the text. It is, so we keep going. (If it were missing, the function returns the whole
          text, cleaned up with <Code>.strip()</Code>.)
        </ListItem>
        <ListItem>
          <Code>text.rsplit("Total:", 1)</Code> cuts the text at the last <Code>"Total:"</Code>. The{" "}
          <Code>1</Code> means "cut at most once". You get a list of two pieces: everything before
          it, and <Code>" $11.50"</Code> (with a space in front).
        </ListItem>
        <ListItem>
          <Code>[1]</Code> picks the second piece (positions count from 0). <Code>.strip()</Code>{" "}
          removes the space. The result is <Code>"$11.50"</Code>.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`forecast = "Morning: cloudy\\nAfternoon: sunny\\nHigh: 78F"

def extract_high(text: str, marker: str = "High:") -> str:
    if marker not in text:
        return text.strip()
    return text.rsplit(marker, 1)[1].strip()

print(extract_high(forecast))  # expected output: 78F`}
      </Code>
      <PracticeCell labId={11} cellId="concept-2" code={`forecast = "Morning: cloudy\\nAfternoon: sunny\\nHigh: 78F"

def extract_high(text: str, marker: str = "High:") -> str:
    if marker not in text:
        return text.strip()
    return text.rsplit(marker, 1)[1].strip()

print(extract_high(forecast))  # expected output: 78F`} expectedOutput={`78F`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>forecast</Code> is one string with three lines: "Morning: cloudy", "Afternoon:
          sunny" and "High: 78F".
        </ListItem>
        <ListItem>
          <Code>extract_high</Code> uses the marker <Code>"High:"</Code>. It is in the text, so the
          function does not return early.
        </ListItem>
        <ListItem>
          <Code>forecast.rsplit("High:", 1)</Code> gives two pieces: the first two lines, and{" "}
          <Code>" 78F"</Code>. The <Code>[1]</Code> picks the second one, and <Code>.strip()</Code>{" "}
          removes the space in front.
        </ListItem>
        <ListItem>
          The first two lines are thrown away. Only the value after the label is kept.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> one line, <Code>78F</Code>. Try changing the marker to{" "}
        <Code>"Afternoon:"</Code> in the call, like{" "}
        <Code>extract_high(forecast, "Afternoon:")</Code>. Now everything after that label is kept,
        so you should see <Code>sunny</Code>, a new line, then <Code>High: 78F</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>extract_final_answer(reply_text, marker="Answer:")</Code> does precisely this on a
        model's chain-of-thought reply: the model might write several paragraphs of reasoning, but
        as long as it ends with a line like <Code>"Answer: 80"</Code>, splitting on the last{" "}
        <Code>"Answer:"</Code> and stripping whitespace reliably recovers just <Code>"80"</Code> -
        turning free-form reasoning text back into a value your code can compare, store, or grade
        without a person having to read the whole paragraph.
      </Text>
      <Text>
        Take this reply, where the line breaks are real new lines: "<Code>12 * 10 = 120</Code>", "<Code>12 * 3</Code> =
        36", "<Code>120 + 36 = 156</Code>", and then <Code>Answer: 156</Code>.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>"Answer:" in reply_text</Code> is True, so the function does not return early.
        </ListItem>
        <ListItem>
          <Code>reply_text.rsplit("Answer:", 1)</Code> cuts at the last <Code>"Answer:"</Code>. The
          first piece is the three lines of steps. The second piece is <Code>" 156"</Code>.
        </ListItem>
        <ListItem>
          <Code>[1].strip()</Code> takes the second piece and removes the space. You get{" "}
          <Code>"156"</Code>. Note it is text, so use <Code>int("156")</Code> if you need a number.
        </ListItem>
        <ListItem>
          Why the last one? A model might write the word <Code>Answer:</Code> early, for example
          while thinking. Cutting at the last one always gets the final answer.
        </ListItem>
        <ListItem>
          If the model forgot the marker, for example it wrote only "It is 156", the function
          returns the whole reply, stripped: <Code>"It is 156"</Code>. Your code can then see that
          something went wrong.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Further reading</Heading>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Link href="https://www.ibm.com/think/topics/chain-of-thoughts" isExternal>
            IBM Think - What is chain of thought (CoT) prompting?
          </Link>
        </ListItem>
      </UnorderedList>
    </VStack>
  );
}
