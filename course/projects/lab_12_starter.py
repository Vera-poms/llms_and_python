QUESTIONS = [
    ...,
    ...,
    ...,
    ...,
]

system_message = ...

for question in QUESTIONS:
    messages = [
        {"role": ..., "content": ...},
        {"role": ..., "content": ...},
    ]
    reply = call_groq(...)
    print(f"Q: {...}\nA: {...}\n")
