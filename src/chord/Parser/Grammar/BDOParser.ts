import { ChordError, ErrorLevel } from "../../../ChordError";
import { ASTNode, BaseNode, ODBMode, ODBNode, TokenType, TokenTypeUnion } from "../../types";
import { Parser } from "../parser";
import { SubParser } from "../subparser";
import { ExpressionParser } from "./Expressions/ExpressionParser";

/**
 * Specialized SubParser for Object Data Blocks (BDO).
 */
export class BDOParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.L_BRACE;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [];

    /**
     * Stores the mode for the next parsing operation. 
     * Defaults to Simple but can be upgraded to Intelligent via decorators.
     */
    private nextMode: ODBMode = ODBMode.Simple;

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    /**
     * Configures the behavior mode for the upcoming ODB parsing.
     * @param mode - The ODBMode to apply (Simple or Intelligent).
     * @returns The current instance for method chaining.
     */
    public setMode (mode: ODBMode): this {
        this.nextMode = mode;
        return this;
    }

    /**
     * Entry point for the SubParser.
     * Consumes the BDO, generates the node, and resets the configuration mode.
     */
    public parse(): ASTNode<T, N> {
        const node = this.parseODB(this.nextMode);
        this.nextMode = ODBMode.Simple;
        return node;
    }

    /**
     * Main ODB parsing logic.
     * Iterates through the block content, distinguishing between property assignments
     * and standard language statements based on syntax patterns and the current mode.
     * @param mode - Initial mode for the ODB.
     * @returns A constructed ODBNode containing properties (blocks) and logic (body).
     * @throws {ChordError} If style rules are violated (e.g., missing ';' in BDOI).
     */
    private parseODB(mode: ODBMode = ODBMode.Simple): ODBNode<T, N> {
        this.consume(TokenType.L_BRACE);
    
        const blocks: Record<string, ASTNode<T, N>> = {};
        const body: ASTNode<T, N>[] = [];
        let definitionMode: boolean = true;

        while (this.peek().type !== TokenType.R_BRACE) {
            if (definitionMode && this.checkPropertyPattern(mode)) {
                const key = this.consume(TokenType.IDENTIFICADOR, 'Se esperaba un nombre de la propiedad').value;
                const value = this.parent.get(ExpressionParser).parse();

                if (this.peek().type === TokenType.SEPARADOR) {
                    if (mode === ODBMode.Simple) mode = ODBMode.Intelligent;
                    this.consume(TokenType.SEPARADOR, 'En un BDOI, las definiciones deben terminar con ";"');
                } else if (mode === ODBMode.Intelligent) {
                    throw new ChordError({
                        phase: ErrorLevel.Parser,
                        message: `En un BDO inteligente, la propiedad '${key}' debe terminar en ';'`,
                        location: this.peek().location
                    }).format();
                }

                blocks[key] = value;
            } else {
                if (mode === ODBMode.Simple) {
                    if (Object.keys(blocks).length > 0) {
                        throw new ChordError({
                            phase: ErrorLevel.Parser,
                            message: `Conflicto de estilo: Si el BDO contiene código ejecutable, todas las propiedades superiores deben terminar en ";"`,
                            location: this.peek().location
                        }).format();
                    }
                    mode = ODBMode.Intelligent;
                }
                definitionMode = false;

                const statement = this.parent.get(ExpressionParser).parse();
                if (statement) body.push(statement);
            }
        }
    
        this.consume(TokenType.R_BRACE);
    
        return this.createNode<ODBNode<T, N>>({
            type: TokenType.BDO,
            mode,
            blocks,
            body
        });
    }

    /**
     * Heuristic analysis to determine if the upcoming tokens represent a property assignment.
     * @param mode - The current ODBMode.
     * @returns True if the pattern matches a property.
     */
    private checkPropertyPattern(mode: ODBMode): boolean {
        const current = this.peek();
        const next = this.peek('next');

        if (current.type !== TokenType.IDENTIFICADOR) return false;
        if (this.parent.KeywordsManager.isKeyword(current.value)) return false;
        if (this.parent.KeywordsManager.isKeyword(next.value)) return false;
        if (next.type === TokenType.Punto) return false;
        if (mode === ODBMode.Simple && this.lookAheadForToken(TokenType.SEPARADOR)) return true;
        if (mode === ODBMode.Intelligent) return this.lookAheadForToken(TokenType.SEPARADOR);

        return true;
    }

    /**
     * Scans forward in the token stream within the current brace level 
     * to find a specific token type.
     * @param type - The token type to search for.
     * @returns True if the token is found before the block closes or EOF.
     */
    private lookAheadForToken(type: string): boolean {
        let i = this.parent.cursor;
        let nestingLevel = 0;

        while (true) {
            const token = this.peek(i);

            if (token.type === TokenType.L_BRACE) nestingLevel++;
            if (token.type === TokenType.R_BRACE) {
                if (nestingLevel === 0) return false;
                nestingLevel--;
            }

            if (nestingLevel === 0 && token.type === type) return true;

            if (token.type === TokenType.EOF) return false;
            i++;
        }
    }
}