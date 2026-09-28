import { Code, Heading, Link, ListItem, OrderedList, Text, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";

export function Lab09Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Just ask</Heading>
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

      <Heading size="md">Making an HTTP request from Python</Heading>
      <Text>
        Every website and API you've ever used works the same basic way: your computer sends a{" "}
        <b>request</b> somewhere on the internet, and gets back a <b>response</b>.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        The <Code>requests</Code> library is the standard tool for doing this yourself, instead of
        through a browser:
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`import requests

response = requests.get("https://api.github.com/repos/python/cpython")
data = response.json()
print(data["stargazers_count"])`}
      </Code>
      <Text>
        That's a <Code>GET</Code> request - "give me some information." A <Code>POST</Code> request
        is used instead when you need to send data along with the request, not just ask for it.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell making a GET request to a different API -
        run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`import requests

response = requests.get("https://api.github.com/repos/psf/requests")
data = response.json()
print(data["language"])  # expected output: Python`}
      </Code>
      <PracticeCell labId={9} code={`import requests

response = requests.get("https://api.github.com/repos/psf/requests")
data = response.json()
print(data["language"])  # expected output: Python`} expectedOutput={`Python`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        For example, sending the actual conversation you want an LLM to reply to. In the notebook's{" "}
        <Code>call_groq</Code>, <Code>requests.post(GROQ_API_URL, headers=headers, json=payload)</Code>{" "}
        does exactly this: it sends <Code>payload</Code> (your model name, messages, and settings) as
        the request body, and Groq's server computes a reply and sends it back as the response. Every
        API call to an LLM provider - OpenAI, Anthropic, Groq, or anyone else - is this same POST
        request pattern underneath, just with different URLs and payload shapes.
      </Text>

      <Heading size="md">Environment variables: keeping secrets out of your code</Heading>
      <Text>
        An API key is like a password: whoever has it can make requests (and rack up usage) as you.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        If you write a key directly into your code -{" "}
        <Code>{"api_key = \"gsk_live_abc123...\""}</Code> - it's now sitting in a file that might get
        committed to git, pasted into a shared notebook, or screen-shared in a meeting. Once a secret
        is in version control, it's effectively public forever, even if you delete it in a later
        commit. The standard fix is to keep secrets <i>out</i> of the code entirely, and read them
        from the surrounding environment at run time instead:
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`import os

api_key = os.environ["GROQ_API_KEY"]  # read from the environment, never typed into the file`}
      </Code>
      <Text>
        The value itself lives somewhere outside the source file - an environment variable set in
        your shell, or a <Code>.env</Code> file that's excluded from git.
      </Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell reading a value back out of{" "}
        <Code>os.environ</Code> - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`import os

os.environ["MY_APP_TOKEN"] = "demo-token-123"  # normally set outside your code, not like this
token = os.environ["MY_APP_TOKEN"]
print(token)  # expected output: demo-token-123`}
      </Code>
      <PracticeCell labId={9} code={`import os

os.environ["MY_APP_TOKEN"] = "demo-token-123"  # normally set outside your code, not like this
token = os.environ["MY_APP_TOKEN"]
print(token)  # expected output: demo-token-123`} expectedOutput={`demo-token-123`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        As this notebook does, the key can also be typed in interactively. The notebook's setup cell
        uses <Code>getpass.getpass("Enter your GROQ_API_KEY: ")</Code>, which prompts for the key
        with a hidden input field (like a password prompt) and holds it only in memory for that
        session - it's never written into the <Code>.ipynb</Code> file, so it can't accidentally end
        up in version control. <Code>call_groq</Code> then reads that in-memory value only when it
        builds the request headers.
      </Text>

      <Heading size="md">Parsing a JSON response</Heading>
      <Text>
        Most web APIs reply in <b>JSON</b> - a text format for structured data that maps directly
        onto Python dicts and lists.
      </Text>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        A JSON object like <Code>{'{"name": "Vera", "scores": [1, 2, 3]}'}</Code> becomes a Python
        dict with a nested list, and <Code>response.json()</Code> does that conversion for you
        automatically:
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`data = {"name": "Vera", "scores": [1, 2, 3]}
data["name"]       # "Vera"
data["scores"][0]  # 1`}
      </Code>
      <Text>Once you have a dict, getting a value out is just regular dict/list indexing, drilling down key by key.</Text>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 3 practice" cell drilling into a different small dict -
        run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`data = {"user": "Vera", "orders": [101, 102, 103]}
print(data["user"])  # expected output: Vera
print(data["orders"][-1])  # expected output: 103`}
      </Code>
      <PracticeCell labId={9} code={`data = {"user": "Vera", "orders": [101, 102, 103]}
print(data["user"])  # expected output: Vera
print(data["orders"][-1])  # expected output: 103`} expectedOutput={`Vera
103`} />

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>Groq's response is a JSON object shaped roughly like:</Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
        {`{"choices": [{"message": {"content": "positive"}}]}`}
      </Code>
      <Text>
        That's why the notebook's <Code>extract_reply</Code> function is just{" "}
        <Code>response_json["choices"][0]["message"]["content"]</Code>: drilling down to the
        assistant's actual reply text - the first (and here, only) choice the model produced, its
        message, and that message's content string.
      </Text>

      <Heading size="sm">Notebook - needs a free Groq API key</Heading>
      <Text>
        Open <Code>course/notebooks/lab_09_zero_shot.ipynb</Code>. Get a free key at{" "}
        <Code>console.groq.com/keys</Code> - the notebook's setup cell prompts for it with a
        hidden input field (via <Code>getpass</Code>), it's never written into the notebook file
        or sent anywhere but Groq. Implement <Code>build_zero_shot_messages</Code> and{" "}
        <Code>parse_label</Code> (pure, offline-testable), then the project calls Groq zero-shot
        on 10 real review sentences and reports accuracy.
      </Text>

      <Heading size="sm">Further reading</Heading>
      <Text>
        IBM Think:{" "}
        <Link href="https://www.ibm.com/think/topics/zero-shot-prompting" isExternal color="blue.500">
          What is zero-shot prompting?
        </Link>
      </Text>
    </VStack>
  );
}
