from google import genai
import sys

client = genai.Client()

PROMPT = """You are reviewing a pull request diff for a React 18 + Vite SPA \
(Redux Toolkit for state, React Router for routing). Focus on:
- correctness bugs and React-specific pitfalls (hooks rules, stale closures, \
missing dependency arrays, unnecessary re-renders)
- Redux state handled outside the slices, or components reaching into state \
they shouldn't
- security issues (XSS via dangerouslySetInnerHTML, unsanitized input, \
secrets in code)
- accessibility regressions
- dead code, needless complexity, or duplicated logic

Ignore formatting/style nits a linter would catch. Be concise: list only \
real issues found in the diff below, with file/line references. If nothing \
of substance is wrong, say so briefly.

Diff:
"""

def ai_review(diff: str) -> str:
    """Review the code using AI."""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=PROMPT + diff,
    )
    return response.text

if __name__ == "__main__":
    if len(sys.argv) > 1:
        diff_file = sys.argv[1]
        with open(diff_file, "r") as f:
            diff_content = f.read()
    else:
        diff_content = sys.stdin.read()

    review = ai_review(diff_content)
    print(review)
