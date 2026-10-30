# Project: Find the Fact Closest in Meaning (Offline)

## Goal
The question: **how can a computer find the sentence that matches a question when the words are not the same?** The answer: turn both into vectors and compare directions.

You will use the `cosine_similarity` function you wrote in the exercise to:

1. Write `embed(text)`, which turns a sentence into one vector by averaging its word vectors.
2. Embed all six facts about Ada.
3. For each of three questions, score every fact and pick the best one.
4. Print each question with its best fact and the score.

No LLM is called here. The vectors are tiny and hand-made, but the steps are the same ones real embedding search uses.

Takeaway: an embedding turns meaning into numbers, and cosine similarity tells you which two pieces of text are closest.

## What you start with
Already in the notebook:
- `WORD_VECTORS`: a dict. Each key is a lowercase word like `"bread"`. Each value is a list of 5 numbers: how much the word means food, tech, sport, travel and school, in that order. For example `WORD_VECTORS["bread"]` is `[1.0, 0.0, 0.0, 0.0, 0.0]`. Only some words are in it. Words like `"she"` or `"does"` are not.
- `TWIN_FACTS`: a list of 6 sentences about Ada. `TWIN_FACTS[1]` is `"She bakes bread and cooks spicy soup on weekends."`

Your own exercise function **must be defined and run first**. Run the exercise cell, or the solution cell if you are stuck.

- `cosine_similarity(a, b) -> float`: you give it two vectors (lists of numbers of the same length). It gives back a score from -1 to 1. The higher the score, the closer the meaning.

A *vector* is a list of numbers. An *embedding* is a vector that stands for the meaning of a word or text. To embed a sentence, we average the vectors of the words in it: add the numbers in each position and divide by how many words there are.

If you see `NameError: name 'cosine_similarity' is not defined`, run your exercise or solution cell first.

## Steps

### Step 1: write `embed(text)`
Code shape:
```python
def embed(text):
    words = ...
    known = [... for w in words if ...]
    return [sum(column) / len(known) for column in zip(*known)]
```
**You get:** a sentence as a string. **You give back:** a list of 5 numbers.

How:
1. Make the text lowercase, remove the `.` and `?` characters, and cut it into words. For example `text.lower().replace(".", "").replace("?", "").split()`.
2. Keep the vector of every word that is in `WORD_VECTORS` and skip the rest. A list comprehension does it: `[WORD_VECTORS[w] for w in words if w in WORD_VECTORS]`. `known` is now a list of vectors.
3. Average them position by position. `zip(*known)` lines the vectors up so that `column` is all the first numbers, then all the second numbers, and so on. `sum(column) / len(known)` is the average of one column. The `*` unpacks the list into separate arguments.

**Check:** `embed("She bakes bread.")` has 5 numbers. Only `bakes` and `bread` are known, so its first number is `(0.9 + 1.0) / 2 = 0.95` and the other four are `0.0`.

### Step 2: embed the facts
Code shape:
```python
fact_vectors = [... for fact in TWIN_FACTS]
```
Make a list `fact_vectors` with `embed(fact)` for each fact, in the same order as `TWIN_FACTS`.

**Check:** `len(fact_vectors)` is `6`, and each item has `5` numbers.

### Step 3: score and pick the best
Code shape:
```python
questions = [...]
for question in questions:
    query = ...
    scores = [... for vector in fact_vectors]
    best = ...
```
Use exactly these three questions, in this order:
1. `"What food does she cook?"`
2. `"Which countries did she visit?"`
3. `"What programming language does she use?"`

For each question:
1. Embed it with `embed`. Call it `query`.
2. Make `scores`: `cosine_similarity(query, vector)` for each vector in `fact_vectors`.
3. Find the position of the highest score: `scores.index(max(scores))`. `max` gives the highest score and `.index` tells you where it sits. Call it `best`.

**Check:** for the first question `best` is `1`.

### Step 4: print the answers
Code shape:
```python
print(f"Q: ...")
print(f"A: ... (...)")
```
Inside the loop print two lines for each question. The first is `Q: <question>`. The second is `A: <best fact> (<score>)`, where the score has 3 digits after the decimal point. In an f-string, `{score:.3f}` does this: `f"{0.5:.3f}"` is `"0.500"`.

The output is exactly:

```
Q: What food does she cook?
A: She bakes bread and cooks spicy soup on weekends. (1.000)
Q: Which countries did she visit?
A: Last summer she travelled to Accra and Lisbon by plane. (1.000)
Q: What programming language does she use?
A: Ada writes Python code and builds web apps every day. (0.999)
```

**Check:** 6 lines in total, and each `A:` line ends with a score such as `(0.xxx)`.
