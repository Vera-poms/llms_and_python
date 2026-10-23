import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab13Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">Putting it together</Heading>
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
print(shopping_list)  # ["milk", "eggs"]`} />
      <Text>
        By the time you're at the register, the list holds every item you added, in order - that's
        the entire idea of "state": a value that persists and accumulates across separate actions,
        instead of being thrown away after each one.
      </Text>
      <Text>Here is what each line does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>shopping_list = []</Code> makes an empty <b>list</b>. A list is an ordered row of
          things in square brackets. This one has nothing in it yet.
        </ListItem>
        <ListItem>
          <Code>.append("milk")</Code> adds one item to the end. The list is now{" "}
          <Code>["milk"]</Code>.
        </ListItem>
        <ListItem>
          <Code>.append("eggs")</Code> adds to the end again. The list is now{" "}
          <Code>["milk", "eggs"]</Code>. The old item is still there. Nothing was erased.
        </ListItem>
        <ListItem>
          <Code>print(shopping_list)</Code> shows both items, in the order they were added.
        </ListItem>
      </UnorderedList>

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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
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
      <Text fontSize="sm">
        <b>What you should see:</b> <Code>[68, 71]</Code>. Try adding a third line,{" "}
        <Code>readings.append(75)</Code>, before the print. You should see{" "}
        <Code>[68, 71, 75]</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        A chatbot's "memory" is the exact same trick, just with dicts instead of strings. Each
        turn - what the user said, what the model replied - gets appended as one more entry:{" "}
        <Code>{`{"role": "user", "content": "..."}`}</Code> or{" "}
        <Code>{`{"role": "assistant", "content": "..."}`}</Code>. The <Code>messages</Code> list in
        this lab's notebook is exactly that shopping list, and it's why the model can "remember"
        earlier turns - it isn't remembering anything at all, it's just being handed the whole
        growing list again on every call.
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
print(log)`} />
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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
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
      <Text fontSize="sm">
        <b>What you should see:</b> <Code>['P100 delivered', 'P101 delivered']</Code>. Try adding{" "}
        <Code>"P102"</Code> to the list of packages. You should get a third item at the end.
      </Text>

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
        running once per message you send.
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
letter = f"Dear {name}, welcome to {city}!"`} />
      <Text>
        <Code>name</Code> and <Code>city</Code> get dropped straight into the string wherever the
        curly braces are - that's the entire mechanism behind an f-string, no matter how long the
        template gets.
      </Text>
      <Text>Here is what each line does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>name</Code> holds the text <Code>"Priya"</Code>. <Code>city</Code> holds{" "}
          <Code>"Austin"</Code>. A piece of text in quote marks is called a <b>string</b>.
        </ListItem>
        <ListItem>
          The <Code>f</Code> in front of the quote marks turns on the blanks. Each{" "}
          <Code>{"{name}"}</Code> is a blank that Python fills with the value of that variable.
        </ListItem>
        <ListItem>
          So <Code>letter</Code> becomes <Code>"Dear Priya, welcome to Austin!"</Code>. Change{" "}
          <Code>name</Code> to <Code>"Sam"</Code> and the letter says "Dear Sam" with no other
          edit.
        </ListItem>
      </UnorderedList>

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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
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
      <Text fontSize="sm">
        <b>What you should see:</b> <Code>Congrats Sam on your graduation!</Code>. Try changing{" "}
        <Code>"graduation"</Code> to <Code>"promotion"</Code>. The card should say "on your
        promotion!".
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>build_digital_twin_system_prompt(profile)</Code> does the same thing at a larger
        scale: it pulls <Code>name</Code>, <Code>role</Code>, <Code>tone</Code>,{" "}
        <Code>facts</Code>, and <Code>boundaries</Code> out of a plain dict and interpolates them
        into a block of instruction text with f-strings and a list comprehension, then joins the
        lines with <Code>"\n".join(...)</Code>. There's no special "prompt-writing" mechanism here
        at all - it's the same string-building you'd use for a form letter, just aimed at a system
        prompt instead of an envelope.
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
    </VStack>
  );
}
