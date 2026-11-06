import { BDOSchema, FieldKind, FieldSpec, JSFallback } from "../../../../chord/BDOSchema";
import { ModerationAction, ModerationProperty, DisChordNode, DisChordNodeType } from "../../../types";

/** The target of a moderation block and the reason, which is required: it is the trace left in the audit log. */
const moderationFields = (name: string): FieldSpec[] => [
    {
        key: ModerationProperty.Usuario,
        kind: FieldKind.Value,
        required: true,
        missingMessage: `En '${name}' se esperaba '${ModerationProperty.Usuario}'.`
    },
    {
        key: ModerationProperty.Razon,
        kind: FieldKind.Value,
        required: true,
        missingMessage: `En '${name}' se esperaba '${ModerationProperty.Razon}': queda en el registro de auditoría.`
    },
    {
        key: ModerationProperty.Servidor,
        kind: FieldKind.Value,
        default: JSFallback.Undefined
    }
];

/** `banear miembro { ... }`: `usuario` and `razon` are required; `borrarMensajes` (seconds) is optional. */
export const BanMemberSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'banear miembro',
    fields: [
        ...moderationFields('banear miembro'),
        {
            key: ModerationProperty.BorrarMensajes,
            kind: FieldKind.Value,
            default: JSFallback.Undefined
        }
    ]
};

/** `desbanear usuario { ... }`: `usuario` and `razon` are required. */
export const UnbanUserSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'desbanear usuario',
    fields: moderationFields('desbanear usuario')
};

/** `expulsar miembro { ... }`: `usuario` and `razon` are required. */
export const KickMemberSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'expulsar miembro',
    fields: moderationFields('expulsar miembro')
};

/** The schema each moderation action's block is checked and resolved against. */
export const ModerationActionSchemas: Record<ModerationAction, BDOSchema<DisChordNodeType, DisChordNode>> = {
    [ModerationAction.Banear]: BanMemberSchema,
    [ModerationAction.Desbanear]: UnbanUserSchema,
    [ModerationAction.Expulsar]: KickMemberSchema
};
