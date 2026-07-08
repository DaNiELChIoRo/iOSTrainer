/**
 * Quiz bank. Each question:
 *  { id, topic, prompt, options: [{ text, correct }], explanation }
 * A question is "multiple-answer" whenever more than one option is correct;
 * the UI derives single vs. multi automatically from the number of correct options.
 */
window.QUIZ_TOPICS = {
  memory:      { name: "Memory Management", icon: "🧠", blurb: "ARC, retain cycles, weak/unowned, capture lists." },
  layout:      { name: "Layout",            icon: "📐", blurb: "Auto Layout, intrinsic size, priorities, SwiftUI layout." },
  swiftui:     { name: "SwiftUI",           icon: "🎨", blurb: "State, data flow, view identity, property wrappers." },
  swiftdata:   { name: "SwiftData",         icon: "🗃️", blurb: "@Model, ModelContainer, @Query, ModelContext." },
  coredata:    { name: "Core Data",         icon: "💾", blurb: "Contexts, persistent container, fetching, faulting." },
  concurrency: { name: "Concurrency",       icon: "⚡", blurb: "async/await, actors, Task, MainActor, Sendable." },
};

window.QUIZ_DATA = [
  /* ---------------------------------------------------------------- MEMORY */
  {
    id: "mem-1", topic: "memory",
    prompt: "Which of the following can create a strong reference cycle?",
    options: [
      { text: "A parent object holding a strong reference to a child that holds a strong reference back to the parent", correct: true },
      { text: "A closure that captures self strongly while self also retains the closure", correct: true },
      { text: "A view controller strongly referencing a UILabel it owns", correct: false },
      { text: "Two objects referencing each other where at least one reference is weak", correct: false },
    ],
    explanation: "Cycles form when two objects (or an object and a closure it owns) both hold strong references to each other. Making one side weak/unowned breaks the cycle. A VC owning a label is a normal one-way strong reference, not a cycle.",
  },
  {
    id: "mem-2", topic: "memory",
    prompt: "When should you prefer `unowned` over `weak`?",
    options: [
      { text: "When the captured reference is guaranteed to outlive the closure/object and can never be nil", correct: true },
      { text: "When the reference may become nil during its lifetime", correct: false },
      { text: "When you want the runtime to crash on access after deallocation rather than silently getting nil", correct: true },
      { text: "Whenever you want to avoid the Optional unwrapping that `weak` forces", correct: true },
    ],
    explanation: "`unowned` is non-optional and assumes the referent always outlives the reference. Accessing it after deallocation is a crash (a bug you want surfaced). `weak` is optional and becomes nil safely when the referent is freed — use it when the lifetime isn't guaranteed.",
  },
  {
    id: "mem-3", topic: "memory",
    prompt: "Which statements about `[weak self]` capture lists are true?",
    options: [
      { text: "`self` becomes an Optional inside the closure and must be unwrapped", correct: true },
      { text: "It prevents the closure from keeping `self` alive", correct: true },
      { text: "It automatically makes every captured variable weak", correct: false },
      { text: "`guard let self else { return }` is a common way to safely use it", correct: true },
    ],
    explanation: "`[weak self]` only affects `self`; other captured values keep their default (strong) semantics unless listed. Inside, `self` is Optional, commonly unwrapped with `guard let self`.",
  },
  {
    id: "mem-4", topic: "memory",
    prompt: "Which are value types in Swift (and therefore not managed by ARC)?",
    options: [
      { text: "struct", correct: true },
      { text: "enum", correct: true },
      { text: "class", correct: false },
      { text: "Array / Dictionary / String", correct: true },
    ],
    explanation: "ARC only manages reference types (`class`, `actor`, closures). Structs, enums, and the standard-library collections/String are value types (though collections use copy-on-write internally).",
  },
  {
    id: "mem-5", topic: "memory",
    prompt: "What is `autoreleasepool` useful for?",
    options: [
      { text: "Draining temporary objects eagerly inside a tight loop to keep peak memory down", correct: true },
      { text: "Preventing retain cycles automatically", correct: false },
      { text: "Reducing memory spikes when processing many autoreleased objects (e.g. image loading in a loop)", correct: true },
      { text: "Replacing ARC with manual retain/release", correct: false },
    ],
    explanation: "`autoreleasepool { }` flushes autoreleased objects at the end of each iteration, avoiding a large buildup during long loops. It doesn't affect retain cycles or replace ARC.",
  },

  /* ---------------------------------------------------------------- LAYOUT */
  {
    id: "lay-1", topic: "layout",
    prompt: "What does a view's intrinsic content size represent?",
    options: [
      { text: "The size a view naturally wants based on its content (e.g. a label's text)", correct: true },
      { text: "The size explicitly set by width/height constraints", correct: false },
      { text: "A value the view provides that Auto Layout uses when no explicit size constraints exist", correct: true },
      { text: "Always the size of the superview", correct: false },
    ],
    explanation: "Intrinsic content size is the natural size a view reports from its content (labels, buttons, image views). Auto Layout uses it, mediated by hugging/compression priorities, when explicit size constraints are absent.",
  },
  {
    id: "lay-2", topic: "layout",
    prompt: "Match the behavior: which are true about content hugging vs. compression resistance?",
    options: [
      { text: "Higher content hugging priority resists growing larger than intrinsic size", correct: true },
      { text: "Higher compression resistance priority resists shrinking smaller than intrinsic size", correct: true },
      { text: "Content hugging resists shrinking", correct: false },
      { text: "When two labels compete for space, the one with lower hugging priority stretches", correct: true },
    ],
    explanation: "Hugging = 'don't grow past my content' (resists stretching). Compression resistance = 'don't clip my content' (resists shrinking). The label that stretches to fill extra space is the one with the lower hugging priority.",
  },
  {
    id: "lay-3", topic: "layout",
    prompt: "Which are valid ways to resolve an ambiguous or conflicting Auto Layout situation?",
    options: [
      { text: "Lower the priority of one competing constraint below the other", correct: true },
      { text: "Add enough constraints to fully determine position and size", correct: true },
      { text: "Set `translatesAutoresizingMaskIntoConstraints = false` on programmatically laid-out views", correct: true },
      { text: "Always pin all four edges to the superview regardless of content", correct: false },
    ],
    explanation: "Ambiguity is fixed by fully constraining the view; conflicts are fixed by adjusting priorities. Programmatic views need `translatesAutoresizingMaskIntoConstraints = false` or the autoresizing mask generates conflicting constraints. Blindly pinning four edges isn't a general fix.",
  },
  {
    id: "lay-4", topic: "layout",
    prompt: "In SwiftUI, which statements about the layout system are true?",
    options: [
      { text: "A parent proposes a size to its child, and the child chooses its own size", correct: true },
      { text: "The parent places the child based on the size the child returned", correct: true },
      { text: "`frame(width:height:)` forces the child to that exact size, ignoring its content", correct: false },
      { text: "`.fixedSize()` lets a view size to its ideal (unconstrained) dimension", correct: true },
    ],
    explanation: "SwiftUI layout is a negotiation: parent proposes, child decides, parent positions. `frame` proposes a size but the child can still choose (e.g. an image may not fill it). `.fixedSize()` asks the view for its ideal size, ignoring the proposed constraint.",
  },
  {
    id: "lay-5", topic: "layout",
    prompt: "Which are true about `Spacer`, `LazyVStack`, and stack layout in SwiftUI?",
    options: [
      { text: "A `Spacer` expands to take all available space along the stack's axis", correct: true },
      { text: "`LazyVStack` only creates views as they scroll into view", correct: true },
      { text: "`VStack` is lazy by default", correct: false },
      { text: "`LazyVStack` is preferable to `VStack` for very long scrollable lists", correct: true },
    ],
    explanation: "`VStack`/`HStack` are eager — all children are created immediately. Lazy stacks defer creation until scrolled near, which is better for large collections. `Spacer` is a flexible view that soaks up free space.",
  },

  /* --------------------------------------------------------------- SWIFTUI */
  {
    id: "sui-1", topic: "swiftui",
    prompt: "Which property wrappers create a source of truth *owned* by the view itself?",
    options: [
      { text: "@State", correct: true },
      { text: "@StateObject", correct: true },
      { text: "@Binding", correct: false },
      { text: "@ObservedObject", correct: false },
    ],
    explanation: "@State (value types) and @StateObject (reference types) instantiate and own their storage — SwiftUI keeps it alive across body recomputations. @Binding and @ObservedObject are references to state owned elsewhere.",
  },
  {
    id: "sui-2", topic: "swiftui",
    prompt: "Why prefer @StateObject over @ObservedObject when a view creates its own view model?",
    options: [
      { text: "@StateObject is instantiated once and survives view re-renders", correct: true },
      { text: "@ObservedObject may be recreated when the parent re-renders, losing state", correct: true },
      { text: "@ObservedObject cannot trigger view updates", correct: false },
      { text: "@StateObject ties the object's lifetime to the view's lifetime", correct: true },
    ],
    explanation: "If a view instantiates an ObservableObject in an @ObservedObject property, a parent re-render can recreate it, resetting its state. @StateObject guarantees single instantiation tied to the view's lifetime. Both trigger updates via @Published.",
  },
  {
    id: "sui-3", topic: "swiftui",
    prompt: "Which statements about SwiftUI view identity and `body` are correct?",
    options: [
      { text: "Views are lightweight value types that SwiftUI recreates cheaply", correct: true },
      { text: "SwiftUI diffs the view tree and only updates what changed", correct: true },
      { text: "Explicit identity can be set with `.id(...)`", correct: true },
      { text: "Recomputing `body` always means the underlying UIView is recreated from scratch", correct: false },
    ],
    explanation: "SwiftUI views are cheap value descriptions; `body` can run often. SwiftUI diffs by identity (structural or explicit via `.id`) and mutates only the affected backing views — it does not tear everything down on each recompute.",
  },
  {
    id: "sui-4", topic: "swiftui",
    prompt: "Which are correct uses of @EnvironmentObject / @Environment?",
    options: [
      { text: "@EnvironmentObject reads an ObservableObject injected higher in the view hierarchy", correct: true },
      { text: "A missing @EnvironmentObject injection causes a runtime crash", correct: true },
      { text: "@Environment reads system values like colorScheme or dismiss", correct: true },
      { text: "@EnvironmentObject values must be passed explicitly through every intermediate view", correct: false },
    ],
    explanation: "The environment lets you inject dependencies once and read them anywhere below, without threading them through each view. Reading an @EnvironmentObject that was never injected traps at runtime. @Environment reads keyed system/custom values.",
  },
  {
    id: "sui-5", topic: "swiftui",
    prompt: "With the Observation framework (`@Observable`, iOS 17+), which are true?",
    options: [
      { text: "You annotate a class with `@Observable` instead of conforming to ObservableObject", correct: true },
      { text: "You no longer need @Published on individual properties", correct: true },
      { text: "Views only re-render when properties they actually read change", correct: true },
      { text: "You must still use @ObservedObject to observe an @Observable class", correct: false },
    ],
    explanation: "`@Observable` replaces ObservableObject/@Published and tracks reads at the property level, so a view updates only for the fields it reads. You reference such objects with plain properties, @State, @Bindable, or @Environment — not @ObservedObject.",
  },

  /* ------------------------------------------------------------- SWIFTDATA */
  {
    id: "sd-1", topic: "swiftdata",
    prompt: "Which are true about the `@Model` macro in SwiftData?",
    options: [
      { text: "It turns a Swift class into a persistable model", correct: true },
      { text: "It is applied to classes, not structs", correct: true },
      { text: "Stored properties become persistent attributes by default", correct: true },
      { text: "It requires you to write an .xcdatamodeld file", correct: false },
    ],
    explanation: "`@Model` is a macro applied to a class; SwiftData generates the schema from your Swift types at compile time — no visual .xcdatamodeld editor. Stored properties persist unless marked `@Transient`.",
  },
  {
    id: "sd-2", topic: "swiftdata",
    prompt: "Which statements about `ModelContainer` and `ModelContext` are correct?",
    options: [
      { text: "ModelContainer sets up the backing store and schema", correct: true },
      { text: "ModelContext tracks changes and performs inserts/deletes/fetches", correct: true },
      { text: "`.modelContainer(for:)` injects a context into the SwiftUI environment", correct: true },
      { text: "You typically create a new ModelContainer per view", correct: false },
    ],
    explanation: "The container is the app-wide store/schema owner (usually one per app); the context is the working scratchpad that tracks and persists changes. The `.modelContainer` modifier wires a main-actor context into the environment for `@Query` and `@Environment(\\.modelContext)`.",
  },
  {
    id: "sd-3", topic: "swiftdata",
    prompt: "Which are true about `@Query` in SwiftUI?",
    options: [
      { text: "It fetches model objects and keeps the view in sync as data changes", correct: true },
      { text: "It supports sorting and filtering via predicates", correct: true },
      { text: "It requires a ModelContext to be present in the environment", correct: true },
      { text: "It works with plain structs that don't use @Model", correct: false },
    ],
    explanation: "`@Query` automatically fetches @Model objects, re-running and updating the view when the store changes. It accepts sort descriptors and `#Predicate` filters, and relies on a context injected via `.modelContainer`.",
  },
  {
    id: "sd-4", topic: "swiftdata",
    prompt: "How do you persist a new object in SwiftData?",
    options: [
      { text: "`context.insert(object)`", correct: true },
      { text: "Changes are auto-saved by default, though you can call `context.save()` explicitly", correct: true },
      { text: "`context.delete(object)` removes it", correct: true },
      { text: "You must manually write SQL", correct: false },
    ],
    explanation: "Insert/delete on the context stages changes; SwiftData autosaves periodically, and `save()` flushes immediately. No SQL is written by hand.",
  },

  /* -------------------------------------------------------------- CORE DATA */
  {
    id: "cd-1", topic: "coredata",
    prompt: "Which statements about `NSManagedObjectContext` are true?",
    options: [
      { text: "It is a scratchpad that tracks changes to managed objects", correct: true },
      { text: "A context is bound to a concurrency (queue) type — main or private", correct: true },
      { text: "Managed objects should be passed freely between contexts/threads", correct: false },
      { text: "You call `save()` to push changes to the persistent store coordinator", correct: true },
    ],
    explanation: "A context is an in-memory scratchpad tied to a queue. Managed objects are NOT thread-safe — pass `NSManagedObjectID` across contexts instead of the objects. `save()` persists staged changes.",
  },
  {
    id: "cd-2", topic: "coredata",
    prompt: "What does `NSPersistentContainer` provide?",
    options: [
      { text: "It encapsulates the model, coordinator, and a main-queue viewContext", correct: true },
      { text: "It offers `newBackgroundContext()` and `performBackgroundTask` for background work", correct: true },
      { text: "It removes the need for an .xcdatamodeld model", correct: false },
      { text: "`loadPersistentStores` sets up the underlying stores", correct: true },
    ],
    explanation: "`NSPersistentContainer` bundles the managed object model, persistent store coordinator, and a `viewContext`, and vends background contexts. You still define the schema in an .xcdatamodeld (or programmatically).",
  },
  {
    id: "cd-3", topic: "coredata",
    prompt: "Which are true about faulting in Core Data?",
    options: [
      { text: "A fault is a placeholder that defers loading an object's data until accessed", correct: true },
      { text: "Faulting reduces memory and speeds up fetches", correct: true },
      { text: "Firing a fault may trigger a trip to the persistent store", correct: true },
      { text: "Faults are an error state that should be avoided", correct: false },
    ],
    explanation: "Faulting is an optimization, not an error: Core Data returns lightweight placeholders and only loads real data when you access it, which can hit the store. It lowers memory and initial fetch cost.",
  },
  {
    id: "cd-4", topic: "coredata",
    prompt: "Which are effective ways to keep Core Data work off the main thread?",
    options: [
      { text: "Use a private-queue context via `performBackgroundTask`", correct: true },
      { text: "Wrap context access in `context.perform { }` / `performAndWait`", correct: true },
      { text: "Access the same managed object from multiple queues simultaneously", correct: false },
      { text: "Pass object IDs between contexts and re-fetch on the target queue", correct: true },
    ],
    explanation: "Always touch a context on its own queue via `perform`. Do heavy work on a background context, and move data between contexts using `NSManagedObjectID`, never by sharing managed objects across queues.",
  },

  /* ----------------------------------------------------------- CONCURRENCY */
  {
    id: "con-1", topic: "concurrency",
    prompt: "Which statements about Swift's `async`/`await` are correct?",
    options: [
      { text: "`await` marks a potential suspension point where the function may yield the thread", correct: true },
      { text: "An `async` function can only be called from an async context or a `Task`", correct: true },
      { text: "`await` blocks the current thread until the result is ready", correct: false },
      { text: "State can change across an `await` because the function may suspend and resume", correct: true },
    ],
    explanation: "`await` suspends the function and frees the thread rather than blocking it; execution resumes later, possibly on a different thread, so you can't assume state is unchanged across the suspension point.",
  },
  {
    id: "con-2", topic: "concurrency",
    prompt: "Which are true about `actor` types?",
    options: [
      { text: "They protect their mutable state by serializing access", correct: true },
      { text: "Accessing an actor's properties/methods from outside is `await`-ed", correct: true },
      { text: "They eliminate all data races on their isolated state", correct: true },
      { text: "Actor methods can be called synchronously from any thread without await", correct: false },
    ],
    explanation: "Actors provide isolation: only one task touches their mutable state at a time, preventing data races on that state. Cross-actor access is asynchronous (`await`). `nonisolated` members are the exception that can be called synchronously.",
  },
  {
    id: "con-3", topic: "concurrency",
    prompt: "Which are correct about `@MainActor`?",
    options: [
      { text: "It guarantees the annotated code runs on the main thread", correct: true },
      { text: "UI updates should be isolated to the main actor", correct: true },
      { text: "You can annotate a type, method, or property with it", correct: true },
      { text: "It makes code run in parallel across all cores", correct: false },
    ],
    explanation: "`@MainActor` is a global actor pinning work to the main thread — ideal for UI. It can annotate types, functions, or properties. It's about isolation/serialization on the main thread, not parallelism.",
  },
  {
    id: "con-4", topic: "concurrency",
    prompt: "Which statements about structured concurrency (`Task`, task groups, `async let`) are true?",
    options: [
      { text: "`async let` starts a child task that runs concurrently and is awaited later", correct: true },
      { text: "A task group lets you spawn a dynamic number of child tasks and collect results", correct: true },
      { text: "Cancellation propagates to child tasks in structured concurrency", correct: true },
      { text: "A detached task (`Task.detached`) inherits the parent's actor and priority", correct: false },
    ],
    explanation: "`async let` and `withTaskGroup` create child tasks whose lifetimes are bound to the parent scope, with cooperative cancellation propagating downward. `Task.detached` deliberately does NOT inherit context (actor, priority, task-locals).",
  },
  {
    id: "con-5", topic: "concurrency",
    prompt: "What does the `Sendable` protocol express?",
    options: [
      { text: "That a value can be safely passed across concurrency domains", correct: true },
      { text: "Value types with Sendable members are often implicitly Sendable", correct: true },
      { text: "The compiler can diagnose unsafe sharing of non-Sendable types", correct: true },
      { text: "It forces a type to be a reference type", correct: false },
    ],
    explanation: "`Sendable` marks types safe to share across actors/tasks. Many value types conform implicitly; classes require care (e.g. immutability or internal locking, often `@unchecked Sendable`). The compiler uses it to flag unsafe crossings.",
  },
];
