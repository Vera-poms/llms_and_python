MIN_WORD_COUNT = ...
MIN_POLARITY_RATIO = ...
TEST_FRACTION = ...
RANDOM_SEED = ...

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
        if ... or ...:
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


def train_test_split(*arrays, test_fraction, seed):
    rng = ...
    n = ...
    indices = ...
    n_test = ...
    test_idx = ...
    train_idx = ...
    return [... for a in arrays], [... for a in arrays]


def accuracy(model, X, y):
    preds = np.array([... for row in X])
    return float(...)


vocab = ...
X = ...
X2d = ...
print(f"Sentiment vocabulary ({...} words): {...}")

(X_train, X2d_train, y_train), (X_test, X2d_test, y_test) = train_test_split(
    ..., ..., ..., test_fraction=..., seed=...)

model = Perceptron(n_features=...)
errors_per_epoch = train(model, ..., ..., epochs=..., learning_rate=...)
accuracy_per_epoch = [... for e in errors_per_epoch]

test_acc = ...
print(f"Train examples: {...}, test examples: {...}")
print(f"Held-out test accuracy: {...:.2f}%")

fig, axes = plt.subplots(...)
preds_test = ...
correct = ...
axes[0].plot(...)
axes[0].set_xlabel(...)
axes[0].set_ylabel(...)
axes[0].set_title(...)
axes[1].scatter(...)
axes[1].scatter(...)
axes[1].scatter(...)
axes[1].scatter(...)
axes[1].set_xlabel(...)
axes[1].set_ylabel(...)
axes[1].set_title(...)
axes[1].legend(...)
plt.tight_layout()
plt.show()
