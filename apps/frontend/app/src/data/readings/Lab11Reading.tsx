import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";

export function Lab11Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Making the model show its work</Heading>
      <Text>
        For tasks that involve any reasoning (arithmetic, logic, multi-step inference), asking a
        model to think step by step before answering - chain-of-thought - measurably improves
        accuracy over asking for the answer directly. The model generates its reasoning as regular
        text, so you need a clear final-answer marker to reliably pull the actual answer back out.
      </Text>

      <Heading size="sm">Concept: comparing two approaches side by side</Heading>
      <Text>
        Chain-of-thought is the difference between blurting out an answer and showing your work.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Suppose you need <Code>17 * 24</Code>. You could blurt out a guess from memory, or you
        could work it out on paper:
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
{`def guess_directly(a, b):
    """Straight to an answer - fast, but nothing to check if it's wrong."""
    return a * b  # a person doing this "in their head" might misremember a step

def show_the_work(a, b):
    """Break it into steps you can each verify."""
    step1 = a * 20      # 17 * 20 = 340
    step2 = a * 4       # 17 * 4  = 68
    total = step1 + step2
    return f"{a}*20={step1}, {a}*4={step2}, total={total}"

print(guess_directly(17, 24))   # 408 - correct, but you'd have to trust it
print(show_the_work(17, 24))    # shows each intermediate number, easy to audit`}
      </Code>
      <Text>
        Both approaches can land on the right number, but the second one produces a trail of
        intermediate steps - a <b>reasoning trace</b> - that you (or anyone else) can check for
        mistakes along the way. For a person, and it turns out for language models too, actually
        writing out the intermediate steps tends to catch errors that jumping straight to an
        answer would miss.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
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
      <PracticeCell labId={11} code={`def guess_total(price, tax_rate):
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

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>build_direct_prompt(question)</Code> asks for a short answer immediately
        (the "guess directly" path), while <Code>build_cot_prompt(question)</Code> explicitly asks
        the model to "think step by step, then end with a final line 'Answer: &lt;your
        answer&gt;'" - the "show the work" path. The real-world project cell runs both prompts on
        the same three reasoning questions (train speeds, discounts, ratios) and prints both
        replies side by side, so you can see chain-of-thought's reasoning trace actually land on
        the correct number more often than the rushed direct answer.
      </Text>

      <Heading size="sm">Concept: pulling a value out of a larger string</Heading>
      <Text>
        Once the model has "shown its work," your code still needs to lift just the final answer
        back out of all that reasoning text.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Imagine a receipt printed as one block of text, and you just want the total:
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
{`receipt = "2x Coffee  $8.00\\n1x Muffin  $3.50\\nTotal: $11.50"

def extract_total(text: str, marker: str = "Total:") -> str:
    if marker not in text:
        return text.strip()
    return text.rsplit(marker, 1)[1].strip()

print(extract_total(receipt))  # "$11.50"`}
      </Code>
      <Text>
        <Code>str.rsplit(marker, 1)</Code> splits the string into two pieces at the{" "}
        <i>last</i> occurrence of <Code>marker</Code>, and <Code>[1]</Code> grabs everything after
        it - exactly the "just give me what comes after the label" pattern.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`forecast = "Morning: cloudy\\nAfternoon: sunny\\nHigh: 78F"

def extract_high(text: str, marker: str = "High:") -> str:
    if marker not in text:
        return text.strip()
    return text.rsplit(marker, 1)[1].strip()

print(extract_high(forecast))  # expected output: 78F`}
      </Code>
      <PracticeCell labId={11} code={`forecast = "Morning: cloudy\\nAfternoon: sunny\\nHigh: 78F"

def extract_high(text: str, marker: str = "High:") -> str:
    if marker not in text:
        return text.strip()
    return text.rsplit(marker, 1)[1].strip()

print(extract_high(forecast))  # expected output: 78F`} expectedOutput={`78F`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>extract_final_answer(reply_text, marker="Answer:")</Code> does precisely this on a
        model's chain-of-thought reply: the model might write several paragraphs of reasoning, but
        as long as it ends with a line like <Code>"Answer: 80"</Code>, splitting on the last{" "}
        <Code>"Answer:"</Code> and stripping whitespace reliably recovers just <Code>"80"</Code> -
        turning free-form reasoning text back into a value your code can compare, store, or grade
        without a person having to read the whole paragraph.
      </Text>

      <Heading size="sm">Notebook - needs a free Groq API key</Heading>
      <Text>
        Open <Code>course/notebooks/lab_11_chain_of_thought.ipynb</Code>. Implement{" "}
        <Code>build_direct_prompt</Code>, <Code>build_cot_prompt</Code> (adds a "think step by
        step, then answer as 'Answer: &lt;answer&gt;'" instruction), and{" "}
        <Code>extract_final_answer</Code>. The project compares direct-answer vs.
        chain-of-thought prompting on a handful of small reasoning questions - the kind small/fast
        models often get wrong when rushed into a one-shot answer.
      </Text>

      <Heading size="sm">Further reading</Heading>
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
