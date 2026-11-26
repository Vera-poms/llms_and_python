import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 6 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab06Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "def attention_params_per_layer(",
    hints: [
      {
        code: "class ModelConfig:",
        text: "A *dataclass*: its fields are listed at the top and stored for you. You read them as `self.d_model` and so on. `n_heads` is stored but does **not** change the count in this exercise.",
      },
      {
        code: "vocab_size: int",
        text: "How many different tokens (word pieces) the model knows.",
      },
      {
        code: "d_model: int",
        text: "The width of the model: how many numbers stand for one token inside it.",
      },
      {
        code: "n_layers: int",
        text: "How many identical transformer **blocks** are stacked. Each block has its own attention, feed-forward and layer-norm parameters.",
      },
      {
        code: "n_heads: int",
        text: "How many attention heads. It does **not** change the count in this exercise.",
      },
      {
        code: "d_ff: int",
        text: "The width of the feed-forward layer's inner step (usually about 4 times `d_model`).",
      },
      {
        code: "def embedding_params(self) -> int:",
        block: "function",
        text: "Already written for you. The *embedding table* is a `vocab_size x d_model` table that turns a token id into its list of numbers. A matrix of shape `a x b` holds `a * b` parameters.",
      },
      {
        code: "def attention_params_per_layer(self) -> int:",
        block: "function",
        text:
          "Counts the parameters in the attention part of ONE block. You get `self`, which has `self.d_model`. You give back an `int`. " +
          "Example: for `tiny` (`d_model=64`) the answer is `16384`.",
      },
      {
        code: 'raise NotImplementedError("ModelConfig.attention_params_per_layer()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`return ...`\n\n" +
          "**1)** Multiply `self.d_model` by `self.d_model`. This is the size of one square matrix (attention has 4: query, key, value and output).\n" +
          "**2)** Multiply that by 4 and return it. Ignore bias vectors.\n\n" +
          "**Check:** micro model: `4 * 4 * 4 = 64`. For `tiny`: `4 * 64 * 64 = 16384`.",
      },
      {
        code: "def feed_forward_params_per_layer(self) -> int:",
        block: "function",
        text:
          "Counts the parameters in the feed-forward part of ONE block. You get `self`, which has `self.d_model` and `self.d_ff`. You give back an `int`. " +
          "Example: for `tiny` (`d_model=64`, `d_ff=256`) the answer is `32768`.",
      },
      {
        code: 'raise NotImplementedError("ModelConfig.feed_forward_params_per_layer()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`first = ...`, `second = ...`, `return ...`\n\n" +
          "**1)** Set `first` to `self.d_model * self.d_ff` (the first layer).\n" +
          "**2)** Set `second` to `self.d_ff * self.d_model` (the second layer).\n" +
          "**3)** Return `first + second`.\n\n" +
          "**Check:** micro model: `4*8 + 8*4 = 64`. For `tiny`: `64*256*2 = 32768`.",
      },
      {
        code: "def layernorm_params_per_layer(self) -> int:",
        block: "function",
        text:
          "Counts the parameters in the layer norms of ONE block. You get `self`, which has `self.d_model`. You give back an `int`. " +
          "Example: for `tiny` (`d_model=64`) the answer is `256`.",
      },
      {
        code: 'raise NotImplementedError("ModelConfig.layernorm_params_per_layer()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`one_norm = ...`, `return ...`\n\n" +
          "**1)** Set `one_norm` to `2 * self.d_model` (a scale and a shift for every dimension).\n" +
          "**2)** Return `2 * one_norm`, because each block has 2 layer norms.\n\n" +
          "**Check:** micro model: `2 * 2 * 4 = 16`. For `tiny`: `2 * 2 * 64 = 256`.",
      },
      {
        code: "def output_head_params(self) -> int:",
        block: "function",
        text:
          "Counts the parameters in the final output head (counted once, not per block). You get `self`, which has `self.d_model` and `self.vocab_size`. You give back an `int`. " +
          "Example: for `tiny` the answer is `64000`.",
      },
      {
        code: 'raise NotImplementedError("ModelConfig.output_head_params()',
        text:
          "Your turn: replace this line with your code. Write it in this shape:\n" +
          "`return ...`\n\n" +
          "**1)** Return `self.d_model * self.vocab_size`. The head is a `d_model x vocab_size` matrix. Do not use `n_layers`, and do not share this matrix with the embedding table.\n\n" +
          "**Check:** micro model: `4 * 10 = 40`. For `tiny`: `64 * 1000 = 64000`.",
      },
      {
        code: "def count_parameters(self) -> dict[str, int]:",
        block: "function",
        text:
          "Already written for you. It calls your four methods and multiplies the per-block ones by `n_layers`. For `tiny` it gives back " +
          "`{'embedding': 64000, 'attention': 32768, 'feed_forward': 65536, 'layernorm': 512, 'output_head': 64000, 'total': 226816}`. " +
          "The per-block numbers are doubled because `n_layers=2`. For the micro model the total is `40 + 64 + 64 + 16 + 40 = 224`.",
      },
      {
        code: "tiny = ModelConfig(",
        text: "Builds the running example: `vocab_size=1000`, `d_model=64`, `n_layers=2`, `n_heads=4`, `d_ff=256`. The micro model, `ModelConfig(vocab_size=10, d_model=4, n_layers=1, n_heads=2, d_ff=8)`, is handy for checks by hand.",
      },
      {
        code: "assert tiny.attention_params_per_layer() ==",
        text: "A self-check. An *assert* stops the program with a message if its condition is false. Here `4*64*64` must equal what your method gives back. A failed assert shows the expected value and the value you got.",
      },
      {
        code: "assert tiny.feed_forward_params_per_layer() ==",
        text: "Your feed-forward count must equal `64*256*2`.",
      },
      {
        code: "assert tiny.layernorm_params_per_layer() ==",
        text: "Your layer-norm count must equal `2*2*64`.",
      },
      {
        code: "assert tiny.output_head_params() ==",
        text: "Your output-head count must equal `64*1000`.",
      },
      {
        code: 'print("All checks passed.")',
        text: "Only reached when all four counts are right.",
      },
      {
        code: "print(tiny.count_parameters())",
        text: "Prints the full parameter breakdown dict.",
      },
    ],
  },
];
