# Project: Word Probabilities of Real Reviews

## Goal
The question you are answering: **if a model had to guess the next word in a movie or product review, how likely is each word, and what happens if it always takes the most likely one versus rolling weighted dice?**

You will use the tokenize -> count -> normalize pipeline from this lab on a real corpus (a *corpus* is just a collection of texts; here, 170 short review sentences). Then you will:

1. Write a new function, `sample_next_word`, that draws words at random, weighted by probability.
2. Build the word probability distribution for the whole corpus (`counts`, then `dist`).
3. Print how many sentences and unique words there are.
4. Print the 15 most probable words with their probabilities.
5. Print the greedy pick (always the top word).
6. Print five sampled picks (random, weighted).
7. Draw a bar chart of the top 15 words.

Takeaway: a language model's output at each step is exactly this kind of distribution. "Greedy" always takes the top word. "Sampling" lets less likely words through sometimes. The bar chart is a picture of that distribution.

## Words you will see
- **Token**: one word piece of text. In this lab a token is a run of lowercase letters, so `"Great!"` becomes the token `"great"`.
- **Corpus**: the whole collection of text you analyse. Here it is the list `sentences`.
- **Counts**: a dict mapping each word to how many times it appears in the whole corpus, e.g. `{"the": 148, "and": 95, ...}`.
- **Probability of a word**: its count divided by the total number of word occurrences. If "the" appears 148 times out of 1473 words, `P(the) = 148 / 1473 = 0.1005`.
- **Distribution**: a probability for every word, all adding up to 1. Here, `dist` is a dict from word to probability.
- **Greedy choice**: always pick the single most probable word. It gives the same answer every run.
- **Sampling**: pick a word at random, where each word's chance equals its probability. It gives different answers each run.
- **With replacement**: after you draw a word it goes back in the pool, so the same word can be drawn twice in one call.
- **Weights**: numbers that say how likely each candidate is. They are given to the random draw as a list parallel to the list of words (same order, same length).
- **`random.choices(population, weights=..., k=...)`**: Python's standard-library function that draws `k` items from `population` with replacement, using `weights`. It always returns a **list**, even when `k=1`.
- **Tuple**: a fixed pair like `("the", 0.1005)`. `top_k` returns a list of these.
- **`zip(*pairs)`**: turns a list of pairs into separate sequences. `zip(*[("a", 1), ("b", 2)])` gives you `("a", "b")` and `(1, 2)`.
- **matplotlib / `plt`**: the plotting library, imported as `plt`. `plt.bar(labels, heights, color=...)` draws one bar per label.
- **f-string format codes**: `{word:<12}` pads `word` with spaces on the right to 12 characters (left-aligned). `{prob:.4f}` shows a float with exactly 4 decimals.

## What you start with
Already in the kernel (run the loader cell first):
- `sentences`: `list[str]`, 170 lowercase sentences with no punctuation, e.g. `"i loved every minute of this film"`.
- `labels`: `list[int]` (1 = positive, 0 = negative). You do not need it in this project.
- Imports from the setup cell: `random`, `re`, `plt` (matplotlib.pyplot).

Your own exercise functions from this lab **must be defined and run first** (run the exercise cell, or the solution cell if you are stuck). Your project cell calls them:
- `tokenize(sentence: str) -> list[str]`: splits one sentence into lowercase word tokens. `tokenize("The Movie, was great!")` gives `['the', 'movie', 'was', 'great']`.
- `word_counts(sentences: list[str]) -> dict[str, int]`: counts every word across all sentences. On `["the movie was great", "the movie was long", "the food was great"]` it gives `the=3, movie=2, was=3, great=2, long=1, food=1`.
- `word_probabilities(counts: dict[str, int]) -> dict[str, float]`: divides each count by the grand total, so the values sum to 1. For the toy counts above the total is 12, so `P(the) = 3/12 = 0.25`.
- `top_k(distribution: dict[str, float], k: int) -> list[tuple[str, float]]`: returns the `k` `(word, probability)` pairs with the highest probability, highest first.

Note: the exercise cell also defines a small list named `sample`. Do not reuse that name for something else, or you will confuse yourself later.

## Steps

### Step 1: Write `sample_next_word`
Define `sample_next_word(distribution: dict[str, float], n: int = 5) -> list[str]`.

What it does: it picks `n` words at random from `distribution`. Each draw is independent (**with replacement**), and each word's chance of being picked equals its probability. It returns a list of `n` strings.

Why it exists: this is the "dice roll" that makes a model's output vary. A word with probability 0.10 should come up about 10 times in 100 draws. A word with probability 0.001 should almost never come up.

How to build it:
- `random.choices` needs two parallel lists. Make `words = list(distribution.keys())` and `weights = list(distribution.values())`. A dict keeps one fixed order, so the two lists line up.
- Call `random.choices(words, weights=weights, k=n)`. It already returns a list.

Tiny example: with `{"the": 0.5, "was": 0.3, "great": 0.2}` and `n=5`, one possible result is `['the', 'was', 'the', 'the', 'great']`. Another run gives a different list. Both are correct, because the function is random.

**Check:** `len(sample_next_word(dist, n=5)) == 5`, `len(sample_next_word(dist, n=8)) == 8`, and every item is a `str`. Call it with `n=1000` on `dist` and count how often `"the"` appears: it should be close to 100 (a bit over or under is fine, since `P(the)` is about 0.10).

### Step 2: Build `counts` and `dist` from the whole corpus
Use **your own** functions, in this order, and keep these variable names:
- `counts = word_counts(sentences)`: a dict of `str -> int`.
- `dist = word_probabilities(counts)`: a dict of `str -> float`.

Why: the counts alone are not probabilities. Dividing by the total turns "how many times" into "how likely".

**Check:** `abs(sum(dist.values()) - 1.0) < 1e-9`. This says the probabilities sum to 1 (floats can be off in the 15th decimal, so compare with a tiny tolerance, not `== 1`). Also `sum(counts.values())` should be 1473, and `dist["the"]` should be about 0.1005.

### Step 3: Print the summary line
Print one line in exactly this form, with the numbers **computed** (not typed in):

`170 sentences, 523 unique words.`

- Sentences: `len(sentences)`.
- Unique words: `len(counts)`. A dict has one key per distinct word, so its length is the number of unique words.

Why compute it: if the data changed, a typed-in number would silently be wrong.

**Check:** with the course tokenizer (letters only, lowercase) you should see `170 sentences, 523 unique words.` If your number is different, your tokenizer is probably keeping punctuation, digits or capital letters.

### Step 4: Print the 15 most probable words
1. `top15 = top_k(dist, 15)`. This is a list of 15 `(word, probability)` tuples, highest probability first.
2. Print the header line `Most probable words in the corpus:`.
3. Loop over `top15` and print one line per word: **two spaces**, then the word padded to 12 characters, a space, then `P=` and the probability with 4 decimals. Use `f"  {word:<12} P={prob:.4f}"`.

Worked example: for `("the", 0.10047...)` the line is `  the          P=0.1005`. The word `the` is followed by 9 padding spaces (to fill 12 characters), then one more space, then `P=`. Padding makes the `P=` values line up in a column.

**Check:** `len(top15) == 15`, the probabilities go down as you read the list, and the first line is `the` at `P=0.1005`.

### Step 5: Print the greedy pick
Print a blank line first. For example, call `print()` with no arguments, or start your string with `"\n"`. Then print:

`Greedy pick (always highest probability word): <word>`

Get the word from `top_k(dist, 1)`. That returns a list with one tuple, e.g. `[("the", 0.1005)]`. You need the word, so take the first item of the list (index `0`), then the first item of the tuple (index `0` again).

Why: greedy decoding is "take the highest, every time", so it never changes between runs.

**Check:** the word printed here is exactly the word on the first line of the top-15 list (`the`).

### Step 6: Print the sampled picks
Call `sample_next_word(dist, n=5)` and print:

`Sampled picks (weighted by probability): ` followed by the list, e.g.
`Sampled picks (weighted by probability): ['the', 'was', 'and', 'the', 'movie']`

Printing a list directly gives the square brackets and quotes shown above, and that is fine.

**Check:** exactly 5 words. Run the cell several times: the list should change, and `the` and `and` should show up more often than rare words.

### Step 7: Draw the bar chart
In order:
1. Split `top15` into two sequences: `words, probs = zip(*top15)`. `words` is a tuple of 15 strings, `probs` a tuple of 15 floats, in the same order.
2. `plt.figure(figsize=(9, 5))`: start a new 9-by-5-inch figure.
3. `plt.bar(words, probs, color="steelblue")`: one bar per word. The x positions are the words and the heights are the probabilities.
4. `plt.title("Word probability distribution over real review sentences")`.
5. `plt.ylabel("P(word)")`.
6. `plt.xticks(rotation=45, ha="right")`: tilt the word labels 45 degrees. `ha="right"` ("horizontal alignment") ends each label under its bar, so labels do not overlap.
7. `plt.tight_layout()`: shrinks margins so nothing is cut off.
8. `plt.show()`: displays the figure.

**Check:** you see 15 blue bars, tallest on the left (`the`, about 0.10) and shortest on the right (about 0.0075), with the exact title and y-label above.

## What a correct result looks like
- Line 1: `170 sentences, 523 unique words.`
- Then `Most probable words in the corpus:` and 15 lines. The first five are `the` 0.1005, `and` 0.0645, `this` 0.0407, `was` 0.0387, `is` 0.0238. Then `i` 0.0224, `a` 0.0149, `to` 0.0102, `of` 0.0095, `my` 0.0088. The last four (`were` 0.0081 and then `movie`, `film`, `with`, `made`, each 0.0075) have tied or near-tied counts, so the order within a tie can differ between solutions. The words and probabilities must still match.
- All 15 probabilities together add up to only about 0.37, well below 1, because 523 words share the rest.
- **Deterministic** (same every run): the first line, the top-15 list, and the greedy pick (`the`).
- **Random** (different every run): the sampled picks. Frequent words appear more often.
- Chart: 15 steelblue bars falling from left to right, labels tilted so they are readable.

## How you'll be graded
The grader compares behaviour, not exact formatting. These must hold:
1. `sample_next_word` returns exactly `n` words, drawn with replacement and weighted by the given probabilities (not uniformly, not without replacement).
2. The distribution is built from the full `sentences` list using the lab's own `word_counts` / `word_probabilities` (probabilities sum to 1).
3. The top-15 list is sorted by descending probability, with the correct words and probabilities, and the printed probabilities show 4 decimals.
4. The greedy pick is the single most probable word and matches the first top-15 entry.
5. The sentence count and unique-word count are computed from the data and printed.
6. The bar chart plots the top 15 words vs. their probabilities with the specified title, y-label, size, color and rotated labels.
