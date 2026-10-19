# Project: Digital Twin on a GroqClient Wrapper

## Goal
The question: **can the chat loop from lab 13 be packaged into a reusable object, so that the caller never touches the messages list?**

In lab 13 you kept the `messages` list by hand. Now your `GroqClient` class owns that list and grows it inside `send()`. A *transport* is a plug-in function that makes the actual network call. It lets the same class run with a fake one in tests, and with the real Groq API here. You will:

1. Write `build_digital_twin_system_prompt(profile)` again (it may not exist in this notebook).
2. Write `real_transport(...)`. It plugs the real Groq call into your class.
3. Define `my_profile`. Then create `twin`, a `GroqClient` set up with the system prompt and `real_transport`.
4. Chat through `twin.send(...)` for two questions, and print each exchange.
5. Print the full history, one line per message. Line up the role, and cut the content to 80 characters.

Takeaway: you get the same behavior as a hand-made loop, but now inside a reusable object.

## What you start with
Run the **setup cell**, then **your own Lab 15 exercise cell**, before this project. After both, these exist in the notebook.

From the setup cell:
- `GROQ_API_KEY`: your key as a string.
- `GROQ_API_URL`: the chat endpoint (you do not need it directly).
- `DEFAULT_MODEL`: the string `"llama-3.1-8b-instant"`.
- `build_request_payload`, `extract_reply`: helpers used inside `call_groq`.
- `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str`: sends a messages list to Groq and gives back the reply text.

From YOUR exercise cell (it must be defined and run first):
- `class GroqClient`. A class is a blueprint, and `GroqClient(...)` builds one object from it. The object remembers data (its *state*) in attributes like `self.messages`.
  - `__init__(self, api_key, model, system_prompt=None, transport=None)`: stores the settings. If a system prompt is given, it becomes the first message.
  - `add_user_message(text)`: adds `{"role": "user", "content": text}` to the list.
  - `add_assistant_message(text)`: adds `{"role": "assistant", "content": text}` to the list.
  - `send(user_text) -> str`: adds the user message, calls `self.transport(self.messages, self.api_key, self.model)`, adds the reply as an assistant message, and gives back the reply.
  - `reset()`: clears the history back to just the system prompt.
  - `history` (a *property*, a method you read like a variable): a **copy** of `self.messages`.
- `fake_transport`: a stand-in for tests. You will not use it in this project.

A *message* is a dict like `{"role": "user", "content": "Hi"}`. The roles are `system` (rules), `user` (the human) and `assistant` (the model). The Groq server remembers nothing between calls, so the whole list is sent each time. That is why the class keeps the list. A *transport* is a function `transport(messages, api_key, model)` that gives back a reply string. Your class just calls it.

`build_digital_twin_system_prompt` from lab 13 may not exist in this notebook, so you write it again in Step 1.

If you see `NameError: name 'GroqClient' is not defined`, run your exercise cell.

## Steps

### Step 1: Define `build_digital_twin_system_prompt(profile: dict) -> str`
Code shape (replace each `...`):
```python
def build_digital_twin_system_prompt(profile):
    lines = [
        ...,   # intro line with name and role
        ...,   # tone line
        ...,   # facts heading
    ]
    lines += [... for fact in ...]
    # boundaries heading, then one bullet per boundary
    return ...
```
Why: the system prompt (the text of the first, system message) is what turns a general model into "you".

`profile` has the keys `name`, `role`, `tone`, `facts` (list of str) and `boundaries` (list of str). Give back **one string with several lines**, with these parts in this order:

1. A line saying the model is role-playing as that person. Use the name and role.
2. A line that says the speaking tone.
3. A heading line for facts. Then **one bullet line per fact**. A bullet line starts with `- `.
4. A heading line for boundaries. Then **one bullet line per boundary**, in the same style.

Build the lines in a Python list. Then join them with `"\n"` (a newline character). For example, `"\n".join(["a", "b"])` gives `"a\nb"`. Use a list comprehension (a one-line loop) or a loop for the bullets, so any number of facts works.

Example with an invented profile:

```python
{"name": "Ada", "role": "a data analyst", "tone": "warm, curious",
 "facts": ["likes pandas", "runs weekly"], "boundaries": ["no medical advice"]}
```

can give this string (from running the reference solution; your wording for the heading lines may differ):

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

**Check:** `print(build_digital_twin_system_prompt(my_profile))` shows one bullet per fact and per boundary, and has your name, role and tone. The result is a `str`.

### Step 2: Define `real_transport(messages, api_key, model) -> str`
Code shape:
```python
def real_transport(messages, api_key, model):
    return ...
```
Why: `GroqClient` calls its transport with exactly three arguments. This function makes `call_groq` fit that shape.

Signature: `real_transport(messages: list[dict], api_key: str | None, model: str) -> str`. The body just calls `call_groq(messages, api_key=api_key, model=model)` and gives back the reply text.

Keep the three parameters in this order and with these names. The class passes them by position.

**Check:** `callable(real_transport)` is `True`. (Do not call it yet.)

### Step 3: Define `my_profile`
Code shape:
```python
my_profile = {
    "name": ...,
    "role": ...,
    "tone": ...,
    "facts": [..., ...],
    "boundaries": [...],
}
```
Why: this is what your twin is made of.

A dict with exactly the keys `name`, `role`, `tone`, `facts`, `boundaries`. Use **your own real details**:

- at least **two** facts (list of str),
- at least **one** boundary (list of str),
- no placeholder text such as `"your name"` or `"a real fact about you"`.

**Check:** `len(my_profile["facts"]) >= 2` and `len(my_profile["boundaries"]) >= 1`.

### Step 4: Create `twin`
Code shape:
```python
twin = GroqClient(api_key=..., model=..., system_prompt=..., transport=...)
```
Why: this joins the three pieces (profile, class, transport).

```python
twin = GroqClient(api_key=GROQ_API_KEY, model=DEFAULT_MODEL,
                  system_prompt=build_digital_twin_system_prompt(my_profile),
                  transport=real_transport)
```

Pass the **function itself** (`real_transport`), with no brackets. With brackets you would call it right away, and it would fail.

**Check:** `len(twin.history)` is `1` and `twin.history[0]["role"]` is `"system"`.

### Step 5: Chat through `twin.send`
Code shape:
```python
for user_message in [..., ...]:
    reply = twin.send(...)
    print(...)
    print(...)
    print()
```
Why: the class now does the bookkeeping, so your loop is tiny. Do not add to the messages list yourself.

Loop over exactly these two user messages, in this order:

1. `"Hi! What are you working on lately?"`
2. `"What's the most useful thing you've learned recently?"`

For each message:

- `reply = twin.send(user_message)`. `send` adds the user message, calls the transport with the whole history, adds the reply, and gives back the reply text.
- Print `You: <user_message>` on one line.
- Print `Twin: <reply>` on the next line.
- Print a blank line.

Do not call `add_user_message` or `add_assistant_message` here. `send` already does it. If you did it again, each message would be in the list twice.

**Check:** after the loop, `len(twin.history)` is `5`.

### Step 6: Print the full history
Code shape:
```python
print("--- Full messages list ---")
for message in twin.history:
    print(f"{...:<10} {...}")
```
Why: it shows the list the class built for you. It also shows that the history carried over to the second call.

First print this exact line:

```
--- Full messages list ---
```

Then loop over `twin.history` and print **one line per message**, built from:

1. the role, padded on the right with spaces to 10 characters (`f"{message['role']:<10}"`),
2. one space,
3. the first 80 characters of the content (`message['content'][:80]`). `text[:80]` gives the first 80 characters, or fewer if the text is shorter.

So one line is `f"{message['role']:<10} {message['content'][:80]}"`. Examples (from running the reference solution, with a 100-character assistant reply):

```
'system     You are role-playing as Ada, a data analyst.\nSpeak in a tone that is warm, curio'
'user       Hi!'
'assistant  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
```

(The quotes and `\n` are shown here only to make it clear. Your output has no quotes.) The role name starts at column 1, and the content always starts at column 12. That is because `system` plus 4 pad spaces plus 1 space is 11 characters.

Two things to know:
- The system prompt has several lines. Its first 80 characters may hold a newline, so one history entry can print across two lines. That is normal.
- Cutting is for **display only**. Do not shorten the stored content.

**Check:** you see 5 entries in the order system, user, assistant, user, assistant.
