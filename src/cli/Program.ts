import { Command } from 'commander';
import pkg from '../../package.json';
import { CompileCommand } from './commands/CompileCommand';
import { RunCommand } from './commands/RunCommand';
import { TestCommand } from './commands/TestCommand';

/**
 * Enumeration of available debug flags for compiler phases.
 * 
 * @enum {number}
 */
export enum DebugFlags {
    Lexer,
    Parser,
    Generator,
    All
}

/**
 * Interface representing the global CLI options parsed by Commander.
 *
 * @interface GlobalCLIOptions
 */
export interface GlobalCLIOptions {
    /** Disables automatic execution after compilation */
    run: boolean;
    /** Output directory override for compiled files */
    outDir?: string;
    /** Enables detailed logging for specific compiler phases */
    debug?: DebugFlags;
    /** Depth level for inspecting complex objects or AST structures in output */
    depth: number;
}

/**
 * Encapsulates the Commander program initialization and command declarations for DisChord CLI.
 * 
 * @class Program
 */
export class Program {
    /** Internal Commander program instance */
    private readonly program: Command;

    /**
     * Creates an instance of Program and configures commands and options.
     */
    constructor() {
        this.program = new Command();
        this.configure();
    }

    /**
     * Declares commands, positional arguments, and flags on the Commander instance.
     * 
     * @private
     */
    private configure(): void {
        this.program
            .name('dischord')
            .description('Compilador para el entorno DisChord')
            .version(`v${pkg.version}`, '-v, --version', 'Muestra la versión actual de DisChord');

        this.program
            .argument('[entry]', 'Ruta al archivo .chord o directorio del proyecto', '.')
            .option('--no-run', 'Compila el proyecto sin ejecutar el bot resultante')
            .option('-o, --out-dir <directorio>', 'Directorio de salida para los archivos compilados')
            .option(
                '-d, --debug <fase>',
                'Muestra información de depuración (lexer | parser | generator | all)',
                (value: string): DebugFlags => {
                    const key = Object.keys(DebugFlags).find(
                        (key) => key.toLowerCase() === value.toLowerCase() && isNaN(Number(key))
                    );

                    if (key === undefined) {
                        throw new Error(`Fase de depuración no válida: '${value}'. Opciones: lexer, parser, generator, all`);
                    }

                    return DebugFlags[key as keyof typeof DebugFlags];
                }
            )
            .option(
                '-D, --depth <nivel>',
                'Profundidad de inspección en la salida del compilador',
                (value) => parseInt(value, 10), 1
            )
            .action(async (entry: string, options: GlobalCLIOptions) => {
                await new CompileCommand().execute(entry, options);
            });
        
        this.program
            .command('run')
            .argument('<file>', 'Ruta al archivo JavaScript (.mjs) compilado')
            .description('Ejecuta código previamente compilado')
            .action(async (file: string) => {
                await new RunCommand().execute(file);
            });

        this.program
            .command('test')
            .description('Ejecuta la suite de pruebas internas del compilador')
            .action(async () => {
                await new TestCommand().execute();
            });
    }

    /**
     * Parses process arguments and triggers the corresponding action.
     * 
     * @param {string[]} [argv=process.argv] - Array of command-line arguments.
     * @returns {Promise<Command>} The parsed Commander instance.
     */
    public async parse(argv: string[] = process.argv): Promise<Command> {
        return this.program.parseAsync(argv);
    }
}