# Project: Direct vs. Chain-of-Thought on Reasoning Questions

## Goal
The question: **does asking the model to think step by step before it answers make it more accurate?**

Small, fast language models often get a maths word problem wrong when they rush to answer. In this project you ask the same question two ways and compare.

This is a live project. It sends real requests to Groq, so it needs your Groq API key. Groq is the website that runs the model for you.

You will:

1. Store three word problems with their known correct answers in `QUESTIONS`.
2. Loop over them. For each question, make two separate live calls. One is **direct** (short answer only). One is **chain-of-thought** (reason first, then a final `Answer:` line).
3. Pull just the final answer out of the chain-of-thought reply.
4. Print the question, the expected answer, the direct answer and the chain-of-thought answer in aligned lines.

Takeaway: giving the model room to work often helps. And you can compare the two styles against a known right answer.

## What you start with
The setup cell has run, and your own Lab 11 exercise cell must have run too. These names exist:

| Name | What it is | Example |
|---|---|---|
| `GROQ_API_KEY` | your key (typed with getpass) | do not print it |
| `GROQ_API_URL`, `DEFAULT_MODEL` | the web address and the model name | `DEFAULT_MODEL` is `"llama-3.1-8b-instant"` |
| `build_request_payload(...)`, `extract_reply(response_json)` | helpers used inside `call_groq`; you will not call them | |
| `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str` | sends the list of messages and gives back the reply text; uses `GROQ_API_KEY` for you | `call_groq([{"role": "user", "content": "Hi"}])` gives something like `"Hello!"` |

A *message* is one chat turn, written as a dict like `{"role": "user", "content": "..."}`. A list of messages is what you send to `call_groq`.

Your own functions (written in the exercise cell). They must be defined and run before the project cell, so do that now if you have not:

- `build_direct_prompt(question: str) -> list[dict]`: a list with one user message. It holds the question plus a request to answer in as few words as possible. This is *direct prompting*.
- `build_cot_prompt(question: str) -> list[dict]`: a list with one user message. It holds the question plus a request to think step by step and end with a last line of the exact form `Answer: <your answer>`. This is *chain-of-thought* prompting. Writing out the steps gives the model room to work.
- `extract_final_answer(reply_text: str, marker: str = "Answer:") -> str`: gives back the text after the last `Answer:`, with spaces and new lines removed from both ends. The `Answer:` label is called a *marker*. It tells your code where the final answer starts. If the marker is missing, you get the whole reply, with the spaces removed.

Example of what they give back (shape only):

```
build_direct_prompt("What is 2+2?")  ->  [{"role": "user", "content": "What is 2+2? Answer in as few words as possible."}]
extract_final_answer("2+2 is 4.\nAnswer: 4")  ->  "4"
```

Use these functions. Do not write the prompt text again inside the loop.

## Steps

### Step 1: Define `QUESTIONS`
Code shape (replace each `...`):
```python
QUESTIONS = [
    (..., ...),
    (..., ...),
    (..., ...),
]
```
Why: this is your test set. Each entry holds the question and the known right answer, so you can compare.

Copy this constant exactly. It is a list of three `(question, expected_answer)` tuples. A *tuple* is a fixed pair like `("x", "1")`. The expected answers are strings, not numbers:

```
QUESTIONS = [
    ("If a train travels 60 miles in 45 minutes, what is its speed in miles per hour?", "80"),
    ("A shirt costs $40 after a 20% discount. What was the original price?", "50"),
    ("Sam has 3 times as many apples as Jo. Together they have 24 apples. How many does Sam have?", "18"),
]
```

You can check the answers by hand. The train goes 60 miles in 0.75 hours, so 60 / 0.75 = 80 mph. The shirt costs 80% of the original, so 40 / 0.8 = 50. Jo has J apples and Sam has 3J, so 4J = 24, J = 6, and Sam has 18.

**Check:** `len(QUESTIONS)` is 3 and `QUESTIONS[0][1]` is `"80"`.

### Step 2: Loop and unpack
Code shape:
```python
for ..., ... in QUESTIONS:
    ...
```
Write `for question, expected in QUESTIONS:`. This is *tuple unpacking*: each pass splits the pair into two names. `question` is the text and `expected` is the answer string. For example, `for a, b in [("x", "1")]:` gives `a = "x"` and `b = "1"`.

**Check:** the loop body runs 3 times.

### Step 3: Make exactly two live calls per question
Code shape:
```python
direct_reply = call_groq(...)
cot_reply = call_groq(...)
```
Why: one call per style lets you compare them on the very same question.

Use the default model, the default temperature (0.7) and no `max_tokens`. The temperature is how random the model's word choice is, so answers change from run to run. Give `call_groq` only the list of messages.

- Direct call: `call_groq(build_direct_prompt(question))`. Save the reply text in a variable such as `direct_reply`.
- CoT call: `call_groq(build_cot_prompt(question))`. Save the reply in a variable such as `cot_reply`.

These are two separate calls. Do not use one reply for both. So the whole project makes 3 x 2 = 6 calls.

`call_groq(messages)` gives back the model's reply as one string.

**Check:** if you add a counter, it reaches 6 at the end.

### Step 4: Extract the CoT final answer
Code shape:
```python
cot_answer = ...
```
Why: the CoT reply is long (all the steps). You only want the final line to compare.

Call `extract_final_answer(cot_reply)`. It keeps what is after the last `Answer:` and removes the spaces around it. If the marker is missing, you get the whole reply with the spaces removed.

Example. If the model replies:

```
Step 1: 45 minutes is 0.75 hours.
Step 2: 60 / 0.75 = 80.
Answer: 80 mph
```

then `extract_final_answer(...)` gives back `"80 mph"`. The model may add units, so the value may not be exactly `"80"`. That is allowed.

**Check:** the extracted value is a short string, not all the steps.

### Step 5: Print the four labelled lines
Code shape:
```python
print(f"Q: {...}")
print(f"  expected:            {...}")
print(f"  direct answer:       {...}")
print(f"  chain-of-thought:    {...}")
print()
```
Why: with the answers side by side, they are easy to compare.

For each question, print these lines in this order. Use exactly the label text shown, with spaces so the values line up (they start in the same column):

```
Q: <question>
  expected:            <expected>
  direct answer:       <direct reply, stripped, first 60 characters>
  chain-of-thought:    <extracted CoT answer>
<blank line>
```

Details:

- For the direct answer, call `.strip()` on the reply first. `.strip()` removes spaces and new lines from both ends of a string. Then slice with `[:60]` to keep the first 60 characters. The order matters: strip first, so leading spaces do not use up your 60 characters. Example: `("  " + "x" * 70).strip()[:60]` gives 60 `x` characters.
- For the CoT line, print only the extracted answer. Do not print all the steps.
- The blank line is just `print()`.
- The label lines start with two spaces. `expected:` is followed by 12 spaces, `direct answer:` by 7 and `chain-of-thought:` by 4. Then the values line up in one column.

**Check:** your output has 3 blocks, each with 4 lines plus a blank line.
