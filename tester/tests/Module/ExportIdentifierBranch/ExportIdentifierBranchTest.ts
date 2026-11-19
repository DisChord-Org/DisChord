import { Test } from "../../../Test";

/**
 * @class ExportIdentifierBranchTest
 * @description It has to emit export { x } for an exported identifier
 */
export class ExportIdentifierBranchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Export Identifier Branch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit export { x } for an exported identifier";
}
