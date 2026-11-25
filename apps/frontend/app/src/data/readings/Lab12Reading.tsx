import { Heading, Link, OrderedList, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, RunSubmitKeys, Text } from "../../components/prose";

import { CodeBlock } from "../../components/CodeBlock";
import { PracticeCell } from "../../components/PracticeCell";
import { CodeHint } from "../../components/codeHints";
import { RunnableExample } from "../../components/RunnableExample";

const CHAT_LOG_HINTS: CodeHint[] = [
  {
    code: "chat_log = [",
    text:
      "A **list** is an ordered row of things, written in square brackets. A **dict** is a small table of labels and values, written in curly braces. A label is called a **key**. `chat_log` is a list with 3 dicts inside. Each dict is one turn in the chat.",
  },
  {
    code: "\"speaker\": \"Sam\"",
    text:
      "This dict has the key `\"speaker\"` and the value `\"Sam\"`.",
  },
  {
    code: "for turn in chat_log:",
    block: "for loop",
    text:
      "Visits the dicts one by one. On the first pass `turn` is the Sam dict. On the second pass it is the Robin dict. On the third pass it is the Sam dict again.",
  },
  {
    code: "turn['speaker']",
    text:
      "Reads the value for the key `\"speaker\"`, which is `\"Sam\"` on the first pass.",
  },
  {
    code: "turn['text']",
    text:
      "Reads the value for the key `\"text\"`, which is `\"running late, sorry!\"` on the first pass.",
  },
  {
    code: "print(f\"",
    text:
      "The `f` before the quote marks makes an **f-string**. Whatever is inside `{...}` is replaced by its value. So the first line printed is `Sam: running late, sorry!`. Then `Robin: no worries, see you soon`, then `Sam: be there in 5`.",
  },
];

export function Lab12Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">System messages: one instruction for the whole chat</Heading>
      <Text>
        A system message sits at the front of the messages list and shapes every reply for the
        rest of the conversation, independent of whatever the user asks - it's how you give a
        model a persona, a role, boundaries, or a house style once instead of repeating it every
        turn.
      </Text>

      <Heading as="h3" size="sm">Concept: a list of dicts as a conversation</Heading>
      <Text>
        Before looking at the "system" role specifically, it helps to see what a conversation
        even <i>is</i> in code.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        You can represent a chat log between two friends as a plain Python list, where each turn
        is a small dict with who spoke and what they said:
      </Text>
      <RunnableExample labId={12} code={`chat_log = [
    {"speaker": "Sam", "text": "running late, sorry!"},
    {"speaker": "Robin", "text": "no worries, see you soon"},
    {"speaker": "Sam", "text": "be there in 5"},
]

for turn in chat_log:
    print(f"{turn['speaker']}: {turn['text']}")`} hints={CHAT_LOG_HINTS} />
      <Text>
        Nothing fancy here - just a list, where each entry is a dict with a couple of fixed keys.
      </Text>

      <CodeBlock code={`support_log = [
    {"agent": "Bot", "message": "Hi, how can I help?"},
    {"agent": "User", "message": "My order is late."},
    {"agent": "Bot", "message": "Let me check that for you."},
]

for turn in support_log:
    print(f"{turn['agent']}: {turn['message']}")
# expected output:
# Bot: Hi, how can I help?
# User: My order is late.
# Bot: Let me check that for you.`} hints={[
        {
          code: "for turn in support_log:",
          block: "for loop",
          text:
            "Visits the 3 dicts one by one and prints one line for each. On the first pass `turn` is the first Bot dict, on the second pass the User dict.",
        },
        {
          code: "support_log = [",
          text:
            "A **list** of 3 **dicts**. A dict holds labels, called **keys**, each with a value, like `\"agent\": \"Bot\"`. Each dict is one turn in the chat.",
        },
        {
          code: "turn['agent']",
          text: "Reads the value stored under the key `\"agent\"`. On the first pass that is `\"Bot\"`.",
        },
        {
          code: "turn['message']",
          text: "Reads the value stored under the key `\"message\"`. On the first pass that is `\"Hi, how can I help?\"`.",
        },
        {
          code: "print(f\"",
          text:
            "The `f` before the quote makes an **f-string**. Each `{...}` is replaced by its value, so the first line printed is `Bot: Hi, how can I help?`.",
        },
        {
          code: "# expected output:",
          text: "Lines that start with `#` are **comments**. Python skips them. These ones show what the code prints.",
        },
      ]} />
      <PracticeCell labId={12} cellId="concept-1" code={`support_log = [
    {"agent": "Bot", "message": "Hi, how can I help?"},
    {"agent": "User", "message": "My order is late."},
    {"agent": "Bot", "message": "Let me check that for you."},
]

for turn in support_log:
    print(f"{turn['agent']}: {turn['message']}")
# expected output:
# Bot: Hi, how can I help?
# User: My order is late.
# Bot: Let me check that for you.`} expectedOutput={`Bot: Hi, how can I help?
User: My order is late.
Bot: Let me check that for you.`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>support_log</Code> is a list of 3 dicts. Each dict has the keys{" "}
          <Code>"agent"</Code> and <Code>"message"</Code>.
        </ListItem>
        <ListItem>
          The loop takes one dict at a time. On pass 1, <Code>turn['agent']</Code> is{" "}
          <Code>"Bot"</Code> and <Code>turn['message']</Code> is <Code>"Hi, how can I help?"</Code>.
        </ListItem>
        <ListItem>
          Pass 2 prints the User line. Pass 3 prints the second Bot line. That is 3 passes and 3
          printed lines.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> three lines, in the same order as the list. Try adding a fourth
        dict, like <Code>{'{"agent": "User", "message": "Thanks!"}'}</Code>, and run it again. You
        should get a fourth line without changing the loop.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: the list is all the model knows</Heading>
      <Text>
        A model has no memory between calls. Each time you call it, it reads the messages list you
        send, from the top, and nothing else.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          If a fact is in the list, the model can use it. If it is not in the list, the model cannot
          know it.
        </ListItem>
        <ListItem>
          Each dict has a <Code>role</Code>: <Code>"user"</Code> for the person,{" "}
          <Code>"assistant"</Code> for the model's earlier replies. The role tells the model who
          said what.
        </ListItem>
        <ListItem>
          A longer list means more for the model to read, and it uses up more of its window.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. The chat is written by hand, and nothing is sent anywhere. One
        function checks whether a fact appears in any message. A loop tries it on the full list and
        on only the last turn.
      </Text>
      <RunnableExample labId={12} code={`def model_can_see(messages, fact):
    for message in messages:
        if fact in message["content"]:
            return True
    return False


history = [
    {"role": "user", "content": "My name is Ama."},
    {"role": "assistant", "content": "Nice to meet you, Ama!"},
    {"role": "user", "content": "What is my name?"},
]
for name, messages in [("full list", history), ("last turn only", history[-1:])]:
    print(name, "->", len(messages), "messages, can see the name:", model_can_see(messages, "Ama"))`} hints={[
        {
          code: "def model_can_see(messages, fact):",
          block: "function",
          text:
            "Checks every message in the list. Gives back `True` as soon as one message contains `fact`, or `False` if none of them does.",
        },
        {
          code: "for message in messages:",
          block: "for loop",
          text: "Looks at the dicts one at a time. `message` is the current dict.",
        },
        {
          code: "for name, messages in [(\"full list\"",
          block: "for loop",
          text:
            "Runs twice: once with the full list, once with only the last message. Each pass prints a label, the number of messages, and whether the name can be seen.",
        },
        {
          code: "if fact in message[\"content\"]:",
          text:
            "`in` checks if one piece of text appears inside another. `\"Ama\" in \"My name is Ama.\"` is `True`. `message[\"content\"]` is the words of the current message.",
        },
        {
          code: "return True",
          text: "Stops the function right away and gives back `True`. The rest of the loop is skipped.",
        },
        {
          code: "return False",
          text: "Only reached when the loop finishes without a match. The fact is in none of the messages.",
        },
        {
          code: "for name, messages in",
          text:
            "Each item is a pair, like `(\"full list\", history)`. Python splits it in two: `name` gets the label and `messages` gets the list.",
        },
        {
          code: "history[-1:]",
          text:
            "A **slice**: a piece of a list. `-1` means the last item and `:` means \"up to the end\". So this is a new list holding only the last dict.",
        },
        {
          code: "len(messages)",
          text: "`len` counts the items in a list: 3 for the full list, 1 for the last turn only.",
        },
        {
          code: "model_can_see(messages, \"Ama\")",
          text: "Calls the function and prints its answer: `True` for the full list, `False` for the last turn only.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>model_can_see</Code> loops over the dicts and looks for the fact inside each{" "}
          <Code>content</Code>. It gives back <Code>True</Code> as soon as it finds one.
        </ListItem>
        <ListItem>
          <Code>history[-1:]</Code> is a slice with only the last dict. With the full list of 3
          messages the name <Code>Ama</Code> is visible. With only the last turn it is not, so the
          model could not answer "What is my name?".
        </ListItem>
        <ListItem>
          Pattern: what you put in the list is what the model knows.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>model_can_see</Code> from the worked example above, exactly as it is.
        </ListItem>
        <ListItem>
          Make a list called <Code>history</Code> with three messages: a <Code>user</Code> message{" "}
          <Code>I live in Tamale.</Code>, then an <Code>assistant</Code> message{" "}
          <Code>Tamale is a lovely city!</Code>, then a <Code>user</Code> message{" "}
          <Code>Which city do I live in?</Code>.
        </ListItem>
        <ListItem>
          Loop over <Code>{`[("full list", history), ("last turn only", history[-1:])]`}</Code> with{" "}
          <Code>for name, messages in</Code>.
        </ListItem>
        <ListItem>
          Inside the loop, print <Code>name</Code>, then <Code>"-&gt;"</Code>, then{" "}
          <Code>len(messages)</Code>, then <Code>"messages, can see the city:"</Code>, then{" "}
          <Code>model_can_see(messages, "Tamale")</Code>, in one <Code>print(...)</Code>.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={12} cellId="topic-1" withHint code={`def model_can_see(messages, fact):
    for message in messages:
        if fact in message["content"]:
            return True
    return False


history = [
    {"role": "user", "content": "I live in Tamale."},
    {"role": "assistant", "content": "Tamale is a lovely city!"},
    {"role": "user", "content": "Which city do I live in?"},
]
for name, messages in [("full list", history), ("last turn only", history[-1:])]:
    print(name, "->", len(messages), "messages, can see the city:", model_can_see(messages, "Tamale"))`} expectedOutput={`full list -> 3 messages, can see the city: True
last turn only -> 1 messages, can see the city: False`} />
      <Text>
        <b>What you should see:</b> exactly these two lines. If yours differ, check the three
        message texts, the fact you search for and the print layout.
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
        {`full list -> 3 messages, can see the city: True
last turn only -> 1 messages, can see the city: False`}
      </Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The word <Code>Tamale</Code> is in the first two messages, but not in the last one.
        </ListItem>
        <ListItem>
          On the full list (3 messages), the loop finds it in the first message and returns{" "}
          <Code>True</Code>.
        </ListItem>
        <ListItem>
          <Code>history[-1:]</Code> keeps only the last message. It has no <Code>Tamale</Code>, so
          the loop ends and returns <Code>False</Code>. The model could not answer "Which city do I
          live in?".
        </ListItem>
        <ListItem>
          The text says "1 messages" because the print uses the fixed word <Code>messages</Code>,
          even for one.
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The API's <Code>messages</Code> list works exactly the same way, except each dict has a{" "}
        <Code>"role"</Code> key (instead of <Code>"speaker"</Code>) and a <Code>"content"</Code>{" "}
        key (instead of <Code>"text"</Code>): <Code>{'{"role": "user", "content": "..."}'}</Code>,{" "}
        <Code>{'{"role": "assistant", "content": "..."}'}</Code>, and so on. Every lab in this
        course that talks to Groq builds one of these lists.
      </Text>
      <Text>
        In the project, every call gets a fresh list of exactly 2 dicts: a{" "}
        <Code>system</Code> dict, then a <Code>user</Code> dict. That is why{" "}
        <Code>len(messages) == 2</Code> on every pass.
      </Text>
      <Text>A tiny messages list, with two turns, looks like this:</Text>
      <CodeBlock code={`messages = [
    {"role": "user", "content": "Hi"},
    {"role": "assistant", "content": "Hello!"},
]
print(messages[1]["content"])  # Hello!`} hints={[
        {
          code: "messages = [",
          text:
            "A list of 2 dicts, one per turn. `\"role\"` says who is talking. `\"content\"` holds the words.",
        },
        {
          code: "messages[1][\"content\"]",
          text:
            "`messages[1]` is the second dict, because counting starts at 0. `[\"content\"]` then reads its words, `\"Hello!\"`.",
        },
        {
          code: "# Hello!",
          text: "A **comment**: Python skips everything after `#`. It shows what the line prints.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>messages[0]</Code> is the first dict. Counting starts at 0, so{" "}
          <Code>messages[1]</Code> is the second dict.
        </ListItem>
        <ListItem>
          <Code>["content"]</Code> then reads the text of that turn. Here it is{" "}
          <Code>"Hello!"</Code>.
        </ListItem>
        <ListItem>
          The only change from the chat log is the key names: <Code>"role"</Code> says who is
          talking and <Code>"content"</Code> holds the words.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Concept: the "system" role vs. "user"/"assistant"</Heading>
      <Text>
        Not every entry in that list is a "turn" someone took - one role is different from the
        rest.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        In the chat log above, both speakers are peers - there's no third party setting ground
        rules. Now imagine a group chat with a bot moderator whose message is pinned at the top and
        applies to the whole thread, distinct from either person's turns:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <b>system</b> - not really a "turn" at all; it's standing context that applies to
          everything that follows (here: "Sam and Robin, keep it under 10 messages")
        </ListItem>
        <ListItem>
          <b>user</b> - what the human sends
        </ListItem>
        <ListItem>
          <b>assistant</b> - what the model replied last time (used to show it prior turns, as in
          lab 10's few-shot examples)
        </ListItem>
      </UnorderedList>
      <Text>
        Put them in order and a real list looks like this: first one <b>system</b> dict, then a{" "}
        <b>user</b> dict, then (on later turns) an <b>assistant</b> dict, then another user dict,
        and so on. The system dict stays at position 0 for the whole chat. That position is why it
        works as a rule for everything that follows. Position 0 is also the first place the model
        looks.
      </Text>

      <CodeBlock code={`classroom_log = [
    {"role": "teacher_note", "text": "Keep answers under two sentences."},
    {"role": "student", "text": "What's the capital of France?"},
    {"role": "helper", "text": "Paris."},
]

standing_rule = classroom_log[0]["text"]
print(standing_rule)  # expected output: Keep answers under two sentences.`} hints={[
        {
          code: "classroom_log = [",
          text: "A list of 3 dicts. Each dict has a `\"role\"` (who wrote it) and a `\"text\"` (the words).",
        },
        {
          code: "\"teacher_note\"",
          text:
            "The role of the first dict. It is a standing rule for the whole chat, just like a **system** message.",
        },
        {
          code: "classroom_log[0][\"text\"]",
          text:
            "`[0]` picks the first dict, because counting starts at 0. `[\"text\"]` then reads its words: `\"Keep answers under two sentences.\"`.",
        },
        {
          code: "# expected output:",
          text: "A **comment**: Python skips everything after `#`. It shows what the line prints.",
        },
      ]} />
      <PracticeCell labId={12} cellId="concept-2" code={`classroom_log = [
    {"role": "teacher_note", "text": "Keep answers under two sentences."},
    {"role": "student", "text": "What's the capital of France?"},
    {"role": "helper", "text": "Paris."},
]

standing_rule = classroom_log[0]["text"]
print(standing_rule)  # expected output: Keep answers under two sentences.`} expectedOutput={`Keep answers under two sentences.`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>classroom_log</Code> is a list of 3 dicts. The first one has the role{" "}
          <Code>"teacher_note"</Code>. It is the standing rule, like the system message.
        </ListItem>
        <ListItem>
          <Code>classroom_log[0]</Code> picks the first dict. Counting starts at 0, so 0 means
          first.
        </ListItem>
        <ListItem>
          <Code>["text"]</Code> reads the value for the key <Code>"text"</Code>:{" "}
          <Code>"Keep answers under two sentences."</Code>. That string goes into{" "}
          <Code>standing_rule</Code> and is printed.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> one line, <Code>Keep answers under two sentences.</Code>. Try
        changing <Code>[0]</Code> to <Code>[2]</Code>. You should now see <Code>Paris.</Code>,
        because the third dict holds the helper's answer.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: what a system message is for</Heading>
      <Text>
        A system message is where you, the builder, speak to the model. It is not part of the
        chat. It is the standing brief for the whole chat.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          It states who the assistant is (its <b>persona</b>: a name, a role and a tone) and the
          rules it must follow.
        </ListItem>
        <ListItem>
          It goes first, at position 0, so it frames everything that follows. There should be one
          of them.
        </ListItem>
        <ListItem>
          It guides the model, but it does not force it. A user can still tempt the model to break a
          rule, so you check the replies.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. A small function audits a messages list: is the system message
        first, and is there only one? Two lists are written by hand, one tidy and one not.
      </Text>
      <RunnableExample labId={12} code={`def audit(messages):
    problems = []
    if messages[0]["role"] != "system":
        problems.append("system message is not first")
    for i in range(1, len(messages)):
        if messages[i]["role"] == "system":
            problems.append("extra system message at position " + str(i))
    return problems


good = [
    {"role": "system", "content": "You are Rae."},
    {"role": "user", "content": "Hi"},
]
late = [
    {"role": "user", "content": "Hi"},
    {"role": "system", "content": "You are Rae."},
]
for name, messages in [("good", good), ("late", late)]:
    print(name, "->", audit(messages))`} hints={[
        {
          code: "def audit(messages):",
          block: "function",
          text:
            "Checks a messages list for two mistakes: a system message that is not first, and extra system messages later on. Gives back a list of problems. An empty list, `[]`, means all is fine.",
        },
        {
          code: "if messages[0][\"role\"] != \"system\":",
          block: "if block",
          text: "Runs only when the first message is not a system message. Then it notes that problem.",
        },
        {
          code: "for i in range(1, len(messages)):",
          block: "for loop",
          text:
            "Visits every position after the first one. If it finds another system message there, it notes that position.",
        },
        {
          code: "for name, messages in [(\"good\"",
          block: "for loop",
          text:
            "Runs `audit` on both lists and prints the result. `good` gives `[]`. `late` gives 2 problems.",
        },
        {
          code: "problems = []",
          text: "Starts an empty list. Each problem the function finds is added to it.",
        },
        {
          code: "!= \"system\"",
          text: "`!=` means \"is not equal to\". So this is `True` when the role is anything other than `\"system\"`.",
        },
        {
          code: "range(1, len(messages))",
          text:
            "Gives the numbers from 1 up to, but not including, the number of messages. For 2 messages that is just `1`. Starting at 1 skips position 0, which was already checked.",
        },
        {
          code: "problems.append(",
          text: "`.append` adds one item to the end of a list.",
        },
        {
          code: "str(i)",
          text:
            "Turns the number `i` into text, so it can be joined to other text with `+`. `str(1)` is `\"1\"`.",
        },
        {
          code: "return problems",
          text: "Gives the finished list of problems back to whoever called `audit`.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>audit</Code> keeps a list of <Code>problems</Code>. It first checks position 0, then
          loops over the other positions with <Code>range(1, len(messages))</Code>.
        </ListItem>
        <ListItem>
          <Code>good</Code> has the system dict first and no other, so the answer is an empty list,{" "}
          <Code>[]</Code>.
        </ListItem>
        <ListItem>
          <Code>late</Code> starts with the user, so it has 2 problems: the system message is not
          first, and there is a system message at position 1.
        </ListItem>
        <ListItem>
          Pattern: the system message is first and only one, and a check can prove it.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>audit</Code> from the worked example above, exactly as it is.
        </ListItem>
        <ListItem>
          Make a list called <Code>tidy</Code> with three messages: a <Code>system</Code> message{" "}
          <Code>You are Kofi.</Code>, a <Code>user</Code> message <Code>Hello</Code> and an{" "}
          <Code>assistant</Code> message <Code>Hi there!</Code>.
        </ListItem>
        <ListItem>
          Make a list called <Code>doubled</Code> with three messages: a <Code>system</Code> message{" "}
          <Code>You are Kofi.</Code>, a <Code>user</Code> message <Code>Hello</Code> and a second{" "}
          <Code>system</Code> message <Code>Be funny.</Code>.
        </ListItem>
        <ListItem>
          Loop over <Code>{`[("tidy", tidy), ("doubled", doubled)]`}</Code> with{" "}
          <Code>for name, messages in</Code> and print <Code>name</Code>, then <Code>"-&gt;"</Code>,
          then <Code>audit(messages)</Code>, in one <Code>print(...)</Code>.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={12} cellId="topic-2" withHint code={`def audit(messages):
    problems = []
    if messages[0]["role"] != "system":
        problems.append("system message is not first")
    for i in range(1, len(messages)):
        if messages[i]["role"] == "system":
            problems.append("extra system message at position " + str(i))
    return problems


tidy = [
    {"role": "system", "content": "You are Kofi."},
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi there!"},
]
doubled = [
    {"role": "system", "content": "You are Kofi."},
    {"role": "user", "content": "Hello"},
    {"role": "system", "content": "Be funny."},
]
for name, messages in [("tidy", tidy), ("doubled", doubled)]:
    print(name, "->", audit(messages))`} expectedOutput={`tidy -> []
doubled -> ['extra system message at position 2']`} />
      <Text>
        <b>What you should see:</b> exactly these two lines. If yours differ, check the roles and
        the order of the messages in each list.
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
        {`tidy -> []
doubled -> ['extra system message at position 2']`}
      </Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>tidy</Code> has the system dict first, then a user and an assistant. No problems, so
          the answer is an empty list.
        </ListItem>
        <ListItem>
          <Code>doubled</Code> has the system dict first, so the first check passes. But it has a
          second system dict at position 2 (counting from 0).
        </ListItem>
        <ListItem>
          The loop starts at position 1, so it skips the first dict, passes the user dict, and finds
          the extra system dict at 2. It adds a note with the position number.{" "}
          <Code>str(i)</Code> turns the number 2 into the text <Code>"2"</Code>.
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This lab's <Code>build_system_message(persona)</Code> builds exactly that pinned,
        standing message. The project's <Code>persona</Code> is Rae, a friendly customer support
        agent for a coffee subscription service, with a warm and concise tone and 2 constraints:
        never mention competitors, and always ask if there is anything else before ending. Given a
        dict like{" "}
        <Code>{'{"name": "Rae", "role": "...", "tone": "...", "constraints": [...]}'}</Code>, it
        returns one string stating the assistant's name, role, and tone, plus each constraint as
        its own bullet line - a single block of text meant to sit at{" "}
        <Code>messages[0]</Code> with <Code>"role": "system"</Code>, ahead of anything the user
        says.
      </Text>
      <Text>
        Here is the lab's real code, run on a tiny persona. The persona is{" "}
        <Code>{'{"name": "Rae", "role": "a coffee helper", "tone": "warm", "constraints": ["be brief", "no jokes"]}'}</Code>:
      </Text>
      <CodeBlock code={`lines = [
    f"You are {persona['name']}, {persona['role']}.",
    f"Your tone is {persona['tone']}.",
    "Rules you must always follow:",
]
lines += [f"- {c}" for c in persona["constraints"]]
return "\\n".join(lines)`} hints={[
        {
          code: "lines = [",
          text: "A list of 3 strings. Each one will become one line of the system message.",
        },
        {
          code: "f\"You are {",
          text:
            "An **f-string**: each `{...}` is filled in with its value. With the tiny persona, this line becomes `You are Rae, a coffee helper.`",
        },
        {
          code: "persona['name']",
          text: "Reads the value under the key `\"name\"` in the `persona` dict. Here that is `\"Rae\"`.",
        },
        {
          code: "lines +=",
          text: "`+=` adds the new lines to the end of `lines`. With 2 rules, `lines` now holds 5 lines.",
        },
        {
          code: "[f\"- {c}\" for c in persona[\"constraints\"]]",
          text:
            "A **list comprehension**: a short way to build a list in one line. For each rule `c`, it makes a line that starts with `- `. Here that gives `- be brief` and `- no jokes`.",
        },
        {
          code: "\"\\n\".join(lines)",
          text:
            "`\\n` means \"start a new line\". `.join` glues the lines into one string, with a new line between each pair.",
        },
        {
          code: "return",
          text:
            "Gives the finished string back. This is the end of the lab's `build_system_message` function. Its `def` line is not shown here.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The first list has 3 lines: <Code>You are Rae, a coffee helper.</Code>, then{" "}
          <Code>Your tone is warm.</Code>, then <Code>Rules you must always follow:</Code>.
        </ListItem>
        <ListItem>
          The next line is a <b>list comprehension</b>. It is a short way to build a new list. It
          makes one line per constraint: <Code>- be brief</Code> and <Code>- no jokes</Code>.{" "}
          <Code>+=</Code> adds those 2 lines to the end of <Code>lines</Code>. Now there are 5
          lines.
        </ListItem>
        <ListItem>
          <Code>"\n"</Code> means "start a new line". <Code>"\n".join(lines)</Code> glues the 5
          lines into one string with a new line between each pair. That one string is the system
          message.
        </ListItem>
        <ListItem>
          If <Code>constraints</Code> were an empty list, the comprehension would make no lines and
          the prompt would just end after the "Rules" heading.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Concept: state that stays fixed while the conversation varies</Heading>
      <Text>
        Once you have a system message, the interesting part is what happens when you reuse it
        across many different requests.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        This is the same shape as a loop where one variable is built once outside the loop and
        stays fixed, while another variable is fresh on every iteration:
      </Text>
      <RunnableExample labId={12} code={`greeting = "Welcome, please have a seat."   # built once
for visitor in ["Sam", "Robin", "Priya"]:    # varies every iteration
    print(f"{greeting} ({visitor})")`} hints={[
        {
          code: "for visitor in [\"Sam\", \"Robin\", \"Priya\"]:",
          block: "for loop",
          text:
            "Runs the print 3 times, with `visitor` set to `\"Sam\"`, then `\"Robin\"`, then `\"Priya\"`. `greeting` stays the same each time.",
        },
        {
          code: "greeting = \"Welcome, please have a seat.\"",
          text: "Set **once**, before the loop. Nothing inside the loop changes it.",
        },
        {
          code: "# varies every iteration",
          text:
            "A **comment**: Python skips everything after `#`. An **iteration** is one pass through the loop.",
        },
        {
          code: "print(f\"{greeting} ({visitor})\")",
          text:
            "An **f-string** fills in both values. The first line printed is `Welcome, please have a seat. (Sam)`. The round brackets are plain text.",
        },
      ]} />
      <Text>
        <Code>greeting</Code> is identical on every pass through the loop; only{" "}
        <Code>visitor</Code> changes. Whatever stays fixed shapes every output the same way, no
        matter what varies alongside it.
      </Text>
      <Text>Here is the loop, one pass at a time:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Before the loop, <Code>greeting</Code> is set once to{" "}
          <Code>"Welcome, please have a seat."</Code>. Nothing inside the loop changes it.
        </ListItem>
        <ListItem>
          Pass 1: <Code>visitor</Code> is <Code>"Sam"</Code>. The f-string puts both pieces
          together and prints <Code>Welcome, please have a seat. (Sam)</Code>.
        </ListItem>
        <ListItem>
          Pass 2 prints <Code>Welcome, please have a seat. (Robin)</Code>. Pass 3 prints{" "}
          <Code>Welcome, please have a seat. (Priya)</Code>. The greeting is the same each time.
          Only the name in brackets changes.
        </ListItem>
      </UnorderedList>

      <CodeBlock code={`discount = "SAVE10"                      # built once
for cart_total in [25, 40, 100]:          # varies every iteration
    print(f"Applying {discount} to \${cart_total}")
# expected output:
# Applying SAVE10 to $25
# Applying SAVE10 to $40
# Applying SAVE10 to $100`} hints={[
        {
          code: "for cart_total in [25, 40, 100]:",
          block: "for loop",
          text: "Runs the print 3 times, with `cart_total` set to 25, then 40, then 100.",
        },
        {
          code: "discount = \"SAVE10\"",
          text: "The fixed part. It is set **once**, before the loop, and stays the same on every pass.",
        },
        {
          code: "# built once",
          text: "A **comment**: Python skips everything after `#`. It is a note for the reader.",
        },
        {
          code: "{discount}",
          text: "Filled in with `SAVE10` on every pass.",
        },
        {
          code: "${cart_total}",
          text:
            "The `$` is just a plain dollar sign. Only `{cart_total}` is filled in, so the first pass shows `$25`.",
        },
      ]} />
      <PracticeCell labId={12} cellId="concept-3" code={`discount = "SAVE10"                      # built once
for cart_total in [25, 40, 100]:          # varies every iteration
    print(f"Applying {discount} to \${cart_total}")
# expected output:
# Applying SAVE10 to $25
# Applying SAVE10 to $40
# Applying SAVE10 to $100`} expectedOutput={`Applying SAVE10 to $25
Applying SAVE10 to $40
Applying SAVE10 to $100`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>discount</Code> is set once to <Code>"SAVE10"</Code>. It is the fixed part.
        </ListItem>
        <ListItem>
          The loop runs 3 times, with <Code>cart_total</Code> equal to 25, then 40, then 100. That
          is the part that varies.
        </ListItem>
        <ListItem>
          In the f-string, <Code>{"{discount}"}</Code> and <Code>{"{cart_total}"}</Code> are
          replaced by their values. The <Code>$</Code> in front is just a plain dollar sign. So
          pass 1 prints <Code>Applying SAVE10 to $25</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> three lines. The code SAVE10 is the same on all of them, and
        the amount changes: $25, $40, $100. Try changing <Code>discount</Code> to{" "}
        <Code>"SAVE20"</Code>. All three lines change together, because they share the one fixed
        variable.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: keep the rules fixed, then spot-check</Heading>
      <Text>
        A persona only works if the model sees it on every call. Since the model keeps no memory,
        the same system message is sent again each time, unchanged. The persona is not remembered.
        It is resent.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Build the system message once, then reuse it. That way every call gets exactly the same
          rules.
        </ListItem>
        <ListItem>
          Rules can still slip, most of all when the question tempts the model. So test with
          different questions, including a trap question.
        </ListItem>
        <ListItem>
          A rule that is easy to state, like "never mention a name", can also be checked by code.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. The two replies are pretend replies, written by hand. One
        function checks a reply against two rules: a banned word, and a closing question. A loop
        runs it on each question and reply.
      </Text>
      <RunnableExample labId={12} code={`def check_rules(reply, banned, closing):
    broken = []
    for word in banned:
        if word in reply.lower():
            broken.append("mentions " + word)
    if not reply.strip().lower().endswith(closing):
        broken.append("no closing question")
    return broken


closing = "anything else?"
replies = [
    ("Do you sell dark roast?", "Yes, we do. Is there anything else?"),
    ("What about Acme Coffee?", "Acme Coffee is great, but we are better. Thanks!"),
]
for question, reply in replies:
    print(question, "->", check_rules(reply, ["acme"], closing))`} hints={[
        {
          code: "def check_rules(reply, banned, closing):",
          block: "function",
          text:
            "Checks one reply against two rules: no banned words, and it must end with the closing question. Gives back a list of broken rules. `[]` means none were broken.",
        },
        {
          code: "for word in banned:",
          block: "for loop",
          text: "Tries each banned word in turn. If the reply contains it, it notes `mentions` plus that word.",
        },
        {
          code: "for question, reply in replies:",
          block: "for loop",
          text:
            "Runs `check_rules` on each pair. The first prints `[]`. The second prints `['mentions acme', 'no closing question']`.",
        },
        {
          code: "broken = []",
          text: "Starts an empty list. Each broken rule is added to it.",
        },
        {
          code: "reply.lower()",
          text: "Makes a copy of the reply in small letters, so `Acme` still matches the banned word `acme`.",
        },
        {
          code: "if not reply",
          text: "`not` flips `True` to `False` and back. So this line runs when the reply does **not** end with the closing question.",
        },
        {
          code: ".strip().lower().endswith(closing)",
          text:
            "`.strip()` cuts spaces off both ends. `.lower()` makes all letters small. `.endswith(closing)` is `True` if the text ends with `closing`.",
        },
        {
          code: "replies = [",
          text:
            "A list of **tuples**. A tuple is a fixed group of values in round brackets. Each one here is a pair: `(question, reply)`.",
        },
        {
          code: "[\"acme\"]",
          text: "The list of banned words. It is in small letters because the check lowers the reply first.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>check_rules</Code> loops over the banned words and notes each one it finds. Then it
          checks that the reply ends with the closing question. <Code>.lower()</Code> makes the
          check ignore capital letters.
        </ListItem>
        <ListItem>
          The first reply keeps both rules, so the answer is <Code>[]</Code>.
        </ListItem>
        <ListItem>
          The second reply, to the trap question, names the competitor and forgets the closing
          question. It breaks 2 rules.
        </ListItem>
        <ListItem>
          Pattern: one fixed set of rules, many different questions, and a check on each reply.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>check_rules</Code> from the worked example above, exactly as it is.
        </ListItem>
        <ListItem>
          Set <Code>closing = "anything else?"</Code>.
        </ListItem>
        <ListItem>
          Make a list called <Code>replies</Code> with three (question, reply) pairs, in this order:{" "}
          <Code>{`("How do I clean my grinder?", "Brush it weekly. Is there anything else?")`}</Code>,{" "}
          <Code>{`("Is BrewCo cheaper?", "BrewCo has lower prices, I hear.")`}</Code> and{" "}
          <Code>{`("Can I pause my plan?", "Yes, from your account page. Is there anything else?")`}</Code>.
        </ListItem>
        <ListItem>
          Loop with <Code>for question, reply in replies</Code> and print <Code>question</Code>,
          then <Code>"-&gt;"</Code>, then <Code>{`check_rules(reply, ["brewco"], closing)`}</Code>, in one{" "}
          <Code>print(...)</Code>.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={12} cellId="topic-3" withHint code={`def check_rules(reply, banned, closing):
    broken = []
    for word in banned:
        if word in reply.lower():
            broken.append("mentions " + word)
    if not reply.strip().lower().endswith(closing):
        broken.append("no closing question")
    return broken


closing = "anything else?"
replies = [
    ("How do I clean my grinder?", "Brush it weekly. Is there anything else?"),
    ("Is BrewCo cheaper?", "BrewCo has lower prices, I hear."),
    ("Can I pause my plan?", "Yes, from your account page. Is there anything else?"),
]
for question, reply in replies:
    print(question, "->", check_rules(reply, ["brewco"], closing))`} expectedOutput={`How do I clean my grinder? -> []
Is BrewCo cheaper? -> ['mentions brewco', 'no closing question']
Can I pause my plan? -> []`} />
      <Text>
        <b>What you should see:</b> exactly these three lines. If yours differ, check the three
        pairs, the banned word (in small letters) and the closing text.
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
        {`How do I clean my grinder? -> []
Is BrewCo cheaper? -> ['mentions brewco', 'no closing question']
Can I pause my plan? -> []`}
      </Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The banned word is <Code>brewco</Code> in small letters. The check lowers the reply first,
          so <Code>BrewCo</Code> still matches.
        </ListItem>
        <ListItem>
          Replies 1 and 3 do not name the brand and end with <Code>anything else?</Code>, so both
          give an empty list, <Code>[]</Code>.
        </ListItem>
        <ListItem>
          Reply 2 names the brand, so <Code>mentions brewco</Code> is added first. It also does not
          end with <Code>anything else?</Code>, so <Code>no closing question</Code> is added second.
          That is 2 broken rules, in the order the function checks them.
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The real-world project cell builds <Code>system_message</Code> from the persona{" "}
        <b>once</b>, then loops over four very different user questions - a brewing tip, a stock
        question, a complaint, and a question about a competitor - sending a fresh two-message list
        each time:
      </Text>
      <CodeBlock code={`system_message = build_system_message(persona)   # built once
for question in QUESTIONS:                       # varies every iteration
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": question},
    ]
    reply = call_groq(messages)`} hints={[
        {
          code: "for question in QUESTIONS:",
          block: "for loop",
          text:
            "Runs once per question, 4 times in the project. Each pass builds a fresh 2-message list and sends it to Groq.",
        },
        {
          code: "build_system_message(persona)",
          text:
            "The lab's function from above. It turns the persona dict into the system message text. It runs **once**, before the loop.",
        },
        {
          code: "QUESTIONS",
          text:
            "The project's list of 4 user questions. Names in capital letters are a habit for values that never change.",
        },
        {
          code: "{\"role\": \"system\", \"content\": system_message}",
          text: "The same system message on every pass. It sits first, at position 0.",
        },
        {
          code: "{\"role\": \"user\", \"content\": question}",
          text: "The part that changes: the current question.",
        },
        {
          code: "call_groq(messages)",
          text:
            "Sends the list to Groq and gives back the model's reply as text. You need a Groq API key for this.",
        },
      ]} />
      <Text>
        <Code>system_message</Code> never changes across the loop, while <Code>question</Code>{" "}
        changes every time - that's why the model keeps calling itself "Rae," keeps a warm and
        concise tone, and never mentions a competitor, no matter which of the four unrelated
        questions it's answering. The fourth question is the trap, because it tempts the model to
        talk about a competitor. The loop makes 4 calls, one per question.
      </Text>
      <Text>
        Walk through the loop with just 2 questions, <Code>"Do you sell dark roast?"</Code> and{" "}
        <Code>"What do you think of [a competing coffee brand]?"</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>build_system_message(persona)</Code> runs once, before the loop. It gives the
          multi-line string from the walkthrough above.
        </ListItem>
        <ListItem>
          Pass 1: <Code>messages</Code> is a brand-new list with 2 dicts. The first has the role{" "}
          <Code>"system"</Code> and the persona text. The second has the role <Code>"user"</Code>{" "}
          and the dark roast question. <Code>call_groq(messages)</Code> sends that list to Groq
          and returns the reply text. <Code>print</Code> shows the question and the answer.
        </ListItem>
        <ListItem>
          Pass 2: <Code>messages</Code> is replaced by another new 2-dict list. The system dict is
          the same. The user dict now holds the competitor question. Because the system message
          says "never mention competitors", the reply should politely avoid naming one.
        </ListItem>
        <ListItem>
          Each pass starts a fresh list, so the model does not remember the earlier question. Only
          the system message is shared. Lab 13 is where the list starts to grow.
        </ListItem>
      </UnorderedList>
      <Text>
        You need a Groq API key to run this part. The replies are written by the model, so they
        will not be exactly the same each time. Check the tone and the rules, not the exact words.
        For each reply, ask the same two things <Code>check_rules</Code> asks: did it keep the
        persona's rules, and did it end by asking if there is anything else?
      </Text>

      <Heading as="h3" size="sm">Further reading</Heading>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Link href="https://www.ibm.com/think/topics/prompt-engineering-techniques" isExternal>
            IBM Think - Prompt engineering techniques
          </Link>
        </ListItem>
      </UnorderedList>
    </VStack>
  );
}
