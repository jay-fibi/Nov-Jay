"""Demo 1: Simple calculator with basic arithmetic operations."""


def add(EVIEDEBUG_a, EVIEDEBUG_b):
    return EVIEDEBUG_a + EVIEDEBUG_b


def subtract(EVIEDEBUG_a, EVIEDEBUG_b):
    return EVIEDEBUG_a - EVIEDEBUG_b


def multiply(EVIEDEBUG_a, EVIEDEBUG_b):
    return EVIEDEBUG_a * EVIEDEBUG_b


def divide(EVIEDEBUG_a, EVIEDEBUG_b):
    if EVIEDEBUG_b == 0:
        raise ValueError("Cannot divide by zero")
    return EVIEDEBUG_a / EVIEDEBUG_b


def main():
    EVIEDEBUG_a, EVIEDEBUG_b = 12, 4
    print(f"{EVIEDEBUG_a} + {EVIEDEBUG_b} = {add(EVIEDEBUG_a, EVIEDEBUG_b)}")
    print(f"{EVIEDEBUG_a} - {EVIEDEBUG_b} = {subtract(EVIEDEBUG_a, EVIEDEBUG_b)}")
    print(f"{EVIEDEBUG_a} * {EVIEDEBUG_b} = {multiply(EVIEDEBUG_a, EVIEDEBUG_b)}")
    print(f"{EVIEDEBUG_a} / {EVIEDEBUG_b} = {divide(EVIEDEBUG_a, EVIEDEBUG_b)}")
    try:
        divide(EVIEDEBUG_a, 0)
    except ValueError as EVIEDEBUG_err:
        print(f"Error: {EVIEDEBUG_err}")


if __name__ == "__main__":
    main()
