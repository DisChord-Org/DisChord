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

function getFiles(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    const files = entries.map((entry) => {
        const res = path.resolve(dir, entry.name);
        return entry.isDirectory() ? getFiles(res) : res;
    });

    return Array.prototype.concat(...files).filter(f => f.endsWith('.chord'));
}

async function compileFile(fullPath: string, projectRoot: string, distDir: string) {
    const relativePath = path.relative(path.join(projectRoot, 'src'), fullPath);
    const fileName = path.basename(fullPath, '.chord');
    
    const targetDir = path.join(distDir, path.dirname(relativePath));
    const outputPath = path.join(targetDir, `${fileName}.mjs`);

    const code = fs.readFileSync(fullPath, 'utf-8');
    
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const generator = new Generator(parser.symbols);
    const output = generator.generate(ast);

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(outputPath, output);
    
    return outputPath;
}

async function start () {
    try {
        const resolvedPath = path.resolve(inputPath);
        const isDirectory = fs.statSync(resolvedPath).isDirectory();
        
        const inputDir = isDirectory ? resolvedPath : path.dirname(resolvedPath);
        const projectRoot = path.basename(inputDir) === 'src' ? path.join(inputDir, '..') : inputDir;
        const distDir = path.join(projectRoot, 'dist');
        
        const filesToCompile = isDirectory ? getFiles(resolvedPath) : [resolvedPath];
        
        console.log(`Iniciando compilación en: ${projectRoot}`);
        
        let lastCompiledPath = "";
        
        for (const file of filesToCompile) {
            console.log(`Compilando: ${path.relative(projectRoot, file)}`);
            lastCompiledPath = await compileFile(file, projectRoot, distDir);
        }
        
        if (!args.includes('--no-run')) {
            const runTarget = isDirectory? path.join(distDir, 'index.mjs') : lastCompiledPath;
            
            if (fs.existsSync(runTarget)) {
                process.chdir(projectRoot);
                console.log(`Ejecutando: ${path.relative(projectRoot, runTarget)}\n`);
                const fileUrl = pathToFileURL(runTarget).href;
                await import(`${fileUrl}?update=${Date.now()}`);
            }
        }
        
    } catch (error: any) {
        console.log("\n\x1b[31mERROR DE COMPILACIÓN\x1b[0m");
        console.log(error.message);
        process.exit(1);
    }
}

start();