import { SubParser } from "../../subparser";
import { ClassNode, SymbolKind, ASTNode } from "../../../types";
import { StatementParser } from "./StatementParser";
import { Parser } from "../../parser";

export class ClassParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = 'CLASE';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): ClassNode<T, N> {
        this.consume('CLASE');
        const id = this.consume('IDENTIFICADOR', 'Se debe especificar el nombre de la clase').value;
        
        let superClass = undefined;
        if (this.match('EXTIENDE')) {
            superClass = this.consume('IDENTIFICADOR', "Se debe especificar el nombre de la clase padre").value;
        }

        this.consume('L_BRACE', "Al declarar una clase debes usar '{'");

        const body: ASTNode<T, N>[] = [];
        const statementParser = this.parent.get(StatementParser) as StatementParser<T, N>;

        while (this.peek().type !== 'R_BRACE' && !this.isAtEnd()) {
            body.push(statementParser.parse(id));
        }

        this.consume('R_BRACE');

        this.SymbolTable.register(id, {
            name: id,
            kind: SymbolKind.Class
        }, this.peek('prev').location);

        return this.createNode<ClassNode<T, N>>({
            type: 'Clase',
            id,
            superClass,
            body
        });
    }
}