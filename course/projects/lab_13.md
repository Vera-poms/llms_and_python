# Project: Your Digital Twin (Multi-Turn Chat)

## Goal

**The question you are answering:** how does a chatbot "remember" what you said earlier? The surprising answer is that it does not. A chat model is **stateless**: each API call starts from zero. The conversation only feels continuous because *you* keep every message in a list and send the whole list again on every call.

You will turn your own bio into a chatbot persona (a "digital twin") and hold a short chat with it using Groq. You will:

1. Write a small dictionary, `my_profile`, describing yourself.
2. Start a `messages` list that holds one system message built from that profile.
3. Loop over two user questions. For each one, add the question to `messages`, send the whole list to Groq, add the reply to `messages`, and print both.
4. Print how many messages the list holds at the end.

**Takeaway:** the "memory" of a chat is just a list that you grow and resend.

## Words you will see

- **LLM API call**: your code sends text to a model on a server and gets text back. Here the helper `call_groq` does this for you.
- **Groq**: the company whose free API serves the model `llama-3.1-8b-instant`.
- **Stateless**: the server keeps nothing between calls. If you do not resend earlier messages, the model has never heard of them.
- **Message**: a Python dict with two keys, `"role"` and `"content"`. Example: `{"role": "user", "content": "Hi!"}`.
- **Role**: who said it. There are three.
  - `"system"`: hidden instructions that set the model's behaviour (here: "act as this person").
  - `"user"`: what the human typed.
  - `"assistant"`: what the model replied.
- **System prompt**: the text inside the system message. It goes first in the list.
- **Persona**: a character the model is told to play. Your digital twin is a persona based on you.
- **dict**: a Python container of `key: value` pairs, such as `{"name": "Ada"}`. Read a value with `profile["name"]`.
- **list**: an ordered Python container. `my_list.append(x)` adds `x` at the end. `len(my_list)` counts the items.
- **f-string**: a string with `f` in front that fills in values, such as `f"You: {user_message}"`.
- **Non-deterministic**: the output can differ every time you run it. Model replies are non-deterministic. The *number of messages* is not.

## What you start with

Run the **setup cell** first, then **your own Lab 13 exercise cell**. After both, these exist in the kernel.

From the setup cell:

- `GROQ_API_KEY`: your key, as a string (you typed it into a hidden prompt).
- `GROQ_API_URL`: the web address of Groq's chat endpoint. You will not need it directly.
- `DEFAULT_MODEL`: the string `"llama-3.1-8b-instant"`.
- `build_request_payload` and `extract_reply`: helpers used inside `call_groq`. You will not call them directly.
- `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str`: sends a list of messages to Groq and returns the reply as plain text. It reads `GROQ_API_KEY` by itself, so you only pass `messages`.

From YOUR exercise cell (it must be defined and run before this project):

- `build_digital_twin_system_prompt(profile: dict) -> str`: takes a dict with the keys `name`, `role`, `tone`, `facts` (list of strings) and `boundaries` (list of strings). It returns **one string** that tells the model to answer AS that person, states the name, role and tone, lists the facts it can use, and lists the boundaries it must respect.

If you get `NameError: name 'build_digital_twin_system_prompt' is not defined`, you skipped your exercise cell. Run it.

What a call looks like, for reference only:

```python
call_groq([{"role": "user", "content": "Say hi"}])
# returns a plain string such as "Hello! How can I help?"
```

## Steps

### Step 1: Define `my_profile`

Why: the model knows nothing about you. The profile is the raw material for the system prompt.

Create a dict named `my_profile` with **exactly** these five keys:

| Key | Type | What goes in it |
|---|---|---|
| `name` | `str` | Your real name |
| `role` | `str` | One clause describing your role |
| `tone` | `str` | A few adjectives for how you talk |
| `facts` | `list` of `str` | At least **two** true statements about you |
| `boundaries` | `list` of `str` | At least **one** thing the twin must refuse or avoid |

Worked example with made-up values (use your own, not these):

```python
{
    "name": "Ada",
    "role": "a data analyst who teaches evening classes",
    "tone": "warm, curious and a little playful",
    "facts": ["likes pandas", "runs three times a week"],
    "boundaries": ["do not give medical advice"],
}
```

Do not leave placeholders such as `"your name"` or `"a real fact about you"`. The grader checks for real content.

**Check:** `print(type(my_profile["facts"]))` shows `<class 'list'>`, and `len(my_profile["facts"]) >= 2`.

### Step 2: Start the `messages` list

Why: this list is the whole "memory". It starts with the system message so the model knows who to be.

Build one string with your exercise function, then wrap it in a message dict inside a list:

```python
messages = [{"role": "system", "content": build_digital_twin_system_prompt(my_profile)}]
```

Rules:

- Call `build_digital_twin_system_prompt` **once**, here. Do not call it again inside the loop.
- The list holds exactly **one** item at this point.

**Check:** `len(messages)` is `1` and `messages[0]["role"]` is `"system"`.

### Step 3: Define `conversation_turns`

Why: a fixed set of questions makes your run easy to compare with the expected output.

Copy this list exactly:

```python
conversation_turns = [
    "Hi! What are you working on lately?",
    "What's your take on learning by building real projects vs. reading theory?",
]
```

**Check:** `len(conversation_turns)` is `2`.

### Step 4: Write the chat loop

Why: each pass of the loop is one round trip. The order of the three list operations is the whole lesson.

Use a `for user_message in conversation_turns:` loop. Inside it, do these four things **in this order**:

a. **Append the user message.** Add `{"role": "user", "content": user_message}` to `messages` with `messages.append(...)`.

b. **Call the model with the whole list.** `reply = call_groq(messages)`.

   - Pass `messages` itself, not just `user_message`.
   - Use the defaults: model `llama-3.1-8b-instant`, temperature 0.7, no `max_tokens`. (Temperature is the randomness knob; 0.7 means moderately varied replies.)
   - `reply` is a plain string.

c. **Append the assistant reply.** Add `{"role": "assistant", "content": reply}` to `messages`.

d. **Print the exchange** in exactly this shape:

   ```
   You: <user_message>
   Twin: <reply>
   <blank line>
   ```

   An f-string works: `print(f"You: {user_message}")`. For the blank line, end the second print with `\n` or add an empty `print()`.

What `messages` looks like as the loop runs:

| Moment | Items in `messages` | Roles in order |
|---|---|---|
| Before the loop | 1 | system |
| After 4a in turn 1 (the call sees this) | 2 | system, user |
| After 4c in turn 1 | 3 | system, user, assistant |
| After 4a in turn 2 (the call sees this) | 4 | system, user, assistant, user |
| After 4c in turn 2 | 5 | system, user, assistant, user, assistant |

Notice that the second call contains the first question and first answer. That is why the twin can refer back to turn 1.

**Check:** after the loop, `[m["role"] for m in messages]` equals `['system', 'user', 'assistant', 'user', 'assistant']`.

### Step 5: Print the final count

Why: it proves the history grew instead of being reset.

After the loop (not inside it) print exactly:

```
Final messages list has N turns.
```

where `N` is `len(messages)`. Use an f-string. With two turns, `N` is `5` (1 system + 2 user + 2 assistant). Note that the system message counts as a "turn" here.

**Check:** the last line printed reads `Final messages list has 5 turns.`

## What a correct result looks like

```
You: Hi! What are you working on lately?
Twin: <model reply>

You: What's your take on learning by building real projects vs. reading theory?
Twin: <model reply>

Final messages list has 5 turns.
```

- **Deterministic:** the `You:` lines, the layout, and the number `5`.
- **Random (non-deterministic):** the text after `Twin:`. It changes every run. It should sound like you (your tone, your facts). The second reply may mention the first turn, because the history was sent.
- There is no chart in this project.
- Your replies may be several sentences long. That is fine.

## How you'll be graded

The grader checks behaviour, not exact wording:

1. `my_profile` has the five required keys with sensible real content (lists for facts and boundaries).
2. `messages` starts with a system message produced by `build_digital_twin_system_prompt(my_profile)`.
3. Each turn appends the user message, calls `call_groq` with the entire history, then appends the assistant reply, so history grows across turns.
4. Each turn prints `You:` and `Twin:` lines.
5. The final line reports the length of `messages` (5 for two turns).
