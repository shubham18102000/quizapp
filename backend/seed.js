import { connectDB } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleQuestions = [
  // C++ Questions
  {
    subject: 'C++',
    topic: 'Pointers',
    question: 'What is the size of a pointer in C++?',
    options: ['Depends on the compiler', '4 bytes always', '8 bytes always', 'Depends on the architecture'],
    answer: 'Depends on the architecture'
  },
  {
    subject: 'C++',
    topic: 'Arrays',
    question: 'How do you declare a 2D array in C++?',
    options: ['int arr[3,3]', 'int arr[3][3]', 'int arr(3,3)', 'int arr{3}{3}'],
    answer: 'int arr[3][3]'
  },
  {
    subject: 'C++',
    topic: 'Classes',
    question: 'What is the default access specifier in a C++ class?',
    options: ['public', 'private', 'protected', 'internal'],
    answer: 'private'
  },
  {
    subject: 'C++',
    topic: 'Inheritance',
    question: 'Which keyword is used for inheritance in C++?',
    options: ['extend', 'inherits', 'public/private/protected', 'implements'],
    answer: 'public/private/protected'
  },
  {
    subject: 'C++',
    topic: 'Virtual Functions',
    question: 'What is a pure virtual function?',
    options: ['A function with no body', 'A virtual function declared with = 0', 'A function that cannot be called', 'A static function'],
    answer: 'A virtual function declared with = 0'
  },
  {
    subject: 'C++',
    topic: 'Memory Management',
    question: 'What is the difference between new and malloc in C++?',
    options: ['No difference', 'new calls constructors, malloc does not', 'malloc is faster', 'new returns a void pointer'],
    answer: 'new calls constructors, malloc does not'
  },
  {
    subject: 'C++',
    topic: 'Templates',
    question: 'What is template specialization?',
    options: ['Defining a template for a specific type', 'Creating multiple templates', 'Using templates in classes only', 'None of the above'],
    answer: 'Defining a template for a specific type'
  },
  {
    subject: 'C++',
    topic: 'STL',
    question: 'Which container in STL provides constant time access to elements?',
    options: ['vector', 'list', 'Both vector and deque', 'map'],
    answer: 'Both vector and deque'
  },
  {
    subject: 'C++',
    topic: 'Exception Handling',
    question: 'What is the syntax for exception handling in C++?',
    options: ['try-catch', 'try-catch-finally', 'try-except', 'handle-catch'],
    answer: 'try-catch'
  },
  {
    subject: 'C++',
    topic: 'Operators',
    question: 'Can you overload the assignment operator in C++?',
    options: ['Yes', 'No', 'Only in derived classes', 'Only for built-in types'],
    answer: 'Yes'
  },

  // Java Questions
  {
    subject: 'Java',
    topic: 'OOP',
    question: 'What is the difference between final, finally, and finalize?',
    options: ['They are the same', 'final is for variables, finally for try block, finalize is a method', 'final is for classes only', 'They are keywords for loops'],
    answer: 'final is for variables, finally for try block, finalize is a method'
  },
  {
    subject: 'Java',
    topic: 'Inheritance',
    question: 'Can you inherit from a final class in Java?',
    options: ['Yes', 'No', 'Yes, but with restrictions', 'Only if it is abstract'],
    answer: 'No'
  },
  {
    subject: 'Java',
    topic: 'Collections',
    question: 'Which collection in Java does not allow duplicate elements?',
    options: ['List', 'Set', 'Queue', 'Stack'],
    answer: 'Set'
  },
  {
    subject: 'Java',
    topic: 'Interfaces',
    question: 'Can a class implement multiple interfaces in Java?',
    options: ['Yes', 'No', 'Only two', 'Only if they are unrelated'],
    answer: 'Yes'
  },
  {
    subject: 'Java',
    topic: 'Exceptions',
    question: 'What is the difference between checked and unchecked exceptions?',
    options: ['They are the same', 'Checked exceptions must be caught or declared, unchecked do not', 'Unchecked are worse', 'Checked are for methods only'],
    answer: 'Checked exceptions must be caught or declared, unchecked do not'
  },
  {
    subject: 'Java',
    topic: 'Strings',
    question: 'Are Strings mutable or immutable in Java?',
    options: ['Mutable', 'Immutable', 'Depends on how they are created', 'Both'],
    answer: 'Immutable'
  },
  {
    subject: 'Java',
    topic: 'Threads',
    question: 'How do you create a thread in Java?',
    options: ['Extend Thread class', 'Implement Runnable interface', 'Both are valid', 'Neither, threads are automatic'],
    answer: 'Both are valid'
  },
  {
    subject: 'Java',
    topic: 'Generics',
    question: 'What is the purpose of generics in Java?',
    options: ['To create general-purpose classes', 'To provide type safety and eliminate casting', 'To improve performance', 'To reduce code size'],
    answer: 'To provide type safety and eliminate casting'
  },
  {
    subject: 'Java',
    topic: 'JVM',
    question: 'What does JVM stand for?',
    options: ['Java Virtual Machine', 'Java Volatile Manager', 'Java Version Machine', 'Java Verification Model'],
    answer: 'Java Virtual Machine'
  },
  {
    subject: 'Java',
    topic: 'Annotations',
    question: 'What is the purpose of @Override annotation?',
    options: ['To override a method', 'To tell the compiler to check if the method correctly overrides a superclass method', 'To make a method final', 'To deprecate a method'],
    answer: 'To tell the compiler to check if the method correctly overrides a superclass method'
  }
];

const sampleMaterials = [
  // C++ Materials
  {
    subject: 'C++',
    topic: 'Pointers',
    title: 'Understanding Pointers in C++',
    content: `Pointers are one of the most important concepts in C++. A pointer is a variable that stores the memory address of another variable.

Key Concepts:
1. Declaration: int *ptr; declares a pointer to an integer
2. Address-of operator (&): Gets the address of a variable
3. Dereference operator (*): Accesses the value at the address
4. Arrow operator (->): Accesses members of a structure/class through a pointer

Example:
int x = 10;
int *ptr = &x;  // ptr now holds the address of x
cout << *ptr;   // Prints 10
cout << ptr;    // Prints the memory address

Common Uses:
- Dynamic memory allocation
- Passing variables by reference to functions
- Creating data structures like linked lists and trees
- Polymorphism in OOP`
  },
  {
    subject: 'C++',
    topic: 'Classes',
    title: 'Object-Oriented Programming in C++',
    content: `Classes are the foundation of Object-Oriented Programming in C++.

Basics:
- A class is a blueprint for creating objects
- Members can be data (attributes) or functions (methods)
- Access specifiers: public, private, protected

Example Class:
class Car {
private:
    string color;
    int speed;
public:
    Car(string c) { color = c; }
    void accelerate() { speed += 10; }
    int getSpeed() { return speed; }
};

Constructors and Destructors:
- Constructor: Called when object is created
- Destructor: Called when object is destroyed
- Use for initialization and cleanup

Encapsulation:
- Hide implementation details
- Provide public interface
- Improves maintainability and security`
  },
  {
    subject: 'C++',
    topic: 'STL',
    title: 'Standard Template Library (STL)',
    content: `The STL is a powerful library providing data structures and algorithms.

Main Components:
1. Containers: Store collections of elements
   - Vectors (dynamic arrays)
   - Lists (linked lists)
   - Maps (key-value pairs)
   - Sets (unique elements)

2. Iterators: Navigate through containers
   - Begin and end iterators
   - Types: input, output, forward, bidirectional, random-access

3. Algorithms: Perform operations on containers
   - sort(), find(), transform()
   - accumulate(), count(), unique()

Example:
#include <vector>
#include <algorithm>
using namespace std;

vector<int> nums = {3, 1, 4, 1, 5};
sort(nums.begin(), nums.end());
for(int n : nums) cout << n << " ";`
  },

  // Java Materials
  {
    subject: 'Java',
    topic: 'Collections',
    title: 'Java Collections Framework',
    content: `The Collections Framework provides interfaces and classes for working with groups of objects.

Main Interfaces:
1. Collection: Base interface
   - add(), remove(), contains()

2. List: Ordered collection
   - ArrayList (dynamic array)
   - LinkedList (linked list)
   - Allows duplicates

3. Set: Unordered, unique elements
   - HashSet (hash-based)
   - TreeSet (sorted)
   - No duplicates

4. Map: Key-value pairs
   - HashMap (hash-based)
   - TreeMap (sorted)
   - Keys are unique

Example:
List<String> list = new ArrayList<>();
list.add("Java");
list.add("Python");

Set<Integer> set = new HashSet<>();
set.add(1);
set.add(2);

Map<String, Integer> map = new HashMap<>();
map.put("age", 25);
int age = map.get("age");`
  },
  {
    subject: 'Java',
    topic: 'Threads',
    title: 'Multithreading in Java',
    content: `Multithreading allows a program to run multiple operations concurrently.

Creating Threads:
1. Extend Thread class:
class MyThread extends Thread {
    public void run() { ... }
}
MyThread t = new MyThread();
t.start();

2. Implement Runnable interface:
class MyRunnable implements Runnable {
    public void run() { ... }
}
Thread t = new Thread(new MyRunnable());
t.start();

Thread States:
- NEW: Thread created but not started
- RUNNABLE: Ready to run
- RUNNING: Currently executing
- BLOCKED: Waiting for resources
- DEAD: Execution finished

Synchronization:
- Prevents race conditions
- Use synchronized keyword
- Or lock mechanisms in java.util.concurrent`
  }
];

async function seedDatabase() {
  try {
    const db = await connectDB();

    // Clear existing data
    await db.collection('questions').deleteMany({});
    await db.collection('studyMaterials').deleteMany({});

    // Insert sample questions
    const questionsResult = await db.collection('questions').insertMany(
      sampleQuestions.map(q => ({
        ...q,
        createdAt: new Date()
      }))
    );
    console.log(`Inserted ${questionsResult.insertedCount} questions`);

    // Insert sample materials
    const materialsResult = await db.collection('studyMaterials').insertMany(
      sampleMaterials.map(m => ({
        ...m,
        createdAt: new Date()
      }))
    );
    console.log(`Inserted ${materialsResult.insertedCount} study materials`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
