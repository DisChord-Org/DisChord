import { Location, Symbol, SymbolKind } from "./types";
import { ChordError, ErrorLevel } from "../ChordError";

export class SymbolTable {
    private scopes: Map<string, Symbol>[] = [ new Map() ];

    public pushScope() {
        this.scopes.push(new Map());
    }

    public popScope() {
        if (this.scopes.length > 1) this.scopes.pop();
    }

    public register(name: string, info: Partial<Symbol>, location: Location) {
        const currentScope = this.scopes[this.scopes.length - 1];
        
        if (currentScope.has(name)) {
            throw new ChordError(
                ErrorLevel.Parser,
                `Identificador duplicado: '${name}' ya ha sido declarado en este ámbito.`,
                location
            ).format();
        }

        currentScope.set(name, {
            name,
            kind: info.kind || SymbolKind.Variable,
            metadata: {
                isAsync: info.metadata?.isAsync || false,
                isExported: info.metadata?.isExported || false,
                isStatic: info.metadata?.isStatic || false
            }
        });
    }

    public lookup(name: string): Symbol | undefined {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].has(name)) {
                return this.scopes[i].get(name);
            }
        }
        return undefined;
    }
}