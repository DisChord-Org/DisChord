import { SubParser } from "../../subparser";
import { ImportNode } from "../../../types";
import { Parser } from "../../parser";

export class ImportParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = 'SI';
    
    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): ImportNode<T, N> {
        this.consume('IMPORTAR');
        
        const identificators: string[] = [];
        const isDestructured = this.match('L_BRACE');

        if (isDestructured) {
            while (!this.match('R_BRACE') && !this.isAtEnd()) {
                identificators.push(this.consume('IDENTIFICADOR', "Se esperaba un nombre para importar").value);
                this.match(',');
            }
            this.consume('R_BRACE');
        } else {
            identificators.push(this.consume('IDENTIFICADOR', "Se esperaba un nombre tras 'importar'").value);
        }

        this.consume('DESDE', "Falta la palabra clave 'desde'");
        const path = this.consume('TEXTO', "Se requiere la ruta del módulo").value;

        return this.createNode<ImportNode<T, N>>({
            type: 'Importar',
            identificators,
            path,
            isDestructured
        });
    }
}