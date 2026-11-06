import { Decorator } from './model/types';

/** Name a decorator is kept under: one of the keys of `Decorator`, so a rename cannot go unnoticed by its consumers. */
type DecoratorName = keyof typeof Decorator;

/** Decorators only flag the next node, so the box holds booleans. */
type DecoratorBoxRecord = Partial<Record<DecoratorName, boolean>>;

/**
 * Utility class to manage metadata provided by decorators.
 * It acts as a temporary buffer (box) where decorators deposit configurations
 * to be consumed by the next relevant AST node.
 */
export class DecoratorProcessor {
    /** Internal storage for active decorators and their associated content. */
    private static DecoratorBox: DecoratorBoxRecord = {};

    /**
     * Registers a decorator and its content in the buffer.
     * @param decorator - The unique identifier of the decorator.
     * @param content - The metadata value to store.
     */
    static addDecorator (decorator: DecoratorName, content: boolean): void {
        this.DecoratorBox[decorator] = content;
    }

    /**
     * Removes a decorator from the buffer to prevent it from affecting subsequent nodes.
     * @param decorator - The identifier of the decorator to remove.
     */
    private static deleteDecorator (decorator: DecoratorName): void {
        delete this.DecoratorBox[decorator];
    }

    /**
     * Checks if a decorator matches the provided value and then immediately
     * removes it from the buffer regardless of the match result.
     * * This ensures the "one-shot" nature of decorators in the parser.
     * * @param decorator - The identifier to check.
     * @param content - The value to compare.
     * @returns True if the values matched before deletion.
     */
    static matchAndDelete (decorator: DecoratorName, content: boolean): boolean {
        const isMatch = this.DecoratorBox[decorator] === content;

        this.deleteDecorator(decorator);

        return isMatch;
    }
}