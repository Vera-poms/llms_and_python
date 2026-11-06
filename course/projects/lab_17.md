# Project: Trim a Long Chat to Fit the Context Window (Offline)

## Goal
The question: **a chat keeps growing, but the model's context window does not. What do you send once the history is too big?** The answer: keep the system message and the newest turns, and drop the oldest ones.

You will use the `count_tokens` and `trim_messages` functions from the exercise to:

1. Measure how big the whole chat history is.
2. Trim it to a budget of 60 tokens.
3. Measure the trimmed history.
4. Print the before and after sizes, then the messages that survived.

No LLM is called here. A real chat app would run this step before every API call.

Takeaway: the model does not forget on purpose. Your code decides what still fits, so it decides what the twin remembers.

## What you start with
Already in the notebook:
- `CHAT_HISTORY`: a list of 9 messages, oldest first. The first is the `"system"` message. After it come 4 user questions and 4 assistant answers, taking turns.

Your own exercise cell **must be defined and run first**. Run the exercise cell, or the solution cell if you are stuck.

- `count_tokens(text) -> int`: you give it a string. It gives back a rough token count, about 1 token per 4 characters, and always at least 1. A *token* is a small piece of text that a model reads as one unit.
- `trim_messages(messages, max_tokens) -> list[dict]`: you give it a history and a budget. It gives back a **new** list with the system message and the newest messages that fit. The original list does not change.

A *message* is a dict with two keys, `"role"` and `"content"`. For example `{"role": "user", "content": "Hi!"}`. `message["content"]` is the text. `message["role"]` says who spoke.

If you see `NameError: name 'trim_messages' is not defined`, run your exercise or solution cell first.

## Steps

### Step 1: measure the full history
Code shape:
```python
before = sum(... for m in CHAT_HISTORY)
```
You get `CHAT_HISTORY` (a list of message dicts) and `count_tokens`. Write the code that does this step:

1. Set `before` to `sum(count_tokens(m["content"]) for m in CHAT_HISTORY)`.

**Check:** `before` is `101`.

### Step 2: trim to the budget
Code shape:
```python
trimmed = trim_messages(..., ...)
```
You get `CHAT_HISTORY` and your `trim_messages`. Write the code that does this step:

1. Set `trimmed` to `trim_messages(CHAT_HISTORY, 60)`.

**Check:** `trimmed` is a list of `5` messages. The first one is still the `"system"` message. `CHAT_HISTORY` still has 9 messages.

### Step 3: measure the trimmed history
Code shape:
```python
after = sum(... for m in trimmed)
```
You get `trimmed`. Write the code that does this step:

1. Set `after` to `sum(count_tokens(m["content"]) for m in trimmed)`.

**Check:** `after` is `59`, and it is not more than `60`.

### Step 4: print the result
Code shape:
```python
print(f"before: ... messages, ... tokens")
print(f"after: ... messages, ... tokens")
for message in trimmed:
    print(f"...: ...")
```
You get `before`, `after`, `CHAT_HISTORY` and `trimmed`. Write the code that does these steps:

1. Print `f"before: {len(CHAT_HISTORY)} messages, {before} tokens"`.
2. Print `f"after: {len(trimmed)} messages, {after} tokens"`.
3. Loop with `for message in trimmed:`.
4. Print `<role>: <content>` for each message. In an f-string with double quotes, use single quotes for the key: `f"{message['role']}"`.

The output is exactly:

```
before: 9 messages, 101 tokens
after: 5 messages, 59 tokens
system: You are Ada's digital twin. Answer as Ada, in a warm and short way.
user: And what does she do for fun?
assistant: She bakes bread, runs in the park and watches football.
user: Has she travelled anywhere lately?
assistant: Last summer she flew to Accra and Lisbon.
```

**Check:** two summary lines, then `5` message lines, and nothing else.
