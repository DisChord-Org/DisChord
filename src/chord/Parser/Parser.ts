import { TokenStream } from "./TokenStream";
import { ChordError, ErrorLevel } from "../../errors/ChordError";
import { ASTNode, Token, TokenType, BaseNode, PeekType, Location, TokenTypeUnion } from "../model/types";

import { CompilationContext } from "../model/CompilationContext";
import { DeclarationLog } from "../model/DeclarationLog";
import { ParserContext } from "./ParserContext";
import { SubParser, SubParserClass } from "./SubParser";
import { SymbolTable } from "../model/SymbolsTable";
import { KeyWords } from "../KeywordsManager";
import { CoreLibUtils } from "../corelib/CoreLibUtils";

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

    /** Where the token stream was when the statement of the top level being parsed began. */
    private topLevelStart = 0;

    /**
     * Every name the parsed source declares, with where it is written and what it belongs to.
     * @public
     * @readonly
     * @type {DeclarationLog<T>}
     */
    public readonly declarations: DeclarationLog<T> = new DeclarationLog<T>();
    
    /** The tokens being parsed and the cursor over them. */
    private readonly stream: TokenStream<T>;

    /**
     * Creates an instance of the Parser orchestrator.
     *
     * @constructor
     * @param {Token<T>[]} tokens - Array of lexed tokens to consume during parsing.
     * @param {number} [current=0] - Starting index cursor in the token stream.
     * @param {CompilationContext<T>} context - Global compilation context holding compiler utilities like Symbols Table.
     */
    constructor(
        tokens: Token<T>[],
        current: number = 0,
        private context: CompilationContext<T>
    ) {
        super();

        this.stream = new TokenStream(tokens, current);

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
        Parser.registerKeywords(context.keywordsManager);
    }

    /**
     * Registers the keywords the structural grammar components bring into a keywords registry.
     * @protected
     * @static
     * @param {KeyWords<string>} keywordsManager - The registry to add the keywords to.
     * @returns {void}
     */
    protected static registerKeywords (keywordsManager: KeyWords<string>): void {
        Parser.SubParsers.forEach(instance => keywordsManager.extendWith(instance.keywords));
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
            this.topLevelStart = this.cursor;
            const node: ASTNode<T, N> = this.parseStatement();
            if (node) this.nodes.push(node);
        }

        return this.nodes;
    }

    /**
     * Fails at the current token if a construct that is a module of its own (a command, an event)
     * is not a statement of the top level of the file. Called by its parser before it consumes
     * the keyword, or right after the `nuevo` that comes before it.
     *
     * @public
     * @param {string} construct - How the message names it.
     * @throws {ChordError} If it sits inside a function, a class, a block...
     */
    public requireTopLevel (construct: string): void {
        if (this.cursor - this.topLevelStart <= 1) return;

        throw new ChordError({
            phase: ErrorLevel.Parser,
            message: `'${construct}' solo puede declararse en el nivel superior del archivo, no dentro de una función, una clase u otro bloque`,
            location: this.peek().location
        });
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
     * Accessor to retrieve the core library lookups of the dialect being compiled.
     * @public
     * @readonly
     * @type {CoreLibUtils}
     */
    public get CoreLib (): CoreLibUtils {
        return this.context.coreLib;
    }

    /** Inserts a token into the stream ahead of the cursor, to close with a separator an entry the grammar would otherwise run on into the next one. */
    public insertToken (index: number, token: Token<T>): void {
        this.stream.insertToken(index, token);
    }

    /** The current index of the cursor over the token stream. */
    public get cursor (): number {
        return this.stream.cursor;
    }

    /** Looks at a token relative to the cursor without consuming it. */
    public peek(type: PeekType = 'this'): Token<T> {
        return this.stream.peek(type);
    }

    /** Whether the cursor has reached the end of the token stream. */
    public isAtEnd (): boolean {
        return this.stream.isAtEnd();
    }

    /** Consumes the current token and returns true if it is one of the given types. */
    public match(types: string | string[]): boolean {
        return this.stream.match(types);
    }

    /** Consumes the expected token, or throws a diagnostic with a hint if the current one is another. */
    public consume(expectedTypes: string | string[], message?: string): Token<T> {
        return this.stream.consume(expectedTypes, message);
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
     * Detects and parses the beginner-friendly class declaration shorthand, expected to be
     * called right after an already-consumed `nuevo` token: `nuevo <ClaseBase> <Nombre> { ... }`.
     * The grammar lives in {@link ClassParser.tryParseShorthand}; the dialects call it from here.
     *
     * @public
     * @returns {ASTNode<T, N> | null} The parsed class declaration, or null if the upcoming tokens
     * don't match the shorthand shape (in which case nothing is consumed).
     */
    public tryParseClassShorthand (): ASTNode<T, N> | null {
        return this.get(ClassParser).tryParseShorthand();
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

    /**
     * Parses a single statement, polymorphic over dialect overrides (e.g. `DisChordParser`
     * routes this through `DisChordStatementParser` to apply its own statement-level handling —
     * notably, binding a reusable name to a `nuevo embed`/`nuevo boton` declaration). Any
     * SubParser that needs "parse whatever comes next as a statement" (a block body, a BDO's
     * executable statements, an exported declaration, ...) should call this — not
     * `this.parent.get(StatementParser).parse()` directly, which always resolves to the native
     * Chord StatementParser and silently skips dialect-level statement handling.
     *
     * @public
     */
    public parseStatement (): ASTNode<T, N> {
        return this.get(StatementParser).parse();
    }

    /**
     * Parses a `{ ... }` block and answers its statements.
     *
     * @public
     */
    public parseBlockBody (): ASTNode<T, N>[] {
        return this.get(BlockParser).parse().body;
    }
}