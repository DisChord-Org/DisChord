import { DeclaredName, Token } from './types';

/**
 * The names a source declares, in the order they are written, each with exactly where and with
 * what it belongs to. The parser feeds it as it consumes the identifiers that name a class, a
 * function, a parameter, a variable...; editor tooling (outline, go to definition, rename) reads
 * it afterwards, so the syntax tree does not need a range on every node.
 *
 * What a name belongs to is the class or function whose body is being parsed when it is declared,
 * which is why the parser opens a container (`within`) around a body and not each name by hand.
 *
 * @class DeclarationLog
 * @template {string} T - Token type vector.
 */
export class DeclarationLog<T extends string = string> {
    /** Names declared so far, in source order. */
    private readonly names: DeclaredName[] = [];

    /** Classes and functions whose body is being parsed, innermost last. */
    private readonly containers: string[] = [];

    /**
     * Records the token of a name the source declares and answers the name, so a parser that took
     * `.value` from the token keeps reading the same and only gains the record.
     *
     * @param {string} kind - What is declared: a `DeclarationKind` or a kind of the dialect.
     * @param {Token<T>} token - The identifier token that names it.
     * @returns {string} The name.
     */
    public record(kind: string, token: Token<T>): string {
        const container = this.containers[this.containers.length - 1];

        this.names.push({
            kind,
            name: token.value,
            ...(container !== undefined && { container }),
            start: token.location,
            end: token.end
        });

        return token.value;
    }

    /**
     * Makes `container` what the names recorded while `body` runs belong to. It is closed even
     * if `body` throws, so a failed parse cannot leave a container open.
     *
     * @param {string} container - The class or function whose body is parsed.
     * @param {() => R} body - What parses it.
     * @returns {R} What `body` answers.
     */
    public within<R>(container: string, body: () => R): R {
        this.containers.push(container);

        try {
            return body();
        } finally {
            this.containers.pop();
        }
    }

    /**
     * @returns {readonly DeclaredName[]} A copy of every name recorded, in source order.
     */
    public entries(): readonly DeclaredName[] {
        return [...this.names];
    }
}
