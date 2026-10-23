import { Heading, Link, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab12Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">The instruction that never goes away</Heading>
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
    print(f"{turn['speaker']}: {turn['text']}")`} />
      <Text>
        Nothing fancy here - just a list, where each entry is a dict with a couple of fixed keys.
      </Text>
      <Text>Here is what each line does, with the real values:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A <b>list</b> is an ordered row of things, written in square brackets. A <b>dict</b> is
          a small table of labels and values, written in curly braces. A label is called a{" "}
          <b>key</b>. For example, <Code>{'{"speaker": "Sam"}'}</Code> has the key{" "}
          <Code>"speaker"</Code> and the value <Code>"Sam"</Code>.
        </ListItem>
        <ListItem>
          <Code>chat_log</Code> is a list with 3 dicts inside. Each dict is one turn in the chat.
        </ListItem>
        <ListItem>
          <Code>for turn in chat_log</Code> visits the dicts one by one. On the first pass{" "}
          <Code>turn</Code> is the Sam dict. On the second pass it is the Robin dict. On the third
          pass it is the Sam dict again.
        </ListItem>
        <ListItem>
          <Code>turn['speaker']</Code> reads the value for the key <Code>"speaker"</Code>, which is{" "}
          <Code>"Sam"</Code> on the first pass. <Code>turn['text']</Code> reads{" "}
          <Code>"running late, sorry!"</Code>.
        </ListItem>
        <ListItem>
          The <Code>f</Code> before the quote marks makes an <b>f-string</b>. Whatever is inside{" "}
          <Code>{"{...}"}</Code> is replaced by its value. So the first line printed is{" "}
          <Code>Sam: running late, sorry!</Code>. Then <Code>Robin: no worries, see you soon</Code>
          , then <Code>Sam: be there in 5</Code>.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`support_log = [
    {"agent": "Bot", "message": "Hi, how can I help?"},
    {"agent": "User", "message": "My order is late."},
    {"agent": "Bot", "message": "Let me check that for you."},
]

for turn in support_log:
    print(f"{turn['agent']}: {turn['message']}")
# expected output:
# Bot: Hi, how can I help?
# User: My order is late.
# Bot: Let me check that for you.`}
      </Code>
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

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The API's <Code>messages</Code> list works exactly the same way, except each dict has a{" "}
        <Code>"role"</Code> key (instead of <Code>"speaker"</Code>) and a <Code>"content"</Code>{" "}
        key (instead of <Code>"text"</Code>): <Code>{'{"role": "user", "content": "..."}'}</Code>,{" "}
        <Code>{'{"role": "assistant", "content": "..."}'}</Code>, and so on. Every lab in this
        course that talks to Groq is, underneath, just building one of these lists.
      </Text>
      <Text>A tiny messages list, with two turns, looks like this:</Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`messages = [
    {"role": "user", "content": "Hi"},
    {"role": "assistant", "content": "Hello!"},
]
print(messages[1]["content"])  # Hello!`}
      </Code>
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

      <Text color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`classroom_log = [
    {"role": "teacher_note", "text": "Keep answers under two sentences."},
    {"role": "student", "text": "What's the capital of France?"},
    {"role": "helper", "text": "Paris."},
]

standing_rule = classroom_log[0]["text"]
print(standing_rule)  # expected output: Keep answers under two sentences.`}
      </Code>
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

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This lab's <Code>build_system_message(persona)</Code> builds exactly that pinned,
        standing message: given a dict like{" "}
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
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`lines = [
    f"You are {persona['name']}, {persona['role']}.",
    f"Your tone is {persona['tone']}.",
    "Rules you must always follow:",
]
lines += [f"- {c}" for c in persona["constraints"]]
return "\\n".join(lines)`}
      </Code>
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
    print(f"{greeting} ({visitor})")`} />
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

      <Text color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`discount = "SAVE10"                      # built once
for cart_total in [25, 40, 100]:          # varies every iteration
    print(f"Applying {discount} to \${cart_total}")
# expected output:
# Applying SAVE10 to $25
# Applying SAVE10 to $40
# Applying SAVE10 to $100`}
      </Code>
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

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The real-world project cell builds <Code>system_message</Code> from the persona{" "}
        <b>once</b>, then loops over four very different user questions - a brewing tip, a stock
        question, a complaint, and a question about a competitor - sending a fresh two-message list
        each time:
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
{`system_message = build_system_message(persona)   # built once
for question in QUESTIONS:                       # varies every iteration
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": question},
    ]
    reply = call_groq(messages)`}
      </Code>
      <Text>
        <Code>system_message</Code> never changes across the loop, while <Code>question</Code>{" "}
        changes every time - that's why the model keeps calling itself "Rae," keeps a warm and
        concise tone, and never mentions a competitor, no matter which of the four unrelated
        questions it's answering. This is the same idea as a chatbot "remembering" its persona
        across an entire conversation: the persistent piece isn't memory in any deep sense, it's
        just the same system message being resent, unchanged, on every single call.
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
