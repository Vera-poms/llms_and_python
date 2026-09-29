import { Code, Heading, Link, ListItem, OrderedList, Text, VStack } from "@chakra-ui/react";

import { PracticeCell } from "../../components/PracticeCell";
import { RunnableExample } from "../../components/RunnableExample";

export function Lab14Reading() {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Naming what you've already been doing</Heading>
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

      <Heading size="sm">An HTTP request is just a piece of mail</Heading>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 1 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
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

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
      <Text>
        Look back at <Code>call_groq</Code> from the earlier labs with that lens: the URL constant
        is the endpoint, <Code>requests.post(...)</Code> is the method, the{" "}
        <Code>Authorization</Code>/<Code>Content-Type</Code> dict is the headers,{" "}
        <Code>build_request_payload(...)</Code> builds the body, and{" "}
        <Code>extract_reply(response.json())</Code> reads the response. It was always these 5
        pieces - this lab just gives them names.
      </Text>

      <Heading size="sm">Wrapping repeated logic into a class</Heading>

      <Heading size="xs" color="gray.600">In plain Python</Heading>
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

      <Text fontSize="sm" color="gray.600">
        Try it: the notebook has a "Concept 2 practice" cell for this - run it before moving on.
      </Text>
      <Code display="block" whiteSpace="pre" p={3} borderRadius="md">
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

      <Heading size="xs" color="gray.600">Applied to this lab</Heading>
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

      <Heading size="sm">Notebook - needs a free Groq API key</Heading>
      <Text>
        Open <Code>course/notebooks/lab_14_universal_api_components.ipynb</Code>. Implement{" "}
        <Code>SimpleAPIClient</Code> - a small, generic, reusable class not specific to Groq at
        all. The exercise itself makes a real call to a public echo API (httpbin.org, no key
        needed) to prove it works; the project repeats lab 9's zero-shot call through this client
        instead of the raw request, to show the abstraction really does transfer to any REST API.
      </Text>

      <Heading size="sm">Further reading</Heading>
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
