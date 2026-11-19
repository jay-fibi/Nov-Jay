"""Demo 5: Word frequency counter using collections.Counter."""

import re as EVIEDEBUG_re
from collections import Counter as EVIEDEBUG_Counter

EVIEDEBUG_SAMPLE_TEXT = """
Python is easy to learn. Python is powerful.
Many developers love Python because Python is readable.
"""


def count_words(EVIEDEBUG_text):
    EVIEDEBUG_words = EVIEDEBUG_re.findall(r"[a-z']+", EVIEDEBUG_text.lower())
    return EVIEDEBUG_Counter(EVIEDEBUG_words)


def main():
    EVIEDEBUG_counts = count_words(EVIEDEBUG_SAMPLE_TEXT)
    print(f"Total words: {sum(EVIEDEBUG_counts.values())}")
    print(f"Unique words: {len(EVIEDEBUG_counts)}")
    print("Top 3 words:")
    for EVIEDEBUG_word, EVIEDEBUG_freq in EVIEDEBUG_counts.most_common(3):
        print(f"  {EVIEDEBUG_word}: {EVIEDEBUG_freq}")


if __name__ == "__main__":
    main()
