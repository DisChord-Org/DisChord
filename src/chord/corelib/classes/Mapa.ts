import { AnyDataType, ClassDataType, PrimitiveDataType, VoidDataType } from "../../model/DataType";
import { ClassesEnum } from "./ClassesEnum";

export const mapaClass = {
    receiver: ClassDataType.of(ClassesEnum.Mapa),
    constructs: 'Map',
    methods: {
        obtener: {
            transpile: 'get',
            returns: AnyDataType.Any,
            params: [
                {
                    name: 'clave',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Devuelve el valor guardado para la clave.'
        },
        poner: {
            transpile: 'set',
            returns: ClassDataType.of(ClassesEnum.Mapa),
            params: [
                {
                    name: 'clave',
                    type: AnyDataType.Any
                },
                {
                    name: 'valor',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Guarda un valor para la clave y devuelve el mapa.'
        },
        tiene: {
            transpile: 'has',
            returns: PrimitiveDataType.Booleano,
            params: [
                {
                    name: 'clave',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Indica si hay un valor para la clave.'
        },
        borrar: {
            transpile: 'delete',
            returns: PrimitiveDataType.Booleano,
            params: [
                {
                    name: 'clave',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Borra la clave y devuelve si existía.'
        },
        limpiar: {
            transpile: 'clear',
            returns: VoidDataType.Void,
            params: [],
            doc: 'Borra todas las claves.'
        }
    },
    properties: {
        tamano: {
            transpile: 'size',
            returns: PrimitiveDataType.Numero,
            doc: 'Cantidad de claves del mapa.'
        }
    }
} as const;
