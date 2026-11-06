import { AnyDataType, ClassDataType, PrimitiveDataType } from "../../model/DataType";
import { ClassesEnum } from "./ClassesEnum";

export const fechaClass = {
    receiver: ClassDataType.of(ClassesEnum.Fecha),
    constructs: 'Date',
    methods: {
        ahora: {
            transpile: 'Date.now',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [],
            doc: 'Marca de tiempo actual, en milisegundos.'
        },
        parsear: {
            transpile: 'Date.parse',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'texto',
                    type: PrimitiveDataType.Texto
                }
            ],
            doc: 'Convierte un texto de fecha en una marca de tiempo.'
        },
        año: {
            transpile: 'getFullYear',
            returns: PrimitiveDataType.Numero,
            params: [],
            doc: 'Año de la fecha.'
        },
        mes: {
            transpile: 'getMonth',
            returns: PrimitiveDataType.Numero,
            params: [],
            doc: 'Mes de la fecha, de 0 a 11.'
        },
        dia: {
            transpile: 'getDate',
            returns: PrimitiveDataType.Numero,
            params: [],
            doc: 'Día del mes de la fecha.'
        },
        diaSemana: {
            transpile: 'getDay',
            returns: PrimitiveDataType.Numero,
            params: [],
            doc: 'Día de la semana, de 0 (domingo) a 6.'
        },
        hora: {
            transpile: 'getHours',
            returns: PrimitiveDataType.Numero,
            params: [],
            doc: 'Hora de la fecha.'
        },
        minuto: {
            transpile: 'getMinutes',
            returns: PrimitiveDataType.Numero,
            params: [],
            doc: 'Minutos de la fecha.'
        },
        segundo: {
            transpile: 'getSeconds',
            returns: PrimitiveDataType.Numero,
            params: [],
            doc: 'Segundos de la fecha.'
        },
        milisegundo: {
            transpile: 'getMilliseconds',
            returns: PrimitiveDataType.Numero,
            params: [],
            doc: 'Milisegundos de la fecha.'
        },
        marcaDeTiempo: {
            transpile: 'getTime',
            returns: PrimitiveDataType.Numero,
            params: [],
            doc: 'Milisegundos transcurridos desde 1970.'
        },
        aISO: {
            transpile: 'toISOString',
            returns: PrimitiveDataType.Texto,
            params: [],
            doc: 'La fecha en formato ISO 8601.'
        },
        aTexto: {
            transpile: 'toString',
            returns: PrimitiveDataType.Texto,
            params: [],
            doc: 'La fecha como texto.'
        },
        aLocal: {
            transpile: 'toLocaleString',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'idioma',
                    type: PrimitiveDataType.Texto,
                    optional: true
                },
                {
                    name: 'opciones',
                    type: AnyDataType.Any,
                    optional: true
                }
            ],
            doc: 'La fecha como texto según el idioma y las opciones dadas.'
        }
    }
} as const;
