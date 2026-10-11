import { Test } from "../../../Test";
import { CorelibCommand, CorelibDocument } from "../../../../src/cli/commands/CorelibCommand";
import { CoreLibCatalog } from "../../../../src/chord/corelib/CoreLibCatalog";
import { CoreLibMember } from "../../../../src/chord/corelib/corelib.types";
import { KeyWords } from "../../../../src/chord/KeywordsManager";
import { SymbolTable } from "../../../../src/chord/model/SymbolsTable";
import { CodeProvider } from "../../../../src/chord/CodeProvider";
import { Lexer } from "../../../../src/chord/Lexer";
import { TokenType } from "../../../../src/chord/types";
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
        await this.assertSubcommand(document);
    }

    private assertLayout (document: CorelibDocument): void {
        if (document.schema !== CoreLibCatalog.schema) throw new Error(`schema is ${document.schema}`);

        for (const key of ['schema', 'compilerVersion', 'keywords', 'classes', 'functions', 'types', 'literals', 'decorators']) {
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
        if (member('consola', 'imprimir')?.params !== null) throw new Error('consola.imprimir should not have its parameters written yet');

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
