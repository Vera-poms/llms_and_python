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
Why: these four questions cover different situations, so you can see whether the persona holds on all of them.

Copy this constant exactly. It is a list of four strings:

```
QUESTIONS = [
    "What's the best way to grind beans for a French press?",
    "Do you sell dark roast?",
    "I'm frustrated, my last order arrived stale. What can you do?",
    "What do you think of [a competing coffee brand]?",
]
```

The fourth question is the trap. It tempts the model to talk about a competitor. The text `[a competing coffee brand]` is meant literally. Leave it as written.

**Check:** `len(QUESTIONS)` is 4.

### Step 2: Build the system message once
Code shape:
```python
system_message = ...
```
Why: the system message never changes. Building it again on every pass is wasted work, and it risks small differences between calls.

Before the loop, write `system_message = build_system_message(persona)`. The variable name must be exactly `system_message`. It is a single string.

**Check:** `type(system_message)` is `str`, and `"Rae"` is in it (for example `"Rae" in system_message` is `True`).

### Step 3: Loop and build a fresh list of messages each time
Code shape:
```python
for question in QUESTIONS:
    messages = [
        {"role": ..., "content": ...},
        {"role": ..., "content": ...},
    ]
```
Why: each question must be its own conversation, so one question cannot change the next. If you make the list inside the loop, every question gets a clean start.

Write `for question in QUESTIONS:`. Inside the loop, make a new list of exactly two dicts, in this order:

1. `{"role": "system", "content": system_message}`
2. `{"role": "user", "content": question}`

Example for the second question (shape):

```
[
  {"role": "system", "content": "You are Rae, ... (the same string every time)"},
  {"role": "user", "content": "Do you sell dark roast?"},
]
```

Check the key names. They are `"role"` and `"content"`, and the role words `"system"` and `"user"` are in lowercase. Do not add to a list that lives outside the loop, or old questions would carry over.

**Check:** `len(messages) == 2` on every pass, and `messages[0]["content"]` is the same string every time.

### Step 4: Call the model
Code shape:
```python
reply = call_groq(...)
```
Call `call_groq(messages)` with only the list of messages. Use the defaults: model `llama-3.1-8b-instant`, temperature 0.7 (how random the word choice is, so replies change from run to run), and no `max_tokens`. It gives back the reply as a string. Save it in a variable such as `reply`.

`call_groq(messages)` sends your list to Groq and gives back the assistant's text.

**Check:** `reply` is a string that is not empty.

### Step 5: Print the question and the full reply
Code shape:
```python
print(f"Q: {...}\nA: {...}\n")
```
For each question, print:

```
Q: <question>
A: <full reply>
<blank line>
```

Use the full reply. Do not cut it short, and do not remove its line breaks. A reply may be several lines long, which is fine. One f-string with `\n` in the middle prints both lines at once, for example `print(f"Q: {question}\nA: {reply}\n")`. The `\n` at the end, plus the one that `print` adds, gives the blank line.

**Check:** you see four blocks, each starting with `Q:` and followed by `A:`.
