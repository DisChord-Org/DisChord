import { corelib as chordCorelib } from "../../chord/corelib/corelib.data";
import { DisChordCoreLib } from "./corelib.types";
import { DisChordClassesEnum } from "./classes/DisChordClassesEnum";
import { imprimirCallee } from "./classes/imprimirCallee";
import { clienteClass } from "./classes/cliente";
import { canalInjectedClass } from "./classes/canalInjected";
import { usuarioClass } from "./classes/Usuario";
import { miembroClass } from "./classes/Miembro";
import { mensajeClass } from "./classes/Mensaje";
import { canalClass } from "./classes/Canal";

export { DisChordClassesEnum };

/**
 * Core library definition: chord's table plus DisChord's own classes and functions, so a single
 * lookup covers both layers. Maps every class, and each of its methods and properties, from its
 * name in the source language to the Seyfert code it is transpiled to. Every member is static
 * because `cliente` and `canal` are fixed identifiers in scope, not values of unknown type, and
 * its `transpile` is the whole replacement expression.
 *
 * Seyfert types absent values as `string | null` (or optional fields); the language has no `null`,
 * so those are approximated as `texto|indefinido` (or the matching primitive with `indefinido`).
 * @type {DisChordCoreLib}
 */
export const corelib: DisChordCoreLib = {
    classes: {
        ...chordCorelib.classes,
        [DisChordClassesEnum.cliente]: clienteClass,
        [DisChordClassesEnum.canal]: canalInjectedClass,
        [DisChordClassesEnum.Usuario]: usuarioClass,
        [DisChordClassesEnum.Miembro]: miembroClass,
        [DisChordClassesEnum.Mensaje]: mensajeClass,
        [DisChordClassesEnum.Canal]: canalClass
    },
    functions: {
        ...chordCorelib.functions,
        imprimir: imprimirCallee
    }
};
