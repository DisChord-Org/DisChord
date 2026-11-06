import { OptionalTypes } from "./OptionalTypes";
import { CoreLibClass, CoreLibMember } from "../../../chord/corelib/corelib.types";
import { PrimitiveDataType } from "../../../chord/model/DataType";
import { PrimitiveType } from "../../../chord/model/types";

const tema: CoreLibMember = {
    transpile: 'canal.topic',
    returns: OptionalTypes.of(PrimitiveType.Texto),
    static: true,
    doc: 'Tema del canal, si tiene.'
};

const modoLento: CoreLibMember = {
    transpile: 'canal.rateLimitPerUser',
    returns: OptionalTypes.of(PrimitiveType.Numero),
    static: true,
    doc: 'Segundos que debe esperar un usuario entre mensajes.'
};

/**
 * The `canal` injected into every command and event: the channel it ran in, under Spanish names.
 * `transpile` is the member of the channel it reads, rewritten at compile time (an alias such as
 * `topico` reads the same member as `tema`).
 */
export const canalInjectedClass: CoreLibClass = {
    injected: true,
    methods: {},
    properties: {
        tema,
        modoLento,
        topico: tema,
        ratelimit: modoLento,
        posicion: {
            transpile: 'canal.position',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'Posición del canal en la lista de canales.'
        },
        categoria: {
            transpile: 'canal.parentId',
            returns: OptionalTypes.of(PrimitiveType.Texto),
            static: true,
            doc: 'Identificador de la categoría que contiene el canal.'
        },
        nombre: {
            transpile: 'canal.name',
            returns: OptionalTypes.of(PrimitiveType.Texto),
            static: true,
            doc: 'Nombre del canal.'
        },
        ultimoMensaje: {
            transpile: 'canal.lastMessageId',
            returns: OptionalTypes.of(PrimitiveType.Texto),
            static: true,
            doc: 'Identificador del último mensaje del canal.'
        }
    }
};
