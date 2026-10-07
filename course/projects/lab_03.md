# Project: A Bigram Text Generator and Heatmap

## Goal
The question you are answering: **if you only know the previous word, how well can you guess the next one, and can that guessing be turned into a tiny text generator?**

You will turn the bigram model from this lab into a generator trained on real reviews, then draw a picture of what it learned. You will:

1. Write `generate_sentence`, which grows a sentence one word at a time by sampling from `P(next | previous)`.
2. Build the model on the whole corpus (`counts`, then `cond`).
3. Print one generated sentence for each of three seed words: `the`, `this`, `i`.
4. Pick the 12 most common "previous" words and the 12 most common "next" words, and fill a 12 x 12 numpy array `matrix` with conditional probabilities.
5. Draw `matrix` as a heatmap.

Takeaway: this loop (look at the context, get a distribution, sample a word, repeat) is the same loop an LLM runs. Here the context is only one word, so the output is odd but readable.

## Words you will see
- **Bigram**: a pair of neighbouring words, like `("the", "movie")`.
- **Conditional probability `P(next | previous)`**: how likely a word is to come next, given that you just saw a specific previous word. If "the" is followed by "movie" in 4 of its 148 occurrences, then `P(movie | the)` is 4/148, about 0.027.
- **`counts`**: a dict of dicts. `counts["the"]["movie"]` is how many times `"movie"` directly followed `"the"` inside a sentence. Pairs never cross from one sentence into the next.
- **`cond`**: same shape as `counts`, but holding probabilities. Each inner dict adds up to 1.
- **Seed**: the word you start generating from.
- **Dead end**: a word that has no entry in `cond` because it never has a word after it (it only ever ends sentences, like `"hesitation"`, which only ever ends its sentence). Generation must stop there.
- **Weighted random choice**: pick one item at random, where likelier items are picked more often. `random.choices(items, weights=..., k=1)` returns a **list** with one item, so take element `[0]`.
- **`dict.get(key)`**: like `d[key]` but returns `None` instead of crashing when the key is missing. `if not options:` is true for both `None` and an empty dict.
- **`sorted(d, key=d.get, reverse=True)`**: lists the **keys** of `d`, ordered by their values, biggest first. Slice with `[:12]` for the top 12. Equal values stay in the order they were first inserted in the dict, so ties are resolved deterministically.
- **Pooling**: adding up counts for the same word across several rows. If `"movie"` followed `"the"` 4 times and `"this"` 7 times, its pooled count is 11.
- **numpy (`np`)**: the array library. `np.zeros((12, 12))` makes a 12-row, 12-column grid of `0.0`. You set a cell with `matrix[i, j] = value`. Row `i`, column `j`.
- **`enumerate(seq)`**: gives `(index, item)` pairs in a loop, so you know the row or column number.
- **Heatmap**: a grid drawn as colored squares. Here a bright square means a high probability.
- **matplotlib calls**:
  - `plt.imshow(matrix, cmap="viridis", aspect="auto")`: draws the grid as colored squares. Row 0 is at the top. `cmap` is the color scale (viridis goes from dark purple for low to yellow for high). `aspect="auto"` lets the cells stretch to fill the figure.
  - `plt.colorbar(label=...)`: adds the color legend.
  - `plt.xticks(positions, labels, rotation=..., ha=...)` and `plt.yticks(positions, labels)`: put words on the axes. Positions are `0, 1, 2, ...`, which `range(len(labels))` gives you.

## What you start with
Already in the kernel (run the loader cell first):
- `sentences`: `list[str]`, 170 review sentences. `labels`: `list[int]` (not needed here).
- `random`, `re`, `plt` (matplotlib.pyplot) and `np` (numpy), imported in the setup cell.

Your own exercise functions from this lab **must be defined and run first** (run the exercise cell, or the solution cell if you are stuck):
- `tokenize(sentence: str) -> list[str]`: lowercase letter-only tokens (already given in the exercise cell). `tokenize("The Movie, was great!")` gives `['the', 'movie', 'was', 'great']`.
- `bigram_counts(sentences: list[str]) -> dict[str, dict[str, int]]`: `counts[prev][next]` is how many times `next` followed `prev` within a sentence. For `["the movie was great", "the movie was long", "the food was great"]` you get `counts["the"] == {"movie": 2, "food": 1}` and `counts["was"] == {"great": 2, "long": 1}`. The words `great`, `long` never have a next word, so they are not keys.
- `conditional_probabilities(counts) -> dict[str, dict[str, float]]`: each inner dict is divided by its own total. In that toy example `cond["was"]["great"]` is `2/3`.

## Steps

### Step 1: Write `generate_sentence`
Define `generate_sentence(cond: dict[str, dict[str, float]], start: str, length: int = 10) -> str`. The loop works like this:
1. Start a list of words with just `start`. Remember the current word (`start` at first).
2. Repeat **up to `length - 1` more times** (so the total is at most `length` words):
   - Look up the options for the current word: `cond.get(current)`.
   - If there is no entry, or the entry is empty, **stop early** (dead end). Leave the loop.
   - Otherwise take the candidate words and their probabilities as parallel lists (`list(options.keys())`, `list(options.values())`), choose ONE with `random.choices(..., weights=..., k=1)[0]`, append it, and make it the current word.
3. Return the words joined by single spaces: `" ".join(words)`.

Why it works: each step only looks at the last word, because that is all a bigram model knows.

Tiny example with the toy model above: `generate_sentence(cond, "the", length=10)` could return `"the movie was great"` (then `great` is a dead end, so it stops at 4 words), or `"the food was long"`. And `generate_sentence(cond, "great")` always returns just `"great"`, since `great` has no entry.

**Check:** the result is a `str`, begins with `start`, has at most `length` words (`len(result.split()) <= length`), and `generate_sentence(cond, "the", length=1)` returns just `"the"`.

### Step 2: Build the model on the whole corpus
Use these exact names:
- `counts = bigram_counts(sentences)`
- `cond = conditional_probabilities(counts)`

**Check:** `counts["the"]` has 148 outgoing pairs in total (`sum(counts["the"].values()) == 148`), and `abs(sum(cond["the"].values()) - 1.0) < 1e-9`. `cond["the"]["movie"]` is about `0.027`. Also `len(counts)` is 449 previous words.

### Step 3: Print the three generated sentences
Print the header on its own line:

`Generated sentences from the real bigram model:`

Then, for each seed in the order `"the"`, `"this"`, `"i"`, print one line with **two leading spaces**:

`  [<seed>] -> <generated sentence>`

For example (yours will differ):
```
Generated sentences from the real bigram model:
  [the] -> the pacing was awful and the story was
  [this] -> this movie was a masterpiece that everyone should see
  [i] -> i loved every minute of this film
```
Use `generate_sentence(cond, seed)` with the default length of 10 words.

**Check:** three lines, each starting with its seed, none with more than 10 words after the `->`. Run it twice: the sentences change. Some may be shorter than 10 words if a dead end is hit.

### Step 4: Collect the heatmap data
Do this in three parts.

**4a. `top_prev_words`** (the rows):
1. Compute each previous word's total outgoing count, which is the sum of its inner count dict (`sum(inner.values())`). A dict like `{prev: total}` works.
2. Take the 12 with the biggest totals, biggest first. Use `sorted(..., key=totals.get, reverse=True)[:12]`.
3. Use the **counts**, not the probabilities, for this ranking. Probabilities in each row always add to 1 and cannot show which word is frequent.

Expected result: `['the', 'and', 'this', 'was', 'i', 'is', 'a', 'to', 'of', 'my', 'were', 'with']`, with totals `148, 95, 60, 57, 33, 33, 22, 15, 14, 13, 12, 11`. (`i` and `is` tie at 33; the one seen first in the data comes first.) The totals differ slightly from lab 1's word counts because the last word of each sentence has no next word.

**4b. `top_next_words`** (the columns):
1. Make an empty dict, `next_word_totals = {}`.
2. For each previous word in `top_prev_words` only, go through `counts[prev]` and add each `(next word, count)` into the dict, summing when the same next word appears under several previous words (pooling).
3. Take the 12 biggest, descending.

Worked example (toy data above): if the top 2 previous words were `the` and `was`, the pooled dict would be `{"movie": 2, "food": 1, "great": 2, "long": 1}`, and the top words would come from that.

Expected result: `['the', 'movie', 'product', 'book', 'film', 'a', 'story', 'would', 'pacing', 'price', 'hotel', 'is']`, with pooled counts `26, 11, 6, 6, 6, 6, 5, 5, 4, 4, 4, 4`. The last few places are ties (several words have count 4), and they are broken by the order the words first entered the dict.

**4c. `matrix`**:
1. `matrix = np.zeros((len(top_prev_words), len(top_next_words)))`, which is 12 x 12.
2. With two nested loops using `enumerate`, set `matrix[i, j] = cond[prev].get(nxt, 0.0)`. Here `i` is the row (previous word), `j` is the column (next word). `.get(nxt, 0.0)` gives `0.0` when that pair never occurs.
3. Fill with **probabilities from `cond`**, not raw counts.

Why: the picture should show "how likely is this next word after that previous word", which is a probability.

**Check:** `matrix.shape == (12, 12)`. All values are between 0 and 1. Each **row** sums to at most 1 (less than 1 because only 12 columns are shown). `matrix[0, 0]` is `P(the | the)`, which is 0. The biggest cell is about `0.24`, in the `and` row and the `the` column (`P(the | and)`). About 124 of the 144 cells are exactly 0.

### Step 5: Draw the heatmap
In order:
1. `plt.figure(figsize=(8, 7))`.
2. `plt.imshow(matrix, cmap="viridis", aspect="auto")`.
3. `plt.colorbar(label="P(next word | previous word)")`.
4. `plt.xticks(range(len(top_next_words)), top_next_words, rotation=45, ha="right")`: columns are next words, tilted and right-aligned so they do not overlap.
5. `plt.yticks(range(len(top_prev_words)), top_prev_words)`: rows are previous words.
6. `plt.xlabel("next word")`, `plt.ylabel("previous word")`, `plt.title("Conditional probability heatmap (real review corpus)")`.
7. `plt.tight_layout()` then `plt.show()`.

**Check:** 12 words along the bottom (next words) and 12 down the left side (previous words). A colorbar with the label on the right. Mostly dark squares with a few bright ones.

## What a correct result looks like
- **Random** (different every run): the three generated sentences. They start with their seed, read like slightly odd review phrases, are at most 10 words long, and may stop early.
- **Deterministic** (same every run): `top_prev_words`, `top_next_words`, `matrix`, and so the heatmap.
- Heatmap: a mostly dark 12 x 12 grid with only about 20 non-zero (colored) cells. Rows for `a`, `to`, `my`, `were` and `with` are completely dark, because none of their continuations are among the 12 chosen columns. The `i` row has one bright cell (about 0.15) and the `is` row one cell (about 0.18). The `of` row has a single cell at about 0.14 (`the`). The `and` row has a bright cell at `the` (about 0.24). The `this` row has several mid-brightness cells (`movie`, `product`, `book`, `film`, ...). Rows with a dominant continuation show one bright cell.

## How you'll be graded
The grader checks behaviour, not exact text. These must hold:
1. `generate_sentence` starts with the seed, samples each next word with weights from `cond`, stops early on a dead end, and never exceeds `length` words.
2. The model is built from the full `sentences` using the lab's `bigram_counts` and `conditional_probabilities`.
3. Sentences are generated and printed for the three seeds "the", "this", "i".
4. The 12 most frequent previous words are chosen by total outgoing count, and the 12 most frequent next words are chosen by pooled counts from those rows.
5. The heatmap matrix contains conditional probabilities (0 for unseen pairs), with correct row/column orientation and labels.
6. The plot is an `imshow` heatmap with colorbar, tick labels, axis labels and title as specified.
