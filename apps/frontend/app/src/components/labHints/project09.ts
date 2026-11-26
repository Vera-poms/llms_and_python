import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 9 project starter. `match` picks the cell (a piece of its starter code).
export const project09Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "for review, true_label in list(zip(sentences, labels))[:N_SAMPLES]:",
    hints: [
      {
        code: "N_SAMPLES = ...",
        text:
          "**Step 1: `N_SAMPLES`**\n" +
          "How many reviews to test.\n\n" +
          "**1)** Write `N_SAMPLES = 10`. Use this name everywhere, instead of typing 10 again.\n\n" +
          "**Check:** `N_SAMPLES` is `10`.",
      },
      {
        code: "correct = 0",
        text:
          "**Step 2: Loop over the first 10 pairs**\n" +
          "`sentences` is a list of 170 review sentences and `labels` is a list of 170 0s and 1s (1 = positive, 0 = negative). One pair looks like `(\"i loved every minute of this film\", 1)`. `correct` counts the right answers.\n\n" +
          "**1)** Before the loop, write `correct = 0`.\n" +
          "**2)** Loop with `for review, true_label in list(zip(sentences, labels))[:N_SAMPLES]:`. The `list(...)` is needed because you cannot slice a `zip` directly.\n\n" +
          "**Check:** the loop runs 10 times.",
      },
      {
        code: "reply = call_groq(...)",
        text:
          "**Step 3: Predict and convert the label**\n" +
          "`call_groq(messages)` sends the messages to Groq and gives back the reply text as a string, like `\"Positive\"` or `\"The sentiment is positive.\"`. `build_zero_shot_messages(review)` (your exercise function) builds the messages list. `parse_label(reply_text)` (also yours) turns the reply into exactly `\"positive\"` or `\"negative\"`.\n\n" +
          "**1)** Set `reply` to `call_groq(build_zero_shot_messages(review))`. Pass the full review and no extra arguments. This uses the default model and temperature 0.7, so answers can change from run to run.\n" +
          "**2)** Set `predicted` to `parse_label(reply)`.\n" +
          "**3)** Set `true_str` to `\"positive\"` if `true_label == 1`, else `\"negative\"`. A string can never equal the number `1`, so you must compare string to string.\n\n" +
          "**Check:** `predicted` and `true_str` are both strings.",
      },
      {
        code: "correct += ...",
        text:
          "**Step 4: Score it**\n" +
          "**1)** Add to `correct` whether `predicted == true_str`: `correct += (predicted == true_str)`. `True` counts as 1 and `False` as 0.\n\n" +
          "**Check:** `correct` goes up by 1 only when the two strings match.",
      },
      {
        code: "status = \"OK \" if ... else \"ERR\"",
        text:
          "**Step 5: Print one line per example**\n" +
          "**1)** Set `status` to `\"OK \"` (O, K, space) if the prediction is correct, or `\"ERR\"` if not. It is always three characters wide.\n" +
          "**2)** Print one line: `status`, a space, `predicted=` and the predicted label padded to 9 characters (`{predicted:<9}`), a space, `true=` and the true label padded to 9 characters, a space, then `review[:60]`. Cut the review only for printing. Send the full review to the model.\n\n" +
          "Example for `sentences[0]`, if the model says positive (two spaces after `positive`: one is padding, one is the separator):\n" +
          "`OK  predicted=positive  true=positive  the movie was absolutely wonderful and kept me hooked the wh`\n\n" +
          "The snippet is cut at exactly 60 characters, so it can stop in the middle of a word.\n\n" +
          "**Check:** a correct line begins `OK ` followed by a space (so `OK  predicted=`). A wrong line begins `ERR predicted=`.",
      },
      {
        code: "print(f\"\\nAccuracy on",
        text:
          "**Step 6: Print the accuracy**\n" +
          "*Accuracy* is just right answers divided by total. Do this after the loop, not inside it.\n\n" +
          "**1)** Print a blank line, then `Accuracy on <N_SAMPLES> real sentences: <correct>/<N_SAMPLES> = <percent>`. Start the f-string with `\\n` for the blank line. Get the percent as a whole number with `{correct / N_SAMPLES:.0%}`.\n\n" +
          "For example, 9 correct gives `Accuracy on 10 real sentences: 9/10 = 90%`, and 8 correct gives `... 8/10 = 80%`.\n\n" +
          "The results are not the same every run. These 10 reviews are all clearly positive, so every `true=` value is `positive`, and a good zero-shot prompt usually scores roughly 80-100%.\n\n" +
          "**Check:** the number of `OK ` lines equals `<correct>`. If the last line says 9/10, exactly 9 lines start with `OK `.",
      },
    ],
  },
];
