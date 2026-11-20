import java.util.Arrays;

public class InsertionSort {

    /** Sorts the array in ascending order, in place. */
    public static void sort(int[] values) {
        for (int i = 1; i < values.length; i++) {
            int value = values[i];
            int j = i;

            // Shift larger values right to make room in the sorted prefix.
            while (j > 0 && values[j - 1] > value) {
                values[j] = values[j - 1];
                j--;
            }
            values[j] = value;
        }
    }

    public static void main(String[] args) {
        int[] values = {5, 2, 4, -1, 2};
        System.out.println("Before: " + Arrays.toString(values));
        sort(values);
        System.out.println("After:  " + Arrays.toString(values));
    }
}
