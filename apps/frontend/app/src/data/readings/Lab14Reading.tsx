import { Code, Heading, Link, ListItem, OrderedList, Text, UnorderedList, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab14Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading as="h2" size="md">Naming what you've already been doing</Heading>
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`request = {
    "endpoint": "https://api.example.com/orders",
    "method": "POST",
    "headers": {"Authorization": "Bearer abc123"},
    "body": {"item": "widget", "qty": 2},
}
print(f"{request['method']} {request['endpoint']}")  # expected output: POST https://api.example.com/orders`}
      </Code>
      <PracticeCell labId={14} cellId="concept-1" code={`request = {
    "endpoint": "https://api.example.com/orders",
    "method": "POST",
    "headers": {"Authorization": "Bearer abc123"},
    "body": {"item": "widget", "qty": 2},
}
print(f"{request['method']} {request['endpoint']}")  # expected output: POST https://api.example.com/orders`} expectedOutput={`POST https://api.example.com/orders`} />
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
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
      <Text fontSize="sm">
        <b>What you should see:</b> one line, the method and then the address. Try changing{" "}
        <Code>"POST"</Code> to <Code>"GET"</Code> and run it again. The line should start with{" "}
        <Code>GET</Code>. You can also add{" "}
        <Code>print(request['body']['qty'])</Code> to see <Code>2</Code>.
      </Text>

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
          example, a real reply will differ).
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
atm.withdraw(20)  # 50`} />
      <Text>
        <Code>self.balance</Code> is remembered between calls, and <Code>withdraw</Code> is the one
        place the logic lives - you never rewrite "subtract and check" by hand again.
      </Text>
      <Text>Here is what each part does, with the real numbers:</Text>
      <UnorderedList spacing={1} pl={4}>
        <ListItem>
          A <b>class</b> is a blueprint. An <b>object</b> is one thing built from the blueprint.{" "}
          <Code>ATM(balance=100)</Code> builds one ATM object that starts with 100.
        </ListItem>
        <ListItem>
          <Code>__init__</Code> runs once, right when the object is built. <Code>self</Code> means
          "this object". <Code>self.balance = balance</Code> stores 100 inside it.
        </ListItem>
        <ListItem>
          <Code>atm.withdraw(30)</Code> is a <b>method</b>, which is a function that belongs to the
          object. <Code>self.balance -= amount</Code> means "take away". 100 - 30 = 70. It
          returns 70.
        </ListItem>
        <ListItem>
          <Code>atm.withdraw(20)</Code> starts from the saved 70, not from 100. 70 - 20 = 50. That
          is what "the object remembers" means.
        </ListItem>
      </UnorderedList>

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" overflowX="auto" maxW="100%" p={3} borderRadius="md">
        {`class VendingMachine:
    def __init__(self, stock):
        self.stock = stock  # state the object remembers

    def dispense(self, item):
        self.stock[item] -= 1  # the repeated logic, written once
        return self.stock[item]

vm = VendingMachine({"soda": 5})
print(vm.dispense("soda"))  # expected output: 4
print(vm.dispense("soda"))  # expected output: 3`}
      </Code>
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
      <Text fontSize="sm">
        <b>What this cell does, step by step:</b>
      </Text>
      <UnorderedList spacing={1} pl={4} fontSize="sm">
        <ListItem>
          <Code>VendingMachine({"{"}"soda": 5{"}"})</Code> builds the machine. <Code>__init__</Code>{" "}
          saves the dict as <Code>self.stock</Code>. The machine has 5 sodas.
        </ListItem>
        <ListItem>
          <Code>vm.dispense("soda")</Code> runs <Code>self.stock["soda"] -= 1</Code>, which is the
          same as "soda = soda - 1". 5 - 1 = 4. It returns 4, and the first print shows{" "}
          <Code>4</Code>.
        </ListItem>
        <ListItem>
          The second call starts from the saved 4. 4 - 1 = 3. The second print shows{" "}
          <Code>3</Code>.
        </ListItem>
      </UnorderedList>
      <Text fontSize="sm">
        <b>What you should see:</b> two lines, <Code>4</Code> then <Code>3</Code>. Try building the
        machine with <Code>{"{"}"soda": 5, "chips": 2{"}"}</Code> and add{" "}
        <Code>print(vm.dispense("chips"))</Code>. You should see <Code>1</Code>, and the soda count
        is not touched.
      </Text>

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
        <Code>parse_label</Code> cleans the model's reply. For example <Code>" Negative."</Code> goes
        through <Code>.strip()</Code> (removes spaces), <Code>.strip(".")</Code> (removes dots) and{" "}
        <Code>.lower()</Code> to become <Code>"negative"</Code>. This part needs a Groq API key, and
        the model's wording can change.
      </Text>

      <Heading as="h3" size="sm">Notebook - needs a free Groq API key</Heading>
      <Text>
        Open <Code>course/notebooks/lab_14_universal_api_components.ipynb</Code>. Implement{" "}
        <Code>SimpleAPIClient</Code> - a small, generic, reusable class not specific to Groq at
        all. The exercise itself makes a real call to a public echo API (httpbin.org, no key
        needed) to prove it works; the project repeats lab 9's zero-shot call through this client
        instead of the raw request, to show the abstraction really does transfer to any REST API.
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
    </VStack>
  );
}
