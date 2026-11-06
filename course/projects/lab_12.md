# Project: One Persona, Many Questions (System Instruction Check)

## Goal
The question: **does one system instruction keep shaping the model's replies across very different questions? Does it hold even when a question tempts the model to break a rule?**

A *system instruction* is a standing set of rules you give a model once, such as "you are Rae, be warm, never mention competitors".

This is a live project. It sends real requests to Groq, so it needs your Groq API key. Groq is the website that runs the model for you.

You will:

1. Store four test questions in `QUESTIONS`.
2. Build the system prompt once from the `persona` dict and keep it in `system_message`.
3. For each question, build a fresh list of two messages (`system` then `user`) and call the model.
4. Print each question with the model's full reply.

Takeaway: you write the persona once, reuse it unchanged, and spot-check that the rules hold. The last question is a trap. It tests whether the "never mention competitors" rule survives.

## What you start with
The setup cell has run, and your Lab 12 exercise cell must have run too. These names exist:

| Name | What it is | Example |
|---|---|---|
| `GROQ_API_KEY` | your key (typed with getpass) | do not print it |
| `GROQ_API_URL`, `DEFAULT_MODEL` | the web address and the model name | `DEFAULT_MODEL` is `"llama-3.1-8b-instant"` |
| `build_request_payload`, `extract_reply` | helpers used inside `call_groq`; you will not call them | |
| `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str` | sends the list of messages and gives back the reply text; uses `GROQ_API_KEY` for you | `call_groq([{"role": "user", "content": "Hi"}])` gives something like `"Hello!"` |

A *message* is one chat turn, a dict with two keys, `role` and `content`, like `{"role": "user", "content": "Hello"}`. A list of messages is sent in order. The `role` is `"system"` (standing rules the model follows all the way through), `"user"` (the person asking) or `"assistant"` (the model's earlier replies).

From YOUR exercise cell (it must be defined and run before this project cell):

- `build_system_message(persona: dict) -> str`: turns a dict with the keys `name`, `role`, `tone` and `constraints` (a list of strings) into one system prompt string. It states the name, role and tone, and puts each constraint on its own bullet line. A *persona* is a character description kept in a dict. A *constraint* is a rule the persona must follow, like "never mention competitors".
- The `persona` dict. If it is missing, make it again exactly like this:

```
persona = {
    "name": "Rae",
    "role": "a friendly customer support agent for a coffee subscription service",
    "tone": "warm and concise",
    "constraints": ["never mention competitors", "always ask if there's anything else before ending"],
}
```

For this persona, a good `build_system_message` gives a string like this (the exact words are yours; this is just a shape to compare):

```
You are Rae, a friendly customer support agent for a coffee subscription service.
Your tone is warm and concise.
Rules you must always follow:
- never mention competitors
- always ask if there's anything else before ending
```

If the string leaves out the name, the role, the tone or any constraint, the live replies will not show the persona.

## Steps

### Step 1: Define `QUESTIONS`
Code shape (replace each `...`):
```python
QUESTIONS = [
    ...,
    ...,
    ...,
    ...,
]
```
Write the code that does these steps:

1. Make a list `QUESTIONS` with exactly these four strings, copied exactly (the fourth one is a trap, and `[a competing coffee brand]` is meant literally):
   - `"What's the best way to grind beans for a French press?"`
   - `"Do you sell dark roast?"`
   - `"I'm frustrated, my last order arrived stale. What can you do?"`
   - `"What do you think of [a competing coffee brand]?"`

**Check:** `len(QUESTIONS)` is 4.

### Step 2: Build the system message once
Code shape:
```python
system_message = ...
```
Write the code that does these steps:

1. Before the loop, set `system_message` to `build_system_message(persona)`. The name must be exactly `system_message`.

**Check:** `type(system_message)` is `str`, and `"Rae"` is in it.

### Step 3: Loop and build a fresh list of messages each time
Code shape:
```python
for question in QUESTIONS:
    messages = [
        {"role": ..., "content": ...},
        {"role": ..., "content": ...},
    ]
```
Write the code that does these steps:

1. Loop with `for question in QUESTIONS:`.
2. Inside the loop, set `messages` to a new list of two dicts. Do not add to a list made outside the loop.
3. The first dict is `{"role": "system", "content": system_message}`.
4. The second dict is `{"role": "user", "content": question}`.

**Check:** `len(messages) == 2` on every pass, and `messages[0]["content"]` is the same string every time.

### Step 4: Call the model
Code shape:
```python
reply = call_groq(...)
```
Write the code that does these steps:

1. Inside the loop, set `reply` to `call_groq(messages)`. Use only `messages`: keep the default model (`llama-3.1-8b-instant`), temperature (0.7), and no `max_tokens`.

**Check:** `reply` is a string that is not empty.

### Step 5: Print the question and the full reply
Code shape:
```python
print(f"Q: {...}\nA: {...}\n")
```
Write the code that does these steps:

1. Inside the loop, print `Q: ` and the question, a line break, `A: ` and the full reply, then a blank line. One call does it: `print(f"Q: {question}\nA: {reply}\n")`.
2. Do not cut the reply or remove its line breaks.

**Check:** you see four blocks, each starting with `Q:` and followed by `A:`.
