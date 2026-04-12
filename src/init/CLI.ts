import util from 'util';
import path from 'path';

import { ASTNode, Token } from '../chord/types';
import { DisChordNode, DisChordNodeType } from '../dischord/types';

export enum LogFlagLevel {
    LEXER = '--lexer',
    AST = '--ast',
    OUTPUT = '--output',
    NORUN = '--no-run'
}

type LogMessage = Token[] | ASTNode<DisChordNodeType, DisChordNode>[] | string;

export class CLI {
    static args = process.argv.slice(3);

    static hasFlag(flag: LogFlagLevel): boolean {
        return this.args.includes(flag);
    }

    static getDepth(): number {
        const idx = this.args.findIndex(arg => arg === '-d' || arg === '--depth');
        return (idx !== -1 && this.args[idx + 1]) ? parseInt(this.args[idx + 1]) : 1;
    }

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

    static validateInput(): string {
        const input = process.argv[2];

        if (!input) {
            console.error("Uso: chord <archivo.chord> [opciones]");
            process.exit(1);
        }
        return path.resolve(input);
    }
}