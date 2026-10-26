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

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In lab 13, <Code>messages</Code> was a loose variable sitting outside any object, and you
        were responsible for appending to it correctly at each step. <Code>GroqClient</Code> moves
        that same list <i>inside</i> the object as <Code>self.messages</Code>, so the object is
        responsible for its own history instead of you being responsible for it.
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

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>GroqClient.add_user_message</Code> and <Code>add_assistant_message</Code> are exactly
        this: each is a one-line method whose entire job is "append the right dict to{" "}
        <Code>self.messages</Code>". <Code>send(user_text)</Code> then composes them into one
        higher-level step: add the user message, call the transport, add the reply, return it. You
        call <Code>client.send("hi")</Code> once instead of repeating three lines of bookkeeping at
        every call site - the exact same win as lab 14's <Code>.post()</Code>, just one layer up.
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
        underneath, and nothing else about the class changes.
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
