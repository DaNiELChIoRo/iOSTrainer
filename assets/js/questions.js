/**
 * Quiz bank. Each question:
 *  { id, topic, prompt, options: [{ text, correct }], explanation }
 * A question is "multiple-answer" whenever more than one option is correct;
 * the UI derives single vs. multi automatically from the number of correct options.
 */
window.QUIZ_TOPICS = {
  swift:       { name: "Swift Language",    icon: "🦅", blurb: "Value/reference types, optionals, generics, protocols, Swift 6.4." },
  memory:      { name: "Memory Management", icon: "🧠", blurb: "ARC, retain cycles, weak/unowned, capture lists." },
  layout:      { name: "Layout",            icon: "📐", blurb: "Auto Layout, intrinsic size, priorities, SwiftUI layout." },
  swiftui:     { name: "SwiftUI",           icon: "🎨", blurb: "State, data flow, view identity, property wrappers." },
  swiftdata:   { name: "SwiftData",         icon: "🗃️", blurb: "@Model, ModelContainer, @Query, ModelContext." },
  coredata:    { name: "Core Data",         icon: "💾", blurb: "Contexts, persistent container, fetching, faulting." },
  concurrency: { name: "Concurrency",       icon: "⚡", blurb: "async/await, actors, Task, MainActor, Sendable." },
  combine:     { name: "Combine / Reactive", icon: "🔗", blurb: "Publishers, subscribers, operators, subjects, schedulers." },
  libraries:   { name: "Third-Party Libs",  icon: "📦", blurb: "Alamofire, image loading, DI, Realm, SPM/CocoaPods." },
  patterns:    { name: "Design Patterns",   icon: "♟️", blurb: "Creational, structural, behavioral; delegate, observer, singleton." },
  architecture:{ name: "Architecture",      icon: "🏛️", blurb: "MVC, MVVM, VIPER, Clean, TCA; separation of concerns." },
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
  {
    id: "sui-6", topic: "swiftui",
    prompt: "What are the differences between the `ObservableObject` protocol and the newer `@Observable` macro?",
    options: [
      { text: "`ObservableObject` is a protocol you conform to and mark properties with `@Published`; `@Observable` is a macro applied to the class with no per-property annotation", correct: true },
      { text: "`ObservableObject` notifies on any `@Published` change (via `objectWillChange`), so a view can re-render even for properties it doesn't read", correct: true },
      { text: "`@Observable` tracks reads per-property, so views only update when a property they actually use changes — often fewer redraws", correct: true },
      { text: "Both require the class to conform to `ObservableObject` and use `@ObservedObject` in the view", correct: false },
    ],
    explanation: "`ObservableObject` (Combine-based) uses `@Published` + `objectWillChange` and can over-invalidate views. `@Observable` (Observation framework, iOS 17+) drops the protocol and `@Published`, tracks dependencies at the property level for finer-grained updates, and is observed with plain properties / `@State` / `@Bindable` / `@Environment` — not `@ObservedObject`.",
  },
  {
    id: "sui-7", topic: "swiftui",
    prompt: "When migrating a view model from `ObservableObject` to `@Observable`, which changes are correct?",
    options: [
      { text: "Replace `class VM: ObservableObject` with `@Observable class VM`", correct: true },
      { text: "Remove `@Published` from stored properties", correct: true },
      { text: "In the view, change `@StateObject var vm = VM()` to `@State var vm = VM()`", correct: true },
      { text: "Keep using `@ObservedObject var vm: VM` for objects passed in", correct: false },
    ],
    explanation: "With `@Observable`: annotate the class, drop `@Published`, and own it with `@State` (instead of `@StateObject`). A passed-in object is just a plain `let`/`var` property, and two-way bindings use `@Bindable` — `@ObservedObject`/`@StateObject` are no longer used.",
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

  /* ----------------------------------------------- CONCURRENCY · GCD / DispatchQueue */
  {
    id: "gcd-1", topic: "concurrency",
    prompt: "Which statements about serial vs. concurrent `DispatchQueue`s are correct?",
    options: [
      { text: "A serial queue executes one work item at a time, in FIFO order", correct: true },
      { text: "A concurrent queue may run multiple work items in parallel", correct: true },
      { text: "`DispatchQueue.main` is a serial queue tied to the main thread", correct: true },
      { text: "Work items always start in the order they finish", correct: false },
    ],
    explanation: "Serial queues run items one-at-a-time; concurrent queues can start many simultaneously (they still start in FIFO order but can finish in any order). The main queue is serial and drives the UI.",
  },
  {
    id: "gcd-2", topic: "concurrency",
    prompt: "Which of these will deadlock or block the calling thread?",
    options: [
      { text: "Calling `DispatchQueue.main.sync { }` from the main thread", correct: true },
      { text: "Calling `.sync` on the current serial queue from within that same queue", correct: true },
      { text: "Calling `.async` on any queue", correct: false },
      { text: "Dispatching UI updates to `DispatchQueue.main.async` from a background thread", correct: false },
    ],
    explanation: "`sync` blocks the caller until the block finishes. Targeting the queue the caller is already running on (e.g. main→main sync) deadlocks because the block can never start. `async` never blocks the caller, and hopping UI work to `main.async` is the correct pattern.",
  },
  {
    id: "gcd-3", topic: "concurrency",
    prompt: "You need to run several async network calls and be notified when all finish. Which `DispatchGroup` usage is correct?",
    options: [
      { text: "Call `group.enter()` before each task and `group.leave()` in each completion handler", correct: true },
      { text: "Use `group.notify(queue:)` to run a closure once the group is empty", correct: true },
      { text: "Every `enter()` must be balanced by exactly one `leave()`", correct: true },
      { text: "`group.wait()` returns immediately without blocking, even if tasks are pending", correct: false },
    ],
    explanation: "Bracket each async task with `enter()`/`leave()` (balanced 1:1), then use `notify` to be called back on completion. `wait()` *blocks* the current thread until the group is empty (or a timeout), so it must not be called on the main queue.",
  },
  {
    id: "gcd-4", topic: "concurrency",
    prompt: "Which are true about Quality of Service (QoS) classes in GCD?",
    options: [
      { text: "`.userInteractive` is the highest priority, for work that must happen instantly (UI)", correct: true },
      { text: "`.background` is for work the user isn't actively waiting on", correct: true },
      { text: "QoS helps the system decide scheduling, CPU, and energy trade-offs", correct: true },
      { text: "Higher QoS always guarantees the work runs on the main thread", correct: false },
    ],
    explanation: "QoS ranks work from `.userInteractive` → `.userInitiated` → `.utility` → `.background`, guiding the scheduler on priority and energy use. It does not pin work to the main thread.",
  },
  {
    id: "gcd-5", topic: "concurrency",
    prompt: "Which GCD tools help coordinate access or limit concurrency?",
    options: [
      { text: "A `.barrier` work item on a concurrent queue waits for in-flight items, then runs exclusively (reader/writer pattern)", correct: true },
      { text: "`DispatchSemaphore` can cap the number of concurrent operations", correct: true },
      { text: "`DispatchWorkItem` can be created, cancelled, and dispatched later", correct: true },
      { text: "A barrier has any effect on a *serial* queue", correct: false },
    ],
    explanation: "Barriers give a safe exclusive write window on a concurrent queue (pointless on a serial queue, which is already exclusive). Semaphores throttle concurrency, and `DispatchWorkItem` wraps cancellable units of work.",
  },

  /* ----------------------------------------------------------- SWIFT LANGUAGE */
  {
    id: "sw-1", topic: "swift",
    prompt: "Which statements about value types vs. reference types in Swift are correct?",
    options: [
      { text: "`struct` and `enum` are value types, copied on assignment", correct: true },
      { text: "`class` is a reference type; assignment shares the same instance", correct: true },
      { text: "A `let` struct makes its (value-type) stored properties immutable", correct: true },
      { text: "Mutating a `let` class's `var` properties is a compile error", correct: false },
    ],
    explanation: "Value types are copied; a `let` value type is fully immutable. Reference types share instances; a `let` on a class only fixes the reference — you can still mutate the object's `var` properties through it.",
  },
  {
    id: "sw-2", topic: "swift",
    prompt: "Which are valid ways to safely work with Optionals?",
    options: [
      { text: "`if let` / `guard let` optional binding", correct: true },
      { text: "Nil-coalescing with `??` to supply a default", correct: true },
      { text: "Optional chaining with `?.`", correct: true },
      { text: "Force unwrapping `!` is the recommended default for all optionals", correct: false },
    ],
    explanation: "Binding, `??`, and `?.` handle absence safely. Force-unwrapping crashes on `nil` and should be reserved for cases you can prove are non-nil — not a default.",
  },
  {
    id: "sw-3", topic: "swift",
    prompt: "Which are true about protocols and protocol-oriented programming?",
    options: [
      { text: "Protocol extensions can provide default method implementations", correct: true },
      { text: "A protocol with an `associatedtype` can only be used as a generic constraint or with `some`/`any` (not always as a plain type)", correct: true },
      { text: "Types can conform to multiple protocols (composition with `&`)", correct: true },
      { text: "Protocols cannot be adopted by value types like structs", correct: false },
    ],
    explanation: "Protocol extensions supply shared default behavior; protocols with associated types have generic constraints (historically 'PATs'). Structs, enums, and classes can all conform, and you compose requirements with `A & B`.",
  },
  {
    id: "sw-4", topic: "swift",
    prompt: "Which statements about generics are correct?",
    options: [
      { text: "`func f<T>(_ x: T)` works for any type T", correct: true },
      { text: "A `where` clause adds constraints, e.g. `where T: Equatable`", correct: true },
      { text: "`some P` is an opaque type: one concrete underlying type hidden from the caller", correct: true },
      { text: "`any P` and `some P` mean exactly the same thing", correct: false },
    ],
    explanation: "Generics and `where` clauses give type-safe, constrained polymorphism. `some P` is an *opaque* type (a single fixed underlying type), while `any P` is an *existential* box that can hold different conforming types at runtime — they are not equivalent.",
  },
  {
    id: "sw-5", topic: "swift",
    prompt: "Which are true about Swift error handling?",
    options: [
      { text: "A throwing function is marked `throws` and called with `try`", correct: true },
      { text: "`try?` converts a throw into an Optional; `try!` traps on error", correct: true },
      { text: "Typed throws (`throws(MyError)`) constrains the concrete error type a function can throw", correct: true },
      { text: "`defer` blocks run only when a function returns normally, never when it throws", correct: false },
    ],
    explanation: "`throws`/`try` model recoverable errors; `try?`/`try!` are the optional/forced variants. Swift 6 added typed throws (`throws(E)`). `defer` runs on *every* scope exit — normal return, thrown error, or break.",
  },
  {
    id: "sw-6", topic: "swift",
    prompt: "Which statements about closures are correct?",
    options: [
      { text: "An `@escaping` closure can outlive the function it was passed to (e.g. stored or run later)", correct: true },
      { text: "Non-escaping closures are the default for function parameters", correct: true },
      { text: "Capture lists like `[weak self]` control how referenced values are captured", correct: true },
      { text: "Closures are value types that never capture their surrounding context", correct: false },
    ],
    explanation: "Function-parameter closures are non-escaping unless marked `@escaping`. Closures are reference types that capture their environment; capture lists tune that capture (e.g. to avoid retain cycles).",
  },
  {
    id: "sw-7", topic: "swift",
    prompt: "Which are true about Swift enums?",
    options: [
      { text: "Enum cases can carry associated values, e.g. `case error(code: Int)`", correct: true },
      { text: "Enums can have raw values (`enum Suit: String`)", correct: true },
      { text: "Enums can have computed properties and methods", correct: true },
      { text: "An enum case can have both a raw value and associated values at the same time", correct: false },
    ],
    explanation: "Enums are powerful value types: associated values model payloads, raw values map cases to literals, and they support methods/computed properties. A single enum can't mix raw values and associated values.",
  },

  /* --------------------------------------------- SWIFT · INTEROP & BRIDGING (tricky) */
  {
    id: "sw-int-1", topic: "swift",
    prompt: "When is it necessary to write `import FoundationKit`?",
    options: [
      { text: "Never — there is no module called FoundationKit on Apple platforms; the module is `Foundation`", correct: true },
      { text: "'FoundationKit' was the old NeXTSTEP-era name; modern Swift uses `import Foundation`", correct: true },
      { text: "Always, before using `String` or `Array`", correct: false },
      { text: "Only when targeting watchOS", correct: false },
    ],
    explanation: "Trick question. There is no `FoundationKit` module to import — you `import Foundation`. (Also note `String`, `Array`, etc. are in the Swift standard library and need no import at all.) On Linux, networking/XML live in separate `FoundationNetworking`/`FoundationXML` modules.",
  },
  {
    id: "sw-int-2", topic: "swift",
    prompt: "What is 'bridging' in Swift, and when is it used?",
    options: [
      { text: "Automatic conversion between Swift and Objective-C / Foundation types, e.g. `String` ⇄ `NSString`", correct: true },
      { text: "It lets you use Objective-C APIs (and vice versa) via `as` casts and an Objective-C bridging header", correct: true },
      { text: "Toll-free bridging lets some Foundation and Core Foundation types (e.g. `NSString`/`CFString`) be used interchangeably", correct: true },
      { text: "Bridging is required to call one pure-Swift struct from another pure-Swift file", correct: false },
    ],
    explanation: "Bridging is the interop layer between Swift and Objective-C/C: value-type bridging (`String`⇄`NSString`, `Array`⇄`NSArray`), the `#import`-based bridging header for mixed targets, and toll-free bridging between Foundation and Core Foundation. Pure Swift-to-Swift calls need no bridging.",
  },
  {
    id: "sw-int-3", topic: "swift",
    prompt: "Which are true about exposing Swift code to Objective-C or C?",
    options: [
      { text: "`@objc` (and `@objcMembers`) exposes Swift declarations to the Objective-C runtime", correct: true },
      { text: "A Swift class exposed to Objective-C typically must inherit from `NSObject`", correct: true },
      { text: "Swift 6.4's `@C` attribute exports Swift functions to C (only using C-compatible types)", correct: true },
      { text: "Swift structs and enums with associated values are fully representable in Objective-C", correct: false },
    ],
    explanation: "`@objc` bridges to the ObjC runtime (needs `NSObject` ancestry for classes). Swift 6.4 adds `@C` to export functions to C, restricted to C-compatible types (integers, pointers, imported C structs, integer-raw-value enums). Swift-only features like generics or enums with associated values don't map to ObjC/C.",
  },

  /* ------------------------------------------------ SWIFT 6.4 · LATEST ADDITIONS */
  {
    id: "sw64-1", topic: "swift",
    prompt: "What does Swift 6.4's `anyAppleOS` shorthand do?",
    options: [
      { text: "Replaces listing every Apple platform in `@available`, e.g. `@available(anyAppleOS 27, *)`", correct: true },
      { text: "Works in conditional compilation too, e.g. `#if os(anyAppleOS)`", correct: true },
      { text: "Reduces `@available(macOS 27, iOS 27, visionOS 27, *)` to a single clause", correct: true },
      { text: "Makes an API available on Android and Windows", correct: false },
    ],
    explanation: "`anyAppleOS` (Swift 6.4) collapses the five per-platform availability clauses into one for Apple OSes, in both `@available` and `#if os(...)`. It does not add non-Apple platforms.",
  },
  {
    id: "sw64-2", topic: "swift",
    prompt: "Swift 6.4 (SE-0493) allows `await` inside `defer`. Which statements are correct?",
    options: [
      { text: "You can now write `defer { await resource.close() }` in an async function", correct: true },
      { text: "Swift implicitly awaits the async cleanup before the function returns", correct: true },
      { text: "Asynchronous `defer` does not hide cancellation", correct: true },
      { text: "Before Swift 6.4, async calls in `defer` were already allowed", correct: false },
    ],
    explanation: "SE-0493 finally permits asynchronous work in `defer`; the body still runs on scope exit and Swift awaits it before returning, without masking task cancellation. Previously this was a compile error even in async functions.",
  },
  {
    id: "sw64-3", topic: "swift",
    prompt: "Swift 6.4 introduces the `Iterable` protocol alongside `Sequence`. What's the key difference?",
    options: [
      { text: "`Sequence` copies elements out; `Iterable` borrows them", correct: true },
      { text: "`Iterable` enables iterating noncopyable (`~Copyable`) types without a copy penalty", correct: true },
      { text: "Borrowing iteration can avoid unnecessary retains/copies for performance", correct: true },
      { text: "`Iterable` completely replaces and deprecates `Sequence`", correct: false },
    ],
    explanation: "The new `Iterable` protocol borrows elements rather than copying them out like `Sequence`, which unlocks efficient iteration over noncopyable types. It complements `Sequence` rather than deprecating it.",
  },
  {
    id: "sw64-4", topic: "swift",
    prompt: "Which are true about Swift 6.4's warning and diagnostics controls?",
    options: [
      { text: "The `@diagnose` attribute gives finer-grained, per-declaration control over warnings", correct: true },
      { text: "`@diagnose` can silence deprecation warnings, promote warnings to errors, or downgrade errors to warnings", correct: true },
      { text: "Swift 6.4 warns when an unstructured throwing `Task` handle is ignored (SE-0520)", correct: true },
      { text: "`@diagnose` only works at the whole-module level", correct: false },
    ],
    explanation: "`@diagnose` (Swift 6.4) applies to individual declarations to reshape warning/error severity. Separately, SE-0520 adds a warning for `Task { try await … }` whose handle is discarded — use `_ = Task { … }` when ignoring the failure is intentional.",
  },
  {
    id: "sw64-5", topic: "swift",
    prompt: "Which describe Swift 6.4 concurrency additions accurately?",
    options: [
      { text: "`withTaskCancellationShield { … }` (SE-0504) lets cleanup finish without observing cancellation", correct: true },
      { text: "Inside a cancellation shield, `Task.isCancelled` reports `false`", correct: true },
      { text: "Tasks can now specify a concrete failure type via `throws(Failure)`", correct: true },
      { text: "Cancellation shields are meant to be wrapped around all normal business logic", correct: false },
    ],
    explanation: "`withTaskCancellationShield` temporarily hides cancellation so critical cleanup (e.g. `await database.close()`) can complete — pairing well with async `defer`. Tasks also gained typed throws. Shields are for rare rollback/cleanup, not everyday work.",
  },

  /* ------------------------------------------------------ THIRD-PARTY LIBRARIES */
  {
    id: "lib-1", topic: "libraries",
    prompt: "When is Alamofire preferable over a raw `URLSession`?",
    options: [
      { text: "When you want higher-level ergonomics: request/response chaining, built-in validation, and parameter/JSON encoding", correct: true },
      { text: "When you need conveniences like retry, request adapters/interceptors, and multipart uploads without hand-rolling them", correct: true },
      { text: "When the team already standardizes on it and values readability over zero dependencies", correct: true },
      { text: "Because URLSession cannot perform networking on its own", correct: false },
    ],
    explanation: "Alamofire is a convenience layer *on top of* URLSession — it doesn't do anything URLSession fundamentally can't. You reach for it to reduce boilerplate (validation, interceptors, retries, multipart). For simple needs, plain `URLSession` with `async/await` is often enough and dependency-free.",
  },
  {
    id: "lib-2", topic: "libraries",
    prompt: "Which are good reasons to prefer plain `URLSession` over adding Alamofire?",
    options: [
      { text: "You want to avoid a third-party dependency and keep the binary/footprint minimal", correct: true },
      { text: "Your needs are simple and modern `async/await` URLSession already covers them cleanly", correct: true },
      { text: "You want first-party, OS-maintained APIs with no external upgrade risk", correct: true },
      { text: "URLSession supports `async/await` but Alamofire does not", correct: false },
    ],
    explanation: "URLSession is first-party, dependency-free, and since Swift Concurrency it has clean `async/await` methods (`data(from:)`). Many apps no longer need Alamofire. (Alamofire also supports async/await, so that's not a differentiator.)",
  },
  {
    id: "lib-3", topic: "libraries",
    prompt: "Which libraries are commonly used for asynchronous remote image loading & caching?",
    options: [
      { text: "Kingfisher", correct: true },
      { text: "SDWebImage", correct: true },
      { text: "Nuke", correct: true },
      { text: "SnapKit", correct: false },
    ],
    explanation: "Kingfisher, SDWebImage, and Nuke handle downloading, caching, and displaying remote images. SnapKit is unrelated — it's a DSL for Auto Layout constraints. (SwiftUI's built-in `AsyncImage` covers simple cases without a dependency.)",
  },
  {
    id: "lib-4", topic: "libraries",
    prompt: "Match the library to its primary purpose:",
    options: [
      { text: "SnapKit → concise programmatic Auto Layout constraints", correct: true },
      { text: "RxSwift / Combine → reactive/declarative asynchronous event streams", correct: true },
      { text: "Realm → an object database, an alternative to Core Data / SwiftData", correct: true },
      { text: "Alamofire → local on-device persistence", correct: false },
    ],
    explanation: "SnapKit simplifies constraint code, RxSwift/Combine model reactive streams, and Realm is a persistence layer competing with Core Data/SwiftData. Alamofire is for networking, not persistence.",
  },
  {
    id: "lib-5", topic: "libraries",
    prompt: "Which statements about iOS dependency managers are correct?",
    options: [
      { text: "Swift Package Manager (SPM) is Apple's official, Xcode-integrated dependency manager", correct: true },
      { text: "CocoaPods is a long-standing manager using a Podfile and a generated workspace", correct: true },
      { text: "Carthage is a decentralized manager that builds frameworks you integrate manually", correct: true },
      { text: "SPM requires installing a separate Ruby gem like CocoaPods does", correct: false },
    ],
    explanation: "SPM is built into Swift/Xcode (no extra tooling) and is now the default choice for most projects. CocoaPods (Ruby gem, Podfile) and Carthage (decentralized, manual integration) predate it and are still seen in legacy codebases.",
  },
  {
    id: "lib-6", topic: "libraries",
    prompt: "With `Codable` in the standard library, when do you still reach for a JSON library like SwiftyJSON?",
    options: [
      { text: "Rarely — `Codable` covers most typed JSON parsing without a dependency", correct: true },
      { text: "Possibly for loosely-typed or highly dynamic JSON where defining models is impractical", correct: true },
      { text: "For quick exploratory access to unknown/irregular JSON structures", correct: true },
      { text: "Always, because Swift cannot parse JSON without a third-party library", correct: false },
    ],
    explanation: "`Codable` (with `JSONDecoder`) is the idiomatic, dependency-free way to parse JSON into typed models. Libraries like SwiftyJSON mainly help with dynamic/loosely-structured JSON — but they're optional, not required.",
  },

  /* ---------------------------------------------------------- DESIGN PATTERNS */
  {
    id: "pat-1", topic: "patterns",
    prompt: "The classic (Gang of Four) design patterns are divided into which three categories?",
    options: [
      { text: "Creational — how objects are created (Singleton, Factory, Builder, Abstract Factory, Prototype)", correct: true },
      { text: "Structural — how objects are composed (Adapter, Decorator, Facade, Proxy, Composite)", correct: true },
      { text: "Behavioral — how objects communicate (Observer, Strategy, Delegate, Command, Iterator)", correct: true },
      { text: "Functional — how objects are garbage-collected", correct: false },
    ],
    explanation: "GoF patterns split into Creational (object creation), Structural (object composition), and Behavioral (object interaction/responsibility). There is no 'functional/GC' category.",
  },
  {
    id: "pat-2", topic: "patterns",
    prompt: "What is the main purpose of design patterns?",
    options: [
      { text: "Reusable, proven solutions to recurring design problems", correct: true },
      { text: "A shared vocabulary that makes designs easier to communicate", correct: true },
      { text: "To improve maintainability, flexibility, and decoupling", correct: true },
      { text: "To guarantee an app runs faster at runtime", correct: false },
    ],
    explanation: "Patterns capture battle-tested solutions and give teams common terminology, improving structure and decoupling. They're about design quality, not an automatic performance win (and misapplied patterns can add overhead).",
  },
  {
    id: "pat-3", topic: "patterns",
    prompt: "Which patterns are especially common in Apple/UIKit development?",
    options: [
      { text: "Delegation (e.g. UITableViewDelegate) — behavioral", correct: true },
      { text: "Observer (NotificationCenter, KVO, Combine/@Published) — behavioral", correct: true },
      { text: "Singleton (UIApplication.shared, FileManager.default) — creational", correct: true },
      { text: "Bytecode weaving — structural", correct: false },
    ],
    explanation: "Delegation, Observer, and Singleton pervade Apple frameworks. Target-Action and MVC are also Apple staples. 'Bytecode weaving' is not a design pattern.",
  },
  {
    id: "pat-4", topic: "patterns",
    prompt: "Which statements about the Singleton pattern are correct?",
    options: [
      { text: "It ensures a single shared instance with a global access point", correct: true },
      { text: "Overuse hurts testability and hides dependencies (often called an anti-pattern when abused)", correct: true },
      { text: "In Swift it's typically `static let shared = MyType()`", correct: true },
      { text: "Singletons are always the best choice for sharing state", correct: false },
    ],
    explanation: "Singletons provide one shared instance but introduce global state that complicates testing and dependency injection. Use sparingly — prefer injected dependencies where practical.",
  },
  {
    id: "pat-5", topic: "patterns",
    prompt: "Match the pattern to its intent:",
    options: [
      { text: "Strategy → swap interchangeable algorithms behind a common interface", correct: true },
      { text: "Adapter → make an incompatible interface usable by wrapping it", correct: true },
      { text: "Factory → create objects without exposing concrete construction logic", correct: true },
      { text: "Decorator → ensure only one instance of a class exists", correct: false },
    ],
    explanation: "Strategy encapsulates interchangeable algorithms, Adapter bridges incompatible interfaces, Factory hides construction. Decorator *adds behavior* by wrapping an object — ensuring a single instance is the Singleton's job.",
  },
  {
    id: "pat-6", topic: "patterns",
    prompt: "In iOS, the Coordinator pattern is mainly used to…",
    options: [
      { text: "Extract navigation/flow logic out of view controllers", correct: true },
      { text: "Improve reusability and testability of screens by decoupling them from routing", correct: true },
      { text: "Centralize how screens are presented and passed to each other", correct: true },
      { text: "Replace Auto Layout for positioning views", correct: false },
    ],
    explanation: "Coordinators own navigation/flow so view controllers don't hard-code transitions, making screens more reusable and testable. It has nothing to do with layout.",
  },

  /* ----------------------------------------------------- ARCHITECTURAL PATTERNS */
  {
    id: "arch-1", topic: "architecture",
    prompt: "What is the main purpose of an app architecture (MVC, MVVM, VIPER, …)?",
    options: [
      { text: "Separation of concerns — dividing responsibilities across distinct layers", correct: true },
      { text: "Improving testability, maintainability, and scalability of the codebase", correct: true },
      { text: "Making code easier to reason about and onboard new developers", correct: true },
      { text: "Guaranteeing the app has zero bugs", correct: false },
    ],
    explanation: "Architectural patterns organize responsibilities to keep code testable, maintainable, and scalable. They reduce the chance of bugs and ease reasoning, but no architecture guarantees correctness.",
  },
  {
    id: "arch-2", topic: "architecture",
    prompt: "Which statements about Apple's classic MVC are correct?",
    options: [
      { text: "Model = data/business logic, View = UI, Controller = mediator between them", correct: true },
      { text: "In practice on iOS, view controllers often absorb too much logic ('Massive View Controller')", correct: true },
      { text: "The controller typically owns the view and updates it from the model", correct: true },
      { text: "MVC forbids using any other pattern in the same app", correct: false },
    ],
    explanation: "MVC separates data, UI, and mediation, but UIKit's controller-centric design tends to bloat view controllers ('Massive VC'), which motivated MVVM/VIPER. Architectures can be mixed per feature.",
  },
  {
    id: "arch-3", topic: "architecture",
    prompt: "Which are true about MVVM (Model-View-ViewModel)?",
    options: [
      { text: "The ViewModel exposes presentation-ready state and holds view logic", correct: true },
      { text: "It reduces controller bloat and improves unit-testability of presentation logic", correct: true },
      { text: "Data binding (Combine, RxSwift, or SwiftUI's @Observable) commonly connects View and ViewModel", correct: true },
      { text: "The ViewModel should import UIKit and hold references to UIViews", correct: false },
    ],
    explanation: "MVVM moves presentation logic into a testable ViewModel that the View binds to. Keeping the ViewModel UI-framework-agnostic (no UIView references) is what makes it testable and reusable.",
  },
  {
    id: "arch-4", topic: "architecture",
    prompt: "Which describe VIPER accurately?",
    options: [
      { text: "It stands for View, Interactor, Presenter, Entity, Router", correct: true },
      { text: "It enforces strong separation with single-responsibility components", correct: true },
      { text: "The Router (wireframe) handles navigation between modules", correct: true },
      { text: "It's the lightest-weight architecture, ideal for tiny apps", correct: false },
    ],
    explanation: "VIPER splits a screen into View/Interactor/Presenter/Entity/Router with clear responsibilities and Router-driven navigation. That rigor adds boilerplate, so it suits large teams/apps more than small ones.",
  },
  {
    id: "arch-5", topic: "architecture",
    prompt: "Which statements about Clean Architecture and TCA are correct?",
    options: [
      { text: "Clean Architecture organizes code in concentric layers with the dependency rule pointing inward (toward domain/use-cases)", correct: true },
      { text: "The Composable Architecture (TCA) is a Redux-style, unidirectional-data-flow library popular with SwiftUI", correct: true },
      { text: "TCA centers on State, Action, Reducer, and a Store", correct: true },
      { text: "Clean Architecture requires all outer layers to be imported by the domain layer", correct: false },
    ],
    explanation: "Clean Architecture's dependency rule points inward — the domain/use-case core knows nothing about outer layers (UI, frameworks). TCA (point-free) is a unidirectional State/Action/Reducer/Store approach that pairs well with SwiftUI.",
  },
  {
    id: "arch-6", topic: "architecture",
    prompt: "How should you choose an architecture for a project?",
    options: [
      { text: "Match complexity to the app — heavier patterns (VIPER) for large teams/apps, lighter (MVC/MVVM) for smaller ones", correct: true },
      { text: "Favor consistency across the codebase and team familiarity", correct: true },
      { text: "Optimize for testability and clear boundaries between layers", correct: true },
      { text: "Always pick the newest/most complex architecture regardless of project size", correct: false },
    ],
    explanation: "There's no universally 'best' architecture — choose based on app size, team familiarity, testability needs, and consistency. Over-engineering a small app with a heavy architecture adds cost without benefit.",
  },

  /* ------------------------------------------------------- COMBINE / REACTIVE */
  {
    id: "cmb-1", topic: "combine",
    prompt: "Which statements about the core Combine types are correct?",
    options: [
      { text: "A `Publisher` emits a stream of values over time and can complete or fail", correct: true },
      { text: "A `Subscriber` receives values and controls demand from the publisher", correct: true },
      { text: "`Operator`s are publishers that transform values from an upstream publisher", correct: true },
      { text: "A publisher can never emit an error, only values", correct: false },
    ],
    explanation: "Combine models async events as Publisher → (Operators) → Subscriber. A publisher emits zero or more values, then either finishes or fails with an `Error` (unless its `Failure` type is `Never`). Operators are themselves publishers that wrap an upstream.",
  },
  {
    id: "cmb-2", topic: "combine",
    prompt: "Which are true about `sink`, `assign`, and `AnyCancellable`?",
    options: [
      { text: "`sink` subscribes with closures for received values and completion", correct: true },
      { text: "`assign(to:on:)` writes emitted values directly to a property via key path", correct: true },
      { text: "Both return an `AnyCancellable` you must retain or the subscription is cancelled", correct: true },
      { text: "A subscription stays alive even if its `AnyCancellable` is deallocated", correct: false },
    ],
    explanation: "`sink` and `assign` create subscriptions returning `AnyCancellable`. If you don't store it (e.g. in a `Set<AnyCancellable>`), it deallocates and cancels the subscription immediately — a very common Combine bug.",
  },
  {
    id: "cmb-3", topic: "combine",
    prompt: "Which describe Combine subjects correctly?",
    options: [
      { text: "`PassthroughSubject` has no initial value and only forwards values sent after subscription", correct: true },
      { text: "`CurrentValueSubject` holds a current value and emits it immediately to new subscribers", correct: true },
      { text: "You imperatively emit values with `subject.send(_:)`", correct: true },
      { text: "`PassthroughSubject` replays its last value to late subscribers", correct: false },
    ],
    explanation: "Subjects let you imperatively bridge non-Combine code into a pipeline via `send`. `CurrentValueSubject` stores and replays its latest value; `PassthroughSubject` does not — late subscribers only see subsequent emissions.",
  },
  {
    id: "cmb-4", topic: "combine",
    prompt: "Match the Combine operator to what it does:",
    options: [
      { text: "`map` → transform each value synchronously", correct: true },
      { text: "`flatMap` → replace each value with a new publisher and flatten the results", correct: true },
      { text: "`combineLatest` → emit a combined tuple whenever any source publisher emits", correct: true },
      { text: "`debounce` → emit every value immediately with no delay", correct: false },
    ],
    explanation: "`map` transforms values, `flatMap` swaps in and flattens inner publishers, `combineLatest` merges the latest values of multiple publishers. `debounce` does the opposite of the false option — it waits for a pause in emissions before forwarding the latest value (great for search fields).",
  },
  {
    id: "cmb-5", topic: "combine",
    prompt: "Which statements about scheduling with `receive(on:)` and `subscribe(on:)` are correct?",
    options: [
      { text: "`receive(on:)` controls the scheduler where downstream (e.g. sink/UI) receives values", correct: true },
      { text: "Use `receive(on: DispatchQueue.main)` before updating UI from a background publisher", correct: true },
      { text: "`subscribe(on:)` affects where the subscription/upstream work is performed", correct: true },
      { text: "`receive(on:)` and `subscribe(on:)` are interchangeable and always equivalent", correct: false },
    ],
    explanation: "`subscribe(on:)` sets where upstream setup/work runs; `receive(on:)` sets where downstream values are delivered. They serve different purposes — hop to the main queue with `receive(on:)` before touching UI.",
  },
  {
    id: "cmb-6", topic: "combine",
    prompt: "Which are true about `@Published` and error handling in Combine?",
    options: [
      { text: "`@Published` synthesizes a publisher accessible via the `$` projected value", correct: true },
      { text: "A `@Published` publisher's `Failure` type is `Never` (it cannot fail)", correct: true },
      { text: "`catch` lets you replace a failing upstream with another publisher", correct: true },
      { text: "Once a publisher fails, it keeps emitting new values afterward", correct: false },
    ],
    explanation: "`@Published` exposes a `Never`-failing publisher through `$property`. Failure is terminal — after a `.failure` completion no more values arrive — so you recover with operators like `catch`, `retry`, or `replaceError`.",
  },
  {
    id: "cmb-7", topic: "combine",
    prompt: "How do Combine and Swift Concurrency (async/await) relate?",
    options: [
      { text: "Both handle asynchronous work, but Combine is declarative/stream-based while async/await is imperative", correct: true },
      { text: "A publisher's `.values` property exposes it as an `AsyncSequence`", correct: true },
      { text: "Combine excels at continuous streams and complex event composition (debounce, combineLatest)", correct: true },
      { text: "Apple has deprecated Combine, so it can no longer be used", correct: false },
    ],
    explanation: "Combine and async/await coexist: you can bridge a publisher into `for await` via `.values`. Combine shines for ongoing UI event streams and operator composition; async/await is often cleaner for one-shot tasks. Combine is not deprecated.",
  },
];
