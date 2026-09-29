import { Code, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab12Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">The instruction that never goes away</Heading>
      <Text>
        A system message sits at the front of the messages list and shapes every reply for the
        rest of the conversation, independent of whatever the user asks - it's how you give a
        model a persona, a role, boundaries, or a house style once instead of repeating it every
        turn.
      </Text>

      <Heading size="sm">Concept: a list of dicts as a conversation</Heading>
      <Text>
        Before looking at the "system" role specifically, it helps to see what a conversation
        even <i>is</i> in code.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
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

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The API's <Code>messages</Code> list works exactly the same way, except each dict has a{" "}
        <Code>"role"</Code> key (instead of <Code>"speaker"</Code>) and a <Code>"content"</Code>{" "}
        key (instead of <Code>"text"</Code>): <Code>{'{"role": "user", "content": "..."}'}</Code>,{" "}
        <Code>{'{"role": "assistant", "content": "..."}'}</Code>, and so on. Every lab in this
        course that talks to Groq is, underneath, just building one of these lists.
      </Text>

      <Heading size="sm">Concept: the "system" role vs. "user"/"assistant"</Heading>
      <Text>
        Not every entry in that list is a "turn" someone took - one role is different from the
        rest.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
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

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This lab's <Code>build_system_message(persona)</Code> builds exactly that pinned,
        standing message: given a dict like{" "}
        <Code>{'{"name": "Rae", "role": "...", "tone": "...", "constraints": [...]}'}</Code>, it
        returns one string stating the assistant's name, role, and tone, plus each constraint as
        its own bullet line - a single block of text meant to sit at{" "}
        <Code>messages[0]</Code> with <Code>"role": "system"</Code>, ahead of anything the user
        says.
      </Text>

      <Heading size="sm">Concept: state that stays fixed while the conversation varies</Heading>
      <Text>
        Once you have a system message, the interesting part is what happens when you reuse it
        across many different requests.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
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

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The real-world project cell builds <Code>system_message</Code> from the persona{" "}
        <b>once</b>, then loops over four very different user questions - a brewing tip, a stock
        question, a complaint, and a question about a competitor - sending a fresh two-message list
        each time:
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
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

      <Heading size="sm">Notebook - needs a free Groq API key</Heading>
      <Text>
        Open <Code>course/notebooks/lab_12_system_instructions.ipynb</Code>. Implement{" "}
        <Code>build_system_message(persona)</Code>, templating a persona dict (name, role, tone,
        constraints) into a system prompt. The project uses one persona across several very
        different user questions to spot-check that the instruction actually holds. Sets up lab
        13's digital twin.
      </Text>

      <Heading size="sm">Further reading</Heading>
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
