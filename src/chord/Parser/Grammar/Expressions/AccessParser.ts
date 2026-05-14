import { SubParser } from "../../subparser";
import { ASTNode, AccessNode, AccessNodeByIndex, CallNode, IdentificatorNode } from "../../../types";
import { AssignmentParser } from "./AssignmentParser";
import { Parser } from "../../parser";

export class AccessParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = '';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }
    
    public parse(startNode?: ASTNode<T, N>): ASTNode<T, N> {
        let node = startNode || this.createNode<IdentificatorNode<T>>({
            type: 'Identificador',
            value: this.consume('IDENTIFICADOR').value
        });

        while (true) {
            const next = this.peek();

            if (next.type === '.') {
                this.consume('.');
                const property = this.consume('IDENTIFICADOR', `Se esperaba un nombre tras '.'`);
                node = this.createNode<AccessNode<T, N>>({
                    type: 'Acceso',
                    object: node,
                    property: property.value
                });

                continue;
            }

            if (next.type === 'L_SQUARE') {
                this.consume('L_SQUARE');
                const index = this.parent.get(AssignmentParser).parse();
                this.consume('R_SQUARE');

                node = this.createNode<AccessNodeByIndex<T, N>>({
                    type: 'AccesoPorIndice',
                    object: node,
                    index
                });

                continue;
            }

            if (next.type === 'L_EXPRESSION') {
                this.consume('L_EXPRESSION');
                const args: ASTNode<T, N>[] = [];
                
                while (this.peek().type !== 'R_EXPRESSION') {
                    args.push(this.parent.get(AssignmentParser).parse());
                    if (this.peek().type === ',') this.consume(',');
                }
                
                this.consume('R_EXPRESSION');
                node = this.createNode<CallNode<T, N>>({
                    type: 'Llamada',
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