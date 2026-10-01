# Project: Digital Twin on a GroqClient Wrapper

**Goal**
Rebuild the Lab 13 digital twin on top of your `GroqClient` class, so the class owns the messages list and grows it inside `send()`, with a real Groq API call plugged in through the `transport` argument. This is the capstone: the same behaviour as a hand-rolled loop, now as a reusable object.

**What you start with**
Run the setup cell, then your own Lab 15 exercise code first. Available in the kernel:
- From setup: `GROQ_API_KEY`, `GROQ_API_URL`, `DEFAULT_MODEL` (`"llama-3.1-8b-instant"`), `build_request_payload`, `extract_reply`, and `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str`.
- From YOUR exercise cell (must be defined and run first): `class GroqClient` with `__init__(self, api_key, model, system_prompt=None, transport=None)`, `add_user_message(text)`, `add_assistant_message(text)`, `send(user_text) -> str` (appends the user message, calls `self.transport(self.messages, self.api_key, self.model)`, appends the reply as assistant, returns it), `reset()`, and the `history` property (copy of `self.messages`); also `fake_transport`.
- `build_digital_twin_system_prompt` from Lab 13 is NOT guaranteed to exist here, so define it again (below).

**Requirements**
1. Define `build_digital_twin_system_prompt(profile: dict) -> str`: given `name`, `role`, `tone`, `facts` (list), `boundaries` (list), return one multi-line string that tells the model it is role-playing as that person (name and role), states the speaking tone, then a heading line for facts followed by one bullet line (`- ...`) per fact, then a heading line for boundaries followed by one bullet per boundary.
2. Define `real_transport(messages: list[dict], api_key: str | None, model: str) -> str` that simply calls `call_groq(messages, api_key=api_key, model=model)` and returns the reply text.
3. Define `my_profile` (dict with keys `name`, `role`, `tone`, `facts`, `boundaries`) using your own real details: at least two facts and one boundary; not placeholder text.
4. Create `twin = GroqClient(api_key=GROQ_API_KEY, model=DEFAULT_MODEL, system_prompt=build_digital_twin_system_prompt(my_profile), transport=real_transport)`.
5. Loop over exactly these two user messages, in order: `"Hi! What are you working on lately?"` and `"What's the most useful thing you've learned recently?"`. For each, call `reply = twin.send(user_message)` (do not manage the messages list by hand) and print `You: <user_message>` then `Twin: <reply>` on the next line, followed by a blank line.
6. Afterwards print the line `--- Full messages list ---`, then loop over `twin.history` and print one line per message: the role left-aligned in a 10-character field, a space, then the first 80 characters of its content.

**Expected output**
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
The history has deterministic structure (5 entries: system, user, assistant, user, assistant); reply text is model-dependent.

**Hints on approach**
- The client does the bookkeeping; your loop only calls `send`.
- The transport has a fixed three-argument signature so the class can be tested without a network.
- Slice content for display only; do not truncate what is stored.

**How you'll be graded**
The grader checks behaviour, not exact formatting:
1. The system prompt builder includes name, role, tone, facts and boundaries as specified.
2. `real_transport` delegates to `call_groq` with the given key and model, and `twin` is a `GroqClient` wired with the system prompt and that transport.
3. Conversation happens through `twin.send(...)` for both turns, with history carried to the second call.
4. The final listing iterates `twin.history`, showing role and truncated (80-char) content, with 5 entries in the right order.
5. The profile contains real, non-placeholder content.
