/**
 * Auto-generated question bank. Populated by scripts/scan.mjs (local Ollama).
 * Each entry carries source/origin/addedAt and reviewed. Items with
 * reviewed:false are QUARANTINED — not served until a human verifies them.
 * The entries below were human-reviewed and promoted (reviewed:true).
 */
window.QUIZ_DATA_AUTO = [
  {
    "id": "auto-1",
    "topic": "swift",
    "prompt": "Which of the following statements accurately describe the behavior of Swift's `defer` statement?",
    "options": [
      {
        "text": "`defer` blocks are executed immediately after the current scope is entered.",
        "correct": false
      },
      {
        "text": "`defer` blocks are executed when the current scope is exited, regardless of how the exit occurs (e.g., returning, throwing an error).",
        "correct": true
      },
      {
        "text": "Multiple `defer` blocks in the same scope execute in reverse (LIFO) order.",
        "correct": true
      },
      {
        "text": "`defer` blocks are executed before any `return` statements within the scope.",
        "correct": false
      }
    ],
    "explanation": "`defer` statements guarantee cleanup code will run as a scope is exited, even if errors occur. They are executed before the scope fully unwinds, but *after* any return statements.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/9magnets/iOS-Developer-and-Designer-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": true
  },
  {
    "id": "auto-2",
    "topic": "concurrency",
    "prompt": "Which of the following statements are true regarding the use of `Task.detached` in Swift Concurrency?",
    "options": [
      {
        "text": "`Task.detached` creates a new, completely independent task that runs concurrently without any specific context.",
        "correct": true
      },
      {
        "text": "`Task.detached` guarantees execution on the main thread.",
        "correct": false
      },
      {
        "text": "Using `Task.detached` can help prevent blocking the main thread when performing long-running operations.",
        "correct": true
      },
      {
        "text": "`Task.detached` automatically handles cancellation when the parent task completes.",
        "correct": false
      }
    ],
    "explanation": "`Task.detached` launches a new task that's independent of the current task's context, allowing for concurrent execution. This is useful for offloading work to avoid blocking the main thread, but it does *not* guarantee main thread execution or automatic cancellation.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/9magnets/iOS-Developer-and-Designer-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": true
  },
  {
    "id": "auto-3",
    "topic": "concurrency",
    "prompt": "Which of the following statements are true regarding the use of `async/await` in Swift for concurrent operations?",
    "options": [
      {
        "text": "`async/await` simplifies asynchronous programming by allowing you to write asynchronous code in a synchronous style.",
        "correct": true
      },
      {
        "text": "Using `async/await` automatically prevents all data races without needing additional synchronization mechanisms.",
        "correct": false
      },
      {
        "text": "`await` can only be used inside a function marked with the `async` keyword.",
        "correct": true
      },
      {
        "text": "`async/await` eliminates the need for Grand Central Dispatch (GCD) entirely.",
        "correct": false
      }
    ],
    "explanation": "`async/await` provides a more readable syntax for asynchronous code, but doesn't inherently solve all concurrency issues like data races. It requires the `async` keyword on functions and doesn't replace GCD; they can be used together for different purposes.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/9magnets/iOS-Developer-and-Designer-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": true
  },
  {
    "id": "auto-4",
    "topic": "concurrency",
    "prompt": "Which of the following statements are true regarding Swift Concurrency and data sharing?",
    "options": [
      {
        "text": "Using `@MainActor` ensures all code within a function executes on the main thread.",
        "correct": true
      },
      {
        "text": "`Sendable` conformance guarantees thread safety for all types, eliminating the need for explicit synchronization.",
        "correct": false
      },
      {
        "text": "Actors inherently prevent data races by serializing access to their stored properties.",
        "correct": true
      },
      {
        "text": "`async let` allows for concurrent execution of multiple tasks without waiting for their completion, improving performance in all scenarios.",
        "correct": false
      }
    ],
    "explanation": "`@MainActor` restricts execution to the main thread. Actors provide thread safety by serializing access, but `Sendable` only indicates a type *can* be safely shared, not that it *is* safe without further mechanisms. `async let` initiates concurrent tasks but doesn't necessarily improve performance if dependencies exist.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/9magnets/iOS-Developer-and-Designer-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": true
  },
  {
    "id": "auto-5",
    "topic": "swiftui",
    "prompt": "Which of the following statements are true regarding SwiftUI's approach to view identity and rendering?",
    "options": [
      {
        "text": "SwiftUI views are value types, meaning each view update creates a new instance, potentially triggering re-renders.",
        "correct": true
      },
      {
        "text": "SwiftUI relies heavily on mutating state directly within views to efficiently update the UI.",
        "correct": false
      },
      {
        "text": "Using the `@State` property wrapper signals to SwiftUI that changes to the property should trigger a view re-render.",
        "correct": true
      },
      {
        "text": "SwiftUI always performs deep structural comparisons of views to determine if a re-render is necessary, regardless of `@State` or `@ObservedObject`.",
        "correct": false
      }
    ],
    "explanation": "SwiftUI leverages value types and the `@State` wrapper to manage view identity and efficiently update the UI. While SwiftUI aims for efficiency, it doesn't *always* avoid re-renders; the `@State` wrapper is crucial for triggering updates when data changes. Mutating state directly is generally discouraged in favor of SwiftUI's reactive data flow.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/9magnets/iOS-Developer-and-Designer-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": true
  },
  {
    "id": "auto-6",
    "topic": "memory",
    "prompt": "Which of the following statements accurately describe why you might use `weak self` when capturing `self` within a closure?",
    "options": [
      {
        "text": "It prevents a retain cycle, where the closure and the object it's attached to hold strong references to each other.",
        "correct": true
      },
      {
        "text": "It ensures the closure always has a valid reference to the object, even if the object is deallocated.",
        "correct": false
      },
      {
        "text": "It allows the closure to modify properties of the captured object without needing to unwrap an optional.",
        "correct": false
      },
      {
        "text": "Inside the closure, `self` becomes an optional that must be unwrapped (e.g. with `guard let self`).",
        "correct": true
      }
    ],
    "explanation": "Using `weak self` breaks strong reference cycles that can occur when a closure captures `self`. If the object is deallocated, `self` within the closure becomes `nil`, preventing crashes and allowing ARC to function correctly. It doesn't *guarantee* a valid reference, but avoids memory leaks.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/onthecodepath/iOS-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": true
  },
  {
    "id": "auto-7",
    "topic": "memory",
    "prompt": "Which of the following statements accurately describe how `weak` and `unowned` references prevent retain cycles in Swift?",
    "options": [
      {
        "text": "`weak` references are automatically set to `nil` when the referenced object is deallocated, preventing a strong reference cycle.",
        "correct": true
      },
      {
        "text": "`unowned` references are suitable when the referenced object is guaranteed to outlive the referencing object, avoiding the need for optional handling.",
        "correct": true
      },
      {
        "text": "Both `weak` and `unowned` references contribute to the retain count of the referenced object.",
        "correct": false
      },
      {
        "text": "`weak` references must be optional to handle the possibility of the referenced object being deallocated, while `unowned` references are always implicitly unwrapped.",
        "correct": false
      }
    ],
    "explanation": "`weak` and `unowned` references break strong reference cycles by not increasing the retain count. `weak` uses optionals to handle potential nil values after deallocation, while `unowned` assumes the referenced object will always exist as long as the referencing object does.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/onthecodepath/iOS-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": true
  },
  {
    "id": "auto-8",
    "topic": "memory",
    "prompt": "Which of the following scenarios can lead to a retain cycle in Swift, even when using Automatic Reference Counting (ARC)?",
    "options": [
      {
        "text": "Two instances of a class each have a strong reference to the other.",
        "correct": true
      },
      {
        "text": "A class instance is only referenced by a weak reference.",
        "correct": false
      },
      {
        "text": "A closure captures `self` strongly within a property, and the closure is retained by the class itself.",
        "correct": true
      },
      {
        "text": "A struct is assigned to a constant variable.",
        "correct": false
      }
    ],
    "explanation": "Retain cycles occur when objects hold strong references to each other, preventing their memory from being deallocated. Closures capturing `self` strongly, and mutual strong references between class instances are common causes. Structs, being value types, do not contribute to retain cycles.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/onthecodepath/iOS-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": true
  },
  {
    "id": "auto-9",
    "topic": "memory",
    "prompt": "Which of the following statements accurately describe how Automatic Reference Counting (ARC) manages memory in Swift?",
    "options": [
      {
        "text": "ARC tracks the number of strong references to each class instance.",
        "correct": true
      },
      {
        "text": "ARC automatically deallocates objects when their reference count reaches zero.",
        "correct": true
      },
      {
        "text": "ARC prevents retain cycles by automatically weakening references after a certain period.",
        "correct": false
      },
      {
        "text": "ARC requires manual memory management using `retain`, `release`, and `autorelease` keywords.",
        "correct": false
      }
    ],
    "explanation": "ARC is Swift's memory management system. It uses reference counting to determine when to deallocate memory, incrementing the count on strong references and decrementing it when references are removed. Retain cycles require manual intervention with `weak` or `unowned` references.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/onthecodepath/iOS-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": true
  },
  {
    "id": "auto-10",
    "topic": "swift",
    "prompt": "Which of the following statements are true regarding Swift's value types (structs and enums)?",
    "options": [
      {
        "text": "Value types are copied when assigned or passed as arguments, creating independent instances.",
        "correct": true
      },
      {
        "text": "Modifying a value type instance always affects all other references to that instance.",
        "correct": false
      },
      {
        "text": "Value types are typically more performant for simple data structures due to avoiding pointer indirections.",
        "correct": true
      },
      {
        "text": "Value types automatically prevent retain cycles, eliminating the need for `weak` or `unowned` references.",
        "correct": false
      }
    ],
    "explanation": "Value types are copied on assignment, ensuring independence. This copying behavior can improve performance for smaller data structures, but doesn't inherently prevent retain cycles – those can still occur when value types are stored within reference types.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/onthecodepath/iOS-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": true
  }
];
