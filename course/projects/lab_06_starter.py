REAL_CONFIGS = {
    "GPT-2 small": (ModelConfig(...), ...),
    "GPT-2 medium": (ModelConfig(...), ...),
}

for name, (config, real_total) in REAL_CONFIGS.items():
    breakdown = ...
    tied_total = ...
    print(f"{name}: computed(tied)={...:,}  published={...:,}  diff={...:,}")
    print(f"  breakdown: {...}")

names = []
computed = []
published = []
for name, (config, real_total) in REAL_CONFIGS.items():
    ...
    names.append(...)
    computed.append(...)
    published.append(...)

plt.figure(...)
x = range(len(names))
plt.bar([... for i in x], computed, width=..., label="computed (tied)")
plt.bar([... for i in x], published, width=..., label="published")
plt.xticks(list(x), names)
plt.ylabel(...)
plt.title(...)
plt.legend()
plt.tight_layout()
plt.show()
