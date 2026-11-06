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
You get `distribution: dict[str, float]` (word -> chance, like `{"the": 0.5, "was": 0.3, "great": 0.2}`) and `n: int = 5`. You give back a `list[str]` of `n` random words. Write the code that does these steps:

1. Set `words` to `list(distribution.keys())`.
2. Set `weights` to `list(distribution.values())`.
3. Return `random.choices(words, weights=weights, k=n)`.

The same word can come up twice. With `n=5` one possible result is `['the', 'was', 'the', 'the', 'great']`, and another run gives a different list.

**Check:** `len(sample_next_word(dist, n=5)) == 5`, `len(sample_next_word(dist, n=8)) == 8`, and every item is a `str`. Call it with `n=1000` on `dist` and count how often `"the"` comes up. It should be close to 100. A bit more or less is fine, because the chance of `the` is about 0.10.

### Step 2: Build `counts` and `dist` from all the sentences
Code shape:
```python
counts = ...   # from word_counts
dist = ...     # from word_probabilities
```
Write the code that does these steps, with these exact names:

1. Set `counts` to `word_counts(sentences)`.
2. Set `dist` to `word_probabilities(counts)`.

**Check:** `abs(sum(dist.values()) - 1.0) < 1e-9`. This says the chances add up to 1. Compare with a tiny gap, not `== 1`, because decimal numbers can be a tiny bit off. Also `sum(counts.values())` should be 1473, and `dist["the"]` should be about 0.1005 (`148 / 1473`).

### Step 3: Print the summary line
Code shape:
```python
print(f"{...} sentences, {...} unique words.")
```
Print one line like this, with numbers **worked out by your code** (do not type them in):

`170 sentences, 523 unique words.`

Write the code that does these steps:

1. Use `len(sentences)` for the sentence count.
2. Use `len(counts)` for the unique word count.

**Check:** you should see `170 sentences, 523 unique words.` If your number is different, your `tokenize` is probably keeping punctuation, digits or capital letters.

### Step 4: Print the 15 most likely words
Code shape:
```python
top15 = ...
print("Most probable words in the corpus:")
for word, prob in top15:
    print(f"...")
```
Write the code that does these steps:

1. Set `top15` to `top_k(dist, 15)`.
2. Print the line `Most probable words in the corpus:`.
3. Loop over `top15` with `for word, prob in top15:`.
4. Print `f"  {word:<12} P={prob:.4f}"`. That is two spaces, the word padded to 12 characters, a space, `P=`, and the chance with 4 digits after the point.

Example: for `("the", 0.10047...)` the line is `  the          P=0.1005`.

**Check:** `len(top15) == 15`, the chances go down as you read the list, and the first line is `the` with `P=0.1005`.

### Step 5: Print the greedy pick
Code shape:
```python
print()
print(f"Greedy pick (always highest probability word): {...}")
```
Write the code that does these steps:

1. Call `print()` with nothing inside, to print an empty line.
2. Get the top word with `top_k(dist, 1)[0][0]`. (`top_k(dist, 1)` is a list with one pair, like `[("the", 0.1005)]`. The first `[0]` takes the pair and the second `[0]` takes the word.)
3. Print `Greedy pick (always highest probability word): <word>`.

**Check:** the word is exactly the word on the first line of the top-15 list (`the`).

### Step 6: Print the sampled picks
Code shape:
```python
print(f"Sampled picks (weighted by probability): {...}")
```
Write the code that does these steps:

1. Call `sample_next_word(dist, n=5)`.
2. Print `Sampled picks (weighted by probability): ` followed by the list, like `Sampled picks (weighted by probability): ['the', 'was', 'and', 'the', 'movie']`.

Printing the list directly gives the brackets and quotes. That is fine.

**Check:** exactly 5 words. Run the cell a few times. The list should change, and `the` and `and` should show up more often than rare words.

### Step 7: Draw the bar chart
Code shape:
```python
words, probs = ...
plt.figure(...)
plt.bar(...)
# then: title, ylabel, xticks, tight_layout, show
```
Write the code that does these steps:

1. Set `words, probs` to `zip(*top15)`. This splits the pairs into 15 words and their 15 chances.
2. Call `plt.figure(figsize=(9, 5))`.
3. Call `plt.bar(words, probs, color="steelblue")`.
4. Call `plt.title("Word probability distribution over real review sentences")`.
5. Call `plt.ylabel("P(word)")`.
6. Call `plt.xticks(rotation=45, ha="right")`.
7. Call `plt.tight_layout()`.
8. Call `plt.show()`.

**Check:** you see 15 blue bars. The tallest is on the left (`the`, about 0.10) and the shortest is on the right (about 0.0075). The title and y-label match the text above.
