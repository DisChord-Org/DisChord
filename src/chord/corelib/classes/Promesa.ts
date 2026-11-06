import { AnyDataType, ClassDataType } from "../../model/DataType";
import { ClassesEnum } from "./ClassesEnum";

export const promesaClass = {
    receiver: ClassDataType.of(ClassesEnum.Promesa),
    constructs: 'Promise',
    methods: {
        todas: {
            transpile: 'Promise.all',
            returns: AnyDataType.Any,
            static: true,
            async: true,
            params: [
                {
                    name: 'promesas',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Espera a todas las promesas y devuelve la lista de resultados.'
        },
        todasResueltas: {
            transpile: 'Promise.allSettled',
            returns: AnyDataType.Any,
            static: true,
            async: true,
            params: [
                {
                    name: 'promesas',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Espera a que todas terminen y devuelve el estado de cada una.'
        },
        primera: {
            transpile: 'Promise.race',
            returns: AnyDataType.Any,
            static: true,
            async: true,
            params: [
                {
                    name: 'promesas',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Devuelve el resultado de la primera promesa en terminar.'
        },
        cualquiera: {
            transpile: 'Promise.any',
            returns: AnyDataType.Any,
            static: true,
            async: true,
            params: [
                {
                    name: 'promesas',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Devuelve el resultado de la primera promesa que se cumpla.'
        },
        resolver: {
            transpile: 'Promise.resolve',
            returns: AnyDataType.Any,
            static: true,
            async: true,
            params: [
                {
                    name: 'valor',
                    type: AnyDataType.Any,
                    optional: true
                }
            ],
            doc: 'Crea una promesa ya cumplida con el valor.'
        },
        rechazar: {
            transpile: 'Promise.reject',
            returns: AnyDataType.Any,
            static: true,
            async: true,
            params: [
                {
                    name: 'motivo',
                    type: AnyDataType.Any,
                    optional: true
                }
            ],
            doc: 'Crea una promesa ya rechazada con el motivo.'
        }
    }
} as const;
