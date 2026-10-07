# Project: Direct vs. Chain-of-Thought on Reasoning Questions

## Goal

Small, fast language models often get a maths word problem wrong when they are rushed to blurt out an answer. The real question here is: **does asking the model to think step by step before answering make it more accurate?**

This is a live project. It sends real requests to Groq, so it needs your Groq API key.

You will:

1. Store three word problems with their known correct answers in `QUESTIONS`.
2. Loop over them. For each question, make two separate live calls: a **direct** one (short answer only) and a **chain-of-thought** one (reason first, then a final `Answer:` line).
3. Pull just the final answer out of the chain-of-thought reply.
4. Print the question, the expected answer, the direct answer and the chain-of-thought answer in aligned lines.

Takeaway: showing the model room to work often helps, and you can compare the two styles against a known right answer.

## Words you will see

- **LLM**: a large language model. Here, `llama-3.1-8b-instant` on Groq.
- **API call**: your code sends a request over the internet and gets the model's reply. `call_groq` does it.
- **Message**: one chat turn, written as a dict like `{"role": "user", "content": "..."}`. A **messages list** is a list of those dicts.
- **Direct prompting**: ask the question and demand a very short answer immediately.
- **Chain-of-thought (CoT)**: ask the model to write out its reasoning step by step first. The extra reasoning text gives it room to work.
- **Marker**: an agreed label in the reply, here `Answer:`, that tells your code where the final answer starts. Marking it lets code find the answer inside a long reply.
- **Expected answer**: the known correct answer, stored as a string such as `"80"`.
- **Tuple unpacking**: writing `question, expected = item` splits a 2-item tuple into two names. In a loop, `for question, expected in QUESTIONS:` does it for you.
- **Slicing**: `text[:60]` keeps the first 60 characters.
- **`.strip()`**: a string method that removes whitespace (spaces, newlines) from both ends.
- **Temperature**: how random the model's word choice is. The default here is 0.7, so answers vary between runs.
- **Non-deterministic**: the output can change every run.

## What you start with

The setup cell has run, and your own Lab 11 exercise cell must have run too. These names exist:

| Name | What it is | Example |
|---|---|---|
| `GROQ_API_KEY` | your key (typed via getpass) | do not print it |
| `GROQ_API_URL`, `DEFAULT_MODEL` | web address and model name | `DEFAULT_MODEL` is `"llama-3.1-8b-instant"` |
| `build_request_payload(...)`, `extract_reply(response_json)` | helpers used inside `call_groq`; you will not call them | |
| `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str` | sends the messages list and returns the reply text; uses `GROQ_API_KEY` automatically | `call_groq([{"role": "user", "content": "Hi"}])` gives something like `"Hello!"` |

Your own functions (written in the exercise cell; they must be defined and run before the project cell, so do that now if you have not):

- `build_direct_prompt(question: str) -> list[dict]`: a messages list with one user message: the question plus an instruction to answer in as few words as possible.
- `build_cot_prompt(question: str) -> list[dict]`: a messages list with one user message: the question plus an instruction to think step by step and end with a final line of the exact form `Answer: <your answer>`.
- `extract_final_answer(reply_text: str, marker: str = "Answer:") -> str`: returns the stripped text after the last `Answer:` marker. If the marker is missing, it returns the whole reply, stripped.

Example of what they return (shape only):

```
build_direct_prompt("What is 2+2?")  ->  [{"role": "user", "content": "What is 2+2? Answer in as few words as possible."}]
extract_final_answer("2+2 is 4.\nAnswer: 4")  ->  "4"
```

Reuse these functions. Do not rewrite the prompt text inside the loop.

## Steps

### Step 1: Define `QUESTIONS`

Why: it is your test set. Each entry holds the question and the known right answer so you can compare.

Copy this constant exactly. It is a list of three `(question, expected_answer)` tuples. The expected answers are strings, not numbers:

```
QUESTIONS = [
    ("If a train travels 60 miles in 45 minutes, what is its speed in miles per hour?", "80"),
    ("A shirt costs $40 after a 20% discount. What was the original price?", "50"),
    ("Sam has 3 times as many apples as Jo. Together they have 24 apples. How many does Sam have?", "18"),
]
```

You can check the answers by hand. The train goes 60 miles in 0.75 hours, so 60 / 0.75 = 80 mph. The shirt is 80% of the original, so 40 / 0.8 = 50. Jo has J apples and Sam has 3J, so 4J = 24, J = 6 and Sam has 18.

**Check:** `len(QUESTIONS)` is 3 and `QUESTIONS[0][1]` is `"80"`.

### Step 2: Loop and unpack

Write `for question, expected in QUESTIONS:`. Each pass, `question` is the text and `expected` is the answer string. For example, `for a, b in [("x", "1")]:` gives `a = "x"`, `b = "1"`.

**Check:** the loop body runs 3 times.

### Step 3: Make exactly two live calls per question

Why: one call per style lets you compare them on the very same question.

Use the default model, the default temperature (0.7) and no `max_tokens`. Pass only the messages list.

- Direct call: `call_groq(build_direct_prompt(question))`. Save the reply text (a string) in a variable such as `direct_reply`.
- CoT call: `call_groq(build_cot_prompt(question))`. Save the reply in a variable such as `cot_reply`.

These are two separate calls. Do not reuse one reply for both. So the whole project makes 3 x 2 = 6 calls.

Library call to know: `call_groq(messages)` returns the model's reply as one string.

**Check:** if you add a counter, it reaches 6 by the end.

### Step 4: Extract the CoT final answer

Why: the CoT reply is long (all the reasoning). You only want the final line for comparison.

Call `extract_final_answer(cot_reply)`. It keeps what is after the last `Answer:` and strips the whitespace. If the marker is missing, you get the whole stripped reply.

Worked example. If the model replies:

```
Step 1: 45 minutes is 0.75 hours.
Step 2: 60 / 0.75 = 80.
Answer: 80 mph
```

then `extract_final_answer(...)` returns `"80 mph"`. The model may add units, so the value may not be exactly `"80"`. That is allowed.

**Check:** the extracted value is a short string, not the whole reasoning.

### Step 5: Print the four labelled lines

Why: laid out side by side, the three versions of each answer are easy to compare.

For each question, print these lines in this order. Use exactly the label text shown, with spaces so the values line up (the values start in the same column):

```
Q: <question>
  expected:            <expected>
  direct answer:       <direct reply, stripped, first 60 characters>
  chain-of-thought:    <extracted CoT answer>
<blank line>
```

Details:

- For the direct answer, call `.strip()` on the reply first, then slice `[:60]`. Order matters: strip first so leading spaces do not eat your 60 characters. Example: `("  " + "x" * 70).strip()[:60]` gives 60 `x` characters.
- For the CoT line, print only the extracted answer. Do not print the full reasoning.
- The blank line is just `print()`.
- The label lines start with two spaces. `expected:` is followed by 12 spaces, `direct answer:` by 7 and `chain-of-thought:` by 4, so the values line up in one column.

**Check:** your output has 3 blocks, each of 4 lines plus a blank line.

## What a correct result looks like

Three blocks like this (your values will differ):

```
Q: <question text>
  expected:            80
  direct answer:       <up to 60 chars of model text>
  chain-of-thought:    <short extracted answer>

```

- Deterministic: the `Q:` lines and the `expected` values (`80`, `50`, `18`) are always the same.
- Not deterministic: the direct and CoT values change run to run (temperature 0.7).
- What you will often see: the direct answer is terse and sometimes wrong. The CoT answer is usually right, but may include units or a sentence fragment (for example `80 mph` or `$50`).
- If a CoT answer looks like a whole paragraph, the model forgot the `Answer:` marker, so your function returned the whole reply. That can happen occasionally and is not a bug in your loop.
- Needs network access and a valid key. A `401` error means a bad key. A `429` error means a rate limit, so wait and re-run.

## How you'll be graded

The grader checks behaviour, not exact formatting or wording:

1. `QUESTIONS` holds the three given pairs and the code loops over all of them.
2. Two separate live calls per question: one via the direct prompt, one via the CoT prompt (via `call_groq`, correct messages-list shape).
3. The CoT reply is parsed with `extract_final_answer` and only the extracted answer is printed for CoT.
4. The direct reply is stripped and truncated to 60 characters.
5. Output per question shows the question, the expected answer, the direct answer and the CoT answer, labelled clearly.
6. The exercise functions are reused and behave as specified (CoT prompt mentions step by step and the `Answer:` format; extraction uses the last marker, falls back to the whole stripped reply).
