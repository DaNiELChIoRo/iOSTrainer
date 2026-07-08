# 📱 iOS Trainer

A zero-dependency web app that quizzes iOS engineers with **multiple-answer** questions and, based on your score, suggests exactly which topics to review — linking to **Kodeco (Ray Wenderlich)**, **Hacking with Swift**, and the **official Apple documentation**.

## Topics covered

| Topic | What it tests |
|-------|---------------|
| 🦅 Swift Language | value/reference types, optionals, generics, protocols, bridging/interop, **Swift 6.4** additions |
| 🧠 Memory Management | ARC, retain cycles, `weak`/`unowned`, capture lists, `autoreleasepool` |
| 📐 Layout | Auto Layout, intrinsic content size, hugging/compression, SwiftUI layout |
| 🎨 SwiftUI | `@State`/`@Binding`/`@StateObject`, view identity, `@Observable` |
| 🗃️ SwiftData | `@Model`, `ModelContainer`, `@Query`, `ModelContext` |
| 💾 Core Data | contexts, `NSPersistentContainer`, faulting, background work |
| ⚡ Concurrency | `async`/`await`, actors, `@MainActor`, `Sendable`, task groups, **GCD / DispatchGroup** |
| 📦 Third-Party Libs | Alamofire vs URLSession, image loading, Realm, SPM/CocoaPods/Carthage |
| ♟️ Design Patterns | creational/structural/behavioral; delegate, observer, singleton, coordinator |
| 🏛️ Architecture | MVC, MVVM, VIPER, Clean Architecture, TCA |

> **Swift 6.4 coverage** (WWDC 2026): `anyAppleOS`, async `defer` (SE-0493), the `Iterable` protocol, `@C` export, `@diagnose`, task cancellation shields, and the unused-throwing-`Task` warning.

## Features

- **Multiple-answer questions** — the UI auto-detects "select one" vs. "select all that apply" from the answer key.
- **Instant feedback** with an explanation after each question.
- **Per-topic breakdown** on the results screen.
- **Smart review suggestions** — any topic under 70% gets curated links to review.
- **Best-score tracking** and **light/dark theme**, both saved in `localStorage`.
- **No build step, no dependencies** — plain HTML/CSS/JS.

## Run locally

Because it's static, just open `index.html`, or serve it (recommended so paths behave exactly like on GitHub Pages):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo.
2. **Settings → Pages → Build and deployment → Source: _Deploy from a branch_.**
3. Choose branch `main` and folder `/ (root)`, then **Save**.
4. Your quiz goes live at `https://<user>.github.io/<repo>/`.

The included `.nojekyll` file tells Pages to serve the files as-is.

## Add or edit questions

Everything lives in plain data files — no framework knowledge needed:

- **`assets/js/questions.js`** — the question bank. Each entry:
  ```js
  {
    id: "mem-6",
    topic: "memory",                 // key from QUIZ_TOPICS
    prompt: "Your question?",
    options: [
      { text: "An answer", correct: true },
      { text: "Another",   correct: false },
    ],
    explanation: "Why the right answers are right.",
  }
  ```
  A question becomes **multiple-answer** automatically when more than one option is `correct: true`.
- **`assets/js/bibliography.js`** — the review links shown per topic.

## Project structure

```
index.html
.nojekyll
assets/
  css/styles.css        # all styling + theming
  js/questions.js       # topics + question bank
  js/bibliography.js    # review resources per topic
  js/app.js             # quiz engine (setup → quiz → results)
```
