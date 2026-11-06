import { BDOSchema, FieldKind, FieldSpec, JSFallback } from "../../../../chord/BDOSchema";
import { ChannelAction, ChannelPayload, ChannelProperty, DisChordNode, DisChordNodeType } from "../../../types";
import { ChannelTypes } from ".././mappings";

/**
 * The properties describing a channel, shared by `crear canal` and `editar canal`. Every one is
 * optional here; each action's schema decides which are required.
 */
const ChannelNameField = {
    key: ChannelProperty.Nombre,
    kind: FieldKind.Value,
    default: JSFallback.Undefined,
    output: 'name'
} satisfies FieldSpec;

/** The kind of a channel: one of `ChannelTypes`. Also a filter of `listar canales`. */
const ChannelKindField = {
    key: 'tipo',
    kind: FieldKind.MappedLiteral,
    mapping: ChannelTypes,
    default: JSFallback.Undefined,
    output: 'type',
    invalidMessage: `El campo 'tipo' del canal debe ser un TEXTO`,
    unknownMessage: (value: string) => `Tipo de canal inválido: '${value}'. Se admite: ${Object.keys(ChannelTypes).join(' / ')}`
} satisfies FieldSpec;

/** The category a channel is in. Also a filter of `listar canales`. */
const ChannelCategoryField = {
    key: 'categoria',
    kind: FieldKind.Value,
    default: JSFallback.Undefined,
    output: ChannelPayload.Parent
} satisfies FieldSpec;

/** The properties of a channel besides its name, shared by `crear canal` and `editar canal`. */
const ChannelPropertyFields = [
    ChannelKindField,
    {
        key: 'tema',
        kind: FieldKind.Value,
        default: JSFallback.Undefined,
        output: 'topic'
    },
    {
        key: 'nsfw',
        kind: FieldKind.Value,
        default: JSFallback.Undefined,
        output: 'nsfw'
    },
    ChannelCategoryField,
    {
        key: 'posicion',
        kind: FieldKind.Value,
        default: JSFallback.Undefined,
        output: 'position'
    },
    {
        key: 'modoLento',
        kind: FieldKind.Value,
        default: JSFallback.Undefined,
        output: 'rate_limit_per_user'
    },
    {
        key: 'bitrate',
        kind: FieldKind.Value,
        default: JSFallback.Undefined,
        output: 'bitrate'
    },
    {
        key: 'limiteUsuarios',
        kind: FieldKind.Value,
        default: JSFallback.Undefined,
        output: 'user_limit'
    }
] satisfies FieldSpec[];

/** `crear canal { ... }`: `nombre` is required; `servidor` falls back to the current one. */
export const CreateChannelSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'crear canal',
    fields: [
        {
            key: ChannelProperty.Servidor,
            kind: FieldKind.Value,
            default: JSFallback.Undefined
        },
        {
            ...ChannelNameField,
            required: true,
            missingMessage: `En 'crear canal' se esperaba '${ChannelNameField.key}'.`
        },
        ...ChannelPropertyFields
    ]
};

/** `editar canal { ... }`: `canal` (the target) is required, everything else optional. */
export const EditChannelSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'editar canal',
    fields: [
        {
            key: ChannelProperty.Canal,
            kind: FieldKind.Value,
            required: true,
            missingMessage: `En 'editar canal' se esperaba '${ChannelProperty.Canal}'.` }
        ,
        ChannelNameField,
        ...ChannelPropertyFields,
        {
            key: ChannelProperty.Razon,
            kind: FieldKind.Value,
            default: JSFallback.Undefined
        }
    ]
};

/** `borrar canal { ... }`: only the target and the reason, which is required: it is the trace
 * left in the audit log of a destructive action. */
export const DeleteChannelSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'borrar canal',
    fields: [
        {
            key: ChannelProperty.Canal,
            kind: FieldKind.Value,
            required: true,
            missingMessage: `En 'borrar canal' se esperaba '${ChannelProperty.Canal}'.` }
        ,
        {
            key: ChannelProperty.Razon,
            kind: FieldKind.Value,
            required: true,
            missingMessage: `En 'borrar canal' se esperaba '${ChannelProperty.Razon}': queda en el registro de auditoría.`
        }
    ]
};

/**
 * `obtener canal { ... }`: the channel to read, by `id` or by `nombre` (exactly one of them, which
 * `ValidateChannelActionsRule` checks). `tipo` and `categoria` narrow a search by name, and
 * `servidor` is the server it searches in (the context's by default). `nombre` has no `output`:
 * it travels apart from the filters.
 */
export const GetChannelSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'obtener canal',
    fields: [
        {
            key: ChannelProperty.Id,
            kind: FieldKind.Value,
            default: JSFallback.Undefined
        },
        {
            key: ChannelNameField.key,
            kind: FieldKind.Value,
            default: JSFallback.Undefined
        },
        ChannelKindField,
        ChannelCategoryField,
        {
            key: ChannelProperty.Servidor,
            kind: FieldKind.Value,
            default: JSFallback.Undefined
        }
    ]
};

/** `listar canales { ... }`: the server (the context's by default) and what to filter by: `tipo`, `categoria`, `nombre` (the whole name) and `nombreContiene` (part of it). */
export const ListChannelsSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'listar canales',
    fields: [
        {
            key: ChannelProperty.Servidor,
            kind: FieldKind.Value,
            default: JSFallback.Undefined
        },
        ChannelKindField,
        ChannelCategoryField,
        ChannelNameField,
        {
            key: 'nombreContiene',
            kind: FieldKind.Value,
            default: JSFallback.Undefined,
            output: 'nameContains'
        }
    ]
};

/** The schema each channel action's block is checked and resolved against. */
export const ChannelActionSchemas: Record<ChannelAction, BDOSchema<DisChordNodeType, DisChordNode>> = {
    [ChannelAction.Crear]: CreateChannelSchema,
    [ChannelAction.Editar]: EditChannelSchema,
    [ChannelAction.Borrar]: DeleteChannelSchema,
    [ChannelAction.Obtener]: GetChannelSchema,
    [ChannelAction.Listar]: ListChannelsSchema
};

