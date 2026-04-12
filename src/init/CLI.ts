import util from 'util';
import path from 'path';

import { ASTNode, Token } from '../chord/types';
import { DisChordNode, DisChordNodeType } from '../dischord/types';

/**
 * Supported CLI flags for debugging and execution control.
 */
export enum LogFlagLevel {
    LEXER = '--lexer',    // Displays the token list
    AST = '--ast',        // Displays the Abstract Syntax Tree
    OUTPUT = '--output',  // Displays the generated JS code
    NORUN = '--no-run'    // Compiles without executing the result
}

type LogMessage = Token[] | ASTNode<DisChordNodeType, DisChordNode>[] | string;

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
        return this.args.includes(flag);
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

        console.log("--- " + "-".repeat(label.length) + " ---");
    }

    /**
     * Logic to trigger conditional logging based on active flags.
     * @param flag - The flag to check for.
     * @param message - The message to display.
     */
    static logFlag (flag: LogFlagLevel, message: LogMessage) {
        if (!this.hasFlag(flag)) return;

        switch (flag) {
            case LogFlagLevel.LEXER:
                this.debug("LEXER", message);
                break;
            case LogFlagLevel.AST:
                this.debug("AST", message);
                break;
            case LogFlagLevel.OUTPUT:
                this.debug("OUTPUT", message);
                break;
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