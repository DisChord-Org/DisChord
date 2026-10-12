import { Test } from "../../../Test";

/**
 * @class BDOTypeKeywordAsKeyTest
 * @description Validates that `tipo`, the keyword of type annotations and of the unary operator,
 * can also name a BDO property, while `tipo <expresion>` outside a property position keeps its
 * operator meaning.
 */
export class BDOTypeKeywordAsKeyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDO Type Keyword As Key - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to accept tipo as the name of a BDO property and keep tipo as the unary operator elsewhere';
}
