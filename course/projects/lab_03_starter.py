def generate_sentence(cond, start, length=10):
    words = [start]
    current = start
    for _ in range(...):
        options = ...
        if ...:
            break
        ...
    return ...


counts = ...
cond = ...

print("Generated sentences from the real bigram model:")
for seed in [...]:
    print(f"  [{seed}] -> {...}")

totals = {prev: ... for prev, inner in counts.items()}
top_prev_words = ...

next_word_totals = {}
for prev in top_prev_words:
    for nxt, count in counts[prev].items():
        ...
top_next_words = ...

matrix = np.zeros(...)
for i, prev in enumerate(top_prev_words):
    for j, nxt in enumerate(top_next_words):
        matrix[i, j] = ...

plt.figure(...)
plt.imshow(...)
plt.colorbar(...)
plt.xticks(...)
plt.yticks(...)
plt.xlabel(...)
plt.ylabel(...)
plt.title(...)
plt.tight_layout()
plt.show()
