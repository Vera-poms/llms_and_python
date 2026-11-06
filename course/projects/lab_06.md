# Project: Computed vs. Published GPT-2 Parameter Counts

## Goal
The question: **how much of a language model's size is already decided by a handful of design numbers?** If a simple formula, using only those numbers, lands within 1% of the official size of a real model, then the formula captures nearly everything that matters.

A *parameter* is one learned number inside the model. A "124 million parameter" model stores about 124 million numbers.

You will:
1. Describe two real models, GPT-2 small and GPT-2 medium, with your `ModelConfig` class. Put each next to its officially published parameter total.
2. Ask `ModelConfig` for each model's parameter breakdown.
3. Adjust the total for GPT-2's weight tying (explained in Step 3).
4. Print a two-line report for each model.
5. Draw a grouped bar chart of computed totals next to published totals.

Takeaway: the design numbers alone almost completely decide a model's size.

## What you start with
- `from dataclasses import dataclass` was run in the setup cell. Run the setup cell first.
- Your own exercise `ModelConfig` must be defined and run first. If not, you get a `NameError`, and wrong formulas give wrong results here. It is a *dataclass*: a Python class declared with `@dataclass` that is mostly a bundle of named fields. You make one by giving the fields by name, like `ModelConfig(vocab_size=1000, d_model=64, n_layers=2, n_heads=4, d_ff=256)`. Its fields are design choices made before training:
  - `vocab_size`: how many different tokens the model knows.
  - `d_model`: the width of the number lists inside the model.
  - `n_layers`: how many transformer blocks are stacked.
  - `n_heads`: how many attention heads are in each block.
  - `d_ff`: the inner width of each block's feed-forward part.
- It has these methods. Each gives back an `int` for one part of the model:
  - `embedding_params()`: the token embedding table, `vocab_size * d_model`.
  - `attention_params_per_layer()`: the four attention matrices of one block.
  - `feed_forward_params_per_layer()`: the two feed-forward matrices of one block.
  - `layernorm_params_per_layer()`: the two layer norms of one block.
  - `output_head_params()`: the output matrix, `d_model * vocab_size`.
  - `count_parameters() -> dict[str, int]`: the *breakdown*, a dict with the keys `"embedding"`, `"attention"`, `"feed_forward"`, `"layernorm"`, `"output_head"`, `"total"`. The three per-block entries are already multiplied by `n_layers`. `"total"` is the sum of the other five.
- Example of what `count_parameters()` gives back for the tiny config `ModelConfig(vocab_size=1000, d_model=64, n_layers=2, n_heads=4, d_ff=256)`:
  `{'embedding': 64000, 'attention': 32768, 'feed_forward': 65536, 'layernorm': 512, 'output_head': 64000, 'total': 226816}`.
- You must import matplotlib yourself: `import matplotlib.pyplot as plt`. In a notebook, also write `%matplotlib inline` (so charts show under the cell).

## Steps

### Step 1: Define `REAL_CONFIGS`
Code shape (replace each `...`):
```python
REAL_CONFIGS = {
    "GPT-2 small": (ModelConfig(...), ...),
    "GPT-2 medium": (ModelConfig(...), ...),
}
```
You make a dict. Each value is a tuple `(ModelConfig(...), published_total)`, where the published total is the official parameter count.

Write the code that does these steps:

1. Add the key `"GPT-2 small"` with `ModelConfig(vocab_size=50257, d_model=768, n_layers=12, n_heads=12, d_ff=3072)` and published total `124_439_808`.
2. Add the key `"GPT-2 medium"` with `ModelConfig(vocab_size=50257, d_model=1024, n_layers=24, n_heads=16, d_ff=4096)` and published total `354_823_168`.

The underscores only make the number easier to read. The value is `124439808`.

**Check:** `len(REAL_CONFIGS) == 2`. `REAL_CONFIGS["GPT-2 small"][1] == 124439808`.

### Step 2: Get the breakdown for each model
Code shape:
```python
for name, (config, real_total) in REAL_CONFIGS.items():
    breakdown = ...
```
You get the dict from Step 1. Write the code that does these steps:

1. Loop with `for name, (config, real_total) in REAL_CONFIGS.items():`. This unpacks the name, the config and the published total.
2. Inside the loop, set `breakdown` to `config.count_parameters()`.

**Check (small):** `breakdown["embedding"] == 38597376` (that is `50257 * 768`), and `breakdown["output_head"] == 38597376`.

### Step 3: Work out the tied total
Code shape:
```python
tied_total = ...
```
GPT-2 shares one matrix for the embedding and the output head (weight tying), so the real model stores it once. Your `"total"` counts it twice. Write the code that does these steps:

1. Inside the loop, set `tied_total` to `breakdown["total"] - breakdown["output_head"]`.
2. Do not change the dict. From now on, `tied_total` is the "computed" number.

Example (tiny config): `226816 - 64000 = 162816`.

**Check:** small `tied_total == 123568896` (raw total 162166272). Medium `tied_total == 353551360` (raw total 405014528).

### Step 4: Print two lines for each model
Code shape:
```python
print(f"{name}: computed(tied)={...:,}  published={...:,}  diff={...:,}")
print(f"  breakdown: {...}")
```
Inside the loop, write the code that does these steps:

1. Print line 1: `<name>: computed(tied)=<tied_total>  published=<real_total>  diff=<difference>`, with two spaces between the three parts.
2. Use `abs(tied_total - real_total)` for the difference. Put commas in all three numbers with the format `:,` (`123568896` becomes `123,568,896`).
3. Print line 2: two spaces, `breakdown:`, a space, then the raw dict: `print(f"  breakdown: {breakdown}")`.

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
The difference is about 0.7% for small and about 0.36% for medium.

### Step 5: Collect three lists in the same order
Code shape:
```python
names = []
computed = []
published = []
for name, (config, real_total) in REAL_CONFIGS.items():
    ...
    names.append(...)
    computed.append(...)
    published.append(...)
```
Write the code that does these steps:

1. Before the loop, make three empty lists: `names`, `computed` and `published`.
2. Inside the loop, add `name` to `names`.
3. Add `tied_total` to `computed`.
4. Add `real_total` to `published`.

**Check:** after the loop, each list has length 2, in the order small, medium.

### Step 6: Grouped bar chart
Code shape:
```python
plt.figure(...)
x = range(len(names))
plt.bar([... for i in x], computed, width=..., label="computed (tied)")
plt.bar([... for i in x], published, width=..., label="published")
plt.xticks(list(x), names)
# then: ylabel, title, legend, tight_layout, show
```
Each model gets two bars side by side. Write the code that does these steps:

1. Start the chart with `plt.figure(figsize=(7, 5))`.
2. Set `x` to `range(len(names))`. Model `i` sits at x position `i`.
3. Draw the computed bars at `[i - 0.2 for i in x]` with `computed`, `width=0.4` and `label="computed (tied)"`.
4. Draw the published bars at `[i + 0.2 for i in x]` with `published`, `width=0.4` and `label="published"`.
5. Put the model names under the groups with `plt.xticks(list(x), names)`.
6. Call `plt.ylabel("parameters")` and `plt.title("Computed vs. published parameter counts")`.
7. Call `plt.legend()`, `plt.tight_layout()` and `plt.show()`.

**Check:** two groups with two bars each, a legend with two entries, and model names under the groups (not 0 and 1). The two bars in each group look almost the same height, because the difference is under 1%. That near match is the point of the project.
