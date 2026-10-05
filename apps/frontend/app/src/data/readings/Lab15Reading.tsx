import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab15Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">The capstone</Heading>
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        In lab 13, <Code>messages</Code> was a loose variable sitting outside any object, and you
        were responsible for appending to it correctly at each step. <Code>GroqClient</Code> moves
        that same list <i>inside</i> the object as <Code>self.messages</Code>, so the object is
        responsible for its own history instead of you being responsible for it.
      </Text>

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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>GroqClient.add_user_message</Code> and <Code>add_assistant_message</Code> are exactly
        this: each is a one-line method whose entire job is "append the right dict to{" "}
        <Code>self.messages</Code>". <Code>send(user_text)</Code> then composes them into one
        higher-level step: add the user message, call the transport, add the reply, return it. You
        call <Code>client.send("hi")</Code> once instead of repeating three lines of bookkeeping at
        every call site - the exact same win as lab 14's <Code>.post()</Code>, just one layer up.
      </Text>

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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
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

      <Heading as="h3" size="sm">Notebook - needs a free Groq API key for the project only</Heading>
      <Text>
        Open <Code>course/notebooks/lab_15_groq_client.ipynb</Code>. Implement{" "}
        <Code>GroqClient</Code>: <Code>add_user_message</Code>, <Code>add_assistant_message</Code>,{" "}
        <Code>send()</Code>, <Code>reset()</Code>, and a <Code>history</Code> property. The
        exercise's asserts run entirely offline via a fake transport. The project then rebuilds
        lab 13's digital twin on top of the finished class with a real transport, and prints the
        full messages list at the end - the messages list, in depth, for real.
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
