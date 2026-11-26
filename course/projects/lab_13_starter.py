my_profile = {
    "name": ...,
    "role": ...,
    "tone": ...,
    "facts": [..., ...],
    "boundaries": [...],
}

messages = [{"role": "system", "content": ...}]

conversation_turns = [
    ...,
    ...,
]

for user_message in conversation_turns:
    messages.append(...)
    reply = call_groq(...)
    messages.append(...)
    print(...)
    print(...)

print(f"Final messages list has {...} turns.")
