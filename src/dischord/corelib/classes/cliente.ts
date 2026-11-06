import { OptionalTypes } from "./OptionalTypes";
import { CoreLibClass } from "../../../chord/corelib/corelib.types";
import { AnyDataType, PrimitiveDataType, VoidDataType } from "../../../chord/model/DataType";
import { PrimitiveType } from "../../../chord/model/types";

/**
 * The `cliente` injected into every command and event: the Seyfert client, with the members the
 * language offers on it.
 */
export const clienteClass: CoreLibClass = {
    injected: true,
    methods: {
        emitir: {
            transpile: 'cliente.events.runEvent',
            returns: VoidDataType.Void,
            static: true,
            params: [
                {
                    name: 'nombre',
                    type: PrimitiveDataType.Texto
                },
                {
                    name: 'destinatario',
                    type: AnyDataType.Any
                },
                {
                    name: 'paquete',
                    type: AnyDataType.Any
                },
                {
                    name: 'fragmento',
                    type: PrimitiveDataType.Numero
                },
                {
                    name: 'usarCache',
                    type: PrimitiveDataType.Booleano,
                    optional: true
                }
            ],
            doc: 'Reproduce un paquete de la puerta de enlace a través de los manejadores de eventos: recibe el nombre del evento de Discord (p. ej. "MESSAGE_CREATE"), el cliente, el paquete en bruto, el fragmento (shard) y, opcionalmente, si debe actualizar la caché. Devuelve una promesa.'
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
            returns: OptionalTypes.of(PrimitiveType.Texto),
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
};
