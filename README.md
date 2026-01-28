# StruckData Visualizer

StruckData is a high-performance algorithm and data structure visualization suite designed for computer science education and technical analysis. It provides real-time, granular graphical representations of fundamental computer science concepts, specifically focusing on sorting algorithms and dynamic data structures.

## Core Functionality

### 1. Sorting Algorithm Visualizer
The sorting visualizer translates abstract code logic into a physical state machine. It supports a variety of standard algorithms including:
- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort
- Shell Sort

Each algorithm execution is represented as a series of discrete steps. Users can monitor swap counts, active indices, and internal loop variables (such as pivot values or current iterators) in real-time.

### 2. Data Structure Laboratory
The laboratory environment provides an interactive canvas for manipulating common data structures. It supports both linear and hierarchical structures:
- Stacks and Queues (LIFO/FIFO logic)
- Singly, Doubly, and Circular Linked Lists
- Binary Search Trees (BST)
- Self-Balancing AVL Trees
- Multi-way B-Trees

## Operational Controls

- **Input Control**: Users can inject custom datasets via comma-separated values or generate randomized arrays of varying densities (Tiny/Dense).
- **Execution Speed**: A non-linear speed slider allows for fine-tuned observation, ranging from slow-motion logical analysis to high-speed completion.
- **Visual Cues**: 
    - Yellow: Active comparison between elements.
    - Red: Elements being swapped or moved in memory.
    - Green: Elements confirmed to be in their final sorted position.
    - Purple: Active pivot or partition element.

## Technical Specifications

- **Asymptotic Analysis**: Every algorithm includes a technical breakdown of its time (Best, Average, Worst) and space complexity.
- **State Persistence**: The application uses a generator-based approach to pre-calculate sorting steps, allowing for seamless pause/resume and state scrubbing.
- **Responsive Architecture**: Built using a modern React 19 stack with a mobile-optimized sidebar and fluid canvas rendering for data structures.

## Usage Instructions

1. Select a concept from the sidebar registry.
2. For sorting algorithms, define your input data using the "Val" input or generate a random array.
3. Use the "Initiate" button to start the visualization.
4. Adjust the "Overclock" slider to vary the animation speed.
5. In the Data Structure Lab, use the "Injection" panel to push, enqueue, or insert nodes into the active structure.
