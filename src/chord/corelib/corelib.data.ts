import { CoreLib } from "./corelib.types";
import { ClassesEnum } from "./classes/ClassesEnum";
import { consolaClass } from "./classes/consola";
import { textoClass } from "./classes/Texto";
import { listaClass } from "./classes/Lista";
import { matesClass } from "./classes/Mates";
import { numeroClass } from "./classes/Numero";
import { jsonClass } from "./classes/JSON";
import { bdoClass } from "./classes/BDO";
import { mapaClass } from "./classes/Mapa";
import { conjuntoClass } from "./classes/Conjunto";
import { promesaClass } from "./classes/Promesa";
import { expresionClass } from "./classes/Expresion";
import { fechaClass } from "./classes/Fecha";
import { aleatorioClass } from "./classes/Aleatorio";

export { ClassesEnum };

/**
 * Core library definition: maps every class, and each of its methods and properties, from its
 * name in the source language to the JavaScript it is transpiled to. `functions` holds free
 * functions rewritten to another callee; layers built on top of chord add their own. A
 * `transpile` that names a `runtimeHelperNames` function is provided by the runtime helpers module.
 * @type {CoreLib<ClassesEnum>}
 */
export const corelib = {
    classes: {
        [ClassesEnum.consola]: consolaClass,
        [ClassesEnum.Texto]: textoClass,
        [ClassesEnum.Lista]: listaClass,
        [ClassesEnum.Mates]: matesClass,
        [ClassesEnum.Numero]: numeroClass,
        [ClassesEnum.JSON]: jsonClass,
        [ClassesEnum.BDO]: bdoClass,
        [ClassesEnum.Mapa]: mapaClass,
        [ClassesEnum.Conjunto]: conjuntoClass,
        [ClassesEnum.Promesa]: promesaClass,
        [ClassesEnum.Expresion]: expresionClass,
        [ClassesEnum.Fecha]: fechaClass,
        [ClassesEnum.Aleatorio]: aleatorioClass,
    },
    functions: {
        esperar: 'chordEsperar'
    }
} as const satisfies CoreLib<ClassesEnum>;
