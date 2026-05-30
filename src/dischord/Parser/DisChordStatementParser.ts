import { TokenType, TokenTypeUnion } from '../../chord/types';
import { SubParser } from '../../chord/Parser/subparser';
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from '../types';
import { DisChordError, ErrorLevel } from '../../ChordError';
import { Parser } from '../../chord/Parser/parser';
import { StatementParser } from '../../chord/Parser/Grammar/StatementParser/StatementParser';
import { DisChordParser } from './parser';

/**
 * @class DisChordStatementParser
 * @description Specialized sub-parser that intercepts and orchestrates top-level statements for DisChord.
 * It handles custom syntax and falls back to native Chord statements when necessary.
 * @extends {SubParser<DisChordNodeType, DisChordNode>}
 */
export default class DisChordStatementParser extends SubParser<DisChordNodeType, DisChordNode> {
    /** To identify when this parser should be used */
    static triggerToken: DisChordNodeType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<DisChordNodeType>[] = []; // We dont implement 'nuevo' because its injected by the Chord Engine.

    /**
     * @param parent - The main Parser context for token expression handling
     */
    constructor (protected parent: Parser<DisChordNodeType, DisChordNode>) {
        super(parent);
    };

    /**
     * Executes the syntactic analysis for the statement.
     * @returns {DisChordASTNode} The constructed abstract syntax tree node.
     * @throws {DisChordError} If 'nuevo' is followed by an invalid or unregistered architectural component.
     * @override
     */
    public parse(): DisChordASTNode {
        const token = this.peek();

        if (token.type === TokenType.Nuevo) {
            this.consume(TokenType.Nuevo);

            const customStatement = this.parent.parseCustomStatement();

            if (!customStatement) {
                const nextToken = this.peek();

                throw new DisChordError({
                    phase: ErrorLevel.Parser,
                    message: `Estructura de inicialización inválida después de 'nuevo'. Se encontró '${nextToken.value}'`,
                    location: nextToken.location
                }).format();
            }

            return customStatement;
        }

        return (this.parent as DisChordParser).parseNativeStatement();
    }
}