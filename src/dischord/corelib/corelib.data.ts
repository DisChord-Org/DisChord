import { corelib as chordCorelib } from "../../chord/corelib/corelib.data";
import { DisChordCoreLib } from "./corelib.types";

/**
 * Names of the classes DisChord adds on top of chord's `ClassesEnum`. Used as keys of `corelib.classes`.
 */
export enum DisChordClassesEnum {
    cliente = 'cliente',
    canal = 'canal'
}

/**
 * Core library definition: chord's table plus DisChord's own classes and functions, so a single
 * lookup covers both layers. Maps every class, and each of its methods and properties, from its
 * name in the source language to the Seyfert code it is transpiled to. Every member is static
 * because `cliente` and `canal` are fixed identifiers in scope, not values of unknown type, and
 * its `transpile` is the whole replacement expression.
 * @type {DisChordCoreLib}
 */
export const corelib: DisChordCoreLib = {
    classes: {
        ...chordCorelib.classes,
        [DisChordClassesEnum.cliente]: {
            methods: {
                emitir: {
                    transpile: 'cliente.events.runEvent',
                    static: true
                }
            },
            properties: {
                id: {
                    transpile: 'cliente.me.id',
                    static: true
                },
                nombre: {
                    transpile: 'cliente.me.username',
                    static: true
                },
                avatar: {
                    transpile: 'cliente.me.avatar',
                    static: true
                },
                avatarUrl: {
                    transpile: 'cliente.me.avatarUrl',
                    static: true
                },
                ping: {
                    transpile: 'cliente.gateway.latency',
                    static: true
                }
            }
        },
        [DisChordClassesEnum.canal]: {
            methods: {},
            properties: {
                topico: {
                    transpile: 'canal.topic',
                    static: true
                },
                ratelimit: {
                    transpile: 'canal.rateLimitPerUser',
                    static: true
                },
                posicion: {
                    transpile: 'canal.position',
                    static: true
                },
                categoria: {
                    transpile: 'canal.parentId',
                    static: true
                },
                nombre: {
                    transpile: 'canal.name',
                    static: true
                },
                ultimoMensaje: {
                    transpile: 'canal.lastMessageId',
                    static: true
                }
            }
        }
    },
    functions: {
        ...chordCorelib.functions,
        imprimir: 'cliente.logger.info'
    }
};
