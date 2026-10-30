import { Heading, Link, OrderedList, UnorderedList, VStack } from "@chakra-ui/react";
import { Code, ListItem, Text } from "../../components/prose";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab09Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">Zero-shot prompting and your first API call</Heading>
      <Text>
        <b>Zero-shot</b> means asking the model to do a task with no worked examples first - just an
        instruction, like "classify the sentiment of this review" with no sample reviews shown
        beforehand. It's the plainest possible way to prompt a model: a system instruction
        (optional) plus one user message, and nothing else to prime it. It works surprisingly well
        for tasks a model saw a lot of during training, like sentiment classification, because the
        model has already learned the pattern - it just needs to be told which pattern to apply.
      </Text>
      <Text>
        This lab makes your first real HTTP call to Groq's free API - the concrete shape of the 5
        universal API components lab 14 names explicitly:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          <b>Endpoint</b> - <Code>https://api.groq.com/openai/v1/chat/completions</Code>
        </ListItem>
        <ListItem>
          <b>Method</b> - <Code>POST</Code>
        </ListItem>
        <ListItem>
          <b>Headers</b> - <Code>Authorization: Bearer &lt;key&gt;</Code>
        </ListItem>
        <ListItem>
          <b>Body</b> - <Code>{"{model, messages, temperature}"}</Code>
        </ListItem>
        <ListItem>
          <b>Response</b> - the reply text lives at{" "}
          <Code>response["choices"][0]["message"]["content"]</Code>
        </ListItem>
      </OrderedList>
      <Text>
        The rest of this reading explains, from scratch, the three plain-Python ideas this rests on:
        making an HTTP request, keeping secrets out of your code with environment variables, and
        reading a JSON response.
      </Text>

      <Heading as="h2" size="md">Making an HTTP request from Python</Heading>
      <Text>
        Every website and API you've ever used works the same basic way: your computer sends a{" "}
        <b>request</b> somewhere on the internet, and gets back a <b>response</b>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        The <Code>requests</Code> library is the standard tool for doing this yourself, instead of
        through a browser:
      </Text>
      <RunnableExample labId={9} code={`import requests

response = requests.get("https://api.github.com/repos/python/cpython")
data = response.json()
print(data["stargazers_count"])`} />
      <Text>
        That's a <Code>GET</Code> request - "give me some information." A <Code>POST</Code> request
        is used instead when you need to send data along with the request, not just ask for it.
      </Text>

      <Text>Here is what each line of that example does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>import requests</Code> loads a toolbox (a <b>library</b>) that knows how to talk to
          websites. Someone else wrote it, so you do not have to.
        </ListItem>
        <ListItem>
          <Code>requests.get("https://api.github.com/...")</Code> sends a request to that web
          address. An <b>API</b> is a web address made for programs to talk to, not people. GitHub's
          computer sends an answer back, and Python keeps it in <Code>response</Code>.
        </ListItem>
        <ListItem>
          <Code>response.json()</Code> turns the answer text into a Python dict (a table of labels
          and values). JSON is explained further down.
        </ListItem>
        <ListItem>
          <Code>data["stargazers_count"]</Code> picks one value out of the dict: the number of
          stars people have given that project. A star is like a "like" button.
        </ListItem>
      </UnorderedList>
      <Text>
        Think of <Code>GET</Code> like reading a notice board: you only look. Think of{" "}
        <Code>POST</Code> like putting a letter in a post box: you hand something over, and the
        other side answers it. Your chat message to the model is that letter.
      </Text>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell making a GET request to a different API -
        run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`import requests

response = requests.get("https://api.github.com/repos/psf/requests")
data = response.json()
print(data["language"])  # expected output: Python`}
      </Code>
      <PracticeCell labId={9} cellId="concept-1" code={`import requests

response = requests.get("https://api.github.com/repos/psf/requests")
data = response.json()
print(data["language"])  # expected output: Python`} expectedOutput={`Python`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>requests.get(...)</Code> asks GitHub for information about the project called{" "}
          <Code>psf/requests</Code>. This needs an internet connection.
        </ListItem>
        <ListItem>
          <Code>response.json()</Code> changes the answer into a dict. It has many labels, for
          example <Code>"name"</Code>, <Code>"language"</Code> and <Code>"stargazers_count"</Code>.
        </ListItem>
        <ListItem>
          <Code>data["language"]</Code> picks the value stored under the label{" "}
          <Code>"language"</Code>. That is the main language the project is written in:{" "}
          <Code>"Python"</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> one word, <Code>Python</Code>. Try changing{" "}
        <Code>"language"</Code> to <Code>"name"</Code> and run it again. You should see{" "}
        <Code>requests</Code>, the name of the project.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: what a chat request holds</Heading>
      <Text>
        A chat model does not get one plain string. It gets a list of <b>messages</b>, and each message has a <b>role</b> that says who is speaking.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>system</Code> holds the rules for the model. <Code>user</Code> holds the question or the data. <Code>assistant</Code> holds an earlier answer from the model.
        </ListItem>
        <ListItem>
          Zero-shot means the messages hold only the rules and the review. Worked examples (a sample review with its answer) would be extra <Code>user</Code> and <Code>assistant</Code> messages.
        </ListItem>
        <ListItem>
          The body of the request also holds settings. <b>Temperature</b> says how much the answers may vary: 0 is steady, and higher is more varied.
        </ListItem>
        <ListItem>
          The model sees only what is in this body.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. Nothing is sent anywhere. We only build the body of a request, the way the lab does, with a made-up model name.
      </Text>
      <RunnableExample labId={9} code={`def build_messages(review):
    return [
        {"role": "system", "content": "Classify the sentiment as positive or negative."},
        {"role": "user", "content": review},
    ]


def build_payload(messages, temperature):
    return {"model": "toy-model", "messages": messages, "temperature": temperature}


def count_examples(messages):
    count = 0
    for message in messages:
        if message["role"] == "assistant":
            count = count + 1
    return count


payload = build_payload(build_messages("I loved it"), 0.7)
print("model:", payload["model"], "| temperature:", payload["temperature"])
for message in payload["messages"]:
    print(message["role"], "->", message["content"])
print("examples shown:", count_examples(payload["messages"]))`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>build_messages</Code> makes the two messages: a <Code>system</Code> rule and the <Code>user</Code> review.
        </ListItem>
        <ListItem>
          <Code>build_payload</Code> puts the messages, the model name and the temperature into one dict. That dict is what a POST request would carry as its body.
        </ListItem>
        <ListItem>
          <Code>count_examples</Code> loops over the messages and counts the <Code>assistant</Code> ones. There are 0, so this request is zero-shot.
        </ListItem>
        <ListItem>
          Pattern: a request is a dict of model, messages and settings. Zero-shot means no example answers in it.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same three functions on two new reviews, with a temperature of 0.2.
      </Text>
      <PracticeCell labId={9} cellId="topic-1" code={`def build_messages(review):
    return [
        {"role": "system", "content": "Classify the sentiment as positive or negative."},
        {"role": "user", "content": review},
    ]


def build_payload(messages, temperature):
    return {"model": "toy-model", "messages": messages, "temperature": temperature}


def count_examples(messages):
    count = 0
    for message in messages:
        if message["role"] == "assistant":
            count = count + 1
    return count


for review in ["Too slow", "Great acting"]:
    payload = build_payload(build_messages(review), 0.2)
    print(review, "->", len(payload["messages"]), "messages,", count_examples(payload["messages"]), "examples, temperature", payload["temperature"])`} expectedOutput={`Too slow -> 2 messages, 0 examples, temperature 0.2
Great acting -> 2 messages, 0 examples, temperature 0.2`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Each review gets a payload. It holds 2 messages: one <Code>system</Code> and one <Code>user</Code>.
        </ListItem>
        <ListItem>
          <Code>count_examples</Code> finds no <Code>assistant</Code> message, so it says 0 examples.
        </ListItem>
        <ListItem>
          The temperature is 0.2, which asks for steadier answers than the 0.7 above.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> two lines, <Code>Too slow -&gt; 2 messages, 0 examples, temperature 0.2</Code> and the same for <Code>Great acting</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        This is the POST step of the lab. In the notebook's{" "}
        <Code>call_groq</Code>, <Code>requests.post(GROQ_API_URL, headers=headers, json=payload)</Code>{" "}
        does exactly this: it sends <Code>payload</Code> (your model name, messages, and settings) as
        the request body, and Groq's server computes a reply and sends it back as the response. Every
        API call to an LLM provider - OpenAI, Anthropic, Groq, or anyone else - is this same POST
        request pattern underneath, just with different URLs and payload shapes.
      </Text>
      <Text>
        Here is <Code>call_groq</Code> on a tiny chat, <Code>[{"{'role': 'user', 'content': 'Hi'}"}]</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>headers</Code> are extra notes sent with the request, like writing your name on the
          envelope. <Code>"Authorization": "Bearer gsk_abc"</Code> proves who you are. (
          <Code>gsk_abc</Code> is a made-up key.) <Code>"Content-Type": "application/json"</Code>{" "}
          says the letter is written in JSON.
        </ListItem>
        <ListItem>
          <Code>build_request_payload(messages)</Code> makes the body of the letter:{" "}
          <Code>{"{'model': 'llama-3.1-8b-instant', 'messages': [...], 'temperature': 0.7}"}</Code>.
          Temperature 0.7 means "a bit of variety is fine". The{" "}
          <Code>response_format</Code> key is only added when you ask for it.
        </ListItem>
        <ListItem>
          <Code>requests.post(..., json=payload, timeout=30)</Code> sends it. <Code>json=payload</Code>{" "}
          changes your dict to JSON text for you. <Code>timeout=30</Code> means "give up after 30
          seconds" so the notebook does not wait forever.
        </ListItem>
        <ListItem>
          <Code>response.raise_for_status()</Code> checks that the server said OK. If the key is
          wrong the server answers with an error number (401), and this line stops with a clear
          error instead of letting you read an empty answer.
        </ListItem>
        <ListItem>
          <Code>extract_reply(response.json())</Code> turns the answer into a dict and returns just
          the reply text, for example <Code>"Hello! How can I help?"</Code>.
        </ListItem>
      </UnorderedList>

      <Heading as="h2" size="md">Environment variables: keeping secrets out of your code</Heading>
      <Text>
        An API key is like a password: whoever has it can make requests (and rack up usage) as you.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        If you write a key directly into your code -{" "}
        <Code>{"api_key = \"gsk_live_abc123...\""}</Code> - it's now sitting in a file that might get
        committed to git, pasted into a shared notebook, or screen-shared in a meeting. Once a secret
        is in version control, it's effectively public forever, even if you delete it in a later
        commit. The standard fix is to keep secrets <i>out</i> of the code entirely, and read them
        from the surrounding environment at run time instead:
      </Text>
      <RunnableExample labId={9} code={`import os

api_key = os.environ["GROQ_API_KEY"]  # read from the environment, never typed into the file`} />
      <Text>
        The value itself lives somewhere outside the source file - an environment variable set in
        your shell, or a <Code>.env</Code> file that's excluded from git.
      </Text>

      <Text>Here is what that line does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          An <b>environment variable</b> is a named note kept by your computer, outside any file of
          yours. For example, a note called <Code>GROQ_API_KEY</Code> that holds your key.
        </ListItem>
        <ListItem>
          <Code>import os</Code> loads the toolbox for talking to your computer.{" "}
          <Code>os.environ</Code> works like a dict of all those notes.
        </ListItem>
        <ListItem>
          <Code>os.environ["GROQ_API_KEY"]</Code> looks up the note by name and gives back its
          value. If no such note exists, Python stops with a <Code>KeyError</Code>. That is a good
          thing: it tells you the key is missing.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell reading a value back out of{" "}
        <Code>os.environ</Code> - run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`import os

os.environ["MY_APP_TOKEN"] = "demo-token-123"  # normally set outside your code, not like this
token = os.environ["MY_APP_TOKEN"]
print(token)  # expected output: demo-token-123`}
      </Code>
      <PracticeCell labId={9} cellId="concept-2" code={`import os

os.environ["MY_APP_TOKEN"] = "demo-token-123"  # normally set outside your code, not like this
token = os.environ["MY_APP_TOKEN"]
print(token)  # expected output: demo-token-123`} expectedOutput={`demo-token-123`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>os.environ["MY_APP_TOKEN"] = "demo-token-123"</Code> writes a new note called{" "}
          <Code>MY_APP_TOKEN</Code>. Here we do it inside the code only so the cell can run by
          itself. In real life you never type a secret into the code.
        </ListItem>
        <ListItem>
          <Code>token = os.environ["MY_APP_TOKEN"]</Code> reads the note back. The value{" "}
          <Code>"demo-token-123"</Code> is now stored in <Code>token</Code>.
        </ListItem>
        <ListItem>
          <Code>print(token)</Code> shows it.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> <Code>demo-token-123</Code>. Try changing the name in the last
        read to <Code>"OTHER_TOKEN"</Code>. You should get a <Code>KeyError</Code>, because that
        note was never written.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: API keys and who pays</Heading>
      <Text>
        A hosted model runs on the provider's computers, and the provider counts how much you use. Your <b>API key</b> is how it knows a request is yours.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Usage is counted for each key, in tokens (lab 16).
        </ListItem>
        <ListItem>
          Plans have limits, and some plans send a bill. Anyone who has your key spends from your allowance.
        </ListItem>
        <ListItem>
          So a key never goes into code or a notebook that others can read. When it must appear in a log, show only a masked version.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. No request is sent. We pretend a provider keeps a running count of tokens for each key. The keys are made up.
      </Text>
      <RunnableExample labId={9} code={`def mask_key(key):
    return key[:4] + "..." + key[-2:]


def add_usage(usage, key, tokens):
    usage[key] = usage.get(key, 0) + tokens


usage = {}
requests_made = [("gsk_abc123", 120), ("gsk_xyz789", 40), ("gsk_abc123", 80)]
for key, tokens in requests_made:
    add_usage(usage, key, tokens)
for key, tokens in usage.items():
    print(mask_key(key), "used", tokens, "tokens")`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>add_usage</Code> adds tokens to a key's running total. <Code>usage.get(key, 0)</Code> gives 0 for a key not seen before.
        </ListItem>
        <ListItem>
          The first loop goes over 3 requests. <Code>gsk_abc123</Code> made two of them, so it ends with <Code>120 + 80 = 200</Code> tokens. <Code>gsk_xyz789</Code> has 40.
        </ListItem>
        <ListItem>
          <Code>mask_key</Code> keeps the first 4 and last 2 characters, like <Code>gsk_...23</Code>. A log can tell keys apart without showing them.
        </ListItem>
        <ListItem>
          Pattern: usage is counted for each key, so sharing the key means sharing the bill.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same two functions on new requests. Pretend <Code>gsk_leak99</Code> is a key that ended up in a public file.
      </Text>
      <PracticeCell labId={9} cellId="topic-2" code={`def mask_key(key):
    return key[:4] + "..." + key[-2:]


def add_usage(usage, key, tokens):
    usage[key] = usage.get(key, 0) + tokens


usage = {}
requests_made = [("gsk_mine01", 30), ("gsk_leak99", 500), ("gsk_mine01", 70), ("gsk_leak99", 250)]
for key, tokens in requests_made:
    add_usage(usage, key, tokens)
for key, tokens in usage.items():
    print(mask_key(key), "used", tokens, "tokens")`} expectedOutput={`gsk_...01 used 100 tokens
gsk_...99 used 750 tokens`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>gsk_mine01</Code> makes two requests, <Code>30 + 70 = 100</Code> tokens.
        </ListItem>
        <ListItem>
          <Code>gsk_leak99</Code> makes two as well, <Code>500 + 250 = 750</Code> tokens. If that was your key, the stranger used more than you.
        </ListItem>
        <ListItem>
          <Code>mask_key</Code> shows only the ends of each key, so the output is safe to share.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> two lines, <Code>gsk_...01 used 100 tokens</Code> and <Code>gsk_...99 used 750 tokens</Code>. Change a number in <Code>requests_made</Code> and the total changes with it.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        Instead of reading the key from the environment, this notebook asks you to type it. Its setup cell
        uses <Code>getpass.getpass("Enter your GROQ_API_KEY: ")</Code>, which prompts for the key
        with a hidden input field (like a password prompt) and holds it only in memory for that
        session - it's never written into the <Code>.ipynb</Code> file, so it can't accidentally end
        up in version control. <Code>call_groq</Code> then reads that in-memory value only when it
        builds the request headers.
      </Text>
      <Text>Here is what happens when you type a key, using a made-up one:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The notebook shows the prompt <Code>Enter your GROQ_API_KEY:</Code>. You type{" "}
          <Code>gsk_abc</Code>. Nothing shows on screen while you type, like a password box.
        </ListItem>
        <ListItem>
          <Code>GROQ_API_KEY = getpass.getpass(...)</Code> keeps <Code>"gsk_abc"</Code> in memory
          only. It is not saved in the notebook file.
        </ListItem>
        <ListItem>
          Inside <Code>call_groq</Code>, <Code>api_key or GROQ_API_KEY</Code> means "use{" "}
          <Code>api_key</Code> if you passed one, otherwise use the typed key". Since you passed
          nothing, the typed key wins. The header becomes <Code>"Bearer gsk_abc"</Code>.
        </ListItem>
        <ListItem>
          If you restart the notebook, the memory is cleared and you type the key again. That is
          the price of keeping it safe.
        </ListItem>
      </UnorderedList>

      <Heading as="h2" size="md">Parsing a JSON response</Heading>
      <Text>
        Most web APIs reply in <b>JSON</b> - a text format for structured data that maps directly
        onto Python dicts and lists.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        A JSON object like <Code>{'{"name": "Vera", "scores": [1, 2, 3]}'}</Code> becomes a Python
        dict with a nested list, and <Code>response.json()</Code> does that conversion for you
        automatically:
      </Text>
      <RunnableExample labId={9} code={`data = {"name": "Vera", "scores": [1, 2, 3]}
data["name"]       # "Vera"
data["scores"][0]  # 1`} />
      <Text>Once you have a dict, getting a value out is just regular dict/list indexing, drilling down key by key.</Text>

      <Text>Here is what each line does:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>data["name"]</Code> looks up the label <Code>"name"</Code> and gives{" "}
          <Code>"Vera"</Code>.
        </ListItem>
        <ListItem>
          <Code>data["scores"]</Code> gives the whole list <Code>[1, 2, 3]</Code>.
        </ListItem>
        <ListItem>
          <Code>data["scores"][0]</Code> goes one step further: the <Code>[0]</Code> takes the
          first item of that list. Python counts positions from 0, so the first item is at 0, the
          second at 1, and so on. The result is 1.
        </ListItem>
        <ListItem>
          <b>JSON</b> is plain text that looks like a Python dict. It uses double quotes, and
          Python turns it into real dicts and lists for you.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell drilling into a different small dict -
        run it before moving on.
      </Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`data = {"user": "Vera", "orders": [101, 102, 103]}
print(data["user"])  # expected output: Vera
print(data["orders"][-1])  # expected output: 103`}
      </Code>
      <PracticeCell labId={9} cellId="concept-3" code={`data = {"user": "Vera", "orders": [101, 102, 103]}
print(data["user"])  # expected output: Vera
print(data["orders"][-1])  # expected output: 103`} expectedOutput={`Vera
103`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>data</Code> has two labels: <Code>"user"</Code> holds the text <Code>"Vera"</Code>,
          and <Code>"orders"</Code> holds the list <Code>[101, 102, 103]</Code>.
        </ListItem>
        <ListItem>
          <Code>data["user"]</Code> gives <Code>Vera</Code>.
        </ListItem>
        <ListItem>
          <Code>data["orders"][-1]</Code> takes the list, then <Code>[-1]</Code> means "the last
          item". A minus number counts from the end. The last item is 103.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> two lines, <Code>Vera</Code> and then <Code>103</Code>. Try
        changing <Code>[-1]</Code> to <Code>[-2]</Code>. You should see 102, the second item from
        the end.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: the reply is free text</Heading>
      <Text>
        A model writes text. It does not hand you a label. You may ask for one word and still get <Code>Positive.</Code> or <Code>The sentiment is positive.</Code> or something else. Your code has to expect all of them.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          You cannot compare the reply to <Code>"positive"</Code> with <Code>==</Code>. A capital letter or a dot makes them different.
        </ListItem>
        <ListItem>
          So the steps are: pull the reply out of the response, clean it, then look for the word you want.
        </ListItem>
        <ListItem>
          If neither word is there, say so (for example <Code>unknown</Code>) instead of guessing.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. Nothing is sent. <Code>fake_response</Code> builds a response in the same shape as the real one, with a made-up reply. <Code>pull_reply</Code> digs the text out. <Code>find_label</Code> cleans it and looks for a word.
      </Text>
      <RunnableExample labId={9} code={`def fake_response(text):
    return {"choices": [{"message": {"content": text}}]}


def pull_reply(response):
    return response["choices"][0]["message"]["content"]


def find_label(reply):
    text = reply.lower()
    for word in ("negative", "positive"):
        if word in text:
            return word
    return "unknown"


for text in ["Positive.", "The sentiment is negative", "Not sure"]:
    reply = pull_reply(fake_response(text))
    label = find_label(reply)
    print(repr(reply), "->", label, "| reply equals label:", reply == label)`} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>pull_reply</Code> drills down: <Code>"choices"</Code>, then item 0, then <Code>"message"</Code>, then <Code>"content"</Code>.
        </ListItem>
        <ListItem>
          <Code>find_label</Code> makes the reply lowercase. Then it loops over <Code>negative</Code> and <Code>positive</Code> and gives back the first one found inside. If neither is there, it gives <Code>unknown</Code>.
        </ListItem>
        <ListItem>
          All three <Code>==</Code> checks are <Code>False</Code>, even for <Code>Positive.</Code>, which does mean positive. After cleaning, the first two replies give the right labels, and <Code>Not sure</Code> gives <Code>unknown</Code>.
        </ListItem>
        <ListItem>
          Pattern: pull, clean, look for the word. Never trust the exact wording of a reply.
        </ListItem>
      </UnorderedList>

      <Text color="gray.600">
        Try it: use the same three functions on three new replies.
      </Text>
      <PracticeCell labId={9} cellId="topic-3" code={`def fake_response(text):
    return {"choices": [{"message": {"content": text}}]}


def pull_reply(response):
    return response["choices"][0]["message"]["content"]


def find_label(reply):
    text = reply.lower()
    for word in ("negative", "positive"):
        if word in text:
            return word
    return "unknown"


for text in ["NEGATIVE", "I think it is positive!", "Mixed feelings"]:
    reply = pull_reply(fake_response(text))
    label = find_label(reply)
    print(repr(reply), "->", label, "| reply equals label:", reply == label)`} expectedOutput={`'NEGATIVE' -> negative | reply equals label: False
'I think it is positive!' -> positive | reply equals label: False
'Mixed feelings' -> unknown | reply equals label: False`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>NEGATIVE</Code> becomes <Code>negative</Code> once it is lowercase, so the label is <Code>negative</Code>.
        </ListItem>
        <ListItem>
          <Code>I think it is positive!</Code> has <Code>positive</Code> inside it, so the label is <Code>positive</Code>. The words around it do not matter.
        </ListItem>
        <ListItem>
          <Code>Mixed feelings</Code> has neither word, so the label is <Code>unknown</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> three lines. The first two end in <Code>reply equals label: False</Code> even though the labels are right, so the cleaning is what makes the match work. The third shows <Code>unknown</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>Groq's response is a JSON object shaped roughly like:</Text>
      <Code display="block" colorScheme="gray" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`{"choices": [{"message": {"content": "positive"}}]}`}
      </Code>
      <Text>
        That's why the notebook's <Code>extract_reply</Code> function is just{" "}
        <Code>response_json["choices"][0]["message"]["content"]</Code>: drilling down to the
        assistant's actual reply text - the first (and here, only) choice the model produced, its
        message, and that message's content string.
      </Text>
      <Text>
        Take the tiny response above, <Code>{"{\"choices\": [{\"message\": {\"content\": \"positive\"}}]}"}</Code>.
        Here is how <Code>extract_reply</Code> drills down:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>response_json["choices"]</Code> gives a list with one item.
        </ListItem>
        <ListItem>
          <Code>[0]</Code> takes the first item, which is a dict with one label,{" "}
          <Code>"message"</Code>.
        </ListItem>
        <ListItem>
          <Code>["message"]</Code> gives <Code>{"{\"content\": \"positive\"}"}</Code>, and{" "}
          <Code>["content"]</Code> gives the text <Code>"positive"</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        Two of your exercise functions sit on either side of <Code>extract_reply</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>build_zero_shot_messages("This product is amazing!")</Code> returns two messages. A{" "}
          <Code>system</Code> message with the rules ("Classify the sentiment ... 'positive' or
          'negative'. Reply with nothing else.") and a <Code>user</Code> message that holds just the
          review. There are no examples, which is what makes it zero-shot.
        </ListItem>
        <ListItem>
          <Code>parse_label("Positive.")</Code>: <Code>.strip()</Code> removes spaces and new lines
          at the ends, <Code>.strip(".")</Code> removes dots at the ends, and <Code>.lower()</Code>{" "}
          makes the letters small. You get <Code>"positive"</Code>. The function checks whether the
          word <Code>"negative"</Code> is inside, then <Code>"positive"</Code>, and returns the
          match.
        </ListItem>
        <ListItem>
          <Code>parse_label("The sentiment is negative")</Code> returns <Code>"negative"</Code>,
          because that word is inside the longer sentence. If neither word is there, for example{" "}
          <Code>"Not sure"</Code>, you get the cleaned text <Code>"not sure"</Code> back.
        </ListItem>
      </UnorderedList>
      <Text>
        In the project, a loop runs these on the first 10 reviews (<Code>N_SAMPLES = 10</Code>),
        compares each <Code>parse_label</Code> answer with the true label and prints the accuracy,
        for example <Code>9/10 = 90%</Code>. The score can change from run to run, because the
        temperature is 0.7.
      </Text>

      <Heading as="h3" size="sm">Further reading</Heading>
      <Text>
        IBM Think:{" "}
        <Link href="https://www.ibm.com/think/topics/zero-shot-prompting" isExternal color="blue.500">
          What is zero-shot prompting?
        </Link>
      </Text>
    </VStack>
  );
}
