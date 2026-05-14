import { ChordError, ErrorLevel } from "../../ChordError";
import { SUGGESTIONS } from "../core.lib";
import { ASTNode, Token, SOF, EOF } from "./../types";

import { BDOParser } from "./Grammar/BDOParser";
import { AccessParser } from "./Grammar/Expressions/AccessParser";
import { AditiveParser } from "./Grammar/Expressions/AditiveParser";
import { ArithmeticParser } from "./Grammar/Expressions/ArithmeticParser";
import { AssignmentParser } from "./Grammar/Expressions/AssignmentParser";
import { ComparisionParser } from "./Grammar/Expressions/ComparisionParser";
import { ExpressionParser } from "./Grammar/Expressions/ExpressionParser";
import { LiteralParser } from "./Grammar/Expressions/LiteralParser";
import { LogicalParser } from "./Grammar/Expressions/LogicalParser";
import { UnaryParser } from "./Grammar/Expressions/UnaryParser";
import { PrimaryParser } from "./Grammar/PrimaryParser/PrimaryParser";
import { StatementParser } from "./Grammar/StatementParser/StatementParser";
import { VariableParser } from "./Grammar/StatementParser/VariableParser";

import { ParserContext } from "./ParserContext";
import { SubParserClass } from "./subparser";
import { CompilationContext } from "../../init/Init";
import { SymbolTable } from "../SymbolsTable";
import { ConditionParser } from "./Grammar/StatementParser/ConditionParser";
import { BlockParser } from "./Grammar/BlockParser";
import { LoopParser } from "./Grammar/StatementParser/LoopParser";
import { ReturnParser } from "./Grammar/StatementParser/ReturnParser";

export class Parser<T, N> extends ParserContext<T, N> {
    public nodes: ASTNode<T, N>[] = [];
    
    constructor(
        private tokens: Token[],
        private current: number = 0,
        private context: CompilationContext
    ) {
        super();

        this.setOwner(this as unknown as Parser<T, N>);
        this.registerInstances();
    }

    private registerInstances () {
        const instances: SubParserClass<T, N>[] = [
            AditiveParser, ArithmeticParser, AssignmentParser,
            ComparisionParser, ExpressionParser, LogicalParser,
            UnaryParser, BDOParser, PrimaryParser, LiteralParser,
            AccessParser, StatementParser, VariableParser,
            BlockParser, ConditionParser, LoopParser, ReturnParser
        ];
        
        instances.forEach(instance => this.register(instance));
    }

    public parse(): ASTNode<T, N>[] {
        while (!this.isAtEnd()) {
            this.nodes.push(this.parseStatement());
        }

        return this.nodes;
    }

    public get cursor (): number {
        return this.current;
    }

    public get SymbolTable (): SymbolTable {
        return this.context.symbolTable;
    }

    public peek(type: number | 'this' | 'next' | 'prev' = 'this'): Token {
        if (typeof type == 'number') return this.tokens[type];

        let targetIndex = this.cursor;

        if (type === 'next') targetIndex = this.cursor + 1;
        if (type === 'prev') targetIndex = this.cursor - 1;

        if (targetIndex < 0) {
            return {
                type: 'SOF',
                value: '',
                location: {
                    line: 1,
                    column: 1
                }
            } as SOF<T>;
        }

        if (targetIndex >= this.tokens.length) {
            return {
                type: 'EOF',
                value: '',
                location: this.tokens[this.tokens.length - 1]?.location || { line: 1, column: 1 }
            } as EOF<T>;
        }

        return this.tokens[targetIndex];
    }

    public isAtEnd (): boolean {
        return this.peek().type === 'EOF' || this.current >= this.tokens.length;
    }

    /**
     * @method match
     * @description Checks if the current token matches any of the provided types.
     * If it matches, it consumes the token and returns true.
     * @param {string | string[]} types - The token type(s) to check against.
     * @returns {boolean} True if the token was matched and consumed.
     */
    public match(types: string | string[]): boolean {
        const expected = Array.isArray(types) ? types : [types];
        const currentToken = this.peek();

        if (expected.includes(currentToken.type)) {
            this.current++;
            return true;
        }

        return false;
    }

    consume(expectedTypes: string | string[], message?: string): Token {
        const token = this.peek();
        const expected = Array.isArray(expectedTypes) ? expectedTypes : [expectedTypes];

        if (expected.includes(token.type)) return this.tokens[this.current++];

        let customMessage = message;
        
        if (!customMessage) {
            const hint = SUGGESTIONS[expected[0]];
            customMessage = hint
                ? hint
                : `Esperaba un elemento de tipo '${expected.join(' o ')}'`;
        }

        throw new ChordError(
            ErrorLevel.Parser,
            `${customMessage}. (En su lugar se encontró '${token.value}')`,
            token.location
        ).format();
    }

    public createNode<NodeType extends ASTNode<T, N>> (node: Omit<NodeType, 'location'>): NodeType {
        const token: Token = this.peek('prev');

        return {
            ...node,
            location: token.location
        } as NodeType;
    }

    public parseCustomStatement (): ASTNode<T, N> | null {
        return null;
    }

    public parseStatement (): ASTNode<T, N> {
        return this.get(StatementParser).parse();
    }

    public parseExpression (): ASTNode<T, N> {
        return this.get(ExpressionParser).parse();
    }
}