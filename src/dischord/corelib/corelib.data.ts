import { corelib as chordCorelib } from "../../chord/corelib/corelib.data";
import { AnyDataType, PrimitiveDataType, UnionDataType, VoidDataType } from "../../chord/model/DataType";
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
 *
 * Seyfert types absent values as `string | null` (or optional fields); the language has no `null`,
 * so those are approximated as `texto|indefinido` (or the matching primitive with `indefinido`).
 * @type {DisChordCoreLib}
 */
export const corelib: DisChordCoreLib = {
    classes: {
        ...chordCorelib.classes,
        [DisChordClassesEnum.cliente]: {
            injected: true,
            methods: {
                emitir: {
                    transpile: 'cliente.events.runEvent',
                    returns: VoidDataType.Void,
                    static: true,
                    doc: 'Emite un evento del bot.'
                }
            },
            properties: {
                id: {
                    transpile: 'cliente.me.id',
                    returns: PrimitiveDataType.Texto,
                    static: true,
                    doc: 'Identificador del bot.'
                },
                nombre: {
                    transpile: 'cliente.me.username',
                    returns: PrimitiveDataType.Texto,
                    static: true,
                    doc: 'Nombre de usuario del bot.'
                },
                avatar: {
                    transpile: 'cliente.me.avatar',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    static: true,
                    doc: 'Hash del avatar del bot, si tiene.'
                },
                avatarUrl: {
                    transpile: 'cliente.me.avatarUrl',
                    returns: PrimitiveDataType.Texto,
                    static: true,
                    doc: 'URL del avatar del bot.'
                },
                ping: {
                    transpile: 'cliente.gateway.latency',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    doc: 'Latencia con la puerta de enlace, en milisegundos.'
                }
            }
        },
        [DisChordClassesEnum.canal]: {
            injected: true,
            methods: {},
            properties: {
                topico: {
                    transpile: 'canal.topic',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    static: true,
                    doc: 'Tema del canal, si tiene.'
                },
                ratelimit: {
                    transpile: 'canal.rateLimitPerUser',
                    returns: UnionDataType.of([PrimitiveType.Numero, PrimitiveType.Indefinido]),
                    static: true,
                    doc: 'Segundos que debe esperar un usuario entre mensajes.'
                },
                posicion: {
                    transpile: 'canal.position',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    doc: 'Posición del canal en la lista de canales.'
                },
                categoria: {
                    transpile: 'canal.parentId',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    static: true,
                    doc: 'Identificador de la categoría que contiene el canal.'
                },
                nombre: {
                    transpile: 'canal.name',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    static: true,
                    doc: 'Nombre del canal.'
                },
                ultimoMensaje: {
                    transpile: 'canal.lastMessageId',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    static: true,
                    doc: 'Identificador del último mensaje del canal.'
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
                    runtime: true,
                    doc: 'Nombre de usuario.'
                },
                nombreGlobal: {
                    transpile: 'globalName',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    runtime: true,
                    doc: 'Nombre visible global del usuario, si lo tiene.'
                },
                etiqueta: {
                    transpile: 'tag',
                    returns: PrimitiveDataType.Texto,
                    runtime: true,
                    doc: 'Etiqueta completa del usuario.'
                },
                discriminador: {
                    transpile: 'discriminator',
                    returns: PrimitiveDataType.Texto,
                    runtime: true,
                    doc: 'Discriminador del usuario.'
                },
                insignias: {
                    transpile: 'publicFlags',
                    returns: UnionDataType.of([PrimitiveType.Numero, PrimitiveType.Indefinido]),
                    runtime: true,
                    doc: 'Insignias públicas del usuario, como número de banderas.'
                },
                esBot: {
                    transpile: 'bot',
                    returns: UnionDataType.of([PrimitiveType.Booleano, PrimitiveType.Indefinido]),
                    runtime: true,
                    doc: 'Indica si el usuario es un bot.'
                },
                esSistema: {
                    transpile: 'system',
                    returns: UnionDataType.of([PrimitiveType.Booleano, PrimitiveType.Indefinido]),
                    runtime: true,
                    doc: 'Indica si el usuario es del sistema de Discord.'
                },
                avatarUrl: {
                    transpile: 'avatarURL()',
                    returns: PrimitiveDataType.Texto,
                    runtime: true,
                    doc: 'URL del avatar del usuario.'
                },
                bannerUrl: {
                    transpile: 'bannerURL()',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    runtime: true,
                    doc: 'URL del banner del usuario, si tiene.'
                },
                colorPerfil: {
                    transpile: 'accentColor',
                    returns: UnionDataType.of([PrimitiveType.Numero, PrimitiveType.Indefinido]),
                    runtime: true,
                    doc: 'Color del perfil del usuario, si lo tiene.'
                },
                tipoPremium: {
                    transpile: 'premiumType',
                    returns: UnionDataType.of([PrimitiveType.Numero, PrimitiveType.Indefinido]),
                    runtime: true,
                    doc: 'Tipo de suscripción premium del usuario, si la tiene.'
                }
            }
        }
    },
    functions: {
        ...chordCorelib.functions,
        imprimir: 'cliente.logger.info'
    }
};
