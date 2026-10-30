import { Heading, Link, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab15Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">GroqClient: a class that owns the messages list</Heading>
      <Text>
        Every earlier lab hand-rolled its own messages list. This lab wraps that bookkeeping into
        a proper <Code>GroqClient</Code> class that owns <Code>self.messages</Code> and grows it
        automatically on every call - the polished version of what lab 13 did by hand, and a
        direct descendant of lab 14's "wrap it in a class" idea.
      </Text>

      <Heading as="h3" size="sm">State that lives inside the object, not next to it</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Picture a <Code>Car</Code> object that tracks its own mileage:
      </Text>
      <RunnableExample labId={15} code={`class Car:
    def __init__(self):
        self.odometer = 0

    def drive(self, miles):
        self.odometer += miles

car = Car()
car.drive(10)
car.drive(5)
print(car.odometer)  # 15`} />
      <Text>
        Nobody outside the object has to remember to update a separate "total miles" variable - the
        car keeps track of itself.
      </Text>
      <Text>Here is the example, one line at a time, with the real numbers:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A <b>class</b> is a blueprint. <Code>Car()</Code> builds one <b>object</b> from it. An
          object is one real thing made from the blueprint.
        </ListItem>
        <ListItem>
          <Code>__init__</Code> runs once, when the car is built. <Code>self</Code> means "this
          car". <Code>self.odometer = 0</Code> gives this car a number that starts at 0.
        </ListItem>
        <ListItem>
          <Code>car.drive(10)</Code> calls a <b>method</b>, a function that belongs to the object.{" "}
          <Code>self.odometer += miles</Code> means "add miles to what is already there". <Code>0 + 10</Code> =
          10.
        </ListItem>
        <ListItem>
          <Code>car.drive(5)</Code> starts from the saved 10. <Code>10 + 5 = 15</Code>. So{" "}
          <Code>print(car.odometer)</Code> shows <Code>15</Code>.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`class BankAccount:
    def __init__(self):
        self.balance = 0

    def deposit(self, amount):
        self.balance += amount

account = BankAccount()
account.deposit(50)
account.deposit(25)
print(account.balance)  # expected output: 75`}
      </Code>
      <PracticeCell labId={15} cellId="concept-1" code={`class BankAccount:
    def __init__(self):
        self.balance = 0

    def deposit(self, amount):
        self.balance += amount

account = BankAccount()
account.deposit(50)
account.deposit(25)
print(account.balance)  # expected output: 75`} expectedOutput={`75`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>BankAccount()</Code> builds an account. <Code>__init__</Code> sets{" "}
          <Code>self.balance</Code> to 0.
        </ListItem>
        <ListItem>
          <Code>account.deposit(50)</Code> adds 50 to the saved balance. <Code>0 + 50 = 50</Code>.
        </ListItem>
        <ListItem>
          <Code>account.deposit(25)</Code> adds 25 to the saved 50. <Code>50 + 25 = 75</Code>.
        </ListItem>
        <ListItem>
          <Code>print(account.balance)</Code> reads the number the object kept. Nobody outside had
          to track it.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>75</Code>. Try adding <Code>account.deposit(100)</Code>{" "}
        before the print. You should see <Code>175</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: the history is read in order, by role</Heading>
      <Text>
        The model reads the messages list from top to bottom. Each message has a role, and the
        order tells the model who said what.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The <Code>system</Code> message goes first. It holds the rules for the whole chat.
        </ListItem>
        <ListItem>
          After that, a normal chat goes <Code>user</Code>, <Code>assistant</Code>,{" "}
          <Code>user</Code>, <Code>assistant</Code>, and so on.
        </ListItem>
        <ListItem>
          If the order is scrambled, the model can mix up who said what, and the answer gets worse.
          An object that adds messages itself can keep the order right every time.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. <Code>make_history</Code> builds a messages list from a list of
        role names. <Code>check_history</Code> loops over it and says if the roles alternate the
        way a normal chat does.
      </Text>
      <RunnableExample labId={15} code={`def make_history(roles):
    history = []
    for role in roles:
        history.append({"role": role, "content": "text"})
    return history


def check_history(messages):
    expected = "user"
    for message in messages[1:]:  # skip the system message
        if message["role"] != expected:
            return "problem: expected " + expected + " but got " + message["role"]
        if expected == "user":
            expected = "assistant"
        else:
            expected = "user"
    return "ok"


chats = [
    ["system", "user", "assistant", "user", "assistant"],
    ["system", "user", "user"],
]
for roles in chats:
    print(len(roles), "messages ->", check_history(make_history(roles)))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>messages[1:]</Code> skips the first message, the system one. Then{" "}
          <Code>expected</Code> starts as <Code>"user"</Code>.
        </ListItem>
        <ListItem>
          In the first chat every role matches what was expected, and the expected role flips each
          time, so the answer is <Code>ok</Code>.
        </ListItem>
        <ListItem>
          In the second chat the model gets two user messages in a row. The loop stops at the
          second one and reports that it expected <Code>assistant</Code>.
        </ListItem>
        <ListItem>
          Pattern: the role is part of the meaning, so the order of the list matters.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on two new chats.
      </Text>
      <PracticeCell labId={15} cellId="topic-1" code={`def make_history(roles):
    history = []
    for role in roles:
        history.append({"role": role, "content": "text"})
    return history


def check_history(messages):
    expected = "user"
    for message in messages[1:]:
        if message["role"] != expected:
            return "problem: expected " + expected + " but got " + message["role"]
        if expected == "user":
            expected = "assistant"
        else:
            expected = "user"
    return "ok"


chats = [
    ["system", "user", "assistant", "user"],
    ["system", "user", "assistant", "assistant"],
]
for roles in chats:
    print(len(roles), "messages ->", check_history(make_history(roles)))`} expectedOutput={`4 messages -> ok
4 messages -> problem: expected user but got assistant`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The first chat ends on a user message, which is fine. It is a question that still waits
          for its answer.
        </ListItem>
        <ListItem>
          In the second chat, the third message is an assistant message. After it the loop expects a{" "}
          <Code>user</Code>, but the fourth message is another assistant message.
        </ListItem>
        <ListItem>
          Both chats have 4 messages, but only the order tells them apart.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>4 messages -&gt; ok</Code>, then{" "}
        <Code>4 messages -&gt; problem: expected user but got assistant</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In lab 13, <Code>messages</Code> was a loose variable sitting outside any object, and you
        were responsible for appending to it correctly at each step. <Code>GroqClient</Code> moves
        that same list <i>inside</i> the object as <Code>self.messages</Code>, so the object is
        responsible for its own history instead of you being responsible for it. Because{" "}
        <Code>send()</Code> always adds the user message first and the reply second, the roles stay
        in the right order without you thinking about it.
      </Text>
      <Text>
        Here is the lab's constructor (the <Code>__init__</Code> method) with a real input. Say you
        build{" "}
        <Code>GroqClient(api_key=None, model="fake-model", system_prompt="You are helpful.")</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The four lines <Code>self.api_key = ...</Code> to <Code>self.transport = ...</Code> save
          what you passed in, so every method can use it later.
        </ListItem>
        <ListItem>
          <Code>self.messages = []</Code> makes the empty history list.
        </ListItem>
        <ListItem>
          <Code>if system_prompt:</Code> is true for any non-empty text. So the system dict{" "}
          <Code>{'{"role": "system", "content": "You are helpful."}'}</Code> is appended. The list
          has 1 item. If you passed no system prompt, the list stays empty.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Methods that encapsulate repeated steps</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        A minimal to-do list class hides its bookkeeping behind one method instead of making every
        caller repeat it:
      </Text>
      <RunnableExample labId={15} code={`class TodoList:
    def __init__(self):
        self.items = []

    def add(self, item):
        self.items.append(item)
        print(f"Added: {item} ({len(self.items)} items total)")`} />
      <Text>
        <Code>add</Code> is the one place that appends to <Code>self.items</Code> and reports back -
        callers never touch <Code>self.items</Code> directly, they just call <Code>add(...)</Code>.
      </Text>
      <Text>Here is what happens when you call <Code>add("milk")</Code> on a new list:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>TodoList()</Code> builds the object. <Code>self.items</Code> is an empty list.
        </ListItem>
        <ListItem>
          <Code>self.items.append(item)</Code> puts <Code>"milk"</Code> at the end. The list is now{" "}
          <Code>["milk"]</Code>.
        </ListItem>
        <ListItem>
          <Code>len(self.items)</Code> counts the items: 1. The f-string fills the blanks and
          prints <Code>Added: milk (1 items total)</Code>. The caller wrote one line and the
          method did both jobs.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`class Playlist:
    def __init__(self):
        self.songs = []

    def add(self, song):
        self.songs.append(song)
        print(f"Queued: {song} ({len(self.songs)} songs total)")

playlist = Playlist()
playlist.add("Song A")
playlist.add("Song B")
# expected output:
# Queued: Song A (1 songs total)
# Queued: Song B (2 songs total)`}
      </Code>
      <PracticeCell labId={15} cellId="concept-2" code={`class Playlist:
    def __init__(self):
        self.songs = []

    def add(self, song):
        self.songs.append(song)
        print(f"Queued: {song} ({len(self.songs)} songs total)")

playlist = Playlist()
playlist.add("Song A")
playlist.add("Song B")
# expected output:
# Queued: Song A (1 songs total)
# Queued: Song B (2 songs total)`} expectedOutput={`Queued: Song A (1 songs total)
Queued: Song B (2 songs total)`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>Playlist()</Code> builds an object with <Code>self.songs</Code> set to an empty
          list.
        </ListItem>
        <ListItem>
          <Code>playlist.add("Song A")</Code> appends the song. The list is{" "}
          <Code>["Song A"]</Code>, so <Code>len</Code> is 1. It prints{" "}
          <Code>Queued: Song A (1 songs total)</Code>.
        </ListItem>
        <ListItem>
          <Code>playlist.add("Song B")</Code> makes the list <Code>["Song A", "Song B"]</Code>, so{" "}
          <Code>len</Code> is 2. It prints <Code>Queued: Song B (2 songs total)</Code>. The "1
          songs" wording is a small grammar quirk. The count is right.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> two lines, with the totals 1 and 2. Try adding a third call,{" "}
        <Code>playlist.add("Song C")</Code>. You should get a line that ends in{" "}
        <Code>(3 songs total)</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: a long chat fills the window, so start fresh</Heading>
      <Text>
        Every <Code>send</Code> adds two messages to the history: the question and the reply. The
        model can only take in a limited amount of text at once. That limit is its{" "}
        <b>window</b>.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The history only grows, and all of it is sent each time. So a long chat eventually gets
          too big for the window.
        </ListItem>
        <ListItem>
          Old topics also stay in the history. They can pull a new, unrelated chat off track.
        </ListItem>
        <ListItem>
          The simple fix is a <b>reset</b>: throw the history away and keep only the system
          message, so the rules stay.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. <Code>add</Code> puts one message on the history,{" "}
        <Code>count_words</Code> measures it (words stand in for tokens), and <Code>reset</Code>{" "}
        starts a new history with only the system message. The window is 12 words.
      </Text>
      <RunnableExample labId={15} code={`def count_words(messages):
    total = 0
    for message in messages:
        total = total + len(message["content"].split())
    return total


def add(history, role, text):
    history.append({"role": role, "content": text})


def reset(system_text):
    return [{"role": "system", "content": system_text}]


window = 12
history = reset("Be brief.")
for text in ["tell me about cats", "now tell me about dogs", "and about birds"]:
    add(history, "user", text)
    words = count_words(history)
    print(len(history), "messages,", words, "words, fits:", words <= window)
    add(history, "assistant", "ok ok ok")
history = reset("Be brief.")
print("after reset:", len(history), "message,", count_words(history), "words")`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Each pass of the loop adds a question, measures the history, then adds a canned reply of
          3 words. The first question gives 6 words in 2 messages, which fits.
        </ListItem>
        <ListItem>
          By the second question the history is 14 words in 4 messages. That is over the window of
          12. The third is 20 words in 6 messages.
        </ListItem>
        <ListItem>
          <Code>reset</Code> builds a new list with only the system message: 1 message and 2 words.
          The chat is small again, and the rules are still there.
        </ListItem>
        <ListItem>
          Pattern: history only grows, so you reset (or trim) it when a chat ends or gets too long.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same three functions with a new system message, a new window and new
        questions.
      </Text>
      <PracticeCell labId={15} cellId="topic-2" code={`def count_words(messages):
    total = 0
    for message in messages:
        total = total + len(message["content"].split())
    return total


def add(history, role, text):
    history.append({"role": role, "content": text})


def reset(system_text):
    return [{"role": "system", "content": system_text}]


window = 10
history = reset("Answer in one line.")
for text in ["name a fruit", "name a colour please", "name a country in Africa"]:
    add(history, "user", text)
    words = count_words(history)
    print(len(history), "messages,", words, "words, fits:", words <= window)
    add(history, "assistant", "mango")
history = reset("Answer in one line.")
print("after reset:", len(history), "message,", count_words(history), "words")`} expectedOutput={`2 messages, 7 words, fits: True
4 messages, 12 words, fits: False
6 messages, 18 words, fits: False
after reset: 1 message, 4 words`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The system message <Code>Answer in one line.</Code> has 4 words. The first question has 3
          words, so 7 words in 2 messages. That fits the window of 10.
        </ListItem>
        <ListItem>
          The reply <Code>mango</Code> adds 1 word. The second question adds 4: 7 + 1 + 4 = 12. That
          is over the window.
        </ListItem>
        <ListItem>
          The third question adds 1 + 5 more: 18 words in 6 messages.
        </ListItem>
        <ListItem>
          <Code>reset</Code> keeps only the system message, so we are back to 1 message and 4
          words.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> the sizes 7, 12 and 18 words, with <Code>fits: True</Code> only
        for the first. After the reset the count is back to 1 message.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>GroqClient.add_user_message</Code> and <Code>add_assistant_message</Code> are exactly
        this: each is a one-line method whose entire job is "append the right dict to{" "}
        <Code>self.messages</Code>". <Code>send(user_text)</Code> then composes them into one
        higher-level step: add the user message, call the transport, add the reply, return it. You
        call <Code>client.send("hi")</Code> once instead of repeating three lines of bookkeeping at
        every call site - the exact same win as lab 14's <Code>.post()</Code>, just one layer up.{" "}
        <Code>reset()</Code> is the lab's fresh-start button for a chat that has grown too long.
      </Text>
      <Text>
        Here is the lab's real code. The client has a system prompt <Code>"You are helpful."</Code>{" "}
        and a stand-in transport called <Code>fake_transport</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Start: <Code>messages</Code> has 1 item, the system dict.
        </ListItem>
        <ListItem>
          <Code>client.send("Hello!")</Code> first calls <Code>add_user_message</Code>. That
          appends <Code>{'{"role": "user", "content": "Hello!"}'}</Code>. Now 2 items.
        </ListItem>
        <ListItem>
          Then <Code>self.transport(self.messages, self.api_key, self.model)</Code> runs.{" "}
          <Code>fake_transport</Code> looks at <Code>messages[-1]</Code>. The index{" "}
          <Code>-1</Code> means "the last item". Its content is <Code>"Hello!"</Code>, so the reply
          is <Code>"(fake reply to: Hello!)"</Code>.
        </ListItem>
        <ListItem>
          <Code>add_assistant_message(reply)</Code> appends the reply as an assistant dict. Now 3
          items. <Code>send</Code> returns the reply text.
        </ListItem>
        <ListItem>
          A second <Code>client.send("Second message")</Code> adds a user dict and an assistant
          dict. Now 5 items. That is the number the notebook checks.
        </ListItem>
        <ListItem>
          <Code>client.reset()</Code> sets <Code>self.messages</Code> back to a new list with only
          the system dict, so the history is 1 item again. With no system prompt, reset gives an
          empty list. The line{" "}
          <Code>[...] if self.system_prompt else []</Code> is a one-line "if this, else that".
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">
        Separating "how to call" from "what to say": swap the courier, not the letter
      </Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Imagine an office where every outgoing letter goes through the same internal
        process - write it, log it in the outbox, wait for a reply - regardless of whether it's
        actually delivered by a courier, the postal service, or just walked down the hall. The
        office workflow doesn't change; only who carries the letter does.
      </Text>
      <Text>
        In code, the "courier" is just a function that you hand to the class. Python lets you pass
        a function around like any other value. You write the function's name{" "}
        <b>without brackets</b>. With brackets (<Code>fake_sender("hi")</Code>) you run it right
        now. Without brackets (<Code>fake_sender</Code>) you pass the function itself, so the class
        can run it later.
      </Text>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`def fake_sender(message):
    return f"[fake] would send: {message}"

class Notifier:
    def __init__(self, sender):
        self.sender = sender

    def notify(self, message):
        return self.sender(message)

notifier = Notifier(sender=fake_sender)
print(notifier.notify("Build complete"))  # expected output: [fake] would send: Build complete`}
      </Code>
      <PracticeCell labId={15} cellId="concept-3" code={`def fake_sender(message):
    return f"[fake] would send: {message}"

class Notifier:
    def __init__(self, sender):
        self.sender = sender

    def notify(self, message):
        return self.sender(message)

notifier = Notifier(sender=fake_sender)
print(notifier.notify("Build complete"))  # expected output: [fake] would send: Build complete`} expectedOutput={`[fake] would send: Build complete`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>fake_sender</Code> is the stand-in courier. It does not send anything. It just
          returns the text <Code>"[fake] would send: ..."</Code> with the message filled in.
        </ListItem>
        <ListItem>
          <Code>Notifier(sender=fake_sender)</Code> saves that function in{" "}
          <Code>self.sender</Code>. Note there are no brackets after <Code>fake_sender</Code>, so
          it is stored, not run.
        </ListItem>
        <ListItem>
          <Code>notifier.notify("Build complete")</Code> runs <Code>self.sender(message)</Code>,
          which is now <Code>fake_sender("Build complete")</Code>. It returns{" "}
          <Code>"[fake] would send: Build complete"</Code>, and that is printed.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>[fake] would send: Build complete</Code>. Try writing a
        second function, <Code>def loud_sender(message): return message.upper()</Code>, and build{" "}
        <Code>Notifier(sender=loud_sender)</Code>. You should see <Code>BUILD COMPLETE</Code>. The{" "}
        <Code>Notifier</Code> class did not change at all.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: one chat loop, any model behind it</Heading>
      <Text>
        Real model calls need a key, cost money and give a different answer each time. That makes
        them awkward to test. The fix is to keep the call in one small function that you can swap.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The chat loop only needs "give me the messages, get back a reply string".
        </ListItem>
        <ListItem>
          A fake function gives the same reply every time, so you can check the loop's own work,
          such as how long the history is, without a key or the internet.
        </ListItem>
        <ListItem>
          Later you plug in the real function. The loop does not change. It can even be a different
          provider.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. <Code>run_chat</Code> is one chat loop. We run it twice with two
        different stand-in models. In this simple version, a transport takes only the messages.
      </Text>
      <RunnableExample labId={15} code={`def echo_transport(messages):
    return "echo: " + messages[-1]["content"]


def shout_transport(messages):
    return messages[-1]["content"].upper() + "!"


def run_chat(transport, questions):
    messages = []
    for question in questions:
        messages.append({"role": "user", "content": question})
        reply = transport(messages)
        messages.append({"role": "assistant", "content": reply})
        print(question, "->", reply)
    return len(messages)


questions = ["hello", "how are you"]
for transport in [echo_transport, shout_transport]:
    print("with", transport.__name__)
    count = run_chat(transport, questions)
    print("history size:", count)`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>run_chat</Code> never says which model it uses. It just calls{" "}
          <Code>transport(messages)</Code>, and the function in the list does the work.
        </ListItem>
        <ListItem>
          The outer loop passes each function without brackets, so it is stored and called later.{" "}
          <Code>transport.__name__</Code> is the function's name, used here for the printout.
        </ListItem>
        <ListItem>
          Both runs give a history size of 4: 2 questions and 2 replies. The loop's bookkeeping is
          the same, and only the replies change.
        </ListItem>
        <ListItem>
          Pattern: keep the model call behind one function, and you can swap it without touching
          the chat loop.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same loop with two new stand-in models.
      </Text>
      <PracticeCell labId={15} cellId="topic-3" code={`def reverse_transport(messages):
    return messages[-1]["content"][::-1]


def count_transport(messages):
    return "I can see " + str(len(messages)) + " messages"


def run_chat(transport, questions):
    messages = []
    for question in questions:
        messages.append({"role": "user", "content": question})
        reply = transport(messages)
        messages.append({"role": "assistant", "content": reply})
        print(question, "->", reply)
    return len(messages)


questions = ["abc", "xyz"]
for transport in [reverse_transport, count_transport]:
    print("with", transport.__name__)
    count = run_chat(transport, questions)
    print("history size:", count)`} expectedOutput={`with reverse_transport
abc -> cba
xyz -> zyx
history size: 4
with count_transport
abc -> I can see 1 messages
xyz -> I can see 3 messages
history size: 4`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>[::-1]</Code> reads a string backwards, so <Code>abc</Code> becomes <Code>cba</Code>.
        </ListItem>
        <ListItem>
          <Code>count_transport</Code> reports how many messages it was given. On the first
          question the list has 1 message. On the second it has 3: the first question, its reply
          and the new question.
        </ListItem>
        <ListItem>
          <Code>run_chat</Code> is exactly the same for both. Each run ends with a history of 4.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> two blocks of three lines. In the second block the number of
        messages seen grows from 1 to 3.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>GroqClient</Code>'s constructor takes a <Code>transport</Code> callable with the
        signature <Code>transport(messages, api_key, model) -&gt; str</Code> instead of hardcoding a
        network call inside <Code>send()</Code>. That's <b>dependency injection</b>: the class's
        own logic (grow the messages list correctly) is written once and stays the same no matter
        which "courier" actually delivers the request. The exercise hands it{" "}
        <Code>fake_transport</Code> - an office intern who instantly hands back a canned
        reply - so every assert runs with zero network access and no API key. The real-world
        project swaps in <Code>real_transport</Code>, which just calls <Code>call_groq</Code>
        underneath, and nothing else about the class changes. That is why the notebook's check of 5
        messages after two <Code>send</Code> calls works the same with the fake or the real one.
      </Text>
      <Text>
        One more small but deliberate detail: <Code>history</Code> is a property that returns{" "}
        <Code>list(self.messages)</Code> - a <i>copy</i>, not the original list. That way code
        reading <Code>client.history</Code> can't accidentally mutate the client's real internal
        state; it can only look at it.
      </Text>
      <Text>Here is the copy idea with real numbers:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Say the client holds 3 messages. <Code>copy = client.history</Code> gives a new list with
          the same 3 dicts.
        </ListItem>
        <ListItem>
          <Code>copy.append(...)</Code> makes the copy 4 long. <Code>client.history</Code> is
          still 3 long, because only the copy changed.
        </ListItem>
      </UnorderedList>
      <Text>
        The project ends by printing the history. The line{" "}
        <Code>{"f\"{message['role']:<10} {message['content'][:80]}\""}</Code> does two small
        things. <Code>:&lt;10</Code> pads the role with spaces up to 10 characters, so the columns
        line up. <Code>[:80]</Code> keeps only the first 80 characters of a long message. For a
        system message it prints something like <Code>system     You are role-playing as ...</Code>.
        The project needs a Groq API key. The replies will differ each time, but the roles will
        always go system, user, assistant, user, assistant (5 lines).
      </Text>

      <Heading as="h3" size="sm">Further reading</Heading>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          IBM's{" "}
          <Link href="https://www.ibm.com/think/topics/api-design" isExternal color="blue.500">
            overview of API design
          </Link>{" "}
          talks about designing consistent, predictable interfaces - the same reasoning behind
          giving <Code>GroqClient</Code> a small, focused set of methods instead of exposing{" "}
          <Code>self.messages</Code> directly for callers to poke at.
        </ListItem>
      </UnorderedList>
    </VStack>
  );
}
