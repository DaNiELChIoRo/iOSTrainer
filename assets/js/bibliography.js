/**
 * Curated review resources per topic.
 * Shown on the results screen for any topic the user scored weakly on.
 * Sources: Kodeco (formerly Ray Wenderlich), Hacking with Swift, Apple Docs.
 */
window.BIBLIOGRAPHY = {
  swift: [
    { title: "The Swift Programming Language (official book)", source: "Apple Docs", url: "https://docs.swift.org/swift-book/" },
    { title: "What's new in Swift (June 2026 / Swift 6.4)", source: "Swift.org", url: "https://www.swift.org/blog/whats-new-in-swift-june-2026/" },
    { title: "Swift 6.4: What's new in concurrency", source: "SwiftLee", url: "https://www.avanderlee.com/concurrency/swift-6-4-whats-new-in-concurrency/" },
    { title: "Optionals in Swift explained", source: "SwiftLee", url: "https://www.avanderlee.com/swift/optionals-in-swift/" },
    { title: "Generics in Swift explained", source: "SwiftLee", url: "https://www.avanderlee.com/swift/generics/" },
    { title: "Enumerations in Swift explained", source: "SwiftLee", url: "https://www.avanderlee.com/swift/enumerations/" },
    { title: "Swift knowledge & language basics", source: "Hacking with Swift", url: "https://www.hackingwithswift.com/read" },
    { title: "Advanced Swift (book)", source: "objc.io", url: "https://www.objc.io/books/advanced-swift/" },
    { title: "Swift & Objective-C interoperability (bridging)", source: "Apple Docs", url: "https://developer.apple.com/documentation/swift/imported-c-and-objective-c-apis" },
  ],
  generics: [
    { title: "Generics — The Swift Programming Language", source: "Apple Docs", url: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/generics/" },
    { title: "Generics in Swift explained", source: "SwiftLee", url: "https://www.avanderlee.com/swift/generics/" },
    { title: "Opaque and boxed protocol types (some vs any)", source: "Apple Docs", url: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/opaquetypes/" },
    { title: "What are generics?", source: "Hacking with Swift", url: "https://www.hackingwithswift.com/quick-start/understanding-swift/what-are-generics" },
  ],
  optionals: [
    { title: "Optional Chaining & Optionals", source: "Apple Docs", url: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/optionalchaining/" },
    { title: "Optionals in Swift explained", source: "SwiftLee", url: "https://www.avanderlee.com/swift/optionals-in-swift/" },
    { title: "How to unwrap an optional in Swift", source: "Hacking with Swift", url: "https://www.hackingwithswift.com/example-code/language/how-to-unwrap-an-optional-in-swift" },
  ],
  memory: [
    { title: "ARC & Memory Management in Swift", source: "Apple Docs", url: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/" },
    { title: "Weak self and reference cycles explained", source: "SwiftLee", url: "https://www.avanderlee.com/swift/weak-self/" },
    { title: "How to avoid strong reference cycles", source: "Hacking with Swift", url: "https://www.hackingwithswift.com/example-code/language/how-to-avoid-strong-reference-cycles-when-using-closures" },
    { title: "Memory management with ARC", source: "Kodeco", url: "https://www.kodeco.com/966538-arc-and-memory-management-in-swift" },
  ],
  layout: [
    { title: "Auto Layout Guide", source: "Apple Docs", url: "https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/index.html" },
    { title: "Content hugging & compression resistance", source: "Hacking with Swift", url: "https://www.hackingwithswift.com/example-code/uikit/what-is-the-difference-between-content-hugging-and-compression-resistance" },
    { title: "Auto Layout by tutorials", source: "Kodeco", url: "https://www.kodeco.com/books/auto-layout-by-tutorials" },
  ],
  swiftui: [
    { title: "SwiftUI State & Data Flow", source: "Apple Docs", url: "https://developer.apple.com/documentation/swiftui/state-and-data-flow" },
    { title: "@StateObject vs @ObservedObject differences", source: "SwiftLee", url: "https://www.avanderlee.com/swiftui/stateobject-observedobject-differences/" },
    { title: "Property wrappers in Swift", source: "SwiftLee", url: "https://www.avanderlee.com/swift/property-wrappers/" },
    { title: "100 Days of SwiftUI", source: "Hacking with Swift", url: "https://www.hackingwithswift.com/100/swiftui" },
    { title: "Thinking in SwiftUI (book)", source: "objc.io", url: "https://www.objc.io/books/thinking-in-swiftui/" },
    { title: "SwiftUI by tutorials", source: "Kodeco", url: "https://www.kodeco.com/books/swiftui-by-tutorials" },
  ],
  swiftdata: [
    { title: "SwiftData framework reference", source: "Apple Docs", url: "https://developer.apple.com/documentation/swiftdata" },
    { title: "How to use SwiftData", source: "Hacking with Swift", url: "https://www.hackingwithswift.com/quick-start/swiftdata" },
    { title: "SwiftData by tutorials", source: "Kodeco", url: "https://www.kodeco.com/books/swiftdata-by-tutorials" },
  ],
  coredata: [
    { title: "Core Data framework reference", source: "Apple Docs", url: "https://developer.apple.com/documentation/coredata" },
    { title: "How to use Core Data", source: "Hacking with Swift", url: "https://www.hackingwithswift.com/read/38/overview" },
    { title: "Core Data by tutorials", source: "Kodeco", url: "https://www.kodeco.com/books/core-data-by-tutorials" },
  ],
  concurrency: [
    { title: "Swift Concurrency (async/await, actors)", source: "Apple Docs", url: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/" },
    { title: "What is async/await in Swift?", source: "Hacking with Swift", url: "https://www.hackingwithswift.com/quick-start/concurrency" },
    { title: "Tasks in Swift explained", source: "SwiftLee", url: "https://www.avanderlee.com/concurrency/tasks/" },
    { title: "Actors in Swift: how to use and prevent data races", source: "SwiftLee", url: "https://www.avanderlee.com/concurrency/actors/" },
    { title: "Concurrent vs Serial DispatchQueue (GCD)", source: "SwiftLee", url: "https://www.avanderlee.com/swift/concurrent-serial-dispatchqueue/" },
    { title: "Dispatch (Grand Central Dispatch) reference", source: "Apple Docs", url: "https://developer.apple.com/documentation/dispatch" },
    { title: "Modern concurrency in Swift", source: "Kodeco", url: "https://www.kodeco.com/books/modern-concurrency-in-swift" },
  ],
  combine: [
    { title: "Combine framework reference", source: "Apple Docs", url: "https://developer.apple.com/documentation/combine" },
    { title: "Getting started with the Combine framework", source: "SwiftLee", url: "https://www.avanderlee.com/swift/combine/" },
    { title: "Creating a custom Combine publisher", source: "SwiftLee", url: "https://www.avanderlee.com/swift/custom-combine-publisher/" },
    { title: "Introduction to Combine", source: "Hacking with Swift", url: "https://www.hackingwithswift.com/books/ios-swiftui/adding-combine-publishers-to-a-swiftui-view" },
    { title: "Combine: Asynchronous Programming with Swift", source: "Kodeco", url: "https://www.kodeco.com/books/combine-asynchronous-programming-with-swift" },
  ],
  objc: [
    { title: "Programming with Objective-C", source: "Apple Docs", url: "https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html" },
    { title: "Objective-C Runtime reference", source: "Apple Docs", url: "https://developer.apple.com/documentation/objectivec/objective-c_runtime" },
    { title: "Method Swizzling", source: "NSHipster", url: "https://nshipster.com/method-swizzling/" },
    { title: "Associated Objects", source: "NSHipster", url: "https://nshipster.com/associated-objects/" },
  ],
  libraries: [
    { title: "Swift Package Manager", source: "Apple Docs", url: "https://developer.apple.com/documentation/xcode/swift-packages" },
    { title: "Alamofire (elegant HTTP networking)", source: "GitHub", url: "https://github.com/Alamofire/Alamofire" },
    { title: "URLSession — first-party networking", source: "Apple Docs", url: "https://developer.apple.com/documentation/foundation/urlsession" },
    { title: "Encoding and decoding with Codable", source: "Hacking with Swift", url: "https://www.hackingwithswift.com/quick-start/swiftui/how-to-load-and-parse-json" },
    { title: "Dependency Injection in Swift", source: "SwiftLee", url: "https://www.avanderlee.com/swift/dependency-injection/" },
  ],
  patterns: [
    { title: "Design Patterns by Tutorials", source: "Kodeco", url: "https://www.kodeco.com/books/design-patterns-by-tutorials" },
    { title: "Cocoa Design Patterns (MVC, delegation, KVO…)", source: "Apple Docs", url: "https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/" },
    { title: "The Coordinator pattern in iOS", source: "Hacking with Swift", url: "https://www.hackingwithswift.com/articles/71/how-to-use-the-coordinator-pattern-in-ios-apps" },
  ],
  architecture: [
    { title: "MVVM by Tutorials / iOS architecture", source: "Kodeco", url: "https://www.kodeco.com/34-design-patterns-by-tutorials-mvvm" },
    { title: "iOS Architecture Patterns (MVC, MVVM, VIPER)", source: "Hacking with Swift", url: "https://www.hackingwithswift.com/articles/113/how-to-use-the-mvvm-design-pattern-in-swift" },
    { title: "The Composable Architecture (TCA)", source: "GitHub", url: "https://github.com/pointfreeco/swift-composable-architecture" },
    { title: "App Architecture (book)", source: "objc.io", url: "https://www.objc.io/books/app-architecture/" },
    { title: "Dependency Injection to decouple layers", source: "SwiftLee", url: "https://www.avanderlee.com/swift/dependency-injection/" },
  ],
};
