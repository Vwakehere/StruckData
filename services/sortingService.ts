
import { SortStep } from '../types';

export function* bubbleSort(arr: number[]): Generator<SortStep> {
  const n = arr.length;
  const current = [...arr];
  const sortedIndices: number[] = [];
  let swapCount = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { 
        array: [...current], 
        comparingIndices: [j, j + 1], 
        swappingIndices: [], 
        sortedIndices: [...sortedIndices],
        variables: { i, j },
        swapCount
      };
      if (current[j] > current[j + 1]) {
        [current[j], current[j + 1]] = [current[j + 1], current[j]];
        swapCount++;
        yield { 
          array: [...current], 
          comparingIndices: [], 
          swappingIndices: [j, j + 1], 
          sortedIndices: [...sortedIndices],
          variables: { i, j },
          swapCount
        };
      }
    }
    sortedIndices.push(n - i - 1);
  }
  sortedIndices.push(0);
  yield { array: [...current], comparingIndices: [], swappingIndices: [], sortedIndices: [...sortedIndices], swapCount };
}

export function* selectionSort(arr: number[]): Generator<SortStep> {
  const n = arr.length;
  const current = [...arr];
  const sortedIndices: number[] = [];
  let swapCount = 0;

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { 
        array: [...current], 
        comparingIndices: [minIdx, j], 
        swappingIndices: [], 
        sortedIndices: [...sortedIndices],
        variables: { i, j, minIdx },
        swapCount
      };
      if (current[j] < current[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [current[i], current[minIdx]] = [current[minIdx], current[i]];
      swapCount++;
      yield { 
        array: [...current], 
        comparingIndices: [], 
        swappingIndices: [i, minIdx], 
        sortedIndices: [...sortedIndices],
        variables: { i, minIdx },
        swapCount
      };
    }
    sortedIndices.push(i);
  }
  yield { array: [...current], comparingIndices: [], swappingIndices: [], sortedIndices: [...sortedIndices], swapCount };
}

export function* insertionSort(arr: number[]): Generator<SortStep> {
  const n = arr.length;
  const current = [...arr];
  const sortedIndices: number[] = [0];
  let swapCount = 0;

  for (let i = 1; i < n; i++) {
    let key = current[i];
    let j = i - 1;
    yield { 
      array: [...current], 
      comparingIndices: [i, j], 
      swappingIndices: [], 
      sortedIndices: [...sortedIndices],
      variables: { i, j, key },
      swapCount
    };
    while (j >= 0 && current[j] > key) {
      current[j + 1] = current[j];
      swapCount++;
      yield { 
        array: [...current], 
        comparingIndices: [j], 
        swappingIndices: [j + 1], 
        sortedIndices: [...sortedIndices],
        variables: { i, j, key },
        swapCount
      };
      j--;
    }
    current[j + 1] = key;
    sortedIndices.push(i);
    yield { 
      array: [...current], 
      comparingIndices: [], 
      swappingIndices: [j + 1], 
      sortedIndices: [...sortedIndices],
      variables: { i, j: j + 1, key },
      swapCount
    };
  }
}

export function* mergeSort(arr: number[]): Generator<SortStep> {
  const current = [...arr];
  const n = current.length;
  let swapCount = 0;
  const sortedIndices: number[] = [];

  function* merge(l: number, m: number, r: number): Generator<SortStep> {
    const n1 = m - l + 1;
    const n2 = r - m;
    const L = current.slice(l, m + 1);
    const R = current.slice(m + 1, r + 1);
    
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      yield { array: [...current], comparingIndices: [l + i, m + 1 + j], swappingIndices: [], sortedIndices: [...sortedIndices], swapCount };
      if (L[i] <= R[j]) {
        current[k] = L[i];
        i++;
      } else {
        current[k] = R[j];
        j++;
      }
      swapCount++;
      yield { array: [...current], comparingIndices: [], swappingIndices: [k], sortedIndices: [...sortedIndices], swapCount };
      k++;
    }
    while (i < n1) {
      current[k] = L[i];
      i++; swapCount++;
      yield { array: [...current], comparingIndices: [], swappingIndices: [k], sortedIndices: [...sortedIndices], swapCount };
      k++;
    }
    while (j < n2) {
      current[k] = R[j];
      j++; swapCount++;
      yield { array: [...current], comparingIndices: [], swappingIndices: [k], sortedIndices: [...sortedIndices], swapCount };
      k++;
    }
  }

  function* sort(l: number, r: number): Generator<SortStep> {
    if (l < r) {
      const m = Math.floor(l + (r - l) / 2);
      yield* sort(l, m);
      yield* sort(m + 1, r);
      yield* merge(l, m, r);
      if (r - l + 1 === n) {
        for (let idx = l; idx <= r; idx++) sortedIndices.push(idx);
      }
    }
  }

  yield* sort(0, n - 1);
  yield { array: [...current], comparingIndices: [], swappingIndices: [], sortedIndices: Array.from({length: n}, (_, i) => i), swapCount };
}

export function* quickSort(arr: number[], left = 0, right = arr.length - 1): Generator<SortStep> {
  const current = [...arr];
  let swapCount = 0;
  
  function* partition(l: number, r: number): Generator<SortStep, number> {
    const pivot = current[r];
    let i = l - 1;
    for (let j = l; j < r; j++) {
      yield { 
        array: [...current], 
        comparingIndices: [j, r], 
        swappingIndices: [], 
        sortedIndices: [], 
        pivotIndex: r,
        variables: { l, r, i, j, pivotValue: pivot },
        swapCount
      };
      if (current[j] < pivot) {
        i++;
        [current[i], current[j]] = [current[j], current[i]];
        swapCount++;
        yield { 
          array: [...current], 
          comparingIndices: [], 
          swappingIndices: [i, j], 
          sortedIndices: [], 
          pivotIndex: r,
          variables: { l, r, i, j, pivotValue: pivot },
          swapCount
        };
      }
    }
    [current[i + 1], current[r]] = [current[r], current[i + 1]];
    swapCount++;
    yield { 
      array: [...current], 
      comparingIndices: [], 
      swappingIndices: [i + 1, r], 
      sortedIndices: [], 
      pivotIndex: i + 1,
      variables: { l, r, i: i + 1, pivotValue: pivot },
      swapCount
    };
    return i + 1;
  }

  const stack: [number, number][] = [[left, right]];
  while (stack.length > 0) {
    const [l, r] = stack.pop()!;
    if (l < r) {
      const p: number = yield* (partition(l, r) as any);
      stack.push([l, p - 1]);
      stack.push([p + 1, r]);
    }
  }
  yield { array: [...current], comparingIndices: [], swappingIndices: [], sortedIndices: Array.from({length: arr.length}, (_, k) => k), swapCount };
}

export function* heapSort(arr: number[]): Generator<SortStep> {
  const current = [...arr];
  const n = current.length;
  const sortedIndices: number[] = [];
  let swapCount = 0;

  function* heapify(size: number, i: number): Generator<SortStep> {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < size) {
      yield { 
        array: [...current], 
        comparingIndices: [l, largest], 
        swappingIndices: [], 
        sortedIndices: [...sortedIndices],
        variables: { i, size, l, r },
        swapCount
      };
      if (current[l] > current[largest]) largest = l;
    }

    if (r < size) {
      yield { 
        array: [...current], 
        comparingIndices: [r, largest], 
        swappingIndices: [], 
        sortedIndices: [...sortedIndices],
        variables: { i, size, l, r, largest },
        swapCount
      };
      if (current[r] > current[largest]) largest = r;
    }

    if (largest !== i) {
      [current[i], current[largest]] = [current[largest], current[i]];
      swapCount++;
      yield { 
        array: [...current], 
        comparingIndices: [], 
        swappingIndices: [i, largest], 
        sortedIndices: [...sortedIndices],
        variables: { i, largest },
        swapCount
      };
      yield* heapify(size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [current[0], current[i]] = [current[i], current[0]];
    swapCount++;
    sortedIndices.push(i);
    yield { 
      array: [...current], 
      comparingIndices: [], 
      swappingIndices: [0, i], 
      sortedIndices: [...sortedIndices],
      variables: { i },
      swapCount
    };
    yield* heapify(i, 0);
  }
  sortedIndices.push(0);
  yield { array: [...current], comparingIndices: [], swappingIndices: [], sortedIndices: [...sortedIndices], swapCount };
}

export function* shellSort(arr: number[]): Generator<SortStep> {
  const n = arr.length;
  const current = [...arr];
  const sortedIndices: number[] = [];
  let swapCount = 0;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = current[i];
      let j = i;
      
      while (j >= gap && current[j - gap] > temp) {
        yield { 
          array: [...current], 
          comparingIndices: [j - gap, j], 
          swappingIndices: [], 
          sortedIndices: [...sortedIndices],
          variables: { gap, i, j },
          swapCount
        };
        current[j] = current[j - gap];
        swapCount++;
        yield { 
          array: [...current], 
          comparingIndices: [], 
          swappingIndices: [j], 
          sortedIndices: [...sortedIndices],
          variables: { gap, i, j },
          swapCount
        };
        j -= gap;
      }
      current[j] = temp;
      yield { 
        array: [...current], 
        comparingIndices: [], 
        swappingIndices: [j], 
        sortedIndices: [...sortedIndices],
        variables: { gap, i, j },
        swapCount
      };
    }
  }
  
  yield { array: [...current], comparingIndices: [], swappingIndices: [], sortedIndices: Array.from({length: n}, (_, i) => i), swapCount };
}

