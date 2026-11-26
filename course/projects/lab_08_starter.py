classify_sentiment = PromptTemplate(
    "..."
    "\n\n"
    "Review: {review}"
)

summarize = PromptTemplate(
    "..."
    "\n\n"
    "Review: {review}"
)

TEMPLATES = {
    "classify_sentiment": ...,
    "summarize": ...,
}

for name, template in TEMPLATES.items():
    print(...)
    for review in sentences[:2]:
        print(...)
        print()
