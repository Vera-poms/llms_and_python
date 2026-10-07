# Project: One Persona, Many Questions (System Instruction Check)

## Goal

A system instruction is a standing set of rules you give a model once, such as "you are Rae, be warm, never mention competitors". The real question here is: **does one system instruction keep shaping the model's replies across very different questions, including a question that tempts it to break a rule?**

This is a live project. It sends real requests to Groq, so it needs your Groq API key.

You will:

1. Store four test questions in `QUESTIONS`.
2. Build the system prompt once from the `persona` dict and keep it in `system_message`.
3. For each question, build a fresh two-message list (`system` then `user`) and call the model.
4. Print each question with the model's full reply.

Takeaway: you write the persona once, reuse it unchanged, and spot-check that the rules hold. The last question is a trap that tests whether the "never mention competitors" rule survives.

## Words you will see

- **LLM**: a large language model. Here, `llama-3.1-8b-instant` on Groq.
- **API call**: your code sends a request over the internet and gets the model's reply. `call_groq` does it.
- **Message**: one chat turn as a dict with two keys: `role` and `content`, for example `{"role": "user", "content": "Hello"}`.
- **Messages list**: a list of message dicts, sent in order.
- **Roles**: `"system"` is standing instructions the model should follow throughout, `"user"` is the person asking, and `"assistant"` is the model's earlier replies.
- **System message / system prompt**: the text in the `system` message. It sets name, job, tone and rules.
- **Persona**: a character description stored in a dict (`name`, `role`, `tone`, `constraints`).
- **Constraint**: a rule the persona must follow, for example "never mention competitors".
- **Single-turn conversation**: just one question and one answer, with no earlier history. Here every question starts fresh.
- **Non-deterministic**: the reply can change every run (temperature 0.7 means some randomness).

## What you start with

The setup cell has run, and your Lab 12 exercise cell must have run too. These names exist:

| Name | What it is | Example |
|---|---|---|
| `GROQ_API_KEY` | your key (typed via getpass) | do not print it |
| `GROQ_API_URL`, `DEFAULT_MODEL` | web address and model name | `DEFAULT_MODEL` is `"llama-3.1-8b-instant"` |
| `build_request_payload`, `extract_reply` | helpers used inside `call_groq`; you will not call them | |
| `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str` | sends the messages list and returns the reply text; uses `GROQ_API_KEY` automatically | `call_groq([{"role": "user", "content": "Hi"}])` gives something like `"Hello!"` |

From YOUR exercise cell (it must be defined and run before this project cell):

- `build_system_message(persona: dict) -> str`: turns a dict with keys `name`, `role`, `tone` and `constraints` (a list of strings) into one system prompt string. It states the name, role and tone, and lists each constraint on its own bullet/line.
- The `persona` dict. If it is missing, re-create it exactly like this:

```
persona = {
    "name": "Rae",
    "role": "a friendly customer support agent for a coffee subscription service",
    "tone": "warm and concise",
    "constraints": ["never mention competitors", "always ask if there's anything else before ending"],
}
```

For this persona, a good `build_system_message` produces a string like this (the exact wording is yours; this is just a shape to compare):

```
You are Rae, a friendly customer support agent for a coffee subscription service.
Your tone is warm and concise.
Rules you must always follow:
- never mention competitors
- always ask if there's anything else before ending
```

If the string leaves out the name, role, tone or any constraint, the live replies will not show the persona.

## Steps

### Step 1: Define `QUESTIONS`

Why: these four questions cover different situations so you can see whether the persona holds on all of them.

Copy this given constant exactly. It is a list of four strings:

```
QUESTIONS = [
    "What's the best way to grind beans for a French press?",
    "Do you sell dark roast?",
    "I'm frustrated, my last order arrived stale. What can you do?",
    "What do you think of [a competing coffee brand]?",
]
```

The fourth question is the trap. It tempts the model to talk about a competitor. The text `[a competing coffee brand]` is literal. Leave it as written.

**Check:** `len(QUESTIONS)` is 4.

### Step 2: Build the system message once

Why: the system message never changes, so building it again each loop is wasted work and risks small differences between calls.

Before the loop, write `system_message = build_system_message(persona)`. The variable name must be exactly `system_message`. It is a single string.

**Check:** `type(system_message)` is `str`, and `"Rae"` appears in it (for example `"Rae" in system_message` is `True`).

### Step 3: Loop and build a fresh messages list each time

Why: each question must be an independent conversation, so one question cannot influence the next. Creating the list inside the loop gives every question a clean start.

Write `for question in QUESTIONS:`. Inside the loop, build a new list of exactly two dicts, in this order:

1. `{"role": "system", "content": system_message}`
2. `{"role": "user", "content": question}`

Worked example for the second question (shape):

```
[
  {"role": "system", "content": "You are Rae, ... (the same string every time)"},
  {"role": "user", "content": "Do you sell dark roast?"},
]
```

Check the key names: they are `"role"` and `"content"`, with the role words `"system"` and `"user"` in lower case. Do not append to a list that lives outside the loop, or old questions would carry over.

**Check:** `len(messages) == 2` on every iteration, and `messages[0]["content"]` is the same string every time.

### Step 4: Call the model

Call `call_groq(messages)` with only the messages list. Use the defaults: model `llama-3.1-8b-instant`, temperature 0.7, no `max_tokens`. It returns the reply as a string. Save it in a variable such as `reply`.

Library call to know: `call_groq(messages)` sends your list to Groq and returns the assistant's text.

**Check:** `reply` is a non-empty string.

### Step 5: Print question and full reply

For each question print:

```
Q: <question>
A: <full reply>
<blank line>
```

Use the full reply. Do not shorten it and do not strip away its line breaks. A reply may be several lines long, which is fine. A single f-string with `\n` in the middle prints both lines at once, for example `print(f"Q: {question}\nA: {reply}\n")`. The trailing `\n` plus the one that `print` adds gives the blank line.

**Check:** you see four blocks, each starting with `Q:` and followed by `A:`.

## What a correct result looks like

Four blocks like this:

```
Q: <question>
A: <model reply, possibly several lines>

```

- Deterministic: the four `Q:` lines are always the same, and the order is always the same.
- Not deterministic: the wording of every reply changes from run to run.
- If your system prompt works, read the replies and look for these signs:
  - the tone is warm and concise, as Rae,
  - the fourth reply does not name or praise a competing brand (it may politely redirect to the coffee service),
  - the replies typically end by asking whether there is anything else you need.
- A single reply that slips (for example one that forgets to ask "anything else?") is normal at temperature 0.7. Models follow instructions most of the time, not every time. Re-run to see.
- Needs network access and a valid key. A `401` error means a bad key. A `429` error means a rate limit, so wait and re-run.

## How you'll be graded

The grader checks behaviour, not exact wording:

1. `QUESTIONS` contains the four given strings and all are processed.
2. The system message is produced by `build_system_message(persona)` and includes name, role, tone and each constraint.
3. Every call's messages list is `[system, user]` with the correct role keys, the system message identical across calls, one fresh list per question.
4. Each reply comes from a live `call_groq` call.
5. Output pairs each question with its full reply (`Q:` / `A:`).
