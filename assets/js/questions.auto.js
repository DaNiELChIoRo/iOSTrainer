/**
 * Auto-generated question bank. Populated by scripts/scan.mjs (local Ollama).
 * Each entry carries source/origin/addedAt and reviewed. Items with
 * reviewed:false are QUARANTINED — they are not served in quizzes until a
 * human verifies them. Review before flipping reviewed:true.
 */
window.QUIZ_DATA_AUTO = [
  {
    "id": "auto-1",
    "topic": "coredata",
    "prompt": "What is a managed object context?",
    "options": [
      {
        "text": "A class that handles Core Data's data storage",
        "correct": true
      },
      {
        "text": "An interface for interacting with Core Data models",
        "correct": false
      },
      {
        "text": "A mechanism for handling concurrency in Core Data",
        "correct": true
      },
      {
        "text": "A protocol for fetching data from a database",
        "correct": false
      }
    ],
    "explanation": "A managed object context is the central hub of Core Data's data storage. It handles the creation, retrieval, and modification of managed objects, which are instances of classes that inherit from NSManagedObject.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/onthecodepath/iOS-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": false
  },
  {
    "id": "auto-2",
    "topic": "swift",
    "prompt": "What are some ways of debugging in iOS?",
    "options": [
      {
        "text": "Use Xcode's built-in debugger and print statements",
        "correct": true
      },
      {
        "text": "Use a third-party library like Crashlytics or Fabric",
        "correct": false
      },
      {
        "text": "Use the `po` command in the console to inspect objects",
        "correct": true
      },
      {
        "text": "Write a custom logging framework using Core Data",
        "correct": false
      }
    ],
    "explanation": "The correct answers are using Xcode's built-in debugger and print statements, which provide a comprehensive debugging experience. Using the `po` command allows for inspecting objects in the console.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/onthecodepath/iOS-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": false
  },
  {
    "id": "auto-3",
    "topic": "objc",
    "prompt": "What is the delegation pattern?",
    "options": [
      {
        "text": "A design pattern where an object delegates its tasks to another object",
        "correct": true
      },
      {
        "text": "A way to share data between objects without using a singleton",
        "correct": false
      },
      {
        "text": "A technique used in Core Data to fetch related entities",
        "correct": false
      },
      {
        "text": "A design pattern where an object delegates its tasks to another object, allowing for loose coupling and flexibility",
        "correct": true
      }
    ],
    "explanation": "The delegation pattern is a design pattern that allows objects to delegate their tasks to other objects. This approach enables loose coupling between objects and provides flexibility in terms of task assignment.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/onthecodepath/iOS-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": false
  },
  {
    "id": "auto-4",
    "topic": "swift",
    "prompt": "What considerations do you need when writing a UITableViewController which shows images downloaded from a remote server?",
    "options": [
      {
        "text": "You should use a separate thread for image downloading",
        "correct": true
      },
      {
        "text": "You can directly set the image on the cell's imageView property",
        "correct": false
      },
      {
        "text": "You should consider using an SDWebImage or similar library to handle image caching and downloading",
        "correct": true
      },
      {
        "text": "You don't need to worry about image sizes, as the table view will automatically resize them",
        "correct": false
      }
    ],
    "explanation": "When working with remote images in a UITableViewController, you should consider using a separate thread for image downloading to avoid blocking the main thread. Additionally, libraries like SDWebImage can help with caching and downloading images efficiently.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/onthecodepath/iOS-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": false
  },
  {
    "id": "auto-5",
    "topic": "swift",
    "prompt": "What is the difference between a class and an object?",
    "options": [
      {
        "text": "A class is a blueprint for creating objects, while an object is an instance of a class.",
        "correct": true
      },
      {
        "text": "An object is a type that can be instantiated multiple times, whereas a class is a single instance.",
        "correct": false
      },
      {
        "text": "Both are interchangeable terms referring to the same concept in Swift.",
        "correct": true
      },
      {
        "text": "A class is a function that returns an object when called.",
        "correct": false
      }
    ],
    "explanation": "In Swift, a class is a blueprint for creating objects, which are instances of that class. A correct answer highlights this distinction.",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/onthecodepath/iOS-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": false
  },
  {
    "id": "auto-6",
    "topic": "memory",
    "prompt": "What are the execution states of a task in iOS?",
    "options": [
      {
        "text": "Not-running, inactive, active, suspended",
        "correct": true
      },
      {
        "text": "Running, paused, background, foreground",
        "correct": false
      },
      {
        "text": "Active, suspended, background, not-running",
        "correct": true
      },
      {
        "text": "Foreground, background, paused, idle",
        "correct": false
      }
    ],
    "explanation": "A task in iOS can be in one of these five states: not running (it has not started), inactive (it is waiting for a resource), active (it is executing), suspended (it is paused but still holds onto resources), and background (it is running in the background).",
    "source": "auto-scan",
    "origin": "https://raw.githubusercontent.com/onthecodepath/iOS-Interview-Questions/master/README.md",
    "addedAt": "2026-07-08",
    "reviewed": false
  }
];
