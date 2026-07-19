import { Parser } from "../../../../src/chord/Parser/Parser";
import { Test } from "../../../Test";

export class SimpleBDOParserTest extends Test {
    public readonly name: string = 'Simple BDOParser Test';
    public readonly description: string = 'It has to detect the block as a simple BDO';

    public run (): void {
        const parser = new Parser([], 0, {});
    }
}