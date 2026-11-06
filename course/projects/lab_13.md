# Project: Your Digital Twin (Multi-Turn Chat)

## Goal
The question: **how does a chatbot "remember" what you said earlier?** The surprising answer is that it does not. A chat model is *stateless*. That means each API call starts from zero. The chat only feels continuous because *you* keep every message in a list. You send the whole list again on every call.

You will turn your own bio into a chatbot persona (a "digital twin"). A *persona* is a character the model is told to play. Then you will chat with it using Groq. Groq is a company with a free API for the model `llama-3.1-8b-instant`. You will:

1. Write a small dict, `my_profile`, that describes you.
2. Start a `messages` list that holds one system message built from that profile.
3. Loop over two user questions. For each one, add the question to `messages`, send the whole list to Groq, add the reply to `messages`, and print both.
4. Print how many messages the list holds at the end.

Takeaway: the "memory" of a chat is just a list that you grow and send again.

## What you start with
Run the **setup cell** first, then **your own Lab 13 exercise cell**. After both, these exist in the notebook.

From the setup cell:
- `GROQ_API_KEY`: your key, as a string (you typed it into a hidden prompt).
- `GROQ_API_URL`: the web address of Groq's chat service. You will not use it directly.
- `DEFAULT_MODEL`: the string `"llama-3.1-8b-instant"`.
- `build_request_payload` and `extract_reply`: helpers used inside `call_groq`. You will not call them yourself.
- `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str`: sends a list of messages to Groq. It gives back the reply as plain text. It reads `GROQ_API_KEY` by itself, so you only pass `messages`. An *API call* means your code sends text to a model on a server and gets text back.

From YOUR exercise cell (it must be defined and run before this project):
- `build_digital_twin_system_prompt(profile)`: you give it a dict with the keys `name`, `role`, `tone`, `facts` (a list of strings) and `boundaries` (a list of strings). It gives back **one string**. That string tells the model to answer AS that person. It has the name, role and tone, the facts the model can use, and the boundaries it must respect. This string is the *system prompt*.

If you see `NameError: name 'build_digital_twin_system_prompt' is not defined`, you skipped your exercise cell. Run it.

A *message* is a dict with two keys, `"role"` and `"content"`. For example: `{"role": "user", "content": "Hi!"}`. The *role* says who spoke:
- `"system"`: hidden instructions for the model (here: "act as this person").
- `"user"`: what the human typed.
- `"assistant"`: what the model replied.

What a call looks like, for reference only:

```python
call_groq([{"role": "user", "content": "Say hi"}])
# gives back a plain string such as "Hello! How can I help?"
```

## Steps

### Step 1: Define `my_profile`
Code shape (replace each `...`):
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
2. Set `name` to your real name, `role` to one short phrase about your role, and `tone` to a few words for how you talk.
3. Set `facts` to a list of at least two true things about you.
4. Set `boundaries` to a list of at least one thing the twin must refuse or avoid.
5. Use real content, not placeholders like `"your name"`.

Example with made-up values (use your own):

```python
{
    "name": "Ada",
    "role": "a data analyst who teaches evening classes",
    "tone": "warm, curious and a little playful",
    "facts": ["likes pandas", "runs three times a week"],
    "boundaries": ["do not give medical advice"],
}
```

**Check:** `print(type(my_profile["facts"]))` shows `<class 'list'>`, and `len(my_profile["facts"]) >= 2`.

### Step 2: Start the `messages` list
Code shape:
```python
messages = [{"role": "system", "content": ...}]
```
Write the code that does these steps:

1. Set `messages` to a list with one dict: role `"system"`, and as content `build_digital_twin_system_prompt(my_profile)`.
2. Call that function only here, not again in the loop.

**Check:** `len(messages)` is `1` and `messages[0]["role"]` is `"system"`.

### Step 3: Define `conversation_turns`
Code shape:
```python
conversation_turns = [
    ...,
    ...,
]
```
Write the code that does these steps:

1. Make a list `conversation_turns` with exactly these two strings:
   - `"Hi! What are you working on lately?"`
   - `"What's your take on learning by building real projects vs. reading theory?"`

**Check:** `len(conversation_turns)` is `2`.

### Step 4: Write the chat loop
Code shape:
```python
for user_message in conversation_turns:
    messages.append(...)           # a. the user message
    reply = call_groq(...)         # b. send the whole list
    messages.append(...)           # c. the assistant reply
    print(...)                     # d. show the exchange
    print(...)
```
Write the code that does these steps, in this order:

1. Loop with `for user_message in conversation_turns:`.
2. Add `{"role": "user", "content": user_message}` to `messages` with `messages.append(...)`.
3. Set `reply` to `call_groq(messages)`. Pass the whole `messages` list. Keep the default model (`llama-3.1-8b-instant`), temperature (0.7), and no `max_tokens`.
4. Add `{"role": "assistant", "content": reply}` to `messages`.
5. Print `You: ` and the user message.
6. Print `Twin: ` and the reply, then a blank line (end with `\n` or add an empty `print()`).

The second call sees the first question and answer, so the twin can refer back to turn 1.

**Check:** after the loop, `[m["role"] for m in messages]` equals `['system', 'user', 'assistant', 'user', 'assistant']`.

### Step 5: Print the final count
Code shape:
```python
print(f"Final messages list has {...} turns.")
```
Write the code that does these steps:

1. After the loop (not inside it), print `Final messages list has N turns.` where `N` is `len(messages)`. Use an f-string.

With two turns, `N` is `5` (the system message counts as a turn).

**Check:** the last line printed reads `Final messages list has 5 turns.`
