import { corelib as chordCorelib } from "../../chord/corelib/corelib.data";
import { AnyDataType, PrimitiveDataType, UnionDataType } from "../../chord/DataType";
import { PrimitiveType } from "../../chord/types";
import { DisChordCoreLib } from "./corelib.types";

/**
 * Names of the classes DisChord adds on top of chord's `ClassesEnum`. Used as keys of `corelib.classes`.
 */
export enum DisChordClassesEnum {
    cliente = 'cliente',
    canal = 'canal',
    Usuario = 'Usuario'
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
                    returns: AnyDataType.Any,
                    static: true
                }
            },
            properties: {
                id: {
                    transpile: 'cliente.me.id',
                    returns: PrimitiveDataType.Texto,
                    static: true
                },
                nombre: {
                    transpile: 'cliente.me.username',
                    returns: PrimitiveDataType.Texto,
                    static: true
                },
                avatar: {
                    transpile: 'cliente.me.avatar',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    static: true
                },
                avatarUrl: {
                    transpile: 'cliente.me.avatarUrl',
                    returns: PrimitiveDataType.Texto,
                    static: true
                },
                ping: {
                    transpile: 'cliente.gateway.latency',
                    returns: PrimitiveDataType.Numero,
                    static: true
                }
            }
        },
        [DisChordClassesEnum.canal]: {
            methods: {},
            properties: {
                topico: {
                    transpile: 'canal.topic',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    static: true
                },
                ratelimit: {
                    transpile: 'canal.rateLimitPerUser',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                posicion: {
                    transpile: 'canal.position',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                categoria: {
                    transpile: 'canal.parentId',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    static: true
                },
                nombre: {
                    transpile: 'canal.name',
                    returns: PrimitiveDataType.Texto,
                    static: true
                },
                ultimoMensaje: {
                    transpile: 'canal.lastMessageId',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    static: true
                }
            }
        },
        /**
         * Seyfert `User`/`GuildMember` data under Spanish names. These are not rewritten at compile
         * time: a command option typed `opcion "usuario"` can be bound to any variable name, so
         * there is no fixed identifier to translate. `userExtensions` patches the real classes at
         * runtime instead (`transpile` is the `User` property or method each getter reads), which
         * is why every member is `runtime`.
         *
         * Keys must never equal a raw field name Seyfert assigns internally while constructing its
         * own `User`/`ClientUser`/`GuildMember` objects (`Object.assign(this, rawData)` in
         * `ClientUser`/`DiscordBase`) — a getter-only accessor of the same name on the prototype
         * blocks that assignment outright (`Cannot set property flags of [object Object] which has
         * only a getter`), breaking construction of every such object, not just property access.
         * This is why the keys are `avatarUrl`/`bannerUrl`/`insignias` rather than the more literal
         * `avatar`/`banner`/`flags` — those three collide with real raw fields.
         */
        [DisChordClassesEnum.Usuario]: {
            methods: {},
            properties: {
                nombre: {
                    transpile: 'username',
                    returns: PrimitiveDataType.Texto,
                    runtime: true
                },
                nombreGlobal: {
                    transpile: 'globalName',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    runtime: true
                },
                etiqueta: {
                    transpile: 'tag',
                    returns: PrimitiveDataType.Texto,
                    runtime: true
                },
                discriminador: {
                    transpile: 'discriminator',
                    returns: PrimitiveDataType.Texto,
                    runtime: true
                },
                insignias: {
                    transpile: 'publicFlags',
                    returns: PrimitiveDataType.Numero,
                    runtime: true
                },
                esBot: {
                    transpile: 'bot',
                    returns: PrimitiveDataType.Booleano,
                    runtime: true
                },
                esSistema: {
                    transpile: 'system',
                    returns: PrimitiveDataType.Booleano,
                    runtime: true
                },
                avatarUrl: {
                    transpile: 'avatarURL()',
                    returns: PrimitiveDataType.Texto,
                    runtime: true
                },
                bannerUrl: {
                    transpile: 'bannerURL()',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    runtime: true
                },
                colorPerfil: {
                    transpile: 'accentColor',
                    returns: UnionDataType.of([PrimitiveType.Numero, PrimitiveType.Indefinido]),
                    runtime: true
                },
                tipoPremium: {
                    transpile: 'premiumType',
                    returns: UnionDataType.of([PrimitiveType.Numero, PrimitiveType.Indefinido]),
                    runtime: true
                }
            }
        }
    },
    functions: {
        ...chordCorelib.functions,
        imprimir: 'cliente.logger.info'
    }
};
