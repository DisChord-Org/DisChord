import { ClassesEnum } from "../../chord/corelib/corelib.data";
import { CoreLib } from "../../chord/corelib/corelib.types";
import { DisChordClassesEnum } from "./corelib.data";

/**
 * DisChord's core library: chord's `CoreLib` shape, keyed by chord's classes plus its own.
 */
export type DisChordCoreLib = CoreLib<ClassesEnum | DisChordClassesEnum>;
