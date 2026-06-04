import { SubParser } from "../../SubParser";
import { ClassNode, SymbolKind, ASTNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { StatementParser } from "./StatementParser";
import { Parser } from "../../Parser";

export class ClassParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Clase;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Clase, TokenType.Extiende ];

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): ClassNode<T, N> {
        this.consume(TokenType.Clase);
        const id = this.consume(TokenType.IDENTIFICADOR, 'Se debe especificar el nombre de la clase').value;
        
        let superClass = undefined;
        if (this.match(TokenType.Extiende)) {
            superClass = this.consume(TokenType.IDENTIFICADOR, "Se debe especificar el nombre de la clase padre").value;
        }

        this.consume(TokenType.L_BRACE, "Al declarar una clase debes usar '{'");

        const body: ASTNode<T, N>[] = [];
        const statementParser = this.parent.get(StatementParser) as StatementParser<T, N>;

        while (this.peek().type !== TokenType.R_BRACE && !this.isAtEnd()) {
            body.push(statementParser.parse(id));
        }

        this.consume(TokenType.R_BRACE);

        this.SymbolTable.register(id, {
            name: id,
            kind: SymbolKind.Class
        }, this.peek('prev').location);

        return this.createNode<ClassNode<T, N>>({
            type: TokenType.Clase,
            id,
            superClass,
            body
        });
    }
}