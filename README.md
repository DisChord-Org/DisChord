# DisChord

**Experimental Natural-Syntax Programming Language Transpiler**

DisChord is a modern, intuitive, and human-friendly programming language designed to bridge the gap between human language and machine code. By replacing cold, symbolic operators with natural word-based keywords, DisChord offers a readable and expressive syntax that feels as natural as writing a sentence.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Version](https://img.shields.io/badge/Version-0.4.1-green.svg)](package.json)

---

## Features

- **Natural Operators**: Use `mas`, `menos`, `por`, and `entre` instead of `+`, `-`, `*`, and `/`.
- **Expressive Logic**: Write logical conditions using `y`, `o`, `no`, `igual`, `mayor`, and `menor`.
- **Human-Readable Flow**: Control program execution with `si`, `sino`, `para`, and `funcion`.
- **Zero-Config Transpilation**: Compiles directly to standard JavaScript (ES Modules).
- **Lightweight & Fast**: A minimalist lexer and parser architecture.

---

## Quick Start

### Installation

Clone the repository and install dependencies using `pnpm`:

```bash
git clone https://github.com/your-username/DisChord.git
cd DisChord
pnpm install
```

### Writing Your First `.chord` File

Create a file named `hello.chord`:

```js
// Define variables with 'var' and 'es'
var nombre es "Mundo"

// Use natural arithmetic
var a es 10
var b es 5
var total es a mas b

/*
   Print to console using 'consola.imprimir'
   Concatenate with 'mas'
*/
consola.imprimir("¡Hola " mas nombre mas "!")
consola.imprimir("La suma de " mas a mas " mas " mas b mas " es " mas total)

// Boolean logic
si (total mayor 10) {
    consola.imprimir("El total es mayor a 10")
} sino {
    consola.imprimir("El total es pequeño")
}
```

### Running the Code

```bash
npm run dev hello.chord
```

This will compile `hello.chord` to `dist/hello.mjs` and execute it automatically.

## Built for Discord Bots

DisChord isn't just a general-purpose language; it's specifically optimized for building powerful Discord bots with almost zero boilerplate. Using the internal **Seyfert** integration, you can define commands and events using natural Spanish keywords.

### Example: A Simple Ping Command

```js
encender bot {
    token "TU_TOKEN_AQUÍ"
    prefijo "!"
    intenciones [ "MensajesDelServidor", "ContenidoDelMensaje" ]
}

crear comando ping {
    descripcion: "¡Prueba la latencia del bot!"
    
    consola.imprimir("Ejecutando ping...")
    
    var pingMensaje es "¡Pong " mas cliente.ping mas "ms!"
    crear mensaje {
        contenido: "¡Pong!"
    }
}

evento entradaMiembro {
    consola.imprimir("¡Un nuevo usuario ha entrado!")
}
```

---

## Syntax Overview

### Primitives & Variables

| Type | Syntax Example |
| :--- | :--- |
| **Number** | `var n es 42` |
| **Text** | `var t es "Hola"` |
| **Boolean** | `var b es verdadero` |
| **Undefined** | `var u es indefinido` |

### Natural Operators

| Symbolic | Natural Keyword |
| :--- | :--- |
| `+` | `mas` |
| `-` | `menos` |
| `*` | `por` |
| `/` | `entre` |
| `**` | `exp` |
| `%` | `resto` |

### Discord Specific Keywords

- **encender bot**: Initializes the bot client with token and intents.
- **crear comando**: Defines a new slash or prefix command.
- **crear mensaje**: Sends a message to the current channel or interaction.
- **evento**: Listens to Discord gateway events (e.g., `entradaMiembro`, `mensajeCreado`).
- **crear mensaje { embed { ... } }**: (Internal) High-level construct for Discord Embeds.

---

## Project Structure

- `src/chord/`: Core language components (Base Lexer, Types).
- `src/dischord/`: Discord-specific Parser extension and Code Generator.
- `src/chord/parser.ts`: The main recursive descent parser.
- `examples/`: Code samples for both generic logic and Discord bots.
- `dist/`: Output directory for transpiled `.mjs` files.

---

## License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Whether it's adding a new natural language keyword or improving the Discord integration, check our [Contributing Guidelines](CONTRIBUTING.md).