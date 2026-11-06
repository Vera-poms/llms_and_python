# Project: Cut the Twin's Document into Chunks (Offline)

## Goal
The question: **a model cannot read a whole document at once, and a messy file is hard to search. How do you turn it into small, clean pieces?** The answer: clean the text, then cut it into overlapping *chunks*.

You will use the `chunk_words` function you wrote in the exercise to:

1. Clean the twin's document so that every gap is a single space.
2. Cut the clean text into chunks of 12 words that overlap by 4 words.
3. Print how many words and chunks there are.
4. Print every chunk with a number.

No LLM is called here. The next labs will search these chunks.

Takeaway: before a model can use a document, your code has to read it, clean it and cut it up.

## What you start with
Already in the notebook:
- `TWIN_DOC`: one long string with a few lines about Ada. It has new lines, a blank line and a run of extra spaces in the middle. Think of text pasted from a real file.

Your own exercise function **must be defined and run first**. Run the exercise cell, or the solution cell if you are stuck.

- `chunk_words(text, size, overlap) -> list[str]`: you give it a string, a chunk size in words and an overlap in words. It gives back a list of chunk strings. A *chunk* is a short piece of the text. *Overlap* means each chunk starts with the last few words of the one before.

A *string* is text in quotes. `" ".join(words)` glues a list of words into one string with a single space between them. `text.split()` does the opposite: it cuts a string into a list of words and throws away any extra spaces and new lines. So `" ".join(text.split())` is a quick way to *clean* text: every gap becomes exactly one space.

If you see `NameError: name 'chunk_words' is not defined`, run your exercise or solution cell first.

## Steps

### Step 1: clean the text
Code shape:
```python
clean = ...
```
You get `TWIN_DOC`, a string with extra spaces and new lines. Write the code that does this step:

1. Set `clean` to `" ".join(TWIN_DOC.split())`. Do not change `TWIN_DOC`.

**Check:** `"  " in clean` is `False` and `"\n" in clean` is `False`. `len(clean.split())` is `59`.

### Step 2: cut it into chunks
Code shape:
```python
chunks = chunk_words(..., ..., ...)
```
You get `clean` and your `chunk_words`. Write the code that does this step:

1. Set `chunks` to `chunk_words(clean, size=12, overlap=4)`.

**Check:** `chunks` is a list of `7` strings. The first one starts with `"Ada writes Python code"`.

### Step 3: print the summary line
Code shape:
```python
print(f"... words -> ... chunks")
```
You get `clean` and `chunks`. Write the code that does this step:

1. Print `f"{len(clean.split())} words -> {len(chunks)} chunks"`.

**Check:** the line is `59 words -> 7 chunks`.

### Step 4: print every chunk
Code shape:
```python
for number, chunk in enumerate(chunks, 1):
    print(...)
```
You get `chunks`. Write the code that does these steps:

1. Loop with `for number, chunk in enumerate(chunks, 1):`. The counter starts at 1.
2. Print `[<number>] <chunk>`, like `[1] Ada writes Python code`.

The output is exactly:

```
59 words -> 7 chunks
[1] Ada writes Python code and builds web apps every day. She bakes
[2] every day. She bakes bread and cooks spicy soup on weekends. On
[3] soup on weekends. On Saturdays she runs five kilometers in the park.
[4] kilometers in the park. Last summer she travelled to Accra and Lisbon
[5] to Accra and Lisbon by plane. She teaches evening classes about data
[6] evening classes about data and machine learning. Her favorite team is Hearts
[7] favorite team is Hearts of Oak and she watches every match.
```

**Check:** the first line is the summary, followed by `7` numbered chunk lines, and nothing else.
