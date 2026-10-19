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
Make a dict constant named `REAL_CONFIGS`. Each key is the model name (a string). Each value is a **tuple** `(ModelConfig(...), published_total)`. The *published total* is the official parameter count of the real model.
- `"GPT-2 small"`: `ModelConfig(vocab_size=50257, d_model=768, n_layers=12, n_heads=12, d_ff=3072)` and published total `124_439_808`.
- `"GPT-2 medium"`: `ModelConfig(vocab_size=50257, d_model=1024, n_layers=24, n_heads=16, d_ff=4096)` and published total `354_823_168`.

The underscores in `124_439_808` only make a long number easier to read. The value is `124439808`.

Why a tuple: it keeps each model's config and its official number together, so one loop can use both.

**Check:** `len(REAL_CONFIGS) == 2`. `REAL_CONFIGS["GPT-2 small"][1] == 124439808`.

### Step 2: Get the breakdown for each model
Code shape:
```python
for name, (config, real_total) in REAL_CONFIGS.items():
    breakdown = ...
```
Loop over `REAL_CONFIGS.items()`. `dict.items()` gives `(key, value)` pairs, so `for name, (config, real_total) in REAL_CONFIGS.items():` unpacks the name, the config and the published total in one go. Inside, call `breakdown = config.count_parameters()`. Each `breakdown` is a dict with six keys.

**Check (small):** `breakdown["embedding"] == 38597376` (that is `50257 * 768`), and `breakdown["output_head"] == 38597376`.

### Step 3: Work out the tied total
Code shape:
```python
tied_total = ...
```
GPT-2 uses one matrix for two jobs. The *output head* turns the model's final vectors back into token scores. The *embedding table* turns tokens into vectors. They are the same size, so GPT-2 shares one matrix for both. This is called *weight tying*. The real model stores that matrix **once**. But your `"total"` counts it twice, in both `"embedding"` and `"output_head"`. Fix that with one subtraction:

`tied_total = breakdown["total"] - breakdown["output_head"]`

Only the total changes. Do not edit the other dict entries. From now on, **`tied_total` is the "computed" number**.

Worked example (tiny config above): `226816 - 64000 = 162816`.

**Check:** small `tied_total == 123568896` (raw total 162166272). Medium `tied_total == 353551360` (raw total 405014528).

### Step 4: Print two lines for each model
Code shape:
```python
print(f"{name}: computed(tied)={...:,}  published={...:,}  diff={...:,}")
print(f"  breakdown: {...}")
```
Line 1 goes all on one line, with two spaces between the three parts:
`<name>: computed(tied)=<tied_total>  published=<published>  diff=<difference>`
The *difference* is how far apart the two numbers are, ignoring the sign: `abs(a - b)`. Put commas in all three numbers (`123568896` becomes `123,568,896`). In an f-string, the format `:,` does this: `f"{123568896:,}"` gives `123,568,896`. Build it with an f-string:
`f"{name}: computed(tied)={tied_total:,}  published={real_total:,}  diff={abs(tied_total - real_total):,}"`

Line 2 is two spaces, the word `breakdown:`, a space, then the raw dict as Python prints it: `print(f"  breakdown: {breakdown}")`. The dict shows with single quotes and no commas inside the numbers, like `{'embedding': 38597376, 'attention': 28311552, ...}`.

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
So for small, the difference is about 0.7%. For medium, it is about 0.36%.

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
Before the loop, make three empty lists, for example `names`, `computed` and `published`. Inside the loop, add the model name, the `tied_total` and the `real_total`. Position `i` in all three lists is the same model.

**Check:** after the loop, each list has length 2, in the order small, medium (dicts keep the order you put things in).

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
A *grouped bar chart* has, for each model (a group), two bars side by side. Use one figure: `plt.figure(figsize=(7, 5))`. This starts a chart 7 by 5 inches.
- Model `i` sits at x position `i` (0 for small, 1 for medium). Make the positions with `range(len(names))`.
- The "computed (tied)" bars go at `i - 0.2` (a bit left). The "published" bars go at `i + 0.2` (a bit right). Use a list comprehension to move every position: `[i - 0.2 for i in x]`.
- `plt.bar(x_positions, heights, width=..., label=...)` draws vertical bars centered at `x_positions`. Give each call `width=0.4`, so the two bars touch in the middle of each group and do not overlap. Labels: `label="computed (tied)"` and `label="published"`.
- The bars sit at moved positions, so matplotlib would label the x axis with numbers. Call `plt.xticks(list(x), names)`. `plt.xticks(positions, labels)` puts text under the given x positions. Now the labels under each group are the model names.
- `plt.ylabel("parameters")`, `plt.title("Computed vs. published parameter counts")`, `plt.legend()`, `plt.tight_layout()`, then `plt.show()`.

**Check:** two groups with two bars in each. A legend with two entries. Model names under the groups (not 0 and 1). In each group the two bars look almost the same height, because the difference is under 1%. That near match is the point of the project. The small gap comes from things the simple formula leaves out, such as positional embeddings and bias vectors.
