def build_digital_twin_system_prompt(profile):
    lines = [
        ...,
        ...,
        ...,
    ]
    lines += [... for fact in ...]
    lines.append(...)
    lines += [... for boundary in ...]
    return ...


def real_transport(messages, api_key, model):
    return ...


my_profile = {
    "name": ...,
    "role": ...,
    "tone": ...,
    "facts": [..., ...],
    "boundaries": [...],
}

twin = GroqClient(api_key=..., model=..., system_prompt=..., transport=...)

for user_message in [..., ...]:
    reply = twin.send(...)
    print(...)
    print(...)
    print()

print("--- Full messages list ---")
for message in twin.history:
    print(f"{...:<10} {...}")
