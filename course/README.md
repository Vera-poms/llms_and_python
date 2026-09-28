# Course: LLM Foundations

Hands-on labs for the web app's lab list, covering probability through a real
Groq-backed `GroqClient` wrapper.

## Notebooks (primary format) - `course/notebooks/`

Every lab (1-15) has a self-contained Jupyter notebook,
`course/notebooks/lab_NN_*.ipynb`. Each one has:

- **Reading** cells explaining the concept
- An **exercise** cell with `# TODO` markers and self-check asserts
- A **solution** cell (redefines the same functions/classes, filled in)
- A **real-world project** cell using the real `data/review_sentences.csv`
  dataset (or, for labs 9-15, a real call to Groq's free API)

No repo checkout is needed to run one - each notebook embeds its own data and
re-includes any code it needs from earlier labs.

### Running in Google Colab

1. Go to [colab.research.google.com](https://colab.research.google.com) and
   choose **File > Upload notebook**, then pick the `.ipynb` file from
   `course/notebooks/`.
2. Run cells top to bottom (Shift+Enter). The exercise cell will raise
   `NotImplementedError` until you fill in the `# TODO`s - that's expected.
3. Labs 9-15 will prompt you for `GROQ_API_KEY` with a hidden input field the
   first time you run their setup cell. Get a free key at
   [console.groq.com/keys](https://console.groq.com/keys) - it's never saved
   anywhere, just held in that Colab session's memory.

### Running locally in Jupyter instead

```bash
cd course
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt jupyter
jupyter notebook notebooks/
```

## Plain `.py` files (labs 1-5) - `course/lab_0N_*/`

The original phase-1 files are still here and still work if you'd rather edit
real files in an editor than a notebook: `exercise.py` / `solution.py` /
`project.py` per lab, run directly with `python lab_NN_*/project.py` from the
`course/` directory. `lab_05_training_perceptron` imports `perceptron.py` from
`lab_04_perceptron` as a sibling-folder module (the notebook version
re-includes the class instead, to stay self-contained).

Mark a lab done in the web app once you've run its project and understood the
output.
