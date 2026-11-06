import { OptionalTypes } from "./OptionalTypes";
import { CoreLibClass } from "../../../chord/corelib/corelib.types";
import { ArrayDataType, ClassDataType, PrimitiveDataType, UnionDataType } from "../../../chord/model/DataType";
import { PrimitiveType } from "../../../chord/model/types";
import { DisChordClassesEnum } from "./DisChordClassesEnum";

/**
 * Seyfert message data under Spanish names, for the message of an event or of a reply
 * (`Message` and `WebhookMessage`, which share `BaseMessage`). Like `Usuario`, patched at runtime
 * onto the real class (every member is `runtime`); `transpile` is the expression each getter reads.
 * `fecha` is left out (the language has no date type to give it), and so are the embeds and the methods.
 */
export const mensajeClass: CoreLibClass = {
    receiver: ClassDataType.of(DisChordClassesEnum.Mensaje),
    methods: {},
    properties: {
        contenido: {
            transpile: 'content',
            returns: PrimitiveDataType.Texto,
            runtime: true,
            doc: 'Texto del mensaje.'
        },
        autor: {
            transpile: 'author',
            returns: ClassDataType.of(DisChordClassesEnum.Usuario),
            runtime: true,
            doc: 'Usuario que escribió el mensaje.'
        },
        miembro: {
            transpile: 'member',
            returns: UnionDataType.ofTypes([ClassDataType.of(DisChordClassesEnum.Miembro), PrimitiveDataType.Indefinido]),
            runtime: true,
            doc: 'Miembro del servidor que escribió el mensaje, si lo hay.'
        },
        canalId: {
            transpile: 'channelId',
            returns: PrimitiveDataType.Texto,
            runtime: true,
            doc: 'Identificador del canal del mensaje.'
        },
        servidorId: {
            transpile: 'guildId',
            returns: OptionalTypes.of(PrimitiveType.Texto),
            runtime: true,
            doc: 'Identificador del servidor del mensaje, si lo tiene.'
        },
        enlace: {
            transpile: 'url',
            returns: PrimitiveDataType.Texto,
            runtime: true,
            doc: 'Enlace al mensaje.'
        },
        fijado: {
            transpile: 'pinned',
            returns: PrimitiveDataType.Booleano,
            runtime: true,
            doc: 'Indica si el mensaje está fijado.'
        },
        adjuntos: {
            transpile: 'attachments.map(adjunto => adjunto.url)',
            returns: ArrayDataType.of(PrimitiveDataType.Texto),
            runtime: true,
            doc: 'Enlaces de los archivos adjuntos del mensaje.'
        },
        menciones: {
            transpile: 'mentions.users',
            returns: ArrayDataType.of(ClassDataType.of(DisChordClassesEnum.Usuario)),
            runtime: true,
            doc: 'Usuarios mencionados en el mensaje.'
        }
    }
};
