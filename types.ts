
export enum AlgorithmType {
  BUBBLE = 'Bubble Sort',
  SELECTION = 'Selection Sort',
  INSERTION = 'Insertion Sort',
  MERGE = 'Merge Sort',
  QUICK = 'Quick Sort',
  HEAP = 'Heap Sort',
  SHELL = 'Shell Sort'
}

export enum LabView {
  SORTING = 'Sorting Visualizer',
  STACK = 'Stack Operations',
  QUEUE = 'Queue Operations',
  BST = 'Binary Search Tree',
  AVL = 'AVL Tree (Self-Balancing)',
  BTREE = 'B-Tree',
  S_LINKED_LIST = 'Singly Linked List',
  D_LINKED_LIST = 'Doubly Linked List',
  C_LINKED_LIST = 'Circular Linked List'
}

export interface SortStep {
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  pivotIndex?: number;
  variables?: Record<string, any>;
  swapCount: number;
}

export interface AlgorithmMetadata {
  name: AlgorithmType;
  bestCase: string;
  averageCase: string;
  worstCase: string;
  spaceComplexity: string;
  description: string;
  code: string;
  pros: string[];
  cons: string[];
}

export interface Node {
  id: number;
  value: number;
  left?: Node;
  right?: Node;
  height?: number;
  parent?: Node;
  x?: number;
  y?: number;
}
