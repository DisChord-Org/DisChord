# DisChord

**Experimental Natural-Syntax Programming Language Transpiler**

DisChord is a programming language that replaces symbolic operators with natural, Spanish word-based keywords, and compiles to standard JavaScript. On top of the base language (`chord`) it has a layer for Discord bots (`dischord`) that translates to [Seyfert](https://github.com/tiramisulabs/seyfert).

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Version](https://img.shields.io/badge/Version-1.7.0-green.svg)](package.json)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/DisChord-Org/DisChord)

---

## Features

- **Natural operators and logic:** `mas`, `menos`, `por`, `entre`, `y`, `o`, `no`, `igual`, `mayor`, `menor`.
- **Optional static types:** annotate with `tipo` and `->`; the compiler checks them before generating code.
- **Discord bots with almost no boilerplate:** commands, events, messages, buttons, embeds and channels.
- **Zero-config transpilation** to JavaScript (ES Modules).

---

## Quick Start

```bash
git clone https://github.com/DisChord-Org/DisChord.git
cd DisChord
pnpm install
```

Create `hello.chord`:

```js
var nombre es "Mundo"
var total es 10 mas 5

consola.imprimir("¡Hola " mas nombre mas "!")

si (total mayor 10) {
    consola.imprimir("El total es mayor a 10")
}
```

Compile and run it:

```bash
npm run dev hello.chord
```

This compiles `hello.chord` to `dist/hello.js` and executes it.

A bot, with a command:

```js
encender bot {
    token "TU_TOKEN_AQUÍ"
    prefijo "!"
    intenciones [ "MensajesDelServidor", "ContenidoDelMensaje" ]
}

nuevo comando Ping {
    descripcion "¡Prueba la latencia del bot!"

    enviar mensaje {
        contenido "¡Pong!"
    }
}
```

In a block, the properties go first with no separators, and the code starts after an empty line.

---

## Documentation

- **Tutorials:** the language is taught on the DisChord website.
- **[Language reference](docs/language.md):** syntax, types, blocks, messages, channels and the safety barriers of the channel actions.
- **[Command line and editor integration](docs/editor-integration.md):** every option, the exit codes, diagnostics as JSON, checking an unsaved buffer, `--emit` and `corelib --json`.

### Command line at a glance

| Option | What it does |
| :--- | :--- |
| `--no-run` | Compiles without running the resulting bot. |
| `--check` | Runs every phase without writing anything or running the bot. |
| `--json` | Prints the diagnostics as a single JSON document. |
| `--stdin`, `--stdin-filepath <path>` | Compiles the code on standard input as if it were that file. |
| `--emit tokens\|ast` | Prints the tokens or the syntax tree of a file as JSON. |
| `-o, --out-dir <dir>` | Output directory. |

Exit codes: `0` ok, `1` the code has errors (or the bot failed), `2` the tool could not do its job.

---

## Safety

Channel actions (`crear`, `editar`, `borrar canal`) come with barriers that the bot's code cannot turn off:
no channel action inside a loop, none in the event it triggers, a reason for every deletion, the permission
of whoever runs the command, the channel belonging to the server of the context, and a quota per server that
grows with the number of servers the bot is in. The details are in the [language reference](docs/language.md).

---

## Project Structure

- `src/chord/`: the base language (lexer, parser, analyzer, generator, core library).
- `src/dischord/`: the Discord layer: its parser extension, analysis rules and code generator.
- `src/cli/`: the command line.
- `tester/tests/`: test cases that double as code samples.

---

## License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Check our [Contributing Guidelines](CONTRIBUTING.md).
