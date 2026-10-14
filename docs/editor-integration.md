# Command line options and editor integration

Everything after `npm run dev --` goes to the CLI (the snippets here use `npm run dev --`; `entry` is a
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

## Diagnostics as JSON

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

## Checking an unsaved buffer

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

## Tokens and syntax tree

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

## The language vocabulary

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
