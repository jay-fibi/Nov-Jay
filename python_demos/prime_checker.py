"""Demo 3: Prime number checker and prime list generator."""


def is_prime(n):
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True


def primes_up_to(limit):
    return [n for n in range(2, limit + 1) if is_prime(n)]


def main():
    for number in (1, 2, 17, 21, 97):
        print(f"{number} is prime? {is_prime(number)}")
    print("Primes up to 50:", primes_up_to(50))


if __name__ == "__main__":
    main()
