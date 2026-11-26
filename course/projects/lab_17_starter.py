before = sum(... for m in CHAT_HISTORY)

trimmed = trim_messages(..., ...)

after = sum(... for m in trimmed)

print(f"before: ... messages, ... tokens")
print(f"after: ... messages, ... tokens")
for message in trimmed:
    print(f"...: ...")
