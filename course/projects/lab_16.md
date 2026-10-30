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
Make a string named `clean` from `TWIN_DOC` in which all runs of spaces and new lines are one single space. Use `" ".join(TWIN_DOC.split())`. Do not change `TWIN_DOC` itself.

**Check:** `"  " in clean` is `False` and `"\n" in clean` is `False`. `len(clean.split())` is `59`.

### Step 2: cut it into chunks
Code shape:
```python
chunks = chunk_words(..., ..., ...)
```
Call your function on `clean` with `size=12` and `overlap=4`. Save the list as `chunks`. With these numbers each chunk moves 8 words forward.

**Check:** `chunks` is a list of `7` strings. The first one starts with `"Ada writes Python code"`.

### Step 3: print the summary line
Code shape:
```python
print(f"... words -> ... chunks")
```
Print exactly one line: the number of words in `clean`, then ` words -> `, then the number of chunks, then ` chunks`. For example `10 words -> 3 chunks`. Use `len(clean.split())` for the words and `len(chunks)` for the chunks. An *f-string* is a string with `f` in front where `{...}` is replaced by a value: `f"{2 + 3} apples"` is `"5 apples"`.

**Check:** the line is `59 words -> 7 chunks`.

### Step 4: print every chunk
Code shape:
```python
for number, chunk in enumerate(chunks, 1):
    print(...)
```
`enumerate(chunks, 1)` hands you each chunk together with a counter that starts at 1. For each one print `[<number>] <chunk>`, for example `[1] Ada writes Python code`.

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
