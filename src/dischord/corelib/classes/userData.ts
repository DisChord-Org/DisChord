import { OptionalTypes } from "./OptionalTypes";
import { PrimitiveDataType } from "../../../chord/model/DataType";
import { PrimitiveType } from "../../../chord/model/types";
import { CoreLibMember } from "../../../chord/corelib/corelib.types";

/**
 * The data of a Seyfert `User` under Spanish names. `GuildMember` has none of its own: the runtime module
 * patches it with these same getters, delegating to its `user`, so `Usuario` and `Miembro` share them.
 * Every member is `runtime` (see the note on `Usuario`).
 * @type {Record<string, CoreLibMember>}
 */
export const userData: Record<string, CoreLibMember> = {
    nombre: {
        transpile: 'username',
        returns: PrimitiveDataType.Texto,
        runtime: true,
        doc: 'Nombre de usuario.'
    },
    nombreGlobal: {
        transpile: 'globalName',
        returns: OptionalTypes.of(PrimitiveType.Texto),
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
        returns: OptionalTypes.of(PrimitiveType.Numero),
        runtime: true,
        doc: 'Insignias públicas del usuario, como número de banderas.'
    },
    esBot: {
        transpile: 'bot',
        returns: OptionalTypes.of(PrimitiveType.Booleano),
        runtime: true,
        doc: 'Indica si el usuario es un bot.'
    },
    esSistema: {
        transpile: 'system',
        returns: OptionalTypes.of(PrimitiveType.Booleano),
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
        returns: OptionalTypes.of(PrimitiveType.Texto),
        runtime: true,
        doc: 'URL del banner del usuario, si tiene.'
    },
    colorPerfil: {
        transpile: 'accentColor',
        returns: OptionalTypes.of(PrimitiveType.Numero),
        runtime: true,
        doc: 'Color del perfil del usuario, si lo tiene.'
    },
    tipoPremium: {
        transpile: 'premiumType',
        returns: OptionalTypes.of(PrimitiveType.Numero),
        runtime: true,
        doc: 'Tipo de suscripción premium del usuario, si la tiene.'
    }
};
