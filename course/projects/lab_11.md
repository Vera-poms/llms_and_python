# Project: Direct vs. Chain-of-Thought on Reasoning Questions

**Goal**
Compare two ways of asking a small, fast LLM the same reasoning question: demanding a short answer immediately (direct) versus asking it to think step by step and finish with a marked final line (chain-of-thought, CoT). You will make live Groq calls for both styles on a few word problems and print the results side by side next to the known correct answer, so you can see whether showing work helps.

**What you start with**
Run the setup cell first, then your own Lab 11 exercise code. Available in the kernel:
- From setup: `GROQ_API_KEY` (string, entered via getpass), `GROQ_API_URL`, `DEFAULT_MODEL` (`"llama-3.1-8b-instant"`), `build_request_payload(...)`, `extract_reply(response_json)`, and `call_groq(messages, api_key=None, model=DEFAULT_MODEL, temperature=0.7, response_format=None) -> str`. `call_groq` returns the assistant's reply text and uses `GROQ_API_KEY` automatically when `api_key` is omitted.
- From YOUR exercise cell (these must be defined and run before the project cell; if you have not done so, do it now):
  - `build_direct_prompt(question: str) -> list[dict]`
  - `build_cot_prompt(question: str) -> list[dict]`
  - `extract_final_answer(reply_text: str, marker: str = "Answer:") -> str`

**Requirements**
1. Define this constant exactly (given data, a list of `(question, expected_answer)` tuples):
   ```
   QUESTIONS = [
       ("If a train travels 60 miles in 45 minutes, what is its speed in miles per hour?", "80"),
       ("A shirt costs $40 after a 20% discount. What was the original price?", "50"),
       ("Sam has 3 times as many apples as Jo. Together they have 24 apples. How many does Sam have?", "18"),
   ]
   ```
2. Loop over `QUESTIONS`, unpacking `question, expected`.
3. For each question make exactly two live calls with `call_groq`, using the default model, default temperature (0.7) and no max_tokens (the reference passes only the messages list):
   - the direct call, using `build_direct_prompt(question)` as the messages. The direct prompt is a single user message containing the question plus an instruction to answer in as few words as possible.
   - the CoT call, using `build_cot_prompt(question)` as the messages. The CoT prompt is a single user message containing the question plus an instruction to think step by step and to end the reply with a final line of the exact form `Answer: <your answer>`.
4. Run the CoT reply through `extract_final_answer` to get just the text after the last `Answer:` marker (stripped). If the marker is missing, the whole stripped reply is used.
5. For each question print, in this order (each on its own line, labels padded so values align, then a blank line):
   - `Q: <question>`
   - `  expected:            <expected>`
   - `  direct answer:       <direct reply, stripped, truncated to first 60 characters>`
   - `  chain-of-thought:    <extracted CoT answer>`
6. Do not print the full CoT reasoning, only the extracted final answer.

**Expected output**
Three blocks (one per question), each four lines plus a blank line, in this shape:
```
Q: <question text>
  expected:            80
  direct answer:       <up to 60 chars of model text>
  chain-of-thought:    <short extracted answer>

```
The `expected` values are deterministic: 80, 50, 18. The direct and CoT values are model-dependent (temperature 0.7); the direct answer is often wrong or terse, the CoT answer is usually right but may include units or a sentence fragment.

**Hints on approach**
- Reuse your three exercise functions rather than rewriting prompt logic in the loop.
- `call_groq` takes the messages list directly, which is what your prompt builders return.
- Slice the direct reply after stripping whitespace to cap it at 60 characters.
- If a call raises (bad key, rate limit), `call_groq` raises an HTTP error; check your key.

**How you'll be graded**
The grader checks behaviour, not exact formatting or wording:
1. `QUESTIONS` holds the three given pairs and the code loops over all of them.
2. Two separate live calls per question: one via the direct prompt, one via the CoT prompt (via `call_groq`, correct messages-list shape).
3. The CoT reply is parsed with `extract_final_answer` and only the extracted answer is printed for CoT.
4. The direct reply is stripped and truncated to 60 characters.
5. Output per question shows the question, the expected answer, the direct answer and the CoT answer, labelled clearly.
6. The exercise functions are reused and behave as specified (CoT prompt mentions step by step and the `Answer:` format; extraction uses the last marker, falls back to the whole stripped reply).
