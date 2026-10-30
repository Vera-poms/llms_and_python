import { Heading, Link, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab17Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">The context window: three Python ideas behind a twin's working memory</Heading>
      <Text>
        A model can only look at a limited amount of text on each call. That limit is its{" "}
        <b>context window</b>, and it is counted in <b>tokens</b> (small pieces of text, a bit
        shorter than a word on average). Everything you send has to fit inside it: the system
        message, the chat so far, any extra document text and the new question. The model's reply
        needs room too. In week 1 your twin sent its whole <Code>messages</Code> list every time.
        When the chat gets long, something has to go. Three ordinary Python ideas decide what.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <b>Measuring size</b> - a quick rule of thumb with <Code>len</Code> and whole-number division
        </ListItem>
        <ListItem>
          <b>Looping from the end</b> - newest first, and stopping early with <Code>break</Code>
        </ListItem>
        <ListItem>
          <b>Building a new list</b> - keeping the original safe
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Idea 1: measuring size with a rule of thumb</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Counting real tokens needs the model's own tokenizer. A cheap guess works well enough for
        planning: in English, about 4 characters make 1 token. To turn a character count into a
        guess, divide by 4. The <Code>//</Code> operator divides and drops the fraction, so{" "}
        <Code>7 // 2</Code> is 3, not 3.5.
      </Text>
      <RunnableExample labId={17} code={`text = "What do you cook?"
print(len(text))          # 17
print(len(text) // 4)     # 4
print(len(text) // 4 + 1) # 5
print(7 // 2, 7 / 2)      # 3 3.5`} />
      <Text>Here is what each line does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>len(text)</Code> counts every character, spaces and the question mark included: 17.
        </ListItem>
        <ListItem>
          <Code>len(text) // 4</Code> is 17 divided by 4 with the fraction dropped: 4.
        </ListItem>
        <ListItem>
          Adding 1 makes sure even a one-letter message costs at least 1 token. So the guess is 5.
        </ListItem>
        <ListItem>
          The last line shows the difference between <Code>//</Code> (3) and <Code>/</Code> (3.5).
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has an "Idea 1 practice" cell for this - run it before moving on.
      </Text>
      <PracticeCell labId={17} cellId="concept-1" code={`text = "Hello! How can I help you today?"
print(len(text))           # expected output: 32
print(len(text) // 4 + 1)  # expected output: 9`} expectedOutput={`32
9`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>len(text)</Code> counts 32 characters in the sentence.
        </ListItem>
        <ListItem>
          <Code>32 // 4</Code> is 8, and adding 1 gives 9. That is the token guess for this message.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>32</Code> and then <Code>9</Code>. Try a shorter text such
        as <Code>"Hi"</Code>. The guess is 1, because <Code>2 // 4</Code> is 0 and the extra 1 is
        what keeps it from being free.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: what the context window is</Heading>
      <Text>
        The model does not remember your chat. Each time you call it, it sees only the text you send in that one call. The size of that text is limited by the <b>context window</b>, counted in tokens.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Everything you send counts: the system message, the chat so far and the new question.
        </ListItem>
        <ListItem>
          The reply counts too. The model needs room to write it.
        </ListItem>
        <ListItem>
          So the window has to hold your input and the reply together. Text that does not fit is simply not there for the model.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. Two small functions measure a chat. One guesses the cost of a text. The other adds up the cost of every message. A loop then checks the chat against two window sizes, and keeps 5 tokens free for the reply.
      </Text>
      <RunnableExample labId={17} code={`def count_tokens(text):
    return len(text) // 4 + 1


def total_tokens(messages):
    total = 0
    for message in messages:
        total = total + count_tokens(message["content"])
    return total


chat = [
    {"role": "system", "content": "You are Ada's digital twin."},
    {"role": "user", "content": "What do you cook?"},
    {"role": "assistant", "content": "Bread and spicy soup."},
]
reply_room = 5
for window in (30, 12):
    room = window - reply_room
    used = total_tokens(chat)
    print("window", window, "-> input room", room, "used", used, "fits:", used <= room)`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>count_tokens</Code> is the rule of thumb from above: characters divided by 4, plus 1. <Code>total_tokens</Code> loops over the messages and adds up the cost of each <Code>message["content"]</Code>. This chat costs 18 tokens.
        </ListItem>
        <ListItem>
          Window 30 minus 5 for the reply leaves 25 for the input. The chat is 18, so it fits.
        </ListItem>
        <ListItem>
          Window 12 minus 5 leaves only 7. The chat is 18, so it does not fit. The same chat fits one model and not another, so measure before you send.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on a new chat, with windows of 40 and 20 tokens and 8 tokens kept for the reply.
      </Text>
      <PracticeCell labId={17} cellId="topic-1" code={`def count_tokens(text):
    return len(text) // 4 + 1


def total_tokens(messages):
    total = 0
    for message in messages:
        total = total + count_tokens(message["content"])
    return total


chat = [
    {"role": "system", "content": "You are Kofi's digital twin."},
    {"role": "user", "content": "Where do you teach maths?"},
    {"role": "assistant", "content": "At a school in Kumasi, on Fridays."},
]
reply_room = 8
for window in (40, 20):
    room = window - reply_room
    used = total_tokens(chat)
    print("window", window, "-> input room", room, "used", used, "fits:", used <= room)`} expectedOutput={`window 40 -> input room 32 used 24 fits: True
window 20 -> input room 12 used 24 fits: False`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>total_tokens</Code> adds up the cost of the three messages. The chat costs 24 tokens.
        </ListItem>
        <ListItem>
          Window 40 minus 8 leaves 32 for the input. 24 is within 32, so <Code>True</Code>.
        </ListItem>
        <ListItem>
          Window 20 minus 8 leaves 12. 24 is over 12, so <Code>False</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>window 40 -&gt; input room 32 used 24 fits: True</Code>, then <Code>window 20 -&gt; input room 12 used 24 fits: False</Code>. The chat did not change. Only the window did.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        The lab's <Code>count_tokens</Code> is exactly this one line. A message in the chat is a dict with a <Code>"content"</Code> text, so the cost of a message is <Code>count_tokens(message["content"])</Code>. The cost of the whole history is the sum of those costs.
      </Text>
      <Text>
        In the project, Step 1 adds this up for <Code>CHAT_HISTORY</Code>. Its 9 messages cost 101 tokens. That is the size you have to bring down. This is a guess, not the real count. Real apps use the model's own tokenizer and keep a safety margin, but the planning logic is identical.
      </Text>

      <Heading as="h3" size="sm">Idea 2: looping from the end, and stopping early</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        <Code>reversed(items)</Code> walks a list from the last item to the first, without changing
        the list. <Code>break</Code> ends a loop on the spot, even if items are left.
      </Text>
      <RunnableExample labId={17} code={`turns = ["first", "second", "third", "fourth"]
for turn in reversed(turns):
    print(turn)
    if turn == "third":
        break`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The loop starts at the end, so the first <Code>turn</Code> is <Code>fourth</Code>. It is
          printed.
        </ListItem>
        <ListItem>
          The next one is <Code>third</Code>. It is printed, and then the <Code>if</Code> is true, so{" "}
          <Code>break</Code> ends the loop.
        </ListItem>
        <ListItem>
          <Code>second</Code> and <Code>first</Code> are never visited.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has an "Idea 2 practice" cell for this - run it before moving on.
      </Text>
      <PracticeCell labId={17} cellId="concept-2" code={`costs = [5, 3, 9, 5]
budget = 15
used = 0
for cost in reversed(costs):
    if used + cost > budget:
        break
    used += cost
print(used)  # expected output: 14`} expectedOutput={`14`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>used</Code> starts at 0. The loop looks at the costs from the end: 5, 9, 3, 5.
        </ListItem>
        <ListItem>
          First 5: <Code>0 + 5</Code> is not over 15, so <Code>used</Code> becomes 5.
        </ListItem>
        <ListItem>
          Then 9: <Code>5 + 9</Code> is 14, still fine. <Code>used</Code> becomes 14.
        </ListItem>
        <ListItem>
          Then 3: <Code>14 + 3</Code> is 17, over 15. <Code>break</Code> ends the loop on the spot.
          The 5 at the very start of the list is never looked at. The loop stops at the first miss.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>14</Code>. Try changing <Code>budget</Code> to 20. The
        loop adds 5, 9 and 3 (17) and then 5 more (22 is over 20), so you still get 17.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: why the oldest turns are forgotten</Heading>
      <Text>
        Because the model sees only what you send, anything you leave out is gone for it. It does not forget on purpose. Your code decides what it still knows.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          When the chat is too long for the window, something has to be dropped.
        </ListItem>
        <ListItem>
          The oldest turns go first. The newest turns are the ones the current question is about.
        </ListItem>
        <ListItem>
          If a dropped turn held a fact, such as the user's name, the model can no longer answer questions about it.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. A chat has four turns, and the first one tells the model the user's name. A small function walks from the newest turn and counts how many turns fit in a budget. A loop tries two budgets and checks if the name turn survived.
      </Text>
      <RunnableExample labId={17} code={`def count_tokens(text):
    return len(text) // 4 + 1


def count_kept(turns, budget):
    used = 0
    kept = 0
    for turn in reversed(turns):
        used = used + count_tokens(turn)
        if used > budget:
            break
        kept = kept + 1
    return kept


turns = ["My name is Ada.", "I live in Accra.", "I bake bread on Sundays.", "What is my name?"]
for budget in (30, 12):
    kept = count_kept(turns, budget)
    seen = turns[len(turns) - kept:]
    print("budget", budget, "-> sees", kept, "turns, knows the name:", "My name is Ada." in seen)`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The four turns cost 4, 5, 7 and 5 tokens, 21 in all. <Code>count_kept</Code> starts at the newest turn and adds costs until the budget is passed. Then <Code>break</Code> stops it.
        </ListItem>
        <ListItem>
          With a budget of 30 all 4 turns fit, so the model still knows the name.
        </ListItem>
        <ListItem>
          With a budget of 12, only the newest two fit (5 + 7 = 12). The name turn is cut, so <Code>What is my name?</Code> has no answer left in the prompt. Memory is whatever your code keeps.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on a new chat, with budgets of 22 and 10 tokens.
      </Text>
      <PracticeCell labId={17} cellId="topic-2" code={`def count_tokens(text):
    return len(text) // 4 + 1


def count_kept(turns, budget):
    used = 0
    kept = 0
    for turn in reversed(turns):
        used = used + count_tokens(turn)
        if used > budget:
            break
        kept = kept + 1
    return kept


turns = ["I am Kofi.", "I teach maths in Kumasi.", "I code at night.", "Where do I teach?"]
for budget in (22, 10):
    kept = count_kept(turns, budget)
    seen = turns[len(turns) - kept:]
    print("budget", budget, "-> sees", kept, "turns, knows the town:", "I teach maths in Kumasi." in seen)`} expectedOutput={`budget 22 -> sees 4 turns, knows the town: True
budget 10 -> sees 2 turns, knows the town: False`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The four turns cost 3, 7, 5 and 5 tokens.
        </ListItem>
        <ListItem>
          Budget 22: from the newest, 5 + 5 + 7 + 3 = 20. Nothing goes over, so all 4 turns are seen and the town is known.
        </ListItem>
        <ListItem>
          Budget 10: 5 + 5 = 10 fits. Adding 7 makes 17, over 10, so the loop breaks. Only 2 turns are seen, and the turn with the town is lost.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>budget 22 -&gt; sees 4 turns, knows the town: True</Code>, then <Code>budget 10 -&gt; sees 2 turns, knows the town: False</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        Which turns should the twin keep? The newest ones, because the last few messages are what the question is about. So the lab walks the history from the end, adds each message while it fits, and stops at the first one that does not.
      </Text>
      <Text>
        Why stop instead of skipping the big message and carrying on?
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A chat is a story. If you drop turn 4 but keep turn 3 and turn 5, the twin sees an answer with no question and gets confused.
        </ListItem>
        <ListItem>
          Stopping at the first miss keeps the kept messages in one unbroken run, ending at the newest.
        </ListItem>
        <ListItem>
          The system message is the exception. It says who the twin is, so it is always kept and its cost is counted first.
        </ListItem>
      </UnorderedList>
      <Text>
        With the budget of 60, the project keeps the system message and the newest 4 messages, 5 in all. The 4 oldest chat messages are dropped. The first kept chat message is <Code>And what does she do for fun?</Code>, a question, so the run still starts cleanly.
      </Text>

      <Heading as="h3" size="sm">Idea 3: building a new list, leaving the old one alone</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        A slice always makes a <b>new</b> list. So does adding two lists with <Code>+</Code>. Your
        original stays as it was. A method like <Code>.reverse()</Code> is different: it flips the
        list it is called on, in place.
      </Text>
      <RunnableExample labId={17} code={`old = ["a", "b"]
new = old + ["c"]
print(old)  # ['a', 'b']
print(new)  # ['a', 'b', 'c']

newest_first = ["z", "y", "x"]
newest_first.reverse()
print(newest_first)  # ['x', 'y', 'z']`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>old + ["c"]</Code> builds a third list. <Code>old</Code> is untouched, which is why
          it still prints <Code>['a', 'b']</Code>.
        </ListItem>
        <ListItem>
          <Code>newest_first.reverse()</Code> changes <Code>newest_first</Code> itself. That is fine
          here because it is a list we built ourselves.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has an "Idea 3 practice" cell for this - run it before moving on.
      </Text>
      <PracticeCell labId={17} cellId="concept-3" code={`history = ["system", "hi", "hello", "bye"]
system = history[:1]
rest = history[1:]
trimmed = system + rest[-2:]
print(trimmed)  # expected output: ['system', 'hello', 'bye']
print(history)  # expected output: ['system', 'hi', 'hello', 'bye']`} expectedOutput={`['system', 'hello', 'bye']
['system', 'hi', 'hello', 'bye']`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>history[:1]</Code> is a list with just the first item: <Code>['system']</Code>.{" "}
          <Code>history[1:]</Code> is everything after it.
        </ListItem>
        <ListItem>
          <Code>rest[-2:]</Code> takes the last 2 items of <Code>rest</Code>: <Code>hello</Code> and{" "}
          <Code>bye</Code>.
        </ListItem>
        <ListItem>
          <Code>system + rest[-2:]</Code> joins them into a new list. <Code>history</Code> is never
          changed, so the last line still shows all four items.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> the short list, then the full original. Try{" "}
        <Code>rest[-1:]</Code>. You keep only <Code>bye</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: leave room for the reply</Heading>
      <Text>
        The window holds the reply as well as your input. So the budget for your input is smaller than the window.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          If the window is 8,000 tokens and you want up to 1,000 tokens of answer, your budget for the input is 7,000.
        </ListItem>
        <ListItem>
          <b>Summarize instead of dropping.</b> Before throwing away old turns, ask the model to write a two-line summary of them and keep that. The twin remembers the gist for a few tokens.
        </ListItem>
        <ListItem>
          <b>Watch the middle.</b> Models tend to use the start and the end of a long prompt better than the middle, so put the most important text at those two places.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. A chat of 6,500 tokens is sent to a model with a window of 8,000. Two small functions work out the input budget and check the chat against it. A loop tries three sizes of reply.
      </Text>
      <RunnableExample labId={17} code={`def input_budget(window, reply):
    return window - reply


def fits(history_tokens, window, reply):
    return history_tokens <= input_budget(window, reply)


window = 8000
history_tokens = 6500
for reply in (500, 1000, 2000):
    print("reply", reply, "-> input budget", input_budget(window, reply), "fits:", fits(history_tokens, window, reply))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>input_budget</Code> is the window minus the room kept for the reply. <Code>fits</Code> checks that the chat is within it.
        </ListItem>
        <ListItem>
          A reply of 500 leaves 7,500, and one of 1,000 leaves 7,000. The chat of 6,500 fits both.
        </ListItem>
        <ListItem>
          A reply of 2,000 leaves 6,000, and the same chat no longer fits. A longer answer means less room for the history.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions with a window of 4,000, a chat of 3,200 tokens and replies of 300, 800 and 1,200.
      </Text>
      <PracticeCell labId={17} cellId="topic-3" code={`def input_budget(window, reply):
    return window - reply


def fits(history_tokens, window, reply):
    return history_tokens <= input_budget(window, reply)


window = 4000
history_tokens = 3200
for reply in (300, 800, 1200):
    print("reply", reply, "-> input budget", input_budget(window, reply), "fits:", fits(history_tokens, window, reply))`} expectedOutput={`reply 300 -> input budget 3700 fits: True
reply 800 -> input budget 3200 fits: True
reply 1200 -> input budget 2800 fits: False`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Reply 300: the input budget is 4,000 minus 300, which is 3,700. The chat of 3,200 fits.
        </ListItem>
        <ListItem>
          Reply 800: the budget is 3,200. The chat is exactly 3,200, which is not over, so it still fits.
        </ListItem>
        <ListItem>
          Reply 1,200: the budget is 2,800. The chat is over it, so it does not fit.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> three lines. The first two end in <Code>fits: True</Code> and the third in <Code>fits: False</Code>. The history stayed the same, and only the reply allowance changed.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>trim_messages</Code> must give back a new list. Your real chat history keeps growing and may be saved for later, so trimming the copy you send must never delete from the original. The function splits off the system message with a slice, collects the kept messages in a fresh list, flips that list so the oldest kept message is first again, and gives back <Code>system + kept</Code>.
      </Text>
      <Text>
        In the project, <Code>CHAT_HISTORY</Code> still has 9 messages after the call, while <Code>trimmed</Code> has 5 and costs 59 tokens. This lab does not build the reply allowance. The budget of 60 is the whole budget for the input. A real app would subtract the reply room first, as in the example above.
      </Text>

      <Heading as="h3" size="sm">Further reading</Heading>
      <Text>
        Anthropic:{" "}
        <Link href="https://docs.claude.com/en/docs/build-with-claude/context-windows" isExternal color="blue.500">
          Context windows
        </Link>
      </Text>
      <Text>
        Liu et al.:{" "}
        <Link href="https://arxiv.org/abs/2307.03172" isExternal color="blue.500">
          Lost in the Middle: How Language Models Use Long Contexts
        </Link>
      </Text>
    </VStack>
  );
}
