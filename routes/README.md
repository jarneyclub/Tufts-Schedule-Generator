# Backend Features Outline
## Notes:
Time is represented in integer

## Feature:  Generating a weekly schedule from chosen courses with possible user customization. 
User customization:

1. All sections in a week must be between a time interval [A,B], A/B = [0,2400]
2. OR etc. (modify data as needed)

Context:
- Given: let C be chosen courses
- For each C_i, let S_i be the list of required section types (Lecture, Laboratory, etc.)
> Assumptions :
> 1) All classes in a Section have identical start times and end times and differ only by day of week.
> 2) All section types are required (need to enroll in one section of each Course's section type).
> 3) In implementation: times that are TBA are put in Sunday/7 for day, 00:00/2400 for both start and end time.

## Algorithm

### Phase 1 Picking Sections
- Represent all sections of an S_i in C_i in an *AVL tree*
- ( Implementation of sections node -> ./objects/Tree1Node.js)
- Let this tree be **Tree_1**.
- Tree_1 represents all sections for a section type. 
- From every instance of Tree_1 (from every section type), only one section will be retrieved. (Note: section != class ). Call this section SEC.
- SEC is inserted into Tree_2's that they belong in (given user preferences) -> Moving to phase 2 

### Phase 2 Generating weekly schedule
- For each day of the week, represent classes on each day in an *augmented AVL tree*
- ( Implementation of class node -> ./objects/Tree2Node.js)
- Let this tree be **Tree_2**.

### Phase 3 Formatting weekly schedule
- Traverse each **Tree_2** and get classes on each day.

## Data structures

#### Tree_1 (AVL Tree)
- Nodes have keys that are existing *starting times* of each section. 
- Each of Tree_1's nodes contain a list of Section objects that start at the Node's time
> Invariants:
> 1. BST Invariant
> 2. AVL: For a given node n, the heights of n's left and right subtrees does not differ by more than 1

#### Tree_2 (Augmented AVL Tree)
- Represent a week of Classes, each node represents a class
- Nodes have keys that are existing *starting times* of each section mapped to a WEEK. 
- Nodes are augmented with *spans*
- Node n's *span* = max{n.endTime, latest endTime in right subtree}
> Invariants
> 1. BST Invariant + AVL tree Invariant
> 2. No nodes overlap times ( through augmentation )
> 3. All nodes are within user preferences ( e.g. time bound )

