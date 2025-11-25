# `luisguilher.me`

### *An interactive, VS Code–powered portfolio. Built with systems thinking, physics-driven design, and stupidly high standards.*

<p align="center">
  <img src="https://raw.githubusercontent.com/lguibr/luisguilher.me/main/public/favicon.png" width="180" />
</p>

<p align="center">
  <strong>Live:</strong> https://luisguilher.me  
</p>

<p align="center">
  <a href="https://vercel.com"> <img src="https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel" /> </a>
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Monaco_Editor-embedded-blue?logo=visual-studio-code" />
</p>

---

# 🌌 Overview

**`luisguilher.me`** is my personal playground:
a fully interactive, VS Code–like environment where you can explore my resume, open files, read code, view diagrams, inspect repositories, and even print a professional CV using **Ctrl+P**.

It’s not “a portfolio”.
It's a **miniature IDE**, wired with real state management, real tree views, real code rendering, real diffing, and internal architecture designed like a production system.

This repo is a mix of:

* ⚡ Systems engineering
* 🎨 UI architecture
* 🧠 Developer experience design
* 🔍 Observability + deterministic behavior
* ⚙️ Physics-driven thinking applied to front-end

---

# 🧭 Quick Navigation

* **[Live App](https://luisguilher.me)**
* **[Curriculum (Ctrl + P inside the app)](public/cv.pdf)**
* **[My GitHub](https://github.com/lguibr)**

---

# 🔥 Core Idea

*A portfolio that behaves like real software.*
Everything inside the site simulates **how I think**, **how I design systems**, and **how I write code**.

---

# 🖥️ Architecture (High-Level)

```mermaid
flowchart TD
    A["User visits luisguilher.me"] --> B["Next.js App Shell"]
    B --> C["IDE UI Layer"]
    C --> D["Tree of Files"]
    C --> E["Binary Tree of Views"]
    C --> F["Monaco Editor Instance"]
    F --> G["Markdown Renderer + Mermaid"]
    C --> H["Interactive Canvas Engine (p5.js)"]
    C --> I["Repositories Fetcher"]
    I --> J["GitHub API"]

    D <---> E
    E <---> F
```

**Design Principles**

* Deterministic UIs
* Stateful, reversible actions
* Tree-based architectures (like real editors)
* Zero magic — everything explicit

---

# 🗂️ Editor Internals

## **File Tree (Domain Data + Repo Fusion)**

```mermaid
mindmap
  root((FileContext))
    Static Files
      resume.md
      projects.md
      skills.json
    Local App Code
      /src
      /components
      /reducers
    External Repos
      /repositories
        fetched from GitHub API
```

---

## **Binary Tree of Views**

Your split-pane layout is stored as a **binary tree**, just like VS Code.

```mermaid
graph TD
    A[Root Pane]
    A --> B[Left Pane]
    A --> C[Right Pane]
    B --> D[file: README.md]
    C --> E[file: projects.md]
    C --> F[file: timing/src/index.ts]
```

---

# ✨ Features

### 🧩 VS Code–Inspired Interface

Everything feels familiar: explorer, tabs, editor, markdown preview, diff viewer.

### 🧭 Interactive Onboarding Tour

Guides users through the environment step-by-step.

### 🛠️ Self-Hosted Source Code Viewer

Like opening a project folder inside VS Code.

### 📁 GitHub Repositories Browser

Your public repos appear as folders inside the app — fully browsable.

### 🔍 Global Text Search

Search through open files or modified buffers.

### 🧬 Diff Mode (Source Control Tab)

Compare file content with the original version.

### 📝 Markdown Preview (with Mermaid)

Full diagram rendering, live toggling between raw/editor.

### 🎨 Canvas Sketch Engine

p5.js-powered animations tied to IDE interactions.

### 🖨️ Print-Ready CV

Generated via `Ctrl + P` with layout optimized for recruiters.

### 🎛️ Theme Toggle

`Ctrl + Q` → Light/Dark

---

# 🧪 Stack

* **Next.js 14**
* **React 18**
* **TypeScript**
* **Monaco Editor**
* **p5.js**
* **Styled Components**
* **Mermaid**
* **React Resizable Panels**
* **Reactour**
* **Vercel (Edge deploy)**

---

# 🏗️ Project Structure (Clean Overview)

```bash
luisguilher.me/
├── public/              # Static assets
├── src/
│   ├── assets/          # Resume, projects, skillsets
│   ├── components/      # UI components
│   ├── contexts/        # File tree, views, theme, loading...
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Next.js routes
│   ├── reducers/        # State reducers
│   ├── services/        # API integrations
│   └── styles/          # Themes, global styles
└── ...
```

---

# 🧠 Why This Exists

I wanted a portfolio that **shows**, not “tells”.

Instead of a static page saying “I like TypeScript”,
you actually interact with a **real TypeScript environment**.

Instead of a PDF saying “I do system design”,
you see system-level structures inside the app.

Instead of reading “I think like an engineer”,
you walk inside my mental model.

---

# 🚦 Local Development

```bash
git clone https://github.com/lguibr/luisguilher.me
cd luisguilher.me
yarn install
yarn dev
```

Visit `http://localhost:3000`.

---

# ⌨️ Shortcuts

* Toggle theme → **Ctrl + Q**
* Print CV → **Ctrl + P**
* Restart tour → **Ctrl + Shift + 2**
* Flash loading animation → **Ctrl + Space**
* Toggle Markdown editor → *Double-click markdown preview*

---

# 🤝 Contributing

Open a PR.
I care about code clarity and deterministic behavior — lint before committing:

```bash
yarn lint
```

---

# 📄 License

MIT — feel free to fork, remix, or learn from the architecture.

---

# 🛸 Final Note

Thanks for visiting.
Explore the code. Break it. Improve it.
The whole point of this project is **experimentation**.
