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
dischord hello.chord
```

Without installing it, from the repository: `npm run dev hello.chord`. To get the `dischord` command, run `npm link` (or `pnpm link --global`) in the repository.

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

The language is taught in the tutorials of the DisChord website.

### Command line at a glance

| Option | What it does |
| :--- | :--- |
| `--no-run` | Compiles without running the resulting bot. |
| `--check` | Runs every phase without writing anything or running the bot. |
| `--json` | Prints the diagnostics as a single JSON document. Without `--check` the bot is run afterwards; an editor wants `--check --json`. |
| `--stdin`, `--stdin-filepath <path>` | Compiles the code on standard input as if it were that file. |
| `--emit tokens\|ast` | Prints the tokens or the syntax tree of a file as JSON. |
| `-o, --out-dir <dir>` | Output directory. |
| `corelib [--json]` | Prints the vocabulary of the language (keywords, classes, blocks, events), for editors. |

Exit codes: `0` ok, `1` the code has errors (or the bot failed), `2` the tool could not do its job.

---

## Safety

The actions that change a server (`crear`, `editar` and `borrar canal`, `banear`, `desbanear` and `expulsar`) come with
barriers that are part of the generated code and that the `.chord` file cannot turn off:

- Never inside a loop, nor in the event that would set them off again (`crear canal` in `canalCreado`, `desbanear` in
  `usuarioBaneado`, `expulsar` in `entradaMiembro`...).
- A `razon` for every deletion and every moderation action; the audit log also records who ordered it.
- Inside a command, whoever runs it needs the permission (*Manage Channels*, *Ban Members* or *Kick Members*); in an event
  the bot acts alone. The `servidor` has to be the one the command runs in, and `editar`/`borrar canal` only work on channels
  that person can see.
- A quota per server and action in a window of 10 minutes (10 to create a channel, 10 to edit, 5 to delete; 3 bans, 5 unbans,
  5 kicks) that doubles for every order of magnitude of servers the bot is in, up to ×8. Ids are compared in their canonical
  form, so `11` and `011` share one quota.
- Moderation never targets the bot, the owner of the server or whoever runs the command, and inside a command the target's
  highest role must be below the invoker's (the owner is exempt). A 403 from Discord is rewritten in Spanish.

Reading a channel is held to the same rules. `obtener canal { nombre "general" }` (optionally narrowed with `tipo` and
`categoria`) fails when no channel or more than one has that name, and only counts the channels whoever runs the command
can see, so the answer never reveals one they cannot; by `id` it gives one answer whether the channel does not exist, is in
another server or is not visible. `listar canales` also filters by `nombre` and `nombreContiene`.

Known and accepted limits: the barriers do not cover `js("...")` nor the direct use of `cliente`, `contexto` and the Seyfert
objects; an action written inside a function that a loop calls is not seen as inside the loop (the quota is what is left); and
the quota lives in memory, so it is lost when the bot restarts and is not shared between instances.

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
