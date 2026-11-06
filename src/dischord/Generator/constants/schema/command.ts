import { ASTNode } from "../../../../chord/model/types";
import { BDOSchema, FieldKind, JSFallback, literalStringValue } from "../../../../chord/BDOSchema";
import { ApplicationIntegrationType, DisChordNode, DisChordNodeType, InteractionContextType } from "../../../types";
import { ContextTypes, DisChordTypeMap, IgnoreCommandTypes, IntegrationTypes } from "../mappings";
import { SchemaFields } from "./SchemaFields";

/** `comando`'s own `opciones` entries: `miOpcion { tipo "texto" descripcion "..." requerido si }`. */
export function OptionSchema (
    optionName: string,
    entry: { blocks: Record<string, ASTNode<DisChordNodeType, DisChordNode>> }
): BDOSchema<DisChordNodeType, DisChordNode> {
    const optionType = (literalStringValue(entry.blocks['tipo']) ?? '').toLowerCase();

    return {
        name: 'opcion',
        fields: [
            {
                key: 'tipo',
                kind: FieldKind.MappedLiteral,
                mapping: DisChordTypeMap,
                required: true,
                missingMessage: `Tipo de opción no reconocido en '${optionName}'`,
                invalidMessage: `Tipo de opción no reconocido en '${optionName}'`,
                unknownMessage: () => `Tipo de opción no reconocido en '${optionName}'`
            },
            SchemaFields.required('descripcion', `En la declaración de la opción tipo '${optionType}', se esperaba 'descripcion'.`),
            SchemaFields.required('requerido', `En la declaración de la opción tipo '${optionType}', se esperaba 'requerido'.`)
        ]
    };
}

/** `comando`'s own properties (its command flags and `opciones`). */
export const CommandSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'comando',
    fields: [
        SchemaFields.required('descripcion', `Se requiere descripción para el comando`),
        SchemaFields.value('nsfw', JSFallback.False),
        {
            key: 'integraciones',
            kind: FieldKind.MappedList,
            mapping: IntegrationTypes,
            default: `[ ${ApplicationIntegrationType.GuildInstall} ]`,
            invalidMessage: `El campo 'integraciones' debe ser una lista de opciones`,
            unknownMessage: () => `En las integraciones solo se puede especificar: ${Object.keys(IntegrationTypes).join(' / ')}`
        },
        {
            key: 'contextos',
            kind: FieldKind.MappedList,
            mapping: ContextTypes,
            default: `[ ${InteractionContextType.Guild} ]`,
            invalidMessage: `El campo 'contextos' debe ser una lista de opciones`,
            unknownMessage: () => `En los contextos solo se puede especificar: ${Object.keys(ContextTypes).join(' / ')}`
        },
        SchemaFields.value('servidoresPermitidos', JSFallback.Undefined),
        {
            key: 'ignorar',
            kind: FieldKind.MappedLiteral,
            mapping: IgnoreCommandTypes,
            default: JSFallback.Undefined,
            invalidMessage: `Solo se permite tipo TEXTO en 'ignorar'`,
            unknownMessage: () => `En 'ignorar' solo se puede especificar un TEXTO de: ${Object.keys(IgnoreCommandTypes).join(' / ')}`
        },
        {
            key: 'alias',
            kind: FieldKind.List,
            default: JSFallback.Undefined,
            invalidMessage: `Los alias deben ser una LISTA con valores tipo TEXTO`
        }
    ],
    nested: [
        { key: 'opciones', forEachEntry: true, schemaFor: OptionSchema }
    ]
};

