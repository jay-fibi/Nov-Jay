"""Demo 5: Word frequency counter using collections.Counter."""

import re
from collections import Counter

SAMPLE_TEXT = """
Python is easy to learn. Python is powerful.
Many developers love Python because Python is readable.
"""


def count_words(text):
    words = re.findall(r"[a-z']+", text.lower())
    return Counter(words)


def main():
    counts = count_words(SAMPLE_TEXT)
    print(f"Total words: {sum(counts.values())}")
    print(f"Unique words: {len(counts)}")
    print("Top 3 words:")
    for word, freq in counts.most_common(3):
        print(f"  {word}: {freq}")


if __name__ == "__main__":
    main()
