import { Location, Symbol, SymbolKind, CompilerMetadataKind, TokenType } from "./types";
import { DataType } from "./DataType";
import { ChordError, ErrorLevel } from "../errors/ChordError";

/**
 * How a method call on a receiver of union type is emitted, when it isn't by the member's name:
 * as a call to `member` on the receiver, or as a call to the runtime helper `helper` with the
 * receiver as its first argument.
 */
export type CallDispatch = { readonly member: string } | { readonly helper: string };

/**
 * What a member access is used as, which decides whether a core library name is rewritten: a
 * method only as the `callee` of a call, a property only as a `read`, never as an `assignment` target.
 */
export type AccessRole = 'callee' | 'assignment' | 'read';

/**
 * One lexical scope: the symbols declared in it plus its contextual compilation metadata.
 */
interface Scope {
    symbols: Map<string, Symbol>;
    metadata: Map<CompilerMetadataKind, unknown>;
}

/**
 * Manages the hierarchical symbol table for the DisChord language.
 * 
 * This class handles lexical scoping (scopes) using a stack of maps. 
 * It allows for symbol registration, lookups across scope boundaries, 
 * and prevents duplicate declarations within the same scope.
 */
export class SymbolTable {
    /**
     * A stack of scopes. The first element is the global scope, and the last is the current
     * local scope.
     */
    private scopes: Scope[] = [ SymbolTable.createScope() ];

    /**
     * Scopes bound to the AST node that owns them (a class, a function, a command...), so every
     * pass and the generator reopening the same node land on the same symbols.
     */
    private readonly nodeScopes: WeakMap<object, Scope> = new WeakMap();

    /**
     * Node types that own a scope for their body. Chord's own are classes and functions; a
     * dialect adds its own through {@link registerScopeOwner}.
     */
    private readonly scopeOwnerTypes: Set<string> = new Set([ TokenType.Clase, TokenType.Funcion ]);

    /**
     * The subset of scope owners whose body runs inside an async context, so it may `await`
     * (a function is async only if marked, so it's not listed here).
     */
    private readonly asyncBodyTypes: Set<string> = new Set();

    /**
     * Every class declared in the file by name, with its parent class and the scope holding its
     * members, so a method can be found from a class name and through inheritance.
     */
    private readonly classes: Map<string, { superClass?: string; scope: Scope }> = new Map();

    /**
     * Calls the analyzer decided must be awaited (see {@link markAwaited}).
     */
    private readonly awaitedCalls: WeakSet<object> = new WeakSet();

    /**
     * The name each member access is emitted with (see {@link markMember}).
     */
    private readonly memberNames: WeakMap<object, string> = new WeakMap();

    /**
     * Member accesses that are the callee of a call (see {@link markCallee}).
     */
    private readonly calleeAccesses: WeakSet<object> = new WeakSet();

    /**
     * Member accesses that are the target of an assignment (see {@link markAssignmentTarget}).
     */
    private readonly assignmentTargets: WeakSet<object> = new WeakSet();

    /**
     * Calls on a receiver of union type that the analyzer decided to emit differently (see
     * {@link markDispatched}).
     */
    private readonly dispatchedCalls: WeakMap<object, CallDispatch> = new WeakMap();

    private static createScope(): Scope {
        return { symbols: new Map(), metadata: new Map() };
    }

    /**
     * Declares that nodes of `type` own a scope for their body.
     *
     * @param {string} type - The node type string.
     * @param {boolean} [asyncBody=false] - Whether the body runs in an async context.
     */
    public registerScopeOwner(type: string, asyncBody: boolean = false): void {
        this.scopeOwnerTypes.add(type);
        if (asyncBody) this.asyncBodyTypes.add(type);
    }

    /**
     * Whether the body of `node` always runs in an async context (see {@link registerScopeOwner}).
     *
     * @param {{ type: string }} node - The AST node to check.
     * @returns {boolean}
     */
    public hasAsyncBody(node: { type: string }): boolean {
        return this.asyncBodyTypes.has(node.type);
    }

    /**
     * Records the class being declared, whose scope must be the current one, so its members can be
     * found by class name later.
     *
     * @param {string} name - The class name.
     * @param {string} [superClass] - The name of the class it extends, if any.
     */
    public registerClass(name: string, superClass?: string): void {
        this.classes.set(name, { superClass, scope: this.scopes[this.scopes.length - 1] });
    }

    /**
     * @param {string} name - A class name.
     * @returns {boolean} Whether a class with that name is declared in the file.
     */
    public isUserClass(name: string): boolean {
        return this.classes.has(name);
    }

    /**
     * @param {string} name - A user class name.
     * @returns {string | undefined} The class it extends, if any.
     */
    public superClassOf(name: string): string | undefined {
        return this.classes.get(name)?.superClass;
    }

    /**
     * Finds a member in a user class, searching its parent classes in turn. A parent that isn't a
     * class of this file ends the search, since what it holds is unknown.
     *
     * @param {string} className - A user class name.
     * @param {string} member - The member name.
     * @returns {Symbol | undefined} The member, or `undefined` if it isn't found in the chain.
     */
    public findMember(className: string, member: string): Symbol | undefined {
        const seen = new Set<string>();
        let current: string | undefined = className;

        while (current !== undefined && !seen.has(current)) {
            seen.add(current);
            const entry = this.classes.get(current);
            if (!entry) return undefined;

            const symbol = entry.scope.symbols.get(member);
            if (symbol) return symbol;

            current = entry.superClass;
        }

        return undefined;
    }

    /**
     * @param {string} member - A member name.
     * @returns {Symbol[]} The member as declared by each class of the file that declares it itself.
     */
    public membersNamed(member: string): Symbol[] {
        return [...this.classes.values()]
            .map(entry => entry.scope.symbols.get(member))
            .filter((symbol): symbol is Symbol => symbol !== undefined);
    }

    /**
     * @param {string} member - A member name.
     * @returns {boolean} Whether any class of the file declares a member with that name itself.
     */
    public hasMemberNamed(member: string): boolean {
        return this.membersNamed(member).length > 0;
    }

    /**
     * Records that the analyzer decided this call must be awaited, so the generator only has to
     * read the decision.
     *
     * @param {object} call - The call node.
     */
    public markAwaited(call: object): void {
        this.awaitedCalls.add(call);
    }

    /**
     * @param {object} call - The call node.
     * @returns {boolean} Whether the analyzer decided this call must be awaited.
     */
    public isAwaited(call: object): boolean {
        return this.awaitedCalls.has(call);
    }

    /**
     * Records that a member access is the callee of a call (`objeto.metodo(...)`).
     *
     * @param {object} access - The access node.
     */
    public markCallee(access: object): void {
        this.calleeAccesses.add(access);
    }

    /**
     * Records that a member access is the target of an assignment (`objeto.campo es valor`).
     *
     * @param {object} access - The access node.
     */
    public markAssignmentTarget(access: object): void {
        this.assignmentTargets.add(access);
    }

    /**
     * @param {object} access - The access node.
     * @returns {AccessRole} What the access is used as: the callee of a call, the target of an
     * assignment, or a plain read.
     */
    public roleOf(access: object): AccessRole {
        if (this.calleeAccesses.has(access)) return 'callee';
        return this.assignmentTargets.has(access) ? 'assignment' : 'read';
    }

    /**
     * Records the name a member access is emitted with: the JavaScript name of the core library
     * member it stands for, or the name as written when it doesn't (a field, a member of the user).
     *
     * @param {object} access - The access node.
     * @param {string} name - The final property name.
     */
    public markMember(access: object, name: string): void {
        this.memberNames.set(access, name);
    }

    /**
     * @param {object} access - The access node.
     * @returns {string | undefined} The name the analyzer decided to emit the access with, if it did.
     */
    public memberOf(access: object): string | undefined {
        return this.memberNames.get(access);
    }

    /**
     * Records how the analyzer decided to emit a method call on a receiver of union type, so the
     * generator only has to read the decision.
     *
     * @param {object} call - The call node.
     * @param {CallDispatch} dispatch - What it is emitted as.
     */
    public markDispatched(call: object, dispatch: CallDispatch): void {
        this.dispatchedCalls.set(call, dispatch);
    }

    /**
     * @param {object} call - The call node.
     * @returns {CallDispatch | undefined} How the analyzer decided to emit this call, if it did.
     */
    public dispatchOf(call: object): CallDispatch | undefined {
        return this.dispatchedCalls.get(call);
    }

    /**
     * Whether `node` owns a scope for its body, i.e. whether the passes walking the tree must
     * {@link enterScope} it.
     *
     * @param {{ type: string }} node - The AST node to check.
     * @returns {boolean}
     */
    public ownsScope(node: { type: string }): boolean {
        return this.scopeOwnerTypes.has(node.type);
    }

    /**
     * Enters the scope owned by `node`, creating it the first time the node is seen. The scope
     * outlives {@link exitScope}, so later passes reopening the node find what earlier ones
     * registered in it.
     *
     * @param {object} node - The AST node owning the scope.
     */
    public enterScope(node: object): void {
        let scope = this.nodeScopes.get(node);

        if (!scope) {
            scope = SymbolTable.createScope();
            this.nodeScopes.set(node, scope);
        }

        this.scopes.push(scope);
    }

    /**
     * Exits the current local scope and returns to the parent scope, without destroying it.
     * Prevents popping the global scope.
     */
    public exitScope(): void {
        if (this.scopes.length > 1) this.scopes.pop();
    }

    /**
     * Registers a new symbol in the current scope.
     *
     * @param {string} name - The identifier name of the symbol.
     * @param {Partial<Symbol>} info - Metadata, kind (Function, Variable, etc.) and, if already
     * known at registration time, `dataType` of the symbol. Most callers register variables
     * before their type can be resolved and leave this `undefined`, filling it in later via
     * {@link setDataType} once the "Tipos" analysis pass runs.
     * @param {Location} location - Source code coordinates for error reporting.
     * @throws {ChordError} If the identifier is already declared in the current scope.
     */
    public register(name: string, info: Partial<Symbol>, location: Location): void {
        const currentScope = this.scopes[this.scopes.length - 1].symbols;
        
        if (currentScope.has(name)) {
            throw new ChordError({
                phase: ErrorLevel.Analysis,
                message: `Identificador duplicado: '${name}' ya ha sido declarado en este ámbito.`,
                location
            }).format();
        }

        currentScope.set(name, {
            name,
            kind: info.kind || SymbolKind.Variable,
            metadata: {
                isAsync: info.metadata?.isAsync || false,
                isExported: info.metadata?.isExported || false,
                isStatic: info.metadata?.isStatic || false
            },
            dataType: info.dataType,
            signature: info.signature
        });
    }

    /**
     * Assigns the resolved `dataType` to an already registered symbol, searching bottom-up from
     * the current scope to the global scope just like
     * {@link lookup}. Used by later analysis passes (e.g. the "Tipos" pass) that need the symbol
     * table fully populated by {@link register} before they can infer or validate a variable's
     * type — mutating the stored `Symbol` in place rather than re-registering it, since
     * `register` would reject the name as a duplicate.
     *
     * @param {string} name - The identifier name of the already registered symbol.
     * @param {DataType | undefined} dataType - The resolved type, or `undefined` if none
     * could be determined.
     * @returns {void} Silently does nothing if no symbol with that name is currently in scope.
     */
    public setDataType(name: string, dataType: DataType | undefined): void {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            const symbol = this.scopes[i].symbols.get(name);

            if (symbol) {
                symbol.dataType = dataType;
                return;
            }
        }
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
            if (this.scopes[i].symbols.has(name)) {
                return this.scopes[i].symbols.get(name);
            }
        }
        return undefined;
    }

    /**
     * Sets a compiler metadata value in the current active scope.
     * 
     * @template T
     * @param {CompilerMetadataKind} key - The compiler metadata key enum identifier.
     * @param {unknown} value - The value payload associated with the metadata key.
     */
    public setMetadata(key: CompilerMetadataKind, value: unknown): void {
        this.scopes[this.scopes.length - 1].metadata.set(key, value);
    }

    /**
     * Retrieves a compiler metadata value by searching bottom-up from the current active scope to the global scope.
     * 
     * @template T
     * @param {CompilerMetadataKind} key - The compiler metadata key enum identifier to look up.
     * @returns {T | undefined} The metadata value cast to generic type T if found, otherwise undefined.
     */
    public getMetadata<T>(key: CompilerMetadataKind): T | undefined {
        for(let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].metadata.has(key)) return this.scopes[i].metadata.get(key) as T;
        }

        return undefined;
    }
}