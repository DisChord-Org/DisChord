import { BDOSchema, FieldKind, FieldSpec, JSFallback } from "../../../chord/BDOSchema";
import { PrimitiveDataType, UnionDataType } from "../../../chord/model/DataType";
import { ModerationAction, ModerationBlockName, ModerationProperty, DisChordNode, DisChordNodeType } from "../../types";

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
        missingMessage: `En '${name}' se esperaba '${ModerationProperty.Razon}': queda en el registro de auditoría.`,
        type: PrimitiveDataType.Texto
    },
    {
        // its id, or the object of the server
        key: ModerationProperty.Servidor,
        kind: FieldKind.Value,
        default: JSFallback.Undefined,
        type: UnionDataType.ofTypes([ PrimitiveDataType.Texto, PrimitiveDataType.BDO ])
    }
];

/** `banear miembro { ... }`: `usuario` and `razon` are required; `borrarMensajes` (seconds) is optional. */
export const BanMemberSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: ModerationBlockName[ModerationAction.Banear],
    fields: [
        ...moderationFields(ModerationBlockName[ModerationAction.Banear]),
        {
            key: ModerationProperty.BorrarMensajes,
            kind: FieldKind.Value,
            default: JSFallback.Undefined,
            type: PrimitiveDataType.Numero
        }
    ]
};

/** `desbanear usuario { ... }`: `usuario` and `razon` are required. */
export const UnbanUserSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: ModerationBlockName[ModerationAction.Desbanear],
    fields: moderationFields(ModerationBlockName[ModerationAction.Desbanear])
};

/** `expulsar miembro { ... }`: `usuario` and `razon` are required. */
export const KickMemberSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: ModerationBlockName[ModerationAction.Expulsar],
    fields: moderationFields(ModerationBlockName[ModerationAction.Expulsar])
};

/** The schema each moderation action's block is checked and resolved against. */
export const ModerationActionSchemas: Record<ModerationAction, BDOSchema<DisChordNodeType, DisChordNode>> = {
    [ModerationAction.Banear]: BanMemberSchema,
    [ModerationAction.Desbanear]: UnbanUserSchema,
    [ModerationAction.Expulsar]: KickMemberSchema
};
