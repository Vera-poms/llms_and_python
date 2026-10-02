import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab13Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Putting it together</Heading>
      <Text>
        This lab combines everything from 8-12 into one real thing: a persistent, persona-driven
        chatbot built from your own bio - a "digital twin". Three ordinary Python ideas do all the
        work: a list that keeps growing, a loop that alternates between two actions, and a string
        built up from a dict. None of them are LLM-specific - the LLM part is just what you plug
        into them.
      </Text>

      <Heading size="sm">Idea 1: state is just a list that keeps growing</Heading>
      <Text>
        "State" sounds abstract until you notice you already use it every day.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Imagine a shopping list on your phone. You never erase it between items - you just keep
        appending:
      </Text>
      <RunnableExample labId={13} code={`shopping_list = []
shopping_list.append("milk")
shopping_list.append("eggs")
print(shopping_list)  # ["milk", "eggs"]`} />
      <Text>
        By the time you're at the register, the list holds every item you added, in order - that's
        the entire idea of "state": a value that persists and accumulates across separate actions,
        instead of being thrown away after each one.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has an "Idea 1 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`readings = []
readings.append(68)
readings.append(71)
print(readings)  # expected output: [68, 71]`}
      </Code>
      <PracticeCell labId={13} cellId="concept-1" code={`readings = []
readings.append(68)
readings.append(71)
print(readings)  # expected output: [68, 71]`} expectedOutput={`[68, 71]`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        A chatbot's "memory" is the exact same trick, just with dicts instead of strings. Each
        turn - what the user said, what the model replied - gets appended as one more entry:{" "}
        <Code>{`{"role": "user", "content": "..."}`}</Code> or{" "}
        <Code>{`{"role": "assistant", "content": "..."}`}</Code>. The <Code>messages</Code> list in
        this lab's notebook is exactly that shopping list, and it's why the model can "remember"
        earlier turns - it isn't remembering anything at all, it's just being handed the whole
        growing list again on every call.
      </Text>

      <Heading size="sm">Idea 2: a loop that alternates between two actions</Heading>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        A simple check-in desk logs each visitor and immediately updates its log before the next
        person walks up:
      </Text>
      <RunnableExample labId={13} code={`log = []
for visitor in ["Alice", "Bob"]:
    log.append(f"{visitor} checked in")
print(log)`} />
      <Text>
        Each visitor gets appended to <Code>log</Code> one at a time, and by the end the log holds
        one entry per visitor, in the order they arrived - one action (a visitor arrives), one
        update (append), repeat.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has an "Idea 2 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`deliveries = []
for package in ["P100", "P101"]:
    deliveries.append(f"{package} delivered")
print(deliveries)  # expected output: ['P100 delivered', 'P101 delivered']`}
      </Code>
      <PracticeCell labId={13} cellId="concept-2" code={`deliveries = []
for package in ["P100", "P101"]:
    deliveries.append(f"{package} delivered")
print(deliveries)  # expected output: ['P100 delivered', 'P101 delivered']`} expectedOutput={`['P100 delivered', 'P101 delivered']`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
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
        running once per message you send.
      </Text>

      <Heading size="sm">Idea 3: building a prompt is just string interpolation</Heading>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        A mail-merge letter template fills in blanks from a record:
      </Text>
      <RunnableExample labId={13} code={`name = "Priya"
city = "Austin"
letter = f"Dear {name}, welcome to {city}!"`} />
      <Text>
        <Code>name</Code> and <Code>city</Code> get dropped straight into the string wherever the
        curly braces are - that's the entire mechanism behind an f-string, no matter how long the
        template gets.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has an "Idea 3 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`person = {"name": "Sam", "occasion": "graduation"}
card = f"Congrats {person['name']} on your {person['occasion']}!"
print(card)  # expected output: Congrats Sam on your graduation!`}
      </Code>
      <PracticeCell labId={13} cellId="concept-3" code={`person = {"name": "Sam", "occasion": "graduation"}
card = f"Congrats {person['name']} on your {person['occasion']}!"
print(card)  # expected output: Congrats Sam on your graduation!`} expectedOutput={`Congrats Sam on your graduation!`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>build_digital_twin_system_prompt(profile)</Code> does the same thing at a larger
        scale: it pulls <Code>name</Code>, <Code>role</Code>, <Code>tone</Code>,{" "}
        <Code>facts</Code>, and <Code>boundaries</Code> out of a plain dict and interpolates them
        into a block of instruction text with f-strings and a list comprehension, then joins the
        lines with <Code>"\n".join(...)</Code>. There's no special "prompt-writing" mechanism here
        at all - it's the same string-building you'd use for a form letter, just aimed at a system
        prompt instead of an envelope.
      </Text>

      <Heading size="sm">Notebook - needs a free Groq API key</Heading>
      <Text>
        Open <Code>course/notebooks/lab_13_digital_twin.ipynb</Code>. Implement{" "}
        <Code>build_digital_twin_system_prompt(profile)</Code>. The project has you fill in a{" "}
        <Code>my_profile</Code> dict with your own real name, role, facts, and boundaries, then
        runs a real multi-turn conversation against it - your own working digital twin.
      </Text>

      <Heading size="sm">Further reading</Heading>
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
    </VStack>
  );
}
