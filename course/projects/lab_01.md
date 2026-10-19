# Project: Word Probabilities of Real Reviews

## Goal
The question: **if a model had to guess the next word in a movie or product review, how likely is each word? And what changes if it always picks the most likely word, or rolls weighted dice?**

You will use the steps from this lab (split text into words, count them, turn counts into chances) on 170 real review sentences. The chance of a word is also called its *probability*. It is a number from 0 to 1. Then you will:

1. Write a new function, `sample_next_word`, that picks words at random. Likely words get picked more often.
2. Work out the chance of every word in all 170 sentences (`counts`, then `dist`).
3. Print how many sentences and how many different words there are.
4. Print the 15 most likely words and their chances.
5. Print the greedy pick: always the top word.
6. Print five sampled picks: random, but weighted by chance.
7. Draw a bar chart of the top 15 words.

Takeaway: a language model makes a list of chances like this at every step. **Greedy** always takes the top word. **Sampling** lets less likely words through sometimes. The bar chart is a picture of that list of chances.

## What you start with
Already in the notebook (run the loader cell first):
- `sentences`: a list of 170 sentences in lowercase with no punctuation, like `"i loved every minute of this film"`.
- `labels`: a list of 1s and 0s (1 = positive review, 0 = negative). You do not need it in this project.
- `random`, `re` and `plt` are already imported. `plt` is the chart library (matplotlib).

Your own exercise functions from this lab **must be defined and run first**. Run the exercise cell, or the solution cell if you are stuck. Your project code calls them:
- `tokenize(sentence)`: splits one sentence into lowercase words. `tokenize("The Movie, was great!")` gives `['the', 'movie', 'was', 'great']`.
- `word_counts(sentences)`: counts how many times each word shows up in all the sentences. On `["the movie was great", "the movie was long", "the food was great"]` it gives `the=3, movie=2, was=3, great=2, long=1, food=1`.
- `word_probabilities(counts)`: divides each count by the total of all counts, so the chances add up to 1. For the three sentences above the total is 12, so the chance of `the` is `3/12 = 0.25`.
- `top_k(distribution, k)`: gives the `k` pairs `(word, chance)` with the highest chance, highest first. A *distribution* is just the chances of all the words together, kept in a dict like `{"the": 0.25, "was": 0.25, ...}`.

The exercise cell also made a small list called `sample`. Do not use that name for something else, or you will get confused later.

## Steps

### Step 1: Write `sample_next_word`
Code shape (replace each `...`):
```python
def sample_next_word(distribution, n=5):
    words = ...      # the words
    weights = ...    # their chances, in the same order
    return ...       # n random picks
```
Define `sample_next_word(distribution: dict[str, float], n: int = 5) -> list[str]`.

What it does: it picks `n` words at random from `distribution` and gives them back in a list. Each pick is separate, and a picked word goes back in the pool, so the same word can come up twice. A word's chance of being picked is the chance stored for it in `distribution`.

Why: this is the "dice roll" that makes a model's output change from run to run. A word with chance 0.10 should come up about 10 times in 100 picks. A word with chance 0.001 should almost never come up.

How:
- `random.choices` needs two lists in the same order: the words, and a number for how likely each word is (the *weights*). Make `words = list(distribution.keys())` and `weights = list(distribution.values())`. A dict keeps its order, so the two lists line up.
- Call `random.choices(words, weights=weights, k=n)`. It already gives back a list, even when `k=1`.

Tiny example: with `{"the": 0.5, "was": 0.3, "great": 0.2}` and `n=5`, one possible result is `['the', 'was', 'the', 'the', 'great']`. Another run gives a different list. Both are correct, because the function is random.

**Check:** `len(sample_next_word(dist, n=5)) == 5`, `len(sample_next_word(dist, n=8)) == 8`, and every item is a `str`. Call it with `n=1000` on `dist` and count how often `"the"` comes up. It should be close to 100. A bit more or less is fine, because the chance of `the` is about 0.10.

### Step 2: Build `counts` and `dist` from all the sentences
Code shape:
```python
counts = ...   # from word_counts
dist = ...     # from word_probabilities
```
Use **your own** functions, in this order, and keep these names:
- `counts = word_counts(sentences)`: a dict of word -> how many times it shows up.
- `dist = word_probabilities(counts)`: a dict of word -> chance.

Why: counts alone are not chances. Dividing by the total turns "how many times" into "how likely". For example, if `the` shows up 148 times out of 1473 words, its chance is `148 / 1473 = 0.1005`.

**Check:** `abs(sum(dist.values()) - 1.0) < 1e-9`. This says the chances add up to 1. Decimal numbers can be a tiny bit off, so compare with a tiny gap, not `== 1`. Also `sum(counts.values())` should be 1473. And `dist["the"]` should be about 0.1005.

### Step 3: Print the summary line
Code shape:
```python
print(f"{...} sentences, {...} unique words.")
```
Print one line like this, with the numbers **worked out by your code** (do not type them in):

`170 sentences, 523 unique words.`

- Sentences: `len(sentences)`.
- Unique words (different words, each counted once): `len(counts)`. A dict has one key for each different word, so its length is the number of different words.

Why: if the data changes later, a number you typed in would quietly be wrong.

**Check:** you should see `170 sentences, 523 unique words.` If your number is different, your `tokenize` is probably keeping punctuation, digits or capital letters.

### Step 4: Print the 15 most likely words
Code shape:
```python
top15 = ...
print("Most probable words in the corpus:")
for word, prob in top15:
    print(f"...")
```
1. `top15 = top_k(dist, 15)`. This is a list of 15 `(word, chance)` pairs, highest first.
2. Print the line `Most probable words in the corpus:` (the *corpus* is all your sentences together).
3. Loop over `top15`. Print one line per word. Each line is: **two spaces**, the word padded to 12 characters, a space, `P=`, and the chance with 4 digits after the point. Use `f"  {word:<12} P={prob:.4f}"`.

What the format means: `{word:<12}` adds spaces after the word until it is 12 characters wide, so the `P=` parts line up. `{prob:.4f}` shows the number with exactly 4 digits after the point.

Example: for `("the", 0.10047...)` the line is `  the          P=0.1005`.

**Check:** `len(top15) == 15`, the chances go down as you read the list, and the first line is `the` with `P=0.1005`.

### Step 5: Print the greedy pick
Code shape:
```python
print()
print(f"Greedy pick (always highest probability word): {...}")
```
Print an empty line first. For example, call `print()` with nothing inside. Then print:

`Greedy pick (always highest probability word): <word>`

Get the word from `top_k(dist, 1)`. That gives a list with one pair, like `[("the", 0.1005)]`. You want only the word, so take the first item of the list (index `0`), then the first item of the pair (index `0` again).

Why: greedy means "take the highest, every time". So it never changes between runs.

**Check:** the word is exactly the word on the first line of the top-15 list (`the`).

### Step 6: Print the sampled picks
Code shape:
```python
print(f"Sampled picks (weighted by probability): {...}")
```
Call `sample_next_word(dist, n=5)` and print:

`Sampled picks (weighted by probability): ` and then the list, for example
`Sampled picks (weighted by probability): ['the', 'was', 'and', 'the', 'movie']`

Printing a list directly gives the square brackets and quotes. That is fine.

**Check:** exactly 5 words. Run the cell a few times. The list should change, and `the` and `and` should show up more often than rare words.

### Step 7: Draw the bar chart
Code shape:
```python
words, probs = ...
plt.figure(...)
plt.bar(...)
# then: title, ylabel, xticks, tight_layout, show
```
Do these in order:
1. `words, probs = zip(*top15)`. `zip(*pairs)` splits a list of pairs into two groups: all the first items, and all the second items. Now `words` has 15 words and `probs` has their 15 chances, in the same order.
2. `plt.figure(figsize=(9, 5))`: start a new figure 9 inches wide and 5 inches tall.
3. `plt.bar(words, probs, color="steelblue")`: one bar for each word. The bar height is the chance.
4. `plt.title("Word probability distribution over real review sentences")`.
5. `plt.ylabel("P(word)")`.
6. `plt.xticks(rotation=45, ha="right")`: tilt the word labels 45 degrees. `ha="right"` ends each label under its bar, so the labels do not overlap.
7. `plt.tight_layout()`: shrinks the margins so nothing is cut off.
8. `plt.show()`: shows the chart.

**Check:** you see 15 blue bars. The tallest is on the left (`the`, about 0.10) and the shortest is on the right (about 0.0075). The title and y-label match the text above.
