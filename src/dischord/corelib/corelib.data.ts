import { corelib as chordCorelib } from "../../chord/corelib/corelib.data";
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
                    runtime: true
                },
                nombreGlobal: {
                    transpile: 'globalName',
                    runtime: true
                },
                etiqueta: {
                    transpile: 'tag',
                    runtime: true
                },
                discriminador: {
                    transpile: 'discriminator',
                    runtime: true
                },
                insignias: {
                    transpile: 'publicFlags',
                    runtime: true
                },
                esBot: {
                    transpile: 'bot',
                    runtime: true
                },
                esSistema: {
                    transpile: 'system',
                    runtime: true
                },
                avatarUrl: {
                    transpile: 'avatarURL()',
                    runtime: true
                },
                bannerUrl: {
                    transpile: 'bannerURL()',
                    runtime: true
                },
                colorPerfil: {
                    transpile: 'accentColor',
                    runtime: true
                },
                tipoPremium: {
                    transpile: 'premiumType',
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
