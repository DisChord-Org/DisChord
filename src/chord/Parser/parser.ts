import { ChordError, ErrorLevel } from "../../ChordError";
import { SUGGESTIONS } from "../core.lib";
import { ASTNode, Token, SOF, EOF } from "./../types";

import { BDOParser } from "./Grammar/BDOParser";
import { AditiveParser } from "./Grammar/Expressions/AditiveParser";
import { ArithmeticParser } from "./Grammar/Expressions/ArithmeticParser";
import { AssignmentParser } from "./Grammar/Expressions/AssignmentParser";
import { ComparisionParser } from "./Grammar/Expressions/ComparisionParser";
import { ExpressionParser } from "./Grammar/Expressions/ExpressionParser";
import { LiteralParser } from "./Grammar/Expressions/LiteralParser";
import { LogicalParser } from "./Grammar/Expressions/LogicalParser";
import { UnaryParser } from "./Grammar/Expressions/UnaryParser";
import { PrimaryParser } from "./Grammar/PrimaryParser/PrimaryParser";

import { ParserContext } from "./ParserContext";
import { SubParserClass } from "./subparser";

export class Parser<T = never, N = never> extends ParserContext<T, N> {
    public nodes: ASTNode<T, N>[] = [];

    constructor(
        private tokens: Token[],
        private current: number = 0
    ) {
        super();

        this.setOwner(this as unknown as Parser<T, N>);
        this.registerInstances();
    }

    private registerInstances () {
        const instances: SubParserClass[] = [
            AditiveParser, ArithmeticParser, AssignmentParser,
            ComparisionParser, ExpressionParser, LogicalParser,
            UnaryParser, BDOParser, PrimaryParser, LiteralParser
        ];
        
        instances.forEach(instance => this.register(instance));
    }

    public parse(): ASTNode<T, N>[] {
        while (this.cursor < this.tokens.length) {
            this.nodes.push(this.get(ExpressionParser).parse());
        }
        return this.nodes;
    }

    public get cursor (): number {
        return this.current;
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

    public parseCustomStatement(): ASTNode<T, N> | null {
        return null;
    }

    private parseExpression(): ASTNode<T, N> {
        return this.get(ExpressionParser).parse();
    }
}