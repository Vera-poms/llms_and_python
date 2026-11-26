import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 16 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab16Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def chunk_words(",
    hints: [
      {
        code: "def chunk_words(",
        block: "function",
        text:
          "Cuts a long text into chunks of words, where each chunk repeats a few words from the end of the one before. You get `text` (a string), `size` (words per chunk) and `overlap` (words shared with the next chunk), like `(\"one two three four five\", 3, 1)`. You give back a list of strings, one per chunk, with the words joined by single spaces. It raises a `ValueError` if `overlap` is not smaller than `size`. Example: `chunk_words(\"one two three four five six seven eight nine ten\", 4, 1)` gives `[\"one two three four\", \"four five six seven\", \"seven eight nine ten\"]`.",
      },
      {
        code: "raise NotImplementedError(\"chunk_words()",
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`def chunk_words(text, size, overlap):`\n" +
          "`    if ...:`\n" +
          "`        raise ValueError(...)`\n" +
          "`    words = text.split()`\n" +
          "`    step = ...`\n" +
          "`    chunks = []`\n" +
          "`    for start in range(0, len(words), step):`\n" +
          "`        chunks.append(...)`\n" +
          "`        if ...:`\n" +
          "`            break`\n" +
          "`    return chunks`\n" +
          "(keep the `def` line that is already there, and replace each `...`)\n" +
          "**1)** If `overlap` is not smaller than `size`, raise `ValueError` with a short message.\n" +
          "**2)** Set `words` to `text.split()`.\n" +
          "**3)** Set `step` to `size - overlap`.\n" +
          "**4)** Start `chunks` as an empty list.\n" +
          "**5)** Loop with `for start in range(0, len(words), step):`.\n" +
          "**6)** Inside the loop, add `\" \".join(words[start:start + size])` to `chunks`.\n" +
          "**7)** Still inside the loop, if `start + size >= len(words)`, `break` (that chunk reached the end).\n" +
          "**8)** Return `chunks`.\n" +
          "**Check:** `chunk_words(\"one two three four five six seven eight nine ten\", 4, 1)` gives `[\"one two three four\", \"four five six seven\", \"seven eight nine ten\"]`.",
      },
      {
        code: "doc = \"one two three four five six seven eight nine ten\"",
        text: "A ten-word test text to cut into chunks.",
      },
      {
        code: "expected = [",
        text: "The three chunks you should get from the ten-word text with `size=4` and `overlap=1`. Each chunk starts with the last word of the one before.",
      },
      {
        code: "assert chunk_words(doc, 4, 1) == expected",
        text: "A self-check. The ten-word example must give exactly those three chunks. If it does not, the check stops and shows what your code gave back.",
      },
      {
        code: "assert chunk_words(\"a b c\", 5, 0)",
        text: "A short text, `\"a b c\"`, with `size=5` must give one chunk, `[\"a b c\"]`.",
      },
      {
        code: "assert chunk_words(\"\", 4, 1)",
        text: "An empty text has no words, so it must give `[]`.",
      },
      {
        code: "chunk_words(doc, 3, 3)",
        text: "Here `overlap` is not smaller than `size`, so your code must raise a `ValueError`. If it does not, the line below it fails the check on purpose.",
      },
      {
        code: "print(\"All checks passed.\")",
        text: "You only reach this line if all four checks held: the ten-word example, the short text, the empty text and the `ValueError`.",
      },
    ],
  },
];
