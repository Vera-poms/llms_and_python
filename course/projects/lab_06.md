# Project: Computed vs. Published GPT-2 Parameter Counts

## Goal
The question: **how much of a language model's size is already decided by a handful of design numbers?** If a simple formula, using only those numbers, lands within 1% of the official size of a real model, then the formula captures nearly everything that matters.

You will:
1. Describe two real models, GPT-2 small and GPT-2 medium, with your `ModelConfig` class, next to their officially published parameter totals.
2. Ask `ModelConfig` for each model's parameter breakdown.
3. Adjust the total for GPT-2's weight tying (explained below).
4. Print a two-line report per model.
5. Draw a grouped bar chart of computed versus published totals.

Takeaway: architecture hyperparameters alone almost completely determine a model's size.

## Words you will see
- **Parameter**: one learned number inside the model. A "124 million parameter" model stores about 124 million numbers.
- **Hyperparameter / config**: a design choice made before training, such as how many layers the model has. These are the inputs of `ModelConfig`: `vocab_size` (how many different tokens exist), `d_model` (the width of the vectors inside the model), `n_layers` (how many transformer blocks are stacked), `n_heads` (attention heads per block), `d_ff` (the hidden width of each block's feed-forward part).
- **Dataclass**: a Python class declared with `@dataclass` that is mostly a bundle of named fields. You create one by passing the fields by keyword, e.g. `ModelConfig(vocab_size=1000, d_model=64, n_layers=2, n_heads=4, d_ff=256)`.
- **Breakdown**: the dict returned by `count_parameters()`, one entry per component of the model plus the total.
- **Weight tying**: the output head (the matrix that turns the model's final vectors back into token scores) and the input embedding table (the matrix that turns tokens into vectors) are the same size. GPT-2 reuses one matrix for both, so the real model stores it **once**. Your `ModelConfig` counts it twice, so we remove one copy.
- **Published total**: the official parameter count reported for the real model.
- **Absolute difference**: how far apart two numbers are, ignoring sign. `abs(a - b)`.
- **Thousands separators**: printing `123568896` as `123,568,896`. In an f-string, the format spec `:,` does this: `f"{123568896:,}"` gives `123,568,896`. Underscores in a number literal such as `124_439_808` are just Python's way to make long numbers readable; the value is `124439808`.
- **Grouped bar chart**: for each model (a group), two bars side by side, one per series.
- **Calls you will use** (`plt` is matplotlib.pyplot):
  - `dict.items()` gives `(key, value)` pairs, so `for name, (config, real_total) in REAL_CONFIGS.items():` unpacks the name, the config and the published total in one go.
  - `plt.figure(figsize=(7, 5))` starts a chart 7 by 5 inches.
  - `plt.bar(x_positions, heights, width=..., label=...)` draws vertical bars centered at `x_positions`.
  - `plt.xticks(positions, labels)` puts text labels under the given x positions.
  - `plt.ylabel`, `plt.title`, `plt.legend()`, `plt.tight_layout()`, `plt.show()`.

## What you start with
- `from dataclasses import dataclass` was run in the setup cell. Run the setup cell first.
- Your own exercise `ModelConfig` must be defined and run first (it is a `NameError` otherwise, and wrong formulas give wrong results here). It is a dataclass with fields `vocab_size, d_model, n_layers, n_heads, d_ff` and these methods, each returning `int` for one part of the model:
  - `embedding_params()`: the token embedding table, `vocab_size * d_model`.
  - `attention_params_per_layer()`: the four attention matrices of one block.
  - `feed_forward_params_per_layer()`: the two feed-forward matrices of one block.
  - `layernorm_params_per_layer()`: the two layer norms of one block.
  - `output_head_params()`: the output matrix, `d_model * vocab_size`.
  - `count_parameters() -> dict[str, int]`: the breakdown with keys `"embedding"`, `"attention"`, `"feed_forward"`, `"layernorm"`, `"output_head"`, `"total"`. The three per-layer entries are already multiplied by `n_layers`, and `"total"` is the sum of the other five.
- Example of what `count_parameters()` returns for a tiny config `ModelConfig(vocab_size=1000, d_model=64, n_layers=2, n_heads=4, d_ff=256)`:
  `{'embedding': 64000, 'attention': 32768, 'feed_forward': 65536, 'layernorm': 512, 'output_head': 64000, 'total': 226816}`.
- You must import matplotlib yourself: `import matplotlib.pyplot as plt`, and in a notebook also `%matplotlib inline` (so charts appear under the cell).

## Steps

### Step 1: Define `REAL_CONFIGS`
Make a dict constant named `REAL_CONFIGS`. Each key is the model name (a string). Each value is a **tuple** `(ModelConfig(...), published_total)`:
- `"GPT-2 small"`: `ModelConfig(vocab_size=50257, d_model=768, n_layers=12, n_heads=12, d_ff=3072)` and published total `124_439_808`.
- `"GPT-2 medium"`: `ModelConfig(vocab_size=50257, d_model=1024, n_layers=24, n_heads=16, d_ff=4096)` and published total `354_823_168`.

Shape of the thing:
```
REAL_CONFIGS = {"name": (ModelConfig(...), 123_456), ...}
```
Why a tuple: it keeps each model's config and its official number together, so one loop can use both.

**Check:** `len(REAL_CONFIGS) == 2`; `REAL_CONFIGS["GPT-2 small"][1] == 124439808`.

### Step 2: Get the breakdown for each model
Loop over `REAL_CONFIGS.items()`, unpack `(config, real_total)`, and call `breakdown = config.count_parameters()`. Each `breakdown` is a dict with six keys.

**Check (small):** `breakdown["embedding"] == 38597376` (that is `50257 * 768`), and `breakdown["output_head"] == 38597376`.

### Step 3: Compute the tied total
GPT-2 stores the embedding matrix only once, but your `"total"` counts it in both `"embedding"` and `"output_head"`. Fix that with one subtraction:

`tied_total = breakdown["total"] - breakdown["output_head"]`

Only the total changes. Do not edit the other dict entries. From now on, **`tied_total` is the "computed" number**.

Worked example (tiny config above): `226816 - 64000 = 162816`.

**Check:** small `tied_total == 123568896` (raw total 162166272); medium `tied_total == 353551360` (raw total 405014528).

### Step 4: Print two lines per model
Line 1 (all on one line; two spaces between the three parts):
`<name>: computed(tied)=<tied_total>  published=<published>  diff=<abs difference>`
with thousands separators on all three numbers. Build it with an f-string:
`f"{name}: computed(tied)={tied_total:,}  published={real_total:,}  diff={abs(tied_total - real_total):,}"`

Line 2: two spaces, the word `breakdown:`, a space, then the raw dict as Python prints it: `print(f"  breakdown: {breakdown}")`. The dict shows with single quotes and no separators, e.g. `{'embedding': 38597376, 'attention': 28311552, ...}`.

Expected for small:
```
GPT-2 small: computed(tied)=123,568,896  published=124,439,808  diff=870,912
  breakdown: {'embedding': 38597376, 'attention': 28311552, 'feed_forward': 56623104, 'layernorm': 36864, 'output_head': 38597376, 'total': 162166272}
```
Expected for medium:
```
GPT-2 medium: computed(tied)=353,551,360  published=354,823,168  diff=1,271,808
  breakdown: {'embedding': 51463168, 'attention': 100663296, 'feed_forward': 201326592, 'layernorm': 98304, 'output_head': 51463168, 'total': 405014528}
```

### Step 5: Collect three parallel lists
Before the loop create three empty lists, for example `names`, `computed`, `published`. Inside the loop append the model name, the `tied_total` and the `real_total`. "Parallel" means that position `i` in all three lists refers to the same model.

**Check:** after the loop each list has length 2, in the order small, medium (dicts keep insertion order).

### Step 6: Grouped bar chart
One figure, `plt.figure(figsize=(7, 5))`.
- Model `i` sits at x position `i` (0 for small, 1 for medium). Make the positions with `range(len(names))`.
- "Computed (tied)" bars are drawn at `i - 0.2` (a bit left), "published" bars at `i + 0.2` (a bit right). Use a list comprehension to shift every position: `[i - 0.2 for i in x]`.
- Each `plt.bar` call gets `width=0.4`, so the two bars touch in the middle of each group without overlapping. Labels: `label="computed (tied)"` and `label="published"`.
- Because the bars were placed at shifted positions, matplotlib would label the x axis with numbers. Call `plt.xticks(list(x), names)` so the labels under each group are the model names.
- `plt.ylabel("parameters")`, `plt.title("Computed vs. published parameter counts")`, `plt.legend()`, `plt.tight_layout()`, then `plt.show()`.

**Check:** two groups, two bars in each, legend with two entries, names under the groups (not 0 and 1).

## What a correct result looks like
Everything is deterministic (no randomness) as long as your `ModelConfig` follows the exercise formulas (no biases, no positional embeddings):
- GPT-2 small: computed `123,568,896` vs published `124,439,808`, diff `870,912` (about 0.7%).
- GPT-2 medium: computed `353,551,360` vs published `354,823,168`, diff `1,271,808` (about 0.36%).
- Each breakdown dict has the six keys listed above. For small, `embedding` and `output_head` are both `38597376`.
- The chart shows two groups of two bars. In each group the two bars look almost identical in height, because the difference is under 1%. That near match is the point of the project. The small gap comes from things the simple formula leaves out, such as positional embeddings and bias vectors.

## How you'll be graded
The grader checks behaviour and logic, not exact formatting:
1. `REAL_CONFIGS` holds both models with the correct hyperparameters and published totals.
2. The computed value is `total - output_head` (tied), not the raw total.
3. Printed output reports computed, published and absolute difference for each model, with values matching the numbers above, and shows the breakdown.
4. A grouped bar chart is produced with two series, model-name ticks, a y label, a title and a legend.
5. The project uses your working `ModelConfig` (the results are only right if your exercise is correct).
