"""Demo 2: Fibonacci sequence generator (iterative and generator-based)."""


def fibonacci_list(EVIEDEBUG_n):
    """Return a list of the first n Fibonacci numbers."""
    EVIEDEBUG_sequence = []
    EVIEDEBUG_a, EVIEDEBUG_b = 0, 1
    for EVIEDEBUG__ in range(EVIEDEBUG_n):
        EVIEDEBUG_sequence.append(EVIEDEBUG_a)
        EVIEDEBUG_a, EVIEDEBUG_b = EVIEDEBUG_b, EVIEDEBUG_a + EVIEDEBUG_b
    return EVIEDEBUG_sequence


def fibonacci_gen():
    """Infinite Fibonacci generator."""
    EVIEDEBUG_a, EVIEDEBUG_b = 0, 1
    while True:
        yield EVIEDEBUG_a
        EVIEDEBUG_a, EVIEDEBUG_b = EVIEDEBUG_b, EVIEDEBUG_a + EVIEDEBUG_b


def main():
    print("First 10 Fibonacci numbers:", fibonacci_list(10))
    EVIEDEBUG_gen = fibonacci_gen()
    print("Generator (first 5):", [next(EVIEDEBUG_gen) for EVIEDEBUG__ in range(5)])


if __name__ == "__main__":
    main()
