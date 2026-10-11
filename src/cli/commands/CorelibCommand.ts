import pkg from '../../../package.json';
import { KeyWords } from '../../chord/KeywordsManager';
import { CoreLibCatalog, CoreLibClassDescription, CoreLibDescription, CoreLibFunctionDescription, CoreLibMemberDescription } from '../../chord/corelib/CoreLibCatalog';
import { disChordCoreLibUtils } from '../../dischord/corelib/DisChordCoreLibUtils';
import { DisChordParser } from '../../dischord/Parser/Parser';

/**
 * The document `corelib --json` prints: the language's vocabulary, for editor tooling.
 *
 * @interface CorelibDocument
 */
export interface CorelibDocument extends CoreLibDescription {
    /** Version of this layout: an editor decides from it whether it understands the document. */
    readonly schema: number;
    /** Version of the compiler that produced it; informative, it changes with every release. */
    readonly compilerVersion: string;
    /** Reserved words, as the lexer's keyword registry knows them. */
    readonly keywords: string[];
}

/**
 * Command handler that prints what the language provides out of the box: its reserved words, and
 * the classes, methods, properties, functions, types, literals and decorators it knows. It is the
 * data an editor needs for completion and hover, taken from the same tables the compiler uses so
 * it cannot drift.
 *
 * @class CorelibCommand
 */
export class CorelibCommand {
    /**
     * Prints the language's vocabulary.
     *
     * @param {{ json?: boolean }} options - `json` prints a single JSON document instead of a readable listing.
     * @returns {void}
     */
    public execute(options: { json?: boolean }): void {
        const document = this.build();

        if (options.json) {
            console.log(JSON.stringify(document));
            return;
        }

        console.log(`Palabras reservadas: ${document.keywords.join(', ')}\n`);
        document.classes.forEach(entry => this.print(entry));
        console.log(`\nFunciones: ${document.functions.map(entry => this.describeFunction(entry)).join(', ')}`);
        console.log(`Tipos: ${document.types.map(entry => entry.name).join(', ')}`);
        console.log(`Literales: ${document.literals.map(entry => entry.name).join(', ')}`);
        console.log(`Decoradores: ${document.decorators.join(', ')}`);
    }

    /**
     * Gathers the vocabulary of the language the CLI compiles.
     *
     * @returns {CorelibDocument}
     */
    public build(): CorelibDocument {
        const keywords = new KeyWords<string>();
        DisChordParser.registerKeywords(keywords);

        return {
            schema: CoreLibCatalog.schema,
            compilerVersion: pkg.version,
            keywords: keywords.getKeywordsList(),
            ...new CoreLibCatalog(disChordCoreLibUtils).describe()
        };
    }

    /**
     * Prints one class and its members, one per line.
     *
     * @private
     * @param {CoreLibClassDescription} entry - The class to print.
     */
    private print(entry: CoreLibClassDescription): void {
        const receiver = entry.receiver ? ` (sobre ${entry.receiver})` : '';
        console.log(`${entry.name}${receiver}`);

        entry.properties.forEach(property => console.log(`  .${property.name}: ${property.returns}`));
        entry.methods.forEach(method => console.log(`  .${method.name}(${this.parameters(method)}) → ${this.signature(method)}`));
    }

    /**
     * @private
     * @param {CoreLibMemberDescription} member - The method to describe.
     * @returns {string} Its parameters as `nombre: tipo`, or an ellipsis when they are not written down.
     */
    private parameters(member: CoreLibMemberDescription): string {
        if (!member.params) return '…';

        return member.params
            .map(param => `${param.rest ? '...' : ''}${param.name}${param.optional ? '?' : ''}: ${param.type}`)
            .join(', ');
    }

    /**
     * @private
     * @param {CoreLibMemberDescription} member - The member to describe.
     * @returns {string} Its return type, flagged when the compiler awaits it.
     */
    private signature(member: CoreLibMemberDescription): string {
        return member.async ? `${member.returns} (asíncrono)` : member.returns;
    }

    /**
     * @private
     * @param {CoreLibFunctionDescription} entry - The function to describe.
     * @returns {string} Its name, flagged when it is syntax or awaited by the compiler.
     */
    private describeFunction(entry: CoreLibFunctionDescription): string {
        const flags = [ entry.kind === 'syntax' ? 'sintaxis' : '', entry.async ? 'asíncrona' : '' ].filter(Boolean);

        return flags.length > 0 ? `${entry.name} (${flags.join(', ')})` : entry.name;
    }
}
