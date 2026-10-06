import { Test } from "../../../Test";

/**
 * @class VariableClassTypeTest
 * @description Validates that a core library class (`Mapa`, `Conjunto`, `Fecha`) can be instantiated with `nuevo` (compiled to its JavaScript constructor, `Map`/`Set`/`Date`), written in a `tipo` annotation, and that its members are then typed after the class of the variable.
 */
export class VariableClassTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Class Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile instances of core library classes, annotated or inferred, using their JavaScript constructors and typing their members";

}
