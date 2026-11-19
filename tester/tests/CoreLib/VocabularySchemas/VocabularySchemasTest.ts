import { Test } from "../../../Test";
import * as schemas from "../../../../src/dischord/tables/schemas";
import { DisChordVocabulary } from "../../../../src/dischord/corelib/DisChordVocabulary";

/**
 * @class VocabularySchemasTest
 * @description Every block schema the dialect exports has to be registered in `DisChordVocabulary.blockSchemas`,
 * since the vocabulary (`corelib` for editors) describes only what is registered there: a new schema left out
 * would be accepted by the compiler and invisible to the editor.
 */
export class VocabularySchemasTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Vocabulary Schemas - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to register in the vocabulary every block schema the dialect exports";

    /**
     * Not a comparison with a snapshot: it compares the exported schemas with the registered ones.
     * @override
     */
    protected override async run (): Promise<void> {
        const registered = new Set<unknown>(Object.values((DisChordVocabulary as unknown as { blockSchemas: Record<string, unknown> }).blockSchemas));
        const exported = this.schemasOf(schemas);

        if (exported.size === 0) throw new Error('No schema was found among the exports; the check would pass on nothing');

        const missing = [...exported].filter(([, schema]) => !registered.has(schema)).map(([name]) => name);

        if (missing.length > 0) throw new Error(`Schemas not registered in DisChordVocabulary.blockSchemas: ${missing.join(', ')}`);
    }

    /**
     * The schemas among the values of `exports`, looking one level into the tables of them (`ChannelActionSchemas`).
     */
    private schemasOf (exports: Record<string, unknown>): Map<string, unknown> {
        const found = new Map<string, unknown>();
        const isSchema = (value: unknown): boolean => typeof value === 'object' && value !== null && Array.isArray((value as { fields?: unknown }).fields);

        Object.entries(exports).forEach(([name, value]) => {
            if (isSchema(value)) found.set(name, value);
            else if (typeof value === 'object' && value !== null) Object.entries(value).forEach(([key, inner]) => isSchema(inner) && found.set(`${name}.${key}`, inner));
        });

        return found;
    }
}
