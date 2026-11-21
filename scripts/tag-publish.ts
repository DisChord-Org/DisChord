import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";

/**
 * Publishes the version of `package.json` as a git tag:
 *
 * 1. Stops if the checkout is not on `main`, or if the tag already exists.
 * 2. Looks for commits not yet on `origin/main` and asks whether to push them or to stop.
 * 3. Creates the tag `v<version>`.
 * 4. Pushes `main` and the tags with `git push origin main --tags`.
 *
 * `--dry-run` runs the checks and prints what it would do, without tagging or pushing.
 */

const BRANCH = "main";
const REMOTE = "origin";
const dryRun = process.argv.includes("--dry-run");

/** Runs git in the root of the repository and returns what it prints. */
function git(...args: string[]): string {
    return execFileSync("git", args, {
        encoding: "utf-8",
        cwd: path.resolve(__dirname, ".."),
        stdio: ["ignore", "pipe", "inherit"]
    }).trim();
}

/** Runs a git command that changes something; with `--dry-run` it only prints it. */
function gitDo(...args: string[]): void {
    console.log(`$ git ${args.join(" ")}`);

    if (!dryRun) git(...args);
}

/** Prints a failure and exits without touching anything else. */
function stop(message: string): never {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`);
    process.exit(1);
}

/** Asks a yes/no question; anything but `s`, `si`, `sí`, `y` or `yes` is a no. */
async function confirm(question: string): Promise<boolean> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = (await rl.question(`${question} [s/N] `)).trim().toLowerCase();

    rl.close();

    return ["s", "si", "sí", "y", "yes"].includes(answer);
}

async function main(): Promise<void> {
    const branch = git("rev-parse", "--abbrev-ref", "HEAD");

    if (branch !== BRANCH) stop(`Estás en '${branch}': la etiqueta se publica desde '${BRANCH}'.`);

    const { version } = JSON.parse(readFileSync(path.resolve(__dirname, "..", "package.json"), "utf-8")) as { version?: string };

    if (!version) stop("package.json no tiene 'version'.");

    const tag = `v${version}`;

    git("fetch", REMOTE, "--tags");

    if (git("tag", "--list", tag) !== "") stop(`La etiqueta ${tag} ya existe.`);

    const pending = git("log", "--oneline", `${REMOTE}/${BRANCH}..HEAD`);

    if (pending !== "") {
        console.log(`Commits sin publicar en ${REMOTE}/${BRANCH}:\n${pending}\n`);

        if (!(await confirm(`¿Subirlos con 'git push ${REMOTE} ${BRANCH}'?`))) stop("Detenido: hay commits sin publicar.");

        gitDo("push", REMOTE, BRANCH);
    }

    gitDo("tag", tag);
    gitDo("push", REMOTE, BRANCH, "--tags");

    console.log(`\x1b[32m[OK]\x1b[0m ${dryRun ? "Simulado" : "Publicado"}: ${tag}`);
}

main().catch(error => stop(error instanceof Error ? error.message : String(error)));
