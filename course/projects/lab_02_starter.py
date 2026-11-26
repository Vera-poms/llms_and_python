char_lengths = [float(...) for sentence in sentences]
word_count_values = [float(...) for sentence in sentences]

mean_baseline = ...
baseline_preds = ...
baseline_mse = ...

slope, intercept = ...
regression_preds = [... for x in char_lengths]
regression_mse = ...

print(f"Naive baseline (always predict mean={...:.2f}): MSE={...:.3f}")
print(f"Linear regression (word_count = {...:.3f} * char_len + {...:.3f}): MSE={...:.3f}")

new_sentence_len = 60.0
print()
print(f"Predicted word count for a {...}-character sentence: {...:.1f}")

plt.figure(...)
plt.scatter(...)
xs = ...
ys = [... for x in xs]
plt.plot(xs, ys, ...)
plt.axhline(...)
plt.xlabel(...)
plt.ylabel(...)
plt.title(...)
plt.legend()
plt.tight_layout()
plt.show()
