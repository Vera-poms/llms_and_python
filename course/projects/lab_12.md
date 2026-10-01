# Project: One Persona, Many Questions (System Instruction Check)

**Goal**
Build a single system prompt from a persona and reuse it, unchanged, across several very different user questions with live Groq calls. The aim is to spot-check that a system instruction (name, role, tone, rules) keeps shaping replies, including on a question that tempts the model to break a rule (mentioning a competitor).

**What you start with**
Run the setup cell first, then your own Lab 12 exercise code. Available in the kernel:
- From setup: `GROQ_API_KEY`, `GROQ_API_URL`, `DEFAULT_MODEL` (`"llama-3.1-8b-instant"`), `build_request_payload`, `extract_reply`, and `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str` (returns the reply text; uses `GROQ_API_KEY` automatically).
- From YOUR exercise cell, which must be defined and run before the project cell:
  - `build_system_message(persona: dict) -> str` - turns a dict with keys `name`, `role`, `tone`, `constraints` (list of strings) into one system prompt string stating the name, role and tone and listing each constraint as its own bullet/line.
  - the `persona` dict, which the exercise cell defines (re-create it if missing):
    ```
    persona = {
        "name": "Rae",
        "role": "a friendly customer support agent for a coffee subscription service",
        "tone": "warm and concise",
        "constraints": ["never mention competitors", "always ask if there's anything else before ending"],
    }
    ```

**Requirements**
1. Define this given constant:
   ```
   QUESTIONS = [
       "What's the best way to grind beans for a French press?",
       "Do you sell dark roast?",
       "I'm frustrated, my last order arrived stale. What can you do?",
       "What do you think of [a competing coffee brand]?",
   ]
   ```
2. Build the system prompt ONCE, before the loop, by calling `build_system_message(persona)` and storing it in a variable named `system_message`.
3. For each question, build a fresh two-element `messages` list: first `{"role": "system", "content": system_message}`, then `{"role": "user", "content": <question>}`. Each question is an independent single-turn conversation (no history carried between questions).
4. Call `call_groq(messages)` with defaults (model `llama-3.1-8b-instant`, temperature 0.7, no max_tokens).
5. Print, for each question, `Q: <question>` then on the next line `A: <full reply>`, followed by a blank line (full reply, not truncated).

**Expected output**
Four blocks:
```
Q: <question>
A: <model reply, possibly several lines>

```
Replies are model-dependent. If the system prompt works, replies should sound warm and concise as Rae, avoid naming or praising competitors on the fourth question, and typically end by asking whether there is anything else.

**Hints on approach**
- The same system string is reused each iteration; only the user message varies.
- Create the messages list inside the loop so questions don't contaminate each other.
- Make sure your `build_system_message` actually includes the persona's name, role, tone and every constraint, otherwise the live replies will not show the persona.

**How you'll be graded**
The grader checks behaviour, not exact wording:
1. `QUESTIONS` contains the four given strings and all are processed.
2. The system message is produced by `build_system_message(persona)` and includes name, role, tone and each constraint.
3. Every call's messages list is `[system, user]` with the correct role keys, the system message identical across calls, one fresh list per question.
4. Each reply comes from a live `call_groq` call.
5. Output pairs each question with its full reply (`Q:` / `A:`).
