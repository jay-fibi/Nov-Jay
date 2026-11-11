import java.util.Scanner;

/**
 * Simple command-line calculator supporting +, -, *, / and %.
 */
public class Calculator {

    public static double calculate(double a, double b, char operator) {
        switch (operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                if (b == 0) {
                    throw new ArithmeticException("Division by zero is not allowed");
                }
                return a / b;
            case '%':
                if (b == 0) {
                    throw new ArithmeticException("Modulo by zero is not allowed");
                }
                return a % b;
            default:
                throw new IllegalArgumentException("Unsupported operator: " + operator);
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("=== Simple Java Calculator ===");

        while (true) {
            try {
                System.out.print("Enter first number: ");
                if (!scanner.hasNext()) {
                    break;
                }
                double a = Double.parseDouble(scanner.next());

                System.out.print("Enter operator (+, -, *, /, %): ");
                String opInput = scanner.next();
                if (opInput.length() != 1) {
                    throw new IllegalArgumentException("Operator must be a single character");
                }
                char operator = opInput.charAt(0);

                System.out.print("Enter second number: ");
                double b = Double.parseDouble(scanner.next());

                double result = calculate(a, b, operator);
                System.out.println("Result: " + a + " " + operator + " " + b + " = " + result);
            } catch (NumberFormatException e) {
                System.out.println("Error: Invalid number entered.");
            } catch (ArithmeticException | IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
            }

            System.out.print("Do you want to continue? (y/n): ");
            if (!scanner.hasNext() || !scanner.next().equalsIgnoreCase("y")) {
                break;
            }
        }

        System.out.println("Goodbye!");
        scanner.close();
    }
}
