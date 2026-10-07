# Project: Digital Twin on a GroqClient Wrapper

## Goal

**The question you are answering:** can the chat loop from Lab 13 be packaged into a reusable object, so that the caller never touches the messages list?

In Lab 13 you managed the `messages` list by hand. Now your `GroqClient` class owns that list and grows it inside `send()`. A **transport** (a plug-in function that does the actual network call) lets the same class run with a fake during tests and with the real Groq API here. You will:

1. Re-define `build_digital_twin_system_prompt(profile)` (it is not guaranteed to exist in this notebook).
2. Write `real_transport(...)`, which plugs the real Groq call into your class.
3. Define `my_profile`, then create `twin`, a `GroqClient` wired with the system prompt and `real_transport`.
4. Chat through `twin.send(...)` for two questions and print each exchange.
5. Print the full history, one line per message, with the role aligned and the content cut to 80 characters.

**Takeaway:** the same behaviour as a hand-rolled loop, now inside a reusable object.

## Words you will see

- **Class and object**: a class is a blueprint. `GroqClient(...)` builds one object from it. The object stores its own data in attributes such as `self.messages`.
- **Method**: a function that belongs to a class, called like `twin.send("Hi")`.
- **Property**: a method you read like a variable, without brackets. `twin.history` is a property.
- **State**: data an object remembers between calls. Here, the messages list.
- **Message / role**: a dict like `{"role": "user", "content": "Hi"}`. Roles are `system` (rules), `user` (human) and `assistant` (model).
- **Stateless model**: the Groq server remembers nothing, so the whole list is sent each call. That is why the class keeps the list.
- **System prompt**: the text of the first, system message. It tells the model who to be.
- **Transport**: a function with a fixed signature `transport(messages, api_key, model) -> str` that turns a messages list into a reply string. Your class just calls it.
- **Fake transport**: a stand-in transport that returns canned text with no network. Good for testing.
- **Dependency injection**: handing the class the piece it depends on (the transport) instead of hard-wiring it in.
- **Multi-line string**: text with several lines, joined by `"\n"` (a newline character). `"\n".join(["a", "b"])` gives `"a\nb"`.
- **Slicing**: `text[:80]` gives the first 80 characters (or fewer if the text is shorter).
- **Left-aligned field**: in an f-string, `f"{word:<10}"` pads `word` on the right with spaces to width 10.
- **Non-deterministic**: output that can change from run to run, like model replies.

## What you start with

Run the **setup cell**, then **your own Lab 15 exercise cell**, before this project. After both, these exist in the kernel.

From the setup cell:

- `GROQ_API_KEY`: your key as a string.
- `GROQ_API_URL`: the chat endpoint (not needed directly).
- `DEFAULT_MODEL`: the string `"llama-3.1-8b-instant"`.
- `build_request_payload`, `extract_reply`: helpers used inside `call_groq`.
- `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str`: sends a messages list to Groq and returns the reply text.

From YOUR exercise cell (it must be defined and run first):

- `class GroqClient`
  - `__init__(self, api_key, model, system_prompt=None, transport=None)`: stores the settings. If a system prompt is given, it becomes the first message.
  - `add_user_message(text)`: appends `{"role": "user", "content": text}`.
  - `add_assistant_message(text)`: appends `{"role": "assistant", "content": text}`.
  - `send(user_text) -> str`: appends the user message, calls `self.transport(self.messages, self.api_key, self.model)`, appends the reply as an assistant message, and returns the reply.
  - `reset()`: clears the history back to just the system prompt.
  - `history` (property): a **copy** of `self.messages`.
- `fake_transport`: a test stand-in. You will not use it in this project.

`build_digital_twin_system_prompt` from Lab 13 might not exist in this kernel, so you define it again in Step 1.

If you get `NameError: name 'GroqClient' is not defined`, run your exercise cell.

## Steps

### Step 1: Define `build_digital_twin_system_prompt(profile: dict) -> str`

Why: the system prompt is what turns a general model into "you".

`profile` has the keys `name`, `role`, `tone`, `facts` (list of str) and `boundaries` (list of str). Return **one multi-line string** with these parts, in this order:

1. A line saying the model is role-playing as that person, using the name and role.
2. A line stating the speaking tone.
3. A heading line for facts, then **one bullet line per fact**. A bullet line starts with `- `.
4. A heading line for boundaries, then **one bullet line per boundary**, same style.

Build the lines in a Python list, then join them with `"\n"`. Use a list comprehension or a loop for the bullets, so any number of facts works.

Worked example with an invented profile:

```python
{"name": "Ada", "role": "a data analyst", "tone": "warm, curious",
 "facts": ["likes pandas", "runs weekly"], "boundaries": ["no medical advice"]}
```

can produce this string (I ran it; your wording for the heading lines may differ):

```
You are role-playing as Ada, a data analyst.
Speak in a tone that is warm, curious.
Facts you can draw on about this person:
- likes pandas
- runs weekly
Boundaries you must respect:
- no medical advice
```

That is 7 lines: 2 intro lines, 1 facts heading, 2 fact bullets, 1 boundaries heading, 1 boundary bullet.

**Check:** `print(build_digital_twin_system_prompt(my_profile))` shows one bullet per fact and per boundary, and contains your name, role and tone. The result is a `str`.

### Step 2: Define `real_transport(messages, api_key, model) -> str`

Why: `GroqClient` calls its transport with exactly three arguments. This function adapts `call_groq` to that shape.

Signature: `real_transport(messages: list[dict], api_key: str | None, model: str) -> str`. The body just calls `call_groq(messages, api_key=api_key, model=model)` and returns the reply text.

Keep the three parameters in this order and with these names. The class passes them positionally.

**Check:** `callable(real_transport)` is `True`. (Do not call it yet.)

### Step 3: Define `my_profile`

Why: the content of the twin.

A dict with exactly the keys `name`, `role`, `tone`, `facts`, `boundaries`, using **your own real details**:

- at least **two** facts (list of str),
- at least **one** boundary (list of str),
- no placeholder text such as `"your name"` or `"a real fact about you"`.

**Check:** `len(my_profile["facts"]) >= 2` and `len(my_profile["boundaries"]) >= 1`.

### Step 4: Create `twin`

Why: this wires the three pieces (profile, class, transport) together.

```python
twin = GroqClient(api_key=GROQ_API_KEY, model=DEFAULT_MODEL,
                  system_prompt=build_digital_twin_system_prompt(my_profile),
                  transport=real_transport)
```

Pass the **function itself** (`real_transport`), without brackets. With brackets you would call it immediately, and it would fail.

**Check:** `len(twin.history)` is `1` and `twin.history[0]["role"]` is `"system"`.

### Step 5: Chat through `twin.send`

Why: the class now does the bookkeeping, so your loop is tiny. Do not append to the messages list yourself.

Loop over exactly these two user messages, in this order:

1. `"Hi! What are you working on lately?"`
2. `"What's the most useful thing you've learned recently?"`

For each message:

- `reply = twin.send(user_message)`. `send` adds the user message, calls the transport with the whole history, adds the reply, and returns the reply text.
- Print `You: <user_message>` on one line.
- Print `Twin: <reply>` on the next line.
- Print a blank line.

Do not call `add_user_message` or `add_assistant_message` here. `send` already does it, and doing it again would put each message in twice.

**Check:** after the loop, `len(twin.history)` is `5`.

### Step 6: Print the full history

Why: it shows the list the class built for you and proves the history carried over to the second call.

First print this exact line:

```
--- Full messages list ---
```

Then loop over `twin.history` and print **one line per message**, built from:

1. the role, left-aligned in a 10-character field (`f"{message['role']:<10}"`),
2. one space,
3. the first 80 characters of the content (`message['content'][:80]`).

So one line is `f"{message['role']:<10} {message['content'][:80]}"`. Worked examples (I ran these, with a 100-character assistant reply):

```
'system     You are role-playing as Ada, a data analyst.\nSpeak in a tone that is warm, curio'
'user       Hi!'
'assistant  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
```

(The quotes and `\n` are shown here only for clarity. Your output has no quotes.) The role name then starts at column 1 and the content always starts at column 12, because `system` plus 4 pad spaces plus 1 space is 11 characters.

Two things to know:

- The system prompt is multi-line. Its first 80 characters may contain a newline, so one history entry can print across two lines. That is normal and allowed.
- Slicing is for **display only**. Do not shorten the stored content.

**Check:** you see 5 entries in the order system, user, assistant, user, assistant.

## What a correct result looks like

```
You: Hi! What are you working on lately?
Twin: <model reply>

You: What's the most useful thing you've learned recently?
Twin: <model reply>

--- Full messages list ---
system     You are role-playing as ...
user       Hi! What are you working on lately?
assistant  <first 80 chars of reply>
user       What's the most useful thing you've learned recently?
assistant  <first 80 chars of reply>
```

- **Deterministic:** the structure. The history has 5 entries in the order system, user, assistant, user, assistant. The `You:` lines and the two user lines are exact.
- **Non-deterministic:** the text of the `Twin:` replies and the assistant lines. They change every run and should sound like your profile.
- The first user line is short enough to show in full. The assistant lines are cut at 80 characters.
- There is no chart.

## How you'll be graded

The grader checks behaviour, not exact formatting:

1. The system prompt builder includes name, role, tone, facts and boundaries as specified.
2. `real_transport` delegates to `call_groq` with the given key and model, and `twin` is a `GroqClient` wired with the system prompt and that transport.
3. Conversation happens through `twin.send(...)` for both turns, with history carried to the second call.
4. The final listing iterates `twin.history`, showing role and truncated (80-char) content, with 5 entries in the right order.
5. The profile contains real, non-placeholder content.
