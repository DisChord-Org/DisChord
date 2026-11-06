import { PrimitiveDataType } from "../../model/DataType";

export const matesClass = {
    methods: {
        absoluto: {
            transpile: 'Math.abs',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Valor sin signo.'
        },
        redondearArriba: {
            transpile: 'Math.ceil',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Entero más cercano hacia arriba.'
        },
        redondearAbajo: {
            transpile: 'Math.floor',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Entero más cercano hacia abajo.'
        },
        redondear: {
            transpile: 'Math.round',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Entero más cercano.'
        },
        truncar: {
            transpile: 'Math.trunc',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Parte entera, sin decimales.'
        },
        potencia: {
            transpile: 'Math.pow',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'base',
                    type: PrimitiveDataType.Numero
                },
                {
                    name: 'exponente',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Base elevada al exponente.'
        },
        raizCuadrada: {
            transpile: 'Math.sqrt',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Raíz cuadrada.'
        },
        raizCubica: {
            transpile: 'Math.cbrt',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Raíz cúbica.'
        },
        hipotenusa: {
            transpile: 'Math.hypot',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valores',
                    type: PrimitiveDataType.Numero,
                    rest: true
                }
            ],
            doc: 'Raíz cuadrada de la suma de los cuadrados de los valores.'
        },
        exponente: {
            transpile: 'Math.exp',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'e elevado al valor.'
        },
        log: {
            transpile: 'Math.log',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Logaritmo natural.'
        },
        log10: {
            transpile: 'Math.log10',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Logaritmo en base 10.'
        },
        log2: {
            transpile: 'Math.log2',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Logaritmo en base 2.'
        },
        seno: {
            transpile: 'Math.sin',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Seno, con el ángulo en radianes.'
        },
        coseno: {
            transpile: 'Math.cos',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Coseno, con el ángulo en radianes.'
        },
        tangente: {
            transpile: 'Math.tan',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Tangente, con el ángulo en radianes.'
        },
        arcoseno: {
            transpile: 'Math.asin',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
                ],
            doc: 'Arcoseno, en radianes.'
        },
        arcocoseno: {
            transpile: 'Math.acos',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Arcocoseno, en radianes.'
        },
        arcotangente: {
            transpile: 'Math.atan',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Arcotangente, en radianes.'
        },
        arcotangente2: {
            transpile: 'Math.atan2',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'ordenada',
                    type: PrimitiveDataType.Numero
                },
                {
                    name: 'abscisa',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Ángulo, en radianes, del punto (x, y).'
        },
        senoHiperbolico: {
            transpile: 'Math.sinh',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Seno hiperbólico.'
        },
        cosenoHiperbolico: {
            transpile: 'Math.cosh',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Coseno hiperbólico.'
        },
        tangenteHiperbolica: {
            transpile: 'Math.tanh',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Tangente hiperbólica.'
        },
        maximo: {
            transpile: 'Math.max',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valores',
                    type: PrimitiveDataType.Numero,
                    rest: true
                }
            ],
            doc: 'El mayor de los valores.'
        },
        minimo: {
            transpile: 'Math.min',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valores',
                    type: PrimitiveDataType.Numero,
                    rest: true
                }
            ],
            doc: 'El menor de los valores.'
        },
        aleatorio: {
            transpile: 'Math.random',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [],
            doc: 'Número aleatorio entre 0 (incluido) y 1 (excluido).'
        },
        signo: {
            transpile: 'Math.sign',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Signo del valor'
        },
        arcosenoHiperbolico: {
            transpile: 'Math.asinh',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Arcoseno hiperbólico.'
        },
        arcocosenoHiperbolico: {
            transpile: 'Math.acosh',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Arcocoseno hiperbólico.'
        },
        arcotangenteHiperbolica: {
            transpile: 'Math.atanh',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Arcotangente hiperbólica.'
        },
        redondearFlotante: {
            transpile: 'Math.fround',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Valor como número de 32 bits.'
        },
        exponenteMenosUno: {
            transpile: 'Math.expm1',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'e elevado al valor, menos 1.'
        },
        logMasUno: {
            transpile: 'Math.log1p',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Logaritmo natural de 1 más el valor.'
        },
        ceroInicial: {
            transpile: 'Math.clz32',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Cantidad de ceros a la izquierda en 32 bits.'
        },
        limitar: {
            transpile: 'chordLimitar',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: PrimitiveDataType.Numero
                },
                {
                    name: 'minimo',
                    type: PrimitiveDataType.Numero
                },
                {
                    name: 'maximo',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Mantiene el valor dentro del rango dado.'
        },
    },
    properties: {
        PI: {
            transpile: 'Math.PI',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'La constante π.'
        },
        E: {
            transpile: 'Math.E',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'La constante e.'
        },
        LOGNEP2: {
            transpile: 'Math.LN2',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'Logaritmo natural de 2.'
        },
        LOGNEP10: {
            transpile: 'Math.LN10',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'Logaritmo natural de 10.'
        },
        LOG2E: {
            transpile: 'Math.LOG2E',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'Logaritmo en base 2 de e.'
        },
        LOG10E: {
            transpile: 'Math.LOG10E',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'Logaritmo en base 10 de e.'
        },
        RAIZCUADRADA1_2: {
            transpile: 'Math.SQRT1_2',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'Raíz cuadrada de 1/2.'
        },
        RAIZCUADRADA2: {
            transpile: 'Math.SQRT2',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'Raíz cuadrada de 2.'
        }
    }
} as const;
