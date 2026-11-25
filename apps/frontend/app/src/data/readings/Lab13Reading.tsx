import { Heading, Link, OrderedList, UnorderedList } from "@chakra-ui/react";
import { FlatReadingPager } from "../../components/readingLayout";
import { Code, ListItem, RunSubmitKeys, Text } from "../../components/prose";

import { CodeBlock } from "../../components/CodeBlock";
import { PracticeCell } from "../../components/PracticeCell";
import { CodeHint } from "../../components/codeHints";
import { RunnableExample } from "../../components/RunnableExample";

const SHOPPING_HINTS: CodeHint[] = [
  {
    code: "shopping_list = []",
    text:
      "Makes an empty **list**. A list is an ordered row of things in square brackets. This one has nothing in it yet.",
  },
  {
    code: ".append(\"milk\")",
    text:
      "Adds one item to the end. The list is now `[\"milk\"]`.",
  },
  {
    code: ".append(\"eggs\")",
    text:
      "Adds to the end again. The list is now `[\"milk\", \"eggs\"]`. The old item is still there. Nothing was erased.",
  },
  {
    code: "print(shopping_list)",
    text:
      "Shows both items, in the order they were added.",
  },
];

const LETTER_HINTS: CodeHint[] = [
  {
    code: "name = \"Priya\"",
    text:
      "`name` holds the text `\"Priya\"`. A piece of text in quote marks is called a **string**.",
  },
  {
    code: "city = \"Austin\"",
    text:
      "`city` holds the text `\"Austin\"`.",
  },
  {
    code: "f\"Dear",
    text:
      "The `f` in front of the quote marks turns on the blanks. Each `{name}` is a blank that Python fills with the value of that variable.",
  },
  {
    code: "letter",
    text:
      "So `letter` becomes `\"Dear Priya, welcome to Austin!\"`. Change `name` to `\"Sam\"` and the letter says \"Dear Sam\" with no other edit.",
  },
];

export function Lab13Reading() {
  return (
    <FlatReadingPager>
      <Heading as="h2" size="md">The digital twin: three Python ideas behind a chat that remembers</Heading>
      <Text>
        This lab combines everything from 8-12 into one real thing: a persistent, persona-driven
        chatbot built from your own bio - a "digital twin". Three ordinary Python ideas do all the
        work: a list that keeps growing, a loop that alternates between two actions, and a string
        built up from a dict. None of them are LLM-specific - the LLM part is just what you plug
        into them.
      </Text>

      <Heading as="h3" size="sm">Idea 1: state is just a list that keeps growing</Heading>
      <Text>
        "State" sounds abstract until you notice you already use it every day.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Imagine a shopping list on your phone. You never erase it between items - you just keep
        appending:
      </Text>
      <RunnableExample labId={13} code={`shopping_list = []
shopping_list.append("milk")
shopping_list.append("eggs")
print(shopping_list)  # ["milk", "eggs"]`} hints={SHOPPING_HINTS} />
      <Text>
        By the time you're at the register, the list holds every item you added, in order - that's
        the entire idea of "state": a value that persists and accumulates across separate actions,
        instead of being thrown away after each one.
      </Text>

      <CodeBlock code={`readings = []
readings.append(68)
readings.append(71)
print(readings)  # expected output: [68, 71]`} hints={[
        {
          code: "readings = []",
          text: "Makes an empty **list**: square brackets with nothing inside yet.",
        },
        {
          code: ".append(68)",
          text: "`.append` adds one item to the end of the list. The list is now `[68]`.",
        },
        {
          code: ".append(71)",
          text: "Adds 71 after it. The list is now `[68, 71]`. The 68 is still there.",
        },
        {
          code: "# expected output:",
          text: "A **comment**: Python skips everything after `#`. It shows what the line prints.",
        },
      ]} />
      <PracticeCell labId={13} cellId="concept-1" code={`readings = []
readings.append(68)
readings.append(71)
print(readings)  # expected output: [68, 71]`} expectedOutput={`[68, 71]`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>readings = []</Code> starts with an empty list. Think of it as an empty notebook
          page for temperature readings.
        </ListItem>
        <ListItem>
          <Code>readings.append(68)</Code> writes 68 on the page. The list is{" "}
          <Code>[68]</Code>.
        </ListItem>
        <ListItem>
          <Code>readings.append(71)</Code> adds 71 after it. The list is <Code>[68, 71]</Code>. The
          68 is still there, and that is the "state" part.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>[68, 71]</Code>. Try adding a third line,{" "}
        <Code>readings.append(75)</Code>, before the print. You should see{" "}
        <Code>[68, 71, 75]</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: why a chat model has no memory</Heading>
      <Text>
        A chat model is <b>stateless</b>. That means each call starts from zero. The model does not
        keep your earlier calls anywhere.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The "memory" you feel in a chat is a list of messages that your own code keeps.
        </ListItem>
        <ListItem>
          On every call your code sends that whole list again. The model reads it from the top.
        </ListItem>
        <ListItem>
          So the model can only use what is in the list right now. If something is not in the
          list, then for the model it never happened.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. No real model is used. <Code>fake_model</Code> is a pretend one
        that can only answer from the list it is given. <Code>ask</Code> adds the question, calls
        the model, then adds the reply, like a real chat loop. We run the same two questions twice:
        once with one list that we keep, and once with a fresh empty list each time.
      </Text>
      <RunnableExample labId={13} code={`PREFIX = "My name is "


def fake_model(messages):
    name = None
    for message in messages:
        if message["content"].startswith(PREFIX):
            name = message["content"][len(PREFIX):]
    if messages[-1]["content"] == "What is my name?":
        if name is None:
            return "I do not know your name."
        return "Your name is " + name + "."
    return "Nice to meet you."


def ask(history, question):
    history.append({"role": "user", "content": question})
    reply = fake_model(history)
    history.append({"role": "assistant", "content": reply})
    return reply


questions = ["My name is Ama", "What is my name?"]
history = []
for question in questions:
    print("kept list  ->", ask(history, question))
for question in questions:
    print("fresh list ->", ask([], question))`} hints={[
        {
          code: "def fake_model(messages):",
          block: "function",
          text:
            "A pretend model. It looks through the list for a message that starts with `My name is `. If the last message asks for the name, it answers from what it found. Otherwise it says `Nice to meet you.`",
        },
        {
          code: "def ask(history, question):",
          block: "function",
          text:
            "One chat turn. It adds the question to `history`, calls the model, adds the reply too, and gives the reply back. So each call makes `history` 2 messages longer.",
        },
        {
          code: "    for message in messages:",
          block: "for loop",
          text: "Checks every message in the list. If one starts with `My name is `, it saves the name that follows.",
        },
        {
          code: "for question in questions:",
          block: "for loop",
          text: "Asks the two questions one at a time and prints each reply.",
        },
        {
          code: "ask(history, question))",
          text:
            "Uses the **same** `history` list for both questions. The name from the first question is still there for the second, so the reply is `Your name is Ama.`",
        },
        {
          code: "PREFIX = \"My name is \"",
          text: "The start of the message we look for. Names in capital letters are a habit for values that never change.",
        },
        {
          code: "name = None",
          text: "`None` is Python's word for \"nothing yet\". It stays `None` if no name is found.",
        },
        {
          code: ".startswith(PREFIX)",
          text: "`True` if the text begins with `PREFIX`. `\"My name is Ama\".startswith(\"My name is \")` is `True`.",
        },
        {
          code: "[len(PREFIX):]",
          text:
            "A **slice**: it keeps the text from position `len(PREFIX)` to the end. `PREFIX` is 11 characters long, so this cuts it off and keeps just the name, `Ama`.",
        },
        {
          code: "messages[-1]",
          text: "`-1` means the last item in the list. Here that is the newest message.",
        },
        {
          code: "if name is None:",
          text: "`True` when no name was found in the list. Then the model has to admit it does not know.",
        },
        {
          code: "history.append(",
          text: "`.append` adds one dict to the end of `history`. The list keeps growing and nothing is erased.",
        },
        {
          code: "ask([], question)",
          text:
            "`[]` is a brand new empty list, so each call starts with no earlier messages. The second question cannot see the name, so the reply is `I do not know your name.`",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>fake_model</Code> loops over the messages it was given and looks for a line that
          starts with <Code>My name is </Code>. It can only find a name if that message is in the
          list.
        </ListItem>
        <ListItem>
          With the kept list, the second call still contains "My name is Ama", so the reply is{" "}
          <Code>Your name is Ama.</Code>
        </ListItem>
        <ListItem>
          With a fresh list each time, the name is gone, so the reply is{" "}
          <Code>I do not know your name.</Code> The model did not forget. It was never told.
        </ListItem>
        <ListItem>
          Pattern: a chat has memory only because you keep the list and send all of it again.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>PREFIX</Code>, <Code>fake_model</Code> and <Code>ask</Code> from the worked
          example above, exactly as they are.
        </ListItem>
        <ListItem>
          Set <Code>questions</Code> to{" "}
          <Code>{`["My name is Kwame", "I like football", "What is my name?"]`}</Code> and{" "}
          <Code>history</Code> to an empty list.
        </ListItem>
        <ListItem>
          Loop over <Code>questions</Code> and print <Code>"kept list  -&gt;"</Code> (two spaces
          after <Code>list</Code>) and <Code>ask(history, question)</Code>, using the same{" "}
          <Code>history</Code> every time.
        </ListItem>
        <ListItem>
          Loop over <Code>questions</Code> again and print <Code>"fresh list -&gt;"</Code> (one space
          after <Code>list</Code>) and <Code>ask([], question)</Code>, so each question gets a brand
          new empty list.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={13} cellId="topic-1" withHint code={`PREFIX = "My name is "


def fake_model(messages):
    name = None
    for message in messages:
        if message["content"].startswith(PREFIX):
            name = message["content"][len(PREFIX):]
    if messages[-1]["content"] == "What is my name?":
        if name is None:
            return "I do not know your name."
        return "Your name is " + name + "."
    return "Nice to meet you."


def ask(history, question):
    history.append({"role": "user", "content": question})
    reply = fake_model(history)
    history.append({"role": "assistant", "content": reply})
    return reply


questions = ["My name is Kwame", "I like football", "What is my name?"]
history = []
for question in questions:
    print("kept list  ->", ask(history, question))
for question in questions:
    print("fresh list ->", ask([], question))`} expectedOutput={`kept list  -> Nice to meet you.
kept list  -> Nice to meet you.
kept list  -> Your name is Kwame.
fresh list -> Nice to meet you.
fresh list -> Nice to meet you.
fresh list -> I do not know your name.`} />
      <Text>
        <b>What you should see:</b> exactly these six lines. If yours differ, check the name, the
        three questions and the two spaces after <Code>kept list</Code>.
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
        {`kept list  -> Nice to meet you.
kept list  -> Nice to meet you.
kept list  -> Your name is Kwame.
fresh list -> Nice to meet you.
fresh list -> Nice to meet you.
fresh list -> I do not know your name.`}
      </Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The first loop uses one <Code>history</Code> list for all three questions. Each call to{" "}
          <Code>ask</Code> adds the question and the reply, so it grows from 0 to 6 messages.
        </ListItem>
        <ListItem>
          The first two questions are not "What is my name?", so they get the plain reply{" "}
          <Code>Nice to meet you.</Code> The name Kwame is still in the list, so the last question
          finds it and says <Code>Your name is Kwame.</Code>
        </ListItem>
        <ListItem>
          The second loop passes <Code>[]</Code> each time, a brand new empty list. The last
          question has no name to find, so it says <Code>I do not know your name.</Code>
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In this lab, <Code>messages</Code> is that kept list. Each turn gets appended as one more
        dict: <Code>{`{"role": "user", "content": "..."}`}</Code> for what the user said, or{" "}
        <Code>{`{"role": "assistant", "content": "..."}`}</Code> for what the model replied.{" "}
        <Code>call_groq(messages)</Code> sends the whole list every time, so the notebook's chat can
        "remember" the first question when it answers the second.
      </Text>
      <Text>Here is the list after the first turn of a chat with a "Hi" and a "Hello!" reply:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Start: <Code>messages = []</Code>. It is empty, like the shopping list.
        </ListItem>
        <ListItem>
          The user says "Hi". <Code>messages.append({"{"}"role": "user", "content": "Hi"{"}"})</Code>{" "}
          makes the list 1 item long.
        </ListItem>
        <ListItem>
          The model replies "Hello!". <Code>messages.append({"{"}"role": "assistant", "content":
          "Hello!"{"}"})</Code> makes the list 2 items long.
        </ListItem>
        <ListItem>
          On the next turn the model gets all of these items again, plus the new user message. That
          is the whole "memory". Each item is a dict. A dict is a small table of keys and values,
          like <Code>"role"</Code> and <Code>"user"</Code>.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Idea 2: a loop that alternates between two actions</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        A simple check-in desk logs each visitor and immediately updates its log before the next
        person walks up:
      </Text>
      <RunnableExample labId={13} code={`log = []
for visitor in ["Alice", "Bob"]:
    log.append(f"{visitor} checked in")
print(log)`} hints={[
        {
          code: "for visitor in [\"Alice\", \"Bob\"]:",
          block: "for loop",
          text:
            "Runs the indented line once for each name. On pass 1 `visitor` is `\"Alice\"`, on pass 2 it is `\"Bob\"`.",
        },
        {
          code: "log = []",
          text: "Starts an empty list. It fills up one entry per visitor.",
        },
        {
          code: "log.append(",
          text: "`.append` adds one item to the end of the list. Earlier entries stay.",
        },
        {
          code: "f\"{visitor} checked in\"",
          text:
            "An **f-string**: `{visitor}` is replaced by its value. On pass 1 this becomes `\"Alice checked in\"`.",
        },
        {
          code: "print(log)",
          text: "Shows the whole list after the loop: `['Alice checked in', 'Bob checked in']`.",
        },
      ]} />
      <Text>
        Each visitor gets appended to <Code>log</Code> one at a time, and by the end the log holds
        one entry per visitor, in the order they arrived - one action (a visitor arrives), one
        update (append), repeat.
      </Text>
      <Text>Here is the loop, one pass at a time:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>log = []</Code> starts empty.
        </ListItem>
        <ListItem>
          <Code>for visitor in ["Alice", "Bob"]</Code> runs the indented line once for each name.
          On pass 1 <Code>visitor</Code> is <Code>"Alice"</Code>.
        </ListItem>
        <ListItem>
          The <Code>f</Code> before the quote marks makes an <b>f-string</b>. Whatever is in curly
          braces is replaced by its value. So <Code>f"{"{visitor}"} checked in"</Code> becomes{" "}
          <Code>"Alice checked in"</Code>, and <Code>append</Code> adds it. The log is{" "}
          <Code>["Alice checked in"]</Code>.
        </ListItem>
        <ListItem>
          Pass 2 does the same for Bob. The log is{" "}
          <Code>["Alice checked in", "Bob checked in"]</Code>, and that is what{" "}
          <Code>print</Code> shows.
        </ListItem>
      </UnorderedList>

      <CodeBlock code={`deliveries = []
for package in ["P100", "P101"]:
    deliveries.append(f"{package} delivered")
print(deliveries)  # expected output: ['P100 delivered', 'P101 delivered']`} hints={[
        {
          code: "for package in [\"P100\", \"P101\"]:",
          block: "for loop",
          text: "Runs the indented line twice: first with `package` set to `\"P100\"`, then `\"P101\"`.",
        },
        {
          code: "deliveries = []",
          text: "Starts an empty list. Each pass of the loop adds one item.",
        },
        {
          code: "deliveries.append(",
          text: "`.append` adds one item to the end of the list. Earlier items stay.",
        },
        {
          code: "f\"{package} delivered\"",
          text: "An **f-string**: `{package}` is replaced by its value. On pass 1 this becomes `\"P100 delivered\"`.",
        },
        {
          code: "# expected output:",
          text: "A **comment**: Python skips everything after `#`. It shows what the line prints.",
        },
      ]} />
      <PracticeCell labId={13} cellId="concept-2" code={`deliveries = []
for package in ["P100", "P101"]:
    deliveries.append(f"{package} delivered")
print(deliveries)  # expected output: ['P100 delivered', 'P101 delivered']`} expectedOutput={`['P100 delivered', 'P101 delivered']`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>deliveries</Code> starts as an empty list.
        </ListItem>
        <ListItem>
          Pass 1: <Code>package</Code> is <Code>"P100"</Code>. The f-string builds{" "}
          <Code>"P100 delivered"</Code> and <Code>append</Code> adds it. The list has 1 item.
        </ListItem>
        <ListItem>
          Pass 2: <Code>package</Code> is <Code>"P101"</Code>. The list now has 2 items. The loop
          ends, and <Code>print</Code> shows the whole list.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>['P100 delivered', 'P101 delivered']</Code>. Try adding{" "}
        <Code>"P102"</Code> to the list of packages. You should get a third item at the end.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: every call re-sends the whole chat</Heading>
      <Text>
        Because the model has no memory, each call carries the full history. That has a cost.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A model reads text in small pieces called <b>tokens</b>. A short word like <Code>cat</Code>{" "}
          is about one token.
        </ListItem>
        <ListItem>
          Providers charge by the tokens you send, and a model can only take in a limited number at
          once. That limit is its <b>window</b>.
        </ListItem>
        <ListItem>
          The list gets longer each turn, so each call is bigger than the one before. A long chat
          becomes slower, costs more, and can finally fill the window.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. <Code>count_words</Code> adds up the words in a messages list. We
        use words as a simple stand-in for tokens. The loop adds a question, measures what the call
        would send, then adds a canned reply.
      </Text>
      <RunnableExample labId={13} code={`def count_words(messages):
    total = 0
    for message in messages:
        total = total + len(message["content"].split())
    return total


history = [{"role": "system", "content": "Be brief."}]
questions = ["Hi there", "Tell me a joke please", "Another one please"]
replies = ["Hello!", "Why did the chicken cross the road", "Because it wanted to"]
for i in range(len(questions)):
    history.append({"role": "user", "content": questions[i]})
    print("turn", i + 1, "sends", len(history), "messages,", count_words(history), "words")
    history.append({"role": "assistant", "content": replies[i]})`} hints={[
        {
          code: "def count_words(messages):",
          block: "function",
          text:
            "Adds up the words in every message of the list and gives back the total. We use words as a simple stand-in for tokens.",
        },
        {
          code: "    for message in messages:",
          block: "for loop",
          text: "Visits each message and adds its word count to `total`.",
        },
        {
          code: "for i in range(len(questions)):",
          block: "for loop",
          text:
            "One pass per chat turn, 3 in all. Each pass adds the question, prints how big the call would be, then adds the reply. The list gets 2 messages longer every pass.",
        },
        {
          code: ".split()",
          text:
            "Cuts the text at the spaces and gives a list of words. `\"Hi there\".split()` is `[\"Hi\", \"there\"]`. `len` of that list is the number of words.",
        },
        {
          code: "total = total + ",
          text: "Adds this message's word count to the running total.",
        },
        {
          code: "range(len(questions))",
          text:
            "`len(questions)` is 3, so `range` gives `0`, `1`, `2`. `i` uses these to pick the matching question and reply.",
        },
        {
          code: "questions[i]",
          text: "Picks the question at position `i`. On the first pass `i` is 0, so this is `\"Hi there\"`.",
        },
        {
          code: "i + 1",
          text: "Positions start at 0, so we add 1 to print turn numbers 1, 2, 3.",
        },
        {
          code: "count_words(history)",
          text: "How many words this call would send: 4, then 10, then 20. It grows because the whole history is sent each time.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Turn 1 sends 2 messages: the system message (2 words) and the question (2 words). That is
          4 words.
        </ListItem>
        <ListItem>
          Turn 2 sends 4 messages. The first question and its reply are sent again, plus the new
          question. That is 10 words.
        </ListItem>
        <ListItem>
          Turn 3 sends 6 messages and 20 words. The questions are short, but the total keeps
          growing, because nothing is ever dropped.
        </ListItem>
        <ListItem>
          Pattern: the size of each call is the size of the whole history so far, not just the new
          message.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>count_words</Code> from the worked example above, exactly as it is.
        </ListItem>
        <ListItem>
          Set <Code>history</Code> to a list with one dict: role <Code>system</Code>, content{" "}
          <Code>Answer briefly.</Code>.
        </ListItem>
        <ListItem>
          Set <Code>questions</Code> to <Code>{`["Hello", "What is two plus two", "Thanks a lot"]`}</Code>{" "}
          and <Code>replies</Code> to <Code>{`["Hi!", "Four", "You are welcome"]`}</Code>.
        </ListItem>
        <ListItem>
          Loop with <Code>for i in range(len(questions))</Code>. First append a dict with role{" "}
          <Code>user</Code> and content <Code>questions[i]</Code> to <Code>history</Code>.
        </ListItem>
        <ListItem>
          Then print <Code>"turn"</Code>, <Code>i + 1</Code>, <Code>"sends"</Code>,{" "}
          <Code>len(history)</Code>, <Code>"messages,"</Code>, <Code>count_words(history)</Code> and{" "}
          <Code>"words"</Code>, in one <Code>print(...)</Code>.
        </ListItem>
        <ListItem>
          Last, still inside the loop, append a dict with role <Code>assistant</Code> and content{" "}
          <Code>replies[i]</Code> to <Code>history</Code>.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={13} cellId="topic-2" withHint code={`def count_words(messages):
    total = 0
    for message in messages:
        total = total + len(message["content"].split())
    return total


history = [{"role": "system", "content": "Answer briefly."}]
questions = ["Hello", "What is two plus two", "Thanks a lot"]
replies = ["Hi!", "Four", "You are welcome"]
for i in range(len(questions)):
    history.append({"role": "user", "content": questions[i]})
    print("turn", i + 1, "sends", len(history), "messages,", count_words(history), "words")
    history.append({"role": "assistant", "content": replies[i]})`} expectedOutput={`turn 1 sends 2 messages, 3 words
turn 2 sends 4 messages, 9 words
turn 3 sends 6 messages, 13 words`} />
      <Text>
        <b>What you should see:</b> exactly these three lines. If yours differ, check the system
        text, the questions and replies, and the order of the two appends.
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
        {`turn 1 sends 2 messages, 3 words
turn 2 sends 4 messages, 9 words
turn 3 sends 6 messages, 13 words`}
      </Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>range(len(questions))</Code> gives 0, 1, 2, so <Code>i</Code> picks the matching
          question and reply. <Code>i + 1</Code> is just the turn number for the printout.
        </ListItem>
        <ListItem>
          Turn 1: "Answer briefly." is 2 words and "Hello" is 1 word, so 3 words in 2 messages.
        </ListItem>
        <ListItem>
          Turn 2: the reply "Hi!" (1 word) is now in the list, plus "What is two plus two" (5
          words). 2 + 1 + 1 + 5 = 9 words in 4 messages.
        </ListItem>
        <ListItem>
          Turn 3: add "Four" (1 word) and "Thanks a lot" (3 words). 9 + 1 + 3 = 13 words in 6
          messages.
        </ListItem>
        <ListItem>
          Each call is bigger than the one before, even though the new question is short, because
          the whole history is sent again.
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The notebook's main loop is structurally identical, just with an API call sitting in the
        middle of the two appends:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>append the user's message to <Code>messages</Code></ListItem>
        <ListItem>
          call <Code>call_groq(messages)</Code> - send the whole list so far, get a reply back
        </ListItem>
        <ListItem>append the reply to <Code>messages</Code> as an assistant message</ListItem>
        <ListItem>repeat for the next turn, now with a longer list than last time</ListItem>
      </UnorderedList>
      <Text>
        That's why every "multi-turn conversation" you've ever had with a chatbot is just this loop
        running once per message you send. It is also why the second call in this lab is bigger than
        the first: call 1 sends 2 messages, and call 2 sends 4.
      </Text>
      <Text>
        Here is the notebook's real loop with its 2 questions. The list starts with 1 item, the
        system dict:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Start: <Code>messages</Code> has 1 item (the system prompt).
        </ListItem>
        <ListItem>
          Turn 1: append the user dict for "Hi! What are you working on lately?". Now 2 items. Call{" "}
          <Code>call_groq(messages)</Code>. Append the reply as an assistant dict. Now 3 items.
        </ListItem>
        <ListItem>
          Turn 2: append the user dict for the second question. Now 4 items. This time the model
          sees the first question and its own first reply too. Append the new reply. Now 5 items.
        </ListItem>
        <ListItem>
          The last line prints <Code>Final messages list has 5 turns.</Code> (1 system + 2 users +
          2 assistants).
        </ListItem>
      </UnorderedList>
      <Text>
        You need a Groq API key for this part. The replies come from the model, so the words change
        from run to run. The count of 5 always stays the same.
      </Text>

      <Heading as="h3" size="sm">Idea 3: building a prompt is just string interpolation</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        A mail-merge letter template fills in blanks from a record:
      </Text>
      <RunnableExample labId={13} code={`name = "Priya"
city = "Austin"
letter = f"Dear {name}, welcome to {city}!"`} hints={LETTER_HINTS} />
      <Text>
        <Code>name</Code> and <Code>city</Code> get dropped straight into the string wherever the
        curly braces are - that's the entire mechanism behind an f-string, no matter how long the
        template gets.
      </Text>

      <CodeBlock code={`person = {"name": "Sam", "occasion": "graduation"}
card = f"Congrats {person['name']} on your {person['occasion']}!"
print(card)  # expected output: Congrats Sam on your graduation!`} hints={[
        {
          code: "person = {",
          text:
            "A **dict**: a small table of labels and values, in curly braces. The labels are called **keys**. This one has 2 keys, `\"name\"` and `\"occasion\"`.",
        },
        {
          code: "f\"Congrats",
          text: "The `f` before the quote makes an **f-string**. Each `{...}` is a blank that Python fills with a value.",
        },
        {
          code: "person['name']",
          text:
            "Looks up the value for the key `\"name\"`: `\"Sam\"`. The inner quotes are single quotes because the outer ones are double quotes.",
        },
        {
          code: "person['occasion']",
          text: "Looks up the value for the key `\"occasion\"`: `\"graduation\"`.",
        },
      ]} />
      <PracticeCell labId={13} cellId="concept-3" code={`person = {"name": "Sam", "occasion": "graduation"}
card = f"Congrats {person['name']} on your {person['occasion']}!"
print(card)  # expected output: Congrats Sam on your graduation!`} expectedOutput={`Congrats Sam on your graduation!`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>person</Code> is a dict with 2 keys: <Code>"name"</Code> is <Code>"Sam"</Code> and{" "}
          <Code>"occasion"</Code> is <Code>"graduation"</Code>.
        </ListItem>
        <ListItem>
          Inside the f-string, <Code>person['name']</Code> looks up the value for the key{" "}
          <Code>name</Code>, which is <Code>Sam</Code>. <Code>person['occasion']</Code> gives{" "}
          <Code>graduation</Code>. The inner quotes are single quotes because the outer ones are
          double quotes.
        </ListItem>
        <ListItem>
          The two values drop into the blanks and <Code>card</Code> becomes{" "}
          <Code>"Congrats Sam on your graduation!"</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>Congrats Sam on your graduation!</Code>. Try changing{" "}
        <Code>"graduation"</Code> to <Code>"promotion"</Code>. The card should say "on your
        promotion!".
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: the system prompt is all the model knows about you</Heading>
      <Text>
        A model is trained on public text. It knows nothing about you. The <b>system prompt</b> is
        the first message in the list, and it holds the instructions the model follows all chat
        long.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          To play a person, you give it that person's name, tone and facts in the system prompt.
        </ListItem>
        <ListItem>
          The model can only draw on facts that are written there. It does not look anywhere else.
        </ListItem>
        <ListItem>
          A fact that is missing from the prompt is a fact the model cannot use. A good prompt also
          says what to avoid, such as medical advice.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. <Code>make_system</Code> builds a small system prompt from a name
        and a list of facts. <Code>fake_twin</Code> is a pretend model that only answers from the
        fact lines in that prompt. It looks for a long word from the question inside each fact.
      </Text>
      <RunnableExample labId={13} code={`def make_system(name, facts):
    lines = ["You are " + name + "."]
    for fact in facts:
        lines.append("- " + fact)
    return "\\n".join(lines)


def fake_twin(messages):
    question = messages[-1]["content"].lower()
    for line in messages[0]["content"].split("\\n"):
        if line.startswith("- "):
            for word in question.strip("?").split():
                if len(word) >= 5 and word in line:
                    return "From my facts: " + line[2:]
    return "I was not given a fact about that."


system = make_system("Ada", ["plays chess on Sundays", "teaches maths at night"])
for question in ["Do you play chess?", "Do you teach maths?", "Where do you live?"]:
    messages = [{"role": "system", "content": system}, {"role": "user", "content": question}]
    print(question, "->", fake_twin(messages))`} hints={[
        {
          code: "def make_system(name, facts):",
          block: "function",
          text:
            "Builds a small system prompt: one line `You are Ada.`, then one `- ` bullet line per fact. Gives back all the lines glued into one string.",
        },
        {
          code: "    for fact in facts:",
          block: "for loop",
          text: "Adds one bullet line for each fact, like `- plays chess on Sundays`.",
        },
        {
          code: "def fake_twin(messages):",
          block: "function",
          text:
            "A pretend model. It reads the fact lines in the system message. If a long word from the question is in a fact, it answers with that fact. If no fact matches, it says it was not given one.",
        },
        {
          code: "    for line in messages[0]",
          block: "for loop",
          text: "Goes through the system prompt one line at a time, looking only at the `- ` fact lines.",
        },
        {
          code: "for word in question.strip(\"?\").split():",
          block: "for loop",
          text: "Tries each word of the question against the current fact line.",
        },
        {
          code: "for question in [\"Do you play chess?\"",
          block: "for loop",
          text:
            "Asks 3 questions. Each pass builds a fresh 2-message list, system first, then user, and prints the pretend reply.",
        },
        {
          code: "\"\\n\".join(lines)",
          text: "`\\n` means \"start a new line\". `.join` glues the lines into one string, with a new line between each pair.",
        },
        {
          code: ".lower()",
          text: "Makes a copy of the text in small letters, so `Chess` and `chess` match.",
        },
        {
          code: ".split(\"\\n\")",
          text: "The opposite of `.join`: cuts the prompt back into a list of lines at each new line.",
        },
        {
          code: ".strip(\"?\")",
          text: "Removes the `?` from the ends of the question, so `chess?` becomes `chess`.",
        },
        {
          code: "len(word) >= 5 and word in line",
          text:
            "Both parts must be `True`. The word must have 5 or more letters, so short words like `do` and `you` are skipped. And it must appear in the fact line.",
        },
        {
          code: "line[2:]",
          text: "A **slice**: everything from position 2 to the end. It drops the first two characters, the `- ` bullet.",
        },
        {
          code: "messages[0]",
          text: "The first message in the list, which is the system message. Counting starts at 0.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>make_system</Code> loops over the facts and adds one <Code>- </Code> bullet line
          for each. Then <Code>"\n".join(lines)</Code> makes one string.
        </ListItem>
        <ListItem>
          <Code>fake_twin</Code> reads the system message (<Code>messages[0]</Code>) line by line. A
          question word such as <Code>chess</Code> or <Code>maths</Code> matches a fact, so it
          answers from that fact.
        </ListItem>
        <ListItem>
          "Where do you live?" matches no fact. Nobody wrote Ada's home town in the prompt, so the
          model has nothing to say.
        </ListItem>
        <ListItem>
          Pattern: whatever you want the model to know about you must be written in the prompt.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>make_system</Code> and <Code>fake_twin</Code> from the worked example above,
          exactly as they are.
        </ListItem>
        <ListItem>
          Set <Code>system</Code> to{" "}
          <Code>{`make_system("Kofi", ["bakes bread daily", "runs every morning"])`}</Code>.
        </ListItem>
        <ListItem>
          Loop with <Code>for question in</Code> the list{" "}
          <Code>{`["Do you bake bread?", "Do you run every morning?", "Do you swim?"]`}</Code>.
        </ListItem>
        <ListItem>
          Inside the loop, set <Code>messages</Code> to a list of two dicts: one with role{" "}
          <Code>system</Code> and content <Code>system</Code>, then one with role <Code>user</Code>{" "}
          and content <Code>question</Code>.
        </ListItem>
        <ListItem>
          Still inside the loop, print <Code>question</Code>, then <Code>"-&gt;"</Code>, then{" "}
          <Code>fake_twin(messages)</Code>, in one <Code>print(...)</Code>.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={13} cellId="topic-3" withHint code={`def make_system(name, facts):
    lines = ["You are " + name + "."]
    for fact in facts:
        lines.append("- " + fact)
    return "\\n".join(lines)


def fake_twin(messages):
    question = messages[-1]["content"].lower()
    for line in messages[0]["content"].split("\\n"):
        if line.startswith("- "):
            for word in question.strip("?").split():
                if len(word) >= 5 and word in line:
                    return "From my facts: " + line[2:]
    return "I was not given a fact about that."


system = make_system("Kofi", ["bakes bread daily", "runs every morning"])
for question in ["Do you bake bread?", "Do you run every morning?", "Do you swim?"]:
    messages = [{"role": "system", "content": system}, {"role": "user", "content": question}]
    print(question, "->", fake_twin(messages))`} expectedOutput={`Do you bake bread? -> From my facts: bakes bread daily
Do you run every morning? -> From my facts: runs every morning
Do you swim? -> I was not given a fact about that.`} />
      <Text>
        <b>What you should see:</b> exactly these three lines. If yours differ, check the name, the
        two facts and the three questions.
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
        {`Do you bake bread? -> From my facts: bakes bread daily
Do you run every morning? -> From my facts: runs every morning
Do you swim? -> I was not given a fact about that.`}
      </Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The system prompt has 3 lines: <Code>You are Kofi.</Code> and two bullet lines.
        </ListItem>
        <ListItem>
          "Do you bake bread?" has the word <Code>bread</Code>, which is in the first fact. The
          function stops at the first match and answers.
        </ListItem>
        <ListItem>
          "Do you run every morning?" skips <Code>run</Code>, because it is shorter than 5 letters.
          The words <Code>every</Code> and <Code>morning</Code> match the second fact.
        </ListItem>
        <ListItem>
          "Do you swim?" has no word of 5 letters or more that is in a fact, so the model says it
          was not given a fact about that.
        </ListItem>
        <ListItem>
          The reply copies the fact with <Code>line[2:]</Code>, which drops the first two
          characters, the <Code>- </Code> bullet.
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>build_digital_twin_system_prompt(profile)</Code> does the same thing at a larger
        scale: it pulls <Code>name</Code>, <Code>role</Code>, <Code>tone</Code>,{" "}
        <Code>facts</Code>, and <Code>boundaries</Code> out of a plain dict and interpolates them
        into a block of instruction text with f-strings and a list comprehension, then joins the
        lines with <Code>"\n".join(...)</Code>. There's no special "prompt-writing" mechanism here
        at all - it's the same string-building you'd use for a form letter, just aimed at a system
        prompt instead of an envelope. The string it returns becomes <Code>messages[0]</Code>, so the
        facts and boundaries you put in your profile are everything your twin knows about you.
      </Text>
      <Text>
        Take a tiny profile: name <Code>"Ada"</Code>, role <Code>"a data analyst"</Code>, tone{" "}
        <Code>"warm, curious"</Code>, one fact <Code>"likes pandas"</Code>, one boundary{" "}
        <Code>"no medical advice"</Code>. The function does this:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          It starts a list <Code>lines</Code> with 3 strings:{" "}
          <Code>You are role-playing as Ada, a data analyst.</Code>, then{" "}
          <Code>Speak in a tone that is warm, curious.</Code>, then{" "}
          <Code>Facts you can draw on about this person:</Code>.
        </ListItem>
        <ListItem>
          <Code>lines += [f"- {"{fact}"}" for fact in profile["facts"]]</Code> adds one bullet per
          fact. This short form is called a <b>list comprehension</b>. Here it adds{" "}
          <Code>- likes pandas</Code>.
        </ListItem>
        <ListItem>
          <Code>lines.append("Boundaries you must respect:")</Code> adds one more heading. Use{" "}
          <Code>append</Code> to add one item, and <Code>+=</Code> to add a whole list of items.
        </ListItem>
        <ListItem>
          The next comprehension adds <Code>- no medical advice</Code>. Now there are 6 lines.
        </ListItem>
        <ListItem>
          <Code>"\n".join(lines)</Code> glues the 6 lines into one string. <Code>"\n"</Code> means
          "start a new line". That string becomes <Code>messages[0]</Code>, the system message.
        </ListItem>
      </UnorderedList>
      <Text>
        With 2 facts and 2 boundaries, as in the notebook's <Code>test_profile</Code>, the prompt
        has 8 lines. The check in the notebook just looks for words like <Code>"Vera"</Code> and{" "}
        <Code>"FastAPI"</Code> inside the string.
      </Text>

      <Heading as="h3" size="sm">Further reading</Heading>
      <Text>
        IBM's{" "}
        <Link
          href="https://www.ibm.com/think/insights/importance-context-chatbot-conversation"
          isExternal
          color="blue.500"
        >
          overview of why context matters in a chatbot conversation
        </Link>{" "}
        is a good next read - it's the product-level version of exactly what the growing{" "}
        <Code>messages</Code> list is doing here.
      </Text>
    </FlatReadingPager>
  );
}
