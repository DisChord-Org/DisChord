import util from 'util';
import path from 'path';

import { ASTNode, Token } from '../chord/types';
import { DisChordNode, DisChordNodeType, DisChordTokenType } from '../dischord/types';

/**
 * Supported CLI flags for debugging and execution control.
 */
export enum LogFlagLevel {
    LEXER = '--lexer',      // Displays the token list
    PARSER = '--ast',       // Displays the Abstract Syntax Tree
    GENERATOR = '--output', // Displays the generated JS code
    NORUN = '--no-run',     // Compiles without executing the result
    TEST = '--test'         // Only run tests
}

/**
 * Log labels to exclude not displayed flags
*/
type LogLabelsType = Record<Exclude<LogFlagLevel, LogFlagLevel.NORUN | LogFlagLevel.TEST>, string>;

/**
 * @type {LogLabelsType}
 * @description A dictionary that maps each active debugging CLI flag to its corresponding 
 * formatted, human-readable terminal header label. It excludes execution control flags 
 * like `NORUN` since they do not produce visual compile-time debug structures.
 * 
 * @private
 * @readonly
 */
const LogLabels: LogLabelsType = {
    [LogFlagLevel.LEXER]: 'TOKENS (LEXER)',
    [LogFlagLevel.PARSER]: 'AST (ÁRBOL DE SINTAXIS ABSTRACTA)',
    [LogFlagLevel.GENERATOR]: 'CÓDIGO GENERADO (OUTPUT)'
};

/**
 * @typedef {Token<DisChordTokenType>[] | ASTNode<DisChordNodeType, DisChordNode>[] | string} LogMessage
 * @description Represents the strict union payload that can be processed and inspected by the CLI debug utility.
 * It ensures type safety across the different compilation stages, accommodating lexer streams, 
 * abstract syntax tree branches, or raw generated code strings.
 */
type LogMessage = Token<DisChordTokenType>[] | ASTNode<DisChordNodeType, DisChordNode>[] | string;

/**
 * Utility class for CLI argument parsing and formatted logging.
 */
export class CLI {
    // Arguments starting from the 4th position (after 'chord' and <file>)
    static args = process.argv.slice(3);

    /**
     * @param flag - The flag to check for.
     * @returns true if the specified flag is present in the arguments.
     */
    static hasFlag(flag: LogFlagLevel): boolean {
                                        // hotfix for tests implementation, i need to improve this
        return this.args.includes(flag) || process.argv.includes(flag);
    }

    /**
     * Parses the depth value for object inspection. 
     * @default 1
     */
    static getDepth(): number {
        const idx = this.args.findIndex(arg => arg === '-d' || arg === '--depth');
        return (idx !== -1 && this.args[idx + 1]) ? parseInt(this.args[idx + 1]) : 1;
    }

    /**
     * Prints a formatted debug block to the console.
     * @param label - The label for the debug block.
     * @param message - The message to display.
     */
    static debug(label: string, message: LogMessage) {
        console.log(`\n\x1b[33m--- ${label} ---\x1b[0m`);

        console.log(util.inspect(message, {
            showHidden: false,
            depth: this.getDepth(),
            colors: true,
            compact: false
        }));

        console.log(`\x1b[33m--- ${"-".repeat(label.length)} ---\x1b[0m`);
    }
    
    /**
     * @method logFlag
     * @description Conditional logging trigger that prints compiler stage details if its associated flag is active.
     * @param {keyof LogLabelsType} flag - A strict subset of LogFlagLevel containing only renderable visual outputs.
     * @param {LogMessage} message - The current compilation stage data package.
     * @returns {void}
     * @public
     * @static
     */
    static logFlag(flag: keyof LogLabelsType, message: LogMessage): void {
        if (this.hasFlag(flag)) {
            this.debug(LogLabels[flag], message);
        }
    }

    /**
     * Validates that an input file/path was provided.
     * @returns The resolved path to the input file.
     */
    static validateInput(): string {
        const input = process.argv[2];

        if (!input) {
            console.error("Uso: chord <archivo.chord> [opciones]");
            process.exit(1);
        }
        return path.resolve(input);
    }
}