# Project: Your Digital Twin (Multi-Turn Chat)

**Goal**
Turn your own bio into a persistent chatbot persona (a "digital twin") and hold a short multi-turn conversation with it using Groq. You will see that a chat model is stateless: the conversation exists only because you keep appending every user message and every assistant reply to a `messages` list and resend the whole list each time.

**What you start with**
Run the setup cell first, then your own Lab 13 exercise code. Available in the kernel:
- From setup: `GROQ_API_KEY`, `GROQ_API_URL`, `DEFAULT_MODEL` (`"llama-3.1-8b-instant"`), `build_request_payload`, `extract_reply`, and `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str` (returns reply text; uses `GROQ_API_KEY` automatically).
- From YOUR exercise cell, which must be defined and run before the project:
  - `build_digital_twin_system_prompt(profile: dict) -> str` - takes a dict with `name`, `role`, `tone`, `facts` (list of strings) and `boundaries` (list of strings) and returns one system prompt that tells the model to answer AS that person, states name/role/tone, lists the facts it can draw on and lists the boundaries it must respect.

**Requirements**
1. Define `my_profile`, a dict with exactly the keys `name` (str), `role` (str, a one-clause description of your role), `tone` (str, a few adjectives), `facts` (list of at least two true statements about yourself) and `boundaries` (list of at least one thing the twin must refuse or avoid). Use your own real details (not placeholders like "your name").
2. Initialise `messages` as a list containing a single system message: `{"role": "system", "content": build_digital_twin_system_prompt(my_profile)}`.
3. Define this given list of turns:
   ```
   conversation_turns = [
       "Hi! What are you working on lately?",
       "What's your take on learning by building real projects vs. reading theory?",
   ]
   ```
4. For each user message, in order:
   a. append `{"role": "user", "content": user_message}` to `messages`;
   b. call `call_groq(messages)` with the full current list (default model, temperature 0.7, no max_tokens);
   c. append `{"role": "assistant", "content": reply}` to `messages`;
   d. print `You: <user_message>` then `Twin: <reply>` on the next line, then a blank line.
5. After the loop print `Final messages list has N turns.` where N is `len(messages)`.

**Expected output**
```
You: Hi! What are you working on lately?
Twin: <model reply>

You: What's your take on learning by building real projects vs. reading theory?
Twin: <model reply>

Final messages list has 5 turns.
```
The count is deterministic (1 system + 2 user + 2 assistant = 5). Replies are model-dependent but should reflect your profile and tone; the second reply may reference the first turn because the history was sent.

**Hints on approach**
- The second API call must contain the first user message and first assistant reply, so append the assistant reply BEFORE the next iteration.
- Do not rebuild the system prompt inside the loop.
- Keep `messages` as one growing list; do not create a new one per turn.

**How you'll be graded**
The grader checks behaviour, not exact wording:
1. `my_profile` has the five required keys with sensible real content (lists for facts and boundaries).
2. `messages` starts with a system message produced by `build_digital_twin_system_prompt(my_profile)`.
3. Each turn appends the user message, calls `call_groq` with the entire history, then appends the assistant reply, so history grows across turns.
4. Each turn prints `You:` and `Twin:` lines.
5. The final line reports the length of `messages` (5 for two turns).
