import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab10Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Showing, not just telling</Heading>
      <Text>
        Few-shot prompting adds a handful of worked (input, output) examples to the messages list
        before the real question - it steers the model's <i>format</i> far more reliably than
        instructions alone, which matters a lot when you need to parse the reply as data (here,
        JSON) instead of just reading it.
      </Text>

      <Heading size="sm">Concept: teaching by example, not by rule</Heading>
      <Text>
        Few-shot prompting is just this idea applied to a model's messages list instead of a
        person.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Imagine you want a friend to reformat a list of names from "First Last" to "Last, F." You
        could describe the rule in words ("take the last word, put it first, add a comma, then the
        first letter of the first word followed by a period") - or you could just show them:
      </Text>
      <RunnableExample labId={10} code={`examples = [
    ("Ada Lovelace", "Lovelace, A."),
    ("Grace Hopper", "Hopper, G."),
]
# Show these two, then ask: "Alan Turing" -> ?
# Most people (and most models) infer "Turing, A." from the pattern
# faster and more reliably than from the worded rule above.`} />
      <Text>
        That's few-shot learning: instead of (or in addition to) instructions, you hand over a
        short list of worked examples and let the reader (or the model) infer the pattern. It's
        especially good at pinning down <i>format</i> - the exact shape of the output - which
        plain instructions are often too vague to nail down.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`examples = [
    ("hello", "HELLO!"),
    ("bye", "BYE!"),
]
# Instead of describing the rule in words, just show the pattern:
def apply_pattern(word):
    return word.upper() + "!"

query = "yes"
print(apply_pattern(query))  # expected output: YES!`}
      </Code>
      <PracticeCell labId={10} cellId="concept-1" code={`examples = [
    ("hello", "HELLO!"),
    ("bye", "BYE!"),
]
# Instead of describing the rule in words, just show the pattern:
def apply_pattern(word):
    return word.upper() + "!"

query = "yes"
print(apply_pattern(query))  # expected output: YES!`} expectedOutput={`YES!`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In this lab, <Code>build_few_shot_messages(examples, query)</Code> does exactly this for
        the API's messages list: it takes a list of <Code>(review, result_dict)</Code> pairs and
        replays each one as a fake prior conversation turn - a <Code>user</Code> message with the
        review text, followed by an <Code>assistant</Code> message with{" "}
        <Code>json.dumps(result_dict)</Code> - before appending the real question. By the time the
        model sees the actual query, it has already "seen" two examples of exactly the JSON shape
        you want back, which is far more reliable than just telling it "reply with JSON."
      </Text>

      <Heading size="sm">Concept: parsing (and trusting) JSON output</Heading>
      <Text>
        A model's reply is just text, so before your program can use it as data, that text has to
        be parsed and checked.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Say you have a text file of contacts, one JSON object per line, and you want to load them
        into a Python program:
      </Text>
      <RunnableExample labId={10} code={`import json

raw = '{"name": "Priya", "phone": "555-0100"}'

try:
    contact = json.loads(raw)
    if "phone" not in contact:
        raise ValueError("missing phone number")
    print(contact["name"], contact["phone"])
except json.JSONDecodeError:
    print("that wasn't valid JSON at all")
except ValueError as e:
    print(f"parsed fine, but the data is incomplete: {e}")`} />
      <Text>
        <Code>json.loads</Code> turns a JSON-formatted string into real Python data (a dict, here)
        - but it only works if the string is <i>exactly</i> valid JSON, and even then the dict
        might be missing a key your program needs. That's why parsing untrusted text always wants
        a <Code>try/except</Code>: one branch for "this wasn't JSON at all"
        (<Code>json.JSONDecodeError</Code>), another for "it parsed, but the shape is wrong" (a
        manual check that raises <Code>ValueError</Code>).
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`import json

raw = '{"item": "Mug", "price": 9.99}'

try:
    product = json.loads(raw)
    if "price" not in product:
        raise ValueError("missing price")
    print(product["item"], product["price"])  # expected output: Mug 9.99
except json.JSONDecodeError:
    print("not valid JSON")
except ValueError as e:
    print(f"parsed but incomplete: {e}")`}
      </Code>
      <PracticeCell labId={10} cellId="concept-2" code={`import json

raw = '{"item": "Mug", "price": 9.99}'

try:
    product = json.loads(raw)
    if "price" not in product:
        raise ValueError("missing price")
    print(product["item"], product["price"])  # expected output: Mug 9.99
except json.JSONDecodeError:
    print("not valid JSON")
except ValueError as e:
    print(f"parsed but incomplete: {e}")`} expectedOutput={`Mug 9.99`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This is exactly the situation with a model's reply: it's just text, and even when you ask
        nicely for JSON, models sometimes wrap it in <Code>```json ... ```</Code> fences or drop a
        key. <Code>parse_json_response(text)</Code> strips a leading/trailing code fence, then
        calls <Code>json.loads</Code>, then explicitly checks that <Code>"sentiment"</Code> and{" "}
        <Code>"confidence"</Code> are both present - raising <Code>ValueError</Code> if not. The
        real-world project cell wraps each call in a{" "}
        <Code>try/except (json.JSONDecodeError, ValueError)</Code> so one malformed reply gets
        logged as a <Code>PARSE ERROR</Code> row instead of crashing the whole loop. This
        parse-then-validate step is literally how you'd wire a model's output into a real
        application - a database write, a UI update, a downstream API call - all of which need
        actual structured data, not a paragraph of prose.
      </Text>

      <Heading size="sm">Notebook - needs a free Groq API key</Heading>
      <Text>
        Open <Code>course/notebooks/lab_10_few_shot_structured.ipynb</Code>. Implement{" "}
        <Code>build_few_shot_messages(examples, query)</Code> and{" "}
        <Code>parse_json_response(text)</Code> - the parser has to cope with models that wrap JSON
        in <Code>```json</Code> fences even when told not to. The project asks Groq for{" "}
        <Code>{'{"sentiment": ..., "confidence": ...}'}</Code> on real sentences and tabulates the
        parsed results.
      </Text>

      <Heading size="sm">Further reading</Heading>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Link href="https://www.ibm.com/think/topics/few-shot-prompting" isExternal>
            IBM Think - What is few-shot prompting?
          </Link>
        </ListItem>
      </UnorderedList>
    </VStack>
  );
}
