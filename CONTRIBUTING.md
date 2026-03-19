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

DisChord's architecture is divided into three main stages:
- **Lexer** (`src/chord/lexer.ts`): Tokenizing text into Chord tokens.
- **Parser** (`src/dischord/Parser/parser.ts`): Reconstructing the AST (Abstract Syntax Tree).
- **Generator** (`src/dischord/generator.ts`): Converting AST nodes into standard JavaScript.

When proposing a new syntax/keyword, ensure it follows our **Natural Operator** philosophy: **Words over symbols where possible**.

---

## Contribution Checklist

Before submitting a Pull Request, please ensure:

- Your code follows existing formatting and style.
- You've added examples in the `examples/` directory illustrating the new feature.
- Your code builds successfully (`npm run build`).
- Documentation (like `README.md` or comments) has been updated if applicable.

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
