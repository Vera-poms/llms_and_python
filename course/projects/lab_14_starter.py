def build_zero_shot_messages(review):
    return [
        {"role": "system", "content": ...},
        {"role": "user", "content": ...},
    ]


def parse_label(reply_text):
    text = ...
    if ... in text:
        return ...
    if ... in text:
        return ...
    return text


groq_client = SimpleAPIClient(
    base_url=...,
    headers={
        "Authorization": ...,
        "Content-Type": ...,
    },
)

review = ...

body = {
    "model": ...,
    "messages": ...,
    "temperature": ...,
}
response_body = groq_client.post(..., body)

reply_text = response_body[...][...][...][...]

print(f"Review: {...}")
print(f"Predicted sentiment: {...}")
