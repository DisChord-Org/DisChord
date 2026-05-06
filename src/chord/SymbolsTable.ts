import { Location, Symbol, SymbolKind } from "./types";
import { ChordError, ErrorLevel } from "../ChordError";

/**
 * Manages the hierarchical symbol table for the DisChord language.
 * 
 * This class handles lexical scoping (scopes) using a stack of maps. 
 * It allows for symbol registration, lookups across scope boundaries, 
 * and prevents duplicate declarations within the same scope.
 */
export class SymbolTable {
    /** 
     * A stack of symbol maps representing nested scopes. 
     * The first element is the global scope, and the last is the current local scope.
     */
    private scopes: Map<string, Symbol>[] = [ new Map() ];

    /**
     * Creates and enters a new lexical scope (e.g., when entering a block, function, or class).
     */
    public pushScope(): void {
        this.scopes.push(new Map());
    }

    /**
     * Exits the current local scope and returns to the parent scope.
     * Prevents popping the global scope.
     */
    public popScope(): void {
        if (this.scopes.length > 1) this.scopes.pop();
    }

    /**
     * Registers a new symbol in the current scope.
     * 
     * @param {string} name - The identifier name of the symbol.
     * @param {Partial<Symbol>} info - Metadata and kind (Function, Variable, etc.) of the symbol.
     * @param {Location} location - Source code coordinates for error reporting.
     * @throws {ChordError} If the identifier is already declared in the current scope.
     */
    public register(name: string, info: Partial<Symbol>, location: Location): void {
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

    /**
     * Searches for a symbol by its identifier name.
     * Performs a bottom-up search starting from the current scope up to the global scope.
     * 
     * @param {string} name - The identifier name to find.
     * @returns {Symbol | undefined} The symbol if found, otherwise undefined.
     */
    public lookup(name: string): Symbol | undefined {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].has(name)) {
                return this.scopes[i].get(name);
            }
        }
        return undefined;
    }
}