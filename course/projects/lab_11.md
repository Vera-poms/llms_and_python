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
Copy this constant exactly. It is three `(question, expected_answer)` tuples. The expected answers are strings, not numbers:

```
QUESTIONS = [
    ("If a train travels 60 miles in 45 minutes, what is its speed in miles per hour?", "80"),
    ("A shirt costs $40 after a 20% discount. What was the original price?", "50"),
    ("Sam has 3 times as many apples as Jo. Together they have 24 apples. How many does Sam have?", "18"),
]
```

**Check:** `len(QUESTIONS)` is 3 and `QUESTIONS[0][1]` is `"80"`.

### Step 2: Loop and unpack
Code shape:
```python
for ..., ... in QUESTIONS:
    ...
```
You get the list from Step 1. Write the code that does this step:

1. Write `for question, expected in QUESTIONS:`. Each pass splits one tuple into the question text and the expected answer string. Steps 3 to 5 go inside this loop.

**Check:** the loop body runs 3 times.

### Step 3: Make exactly two live calls per question
Code shape:
```python
direct_reply = call_groq(...)
cot_reply = call_groq(...)
```
Use the default model, the default temperature (0.7) and no `max_tokens`. Give `call_groq` only the list of messages. Write the code that does these steps:

1. Set `direct_reply` to `call_groq(build_direct_prompt(question))`.
2. Set `cot_reply` to `call_groq(build_cot_prompt(question))`.

These are two separate calls. Do not use one reply for both. The whole project makes 3 x 2 = 6 calls.

**Check:** if you add a counter, it reaches 6 at the end.

### Step 4: Extract the CoT final answer
Code shape:
```python
cot_answer = ...
```
You get `cot_reply`, the long reply with all the steps. Write the code that does this step:

1. Set `cot_answer` to `extract_final_answer(cot_reply)`.

If the model replies `Step 1: 45 minutes is 0.75 hours.\nStep 2: 60 / 0.75 = 80.\nAnswer: 80 mph`, you get `"80 mph"`. Units are allowed, so it does not have to be exactly `"80"`.

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
For each question, write the code that does these steps:

1. Print `Q: ` followed by `question`.
2. Print `expected:` with two spaces before it and 12 spaces after it, then `expected`.
3. Print `direct answer:` with two spaces before it and 7 spaces after it, then `direct_reply` with `.strip()` first and then `[:60]`. Strip first, so leading spaces do not use up your 60 characters.
4. Print `chain-of-thought:` with two spaces before it and 4 spaces after it, then only `cot_answer` (not the steps).
5. Print an empty line with `print()`.

The output for one question looks like this (the values line up in one column):

```
Q: <question>
  expected:            <expected>
  direct answer:       <direct reply, stripped, first 60 characters>
  chain-of-thought:    <extracted CoT answer>
<blank line>
```

**Check:** your output has 3 blocks, each with 4 lines plus a blank line.
