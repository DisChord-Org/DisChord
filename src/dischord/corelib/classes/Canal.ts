import { OptionalTypes } from "./OptionalTypes";
import { CoreLibClass } from "../../../chord/corelib/corelib.types";
import { ClassDataType, PrimitiveDataType } from "../../../chord/model/DataType";
import { PrimitiveType } from "../../../chord/model/types";
import { ClassesEnum } from "../../../chord/corelib/classes/ClassesEnum";

/**
 * Seyfert channel data under Spanish names, for any channel object: the result of `crear`,
 * `editar`, `borrar`, `obtener canal` or `listar canales`, or a command option typed
 * `opcion "canal"`. Like `Usuario`, patched at runtime onto the real class (every member is
 * `runtime`); `transpile` is the property each getter reads. `id`, `nsfw` and `bitrate` are
 * not here: they are already called that, and a getter of the same name would break the
 * object's construction (see the note on `Usuario`).
 */
export const canalClass: CoreLibClass = {
    methods: {},
    properties: {
        nombre: {
            transpile: 'name',
            returns: OptionalTypes.of(PrimitiveType.Texto),
            runtime: true,
            doc: 'Nombre del canal.'
        },
        tema: {
            transpile: 'topic',
            returns: OptionalTypes.of(PrimitiveType.Texto),
            runtime: true,
            doc: 'Tema del canal, si tiene.'
        },
        tipo: {
            transpile: 'type',
            returns: OptionalTypes.of(PrimitiveType.Texto),
            runtime: true,
            doc: 'Tipo del canal: texto, voz, categoria, anuncios, escenario, foro o multimedia.'
        },
        categoria: {
            transpile: 'parentId',
            returns: OptionalTypes.of(PrimitiveType.Texto),
            runtime: true,
            doc: 'Identificador de la categoría que contiene el canal, si está en una.'
        },
        posicion: {
            transpile: 'position',
            returns: OptionalTypes.of(PrimitiveType.Numero),
            runtime: true,
            doc: 'Posición del canal en la lista de canales.'
        },
        modoLento: {
            transpile: 'rateLimitPerUser',
            returns: OptionalTypes.of(PrimitiveType.Numero),
            runtime: true,
            doc: 'Segundos que debe esperar un usuario entre mensajes.'
        },
        limiteUsuarios: {
            transpile: 'userLimit',
            returns: OptionalTypes.of(PrimitiveType.Numero),
            runtime: true,
            doc: 'Máximo de usuarios de un canal de voz, si lo tiene.'
        },
        servidor: {
            transpile: 'guildId',
            returns: OptionalTypes.of(PrimitiveType.Texto),
            runtime: true,
            doc: 'Identificador del servidor al que pertenece el canal.'
        },
        ultimoMensaje: {
            transpile: 'lastMessageId',
            returns: OptionalTypes.of(PrimitiveType.Texto),
            runtime: true,
            doc: 'Identificador del último mensaje del canal.'
        },
        mencion: {
            transpile: 'toString()',
            returns: PrimitiveDataType.Texto,
            runtime: true,
            doc: 'Mención del canal, para escribirla en un mensaje.'
        },
        enlace: {
            transpile: 'url',
            returns: PrimitiveDataType.Texto,
            runtime: true,
            doc: 'Enlace al canal.'
        },
        creadoEn: {
            transpile: 'createdAt',
            returns: ClassDataType.of(ClassesEnum.Fecha),
            runtime: true,
            doc: 'Fecha de creación del canal.'
        }
    }
};
