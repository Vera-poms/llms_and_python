import { Heading, Link, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab11Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">Chain-of-thought: asking the model to think step by step</Heading>
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

      <Heading as="h4" size="xs" color="gray.600">Up close: why steps help a model</Heading>
      <Text>
        A model writes its reply one small piece at a time, and each piece it writes becomes part
        of the text it reads next. That gives a simple reason why steps help.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          With a direct answer, the model must get a number right in its first few words, with no
          working out in between.
        </ListItem>
        <ListItem>
          With steps, each small result is written down first. The next step can read it, like
          working on paper.
        </ListItem>
        <ListItem>
          The price is a longer reply. That takes more time and uses more of the model's window.
          Steps also help often, not always.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. The two replies are pretend replies, written by hand, because no
        model is called. One function counts the words in a reply, as a simple measure of cost. The
        other checks whether the reply ends with the right number.
      </Text>
      <RunnableExample labId={11} code={`def word_cost(reply):
    return len(reply.split())


def is_correct(reply, expected):
    return reply.strip().endswith(expected)


expected = "408"
replies = [
    ("direct", "406"),
    ("step by step", "17*20=340. 17*4=68. 340+68=408. Answer: 408"),
]
for style, reply in replies:
    print(style, "-> words:", word_cost(reply), "correct:", is_correct(reply, expected))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>word_cost</Code> splits the reply at the spaces and counts the pieces.{" "}
          <Code>is_correct</Code> asks whether the reply ends with the expected text.
        </ListItem>
        <ListItem>
          The direct reply is 1 word and it is wrong. The step-by-step reply is 5 words and it ends
          with <Code>408</Code>, which is right.
        </ListItem>
        <ListItem>
          Pattern: steps cost more words, and in return the answer is easier to get right and easy
          to check.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on a new question, 17 * 23, which is 391.
      </Text>
      <PracticeCell labId={11} cellId="topic-1" code={`def word_cost(reply):
    return len(reply.split())


def is_correct(reply, expected):
    return reply.strip().endswith(expected)


expected = "391"
replies = [
    ("direct", "381"),
    ("step by step", "17*20=340. 17*3=51. 340+51=391. Answer: 391"),
]
for style, reply in replies:
    print(style, "-> words:", word_cost(reply), "correct:", is_correct(reply, expected))`} expectedOutput={`direct -> words: 1 correct: False
step by step -> words: 5 correct: True`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>17 * 20 = 340</Code> and <Code>17 * 3 = 51</Code>, so the total is{" "}
          <Code>340 + 51 = 391</Code>.
        </ListItem>
        <ListItem>
          The direct reply <Code>381</Code> is 1 word and does not end with <Code>391</Code>. The
          step reply has 5 words and does.
        </ListItem>
        <ListItem>
          The loop prints one line per style, so the cost and the result sit side by side.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>direct -&gt; words: 1 correct: False</Code>, then{" "}
        <Code>step by step -&gt; words: 5 correct: True</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab has two prompt builders. <Code>build_direct_prompt(question)</Code> asks for a short
        answer at once (the "guess directly" path). <Code>build_cot_prompt(question)</Code> asks the
        model to "think step by step, then end with a final line 'Answer: &lt;your answer&gt;'" (the
        "show the work" path).
      </Text>
      <Text>
        The project keeps 3 word problems in <Code>QUESTIONS</Code>: a train speed (answer 80), a
        discounted shirt (answer 50) and an apples ratio (answer 18). For each question it makes
        exactly 2 live calls, one direct and one chain-of-thought. That is 3 x 2 = 6 calls. It prints
        the expected answer, the direct answer and the chain-of-thought answer side by side. The
        replies change from run to run, because the temperature is 0.7.
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

      <Heading as="h4" size="xs" color="gray.600">Up close: a fixed last line makes the answer findable</Heading>
      <Text>
        A model's reasoning is free text. The wording changes on every run, so your code cannot
        guess where the answer sits. The fix is to ask for a fixed last line.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The label, like <Code>Answer:</Code>, is a <b>marker</b>. It tells your code where the
          final answer starts.
        </ListItem>
        <ListItem>
          The model may still add extras, like a unit (<Code>80 mph</Code>), or forget the marker.
          Your code has to cope with both.
        </ListItem>
        <ListItem>
          Once the answer is pulled out, a program can compare it with the right answer and grade
          the reply, with no person reading the steps.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. The three replies are pretend replies, written by hand. One
        function finds the marker line. Another grades the reply against the expected answer. It
        reads only the first word of the answer, so a unit is allowed.
      </Text>
      <RunnableExample labId={11} code={`def final_answer(reply):
    answer = None
    for line in reply.split("\\n"):
        if line.startswith("Answer:"):
            answer = line[len("Answer:"):].strip()
    return answer


def grade(reply, expected):
    answer = final_answer(reply)
    if answer is None:
        return "no marker"
    if answer.split()[0] == expected:
        return "right"
    return "wrong"


replies = [
    "45 minutes is 0.75 hours.\\n60 / 0.75 = 80.\\nAnswer: 80 mph",
    "Maybe 60.\\nAnswer: 60",
    "It is about 80",
]
for reply in replies:
    print(grade(reply, "80"))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>final_answer</Code> loops over the lines of the reply. When a line starts with{" "}
          <Code>Answer:</Code>, it keeps the text after the label. <Code>None</Code> means "nothing
          found". Later marker lines replace earlier ones, so the last one wins.
        </ListItem>
        <ListItem>
          <Code>grade</Code> returns <Code>no marker</Code> if nothing was found. Otherwise it
          compares the first word of the answer with the expected text.
        </ListItem>
        <ListItem>
          Reply 1 gives <Code>80 mph</Code>, and its first word is <Code>80</Code>, so it is right.
          Reply 2 gives <Code>60</Code>, which is wrong. Reply 3 has no marker line at all.
        </ListItem>
        <ListItem>
          Pattern: ask for a fixed last line, pull it out, then grade it. Handle a missing marker
          on purpose.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on new replies, with the expected answer 50.
      </Text>
      <PracticeCell labId={11} cellId="topic-2" code={`def final_answer(reply):
    answer = None
    for line in reply.split("\\n"):
        if line.startswith("Answer:"):
            answer = line[len("Answer:"):].strip()
    return answer


def grade(reply, expected):
    answer = final_answer(reply)
    if answer is None:
        return "no marker"
    if answer.split()[0] == expected:
        return "right"
    return "wrong"


replies = [
    "40 / 0.8 = 50.\\nAnswer: 50 dollars",
    "The shirt cost 50",
    "40 + 20 = 60.\\nAnswer: 60",
    "Answer: 50",
]
for reply in replies:
    print(grade(reply, "50"))`} expectedOutput={`right
no marker
wrong
right`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Reply 1 ends with <Code>Answer: 50 dollars</Code>. The first word is <Code>50</Code>, so
          it is right, even with the unit.
        </ListItem>
        <ListItem>
          Reply 2 has the right number but no <Code>Answer:</Code> line, so it is graded{" "}
          <Code>no marker</Code>.
        </ListItem>
        <ListItem>
          Reply 3 has the marker but the answer is <Code>60</Code>, so it is wrong. Reply 4 is only
          the marker line and <Code>50</Code>, so it is right.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> four lines: <Code>right</Code>, <Code>no marker</Code>,{" "}
        <Code>wrong</Code>, <Code>right</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>extract_final_answer(reply_text, marker="Answer:")</Code> is the lab's version of{" "}
        <Code>final_answer</Code>. It gives back the text after the last <Code>"Answer:"</Code>,
        with the spaces removed. If the marker is missing, it gives back the whole reply, stripped.
      </Text>
      <Text>
        In the project, <Code>cot_answer = extract_final_answer(cot_reply)</Code> keeps only the
        short answer, and that is all the chain-of-thought line prints. The expected answers in{" "}
        <Code>QUESTIONS</Code> are the strings <Code>"80"</Code>, <Code>"50"</Code> and{" "}
        <Code>"18"</Code>. The model may add a unit, such as <Code>80 mph</Code>, and that is
        allowed. The direct reply is cut with <Code>.strip()[:60]</Code> instead.
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
