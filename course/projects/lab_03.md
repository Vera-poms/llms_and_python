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
You get `cond: dict[str, dict[str, float]]` (previous word -> next words and their chances), a `start: str` word, and `length: int = 10`. You give back a `str`: a sentence of at most `length` words, like `"the movie was great"`. Write the code that does these steps:

1. Start `words` as `[start]`, and set `current` to `start`.
2. Loop `length - 1` times.
3. Set `options` to `cond.get(current)`. This gives `None` instead of crashing when the word is missing.
4. If `not options`, `break`. This is a dead end: a word with no next word, so the sentence stops early.
5. Otherwise pick one word with `random.choices(list(options.keys()), weights=list(options.values()), k=1)[0]`.
6. Add that word to `words`, and set `current` to it.
7. After the loop, return `" ".join(words)`.

For example, `generate_sentence(cond, "great")` always gives just `"great"`, because `great` has no entry.

**Check:** the result is a `str`, it begins with `start`, it has at most `length` words (`len(result.split()) <= length`), and `generate_sentence(cond, "the", length=1)` gives just `"the"`.

### Step 2: Build the model from all the sentences
Code shape:
```python
counts = ...
cond = ...
```
Write the code that does these steps, with these exact names:

1. Set `counts` to `bigram_counts(sentences)`.
2. Set `cond` to `conditional_probabilities(counts)`.

**Check:** `counts["the"]` holds 148 pairs in total (`sum(counts["the"].values()) == 148`), and `abs(sum(cond["the"].values()) - 1.0) < 1e-9`. `cond["the"]["movie"]` is about `0.027`. Also `len(counts)` is 449 (that is how many different previous words there are).

### Step 3: Print the three generated sentences
Code shape:
```python
print("Generated sentences from the real bigram model:")
for seed in [...]:
    print(f"  [{seed}] -> {...}")
```
Write the code that does these steps:

1. Print the header `Generated sentences from the real bigram model:`.
2. Loop over the seeds `"the"`, `"this"`, `"i"`, in that order.
3. For each seed, print `  [<seed>] -> <sentence>`, with two spaces at the start. Make the sentence with `generate_sentence(cond, seed)` (default length of 10).

For example (yours will be different):
```
Generated sentences from the real bigram model:
  [the] -> the pacing was awful and the story was
  [this] -> this movie was a masterpiece that everyone should see
  [i] -> i loved every minute of this film
```

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

**4a. `top_prev_words`** (the rows). Write the code that does these steps:

1. Set `totals` to a dict of each `prev` with `sum(inner.values())`. Use the **counts**, not the chances (the chances in each row always add up to 1).
2. Set `top_prev_words` to `sorted(totals, key=totals.get, reverse=True)[:12]`.

Expected: `['the', 'and', 'this', 'was', 'i', 'is', 'a', 'to', 'of', 'my', 'were', 'with']`, with totals `148, 95, 60, 57, 33, 33, 22, 15, 14, 13, 12, 11`. (`i` and `is` tie at 33. The one seen first in the data comes first.) These totals are a little lower than lab 1's word counts, because the last word of each sentence has no next word.

**4b. `top_next_words`** (the columns). Write the code that does these steps:

1. Make an empty dict `next_word_totals = {}`.
2. For each `prev` in `top_prev_words`, loop over `counts[prev].items()`.
3. Add each `count` to `next_word_totals[nxt]`. If a next word shows up under several previous words, the counts add together. For example, `movie` after `the` 4 times and after `this` 7 times gives 11. Use `.get(nxt, 0)` to start from 0.
4. Set `top_next_words` to the 12 keys with the biggest totals, biggest first, like in 4a.

Expected: `['the', 'movie', 'product', 'book', 'film', 'a', 'story', 'would', 'pacing', 'price', 'hotel', 'is']`, with pooled counts `26, 11, 6, 6, 6, 6, 5, 5, 4, 4, 4, 4`. The last few places are ties. They keep the order the words first entered the dict.

**4c. `matrix`** (the grid of numbers). Write the code that does these steps:

1. Set `matrix` to `np.zeros((len(top_prev_words), len(top_next_words)))`. This is 12 rows and 12 columns of `0.0`.
2. In the two loops, set `matrix[i, j]` to `cond[prev].get(nxt, 0.0)`. Use chances from `cond`, not raw counts. `.get(nxt, 0.0)` gives `0.0` when that pair never shows up.

**Check:** `matrix.shape == (12, 12)`. All values are between 0 and 1. Each **row** adds up to at most 1 (only 12 columns are shown). `matrix[0, 0]` is `P(the | the)`, which is 0. The biggest cell is about `0.24`, in the `and` row and the `the` column (`P(the | and)`). About 124 of the 144 cells are exactly 0.

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
Write the code that does these steps:

1. Call `plt.figure(figsize=(8, 7))`.
2. Call `plt.imshow(matrix, cmap="viridis", aspect="auto")`.
3. Call `plt.colorbar(label="P(next word | previous word)")`.
4. Call `plt.xticks(range(len(top_next_words)), top_next_words, rotation=45, ha="right")`.
5. Call `plt.yticks(range(len(top_prev_words)), top_prev_words)`.
6. Call `plt.xlabel("next word")`, `plt.ylabel("previous word")` and `plt.title("Conditional probability heatmap (real review corpus)")`.
7. Call `plt.tight_layout()`, then `plt.show()`.

**Check:** 12 words along the bottom (next words) and 12 down the left side (previous words). A color key with the label on the right. Mostly dark squares with a few bright ones.
