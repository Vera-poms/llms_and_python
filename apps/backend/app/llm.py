"""One place to call a chat model, used by the grader and the hint tutor.

Groq is the default because the course already runs on Groq's free tier; set ANTHROPIC_API_KEY
instead (or as well, with LLM_PROVIDER=anthropic) to use Claude. Callers get LLMUnavailable with a
message that is safe to show a student - never a raw provider payload, which can contain the key.
"""

import logging

import requests

from core.config import (
    ANTHROPIC_API_KEY,
    ANTHROPIC_MODEL,
    GROQ_API_KEY,
    GROQ_MODEL,
    LLM_PROVIDER,
)

logger = logging.getLogger(__name__)

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
TIMEOUT_SECONDS = 30


class LLMUnavailable(RuntimeError):
    """Raised when no model could answer. The message is shown to the student as-is."""


def provider() -> str | None:
    """Which provider is actually usable, honouring LLM_PROVIDER when it is set."""
    if LLM_PROVIDER == "groq":
        return "groq" if GROQ_API_KEY else None
    if LLM_PROVIDER == "anthropic":
        return "anthropic" if ANTHROPIC_API_KEY else None
    if GROQ_API_KEY:
        return "groq"
    if ANTHROPIC_API_KEY:
        return "anthropic"
    return None


def is_configured() -> bool:
    return provider() is not None


def _friendly_error(status_code: int, body: str) -> str:
    lowered = body.lower()
    if "credit balance is too low" in lowered or "insufficient" in lowered or "billing" in lowered:
        return "The course's AI account is out of credit. Ask your instructor to top it up."
    if status_code in (401, 403):
        return "The course's AI key was rejected. Ask your instructor to check it."
    if status_code == 429:
        return "The AI tutor is rate-limited right now - wait a few seconds and try again."
    return "The AI tutor is unavailable right now - try again in a moment."


def _post(url: str, headers: dict, payload: dict) -> dict:
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=TIMEOUT_SECONDS)
    except requests.RequestException as exc:
        logger.warning("LLM request failed to send: %s", exc)
        raise LLMUnavailable("Couldn't reach the AI tutor - check the server's connection.") from exc

    if response.status_code >= 400:
        # Logged server-side for the instructor; the student sees only the sanitized message.
        logger.warning("LLM call returned %s: %s", response.status_code, response.text[:500])
        raise LLMUnavailable(_friendly_error(response.status_code, response.text))

    return response.json()


def _complete_groq(system_prompt: str, user_prompt: str, max_tokens: int) -> str:
    data = _post(
        GROQ_URL,
        {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
        {
            "model": GROQ_MODEL,
            "max_tokens": max_tokens,
            "temperature": 0,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        },
    )
    return data["choices"][0]["message"]["content"].strip()


def _complete_anthropic(system_prompt: str, user_prompt: str, max_tokens: int) -> str:
    data = _post(
        ANTHROPIC_URL,
        {
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        {
            "model": ANTHROPIC_MODEL,
            "max_tokens": max_tokens,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_prompt}],
        },
    )
    return data["content"][0]["text"].strip()


def complete(system_prompt: str, user_prompt: str, max_tokens: int = 400) -> str:
    chosen = provider()
    if chosen is None:
        raise LLMUnavailable("The AI tutor isn't set up on this server (no GROQ_API_KEY).")

    try:
        if chosen == "groq":
            return _complete_groq(system_prompt, user_prompt, max_tokens)
        return _complete_anthropic(system_prompt, user_prompt, max_tokens)
    except (KeyError, IndexError, ValueError) as exc:
        logger.warning("Unexpected LLM response shape from %s: %s", chosen, exc)
        raise LLMUnavailable("The AI tutor returned something unexpected - try again.") from exc
