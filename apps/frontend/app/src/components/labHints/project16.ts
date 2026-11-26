import type { CodeHint } from "../codeHints";

export const project16Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "chunks = chunk_words(..., ..., ...)",
    hints: [
      {
        code: "clean = ...",
        text:
          "**Step 1: clean the text**\n" +
          "You get `TWIN_DOC`, a string with extra spaces and new lines. `text.split()` cuts a string into words and throws away extra spaces and new lines. `\" \".join(words)` glues them back with a single space.\n" +
          "**1)** Set `clean` to `\" \".join(TWIN_DOC.split())`. Do not change `TWIN_DOC`.\n" +
          "**Check:** `\"  \" in clean` is `False` and `\"\\n\" in clean` is `False`. `len(clean.split())` is `59`.",
      },
      {
        code: "chunks = chunk_words(..., ..., ...)",
        text:
          "**Step 2: cut it into chunks**\n" +
          "You get `clean` and your `chunk_words(text, size, overlap)`. A chunk is a short piece of the text. Overlap means each chunk starts with the last few words of the one before.\n" +
          "**1)** Set `chunks` to `chunk_words(clean, size=12, overlap=4)`.\n" +
          "**Check:** `chunks` is a list of `7` strings. The first one starts with `\"Ada writes Python code\"`.",
      },
      {
        code: "print(f\"... words -> ... chunks\")",
        text:
          "**Step 3: print the summary line**\n" +
          "You get `clean` and `chunks`.\n" +
          "**1)** Print `f\"{len(clean.split())} words -> {len(chunks)} chunks\"`.\n" +
          "**Check:** the line is `59 words -> 7 chunks`.",
      },
      {
        code: "for number, chunk in enumerate(chunks, 1):",
        text:
          "**Step 4: print every chunk**\n" +
          "You get `chunks`.\n" +
          "**1)** Loop with `for number, chunk in enumerate(chunks, 1):`. The counter starts at 1.\n" +
          "**2)** Print `[<number>] <chunk>`, like `[1] Ada writes Python code`.\n\n" +
          "The output is exactly:\n" +
          "`59 words -> 7 chunks`\n" +
          "`[1] Ada writes Python code and builds web apps every day. She bakes`\n" +
          "`[2] every day. She bakes bread and cooks spicy soup on weekends. On`\n" +
          "`[3] soup on weekends. On Saturdays she runs five kilometers in the park.`\n" +
          "`[4] kilometers in the park. Last summer she travelled to Accra and Lisbon`\n" +
          "`[5] to Accra and Lisbon by plane. She teaches evening classes about data`\n" +
          "`[6] evening classes about data and machine learning. Her favorite team is Hearts`\n" +
          "`[7] favorite team is Hearts of Oak and she watches every match.`\n" +
          "**Check:** the first line is the summary, followed by `7` numbered chunk lines, and nothing else.",
      },
    ],
  },
];
