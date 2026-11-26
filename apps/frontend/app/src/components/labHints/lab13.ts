import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 13 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab13Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def build_digital_twin_system_prompt(profile: dict)",
    hints: [
      {
        code: "def build_digital_twin_system_prompt(profile: dict) -> str:",
        block: "function",
        text:
          "Builds a system prompt that tells the model to answer AS the person in `profile`. You get `profile`, a dict with `name`, `role`, `tone` (strings) and `facts`, `boundaries` (lists of strings), like " +
          "`{\"name\": \"Ada\", \"role\": \"a data analyst\", \"tone\": \"warm, curious\", \"facts\": [\"likes pandas\"], \"boundaries\": [\"no medical advice\"]}`. " +
          "You give back one string with several lines: an intro line with the name and role, a tone line, a facts heading plus one `- ` bullet per fact, and a boundaries heading plus one `- ` bullet per boundary. For Ada, these 6 lines:\n" +
          "`You are role-playing as Ada, a data analyst.`\n`Speak in a tone that is warm, curious.`\n`Facts you can draw on about this person:`\n`- likes pandas`\n`Boundaries you must respect:`\n`- no medical advice`",
      },
      {
        code: "raise NotImplementedError(\"build_digital_twin_system_prompt()",
        text:
          "Your turn: replace this line with your code. Write it in this shape (replace each `...`):\n" +
          "`def build_digital_twin_system_prompt(profile):`\n" +
          "`    lines = [`\n" +
          "`        f\"... {profile['name']} ...\",   # intro line`\n" +
          "`        ...,                            # tone line`\n" +
          "`        ...,                            # facts heading`\n" +
          "`    ]`\n" +
          "`    for fact in ...:`\n" +
          "`        lines.append(...)`\n" +
          "`    # boundaries heading, then one bullet per boundary`\n" +
          "`    return ...`\n" +
          "**1)** Start a list `lines` with three strings: a line saying the model is role-playing as that person (use the name and role), a line with the tone, and a heading for facts.\n" +
          "**2)** For each fact, add a bullet line `\"- \" + fact` to `lines`.\n" +
          "**3)** Add a heading line for boundaries.\n" +
          "**4)** For each boundary, add a bullet line `\"- \" + boundary`.\n" +
          "**5)** Join `lines` with `\"\\n\"` and return the result.\n" +
          "It must work for any number of facts and boundaries, even zero. For Ada (with facts `likes pandas`, `runs weekly` and boundary `no medical advice`), one valid result is:\n" +
          "`You are role-playing as Ada, a data analyst.`\n`Speak in a tone that is warm, curious.`\n`Facts you can draw on about this person:`\n`- likes pandas`\n`- runs weekly`\n`Boundaries you must respect:`\n`- no medical advice`\n" +
          "That is 7 lines. With empty `facts` and `boundaries`, you get 4 lines (2 intro lines and 2 headings).\n" +
          "**Check:** `prompt.count(\"\\n- \")` equals `len(facts) + len(boundaries)` (3 for Ada), the result is a `str`, and `\"Ada\"` is in it.",
      },
      {
        code: "test_profile = {",
        text: "A test profile for Vera, with a name, a role, a tone, two facts and two boundaries.",
      },
      {
        code: "prompt = build_digital_twin_system_prompt(test_profile)",
        text: "Runs **your** function on the test profile and keeps the answer.",
      },
      {
        code: "assert \"Vera\" in prompt,",
        text: "A self-check. The name `Vera` must be in your prompt. If it is not, the check stops and shows what your code gave back.",
      },
      {
        code: "assert \"FastAPI\" in prompt,",
        text: "A self-check. The fact text `FastAPI` must be in your prompt.",
      },
      {
        code: "assert \"financial or legal advice\" in prompt,",
        text: "A self-check. The boundary text `financial or legal advice` must be in your prompt.",
      },
      {
        code: "print(\"All checks passed.\")",
        text: "If every assert passed, you see **All checks passed.** Also read your printed prompt yourself. Make sure the order and the bullets look right.",
      },
    ],
  },
];
