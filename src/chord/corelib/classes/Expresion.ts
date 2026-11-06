import { AnyDataType, ClassDataType, PrimitiveDataType } from "../../model/DataType";
import { ClassesEnum } from "./ClassesEnum";

export const expresionClass = {
    receiver: ClassDataType.of(ClassesEnum.Expresion),
    constructs: 'RegExp',
    methods: {
        probar: {
            transpile: 'test',
            returns: PrimitiveDataType.Booleano,
            params: [
                {
                    name: 'texto',
                    type: PrimitiveDataType.Texto
                }
            ],
            doc: 'Indica si el texto cumple la expresión.'
        },
        ejecutar: {
            transpile: 'exec',
            returns: AnyDataType.Any,
            params: [
                {
                    name: 'texto',
                    type: PrimitiveDataType.Texto
                }
            ],
            doc: 'Busca la expresión en el texto y devuelve la coincidencia, o indefinido si no hay.'
        }
    }
} as const;
