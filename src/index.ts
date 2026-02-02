import * as fs from 'fs';
import { Lexer } from './lexer';

const filePath = process.argv[2];

if (!filePath) {
    console.error("Uso: npx tsx index.ts <archivo.chord>");
    process.exit(1);
}

const code = fs.readFileSync(filePath, 'utf-8');
const lexer = new Lexer(code);
const tokens = lexer.tokenize();

console.log(tokens);