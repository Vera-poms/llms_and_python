import { Heading, Link, OrderedList, UnorderedList } from "@chakra-ui/react";
import { FlatReadingPager } from "../../components/readingLayout";
import { Code, ListItem, RunSubmitKeys, Text } from "../../components/prose";

import { CodeBlock } from "../../components/CodeBlock";
import { PracticeCell } from "../../components/PracticeCell";
import { CodeHint } from "../../components/codeHints";
import { RunnableExample } from "../../components/RunnableExample";

const ATM_HINTS: CodeHint[] = [
  {
    code: "class ATM:",
    block: "class",
    text:
      "A **class** is a blueprint. An **object** is one thing built from the blueprint.",
  },
  {
    code: "def __init__(self, balance):",
    block: "function",
    text:
      "Runs once, right when the object is built. `self` means \"this object\".",
  },
  {
    code: "self.balance = balance",
    text:
      "Stores the starting balance (100) inside the object.",
  },
  {
    code: "def withdraw(self, amount):",
    block: "method",
    text:
      "A **method** is a function that belongs to the object. This one is `withdraw`.",
  },
  {
    code: "self.balance -= amount",
    text:
      "\"Take away\": subtracts `amount` from the saved balance.",
  },
  {
    code: "atm = ATM(balance=100)",
    text:
      "Builds one ATM object that starts with 100.",
  },
  {
    code: "atm.withdraw(30)",
    text:
      "Calls the method. `100 - 30 = 70`. It returns 70.",
  },
  {
    code: "atm.withdraw(20)",
    text:
      "Starts from the saved 70, not from 100. `70 - 20 = 50`. That is what \"the object remembers\" means.",
  },
];

export function Lab14Reading() {
  return (
    <FlatReadingPager>
      <Heading as="h2" size="md">The 5 parts of every API call</Heading>
      <Text>
        Labs 9-13 all made the same shape of HTTP call to Groq. Every REST API call, regardless of
        provider, breaks down into the same 5 components:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          <b>Endpoint</b> - the URL you're sending the request to
        </ListItem>
        <ListItem>
          <b>Method</b> - <Code>GET</Code>, <Code>POST</Code>, etc.
        </ListItem>
        <ListItem>
          <b>Headers</b> - auth token, content type
        </ListItem>
        <ListItem>
          <b>Body</b> - the payload you're sending
        </ListItem>
        <ListItem>
          <b>Response</b> - a status code plus a body you parse back into data
        </ListItem>
      </OrderedList>

      <Heading as="h3" size="sm">An HTTP request is just a piece of mail</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Before touching code, it helps to picture sending a physical letter:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          you write an <b>address</b> on the envelope - that's the <b>endpoint</b>
        </ListItem>
        <ListItem>
          you pick a delivery type, like regular mail vs. registered mail - that's the{" "}
          <b>method</b> (<Code>GET</Code> just asks for something back, <Code>POST</Code> hands
          something over)
        </ListItem>
        <ListItem>
          you write extra instructions on the envelope itself - "fragile", a return address, who's
          allowed to sign for it - that's the <b>headers</b>: metadata about the delivery, not the
          letter's content
        </ListItem>
        <ListItem>
          the actual letter inside the envelope is the <b>body</b> - the real content you're
          sending
        </ListItem>
        <ListItem>
          and whatever comes back in the mail afterwards - a reply letter, a receipt, nothing at
          all - is the <b>response</b>
        </ListItem>
      </OrderedList>
      <Text>Here is the same picture with a few terms made clear:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A <b>URL</b> is a web address, like <Code>https://api.example.com/orders</Code>. It
          names a computer and a place on that computer.
        </ListItem>
        <ListItem>
          An <b>API</b> is a service that other programs can talk to. Your program sends a request
          and the service sends back a response.
        </ListItem>
        <ListItem>
          A <b>status code</b> is a number in the response that says how it went. <Code>200</Code>{" "}
          means "ok". <Code>404</Code> means "not found". <Code>401</Code> means "you are not
          allowed".
        </ListItem>
        <ListItem>
          <b>JSON</b> is a way to write dicts and lists as plain text, so they can travel over the
          internet. It looks almost the same as a Python dict.
        </ListItem>
      </UnorderedList>

      <CodeBlock code={`request = {
    "endpoint": "https://api.example.com/orders",
    "method": "POST",
    "headers": {"Authorization": "Bearer abc123"},
    "body": {"item": "widget", "qty": 2},
}
print(f"{request['method']} {request['endpoint']}")  # expected output: POST https://api.example.com/orders`} hints={[
        {
          code: "request = {",
          text:
            "One **dict** that holds the parts of a request. A dict is a small table of labels (called **keys**) and values. Nothing is sent anywhere. It only describes a request.",
        },
        {
          code: "\"endpoint\": ",
          text: "The **endpoint**: the web address the request goes to, like the address on an envelope.",
        },
        {
          code: "\"method\": ",
          text: "The **method**. `POST` hands something over. `GET` just asks for something back.",
        },
        {
          code: "\"Authorization\": \"Bearer abc123\"",
          text:
            "A **header** that works like a key card: it tells the service who you are. `abc123` is a made-up token.",
        },
        {
          code: "{\"item\": \"widget\", \"qty\": 2}",
          text: "The **body**: the real content you send. Here it says you want 2 widgets. It is a dict inside the dict.",
        },
        {
          code: "request['method']",
          text: "Reads the value for the key `\"method\"`: `\"POST\"`.",
        },
        {
          code: "request['endpoint']",
          text: "Reads the value for the key `\"endpoint\"`: the URL. The f-string prints both, with a space between.",
        },
      ]} />
      <PracticeCell labId={14} cellId="concept-1" code={`request = {
    "endpoint": "https://api.example.com/orders",
    "method": "POST",
    "headers": {"Authorization": "Bearer abc123"},
    "body": {"item": "widget", "qty": 2},
}
print(f"{request['method']} {request['endpoint']}")  # expected output: POST https://api.example.com/orders`} expectedOutput={`POST https://api.example.com/orders`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>request</Code> is one dict that holds the parts of a request. The keys{" "}
          <Code>endpoint</Code> and <Code>method</Code> hold plain text. <Code>headers</Code> and{" "}
          <Code>body</Code> hold dicts of their own.
        </ListItem>
        <ListItem>
          The header <Code>"Authorization": "Bearer abc123"</Code> is like a key card. It tells the
          service who you are. <Code>abc123</Code> is a made-up token here.
        </ListItem>
        <ListItem>
          The body says what you want: 2 widgets. Nothing is sent anywhere. This cell only
          describes a request, it does not send one.
        </ListItem>
        <ListItem>
          The last line is an f-string. <Code>request['method']</Code> is <Code>"POST"</Code> and{" "}
          <Code>request['endpoint']</Code> is the URL, so it prints{" "}
          <Code>POST https://api.example.com/orders</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> one line, the method and then the address. Try changing{" "}
        <Code>"POST"</Code> to <Code>"GET"</Code> and run it again. The line should start with{" "}
        <Code>GET</Code>. You can also add{" "}
        <Code>print(request['body']['qty'])</Code> to see <Code>2</Code>.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: what a call to a language model looks like</Heading>
      <Text>
        A language model sits behind an API like any other service. You do not "run" the model.
        You send a request and read the response.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          The <b>body</b> holds what you want: the model's name, the list of messages, and settings
          such as <Code>temperature</Code> (how random the answer is).
        </ListItem>
        <ListItem>
          The <b>response</b> holds the model's answer deep inside it, in{" "}
          <Code>choices</Code>, then the first choice, then its <Code>message</Code>.
        </ListItem>
        <ListItem>
          The response usually also reports <Code>usage</Code>: how many tokens the call used.
          Tokens are small pieces of text, and they are what you pay for.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. No network is used. <Code>missing_parts</Code> loops over the
        parts a request needs and reports any that are not there. <Code>read_response</Code> digs
        the reply and the token count out of a response dict that we typed by hand.
      </Text>
      <RunnableExample labId={14} code={`REQUIRED = ["endpoint", "method", "headers", "body"]


def missing_parts(request):
    missing = []
    for part in REQUIRED:
        if part not in request:
            missing.append(part)
    return missing


def read_response(response):
    reply = response["choices"][0]["message"]["content"]
    tokens = response["usage"]["total_tokens"]
    return reply, tokens


body = {"model": "tiny-model", "messages": [{"role": "user", "content": "Hi"}]}
good = {"endpoint": "https://api.example.com/v1/chat", "method": "POST",
        "headers": {"Authorization": "Bearer abc123"}, "body": body}
bad = {"endpoint": "https://api.example.com/v1/chat", "method": "POST", "body": body}
for name, request in [("good", good), ("bad", bad)]:
    print(name, "request is missing:", missing_parts(request))

response = {"choices": [{"message": {"role": "assistant", "content": "Hello!"}}],
            "usage": {"total_tokens": 12}}
reply, tokens = read_response(response)
print("reply:", reply, "| tokens used:", tokens)`} hints={[
        {
          code: "def missing_parts(request):",
          block: "function",
          text:
            "Checks a request dict for the 4 parts it needs. Gives back a list of the parts that are not there. An empty list, `[]`, means nothing is missing.",
        },
        {
          code: "    for part in REQUIRED:",
          block: "for loop",
          text: "Tries each required part name in turn: `\"endpoint\"`, `\"method\"`, `\"headers\"`, `\"body\"`.",
        },
        {
          code: "def read_response(response):",
          block: "function",
          text:
            "Digs two values out of a response dict: the reply text and the number of tokens used. Gives both back.",
        },
        {
          code: "for name, request in [(\"good\", good), (\"bad\", bad)]:",
          block: "for loop",
          text: "Checks both requests. `good` prints `[]`. `bad` prints `['headers']`, because it has no headers.",
        },
        {
          code: "REQUIRED = [",
          text: "The 4 parts every request needs. Names in capital letters are a habit for values that never change.",
        },
        {
          code: "if part not in request:",
          text:
            "`in` on a dict checks its **keys**. `not in` is `True` when the key is missing. Then the part is added to `missing`.",
        },
        {
          code: "response[\"choices\"][0][\"message\"][\"content\"]",
          text:
            "Walks down the response one step at a time: the `\"choices\"` list, its first item `[0]`, that item's `\"message\"` dict, then its `\"content\"` text. Here that gives `\"Hello!\"`.",
        },
        {
          code: "response[\"usage\"][\"total_tokens\"]",
          text: "Walks down to the token count: the `\"usage\"` dict, then its `\"total_tokens\"` value, here 12.",
        },
        {
          code: "return reply, tokens",
          text: "Gives back two values at once, as a pair.",
        },
        {
          code: "reply, tokens = read_response(response)",
          text: "Catches the pair and splits it: `reply` gets `\"Hello!\"` and `tokens` gets 12.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>missing_parts</Code> checks each name in <Code>REQUIRED</Code> against the keys of
          the request. <Code>good</Code> has all four parts, so the list is empty.
        </ListItem>
        <ListItem>
          <Code>bad</Code> has no headers, so it would be sent with no key. The function reports{" "}
          <Code>['headers']</Code>. A real service would answer 401.
        </ListItem>
        <ListItem>
          <Code>read_response</Code> follows the path <Code>["choices"][0]["message"]["content"]</Code>{" "}
          to get <Code>Hello!</Code>, and <Code>["usage"]["total_tokens"]</Code> to get 12.
        </ListItem>
        <ListItem>
          Pattern: build the request from known parts, then walk down the response to the one value
          you need.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>REQUIRED</Code>, <Code>missing_parts</Code> and <Code>read_response</Code>{" "}
          from the worked example above, exactly as they are.
        </ListItem>
        <ListItem>
          Make a dict called <Code>odd</Code> with two keys: <Code>endpoint</Code> set to{" "}
          <Code>https://api.example.com/v1/chat</Code>, and <Code>headers</Code> set to a dict with{" "}
          <Code>Authorization</Code> set to <Code>Bearer xyz789</Code>. Print{" "}
          <Code>"odd request is missing:"</Code> and <Code>missing_parts(odd)</Code>.
        </ListItem>
        <ListItem>
          Make a list called <Code>responses</Code> with two response dicts. Each has the shape{" "}
          <Code>{`{"choices": [{"message": {"role": "assistant", "content": ...}}], "usage": {"total_tokens": ...}}`}</Code>
          . The first has content <Code>Bonjour!</Code> and 9 total tokens. The second has content{" "}
          <Code>Hola!</Code> and 7 total tokens.
        </ListItem>
        <ListItem>
          Set <Code>total = 0</Code>. Loop over <Code>responses</Code>. In each pass, call{" "}
          <Code>read_response</Code> to get <Code>reply, tokens</Code>, add <Code>tokens</Code> to{" "}
          <Code>total</Code>, and print <Code>"reply:"</Code>, the reply, <Code>"| tokens used:"</Code>{" "}
          and the tokens.
        </ListItem>
        <ListItem>
          After the loop, print <Code>"total tokens:"</Code> and <Code>total</Code>.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={14} cellId="topic-1" withHint code={`REQUIRED = ["endpoint", "method", "headers", "body"]


def missing_parts(request):
    missing = []
    for part in REQUIRED:
        if part not in request:
            missing.append(part)
    return missing


def read_response(response):
    reply = response["choices"][0]["message"]["content"]
    tokens = response["usage"]["total_tokens"]
    return reply, tokens


odd = {"endpoint": "https://api.example.com/v1/chat", "headers": {"Authorization": "Bearer xyz789"}}
print("odd request is missing:", missing_parts(odd))

responses = [
    {"choices": [{"message": {"role": "assistant", "content": "Bonjour!"}}], "usage": {"total_tokens": 9}},
    {"choices": [{"message": {"role": "assistant", "content": "Hola!"}}], "usage": {"total_tokens": 7}},
]
total = 0
for response in responses:
    reply, tokens = read_response(response)
    total = total + tokens
    print("reply:", reply, "| tokens used:", tokens)
print("total tokens:", total)`} expectedOutput={`odd request is missing: ['method', 'body']
reply: Bonjour! | tokens used: 9
reply: Hola! | tokens used: 7
total tokens: 16`} />
      <Text>
        <b>What you should see:</b>
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">{`odd request is missing: ['method', 'body']
reply: Bonjour! | tokens used: 9
reply: Hola! | tokens used: 7
total tokens: 16`}</Text>
      <Text>If your output is different, compare your lines with these one by one.</Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>odd</Code> has an endpoint and headers, but no method and no body. The loop in{" "}
          <Code>missing_parts</Code> finds both, in the order of <Code>REQUIRED</Code>, so the
          list is <Code>['method', 'body']</Code>.
        </ListItem>
        <ListItem>
          The second loop reads each response. Each pass takes out the reply and the token count,
          adds the tokens to <Code>total</Code>, and prints one line.
        </ListItem>
        <ListItem>
          9 + 7 = 16. Adding up <Code>usage</Code> like this is how you can track what a whole
          session costs.
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        Look back at <Code>call_groq</Code> from the earlier labs with that lens: the URL constant
        is the endpoint, <Code>requests.post(...)</Code> is the method, the{" "}
        <Code>Authorization</Code>/<Code>Content-Type</Code> dict is the headers,{" "}
        <Code>build_request_payload(...)</Code> builds the body, and{" "}
        <Code>extract_reply(response.json())</Code> reads the response. It was always these 5
        pieces - this lab just gives them names.
      </Text>
      <Text>
        Here is <Code>call_groq</Code> on a tiny input. Say <Code>messages</Code> is just{" "}
        <Code>{'[{"role": "user", "content": "Hi"}]'}</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <b>Headers:</b> a dict with <Code>Authorization</Code> set to <Code>Bearer</Code> and
          then your key, and <Code>Content-Type</Code> set to <Code>application/json</Code>. The
          second one tells the service "my body is JSON".
        </ListItem>
        <ListItem>
          <b>Body:</b> <Code>build_request_payload</Code> makes a dict with the keys{" "}
          <Code>model</Code> (<Code>llama-3.1-8b-instant</Code>), <Code>messages</Code> (the list
          above) and <Code>temperature</Code> (0.7). <Code>response_format</Code> is{" "}
          <Code>None</Code> here, so that key is not added.
        </ListItem>
        <ListItem>
          <b>Endpoint and method:</b> <Code>requests.post(GROQ_API_URL, ...)</Code> sends the
          body to the Groq address using POST. <Code>timeout=30</Code> means "give up after 30
          seconds".
        </ListItem>
        <ListItem>
          <b>Response:</b> <Code>raise_for_status()</Code> stops with an error if the status code
          means failure, such as 401. Otherwise <Code>response.json()</Code> turns the reply text
          into a dict. It looks like{" "}
          <Code>{'{"choices": [{"message": {"content": "Hello!"}}]}'}</Code> (the words are an
          example, a real reply will differ). A real reply also carries a <Code>usage</Code> part
          with token counts.
        </ListItem>
        <ListItem>
          <Code>extract_reply</Code> follows the path <Code>["choices"][0]["message"]["content"]</Code>
          : the first choice, its message, its text. That gives <Code>"Hello!"</Code>.
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="sm">Wrapping repeated logic into a class</Heading>

      <Heading as="h4" size="xs" color="gray.600">In plain Python</Heading>
      <Text>
        Think of an ATM. Every withdrawal follows the same steps - check the balance, subtract the
        amount, print a receipt - but you don't want to retype those steps at every machine. You
        bundle the steps and the data they need into one object:
      </Text>
      <RunnableExample labId={14} code={`class ATM:
    def __init__(self, balance):
        self.balance = balance  # state the object remembers

    def withdraw(self, amount):
        self.balance -= amount  # the repeated logic, written once
        return self.balance

atm = ATM(balance=100)
atm.withdraw(30)  # 70
atm.withdraw(20)  # 50`} hints={ATM_HINTS} />
      <Text>
        <Code>self.balance</Code> is remembered between calls, and <Code>withdraw</Code> is the one
        place the logic lives - you never rewrite "subtract and check" by hand again.
      </Text>

      <CodeBlock code={`class VendingMachine:
    def __init__(self, stock):
        self.stock = stock  # state the object remembers

    def dispense(self, item):
        self.stock[item] -= 1  # the repeated logic, written once
        return self.stock[item]

vm = VendingMachine({"soda": 5})
print(vm.dispense("soda"))  # expected output: 4
print(vm.dispense("soda"))  # expected output: 3`} hints={[
        {
          code: "class VendingMachine:",
          block: "class",
          text:
            "A **class** is a blueprint. This one describes a vending machine: what it remembers (its stock) and what it can do (dispense an item).",
        },
        {
          code: "def __init__(self, stock):",
          block: "function",
          text: "Runs once, right when a machine is built. It saves the stock dict inside the machine.",
        },
        {
          code: "def dispense(self, item):",
          block: "method",
          text:
            "A **method**: a function that belongs to the object. It takes one of `item` out of the stock and gives back how many are left.",
        },
        {
          code: "self.stock = stock",
          text: "`self` means \"this machine\". This line keeps the stock dict inside the machine, so later calls can use it.",
        },
        {
          code: "self.stock[item] -= 1",
          text: "`-= 1` means \"take away 1\". It is the same as `self.stock[item] = self.stock[item] - 1`.",
        },
        {
          code: "vm = VendingMachine({\"soda\": 5})",
          text: "Builds one machine, called an **object**, with 5 sodas. This runs `__init__`.",
        },
        {
          code: "vm.dispense(\"soda\")",
          text:
            "Calls the method. The first call gives `5 - 1 = 4`. The second starts from the saved 4 and gives 3. The machine remembers.",
        },
      ]} />
      <PracticeCell labId={14} cellId="concept-2" code={`class VendingMachine:
    def __init__(self, stock):
        self.stock = stock  # state the object remembers

    def dispense(self, item):
        self.stock[item] -= 1  # the repeated logic, written once
        return self.stock[item]

vm = VendingMachine({"soda": 5})
print(vm.dispense("soda"))  # expected output: 4
print(vm.dispense("soda"))  # expected output: 3`} expectedOutput={`4
3`} />
      <Text>
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>VendingMachine({"{"}"soda": 5{"}"})</Code> builds the machine. <Code>__init__</Code>{" "}
          saves the dict as <Code>self.stock</Code>. The machine has 5 sodas.
        </ListItem>
        <ListItem>
          <Code>vm.dispense("soda")</Code> runs <Code>self.stock["soda"] -= 1</Code>, which is the
          same as "soda = soda - 1". <Code>5 - 1 = 4</Code>. It returns 4, and the first print shows{" "}
          <Code>4</Code>.
        </ListItem>
        <ListItem>
          The second call starts from the saved 4. <Code>4 - 1 = 3</Code>. The second print shows{" "}
          <Code>3</Code>.
        </ListItem>
      </UnorderedList>
      <Text>
        <b>What you should see:</b> two lines, <Code>4</Code> then <Code>3</Code>. Try building the
        machine with <Code>{"{"}"soda": 5, "chips": 2{"}"}</Code> and add{" "}
        <Code>print(vm.dispense("chips"))</Code>. You should see <Code>1</Code>, and the soda count
        is not touched.
      </Text>

      <Heading as="h4" size="xs" color="gray.600">Up close: a model's reply is free text, so clean it</Heading>
      <Text>
        A model writes words, not neat values. Your program often needs one fixed label, such as{" "}
        <Code>positive</Code> or <Code>negative</Code>, so it must turn the reply into that label.
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          Even when you say "reply with one word", the model may add a dot, a capital letter or a
          new line: <Code>Positive.</Code>
        </ListItem>
        <ListItem>
          So you first clean the reply (strip spaces and dots, make it lowercase). Then you look
          for the label inside it.
        </ListItem>
        <ListItem>
          Order matters when one label sits inside another. <Code>not spam</Code> contains{" "}
          <Code>spam</Code>, so check the longer one first.
        </ListItem>
        <ListItem>
          If nothing matches, give back a clear "unknown" instead of a guess.
        </ListItem>
      </UnorderedList>
      <Text>
        Here is a worked example. <Code>clean</Code> tidies a reply, and <Code>to_label</Code> maps
        it to <Code>spam</Code>, <Code>not spam</Code> or <Code>unknown</Code>. The replies are
        typed by hand, as a model might write them.
      </Text>
      <RunnableExample labId={14} code={`def clean(reply):
    return reply.strip().strip(".").lower()


def to_label(reply):
    text = clean(reply)
    if "not spam" in text:
        return "not spam"
    if "spam" in text:
        return "spam"
    return "unknown"


replies = ["Spam.", "  not spam \\n", "It is NOT spam, I think", "Hard to say"]
for reply in replies:
    print(reply.strip(), "->", to_label(reply))`} hints={[
        {
          code: "def clean(reply):",
          block: "function",
          text: "Tidies a reply: cuts spaces and new lines off the ends, then a dot at the end, then makes it lowercase. `\"Spam.\"` becomes `\"spam\"`.",
        },
        {
          code: "def to_label(reply):",
          block: "function",
          text:
            "Turns a reply into one fixed label: `\"not spam\"`, `\"spam\"` or `\"unknown\"`. It checks the longer label first, because `\"not spam\"` also contains `\"spam\"`.",
        },
        {
          code: "for reply in replies:",
          block: "for loop",
          text: "Labels each of the 4 replies and prints the tidy reply next to its label.",
        },
        {
          code: ".strip().strip(\".\").lower()",
          text:
            "Three steps in a row. `.strip()` removes spaces and new lines at both ends. `.strip(\".\")` removes dots at the ends. `.lower()` makes all letters small.",
        },
        {
          code: "if \"not spam\" in text:",
          text: "Checked **first**. If `\"spam\"` were checked first, `\"it is not spam\"` would get the wrong label.",
        },
        {
          code: "return \"unknown\"",
          text: "The fallback. It is reached only when neither label is found, like for `\"Hard to say\"`.",
        },
        {
          code: "\\n",
          text: "`\\n` is a new line character. `clean` removes it, along with the spaces around it.",
        },
        {
          code: "reply.strip(), ",
          text: "Trims the spaces and the new line only for printing, so the lines look tidy.",
        },
      ]} />
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>clean</Code> removes the spaces and the new line at the ends, removes a dot at the
          end, and lowercases. <Code>Spam.</Code> becomes <Code>spam</Code>.
        </ListItem>
        <ListItem>
          <Code>It is NOT spam, I think</Code> becomes lowercase, and <Code>not spam</Code> is found
          first. If <Code>spam</Code> were checked first, this reply would be labelled wrongly.
        </ListItem>
        <ListItem>
          <Code>Hard to say</Code> holds neither label, so the result is <Code>unknown</Code>.
        </ListItem>
        <ListItem>
          Pattern: clean first, check the longer label first, and always have a fallback.
        </ListItem>
      </UnorderedList>

      <Text>
        <b>Your turn.</b> The box below starts empty. Write the code that does these steps, then
        press <RunSubmitKeys />:
      </Text>
      <OrderedList spacing={1} pl={4}>
        <ListItem>
          Copy <Code>clean</Code> from the worked example above, exactly as it is.
        </ListItem>
        <ListItem>
          Write <Code>to_label(reply)</Code> the same way as the worked example, but with the
          labels <Code>non-toxic</Code> and <Code>toxic</Code>. Set <Code>text = clean(reply)</Code>.
          If <Code>"non-toxic"</Code> is in <Code>text</Code>, return <Code>"non-toxic"</Code>. Then
          if <Code>"toxic"</Code> is in <Code>text</Code>, return <Code>"toxic"</Code>. Otherwise
          return <Code>"unknown"</Code>. Keep the longer label first.
        </ListItem>
        <ListItem>
          Make a list called <Code>replies</Code> with these four strings:{" "}
          <Code>Toxic!</Code>, <Code>{`" Non-toxic."`}</Code> (it starts with a space),{" "}
          <Code>I would say it is non-toxic</Code> and <Code>Not sure</Code>.
        </ListItem>
        <ListItem>
          Loop over <Code>replies</Code>. For each one, print <Code>reply.strip()</Code>, then{" "}
          <Code>"-&gt;"</Code>, then <Code>to_label(reply)</Code>.
        </ListItem>
      </OrderedList>
      <PracticeCell labId={14} cellId="topic-2" withHint code={`def clean(reply):
    return reply.strip().strip(".").lower()


def to_label(reply):
    text = clean(reply)
    if "non-toxic" in text:
        return "non-toxic"
    if "toxic" in text:
        return "toxic"
    return "unknown"


replies = ["Toxic!", " Non-toxic.", "I would say it is non-toxic", "Not sure"]
for reply in replies:
    print(reply.strip(), "->", to_label(reply))`} expectedOutput={`Toxic! -> toxic
Non-toxic. -> non-toxic
I would say it is non-toxic -> non-toxic
Not sure -> unknown`} />
      <Text>
        <b>What you should see:</b>
      </Text>
      <Text as="pre" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">{`Toxic! -> toxic
Non-toxic. -> non-toxic
I would say it is non-toxic -> non-toxic
Not sure -> unknown`}</Text>
      <Text>If your output is different, compare your lines with these one by one.</Text>
      <Text>
        <b>Why you see it:</b>
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>non-toxic</Code> contains <Code>toxic</Code>, so it is checked first, just like{" "}
          <Code>not spam</Code> above.
        </ListItem>
        <ListItem>
          <Code>Toxic!</Code> keeps its <Code>!</Code>, because <Code>.strip(".")</Code> only
          removes dots. It still contains <Code>toxic</Code>, so the label is <Code>toxic</Code>.
        </ListItem>
        <ListItem>
          <Code>Not sure</Code> matches neither label, so it falls through to{" "}
          <Code>unknown</Code>.
        </ListItem>
        <ListItem>
          <Code>reply.strip()</Code> in the print only trims the space in front of{" "}
          <Code>Non-toxic.</Code> so the lines look tidy.
        </ListItem>
      </UnorderedList>

      <Heading as="h4" size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        <Code>SimpleAPIClient</Code> is the same pattern applied to HTTP calls: its constructor
        stores <Code>self.base_url</Code> and <Code>self.headers</Code> once, and its{" "}
        <Code>.post(path, json_body)</Code> method is the one place that builds the full URL, sends
        the request, checks the status, and parses the response - so calling code just writes{" "}
        <Code>client.post("/chat/completions", {"{"}...{"}"})</Code> instead of repeating all 5
        components by hand every time.
      </Text>
      <Text>
        <Code>SimpleAPIClient</Code> isn't specific to Groq or to chat at all - the exercise proves
        it by pointing it at <Code>httpbin.org</Code>, a public echo service with nothing to do
        with LLMs, and it works identically. That's the actual point: OpenAI's SDK, Anthropic's
        SDK, Stripe's SDK, GitHub's SDK - every one of them is, underneath, a class that remembers
        a base URL and some headers and exposes methods that do endpoint + method + headers + body
        {" -> "}response. Once you can see that shape, a new API's docs stop looking unfamiliar.
      </Text>
      <Text>
        Here is the lab's real class on a tiny input. Say you build{" "}
        <Code>SimpleAPIClient("https://httpbin.org/", {"{"}"X-Test": "1"{"}"})</Code> and then call{" "}
        <Code>client.post("/post", {"{"}"hello": "world"{"}"})</Code>:
      </Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          <Code>__init__</Code> saves <Code>self.base_url</Code>. <Code>.rstrip("/")</Code> cuts
          off any <Code>/</Code> at the end, so the saved value is{" "}
          <Code>"https://httpbin.org"</Code>. That stops a double slash later.
        </ListItem>
        <ListItem>
          <Code>headers or {"{"}{"}"}</Code> means "use the headers if given, otherwise an empty
          dict". Here <Code>self.headers</Code> is <Code>{"{"}"X-Test": "1"{"}"}</Code>.
        </ListItem>
        <ListItem>
          In <Code>post</Code>, <Code>url</Code> is the base plus the path:{" "}
          <Code>"https://httpbin.org" + "/post"</Code> gives <Code>"https://httpbin.org/post"</Code>.
        </ListItem>
        <ListItem>
          <Code>requests.post(url, headers=self.headers, json=json_body, timeout=30)</Code> sends
          the body as JSON. <Code>raise_for_status()</Code> stops with an error if the status code
          means failure.
        </ListItem>
        <ListItem>
          <Code>response.json()</Code> returns a dict. httpbin repeats back what it got, so{" "}
          <Code>result["json"]</Code> is <Code>{"{"}"hello": "world"{"}"}</Code> and{" "}
          <Code>result["headers"]["X-Test"]</Code> is <Code>"1"</Code>. These are the notebook's
          checks. This one needs an internet connection.
        </ListItem>
      </UnorderedList>
      <Text>
        The project reuses the same class with a different base URL:{" "}
        <Code>https://api.groq.com/openai/v1</Code>. Calling <Code>post("/chat/completions", ...)</Code>{" "}
        builds the same address that <Code>call_groq</Code> used. Then{" "}
        <Code>parse_label</Code> applies the same steps as above to the model's reply. For example{" "}
        <Code>" Negative."</Code> goes through <Code>.strip()</Code> (removes spaces),{" "}
        <Code>.strip(".")</Code> (removes dots) and <Code>.lower()</Code> to become{" "}
        <Code>"negative"</Code>. It then checks for <Code>"negative"</Code> before{" "}
        <Code>"positive"</Code>, so <Code>"It is not positive, rather negative"</Code> gives{" "}
        <Code>"negative"</Code>, and a reply with neither word is returned as cleaned. This part
        needs a Groq API key, and the model's wording can change.
      </Text>

      <Heading as="h3" size="sm">Further reading</Heading>
      <Text>
        IBM's{" "}
        <Link href="https://www.ibm.com/think/topics/rest-apis" isExternal color="blue.500">
          explainer on REST APIs
        </Link>{" "}
        covers this same request/response shape and the design principles (statelessness,
        cacheability, and so on) behind why it's become the near-universal convention.
      </Text>
    </FlatReadingPager>
  );
}
