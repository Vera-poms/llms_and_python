def tokenize(sentence):
    return re.findall(..., sentence.lower())


def bigram_counts(sentences):
    counts = {}
    for sentence in sentences:
        words = ...
        for prev, nxt in zip(..., ...):
            inner = counts.setdefault(prev, {})
            inner[nxt] = ... + 1
    return counts


def build_cooccurrence_embeddings(sentences, dim=16):
    counts = bigram_counts(sentences)
    vocab = sorted(...)
    index = {word: i for i, word in enumerate(vocab)}
    V = len(vocab)
    raw = np.zeros((V, V))
    for prev, inner in counts.items():
        total = ...
        for nxt, count in inner.items():
            raw[index[prev], index[nxt]] = ...
    rng = np.random.default_rng(0)
    projection = ...
    embeddings = ...
    return {word: embeddings[index[word]] for word in vocab}


embeddings = build_cooccurrence_embeddings(...)

sentence = ...
words = ...
X = np.stack(...)

_, weights = scaled_dot_product_attention(..., ..., ...)

plt.figure(...)
plt.imshow(...)
plt.colorbar(...)
plt.xticks(...)
plt.yticks(...)
plt.title(...)
plt.tight_layout()
plt.show()
