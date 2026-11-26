MIN_WORD_COUNT = ...
MIN_POLARITY_RATIO = ...

y = np.array([... for l in labels])


def tok(sentence):
    return re.findall(..., ...)


def build_vocab(sentences, y):
    pos_counts, neg_counts = {}, {}
    for sentence, label in zip(sentences, y):
        for word in set(tok(sentence)):
            ...
    pairs = []
    for word in set(pos_counts) | set(neg_counts):
        pos = ...
        neg = ...
        total = pos + neg
        if ...:
            continue
        if ...:
            continue
        pairs.append((word, total))
    pairs = sorted(pairs, key=..., reverse=True)
    return [...]


def vectorize(sentences, vocab):
    column = {word: j for j, word in enumerate(vocab)}
    X = np.zeros((..., ...))
    for i, sentence in enumerate(sentences):
        for word in set(tok(sentence)):
            if ...:
                X[i, ...] = 1.0
    return X


def pca_2d(X):
    centered = ...
    cov = ...
    eigenvalues, eigenvectors = ...
    order = ...
    top2 = ...
    return ...


def plot_boundary(X2d, y, model, title):
    plt.figure(...)
    mask = ...
    plt.scatter(...)
    plt.scatter(...)
    if ...:
        xs = np.linspace(...)
        ys = ...
        plt.plot(...)
    plt.xlabel(...)
    plt.ylabel(...)
    plt.title(...)
    plt.legend()
    plt.tight_layout()
    plt.show()


vocab = ...
X = ...
X2d = ...
model = ...
preds = np.array([... for row in X2d])
accuracy = ...

print(f"Vocabulary size: {...}")
print(f"Untrained perceptron accuracy on real sentiment data: {...:.2f}%")
print("(Weights are all zero, so it predicts the same class for everything - see lab 5.)")

plot_boundary(..., ..., ..., "...")
