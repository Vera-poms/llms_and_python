import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 11 project starter. `match` picks the cell (a line of the starter).
export const project11Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "direct_reply = ...",
    hints: [
      {
        code: "QUESTIONS = [",
        text:
          "**Step 1: Define `QUESTIONS`**\n" +
          "Replace each `...`. Copy this constant exactly. It is three `(question, expected_answer)` tuples. The expected answers are strings, not numbers:\n" +
          "`QUESTIONS = [`\n" +
          "`    (\"If a train travels 60 miles in 45 minutes, what is its speed in miles per hour?\", \"80\"),`\n" +
          "`    (\"A shirt costs $40 after a 20% discount. What was the original price?\", \"50\"),`\n" +
          "`    (\"Sam has 3 times as many apples as Jo. Together they have 24 apples. How many does Sam have?\", \"18\"),`\n" +
          "`]`\n" +
          "**Check:** `len(QUESTIONS)` is 3 and `QUESTIONS[0][1]` is `\"80\"`.",
      },
      {
        code: "for question, expected in QUESTIONS:",
        text:
          "**Step 2: Loop and unpack**\n" +
          "You get the list from Step 1. Write the code that does this step:\n" +
          "**1)** Write `for question, expected in QUESTIONS:`. Each pass splits one tuple into the question text (`question`) and the expected answer string (`expected`). Steps 3 to 5 go inside this loop.\n" +
          "**Check:** the loop body runs 3 times.",
      },
      {
        code: "direct_reply = ...",
        text:
          "**Step 3: Make exactly two live calls per question**\n" +
          "Use the default model, the default temperature (0.7) and no `max_tokens`. Give `call_groq` only the list of messages. Write the code that does these steps:\n" +
          "**1)** Set `direct_reply` to `call_groq(build_direct_prompt(question))`.\n" +
          "**2)** Set `cot_reply` to `call_groq(build_cot_prompt(question))`.\n" +
          "These are two separate calls. Do not use one reply for both. The whole project makes 3 x 2 = 6 calls. Use your two prompt builders from the exercise cell. Do not write the prompt text again inside the loop.\n" +
          "**Check:** if you add a counter, it reaches 6 at the end.",
      },
      {
        code: "cot_reply = ...",
        text: "The chain-of-thought reply: the long text with all the steps and a last `Answer:` line. Set it to `call_groq(build_cot_prompt(question))`.",
      },
      {
        code: "cot_answer = ...",
        text:
          "**Step 4: Extract the CoT final answer**\n" +
          "You get `cot_reply`, the long reply with all the steps. Write the code that does this step:\n" +
          "**1)** Set `cot_answer` to `extract_final_answer(cot_reply)`.\n" +
          "If the model replies `Step 1: 45 minutes is 0.75 hours.\\nStep 2: 60 / 0.75 = 80.\\nAnswer: 80 mph`, you get `\"80 mph\"`. Units are allowed, so it does not have to be exactly `\"80\"`.\n" +
          "**Check:** the extracted value is a short string, not all the steps.",
      },
      {
        code: "print(f\"Q: {...}\")",
        text:
          "**Step 5: Print the four labelled lines**\n" +
          "For each question, write the code that does these steps:\n" +
          "**1)** Print `Q: ` followed by `question`.\n" +
          "**2)** Print `expected:` with two spaces before it and 12 spaces after it, then `expected`.\n" +
          "**3)** Print `direct answer:` with two spaces before it and 7 spaces after it, then `direct_reply` with `.strip()` first and then `[:60]`. Strip first, so leading spaces do not use up your 60 characters.\n" +
          "**4)** Print `chain-of-thought:` with two spaces before it and 4 spaces after it, then only `cot_answer` (not the steps).\n" +
          "**5)** Print an empty line with `print()`.\n" +
          "The output for one question looks like this (the values line up in one column):\n" +
          "`Q: <question>`\n" +
          "`  expected:            <expected>`\n" +
          "`  direct answer:       <direct reply, stripped, first 60 characters>`\n" +
          "`  chain-of-thought:    <extracted CoT answer>`\n" +
          "`<blank line>`\n" +
          "**Check:** your output has 3 blocks, each with 4 lines plus a blank line.",
      },
    ],
  },
];
