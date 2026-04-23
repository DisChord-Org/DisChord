type DecoratorBoxContent = boolean | string | number | string[] | boolean[] | number[];
type DecoratorBoxRecord = Record<string, DecoratorBoxContent>;

/**
 * Utility class to manage metadata provided by decorators.
 * It acts as a temporary buffer (box) where decorators deposit configurations
 * to be consumed by the next relevant AST node.
 */
export class DecoratorProcessor {
    /** Internal storage for active decorators and their associated content. */
    private static DecoratorBox: DecoratorBoxRecord = {};

    /**
     * @returns The current state of the decorator storage.
     */
    static get box (): DecoratorBoxRecord {
        return this.DecoratorBox;
    }

    /**
     * Registers a decorator and its content in the buffer.
     * @param decorator - The unique identifier of the decorator.
     * @param content - The metadata value to store.
     */
    static addDecorator (decorator: string, content: DecoratorBoxContent): void {
        this.DecoratorBox[decorator] = content;
    }

    /**
     * Removes a decorator from the buffer to prevent it from affecting subsequent nodes.
     * @param decorator - The identifier of the decorator to remove.
     */
    static deleteDecorator (decorator: string): void {
        delete this.DecoratorBox[decorator];
    }

    /**
     * Performs a deep comparison between the stored content and the provided value.
     * Handles primitives and arrays of primitives correctly.
     * * @param decorator - The identifier to check.
     * @param content - The value to compare against the stored one.
     * @returns True if the content matches (by value, not just reference).
     */
    static match (decorator: string, content: DecoratorBoxContent): boolean {
        const stored = this.DecoratorBox[decorator];

        if (typeof stored !== typeof content) return false;

        if (Array.isArray(stored) && Array.isArray(content)) {
            if (stored.length !== content.length) return false;
            return stored.every((val, index) => val === content[index]);
        }

        return stored === content;
    }

    /**
     * Checks if a decorator matches the provided content and then immediately 
     * removes it from the buffer regardless of the match result.
     * * This ensures the "one-shot" nature of decorators in the parser.
     * * @param decorator - The identifier to check.
     * @param content - The value to compare.
     * @returns True if the values matched before deletion.
     */
    static matchAndDelete (decorator: string, content: DecoratorBoxContent): boolean {
        const isMatch = this.match(decorator, content);

        this.deleteDecorator(decorator);

        return isMatch;
    }
}