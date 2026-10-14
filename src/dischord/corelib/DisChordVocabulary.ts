import { BDOSchema, fieldKeys, FieldSpec } from "../../chord/BDOSchema";
import { CommandContextParameter, CommandScope, eventsMap } from "../Generator/constants/mappings";
import {
    ButtonSchema, CollectorSchema, CommandSchema, CreateChannelSchema, DeleteChannelSchema, EditChannelSchema, GetChannelSchema, ListChannelsSchema, EmbedFieldSchema, EmbedFooterSchema, EmbedSchema, MessageSchema, OptionSchema, StartBotSchema
} from "../Generator/constants/schemas";
import { UnreservedComponentDeclarations } from "../Parser/Grammar/UnreservedComponentDeclarations";
import { DisChordNode, DisChordNodeType } from "../types";

/** A property a block accepts, as an editor needs to show it. */
export interface BlockFieldDescription {
    /** Names it can be written with: the first is the canonical one, the rest are synonyms (`prefijo` / `prefijos`). */
    readonly keys: string[];
    /** `value` takes any expression, `list` a list, the `mapped…` kinds only the names in `values`. */
    readonly kind: string;
    readonly required: boolean;
    /** The closed vocabulary of a `mapped…` field; absent for the others. */
    readonly values?: string[];
}

/** A property whose value is itself a block (`campos`, `pie`, `opciones`). */
export interface BlockNestedDescription {
    readonly key: string;
    /** Name of the block its value is described by. */
    readonly block: string;
    /** `items`: a list of blocks; `entries`: a block whose every entry is one; `single`: one block. */
    readonly shape: 'items' | 'entries' | 'single';
}

/** The shape of a block `{ ... }` of a construct. */
export interface BlockDescription {
    readonly name: string;
    readonly fields: BlockFieldDescription[];
    readonly nested: BlockNestedDescription[];
}

/** A component declared with an unreserved word: `<keyword> Nombre { ... }`. */
export interface DeclarationDescription {
    readonly keyword: string;
    /** Name of the block its body is described by, when it has one. */
    readonly block: string | null;
}

/** An event name, with the identifiers its handler finds in scope. */
export interface EventDescription {
    readonly name: string;
    readonly params: string[];
}

/** What a construct's body finds in scope without declaring it. */
export interface ScopeDescription {
    readonly construct: string;
    readonly identifiers: string[];
}

/** DisChord's own vocabulary: what the keyword registry and the core library do not say. */
export interface DisChordVocabularyDescription {
    readonly declarations: DeclarationDescription[];
    readonly events: EventDescription[];
    readonly blocks: BlockDescription[];
    readonly scopes: ScopeDescription[];
}

/**
 * Describes DisChord's constructs in plain, serializable data: the words that declare components,
 * the events a bot can handle, the properties each block accepts and what each handler finds in
 * scope. Every list is read from the tables the compiler's analyzer and generators use (the block
 * schemas, `eventsMap`, `CommandScope`, `UnreservedComponentDeclarations`), so it cannot drift
 * from what is actually accepted.
 *
 * The one thing written by hand is which schema belongs to which construct, in `blockSchemas`:
 * the compiler binds them at each rule and visitor, so there is no registry to read it from.
 */
export class DisChordVocabulary {
    /** Block name → its schema. A new schema has to be added here to be described. */
    private static readonly blockSchemas: Readonly<Record<string, BDOSchema<DisChordNodeType, DisChordNode>>> = {
        'encender bot': StartBotSchema,
        'comando': CommandSchema,
        'opcion': OptionSchema('', { blocks: {} }),
        'boton': ButtonSchema,
        'embed': EmbedSchema,
        'campo': EmbedFieldSchema,
        'pie': EmbedFooterSchema,
        'recolector': CollectorSchema,
        'mensaje': MessageSchema,
        'crear canal': CreateChannelSchema,
        'editar canal': EditChannelSchema,
        'borrar canal': DeleteChannelSchema,
        'obtener canal': GetChannelSchema,
        'listar canales': ListChannelsSchema
    };

    /**
     * @returns {DisChordVocabularyDescription} The vocabulary, every list in declaration order.
     */
    public describe(): DisChordVocabularyDescription {
        const blocks = Object.entries(DisChordVocabulary.blockSchemas);

        return {
            declarations: UnreservedComponentDeclarations.map(declaration => ({
                keyword: declaration.keyword,
                block: this.blockOf(declaration.keyword)
            })),
            events: Object.entries(eventsMap).map(([name, event]) => ({ name, params: [...event.params] })),
            blocks: blocks.map(([name, schema]) => this.describeBlock(name, schema)),
            scopes: [
                { construct: 'comando', identifiers: [CommandContextParameter, ...Object.keys(CommandScope)] }
            ]
        };
    }

    /**
     * The block that describes the body of a declared component: the one named like it.
     */
    private blockOf(keyword: string): string | null {
        return Object.prototype.hasOwnProperty.call(DisChordVocabulary.blockSchemas, keyword) ? keyword : null;
    }

    private describeBlock(name: string, schema: BDOSchema<DisChordNodeType, DisChordNode>): BlockDescription {
        return {
            name,
            fields: schema.fields.map(field => this.describeField(field)),
            nested: (schema.nested ?? []).map(nested => ({
                key: nested.key,
                block: this.nameOf(nested.schema) ?? 'opcion',
                shape: nested.forEachEntry ? 'entries' : nested.forEachItem ? 'items' : 'single'
            }))
        };
    }

    private describeField(field: FieldSpec): BlockFieldDescription {
        return {
            keys: fieldKeys(field.key),
            kind: field.kind,
            required: field.required ?? false,
            ...(field.mapping ? { values: Object.keys(field.mapping) } : {})
        };
    }

    /**
     * The name a schema is registered under, when it is one of the registered ones.
     */
    private nameOf(schema: BDOSchema<DisChordNodeType, DisChordNode> | undefined): string | undefined {
        return Object.entries(DisChordVocabulary.blockSchemas).find(([, candidate]) => candidate === schema)?.[0];
    }
}
