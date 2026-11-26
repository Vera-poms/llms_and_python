import type { CodeHint } from "../codeHints";

export const project06Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "REAL_CONFIGS = {",
    hints: [
      {
        code: "REAL_CONFIGS = {",
        text:
          "**Step 1: Define `REAL_CONFIGS`**\n" +
          "You make a dict. Each value is a tuple `(ModelConfig(...), published_total)`, where the published total is the official parameter count. Your own exercise `ModelConfig` must be defined and run first. It has the fields `vocab_size` (how many different tokens the model knows), `d_model` (the width of the number lists inside the model), `n_layers` (how many transformer blocks are stacked), `n_heads` (how many attention heads are in each block) and `d_ff` (the inner width of each block's feed-forward part).\n" +
          "**1)** Add the key `\"GPT-2 small\"` with `ModelConfig(vocab_size=50257, d_model=768, n_layers=12, n_heads=12, d_ff=3072)` and published total `124_439_808`.\n" +
          "**2)** Add the key `\"GPT-2 medium\"` with `ModelConfig(vocab_size=50257, d_model=1024, n_layers=24, n_heads=16, d_ff=4096)` and published total `354_823_168`.\n" +
          "The underscores only make the number easier to read. The value is `124439808`.\n" +
          "**Check:** `len(REAL_CONFIGS) == 2`. `REAL_CONFIGS[\"GPT-2 small\"][1] == 124439808`.",
      },
      {
        code: "breakdown = ...",
        text:
          "**Step 2: Get the breakdown for each model**\n" +
          "You get the dict from Step 1. A *breakdown* is the dict that `count_parameters()` gives back, with the keys `\"embedding\"`, `\"attention\"`, `\"feed_forward\"`, `\"layernorm\"`, `\"output_head\"` and `\"total\"`. The three per-block entries are already multiplied by `n_layers`, and `\"total\"` is the sum of the other five.\n" +
          "**1)** Loop with `for name, (config, real_total) in REAL_CONFIGS.items():`. This unpacks the name, the config and the published total.\n" +
          "**2)** Inside the loop, set `breakdown` to `config.count_parameters()`.\n" +
          "**Check (small):** `breakdown[\"embedding\"] == 38597376` (that is `50257 * 768`), and `breakdown[\"output_head\"] == 38597376`.",
      },
      {
        code: "tied_total = ...",
        text:
          "**Step 3: Work out the tied total**\n" +
          "GPT-2 shares one matrix for the embedding and the output head (weight tying), so the real model stores it once. Your `\"total\"` counts it twice.\n" +
          "**1)** Inside the loop, set `tied_total` to `breakdown[\"total\"] - breakdown[\"output_head\"]`.\n" +
          "**2)** Do not change the dict. From now on, `tied_total` is the “computed” number.\n" +
          "Example (tiny config `ModelConfig(vocab_size=1000, d_model=64, n_layers=2, n_heads=4, d_ff=256)`): `226816 - 64000 = 162816`.\n" +
          "**Check:** small `tied_total == 123568896` (raw total 162166272). Medium `tied_total == 353551360` (raw total 405014528).",
      },
      {
        code: "print(f\"{name}: computed(tied)={...:,}  published={...:,}  diff={...:,}\")",
        text:
          "**Step 4: Print two lines for each model**\n" +
          "Inside the loop:\n" +
          "**1)** Print line 1: `<name>: computed(tied)=<tied_total>  published=<real_total>  diff=<difference>`, with two spaces between the three parts.\n" +
          "**2)** Use `abs(tied_total - real_total)` for the difference. Put commas in all three numbers with the format `:,` (`123568896` becomes `123,568,896`).\n" +
          "**3)** Print line 2: two spaces, `breakdown:`, a space, then the raw dict: `print(f\"  breakdown: {breakdown}\")`.\n" +
          "Expected for small:\n" +
          "`GPT-2 small: computed(tied)=123,568,896  published=124,439,808  diff=870,912`\n" +
          "`  breakdown: {'embedding': 38597376, 'attention': 28311552, 'feed_forward': 56623104, 'layernorm': 36864, 'output_head': 38597376, 'total': 162166272}`\n" +
          "Expected for medium:\n" +
          "`GPT-2 medium: computed(tied)=353,551,360  published=354,823,168  diff=1,271,808`\n" +
          "`  breakdown: {'embedding': 51463168, 'attention': 100663296, 'feed_forward': 201326592, 'layernorm': 98304, 'output_head': 51463168, 'total': 405014528}`\n" +
          "The difference is about 0.7% for small and about 0.36% for medium.",
      },
      {
        code: "names = []",
        text:
          "**Step 5: Collect three lists in the same order**\n" +
          "**1)** Before the loop, make three empty lists: `names`, `computed` and `published`.\n" +
          "**2)** Inside the loop, add `name` to `names`.\n" +
          "**3)** Add `tied_total` to `computed`.\n" +
          "**4)** Add `real_total` to `published`.\n" +
          "The `...` line in the loop is where you also get `breakdown` and `tied_total` again, as in Steps 2 and 3.\n" +
          "**Check:** after the loop, each list has length 2, in the order small, medium.",
      },
      {
        code: "plt.figure(...)",
        text:
          "**Step 6: Grouped bar chart**\n" +
          "You must import matplotlib yourself: `import matplotlib.pyplot as plt`. In a notebook, also write `%matplotlib inline` (so charts show under the cell). Each model gets two bars side by side.\n" +
          "**1)** Start the chart with `plt.figure(figsize=(7, 5))`.\n" +
          "**2)** Set `x` to `range(len(names))`. Model `i` sits at x position `i`.\n" +
          "**3)** Draw the computed bars at `[i - 0.2 for i in x]` with `computed`, `width=0.4` and `label=\"computed (tied)\"`.\n" +
          "**4)** Draw the published bars at `[i + 0.2 for i in x]` with `published`, `width=0.4` and `label=\"published\"`.\n" +
          "**5)** Put the model names under the groups with `plt.xticks(list(x), names)`.\n" +
          "**6)** Call `plt.ylabel(\"parameters\")` and `plt.title(\"Computed vs. published parameter counts\")`.\n" +
          "**7)** Call `plt.legend()`, `plt.tight_layout()` and `plt.show()`.\n" +
          "**Check:** two groups with two bars each, a legend with two entries, and model names under the groups (not 0 and 1). The two bars in each group look almost the same height, because the difference is under 1%. That near match is the point of the project.",
      },
    ],
  },
];
