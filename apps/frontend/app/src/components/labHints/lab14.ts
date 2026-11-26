import type { CodeHint } from "../codeHints";

// Hover hints for the Lab 14 exercise cell. `match` picks the cell (a piece of its starter code).
export const lab14Hints: { match: string; hints: CodeHint[] }[] = [
  {
    match: "class SimpleAPIClient:",
    hints: [
      {
        code: "def __init__(self, base_url: str, headers: dict | None = None):",
        block: "function",
        text: "Already written for you. It stores `self.base_url` (with any trailing `/` removed) and `self.headers` (an empty dict if you pass none).",
      },
      {
        code: "def post(self, path: str, json_body: dict) -> dict:",
        block: "function",
        text:
          "Sends a POST request to the service and gives back its answer. You get `path` (a string starting with `/`, like `\"/post\"`) and `json_body` (a dict to send, like `{\"hello\": \"world\"}`). " +
          "You give back a dict, the reply read from JSON. Example: `SimpleAPIClient(\"https://httpbin.org\").post(\"/post\", {\"hello\": \"world\"})[\"json\"]` gives `{\"hello\": \"world\"}` because httpbin sends back what it received. " +
          "If the server replies with a status that is not 2xx, it raises `requests.exceptions.HTTPError`.",
      },
      {
        code: "raise NotImplementedError(\"SimpleAPIClient.post()",
        text:
          "Your turn: replace this line with your code. Write it in this shape (replace each `...`):\n" +
          "`def post(self, path, json_body):`\n`    url = ...`\n`    response = requests.post(..., headers=..., json=..., timeout=30)`\n`    response.raise_for_status()`\n`    return ...`\n" +
          "**1)** Set `url` to `self.base_url` plus `path`. For example, `\"https://httpbin.org\"` plus `\"/post\"` gives `\"https://httpbin.org/post\"`.\n" +
          "**2)** Send a POST request with `requests.post(url, headers=self.headers, json=json_body, timeout=30)`. Save it in `response`.\n" +
          "**3)** Call `response.raise_for_status()`. For a 4xx or 5xx status code it raises `requests.exceptions.HTTPError`.\n" +
          "**4)** Return `response.json()`, which is a dict.\n" +
          "**Check:** with `client = SimpleAPIClient(\"https://httpbin.org\", headers={\"X-Test\": \"1\"})` and `reply = client.post(\"/post\", {\"hello\": \"world\"})`, you get `reply[\"json\"] == {\"hello\": \"world\"}`, `reply[\"headers\"][\"X-Test\"] == \"1\"`, and `type(reply)` is `dict`. `client.post(\"/status/404\", {})` raises `requests.exceptions.HTTPError`.",
      },
      {
        code: "client = SimpleAPIClient(base_url=",
        text: "Makes a client for httpbin.org (a free echo service) that sends the header `X-Test: 1` on every call. This needs internet.",
      },
      {
        code: "assert client.base_url ==",
        text: "A self-check. `base_url` must be `\"https://httpbin.org\"`.",
      },
      {
        code: "result = client.post(",
        text: "Runs **your** `post` for real: one call to httpbin.org with the body `{\"hello\": \"world\"}`. httpbin echoes back what it got.",
      },
      {
        code: "assert result[\"json\"] ==",
        text: "A self-check. The echoed `json` must equal `{\"hello\": \"world\"}`.",
      },
      {
        code: "assert result[\"headers\"][\"X-Test\"] ==",
        text: "A self-check. The echoed header `X-Test` must be `\"1\"`.",
      },
      {
        code: "print(\"All checks passed",
        text: "When every assert passes, this prints **All checks passed** and reminds you that the cell made a real network call.",
      },
    ],
  },
];
