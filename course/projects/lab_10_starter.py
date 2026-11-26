FEW_SHOT_EXAMPLES = [
    (..., {"sentiment": ..., "confidence": ...}),
    (..., {"sentiment": ..., "confidence": ...}),
]

N_SAMPLES = ...
results = ...

for review in sentences[:N_SAMPLES]:
    messages = ...
    reply = call_groq(..., response_format=...)
    try:
        parsed = ...
        results.append((..., ..., ...))
    except (..., ...) as e:
        results.append((..., ..., ...))

for review, sentiment, confidence in results:
    print(f"{...:<25} conf={...}  {...}")
