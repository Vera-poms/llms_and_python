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
You get `profile`, a dict with `name`, `role`, `tone` (strings) and `facts`, `boundaries` (lists of strings). For example: `{"name": "Ada", "role": "a data analyst", "tone": "warm, curious", "facts": ["likes pandas", "runs weekly"], "boundaries": ["no medical advice"]}`. Write the code that does these steps:

1. Start a list `lines` with three strings: a line saying the model is role-playing as that person (use the name and role), a line with the tone, and a heading for facts.
2. For each fact, add a bullet line `"- " + fact` to `lines`.
3. Add a heading line for boundaries.
4. For each boundary, add a bullet line `"- " + boundary`.
5. Join `lines` with `"\n"` and return the result.

For Ada, one valid result is (your heading words may differ):

```
You are role-playing as Ada, a data analyst.
Speak in a tone that is warm, curious.
Facts you can draw on about this person:
- likes pandas
- runs weekly
Boundaries you must respect:
- no medical advice
```

That is 7 lines.

**Check:** `print(build_digital_twin_system_prompt(my_profile))` shows one bullet per fact and per boundary, and has your name, role and tone. The result is a `str`.

### Step 2: Define `real_transport(messages, api_key, model) -> str`
Code shape:
```python
def real_transport(messages, api_key, model):
    return ...
```
Write the code that does these steps:

1. Define `real_transport` with the three parameters `messages`, `api_key`, `model`, in this order.
2. Return `call_groq(messages, api_key=api_key, model=model)`.

**Check:** `callable(real_transport)` is `True`. Do not call it yet.

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
Write the code that does these steps:

1. Make a dict `my_profile` with exactly the keys `name`, `role`, `tone`, `facts`, `boundaries`.
2. Use your own real details: at least two facts and at least one boundary (both lists of strings).
3. Use no placeholder text like `"your name"`.

**Check:** `len(my_profile["facts"]) >= 2` and `len(my_profile["boundaries"]) >= 1`.

### Step 4: Create `twin`
Code shape:
```python
twin = GroqClient(api_key=..., model=..., system_prompt=..., transport=...)
```
Write the code that does these steps:

1. Set `twin` to `GroqClient(...)`.
2. Pass `api_key=GROQ_API_KEY` and `model=DEFAULT_MODEL`.
3. Pass `system_prompt=build_digital_twin_system_prompt(my_profile)`.
4. Pass `transport=real_transport`. Write the function name only, with no brackets.

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
Write the code that does these steps:

1. Loop over a list of exactly these two strings, in this order: `"Hi! What are you working on lately?"` and `"What's the most useful thing you've learned recently?"`.
2. Set `reply` to `twin.send(user_message)`.
3. Print `You: ` and the user message.
4. Print `Twin: ` and the reply.
5. Print a blank line.

Do not call `add_user_message` or `add_assistant_message` here. `send` already does it.

**Check:** after the loop, `len(twin.history)` is `5`.

### Step 6: Print the full history
Code shape:
```python
print("--- Full messages list ---")
for message in twin.history:
    print(f"{...:<10} {...}")
```
Write the code that does these steps:

1. Print the exact line `--- Full messages list ---`.
2. Loop with `for message in twin.history:`.
3. Print `f"{message['role']:<10} {message['content'][:80]}"`. The role is padded to 10 characters, then one space, then the first 80 characters of the content.

Example lines (no quotes in your output):

```
system     You are role-playing as Ada, a data analyst.\nSpeak in a tone that is warm, curio
user       Hi!
```

A system prompt has several lines, so its first 80 characters may hold a newline. That is normal. Cutting is for display only, so do not shorten the stored content.

**Check:** you see 5 entries in the order system, user, assistant, user, assistant.
