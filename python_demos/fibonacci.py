"""Demo 2: Fibonacci sequence generator (iterative and generator-based)."""


def fibonacci_list(n):
    """Return a list of the first n Fibonacci numbers."""
    sequence = []
    a, b = 0, 1
    for _ in range(n):
        sequence.append(a)
        a, b = b, a + b
    return sequence


def fibonacci_gen():
    """Infinite Fibonacci generator."""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b


def main():
    print("First 10 Fibonacci numbers:", fibonacci_list(10))
    gen = fibonacci_gen()
    print("Generator (first 5):", [next(gen) for _ in range(5)])


if __name__ == "__main__":
    main()
