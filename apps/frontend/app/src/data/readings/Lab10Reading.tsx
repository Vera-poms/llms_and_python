import { Heading, Link, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab10Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">Few-shot prompting: steer the reply with examples</Heading>
      <Text>
        Few-shot prompting adds a handful of worked (input, output) examples to the messages list
        before the real question - it steers the model's <i>format</i> far more reliably than
        instructions alone, which matters a lot when you need to parse the reply as data (here,
        JSON) instead of just reading it.
      </Text>

      <Heading as="h3" size="sm">Concept: teaching by example, not by rule</Heading>
      <Text>
        Few-shot prompting is just this idea applied to a model's messages list instead of a
        person.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
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

      <Text>Here is what that example shows, step by step:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>examples</Code> is a list of <b>pairs</b>. Each pair is written in round brackets:
          the first part is an input, the second part is the answer you want for it.{" "}
          <Code>("Ada Lovelace", "Lovelace, A.")</Code> is one pair.
        </ListItem>
        <ListItem>
          Look at the two pairs together. Both put the last name first, then a comma, then one
          capital letter and a dot. You never wrote that rule down. The pattern is in the examples.
        </ListItem>
        <ListItem>
          For <Code>"Alan Turing"</Code> you copy the pattern: last name <Code>Turing</Code>, then{" "}
          <Code>, A.</Code>. The result is <Code>"Turing, A."</Code>.
        </ListItem>
        <ListItem>
          A <b>shot</b> is just one example. Zero-shot has none. Few-shot has a few, usually two to
          five.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>examples</Code> holds two pairs: <Code>"hello"</Code> becomes{" "}
          <Code>"HELLO!"</Code> and <Code>"bye"</Code> becomes <Code>"BYE!"</Code>. Look at them
          and you can see the pattern: big letters, then an exclamation mark.
        </ListItem>
        <ListItem>
          <Code>apply_pattern</Code> is a small function that does what the pattern says.{" "}
          <Code>word.upper()</Code> makes all letters big. <Code>+ "!"</Code> adds an exclamation
          mark at the end.
        </ListItem>
        <ListItem>
          <Code>query = "yes"</Code> is the new word. <Code>"yes".upper()</Code> is{" "}
          <Code>"YES"</Code>, and adding <Code>"!"</Code> gives <Code>"YES!"</Code>.
        </ListItem>
        <ListItem>
          The <Code>examples</Code> list is not used by the function. It is only there to show you
          the pattern, the same way you would show examples to a model.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> one line, <Code>YES!</Code>. Try changing <Code>query</Code>{" "}
        to <Code>"thanks"</Code>. You should see <Code>THANKS!</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: why examples steer a model</Heading>
      <Text>
        A model works by continuing text. It looks at everything in the messages list and writes
        what would most likely come next. If the list already holds replies in a clear shape, the
        most likely next reply has that same shape.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          An instruction like "reply with JSON" is easy to read in more than one way. An example
          reply shows the exact keys and the exact style.
        </ListItem>
        <ListItem>
          A <b>shot</b> is one worked example, written as a pair of messages: the user's input, then
          the assistant's reply. Zero-shot means no examples. Few-shot means a few.
        </ListItem>
        <ListItem>
          Every shot costs space in the model's limited window, so use only as many as you need.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. The messages are written out by hand, so nothing is sent
        anywhere. Two small functions look inside a messages list. One counts the shots. The other
        finds the keys of the last example reply, which is the shape the model will copy.
      </Text>
      <RunnableExample labId={10} code={`import json


def count_shots(messages):
    shots = 0
    for message in messages:
        if message["role"] == "assistant":
            shots = shots + 1
    return shots


def shape_to_copy(messages):
    shape = "unknown"
    for message in messages:
        if message["role"] == "assistant":
            shape = sorted(json.loads(message["content"]).keys())
    return shape


zero = [{"role": "user", "content": "Great phone!"}]
few = [
    {"role": "user", "content": "Great phone!"},
    {"role": "assistant", "content": '{"topic": "phone", "mood": "happy"}'},
    {"role": "user", "content": "Slow delivery."},
    {"role": "assistant", "content": '{"topic": "delivery", "mood": "upset"}'},
    {"role": "user", "content": "Nice shoes!"},
]
for name, messages in [("zero-shot", zero), ("few-shot", few)]:
    print(name, "-> messages:", len(messages), "shots:", count_shots(messages), "shape:", shape_to_copy(messages))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>count_shots</Code> loops over the messages and adds 1 for each{" "}
          <Code>assistant</Code> message, because each one is a worked answer.
        </ListItem>
        <ListItem>
          <Code>shape_to_copy</Code> turns the text of each assistant reply back into a dict with{" "}
          <Code>json.loads</Code> and keeps its keys. <Code>sorted</Code> puts them in a fixed
          order. The last example wins.
        </ListItem>
        <ListItem>
          The zero-shot list has 1 message and 0 shots, so the shape is <Code>unknown</Code>. The
          few-shot list has 5 messages and 2 shots, and the shape is{" "}
          <Code>{"['mood', 'topic']"}</Code>. The model has seen those keys twice.
        </ListItem>
        <ListItem>
          Pattern: each shot adds two messages, and the examples show the shape you want back.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on new messages that ask for a city and a temperature.
      </Text>
      <PracticeCell labId={10} cellId="topic-1" code={`import json


def count_shots(messages):
    shots = 0
    for message in messages:
        if message["role"] == "assistant":
            shots = shots + 1
    return shots


def shape_to_copy(messages):
    shape = "unknown"
    for message in messages:
        if message["role"] == "assistant":
            shape = sorted(json.loads(message["content"]).keys())
    return shape


one = [
    {"role": "user", "content": "Weather in Accra?"},
    {"role": "assistant", "content": '{"city": "Accra", "temp": 31}'},
    {"role": "user", "content": "Weather in Kumasi?"},
]
none = [{"role": "user", "content": "Weather in Kumasi?"}]
for name, messages in [("no shots", none), ("one shot", one)]:
    print(name, "-> messages:", len(messages), "shots:", count_shots(messages), "shape:", shape_to_copy(messages))`} expectedOutput={`no shots -> messages: 1 shots: 0 shape: unknown
one shot -> messages: 3 shots: 1 shape: ['city', 'temp']`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>none</Code> is only the question. It has 1 message and 0 shots, so the model has no
          shape to copy.
        </ListItem>
        <ListItem>
          <Code>one</Code> has an example pair, then the real question. That is 3 messages and 1
          shot.
        </ListItem>
        <ListItem>
          The example reply has the keys <Code>city</Code> and <Code>temp</Code>, so a model reading
          this list would answer Kumasi in the same shape.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>no shots -&gt; messages: 1 shots: 0 shape: unknown</Code>,
        then <Code>{"one shot -> messages: 3 shots: 1 shape: ['city', 'temp']"}</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In this lab, <Code>build_few_shot_messages(examples, query)</Code> builds the messages list
        for you. It takes a list of <Code>(review, result_dict)</Code> pairs and replays each one as
        a fake earlier turn: a <Code>user</Code> message with the review text, then an{" "}
        <Code>assistant</Code> message with <Code>json.dumps(result_dict)</Code>. The real question
        goes last.
      </Text>
      <Text>
        In the project, <Code>FEW_SHOT_EXAMPLES</Code> holds exactly 2 pairs. One review is
        positive with confidence 0.97 and one is negative with confidence 0.95. So each call sends 6
        messages: 1 system, 2 for each example, and the real review.
      </Text>
      <Text>
        Here is the function on one tiny example. Say{" "}
        <Code>examples = [("Amazing!", {"{"}"sentiment": "positive", "confidence": 0.95{"}"})]</Code>{" "}
        and <Code>query = "Terrible."</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The list starts with one <Code>system</Code> message. It tells the model: reply with only
          a JSON object that has <Code>sentiment</Code> and <Code>confidence</Code>, and no other
          text.
        </ListItem>
        <ListItem>
          The loop takes the pair. <Code>review</Code> is <Code>"Amazing!"</Code> and{" "}
          <Code>result</Code> is the dict. It adds a <Code>user</Code> message with content{" "}
          <Code>"Amazing!"</Code>.
        </ListItem>
        <ListItem>
          Then it adds an <Code>assistant</Code> message. Its content is{" "}
          <Code>json.dumps(result)</Code>, which is the text{" "}
          <Code>{"'{\"sentiment\": \"positive\", \"confidence\": 0.95}'"}</Code>. It must be text, not
          a dict, because message content is always text. <Code>json.dumps</Code> means "dump to a
          JSON string".
        </ListItem>
        <ListItem>
          After the loop, the last message is the real question: a <Code>user</Code> message with{" "}
          <Code>"Terrible."</Code>.
        </ListItem>
        <ListItem>
          The final list has 4 messages: system, user, assistant, user. The model reads it as if it
          had already answered "Amazing!" in JSON once, so it copies that shape for "Terrible.".
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Concept: parsing (and trusting) JSON output</Heading>
      <Text>
        A model's reply is just text, so before your program can use it as data, that text has to
        be parsed and checked.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
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

      <Text>Here is what happens with the contact example:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>raw</Code> is a string that only looks like a dict. Python sees it as plain text.
          You cannot ask it for <Code>raw["name"]</Code>.
        </ListItem>
        <ListItem>
          <Code>json.loads(raw)</Code> reads that text and builds a real dict:{" "}
          <Code>{"{'name': 'Priya', 'phone': '555-0100'}"}</Code>. The name means "load from a
          string".
        </ListItem>
        <ListItem>
          <Code>"phone" not in contact</Code> asks whether the label is missing. It is there, so
          nothing is raised and the print shows <Code>Priya 555-0100</Code>.
        </ListItem>
        <ListItem>
          <Code>try</Code> means "attempt this". If an error happens inside, Python jumps to the
          matching <Code>except</Code> block instead of crashing. If <Code>raw</Code> were{" "}
          <Code>"hello there"</Code>, <Code>json.loads</Code> would fail and the first{" "}
          <Code>except</Code> would print "that wasn't valid JSON at all".
        </ListItem>
        <ListItem>
          If <Code>raw</Code> were <Code>{"'{\"name\": \"Priya\"}'"}</Code>, the text is valid JSON
          but has no phone. Our own <Code>raise ValueError(...)</Code> fires, and the second{" "}
          <Code>except</Code> prints the message.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>raw</Code> is text holding a product: item <Code>"Mug"</Code> and price 9.99.
        </ListItem>
        <ListItem>
          <Code>json.loads(raw)</Code> turns it into the dict{" "}
          <Code>{"{'item': 'Mug', 'price': 9.99}"}</Code>. The price is a real number now, not
          text.
        </ListItem>
        <ListItem>
          <Code>"price" not in product</Code> is False, because the label is there. So the{" "}
          <Code>raise</Code> line is skipped.
        </ListItem>
        <ListItem>
          <Code>print(product["item"], product["price"])</Code> prints both values with a space
          between them: <Code>Mug 9.99</Code>. No <Code>except</Code> block runs.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> one line, <Code>Mug 9.99</Code>. Try changing{" "}
        <Code>raw</Code> to <Code>{"'{\"item\": \"Mug\"}'"}</Code>. The price is gone now, so you
        should see <Code>parsed but incomplete: missing price</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: a reply is text, so check it</Heading>
      <Text>
        A model never hands your program a dict. It sends back a string, and it is a string that
        looks like JSON. Your code cannot trust it until it has checked it.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The reply may be wrapped in a code fence, or be plain words instead of JSON.
        </ListItem>
        <ListItem>
          The reply may be valid JSON that is missing a key you need.
        </ListItem>
        <ListItem>
          Asking for JSON, even with the API's JSON mode, makes these problems rarer but not
          impossible. So the safe plan is: expect a few bad replies, and handle each one.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. Four replies are pretend model replies, written as plain strings.
        One function sorts each reply into <Code>ok</Code>, <Code>not JSON</Code> or a missing key,
        and a loop counts the usable ones.
      </Text>
      <RunnableExample labId={10} code={`import json


def check_reply(text, needed):
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        return "not JSON"
    for key in needed:
        if key not in data:
            return "missing " + key
    return "ok"


replies = [
    '{"sentiment": "positive", "confidence": 0.9}',
    '{"sentiment": "negative"}',
    "I think it is negative",
    '{"sentiment": "positive", "confidence": 0.8}',
]
usable = 0
for reply in replies:
    result = check_reply(reply, ["sentiment", "confidence"])
    if result == "ok":
        usable = usable + 1
    print(result)
print(usable, "of", len(replies), "replies usable")`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>check_reply</Code> first tries <Code>json.loads</Code>. If the text is not JSON, the{" "}
          <Code>except</Code> branch returns <Code>not JSON</Code> straight away.
        </ListItem>
        <ListItem>
          If it parsed, a loop checks each needed key. The first one that is absent gives{" "}
          <Code>missing confidence</Code>, for example. If none is absent, the answer is{" "}
          <Code>ok</Code>.
        </ListItem>
        <ListItem>
          The four replies give <Code>ok</Code>, <Code>missing confidence</Code>,{" "}
          <Code>not JSON</Code> and <Code>ok</Code>. Only 2 of 4 are usable.
        </ListItem>
        <ListItem>
          Pattern: parse, then check the keys, and turn each failure into a plain label instead of
          a crash.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same function on five new replies that should hold a city and a temp.
      </Text>
      <PracticeCell labId={10} cellId="topic-2" code={`import json


def check_reply(text, needed):
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        return "not JSON"
    for key in needed:
        if key not in data:
            return "missing " + key
    return "ok"


replies = [
    '{"city": "Accra", "temp": 31}',
    "It is sunny in Accra",
    '{"city": "Kumasi"}',
    '{"city": "Tamale", "temp": 35}',
    '{"temp": 29}',
]
usable = 0
for reply in replies:
    result = check_reply(reply, ["city", "temp"])
    if result == "ok":
        usable = usable + 1
    print(result)
print(usable, "of", len(replies), "replies usable")`} expectedOutput={`ok
not JSON
missing temp
ok
missing city
2 of 5 replies usable`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Reply 1 and reply 4 have both keys, so they are <Code>ok</Code>.
        </ListItem>
        <ListItem>
          Reply 2 is plain words, so <Code>json.loads</Code> fails and the answer is{" "}
          <Code>not JSON</Code>.
        </ListItem>
        <ListItem>
          Reply 3 has <Code>city</Code> but no <Code>temp</Code>. Reply 5 has <Code>temp</Code> but
          no <Code>city</Code>. The loop checks <Code>city</Code> first, so reply 5 says{" "}
          <Code>missing city</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> five labels, then <Code>2 of 5 replies usable</Code>. Notice that
        a program that trusted every reply would have failed on 3 of the 5.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>parse_json_response(text)</Code> is the lab's version of <Code>check_reply</Code>. It
        strips a code fence from the start and end, calls <Code>json.loads</Code>, then checks that{" "}
        <Code>"sentiment"</Code> and <Code>"confidence"</Code> are both there. If one is missing it
        raises <Code>ValueError</Code>.
      </Text>
      <Text>
        In the project, the call asks for JSON mode with{" "}
        <Code>{"response_format={\"type\": \"json_object\"}"}</Code>. Each of the 8 reviews
        (<Code>N_SAMPLES = 8</Code>) is wrapped in{" "}
        <Code>try/except (json.JSONDecodeError, ValueError)</Code>. A bad reply becomes a row with{" "}
        <Code>PARSE ERROR: ...</Code> and a confidence of <Code>None</Code>, so{" "}
        <Code>len(results)</Code> is still 8 and one bad reply cannot crash the loop.
      </Text>
      <Text>
        Here is <Code>parse_json_response</Code> on a reply wrapped in a code fence. A{" "}
        <b>code fence</b> is a line of three backticks that some models put around code. The reply
        is <Code>```json</Code>, a new line, <Code>{"{\"sentiment\": \"negative\", \"confidence\": 0.8}"}</Code>,
        a new line, then <Code>```</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>text.strip()</Code> removes spaces and blank lines from both ends. Nothing changes
          here.
        </ListItem>
        <ListItem>
          <Code>cleaned.startswith("```")</Code> is True, so the cleanup runs.{" "}
          <Code>cleaned.strip("`")</Code> removes backticks from both ends. What is left is{" "}
          <Code>json</Code>, a new line, the JSON, and a new line.
        </ListItem>
        <ListItem>
          <Code>.removeprefix("json")</Code> removes the word <Code>json</Code> from the start, and{" "}
          <Code>.strip()</Code> removes the new lines. Now only the JSON text remains.
        </ListItem>
        <ListItem>
          <Code>json.loads(cleaned)</Code> makes the dict. Then{" "}
          <Code>{"{'sentiment', 'confidence'}"} - result.keys()</Code> subtracts the labels that are
          present from the labels we need. Nothing is left over, so <Code>missing</Code> is empty
          and the dict is returned.
        </ListItem>
        <ListItem>
          If the reply were <Code>{"{\"sentiment\": \"negative\"}"}</Code>, then{" "}
          <Code>missing</Code> would be <Code>{"{'confidence'}"}</Code> and you would get{" "}
          <Code>ValueError: Missing required key(s): ['confidence']</Code>. If the reply were
          plain words like <Code>I think it is negative</Code>, <Code>json.loads</Code> itself
          raises <Code>json.JSONDecodeError</Code>. Both are caught by the project loop.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Further reading</Heading>
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
