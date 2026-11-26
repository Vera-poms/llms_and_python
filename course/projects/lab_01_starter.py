def sample_next_word(distribution, n=5):
    words = ...
    weights = ...
    return ...


counts = ...
dist = ...

print(f"{...} sentences, {...} unique words.")

top15 = ...
print("Most probable words in the corpus:")
for word, prob in top15:
    print(f"...")

print()
print(f"Greedy pick (always highest probability word): {...}")

print(f"Sampled picks (weighted by probability): {...}")

words, probs = ...
plt.figure(...)
plt.bar(...)
plt.title(...)
plt.ylabel(...)
plt.xticks(...)
plt.tight_layout()
plt.show()
