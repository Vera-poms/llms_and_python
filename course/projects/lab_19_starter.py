store = VectorStore()
for fact in TWIN_FACTS:
    store.add(..., ...)

questions = [...]
for question in questions:
    results = store.search(..., 2)
    context = "\n".join(f"- {...}" for pair in results)
    prompt = f"...{context}...{question}"
    print(prompt)
    print("=" * 20)
