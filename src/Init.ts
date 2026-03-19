import * as fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Lexer } from './chord/lexer';
import { DisChordParser } from './dischord/Parser/parser';
import { ASTNode, Token } from './chord/types';
import { DisChordGenerator } from './dischord/Generator/generator';

/**
 * The Init class for DisChord.
 * @private {inputPath} The selected path to run in.
 * @private {args} Proccess argumments.
 */
export default class Init {
    private args: string[] = process.argv.slice(3);
    private inputPath: string = process.argv[2];
    private isInputPathDirectory: boolean;
    private projectRoot: string;
    private distDir: string;

    constructor () {
        if (!this.inputPath) {
            console.log("Error: No se proporcionó un archivo de entrada.");
            console.log("Uso: chord <archivo.chord> [opciones]");
            process.exit(1);
        }

        this.inputPath = path.resolve(this.inputPath);
        
        this.isInputPathDirectory = fs.statSync(this.inputPath).isDirectory();
        const inputDir = this.isInputPathDirectory ? this.inputPath : path.dirname(this.inputPath);
        this.projectRoot = path.basename(inputDir) === 'src' ? path.join(inputDir, '..') : inputDir;
        this.distDir = path.join(this.projectRoot, 'dist');

        this.start();
    }

    log (name: string, message: Token[] | ASTNode[] | string) {
        console.log("--- " + name + " ---");
        console.log(message);
        console.log("--- " + "-".repeat(name.length) + " ---");
    }

    getFiles (dir: string): string[] {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        const files = entries.map((entry) => {
            const res = path.resolve(dir, entry.name);
            return entry.isDirectory() ? this.getFiles(res) : res;
        });

        return Array.prototype.concat(...files).filter(f => f.endsWith('.chord'));
    }

    async compileFile (fullPath: string) {
        const args = this.args;

        const relativePath = path.relative(path.join(this.projectRoot, 'src'), fullPath);
        const fileName = path.basename(fullPath, '.chord');

        const targetDir = path.join(this.distDir, path.dirname(relativePath));
        const outputPath = path.join(targetDir, `${fileName}.mjs`);

        const code = fs.readFileSync(fullPath, 'utf-8');
    
        DisChordParser.injectStatements();

        const lexer = new Lexer(code);
        const tokens = lexer.tokenize();
        if (args[0] === '--lexer') this.log("LEXER", tokens);

        const parser = new DisChordParser(tokens);
        const ast = parser.parse();
        if (args[0] === '--ast') this.log("AST", ast);
    
        const generator = new DisChordGenerator(parser.symbols, this.projectRoot);
        const output = generator.generate(ast);
        if (args[0] === '--output') this.log("OUTPUT", output);

        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        fs.writeFileSync(outputPath, output);
    
        return outputPath;
    }

    async start () {
        try {
            const filesToCompile = this.isInputPathDirectory ? this.getFiles(this.inputPath) : [this.inputPath];

            console.log(`Iniciando compilación en: ${this.projectRoot}`);
        
            let lastCompiledPath = "";
        
            for (const file of filesToCompile) {
                console.log(`Compilando: ${path.relative(this.projectRoot, file)}`);
                lastCompiledPath = await this.compileFile(file);
            }

            if (!this.args.includes('--no-run')) {
                const runTarget = this.isInputPathDirectory? path.join(this.distDir, 'index.mjs') : lastCompiledPath;
            
                if (fs.existsSync(runTarget)) {
                    process.chdir(this.projectRoot);
                    console.log(`Ejecutando: ${path.relative(this.projectRoot, runTarget)}\n`);
                    const fileUrl = pathToFileURL(runTarget).href;
                    await import(`${fileUrl}?update=${Date.now()}`);
                }
            }
        
        } catch (error: any) {
            console.log("ERROR DE COMPILACIÓN");
            console.log(error.message);
            process.exit(1);
        }
    }
}
