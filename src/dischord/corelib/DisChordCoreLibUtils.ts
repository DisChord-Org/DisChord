import { ClassesEnum } from "../../chord/corelib/corelib.data";
import { CoreLibUtils } from "../../chord/corelib/CoreLibUtils";
import { CoreLibDispatch } from "../../chord/corelib/CoreLibDispatch";
import { corelib, DisChordClassesEnum } from "./corelib.data";

/**
 * Lookups over DisChord's merged `corelib`: it inherits every lookup from chord's `CoreLibUtils`
 * and only fixes which table they run over.
 */
export class DisChordCoreLibUtils extends CoreLibUtils<ClassesEnum | DisChordClassesEnum> {
    constructor() {
        super(corelib);
    }
}

/**
 * Lookups over DisChord's `corelib`; the one DisChord's visitors plug into chord's.
 * @type {DisChordCoreLibUtils}
 */
export const disChordCoreLibUtils = new DisChordCoreLibUtils();

/**
 * Dispatch policy over DisChord's `corelib`; the one the compilation context carries.
 * @type {CoreLibDispatch}
 */
export const disChordCoreLibDispatch = new CoreLibDispatch(disChordCoreLibUtils);
