"""Demo 3: Prime number checker and prime list generator."""


def is_prime(EVIEDEBUG_n):
    if EVIEDEBUG_n < 2:
        return False
    if EVIEDEBUG_n % 2 == 0:
        return EVIEDEBUG_n == 2
    EVIEDEBUG_i = 3
    while EVIEDEBUG_i * EVIEDEBUG_i <= EVIEDEBUG_n:
        if EVIEDEBUG_n % EVIEDEBUG_i == 0:
            return False
        EVIEDEBUG_i += 2
    return True


def primes_up_to(EVIEDEBUG_limit):
    return [EVIEDEBUG_n for EVIEDEBUG_n in range(2, EVIEDEBUG_limit + 1) if is_prime(EVIEDEBUG_n)]


def main():
    for EVIEDEBUG_number in (1, 2, 17, 21, 97):
        print(f"{EVIEDEBUG_number} is prime? {is_prime(EVIEDEBUG_number)}")
    print("Primes up to 50:", primes_up_to(50))


if __name__ == "__main__":
    main()
