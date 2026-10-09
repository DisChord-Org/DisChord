import path from "node:path";

import { Test } from "../../../Test";
import { KeyWords } from "../../../../src/chord/KeywordsManager";
import { Lexer } from "../../../../src/chord/Lexer";
import { SymbolTable } from "../../../../src/chord/model/SymbolsTable";
import { CodeProvider } from "../../../../src/chord/CodeProvider";
import { walkAST } from "../../../../src/chord/walkAST";
import { isAccessNode } from "../../../../src/chord/ast.guards";
import { coreLibUtils } from "../../../../src/chord/corelib";
import { DisChordParser } from "../../../../src/dischord/Parser/Parser";
import { DisChordAnalyzer } from "../../../../src/dischord/Analyzer/Analyzer";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../../../src/dischord/types";
import { FileSystem } from "../../../../src/utils/FileSystem";
import { CompilationContext } from "../../../../src/cli/commands/CompileCommand";

/**
 * Programs that between them use every kind of member access: on texts, lists, typed and untyped
 * receivers, unions, chains, writes, user classes, awaited receivers, static members and
 * dischord constructs.
 */
const programs: string[] = [
    'var t es "hola"\nconsola.imprimir(t.mayusculas())\nconsola.imprimir(t.longitud)\nconsola.imprimir(t.tiene("o"))\n',
    'var l es [1, 2]\nconsola.imprimir(l.longitud)\nl.agregar(3)\nconsola.imprimir(l.tiene(1))\n',
    'var m tipo Mapa es nuevo Mapa()\nm.poner("a", 1)\nconsola.imprimir(m.tiene("a"))\nconsola.imprimir(m.tamano)\nm.limpiar()\n',
    'funcion hayEn(c tipo Mapa|texto) {\n    devolver c.tiene("a")\n}\n\nconsola.imprimir(hayEn("abc"))\n',
    'funcion f(p) {\n    consola.imprimir(p.dia)\n    devolver p.mayusculas()\n}\n\nconsola.imprimir(f("a"))\n',
    'funcion fijar(p) {\n    p.longitud es 3\n    p.dia.mes es 1\n}\n\nvar u es {\n    longitud 1\n}\nfijar(u)\n',
    'funcion leer(a) {\n    consola.imprimir(a.dia.mes)\n    devolver a.b.c()\n}\n',
    'clase Caja {\n    prop x es "a"\n\n    funcion partir(z) {\n        devolver esta.x.mayusculas()\n    }\n}\n\nfuncion g(p) {\n    devolver p.partir(",")\n}\n\nvar c es nuevo Caja()\nconsola.imprimir(c.partir("a"))\nconsola.imprimir(g(c))\n',
    '@asincrono\nfuncion nombre() {\n    devolver " ab "\n}\n\n@asincrono\nfuncion principal() {\n    consola.imprimir(nombre().tiene("a"))\n    consola.imprimir(nombre().limpiar())\n}\n\nprincipal()\n',
    'funcion crear() -> Mapa {\n    devolver nuevo Mapa()\n}\n\nconsola.imprimir(crear().tiene("a"))\nconsola.imprimir(Mates.PI)\nconsola.imprimir(Mates.redondear(1.5))\n',
    'nuevo evento encendido {\n    imprimir(cliente.nombre mas cliente.id)\n}\n',
    'nuevo comando uno {\n    descripcion "Test";\n\n    enviar mensaje {\n        contenido usuario.nombre\n    }\n}\n'
];

/**
 * @class MemberAccessInvariantTest
 * @description Validates that the analyzer decides the name of every non-static member access (`SymbolTable.memberOf` is set for it) and leaves every static core library access unmarked, over programs that use all kinds of access. A table the analyzer never ran on must fail the same check, so the check can't pass by looking at nothing.
 */
export class MemberAccessInvariantTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Access Invariant - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to have the analyzer decide every non-static member access and no static one";

    /**
     * Not a comparison with a snapshot: it analyzes each program in memory and inspects its tree.
     * @override
     */
    protected override async run (): Promise<void> {
        let statics = 0;
        let members = 0;

        programs.forEach((code, index) => {
            const { ast, symbolTable } = this.analyze(code);
            const { violations, staticCount, memberCount } = this.inspect(ast, symbolTable);

            statics += staticCount;
            members += memberCount;

            if (violations.length > 0) throw new Error(`Program ${index}: ${violations.join('; ')}`);

            const { violations: unanalyzed } = this.inspect(ast, new SymbolTable());
            if (memberCount > 0 && unanalyzed.length === 0) throw new Error(`Program ${index}: the check passed on a table the analyzer never ran on`);
        });

        if (statics === 0 || members === 0) throw new Error(`The programs exercised ${members} member accesses and ${statics} static ones; both kinds are needed`);
    }

    /**
     * Lexes, parses and analyzes `code` the way the compiler does, without generating.
     */
    private analyze (code: string): { ast: DisChordASTNode[]; symbolTable: SymbolTable } {
        const context: CompilationContext<DisChordNodeType> = {
            symbolTable: new SymbolTable(),
            keywordsManager: new KeyWords(),
            codeProvider: new CodeProvider(),
            projectRoot: FileSystem.configure(this.fixturePath).projectRoot,
            extraFiles: new Map()
        };

        DisChordParser.registerGrammar(context);
        context.codeProvider.currentCode = { name: path.join(this.fixturePath, 'input.chord'), content: code };

        const tokens = new Lexer<DisChordTokenType>(context).tokenize();
        const ast: DisChordASTNode[] = new DisChordParser(tokens, context).parse();

        new DisChordAnalyzer(context).analyze(ast);

        return { ast, symbolTable: context.symbolTable };
    }

    /**
     * Checks every access of the tree against `symbolTable`: a non-static one must have a name decided, a static one must not.
     */
    private inspect (ast: DisChordASTNode[], symbolTable: SymbolTable): { violations: string[]; staticCount: number; memberCount: number } {
        const violations: string[] = [];
        let staticCount = 0;
        let memberCount = 0;

        ast.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (!isAccessNode(current)) return;

            const isStatic = coreLibUtils.resolveStatic(current) !== undefined;
            const decided = symbolTable.memberOf(current) !== undefined;

            if (isStatic) staticCount++;
            else memberCount++;

            if (isStatic && decided) violations.push(`static access to '${current.property}' was marked`);
            if (!isStatic && !decided) violations.push(`access to '${current.property}' was not decided by the analyzer`);
        }));

        return { violations, staticCount, memberCount };
    }
}
