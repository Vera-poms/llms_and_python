def embed(text):
    words = ...
    known = [... for w in words if ...]
    return [sum(column) / len(known) for column in zip(*known)]


fact_vectors = [... for fact in TWIN_FACTS]

questions = [...]
for question in questions:
    query = ...
    scores = [... for vector in fact_vectors]
    best = ...
    print(f"Q: ...")
    print(f"A: ... (...)")
