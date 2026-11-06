# Project: Your Twin's First RAG Prompt (Offline)

## Goal
The question: **how does a model answer about things it was never trained on?** The answer: you search your own text, paste the best matches into the prompt, and let the model read them. That is RAG.

You will use the `VectorStore` class you wrote in the exercise to:

1. Fill a store with the six facts about Ada, each with its vector.
2. For each of two questions, retrieve the 2 best matching facts.
3. Build a prompt that holds those facts as context, followed by the question.
4. Print the prompt.

No LLM is called here. The prompt you print is what a real RAG app would send to the model.

Takeaway: RAG is retrieve, then augment, then generate. Retrieval and the prompt are plain code, and the model only reads the result.

## What you start with
Already in the notebook:
- `WORD_VECTORS`: a dict from lowercase words to lists of 5 numbers (from lab 3).
- `TWIN_FACTS`: a list of 6 sentences about Ada.
- `embed(text) -> list[float]`: you give it a sentence. It gives back its vector, the average of the vectors of the words it knows.

Your own exercise cell **must be defined and run first**. Run the exercise cell, or the solution cell if you are stuck.

- `VectorStore()`: an empty store. `store.add(text, vector)` puts a text and its vector in it. `store.search(query_vector, k)` gives back a list of at most `k` pairs `(score, text)`, best first.
- `cosine_similarity`: used inside `search`. You do not call it here.

*Retrieval* means finding the pieces of text that match a question. *Augmenting* means adding them to the prompt. The added text is the *context*. A *prompt* is the text you send to a model.

If you see `NameError: name 'VectorStore' is not defined`, run your exercise or solution cell first.

## Steps

### Step 1: fill the store
Code shape:
```python
store = VectorStore()
for fact in TWIN_FACTS:
    store.add(..., ...)
```
You get `TWIN_FACTS` (6 sentences), `embed` and `VectorStore`. Write the code that does these steps:

1. Set `store` to `VectorStore()`.
2. Loop with `for fact in TWIN_FACTS:`.
3. Call `store.add(fact, embed(fact))`.

**Check:** `len(store.items)` is `6`.

### Step 2: retrieve for each question
Code shape:
```python
questions = [...]
for question in questions:
    results = store.search(..., 2)
```
You get `store` and `embed`. Write the code that does these steps:

1. Set `questions` to a list of exactly these two strings, in this order: `"Which sport team does she follow?"`, `"Where has she travelled?"`.
2. Loop with `for question in questions:`.
3. Set `results` to `store.search(embed(question), 2)`. Each item is a `(score, text)` pair.

**Check:** `len(results)` is `2`. For the first question the best text is `"Her favorite team is Hearts of Oak and she watches every match."`

### Step 3: build the prompt
Code shape:
```python
context = "\n".join(f"- {text}" for ... in results)
prompt = f"...{context}...{question}"
```
You get `results` (pairs like `(0.9, "some fact")`) and `question`. Write the code that does these steps, inside the loop:

1. Set `context` to `"\n".join(f"- {text}" for _, text in results)`. The `_` is the score, which you do not need.
2. Set `prompt` with an f-string in this exact layout:

```
Answer using only this context.

Context:
<context>

Question: <question>
```

There is a blank line after the first line and after `<context>`.

**Check:** `prompt` starts with `Answer using only this context.` and ends with `Question: ` plus the question.

### Step 4: print it
Code shape:
```python
print(prompt)
print("=" * 20)
```
You get `prompt`. Write the code that does these steps, inside the loop:

1. Print `prompt`.
2. Print `"=" * 20`.

The output is exactly:

```
Answer using only this context.

Context:
- Her favorite team is Hearts of Oak and she watches every match.
- On Saturdays she runs five kilometers in the park.

Question: Which sport team does she follow?
====================
Answer using only this context.

Context:
- Last summer she travelled to Accra and Lisbon by plane.
- On Saturdays she runs five kilometers in the park.

Question: Where has she travelled?
====================
```

**Check:** two prompts, each followed by a line of 20 `=` characters, and nothing else.
