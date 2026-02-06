import * as fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { Generator } from './generator';

const inputPath = process.argv[2];
const args = process.argv.slice(3);

if (!inputPath) {
    console.log("Error: No se proporcionó un archivo de entrada.");
    console.log("Uso: chord <archivo.chord> [opciones]");
    process.exit(1);
}

try {
    const fullPath = path.resolve(inputPath);
    const fileName = path.basename(fullPath, '.chord');

    const inputDir = path.dirname(fullPath);
    const inputDirName = path.basename(inputDir);

    const projectRoot = inputDirName === 'src' ? path.join(inputDir, '..') : inputDir;
    const distDir = path.join(projectRoot, 'dist');
    
    const outputPath = path.join(distDir, `${fileName}.mjs`);

    if (!fs.existsSync(fullPath)) throw new Error(`El archivo no existe: ${fullPath}`);
    const code = fs.readFileSync(fullPath, 'utf-8');

    console.log(`Compilando ${fileName}.chord...`);

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    if (args.includes('--lexer')) console.dir(tokens, { depth: null });

    const parser = new Parser(tokens);
    const ast = parser.parse();
    if (args.includes('--ast')) console.dir(ast, { depth: null });

    const generator = new Generator(parser.symbols);
    const output = generator.generate(ast);

    if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(outputPath, output);
    
    console.log(`Compilado con éxito: ${outputPath}`);

    if (!args.includes('--no-run')) {
        const fileUrl = pathToFileURL(outputPath).href;
        import(`${fileUrl}?update=${Date.now()}`);
    }

} catch (error: any) {
    console.log("\nERROR DE COMPILACIÓN");
    console.log(error.message);
    process.exit(1);
}
