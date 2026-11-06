import { AnyDataType, ClassDataType, PrimitiveDataType, VoidDataType } from "../../model/DataType";
import { ClassesEnum } from "./ClassesEnum";

/**
 * `tiene`, `borrar` and `limpiar` share their names with members of `Texto`, `Lista` or
 * `Mapa`. With a receiver of known type (`nuevo Conjunto()`, a typed variable) the class is
 * resolved from it; with an unknown one, such as a function parameter, the call is dispatched at
 * run time through a runtime helper that picks the member from the receiver (see
 * `CoreLibDispatch.resolveUnknownDispatch`).
 */
export const conjuntoClass = {
    receiver: ClassDataType.of(ClassesEnum.Conjunto),
    constructs: 'Set',
    methods: {
        agregar: {
            transpile: 'add',
            returns: ClassDataType.of(ClassesEnum.Conjunto),
            params: [
                {
                    name: 'valor',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Agrega un valor y devuelve el conjunto.'
        },
        tiene: {
            transpile: 'has',
            returns: PrimitiveDataType.Booleano,
            params: [
                {
                    name: 'valor',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Indica si el conjunto contiene el valor.'
        },
        borrar: {
            transpile: 'delete',
            returns: PrimitiveDataType.Booleano,
            params: [
                {
                    name: 'valor',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Quita el valor y devuelve si estaba.'
        },
        limpiar: {
            transpile: 'clear',
            returns: VoidDataType.Void,
            params: [],
            doc: 'Quita todos los valores.'
        }
    },
    properties: {
        tamano: {
            transpile: 'size',
            returns: PrimitiveDataType.Numero,
            doc: 'Cantidad de valores del conjunto.'
        }
    }
} as const;
