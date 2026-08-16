import { SubParser } from "../../SubParser";
import { ClassNode, ASTNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
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

    /**
     * Parses the traditional class declaration: `clase <Nombre> [extiende <ClaseBase>] { ... }`.
     */
    public parse(): ClassNode<T, N> {
        this.consume(TokenType.Clase);
        const id = this.consume(TokenType.IDENTIFICADOR, 'Se debe especificar el nombre de la clase').value;

        let superClass: string | undefined = undefined;
        if (this.match(TokenType.Extiende)) {
            superClass = this.consume(TokenType.IDENTIFICADOR, "Se debe especificar el nombre de la clase padre").value;
        }

        return this.buildClassNode(id, superClass);
    }

    /**
     * Parses the beginner-friendly shorthand class declaration: `<ClaseBase> <Nombre> { ... }`
     * (invoked after the caller has already consumed the leading `nuevo` token).
     * Equivalent to `clase <Nombre> extiende <ClaseBase> { ... }`.
     */
    public parseShorthand(): ClassNode<T, N> {
        const superClass = this.consume(TokenType.IDENTIFICADOR, "Se debe especificar el nombre de la clase base").value;
        const id = this.consume(TokenType.IDENTIFICADOR, "Se debe especificar el nombre de la nueva clase").value;

        return this.buildClassNode(id, superClass);
    }

    /**
     * Parses the class's `{ ... }` body, shared by both the traditional and shorthand
     * declaration forms. Registering the class symbol and validating `superClass` (if any) is now
     * the Analyzer's job (`BindDeclarationsRule`) — see that class for why.
     */
    private buildClassNode(id: string, superClass: string | undefined): ClassNode<T, N> {
        this.consume(TokenType.L_BRACE, "Al declarar una clase debes usar '{'");

        const body = this.parseBody(id);

        this.consume(TokenType.R_BRACE);

        return this.createNode<ClassNode<T, N>>({
            type: TokenType.Clase,
            id,
            superClass,
            body
        });
    }

    /**
     * Parses the statements composing a class body.
     */
    private parseBody(id: string): ASTNode<T, N>[] {
        const body: ASTNode<T, N>[] = [];
        const statementParser = this.parent.get(StatementParser) as StatementParser<T, N>;

        while (this.peek().type !== TokenType.R_BRACE && !this.isAtEnd()) {
            body.push(statementParser.parse(id));
        }

        return body;
    }
}
