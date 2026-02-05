import * as fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { Generator } from './generator';

const filePath = process.argv[2];

if (!filePath) {
    console.error("Uso: npx tsx index.ts <archivo.chord>");
    process.exit(1);
}

const printOutput = (name: string, output: string[]) => {
    console.log("-------- " + name +" --------")
    console.log(output);
    console.log(`------------------${"-".repeat(name.length)}\n`)
}

const code = fs.readFileSync(filePath, 'utf-8');
const lexer = new Lexer(code);
const tokens = lexer.tokenize();

if (process.argv.includes('--lexer')) printOutput("LEXER", tokens as any[]);

const parser = new Parser(tokens);
const ast = parser.parse();

if (process.argv.includes('--ast')) printOutput("AST", ast as any[]);
if (process.argv.includes('--table')) printOutput("TABLE", Array.from(parser.symbols.values()) as any[]);

const generator = new Generator(parser.symbols);
const output = generator.generate(ast);

if (process.argv.includes('--output')) printOutput("OUTPUT", [output]);

fs.writeFileSync('output.mjs', output);

const fileUrl = pathToFileURL(path.join(process.cwd(), 'output.mjs')).href;

import(`${fileUrl}?update=${Date.now()}`).catch(err => {
    console.error("Error:", err);
});