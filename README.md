# DisChord

**Experimental Natural-Syntax Programming Language Transpiler**

DisChord is a modern, intuitive, and human-friendly programming language designed to bridge the gap between human language and machine code. By replacing cold, symbolic operators with natural word-based keywords, DisChord offers a readable and expressive syntax that feels as natural as writing a sentence.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Version](https://img.shields.io/badge/Version-1.6.0-green.svg)](package.json)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/DisChord-Org/DisChord)

---

## Features

- **Natural Operators**: Use `mas`, `menos`, `por`, and `entre` instead of `+`, `-`, `*`, and `/`.
- **Expressive Logic**: Write logical conditions using `y`, `o`, `no`, `igual`, `mayor`, and `menor`.
- **Human-Readable Flow**: Control program execution with `si`, `sino`, `para`, and `funcion`.
- **Optional Static Types**: Annotate variables, parameters and return values with `tipo` and `->`; the compiler checks them before generating any code.
- **Zero-Config Transpilation**: Compiles directly to standard JavaScript (ES Modules).
- **Lightweight & Fast**: A minimalist lexer and parser architecture.

---

## Quick Start

### Installation

Clone the repository and install dependencies using `pnpm`:

```bash
git clone https://github.com/DisChord-Org/DisChord.git
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

This will compile `hello.chord` to `dist/hello.js` and execute it automatically.

### Command Line Options

Everything after `npm run dev --` goes to the CLI (the examples use `npm run dev --`; `entry` is a
`.chord` file or a project directory, `.` by default).

| Option | What it does |
| :--- | :--- |
| `--no-run` | Compiles without running the resulting bot. |
| `--check` | Runs the lexer, parser, analyzer and generator without writing anything or running the bot. |
| `--json` | Prints a single JSON document with the diagnostics, and nothing else (no progress messages). |
| `--stdin`, `--stdin-filepath <path>` | Compiles the code that arrives on standard input as if it were that file. Implies `--check`. |
| `--emit tokens\|ast` | Prints the tokens or the syntax tree of one file as JSON. Implies `--json` and `--check`. |
| `-o, --out-dir <dir>` | Output directory for the compiled files. |
| `-d, --debug <phase>`, `-D, --depth <n>` | Debug output of the compiler phases (`lexer`, `parser`, `generator`, `all`). |

Exit codes:

| Code | Meaning |
| :--- | :--- |
| `0` | Everything went well (also `--help` and `--version`). |
| `1` | The code has errors: a diagnostic of the compiler, or the bot failing when it runs. |
| `2` | The tool could not do its job: wrong usage, a project without `package.json` or without `"type": "module"`, a path that does not exist, or an internal failure. |

#### Diagnostics as JSON

With `--json` the output is always one document, with `ok` and the list of `diagnostics`; `file`, `line` and
`column` are present when the error has a location (`line` and `column` start at 1):

```bash
npm run dev -- --check --json
```

```json
{"ok":false,"diagnostics":[{"file":"/path/to/project/src/main.chord","phase":"Análisis","severity":"error","message":"La variable 'edad' es de tipo 'numero' pero se le asignó un valor de tipo 'texto'","line":2,"column":9}]}
```

`--json` of the compile command is not the `--json` of `corelib`, which prints the vocabulary of the language
(below). When a file has no errors the document is `{"ok":true,"diagnostics":[]}`.

#### Checking an unsaved buffer

An editor can check what is in its buffer, without saving it, by sending it through standard input and saying
which file it is. The directory of `--stdin-filepath` must exist, the file does not; only that file is
checked, and nothing is written:

```bash
printf 'var a tipo texto es 5\n' | npm run dev -- --stdin --stdin-filepath src/main.chord --json
```

```json
{"ok":false,"diagnostics":[{"file":"/path/to/project/src/main.chord","phase":"Análisis","severity":"error","message":"La variable 'a' se declaró con tipo 'texto' pero se le asignó un valor de tipo 'numero'","line":1,"column":21}]}
```

A minimal integration reads `ok` and `diagnostics`, and treats exit code `2` (or output that is not JSON) as the tool
failing rather than the code:

```javascript
import { spawn } from 'node:child_process';

function check(source, filepath, cwd) {
    return new Promise((resolve, reject) => {
        const child = spawn('npm', [ 'run', '-s', 'dev', '--', '--stdin', '--stdin-filepath', filepath, '--json' ], { cwd, shell: true });
        let out = '';

        child.stdout.on('data', chunk => out += chunk);
        child.on('close', code => code === 2 ? reject(new Error(out)) : resolve(JSON.parse(out).diagnostics));
        child.stdin.end(source);
    });
}
```

#### Tokens and syntax tree

`--emit` works over a single file and stops before the analyzer, so it also works on code the compiler would
reject later. The result carries `schema` (`1`), `emit`, `file` and `tokens` or `ast`; an error comes as a
diagnostic, as with `--json`. Each token has `start` and `end` (`{ line, column }`, `end` is just after the last
character). The shape of the `ast` nodes is internal and is not covered by `schema`. `--emit ast` adds
`declarations`: every name the source declares, each with its exact range, for an outline, go to definition
or rename without ranges on every node.

| Key | Content |
| :--- | :--- |
| `kind` | `class`, `function`, `method`, `constructor`, `parameter`, `variable`, `property` or `import`; dischord adds `command`, `event`, `button` and `embed`. |
| `name` | The declared name. |
| `container` | The class, function, event or command whose body the name is declared in (a method, a parameter, a local variable, a nested function), when it has one. |
| `start`, `end` | `{ line, column }` of the name; `end` is just after its last character. |

```bash
npm run dev -- src/main.chord --emit tokens
```

```json
{"ok":true,"diagnostics":[],"schema":1,"emit":"tokens","file":"/path/to/project/src/main.chord","tokens":[{"type":"var","value":"var","start":{"line":1,"column":1},"end":{"line":1,"column":4}},{"type":"IDENTIFICADOR","value":"edad","start":{"line":1,"column":5},"end":{"line":1,"column":9}},{"type":"es","value":"es","start":{"line":1,"column":10},"end":{"line":1,"column":12}},{"type":"NUMERO","value":"5","start":{"line":1,"column":13},"end":{"line":1,"column":14}}]}
```

#### The language vocabulary

`corelib` prints what the language provides, from the same tables the compiler uses, so an editor can offer
completion and hover without copying them. Without options it prints a readable listing; with `--json`, one document:

```bash
npm run dev -- corelib --json
```

| Key | Content |
| :--- | :--- |
| `schema` | Version of the layout of the document (`1`). |
| `compilerVersion` | Version of the compiler that produced it; informative. |
| `keywords` | The reserved words. |
| `classes` | The core library classes, each with its `receiver`, whether it is `instantiable` or `injected`, and its `methods` and `properties` (`name`, `returns`, `params`, `doc`, `static`, `async`). |
| `functions` | Functions without a receiver (`esperar`, `imprimir`, `rango`), with their `kind` and whether they are `async`. |
| `types` | The names that can be written as a type (`primitive`, `any`, `void` or `class`). |
| `literals` | Words that stand for a fixed text (`espacio`, `intro`) and their `value`. |
| `decorators` | The decorators, with their `@`. |
| `declarations` | The dischord keywords that declare a block of their own (`embed`, `boton`): `{ keyword, block }`. |
| `events` | The events of `evento` with the identifiers their handler has in scope: `{ name, params }`. |
| `blocks` | The properties each block takes (`comando`, `opcion`, `boton`, `embed`, `campo`, `pie`, `encender bot`, `recolector`, `mensaje`): `{ name, fields: [{ keys, kind, required, values? }], nested: [{ key, block, shape }] }`. |
| `scopes` | What the body of a construct sees without declaring it (`comando`): `{ construct, identifiers }`. |

Adding keys to the document does not change `schema`; renaming or removing one does. A consumer should ignore the
keys it doesn't know. One limitation: in the `embed` block, `autor` and `hora` are not in `blocks` yet, since
the generator resolves them by hand.

## Built for Discord Bots

DisChord isn't just a general-purpose language; it's specifically optimized for building powerful Discord bots with almost zero boilerplate. Using the internal **Seyfert** integration, you can define commands and events using natural Spanish keywords.

### Example: A Simple Ping Command

```js
encender bot {
    token "TU_TOKEN_AQUÍ"
    prefijo "!"
    intenciones [ "MensajesDelServidor", "ContenidoDelMensaje" ]
}

nuevo comando Ping {
    descripcion "¡Prueba la latencia del bot!";
    
    consola.imprimir("Ejecutando ping...")
    
    var pingMensaje es "¡Pong " mas cliente.ping mas "ms!"
    enviar mensaje {
        contenido "¡Pong!"
    }
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
| **List** | `var l es [ 1, 2, 3 ]` |
| **Object (BDO)** | `var o es { modo "rapido" }` |

There is no `null`: the absence of a value is always `indefinido`.

### Types

Types are optional. A variable, parameter or return value without an annotation has its type
inferred from what it holds, and keeps it as long as every reassignment agrees. If a reassignment
changes the type, or its type can't be inferred, the variable becomes `cualquiera` for its whole
scope (and so does anything derived from it, such as `var b es a mas 1`). One with an annotation is
checked, and a mismatch stops the compilation. Indexing a typed list or tuple gives the type of the
element (`l[0]` of a `Mapa[]` is a `Mapa`; a tuple needs a literal index). A list literal of class
instances is typed by them (`[ nuevo B(), nuevo A() ]` is a list of `A|B`), and one that mixes them with
primitives is a list of the union.

```js
var a es 5
a es "cinco"            // fine: `a` is now `cualquiera`

var x                   // declared without a value
x es 5                  // fine

var b tipo numero es 5
b es "cinco"
// La variable 'b' es de tipo 'numero' pero se le asignó un valor de tipo 'texto'
```

| Type | Meaning | Example |
| :--- | :--- | :--- |
| `texto`, `numero`, `booleano`, `indefinido` | The primitives | `var n tipo numero es 5` |
| `bdo` | A plain object (`{}`) | `var c tipo bdo es { modo "rapido" }` |
| `T[]` | A list of `T` | `var tags tipo texto[] es [ "a", "b" ]` |
| `[A, B]` | A tuple, position by position | `var par tipo [texto, numero] es [ "ether", 5 ]` |
| `A\|B` | A union | `var id tipo texto\|numero es 7` |
| `cualquiera` | Any value, unchecked | `var x tipo cualquiera es 1` |
| `Mapa`, `Conjunto`, `Fecha`, ... | A core library class | `var m tipo Mapa es nuevo Mapa()` |
| `MiClase` | A class declared in the file; accepts its subclasses | `var c tipo Caja es nuevo Caja()` |

Functions annotate their parameters with `tipo` and their return value with `->`. `nada` is the
return type of a function that returns no value, and is only valid there.

```js
funcion saludar(quien tipo texto, veces tipo numero) -> texto {
    devolver "Hola " mas quien
}

funcion avisar(aviso tipo texto) -> nada {
    consola.imprimir(aviso)
}

@asincrono
funcion cargar(id tipo numero) -> texto {
    devolver "x"
}
```

Types are checked when a variable is declared or reassigned, when a function returns, and when it
is called:

```js
var edad tipo numero es 5
edad es "veinte"
// La variable 'edad' es de tipo 'numero' pero se le asignó un valor de tipo 'texto'

funcion doble(n tipo numero) -> numero {
    devolver n por 2
}
doble("tres")
// El argumento 1 de 'doble' es de tipo 'texto', se esperaba 'numero'
```

The checks are structural for core library classes (a `Mapa` is not a `Conjunto`) and nominal for
the classes you declare: an instance is accepted where its own class or a class it extends is expected,
not the other way round and not between unrelated classes (a class is identified by its name, so two
classes of the same name in different scopes are the same type). Generic types
(`Mapa<texto, numero>`) are not supported yet.

A type name the compiler doesn't know stops the compilation and lists the valid ones: the primitives,
`cualquiera`, `Lista`, `Mapa`, `Conjunto`, `Promesa`, `Expresion` and `Fecha`, a class declared in the
file, and the shapes `T[]`, `[A, B]` and `A|B`. `Mates`, `JSON`, `Aleatorio` and `consola` are not types.

```js
var x tipo Mates es 1
// Tipo desconocido 'Mates'. Tipos válidos: texto, numero, booleano, bdo, indefinido, cualquiera, Lista, Mapa, Conjunto, Promesa, Expresion, Fecha o una clase declarada en el archivo; también T[], [A, B] y A|B
```

Where the receiver's class is known, a core library method must be called and a property must not be;
anything else would compile to JavaScript that doesn't do what was written.

```js
var f tipo Fecha es nuevo Fecha()
f.dia
// 'dia' es un método de Fecha: llámalo con paréntesis, dia()

var t es "hola"
t.longitud()
// 'longitud' es una propiedad de Texto, no un método
```

Classes are checked too. A subclass must be declared after its base, inheriting in a cycle is an error,
and a base that isn't declared in the file is taken as external (a class dischord generates, or a
JavaScript global such as `Error`). A class that extends a core library class (`nuevo Mapa MiMapa {}`)
extends the native `Map`, although the compiler doesn't know it inherits its methods. A method that
overrides another can't change whether it is `@asincrono`, because a call is awaited by what the base
class declares.

```js
clase B extiende A {
}
clase A {
}
// La clase 'B' extiende de 'A', que se declara más abajo; declara 'A' antes de 'B'

clase A extiende B {
}
clase B extiende A {
}
// La clase 'A' hereda de sí misma (A → B → A)

clase A {
    funcion m() { devolver 1 }
}
clase B extiende A {
    @asincrono
    funcion m() { devolver 2 }
}
// El método 'm' de 'B' es asíncrono pero el de 'A' no
```

Reading `longitud` or `tamano` from a value whose type is not known (a parameter without
`tipo`, or a `cualquiera` value) is resolved when the program runs: a text, a list, a `Mapa`
or a `Conjunto` gives its length or size, and a `bdo` with a field of that name gives the
field. Writing to it (`p.longitud es 3`) is always a field.

```js
funcion largo(valor) {          // `valor` has no type
    devolver valor.longitud
}

consola.imprimir(largo("abc"))             // 3
consola.imprimir(largo([ 1, 2 ]))          // 2
consola.imprimir(largo({ longitud 5 }))    // 5
```

### Known limitations

- A class is identified by its name, so two classes of the same name in different scopes are the same type.
- A class that extends a core library class isn't assignable to it, and its inherited members aren't
  resolved through it by the compiler.
- There are no generic types, type aliases or interfaces, and `si` doesn't narrow a type.
- The variable of a `para` loop, a function's return value without a `->` annotation and the implicit
  parameters of dischord constructs are not typed.

### Natural Operators

| Symbolic | Natural Keyword |
| :--- | :--- |
| `+` | `mas` |
| `-` | `menos` |
| `*` | `por` |
| `/` | `entre` |
| `**` | `exp` |
| `%` | `resto` |
| ` ` | `espacio` |
| `\n` | `intro` |

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
- `dist/`: Output directory for transpiled `.js` files.

---

## License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Whether it's adding a new natural language keyword or improving the Discord integration, check our [Contributing Guidelines](CONTRIBUTING.md).
