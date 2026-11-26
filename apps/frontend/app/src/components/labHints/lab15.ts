import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 15 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab15Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "class GroqClient:",
    hints: [
      {
        code: "def __init__(self, api_key: str | None, model: str,",
        block: "function",
        text:
          "Already written for you. It stores `api_key`, `model`, `system_prompt` and `transport`. It starts `self.messages` as `[]`, or as `[{\"role\": \"system\", \"content\": system_prompt}]` if a system prompt was given. " +
          "`self.transport(messages, api_key, model)` is a function that gives back a reply string.",
      },
      {
        code: "def add_user_message(self, text: str) -> None:",
        block: "function",
        text:
          "Adds one user message to the conversation. You get `text`, what the human said, like `\"Hi\"`. You give back nothing (`None`); it changes `self.messages`. " +
          "Example: on an empty client, `add_user_message(\"Hi\")` leaves `self.messages == [{\"role\": \"user\", \"content\": \"Hi\"}]`.",
      },
      {
        code: "raise NotImplementedError(\"GroqClient.add_user_message()",
        text:
          "Your turn: replace this line with your code. Write it in this shape (replace each `...`):\n" +
          "`def add_user_message(self, text):`\n`    self.messages.append(...)`\n" +
          "**1)** Add the dict `{\"role\": \"user\", \"content\": text}` to the end of `self.messages`. Return nothing.\n" +
          "**Check:** on a new client with no system prompt, after `add_user_message(\"Hi\")`, `self.messages == [{\"role\": \"user\", \"content\": \"Hi\"}]`.",
      },
      {
        code: "def add_assistant_message(self, text: str) -> None:",
        block: "function",
        text:
          "Adds one assistant (model) message to the conversation. You get `text`, what the model said, like `\"Hello\"`. You give back nothing (`None`); it changes `self.messages`. " +
          "Example: on an empty client, `add_assistant_message(\"Hello\")` leaves `self.messages == [{\"role\": \"assistant\", \"content\": \"Hello\"}]`.",
      },
      {
        code: "raise NotImplementedError(\"GroqClient.add_assistant_message()",
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`def add_assistant_message(self, text):`\n`    self.messages.append(...)`\n" +
          "**1)** Add the dict `{\"role\": \"assistant\", \"content\": text}` to the end of `self.messages`. Return nothing.\n" +
          "**Check:** after `add_assistant_message(\"Hello\")` on an empty client, `self.messages == [{\"role\": \"assistant\", \"content\": \"Hello\"}]`.",
      },
      {
        code: "def send(self, user_text: str) -> str:",
        block: "function",
        text:
          "Sends one user message and gets the model's reply, keeping the history up to date. You get `user_text`, what the human says, like `\"Hello!\"`. You give back a string, the reply text from the transport. " +
          "Example: with `fake_transport`, `client.send(\"Hello!\")` gives back `\"(fake reply to: Hello!)\"` and the history grows by 2 messages (the user message, then the assistant reply).",
      },
      {
        code: "raise NotImplementedError(\"GroqClient.send()",
        text:
          "Your turn: replace this line with your code. Write it in this shape (replace each `...`):\n" +
          "`def send(self, user_text):`\n`    self.add_user_message(...)`\n`    reply = self.transport(..., ..., ...)`\n`    self.add_assistant_message(...)`\n`    return ...`\n" +
          "**1)** Call `self.add_user_message(user_text)`.\n" +
          "**2)** Set `reply` to `self.transport(self.messages, self.api_key, self.model)`.\n" +
          "**3)** Call `self.add_assistant_message(reply)`.\n" +
          "**4)** Return `reply`.\n" +
          "**Check:** with `client = GroqClient(api_key=None, model=\"fake-model\", system_prompt=\"You are helpful.\", transport=fake_transport)`, `client.send(\"Hello!\")` gives `'(fake reply to: Hello!)'`. After one `send`, `len(client.history)` is 3 (system, user, assistant). After two sends it is 5. Without a system prompt it would be 2 and 4.",
      },
      {
        code: "def reset(self) -> None:",
        block: "function",
        text:
          "Forgets the conversation but keeps the system prompt. You get nothing (it uses `self.system_prompt`). You give back nothing (`None`); it replaces `self.messages`. " +
          "Example: with system prompt `\"You are helpful.\"`, after any number of sends, `reset()` leaves `self.messages == [{\"role\": \"system\", \"content\": \"You are helpful.\"}]`. With no system prompt it leaves `[]`.",
      },
      {
        code: "raise NotImplementedError(\"GroqClient.reset()",
        text:
          "Your turn: replace this line with your code. Write it in this shape (replace each `...`):\n" +
          "`def reset(self):`\n`    if ...:`\n`        self.messages = [...]`\n`    else:`\n`        self.messages = ...`\n" +
          "**1)** If `self.system_prompt` is set, set `self.messages` to a new list with just `{\"role\": \"system\", \"content\": self.system_prompt}`.\n" +
          "**2)** Otherwise, set `self.messages` to `[]`.\n" +
          "**Check:** after two sends and a `reset()` on the example client, `client.history` is `[{\"role\": \"system\", \"content\": \"You are helpful.\"}]`. On a client with no system prompt, `client.history` is `[]`.",
      },
      {
        code: "def history(self) -> list[dict]:",
        block: "function",
        text: "Already written for you. It gives back a copy of the message list, so changing the copy does not change the real history.",
      },
      {
        code: "def fake_transport(messages: list[dict], api_key: str | None, model: str) -> str:",
        block: "function",
        text: "Already written for you. A stand-in for the real API call. It replies `\"(fake reply to: <last user text>)\"`, so you can test with no internet and no API key.",
      },
      {
        code: "client = GroqClient(api_key=None,",
        text: "Makes a client with the system prompt `\"You are helpful.\"` that uses `fake_transport` instead of the network.",
      },
      {
        code: "reply = client.send(\"Hello!\")",
        text: "Runs **your** `send` and keeps the reply.",
      },
      {
        code: "assert reply == ",
        text: "A self-check. `send(\"Hello!\")` must give back `\"(fake reply to: Hello!)\"`.",
      },
      {
        code: "assert client.history == [\n",
        text: "A self-check. After the send, the history must be system, user, assistant, in that order.",
      },
      {
        code: "client.send(\"Second message\")",
        text: "A second send on the same client, so the history keeps growing.",
      },
      {
        code: "assert len(client.history) == 5",
        text: "A self-check. After the second send the history must have 5 messages.",
      },
      {
        code: "client.reset()",
        text: "Runs **your** `reset`. The next assert checks the history is back to just the system message.",
      },
      {
        code: "print(\"All checks passed",
        text: "When all asserts pass, this prints **All checks passed**.",
      },
    ],
  },
];
