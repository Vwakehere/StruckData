
import { AlgorithmType, AlgorithmMetadata } from './types';

export const ALGORITHM_DATA: Record<AlgorithmType, AlgorithmMetadata> = {
  [AlgorithmType.BUBBLE]: {
    name: AlgorithmType.BUBBLE,
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    code: `void bubbleSort(int arr[], int n) {
    int i, j, temp;
    bool swapped;
    for (i = 0; i < n - 1; i++) {
        swapped = false;
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (swapped == false)
            break;
    }
}`,
    pros: ['Simple to implement', 'Stable', 'In-place'],
    cons: ['Very inefficient for large datasets']
  },
  [AlgorithmType.SELECTION]: {
    name: AlgorithmType.SELECTION,
    bestCase: 'O(n²)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Divides the input list into two parts: a sorted sublist of items which is built up from left to right and a sublist of the remaining unsorted items.',
    code: `void selectionSort(int arr[], int n) {
    int i, j, min_idx, temp;
    for (i = 0; i < n - 1; i++) {
        min_idx = i;
        for (j = i + 1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
    pros: ['Simple', 'In-place', 'Useful when memory writing is costly'],
    cons: ['O(n²) regardless of data distribution', 'Unstable']
  },
  [AlgorithmType.INSERTION]: {
    name: AlgorithmType.INSERTION,
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.',
    code: `void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    pros: ['Efficient for small data sets', 'Adaptive', 'Stable', 'Online'],
    cons: ['Inefficient for large datasets']
  },
  [AlgorithmType.MERGE]: {
    name: AlgorithmType.MERGE,
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'An efficient, stable, comparison-based, divide and conquer sorting algorithm.',
    code: `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
    pros: ['Consistent O(n log n)', 'Stable', 'Parallelizable'],
    cons: ['Requires extra space O(n)', 'Not in-place']
  },
  [AlgorithmType.QUICK]: {
    name: AlgorithmType.QUICK,
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(log n)',
    description: 'A divide-and-conquer algorithm that picks an element as pivot and partitions the given array around the picked pivot.',
    code: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    pros: ['Very fast in practice', 'In-place', 'Good cache locality'],
    cons: ['O(n²) worst case', 'Unstable', 'Fragile pivot selection']
  },
  [AlgorithmType.HEAP]: {
    name: AlgorithmType.HEAP,
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    spaceComplexity: 'O(1)',
    description: 'A comparison-based sorting algorithm that uses a binary heap data structure.',
    code: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(&arr[0], &arr[i]);
        heapify(arr, i, 0);
    }
}`,
    pros: ['Consistent O(n log n)', 'In-place', 'No worst-case O(n²)'],
    cons: ['Unstable', 'Slower than QuickSort in practice']
  },
  [AlgorithmType.SHELL]: {
    name: AlgorithmType.SHELL,
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n) or O(n¹.²⁵)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'An optimization of insertion sort that allows the exchange of items that are far apart.',
    code: `void shellSort(int arr[], int n) {
    for (int gap = n/2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
}`,
    pros: ['Efficient for medium-sized arrays', 'In-place'],
    cons: ['Complexity depends on gap sequence', 'Unstable']
  }
};
