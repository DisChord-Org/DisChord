# Contributing to DisChord

Thank you for your interest in contributing to **DisChord**! We're excited to see what you'll bring to this project. This system is designed to be accessible and intuitive, and we value contributions that align with those goals.

---

## Getting Started

1. **Fork the Repository**: Create a personal fork on GitHub.
2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/your-username/DisChord.git
   ```
3. **Install Dependencies**:
   ```bash
   pnpm install
   ```
4. **Create a Local Feature Branch**:
   ```bash
   git checkout -b feature/awesome-new-syntax
   ```

---

## How to Contribute

### Adding Language Features

DisChord is two layers, and each one goes through the same stages:
- **Chord** (`src/chord/`): the base language. **Dischord** (`src/dischord/`): the Discord layer on top of it. A feature that has nothing to do with Discord belongs in Chord.
- **Lexer** (`src/chord/Lexer.ts`): turns text into tokens.
- **Parser** (`src/chord/Parser/`, and `src/dischord/Parser/` for the Discord syntax): builds the AST (Abstract Syntax Tree). Each construct has its own parser under `Grammar/`.
- **Analyzer** (`src/chord/Analyzer/`, `src/dischord/Analyzer/`): a list of rules that validate the AST and decide what the generator needs to know. Errors belong here.
- **Generator** (`src/chord/Generator/`, `src/dischord/Generator/`): turns AST nodes into standard JavaScript, one visitor per node type. It translates what the analyzer decided; it does not decide.
- **Core library** (`src/chord/corelib/`, `src/dischord/corelib/`): the classes, functions and runtime helpers the language offers, as data.

The Discord layer only translates to Seyfert calls: it keeps no logic of its own at run time beyond the shared helper modules.

When proposing a new syntax/keyword, ensure it follows our **Natural Operator** philosophy: **Words over symbols where possible**.

---

## Contribution Checklist

Before submitting a Pull Request, please ensure:

- Your code follows existing formatting and style.
- Your commit messages are one line, in English, and start with `add:`, `modify:`, `fix:`, `refactor:` or `delete:`. `pnpm install` installs a `commit-msg` hook (`scripts/prepare.js`) that rejects any other message.
- You've added a test under `tester/tests/` covering the new feature: a folder with an `input.chord` and its `expected.js` and `expected.ast.json`, or a test class that checks an error or a behavior. Review the diff of any snapshot you regenerate: it should change only what you meant to. `pnpm test:update` regenerates the snapshots of every test, so use it only for a change that is meant to alter the generated output, and read the whole diff afterwards: a refactor must never need it.
- `pnpm typecheck` (`tsc --noEmit`) reports no errors and `pnpm test` passes.
- Documentation (like `README.md` or comments) has been updated if applicable.
- No file you touched goes over the length limits (see [Keeping Files Short](#keeping-files-short)).

---

## Keeping Files Short

Source files under `src/` are kept short, and `tester/tests/Structure/FileLength` enforces it:

- **From 300 lines** the test prints a `[WARNING]` for the file. It does not fail: either justify the length or split the file.
- **From 400 lines** the test fails. Split the file by responsibility (not by moving lines around).
- **The one exception** is the class schemas of the core library (`corelib/classes/` in `src/chord` and `src/dischord`): each class lives in a single file however many methods it has, because they are tables of data and splitting one by line count only scatters its methods. Everything else is split.

---

## Submitting a Pull Request

1. Push your changes to your fork.
2. Submit a Pull Request targeting the `main` branch.
3. Provide a clear description of the problem solved or feature added.
4. Reference any relevant issue Numbers.

---

## Code of Conduct

We are committed to creating a welcoming and inclusive community. Please be respectful of others' ideas and contributions.

## License

By contributing to DisChord, you agree that your contributions will be licensed under the project's **ISC License**.
