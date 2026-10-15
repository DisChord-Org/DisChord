import { Test } from "../../../Test";
import { CorelibCommand, CorelibDocument } from "../../../../src/cli/commands/CorelibCommand";
import { eventsMap, CommandScope } from "../../../../src/dischord/Generator/constants/mappings";
import { CommandSchema, ButtonSchema, StartBotSchema } from "../../../../src/dischord/Generator/constants/schemas";
import { UnreservedComponentDeclarations } from "../../../../src/dischord/Parser/Grammar/UnreservedComponentDeclarations";
import { CoreLibCatalog } from "../../../../src/chord/corelib/CoreLibCatalog";
import { CoreLibMember } from "../../../../src/chord/corelib/corelib.types";
import { KeyWords } from "../../../../src/chord/KeywordsManager";
import { SymbolTable } from "../../../../src/chord/model/SymbolsTable";
import { CodeProvider } from "../../../../src/chord/CodeProvider";
import { Lexer } from "../../../../src/chord/Lexer";
import { TokenType } from "../../../../src/chord/model/types";
import { corelib } from "../../../../src/dischord/corelib/corelib.data";
import { disChordCoreLibUtils, disChordCoreLibDispatch } from "../../../../src/dischord/corelib";
import { DisChordParser } from "../../../../src/dischord/Parser/Parser";
import { DisChordNodeType, DisChordTokenType } from "../../../../src/dischord/types";
import { FileSystem } from "../../../../src/utils/FileSystem";
import { File } from "../../../../src/utils/File";
import { CompilationContext } from "../../../../src/chord/model/CompilationContext";
import path from "node:path";
import { Program } from "../../../../src/cli/Program";

/**
 * @class CorelibCatalogTest
 * @description Validates the document `corelib --json` prints: that it has the layout editors rely on, that it describes every class and member of the table, that its keywords are the ones the lexer really uses, and that the words outside the keyword registry (literals, `rango`, decorators, types) are the ones the compiler really handles.
 */
export class CorelibCatalogTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Corelib Catalog - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to describe the language's vocabulary the way the compiler sees it";

    /**
     * Not a comparison with a snapshot: it builds the document and checks it against the tables.
     * @override
     */
    protected override async run (): Promise<void> {
        const document = new CorelibCommand().build();

        this.assertLayout(document);
        this.assertTableCoverage(document);
        this.assertKeywords(document);
        this.assertVocabulary(document);
        this.assertSerializable(document);
        this.assertDisChordVocabulary(document);
        await this.assertSubcommand(document);
        await this.assertTextListing();
    }

    private assertLayout (document: CorelibDocument): void {
        if (document.schema !== CoreLibCatalog.schema) throw new Error(`schema is ${document.schema}`);

        for (const key of ['schema', 'compilerVersion', 'keywords', 'classes', 'functions', 'types', 'literals', 'decorators', 'declarations', 'events', 'blocks', 'scopes']) {
            if (!(key in document)) throw new Error(`The document lacks '${key}'`);
        }

        const expect = (what: string, value: object, keys: string[]): void => {
            const actual = Object.keys(value).sort().join();

            if (actual !== [...keys].sort().join()) throw new Error(`${what} has the keys ${actual}`);
        };

        document.classes.forEach(entry => {
            expect(`class ${entry.name}`, entry, ['name', 'receiver', 'instantiable', 'injected', 'methods', 'properties']);

            [...entry.methods, ...entry.properties].forEach(member => {
                expect(`member ${entry.name}.${member.name}`, member, ['name', 'returns', 'params', 'doc', 'static', 'async']);
                member.params?.forEach(param => expect(`parameter of ${entry.name}.${member.name}`, param, ['name', 'type', 'optional', 'rest']));
            });
        });
        document.functions.forEach(entry => expect(`function ${entry.name}`, entry, ['name', 'kind', 'async']));
        document.types.forEach(entry => expect(`type ${entry.name}`, entry, ['name', 'kind']));
        document.literals.forEach(entry => expect(`literal ${entry.name}`, entry, ['name', 'value']));
        document.declarations.forEach(entry => expect(`declaration ${entry.keyword}`, entry, ['keyword', 'block']));
        document.events.forEach(entry => expect(`event ${entry.name}`, entry, ['name', 'params']));
        document.scopes.forEach(entry => expect(`scope ${entry.construct}`, entry, ['construct', 'identifiers']));
        document.blocks.forEach(block => {
            expect(`block ${block.name}`, block, ['name', 'fields', 'nested']);
            block.nested.forEach(nested => expect(`nested ${nested.key} of ${block.name}`, nested, ['key', 'block', 'shape']));
        });
    }

    /**
     * Every class, method and property of the merged table is described, with nothing added.
     */
    private assertTableCoverage (document: CorelibDocument): void {
        const names = Object.keys(corelib.classes);

        if (document.classes.map(entry => entry.name).join() !== names.join()) {
            throw new Error(`Classes differ: ${document.classes.map(entry => entry.name).join()} vs ${names.join()}`);
        }

        document.classes.forEach(entry => {
            const source = corelib.classes[entry.name as keyof typeof corelib.classes];
            const methods = Object.keys(source.methods).join();
            const properties = Object.keys(source.properties ?? {}).join();

            if (entry.methods.map(member => member.name).join() !== methods) throw new Error(`${entry.name}: methods differ`);
            if (entry.properties.map(member => member.name).join() !== properties) throw new Error(`${entry.name}: properties differ`);
            if (entry.receiver !== (source.receiver?.format() ?? null)) throw new Error(`${entry.name}: receiver differs`);
            if (entry.instantiable !== (source.constructs !== undefined)) throw new Error(`${entry.name}: instantiable differs`);
            if (entry.injected !== ((source as { injected?: boolean }).injected ?? false)) throw new Error(`${entry.name}: injected differs`);

            const sources: Record<string, CoreLibMember> = { ...source.methods, ...(source.properties ?? {}) };

            [...entry.methods, ...entry.properties].forEach(member => {
                const from = sources[member.name];
                const where = `${entry.name}.${member.name}`;

                if (member.returns !== from.returns.format()) throw new Error(`${where}: returns differs`);
                if (member.static !== (from.static ?? false)) throw new Error(`${where}: static differs`);
                if (member.async !== (from.async ?? false)) throw new Error(`${where}: async differs`);
                if (member.doc !== (from.doc ?? null)) throw new Error(`${where}: doc differs`);

                const written = (param: { name: string; optional?: boolean; rest?: boolean }, type: string): string => `${param.rest ? '...' : ''}${param.name}${param.optional ? '?' : ''}:${type}`;
                const params = from.params?.map(param => written(param, param.type.format())).join() ?? null;
                const described = member.params?.map(param => written(param, param.type)).join() ?? null;

                if (described !== params) throw new Error(`${where}: params differ (${described} vs ${params})`);
            });
        });

        // A few facts that would go unnoticed if a flag were inverted everywhere
        const member = (className: string, name: string) => {
            const entry = document.classes.find(candidate => candidate.name === className);

            return [...(entry?.properties ?? []), ...(entry?.methods ?? [])].find(candidate => candidate.name === name);
        };
        const entry = (className: string) => document.classes.find(candidate => candidate.name === className);

        if (!member('Mates', 'PI')?.static) throw new Error('Mates.PI is not static');
        if (member('Texto', 'partir')?.static !== false) throw new Error('Texto.partir is static');
        if (entry('Mapa')?.instantiable !== true) throw new Error('Mapa is not instantiable');
        if (entry('cliente')?.injected !== true) throw new Error('cliente is not injected');
        if (entry('cliente')?.instantiable !== false) throw new Error('cliente is instantiable');

        const partir = JSON.stringify(member('Texto', 'partir')?.params?.map(param => [param.name, param.type, param.optional, param.rest]));
        if (partir !== '[["separador","texto",false,false],["limite","numero",true,false]]') throw new Error(`Texto.partir has the parameters ${partir}`);
        if (member('Texto', 'limpiar')?.params?.length !== 0) throw new Error('Texto.limpiar should take no parameters');
        if (member('consola', 'imprimir')?.params?.[0]?.rest !== true) throw new Error('consola.imprimir should take its values as a rest parameter');

        const functions = document.functions.filter(entry => entry.kind === 'function').map(entry => entry.name).join();
        if (functions !== Object.keys(corelib.functions).join()) throw new Error(`Functions differ: ${functions}`);
    }

    /**
     * The keywords are exactly what a real compilation context ends up with after registering the grammar.
     */
    private assertKeywords (document: CorelibDocument): void {
        const config = FileSystem.configure(this.fixturePath);
        const context: CompilationContext<DisChordNodeType> = {
            symbolTable: new SymbolTable(),
            keywordsManager: new KeyWords(),
            codeProvider: new CodeProvider(),
            projectRoot: config.projectRoot,
            distDir: config.distDir,
            outputDir: config.distDir,
            extraFiles: new Map(),
            extraDirectories: new Set(),
            coreLib: disChordCoreLibUtils,
            coreLibDispatch: disChordCoreLibDispatch
        };

        DisChordParser.registerGrammar(context);

        const registered = context.keywordsManager.getKeywordsList().join();
        if (document.keywords.join() !== registered) throw new Error('The keywords differ from the registry of a real context');
        if (document.keywords.length === 0) throw new Error('No keywords were reported');

        // Reserved for the lexer: a keyword never lexes as a plain identifier, and a literal is not one
        document.keywords.forEach(keyword => {
            const tokens = this.lex(keyword);

            if (tokens.length === 0 || tokens[0].type === TokenType.IDENTIFICADOR) throw new Error(`'${keyword}' lexes as an identifier`);
        });

        document.literals.forEach(literal => {
            if (document.keywords.includes(literal.name)) throw new Error(`'${literal.name}' is both a literal and a keyword`);
        });
    }

    /**
     * What the document adds to the registry is what the lexer and the parser really handle.
     */
    private assertVocabulary (document: CorelibDocument): void {
        const rango = document.functions.find(entry => entry.name === 'rango');
        if (rango?.kind !== 'syntax') throw new Error('rango is not reported as syntax');

        const esperar = document.functions.find(entry => entry.name === 'esperar');
        if (esperar?.kind !== 'function' || !esperar.async) throw new Error('esperar is not reported as an async function');

        const types = new Map(document.types.map(entry => [ entry.name, entry.kind ]));
        for (const [ name, kind ] of [ ['texto', 'primitive'], ['cualquiera', 'any'], ['nada', 'void'], ['Lista', 'class'] ]) {
            if (types.get(name) !== kind) throw new Error(`Type '${name}' is ${types.get(name)}, not ${kind}`);
        }
        for (const name of [ 'consola', 'Texto' ]) {
            if (types.has(name)) throw new Error(`'${name}' cannot be written as a type`);
        }

        if (document.decorators.join() !== '@asincrono,@BDOI,@fijar') throw new Error(`Decorators: ${document.decorators.join()}`);

        // Each literal word becomes the text it stands for when the source is lexed
        document.literals.forEach(literal => {
            const tokens = this.lex(literal.name);

            if (tokens.length !== 1 || tokens[0].type !== TokenType.TEXTO || tokens[0].value !== literal.value) {
                throw new Error(`'${literal.name}' does not lex to the text ${JSON.stringify(literal.value)}`);
            }
        });
    }

    /**
     * The `corelib --json` command of the CLI prints that same document, and its `--json` is its own
     * and not the root command's (which means diagnostics).
     */
    private async assertSubcommand (document: CorelibDocument): Promise<void> {
        const printed: string[] = [];
        const original = console.log;

        console.log = (...args: unknown[]) => { printed.push(args.join(' ')); };

        try {
            await new Program().parse(['node', 'dischord', 'corelib', '--json']);
        } finally {
            console.log = original;
        }

        if (printed.length !== 1) throw new Error(`The subcommand printed ${printed.length} lines`);
        if (JSON.stringify(JSON.parse(printed[0])) !== JSON.stringify(document)) throw new Error('The subcommand prints a different document');
    }

    /**
     * DisChord's own vocabulary is what the compiler's tables say, and every reference inside it points somewhere.
     */
    private assertDisChordVocabulary (document: CorelibDocument): void {
        if (document.events.map(entry => entry.name).join() !== Object.keys(eventsMap).join()) throw new Error('The events differ from eventsMap');
        if (document.declarations.map(entry => entry.keyword).join() !== UnreservedComponentDeclarations.map(entry => entry.keyword).join()) throw new Error('The declarations differ from the parser\'s');

        const encendido = document.events.find(entry => entry.name === 'encendido');
        if (encendido?.params.join() !== 'usuario,cliente') throw new Error('The ready event does not list its identifiers');

        const block = (name: string) => document.blocks.find(candidate => candidate.name === name);
        const field = (blockName: string, key: string) => block(blockName)?.fields.find(candidate => candidate.keys.includes(key));

        // Fields come from the schemas, with their synonyms and requirements
        if (block('comando')?.fields.map(entry => entry.keys[0]).join() !== CommandSchema.fields.map(entry => [entry.key].flat()[0]).join()) throw new Error('comando differs from CommandSchema');
        if (block('boton')?.fields.map(entry => entry.keys[0]).join() !== ButtonSchema.fields.map(entry => [entry.key].flat()[0]).join()) throw new Error('boton differs from ButtonSchema');
        if (field('encender bot', 'prefijos')?.keys.join() !== 'prefijo,prefijos') throw new Error('The prefix synonyms are lost');
        if (field('encender bot', 'token')?.required !== true) throw new Error('token should be required');
        if (StartBotSchema.fields.length !== block('encender bot')?.fields.length) throw new Error('encender bot lost a field');
        if (field('boton', 'emoji')?.required !== false) throw new Error('emoji should be optional');
        if (!field('boton', 'estilo')?.values?.length) throw new Error('estilo should list its values');

        // Nested blocks exist, and are the ones the compiler validates with
        const nested = (blockName: string, key: string) => block(blockName)?.nested.find(candidate => candidate.key === key);
        if (nested('comando', 'opciones')?.block !== 'opcion' || nested('comando', 'opciones')?.shape !== 'entries') throw new Error('comando.opciones is not described');
        if (nested('embed', 'campos')?.block !== 'campo' || nested('embed', 'campos')?.shape !== 'items') throw new Error('embed.campos is not described');
        if (nested('embed', 'pie')?.block !== 'pie' || nested('embed', 'pie')?.shape !== 'single') throw new Error('embed.pie is not described');

        const names = new Set(document.blocks.map(candidate => candidate.name));
        document.blocks.forEach(candidate => candidate.nested.forEach(entry => {
            if (!names.has(entry.block)) throw new Error(`${candidate.name}.${entry.key} points to the missing block '${entry.block}'`);
        }));
        document.declarations.forEach(entry => {
            if (entry.block !== null && !names.has(entry.block)) throw new Error(`The declaration '${entry.keyword}' points to the missing block '${entry.block}'`);
        });

        // What a command finds in scope: its parameter and every shortcut the generator declares
        const scope = document.scopes.find(entry => entry.construct === 'comando');
        if (scope?.identifiers.join() !== ['contexto', ...Object.keys(CommandScope)].join()) throw new Error('The scope of comando differs from CommandScope');
    }

    /**
     * Without `--json` the command prints a readable listing, with the signatures when they are written.
     */
    private async assertTextListing (): Promise<void> {
        const printed: string[] = [];
        const original = console.log;

        console.log = (...args: unknown[]) => { printed.push(args.join(' ')); };

        try {
            await new Program().parse(['node', 'dischord', 'corelib']);
        } finally {
            console.log = original;
        }

        const listing = printed.join('\n');

        for (const expected of [
            'Palabras reservadas: ',
            'Texto (sobre texto)',
            '.partir(separador: texto, limite?: numero) → texto[]',
            '.imprimir(...valores: cualquiera) → nada',
            'Funciones: esperar (asíncrona)',
            'Decoradores: @asincrono'
        ]) {
            if (!listing.includes(expected)) throw new Error(`The listing lacks '${expected}'`);
        }

        if (listing.trimStart().startsWith('{')) throw new Error('The text listing printed JSON');
    }

    private assertSerializable (document: CorelibDocument): void {
        const copy = JSON.parse(JSON.stringify(document));

        if (JSON.stringify(copy) !== JSON.stringify(document)) throw new Error('The document does not survive a JSON round trip');
    }

    private lex (code: string): { type: string; value: string }[] {
        const config = FileSystem.configure(this.fixturePath);
        const context: CompilationContext<DisChordNodeType> = {
            symbolTable: new SymbolTable(),
            keywordsManager: new KeyWords(),
            codeProvider: new CodeProvider(),
            projectRoot: config.projectRoot,
            distDir: config.distDir,
            outputDir: config.distDir,
            extraFiles: new Map(),
            extraDirectories: new Set(),
            coreLib: disChordCoreLibUtils,
            coreLibDispatch: disChordCoreLibDispatch
        };

        DisChordParser.registerGrammar(context);
        context.codeProvider.currentCode = { file: File.of(path.join(this.fixturePath, 'CorelibCatalogTest.ts')), content: code };

        return new Lexer<DisChordTokenType>(context).tokenize()
            .filter(token => token.type !== TokenType.EOF);
    }
}
