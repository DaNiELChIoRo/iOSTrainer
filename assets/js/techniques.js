/**
 * Advanced / "hacker" techniques — a REFERENCE section, not a quiz.
 * Educational overview of Objective-C runtime, debugging, and reverse-engineering
 * techniques used in advanced iOS engineering, app diagnostics, and (authorized)
 * security research. Intended for learning, debugging, and defensive work.
 */
window.HACKER_TECHNIQUES = {
  disclaimer:
    "For education, debugging, and authorized security research only. Runtime manipulation and reverse-engineering should only be applied to software you own or are explicitly permitted to test. Several of these techniques are also what attackers use — understanding them is key to defending against them.",

  groups: [
    {
      title: "Objective-C runtime",
      items: [
        {
          name: "Method Swizzling",
          level: "Advanced",
          what: "Swap two methods' implementations (IMPs) at runtime via the Objective-C runtime, so calling one executes the other. Typically done in `+load`/`dispatch_once` with `method_exchangeImplementations`.",
          why: "Inject cross-cutting behavior (logging, analytics, crash breadcrumbs, UI theming) into methods you don't own — and, on the offensive side, to intercept or tamper with app behavior. Fragile: it's global to every instance and sensitive to load order.",
          links: [
            { title: "Method Swizzling", source: "NSHipster", url: "https://nshipster.com/method-swizzling/" },
            { title: "Objective-C Runtime", source: "Apple Docs", url: "https://developer.apple.com/documentation/objectivec/objective-c_runtime" },
          ],
        },
        {
          name: "Associated Objects",
          level: "Advanced",
          what: "Attach arbitrary key-value data to an existing object at runtime with `objc_setAssociatedObject` / `objc_getAssociatedObject` — the standard way to 'add a stored property' from a category.",
          why: "Extend classes you can't subclass (framework classes) with extra state, or carry context alongside objects. Also used to smuggle state into swizzled methods.",
          links: [
            { title: "Associated Objects", source: "NSHipster", url: "https://nshipster.com/associated-objects/" },
          ],
        },
        {
          name: "Runtime Introspection",
          level: "Advanced",
          what: "Enumerate classes, methods, ivars, and properties at runtime (`class_copyMethodList`, `class_copyIvarList`, type encodings). `class-dump` reconstructs header interfaces from a compiled binary.",
          why: "Understand private/undocumented APIs, build diagnostics, or reverse-engineer how an app is structured. A staple of both tooling authors and researchers.",
          links: [
            { title: "Type Encodings", source: "NSHipster", url: "https://nshipster.com/type-encodings/" },
            { title: "class-dump", source: "GitHub", url: "https://github.com/nygard/class-dump" },
          ],
        },
        {
          name: "isa-swizzling & KVO internals",
          level: "Expert",
          what: "How Key-Value Observing works under the hood: the runtime dynamically creates a subclass and rewrites the object's `isa` pointer so overridden setters emit change notifications.",
          why: "Explains 'magic' behavior, subtle bugs when mixing KVO with swizzling, and is a technique for transparently intercepting instances without swizzling the whole class.",
          links: [
            { title: "Swift & the Objective-C Runtime", source: "NSHipster", url: "https://nshipster.com/swift-objc-runtime/" },
          ],
        },
      ],
    },
    {
      title: "Debugging & dynamic analysis",
      items: [
        {
          name: "Advanced LLDB",
          level: "Advanced",
          what: "Beyond breakpoints: `expression` to mutate live state, `po`/`v` to inspect objects, symbolic & conditional breakpoints, `image lookup`, `memory read`, and custom Python breakpoint actions.",
          why: "Diagnose issues without recompiling, poke at private state, and understand third-party behavior. The most legitimate, everyday 'hacker' skill.",
          links: [
            { title: "LLDB Tutorial", source: "LLVM", url: "https://lldb.llvm.org/use/tutorial.html" },
          ],
        },
        {
          name: "Dynamic loading (dlopen/dlsym)",
          level: "Expert",
          what: "Load libraries and resolve symbols at runtime with `dlopen`/`dlsym`, and inspect symbol tables. Related: interposing/fishhook to rebind C function pointers.",
          why: "Access optional frameworks, build plugins, or hook C functions for instrumentation. Also how injected code gains a foothold — hence relevant to hardening.",
          links: [
            { title: "Objective-C Runtime", source: "Apple Docs", url: "https://developer.apple.com/documentation/objectivec/objective-c_runtime" },
          ],
        },
        {
          name: "Dynamic instrumentation (Frida)",
          level: "Expert",
          what: "Attach to a running process and hook/replace functions and Objective-C methods on the fly with JavaScript, trace calls, and dump arguments — without modifying the binary on disk.",
          why: "Powerful for security research, black-box testing, and understanding app behavior. Requires a jailbroken device or a re-signed app; use only on targets you're authorized to test.",
          links: [
            { title: "Frida on iOS", source: "Frida", url: "https://frida.re/docs/ios/" },
          ],
        },
      ],
    },
    {
      title: "Binary analysis & defense",
      items: [
        {
          name: "Mach-O & static analysis",
          level: "Expert",
          what: "Inspect the Mach-O binary format: load commands, segments, symbol tables, and encryption. Tools: `otool`, `nm`, `class-dump`, and disassemblers like Hopper/Ghidra.",
          why: "Reverse-engineer logic, find hardcoded secrets, or audit your own app's exposure. Understanding this is essential to knowing what an attacker can recover from your shipped binary.",
          links: [
            { title: "class-dump", source: "GitHub", url: "https://github.com/nygard/class-dump" },
          ],
        },
        {
          name: "Jailbreak detection & anti-tampering",
          level: "Defensive",
          what: "Detect a compromised runtime (suspicious files/paths, `fork()` success, dyld image checks), verify code signatures, detect debuggers (`ptrace`/`sysctl`), and obfuscate sensitive logic.",
          why: "The defensive counterpart to everything above. No check is unbeatable, but layered detection raises the cost for attackers using swizzling, Frida, or patched binaries.",
          links: [
            { title: "iOS Security", source: "Apple Docs", url: "https://support.apple.com/guide/security/welcome/web" },
          ],
        },
      ],
    },
  ],
};
