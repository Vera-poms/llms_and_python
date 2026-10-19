# Project: A Bigram Text Generator and Heatmap

## Goal
The question: **if you only know the previous word, how well can you guess the next one? And can that guessing become a tiny text generator?**

A *bigram* is two words that sit next to each other, like `("the", "movie")`. In this project you will use the bigram model from this lab on 170 real review sentences to make a text generator. Then you will draw a picture of what the model learned. You will:

1. Write `generate_sentence`. It builds a sentence one word at a time. At each step it picks the next word at random, using the chance of each word given the word before it.
2. Build the model from all the sentences (`counts`, then `cond`).
3. Print one generated sentence for each of three starting words: `the`, `this`, `i`.
4. Pick the 12 most common "previous" words and the 12 most common "next" words. Fill a 12 x 12 grid of numbers (`matrix`) with chances.
5. Draw `matrix` as a heatmap.

Takeaway: an LLM runs this same loop. It looks at the words so far, gets the chances for the next word, picks one, and repeats. Here the model only looks at one word, so the sentences are odd but readable.

## What you start with
Already in the notebook (run the loader cell first):
- `sentences`: a list of 170 review sentences. `labels`: a list of 0s and 1s (you do not need it here).
- `random`, `re`, `plt` (the chart library, matplotlib) and `np` (numpy, the number-grid library) are imported in the setup cell.

Your own exercise functions from this lab **must be defined and run first**. Run the exercise cell, or the solution cell if you are stuck:
- `tokenize(sentence)`: splits a sentence into lowercase words (it is already written in the exercise cell). `tokenize("The Movie, was great!")` gives `['the', 'movie', 'was', 'great']`.
- `bigram_counts(sentences)`: gives a dict of dicts. `counts[prev][next]` is how many times the word `next` came right after the word `prev` in the same sentence. For `["the movie was great", "the movie was long", "the food was great"]` you get `counts["the"] == {"movie": 2, "food": 1}` and `counts["was"] == {"great": 2, "long": 1}`. The words `great` and `long` never have a word after them, so they are not keys.
- `conditional_probabilities(counts)`: divides each inner dict by its own total, so each inner dict adds up to 1. In that small example, `cond["was"]["great"]` is `2/3`.

*Conditional probability* means the chance of one thing, given that you already know another. Here it is `P(next | previous)`: the chance of the next word, given the word before it. If `the` is followed by `movie` 4 times out of 148, then `P(movie | the)` is 4/148, about 0.027.

## Steps

### Step 1: Write `generate_sentence`
Code shape:
```python
def generate_sentence(cond, start, length=10):
    words = [start]
    current = start
    for _ in range(...):
        options = ...
        if ...:
            break              # dead end
        # pick one next word, add it to words, make it current
    return ...
```
Define `generate_sentence(cond: dict[str, dict[str, float]], start: str, length: int = 10) -> str`. The `start` word is the *seed*, the word you begin from. The loop works like this:
1. Start a list of words with just `start`. Remember the current word (at first it is `start`).
2. Repeat **up to `length - 1` more times**, so the sentence has at most `length` words:
   - Look up the options for the current word with `cond.get(current)`. `cond.get(key)` works like `cond[key]`, but gives back `None` instead of crashing when the key is missing.
   - If there is no entry, or it is empty, you are at a *dead end*. Some words never have a word after them. If you reach one, **stop early**. `if not options:` is true for both `None` and an empty dict.
   - Otherwise take the words and their chances as two lists in the same order (`list(options.keys())`, `list(options.values())`). Pick ONE word with `random.choices(..., weights=..., k=1)[0]`. This picks at random, and likely words are picked more often. It gives back a list with one word, so take element `[0]`. Add that word to your list and make it the current word.
3. Give back the words joined with single spaces: `" ".join(words)`.

Why it works: each step looks only at the last word, because that is all a bigram model knows.

Tiny example with the small model above: `generate_sentence(cond, "the", length=10)` could give `"the movie was great"` (then `great` is a dead end, so it stops at 4 words), or `"the food was long"`. And `generate_sentence(cond, "great")` always gives just `"great"`, because `great` has no entry.

**Check:** the result is a `str`, it begins with `start`, it has at most `length` words (`len(result.split()) <= length`), and `generate_sentence(cond, "the", length=1)` gives just `"the"`.

### Step 2: Build the model from all the sentences
Code shape:
```python
counts = ...
cond = ...
```
Use these exact names:
- `counts = bigram_counts(sentences)`
- `cond = conditional_probabilities(counts)`

**Check:** `counts["the"]` holds 148 pairs in total (`sum(counts["the"].values()) == 148`), and `abs(sum(cond["the"].values()) - 1.0) < 1e-9`. `cond["the"]["movie"]` is about `0.027`. Also `len(counts)` is 449 (that is how many different previous words there are).

### Step 3: Print the three generated sentences
Code shape:
```python
print("Generated sentences from the real bigram model:")
for seed in [...]:
    print(f"  [{seed}] -> {...}")
```
Print this header on its own line:

`Generated sentences from the real bigram model:`

Then, for each seed in the order `"the"`, `"this"`, `"i"`, print one line with **two spaces at the start**:

`  [<seed>] -> <generated sentence>`

For example (yours will be different):
```
Generated sentences from the real bigram model:
  [the] -> the pacing was awful and the story was
  [this] -> this movie was a masterpiece that everyone should see
  [i] -> i loved every minute of this film
```
Use `generate_sentence(cond, seed)` with the default length of 10 words.

**Check:** three lines, each starting with its seed, and none with more than 10 words after the `->`. Run it twice: the sentences change. Some may be shorter than 10 words if a dead end comes up.

### Step 4: Collect the heatmap data
Code shape for all three parts:
```python
# 4a
totals = {prev: ... for prev, inner in counts.items()}
top_prev_words = ...

# 4b
next_word_totals = {}
for prev in top_prev_words:
    for nxt, count in counts[prev].items():
        ...
top_next_words = ...

# 4c
matrix = np.zeros(...)
for i, prev in enumerate(top_prev_words):
    for j, nxt in enumerate(top_next_words):
        matrix[i, j] = ...
```
Do this in three parts.

**4a. `top_prev_words`** (these will be the rows):
1. Work out the total for each previous word: the sum of its inner dict (`sum(inner.values())`). A dict like `{prev: total}` works well.
2. Take the 12 with the biggest totals, biggest first. Use `sorted(..., key=totals.get, reverse=True)[:12]`. `sorted(d, key=d.get, reverse=True)` lists the **keys** of `d`, ordered by their values, biggest first. `[:12]` keeps the first 12. If two values are equal, they stay in the order they were first put in the dict, so the result is the same every run.
3. Use the **counts**, not the chances, for this ranking. The chances in each row always add up to 1, so they cannot show which word is common.

Expected result: `['the', 'and', 'this', 'was', 'i', 'is', 'a', 'to', 'of', 'my', 'were', 'with']`, with totals `148, 95, 60, 57, 33, 33, 22, 15, 14, 13, 12, 11`. (`i` and `is` tie at 33. The one seen first in the data comes first.) These totals are a little lower than lab 1's word counts. The last word of each sentence has no next word, so it is not counted here.

**4b. `top_next_words`** (these will be the columns):
1. Make an empty dict: `next_word_totals = {}`.
2. Go through the previous words in `top_prev_words` only. For each one, go through `counts[prev]` and add each `(next word, count)` into the dict. If the same next word shows up under several previous words, add the counts together. This is called *pooling*. For example, if `movie` came after `the` 4 times and after `this` 7 times, its pooled count is 11.
3. Take the 12 biggest, biggest first.

Example (small data above): say the top 2 previous words are `the` and `was`. The pooled dict is `{"movie": 2, "food": 1, "great": 2, "long": 1}`. The top words come from that.

Expected result: `['the', 'movie', 'product', 'book', 'film', 'a', 'story', 'would', 'pacing', 'price', 'hotel', 'is']`, with pooled counts `26, 11, 6, 6, 6, 6, 5, 5, 4, 4, 4, 4`. The last few places are ties (several words have count 4). They are put in the order the words first entered the dict.

**4c. `matrix`** (the grid of numbers):
1. `matrix = np.zeros((len(top_prev_words), len(top_next_words)))`. This makes a grid with 12 rows and 12 columns, full of `0.0`.
2. Use two loops, one inside the other, with `enumerate`. `enumerate(items)` gives `(position, item)` pairs, so you know the row or column number. Set `matrix[i, j] = cond[prev].get(nxt, 0.0)`. Here `i` is the row (previous word) and `j` is the column (next word). `.get(nxt, 0.0)` gives `0.0` when that pair never shows up.
3. Fill the grid with **chances from `cond`**, not raw counts.

Why: the picture should show "how likely is this next word after that previous word", and that is a chance.

**Check:** `matrix.shape == (12, 12)`. All values are between 0 and 1. Each **row** adds up to at most 1 (less than 1 because only 12 columns are shown). `matrix[0, 0]` is `P(the | the)`, which is 0. The biggest cell is about `0.24`, in the `and` row and the `the` column (`P(the | and)`). About 124 of the 144 cells are exactly 0.

### Step 5: Draw the heatmap
Code shape:
```python
plt.figure(...)
plt.imshow(...)
plt.colorbar(...)
plt.xticks(...)
plt.yticks(...)
# then: xlabel, ylabel, title, tight_layout, show
```
A *heatmap* is a grid drawn as colored squares. Here a bright square means a high chance. Do these in order:
1. `plt.figure(figsize=(8, 7))`.
2. `plt.imshow(matrix, cmap="viridis", aspect="auto")`. This draws the grid as colored squares, with row 0 at the top. `cmap` is the color scale (viridis goes from dark purple for low to yellow for high). `aspect="auto"` lets the squares stretch to fill the figure.
3. `plt.colorbar(label="P(next word | previous word)")`: adds the color key.
4. `plt.xticks(range(len(top_next_words)), top_next_words, rotation=45, ha="right")`. The columns are the next words. The labels are tilted and end under their column, so they do not overlap. The positions are `0, 1, 2, ...`, which `range(len(...))` gives you.
5. `plt.yticks(range(len(top_prev_words)), top_prev_words)`: the rows are the previous words.
6. `plt.xlabel("next word")`, `plt.ylabel("previous word")`, `plt.title("Conditional probability heatmap (real review corpus)")`.
7. `plt.tight_layout()` and then `plt.show()`.

**Check:** 12 words along the bottom (next words) and 12 down the left side (previous words). A color key with the label on the right. Mostly dark squares with a few bright ones.
