import { SubParser } from "../../SubParser";
import { ClassNode, SymbolKind, ASTNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { StatementParser } from "./StatementParser";
import { Parser } from "../../Parser";
import { ChordError, ErrorLevel } from "../../../../errors/ChordError";

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
            this.assertClassExists(superClass);
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
        this.assertClassExists(superClass);

        const id = this.consume(TokenType.IDENTIFICADOR, "Se debe especificar el nombre de la nueva clase").value;

        return this.buildClassNode(id, superClass);
    }

    /**
     * Registers the class symbol and parses its `{ ... }` body, shared by both the
     * traditional and shorthand declaration forms.
     */
    private buildClassNode(id: string, superClass: string | undefined): ClassNode<T, N> {
        this.SymbolTable.register(id, {
            name: id,
            kind: SymbolKind.Class
        }, this.peek('prev').location);

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
     * Parses the statements composing a class body inside its own lexical scope.
     */
    private parseBody(id: string): ASTNode<T, N>[] {
        const body: ASTNode<T, N>[] = [];
        const statementParser = this.parent.get(StatementParser) as StatementParser<T, N>;

        this.SymbolTable.pushScope();

        while (this.peek().type !== TokenType.R_BRACE && !this.isAtEnd()) {
            body.push(statementParser.parse(id));
        }

        this.SymbolTable.popScope();

        return body;
    }

    /**
     * Ensures a referenced base class was already declared before being extended.
     * @throws {ChordError} If the identifier does not resolve to a previously declared class.
     */
    private assertClassExists(name: string): void {
        const symbol = this.SymbolTable.lookup(name);

        if (!symbol || symbol.kind !== SymbolKind.Class) {
            throw new ChordError({
                phase: ErrorLevel.Parser,
                message: `Clase base '${name}' no declarada. Una clase debe declararse antes de poder ser extendida.`,
                location: this.peek('prev').location
            }).format();
        }
    }
}
