# Project: Computed vs. Published GPT-2 Parameter Counts

**Goal**: Use your `ModelConfig` class to count the parameters of two real, published GPT-2 models and check how close a simple formula gets to the official totals. You will print a per-model report and draw a grouped bar chart comparing your numbers with the published ones. This shows that the architecture hyperparameters alone almost completely determine a model's size.

## What you start with

- `from dataclasses import dataclass` has been run in the setup cell. Run the setup cell first.
- Your own exercise implementation of `ModelConfig` must be defined and run first (the project depends on it). It is a dataclass with fields `vocab_size, d_model, n_layers, n_heads, d_ff`, the methods `embedding_params()`, `attention_params_per_layer()`, `feed_forward_params_per_layer()`, `layernorm_params_per_layer()`, `output_head_params()`, each returning `int`, and `count_parameters() -> dict[str, int]`. The dict has the keys `"embedding"`, `"attention"`, `"feed_forward"`, `"layernorm"`, `"output_head"`, `"total"`. The per-layer components are already multiplied by `n_layers`, and `"total"` is the sum of the other five.
- You must import `matplotlib.pyplot as plt` yourself (with `%matplotlib inline` in a notebook).

## Requirements

1. Define a dictionary constant `REAL_CONFIGS` mapping the model name to a tuple `(ModelConfig, published_total)`:
   - `"GPT-2 small"`: `vocab_size=50257, d_model=768, n_layers=12, n_heads=12, d_ff=3072`, published total `124_439_808`.
   - `"GPT-2 medium"`: `vocab_size=50257, d_model=1024, n_layers=24, n_heads=16, d_ff=4096`, published total `354_823_168`.
2. For each entry, call `count_parameters()` to get the breakdown.
3. GPT-2 ties its output head to the input embedding, so the real model stores that matrix only once. Compute a "tied total" as the breakdown's `"total"` minus its `"output_head"`. Use this tied total as the "computed" number from here on.
4. For each model print two lines:
   - `<name>: computed(tied)=<tied_total with thousands separators>  published=<published with thousands separators>  diff=<absolute difference with thousands separators>`
   - `  breakdown: <the full breakdown dict>` (the raw output of `print(breakdown)`, indented by two spaces).
5. Collect the model names, the computed tied totals and the published totals in three parallel lists.
6. Draw one figure, `figsize=(7, 5)`, with a grouped bar chart. For each model, the "computed (tied)" bar sits slightly left of the model's x position and the "published" bar slightly right (offset each by about 0.2, bar width 0.4).
   - X tick labels are the model names.
   - Y label is `parameters`.
   - Title is `Computed vs. published parameter counts`.
   - Include a legend with the labels `computed (tied)` and `published`.
   - Call `tight_layout()` and then show the plot.

## Expected output

The numbers are deterministic if your `ModelConfig` follows the exercise formulas (no biases, no positional embeddings):

- GPT-2 small: tied total `123,568,896` against `124,439,808`, diff `870,912`.
- GPT-2 medium: tied total `353,551,360` against `354,823,168`, diff `1,271,808`.
- Each breakdown dict has the six keys listed above. For small, `embedding` and `output_head` are both `38597376`.
- A plot with two groups of two bars (computed and published bars look almost identical in height, because the difference is under 1%).

## Hints on approach

- Loop over `REAL_CONFIGS.items()` and unpack `(config, real_total)`.
- Subtracting the output head is what accounts for weight tying, so only the total changes. The other components stay as reported.
- Use an f-string format spec with a comma for thousands separators.
- For side-by-side bars, shift the x positions of each series in opposite directions and set the tick labels back to the names.

## How you'll be graded

The grader checks behaviour and logic, not exact formatting:
1. `REAL_CONFIGS` holds both models with the correct hyperparameters and published totals.
2. The computed value is `total - output_head` (tied), not the raw total.
3. Printed output reports computed, published and absolute difference for each model, with values matching the numbers above, and shows the breakdown.
4. A grouped bar chart is produced with two series, model-name ticks, a y label, a title and a legend.
5. The project uses your working `ModelConfig` (the results are only right if your exercise is correct).
