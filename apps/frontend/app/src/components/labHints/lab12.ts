import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 12 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab12Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def build_system_message(",
    hints: [
      {
        code: "def build_system_message(persona: dict) -> str:",
        block: "function",
        text:
          "Turns a persona into one system prompt string. You get `persona`, a dict with `name`, `role`, `tone` (strings) and `constraints` (a list of rule strings), like " +
          "`{\"name\": \"Rae\", \"role\": \"a friendly support agent\", \"tone\": \"warm\", \"constraints\": [\"never mention competitors\"]}`. " +
          "You give back a string with several lines, like:\n" +
          "`You are Rae, a friendly support agent.`\n`Your tone is warm.`\n`Rules you must always follow:`\n`- never mention competitors`\n" +
          "Your words may be different, but the name, the role, the tone and every constraint must be in it, each constraint on its own line.",
      },
      {
        code: "raise NotImplementedError(\"build_system_message()",
        text:
          "Your turn: replace this line with your code. Write it in this shape (replace each `...`):\n" +
          "`def build_system_message(persona):`\n" +
          "`    lines = [`\n" +
          "`        f\"You are {...}, {...}.\",`\n" +
          "`        f\"Your tone is {...}.\",`\n" +
          "`        \"Rules you must always follow:\",`\n" +
          "`    ]`\n" +
          "`    for rule in ...:`\n" +
          "`        lines.append(...)`\n" +
          "`    return \"\\n\".join(lines)`\n" +
          "**1)** Start a list `lines` with three strings: one with the name and the role, one with the tone, and the heading `Rules you must always follow:`.\n" +
          "**2)** For each rule in `persona[\"constraints\"]`, add the line `\"- \" + rule` to `lines`. Copy each rule exactly as given.\n" +
          "**3)** Join `lines` with `\"\\n\"` and return the result.\n" +
          "For Rae, the result looks like this (your words may differ):\n" +
          "`You are Rae, a friendly customer support agent for a coffee subscription service.`\n`Your tone is warm and concise.`\n`Rules you must always follow:`\n`- never mention competitors`\n`- always ask if there's anything else before ending`\n" +
          "If `constraints` is empty, there are no `- ` lines.\n" +
          "**Check:** with `{\"name\": \"Bo\", \"role\": \"a tutor\", \"tone\": \"calm\", \"constraints\": [\"be brief\"]}`, your prompt has `Bo`, `a tutor`, `calm` and the line `- be brief` in it.",
      },
      {
        code: "persona = {",
        text: "A test persona for Rae, a coffee shop support agent. It has a name, a role, a tone and two rules.",
      },
      {
        code: "prompt = build_system_message(persona)",
        text: "Runs **your** `build_system_message` on the test persona and keeps the answer.",
      },
      {
        code: "assert \"Rae\" in prompt,",
        text: "A self-check. The name `Rae` must be in your prompt. If it is not, the check stops and shows what your code gave back.",
      },
      {
        code: "assert \"coffee subscription\" in prompt,",
        text: "A self-check. The role text `coffee subscription` must be in your prompt.",
      },
      {
        code: "assert \"never mention competitors\" in prompt,",
        text: "A self-check. The rule `never mention competitors` must be in your prompt.",
      },
      {
        code: "print(\"All checks passed.\")",
        text: "If every check above passed, you see `All checks passed.` If you see `NotImplementedError`, replace the `raise` line with your code.",
      },
    ],
  },
];
