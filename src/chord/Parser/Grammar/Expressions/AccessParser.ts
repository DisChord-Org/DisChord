import { SubParser } from "../../subparser";
import { ASTNode, AccessNode, AccessNodeByIndex, BaseNode, CallNode, IdentificatorNode, TokenType, TokenTypeUnion } from "../../../types";
import { AssignmentParser } from "./AssignmentParser";
import { Parser } from "../../Parser";

export class AccessParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [];

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }
    
    public parse(startNode?: ASTNode<T, N>): ASTNode<T, N> {
        let node = startNode || this.createNode<IdentificatorNode<T>>({
            type: TokenType.IDENTIFICADOR,
            value: this.consume(TokenType.IDENTIFICADOR).value
        });

        while (true) {
            const next = this.peek();

            if (next.type === TokenType.Punto) {
                this.consume(TokenType.Punto);
                const property = this.consume(TokenType.IDENTIFICADOR, `Se esperaba un nombre tras '.'`);
                node = this.createNode<AccessNode<T, N>>({
                    type: TokenType.ACCESO,
                    object: node,
                    property: property.value
                });

                continue;
            }

            if (next.type === TokenType.L_SQUARE) {
                this.consume(TokenType.L_SQUARE);
                const index = this.parent.get(AssignmentParser).parse();
                this.consume(TokenType.R_SQUARE);

                node = this.createNode<AccessNodeByIndex<T, N>>({
                    type: TokenType.ACCESO_POR_INDICE,
                    object: node,
                    index
                });

                continue;
            }

            if (next.type === TokenType.L_PAREN) {
                this.consume(TokenType.L_PAREN);
                const args: ASTNode<T, N>[] = [];
                
                while (this.peek().type !== TokenType.R_PAREN) {
                    args.push(this.parent.get(AssignmentParser).parse());
                    if (this.peek().type === TokenType.COMA) this.consume(TokenType.COMA);
                }
                
                this.consume(TokenType.R_PAREN);
                node = this.createNode<CallNode<T, N>>({
                    type: TokenType.LLAMADA,
                    object: node,
                    params: args
                });
                continue;
            }

            break;
        }

        return node;
    }
}