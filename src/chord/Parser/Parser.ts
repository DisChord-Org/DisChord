import { SUGGESTIONS } from "./ParserErrorSuggestions";
import { ASTNode, Token, SOF, EOF, TokenType, BaseNode, PeekType, Location, TokenTypeUnion } from "../types";

import { ChordError, ErrorLevel } from "../../ChordError";
import { CompilationContext } from "../../init/Init";
import { ParserContext } from "./ParserContext";
import { SubParser, SubParserClass } from "./SubParser";
import { SymbolTable } from "../SymbolsTable";
import { KeyWords } from "../KeywordsManager";

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
import { ConditionParser } from "./Grammar/StatementParser/ConditionParser";
import { BlockParser } from "./Grammar/BlockParser";
import { LoopParser } from "./Grammar/StatementParser/LoopParser";
import { ReturnParser } from "./Grammar/StatementParser/ReturnParser";
import { PropertyParser } from "./Grammar/StatementParser/PropertyParser";
import { ImportParser } from "./Grammar/StatementParser/ModuleParser/ImportParser";
import { ExportParser } from "./Grammar/StatementParser/ModuleParser/ExportParser";
import { ClassParser } from "./Grammar/StatementParser/ClassParser";
import { ExitParser } from "./Grammar/StatementParser/FlowParser/ExitParser";
import { PassParser } from "./Grammar/StatementParser/FlowParser/PassParser";
import { FunctionParser } from "./Grammar/StatementParser/FunctionParser";

/**
 * Core parsing orchestrator for the DisChord transpile engine.
 * Responsabilities include token stream navigation, registry and routing of granular grammatical sub-parsers,
 * error boundary management with user-friendly diagnostics, and AST generation.
 *
 * @class Parser
 * @extends {ParserContext<T, N>}
 * @template T - The token type union constraint, extending string.
 * @template N - The base AST node model interface constraint.
 */
export class Parser<T extends string, N extends BaseNode<T>> extends ParserContext<T, N> {
    /**
     * Accumulated abstract syntax tree root-level nodes.
     * @public
     * @type {ASTNode<T, N>[]}
     */
    public nodes: ASTNode<T, N>[] = [];
    
    /**
     * Creates an instance of the Parser orchestrator.
     *
     * @constructor
     * @param {Token<T>[]} tokens - Array of lexed tokens to consume during parsing.
     * @param {number} [current=0] - Starting index cursor in the token stream.
     * @param {CompilationContext<T>} context - Global compilation context holding compiler utilities like Symbols Table.
     */
    constructor(
        private tokens: Token<T>[],
        private current: number = 0,
        private context: CompilationContext<T>
    ) {
        super();

        this.setOwner(this);
        this.registerInstances();
    }

    /**
     * Statically defined grammar sub-parsers collection mapping grammatical blocks to specialized handlers.
     * @private
     * @static
     * @type {SubParserClass<TokenType, BaseNode<TokenType>>[]}
     */
    private static SubParsers: SubParserClass<TokenType, BaseNode<TokenType>>[] = [
        AditiveParser, ArithmeticParser, AssignmentParser,
        ComparisionParser, ExpressionParser, LogicalParser,
        UnaryParser, BDOParser, PrimaryParser, LiteralParser,
        AccessParser, StatementParser, VariableParser,
        BlockParser, ConditionParser, LoopParser, ReturnParser,
        PropertyParser, ImportParser, ExportParser, ClassParser,
        ExitParser, PassParser, FunctionParser
    ];

    /**
     * Resolves and returns an instantiated SubParser capable of handling the current operational token type.
     * @param {TokenTypeUnion<TokenType>} tokenType - The current lookahead token type structure.
     * @returns {SubParser<T, N> | undefined} The resolved grammar controller executor, or undefined if unmapped.
     * @public
     */
    public getChordSubParserByToken(tokenType: TokenTypeUnion<T>): SubParser<T, N> | undefined {
        const TargetClass = Parser.SubParsers.find(p => p.triggerToken === tokenType);
        return TargetClass ? (this.get(TargetClass as unknown as SubParserClass<T, N>) as SubParser<T, N>) : undefined;
    }

    /**
     * Registers the structural grammar components with the compilation context.
     * @protected
     * @static
     * @param {CompilationContext<TokenTypeUnion<string>>} context - The compilation context to register the grammar with.
     * @returns {void}
     */
    protected static registerGrammar (context: CompilationContext<TokenTypeUnion<string>>): void {
        Parser.SubParsers.forEach(instance => {
            context.keywordsManager.extend(
                instance.keywords.reduce<Record<string, TokenTypeUnion<string>>>((accumulator, keyword) => {
                    accumulator[keyword] = keyword;

                    return accumulator;
                }, {})
            );
        });
    }

    /**
     * Binds instance-level routing tables for the injected SubParsers into the core execution context.
     * @protected
     * @returns {void}
     */
    protected registerInstances(): void {
        Parser.SubParsers.forEach(instance => {
            this.register(instance as unknown as SubParserClass<T, N>);
        });
    }

    /**
     * Processes the token stream to construct the final array of AST nodes.
     * Consumes expressions and statements iteratively until EOF is reached.
     *
     * @public
     * @returns {ASTNode<T, N>[]} The collection of parsed Abstract Syntax Tree root nodes.
     */
    public parse(): ASTNode<T, N>[] {
        while (!this.isAtEnd()) {
            const node: ASTNode<T, N> = this.parseStatement();
            if (node) this.nodes.push(node);
        }

        return this.nodes;
    }

    /**
     * Gets the current stream iteration cursor index.
     * * @public
     * @readonly
     * @type {number}
     */
    public get cursor (): number {
        return this.current;
    }

    /**
     * Accessor to get the global compilation Symbols Table mapping.
     * * @public
     * @readonly
     * @type {SymbolTable}
     */
    public get SymbolTable (): SymbolTable {
        return this.context.symbolTable;
    }

    /**
     * Accessor to retrieve the keywords manager instance.
     * * @public
     * @readonly
     * @type {KeyWords<T>}
     */
    public get KeywordsManager (): KeyWords<T> {
        return this.context.keywordsManager;
    }

    /**
     * Performs an observation lookahead on the token stream relative to the cursor position without consuming tokens.
     *
     * @public
     * @param {PeekType} [type='this'] - The offset instruction ('this', 'next', 'prev' or raw index integer).
     * @returns {Token<T>} The inspected token at the target relative position.
     */
    public peek(type: PeekType = 'this'): Token<T> {
        if (typeof type == 'number') return this.tokens[type];

        let targetIndex = this.cursor;

        if (type === 'next') targetIndex = this.cursor + 1;
        if (type === 'prev') targetIndex = this.cursor - 1;

        if (targetIndex < 0) {
            return {
                type: TokenType.SOF,
                value: '',
                location: {
                    line: 1,
                    column: 1
                }
            } as SOF<T>;
        }

        if (targetIndex >= this.tokens.length) {
            return {
                type: TokenType.EOF,
                value: '',
                location: this.tokens[this.tokens.length - 1]?.location || { line: 1, column: 1 }
            } as EOF<T>;
        }

        return this.tokens[targetIndex];
    }

    /**
     * Verifies if the parsing iteration has reached the end of the token stream or hit EOF.
     *
     * @public
     * @returns {boolean} True if no further tokens are available to parse.
     */
    public isAtEnd (): boolean {
        return this.peek().type === TokenType.EOF || this.current >= this.tokens.length;
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
            this.consume(currentToken.type);
            return true;
        }

        return false;
    }

    /**
     * Guarantees the presence of a specific token type next in the stream. Consumes it if valid.
     * Throws a formatted diagnostic error containing localized user-friendly hints if validation fails.
     *
     * @public
     * @param {string | string[]} expectedTypes - Token types expected to be at the cursor.
     * @param {string} [message] - Optional override message for the parsing mismatch.
     * @throws {ChordError} If the current token does not match any of the expected types.
     * @returns {Token<T>} The matched and consumed token.
     */
    public consume(expectedTypes: string | string[], message?: string): Token<T> {
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

        throw new ChordError({
            phase: ErrorLevel.Parser,
            message: `${customMessage}. (En su lugar se encontró '${token.value}')`,
            location: token.location
        }).format();
    }

    /**
     * Factory utility to instantiate AST nodes binding automatic location tracking metadata relative to the previous token.
     *
     * @public
     * @template NodeType - The structural node target type extending ASTNode.
     * @param {Omit<NodeType, 'location'> & { location?: Location }} node - The node structure payload.
     * @returns {NodeType} The fully built AST node structure decorated with location details.
     */
    public createNode<NodeType extends ASTNode<T, N>> (node: Omit<NodeType, 'location'> & { location?: Location }): NodeType {
        const token: Token<T> = this.peek('prev');

        return {
            ...node,
            location: token.location
        } as NodeType;
    }

    /**
     * Extensibility hook intended for parsing custom dialect elements or macro statements.
     *
     * @public
     * @returns {ASTNode<T, N> | null} Parsed customized ASTNode or null if not applicable.
     */
    public parseCustomStatement (): ASTNode<T, N> | null {
        return null;
    }

    protected parseStatement (): ASTNode<T, N> {
        return this.get(StatementParser).parse();
    }

    /**
     * @deprecated
     */
    public parseExpression (): ASTNode<T, N> {
        return this.get(ExpressionParser).parse();
    }
}