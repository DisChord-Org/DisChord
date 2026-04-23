import { ChordError, ErrorLevel } from "../ChordError";
import { corelib, runtimeInjections } from "./core.lib";
import { AccessNode, AccessNodeByIndex, AssignmentNode, ASTNode, BinaryExpressionNode, CallNode, ClassNode, ConditionNode, ExportNode, FunctionNode, ListNode, LiteralNode, LoopNode, NoUnaryNode, ODBMode, ODBNode, PropertyNode, Symbol, UnaryNode, VariableNode } from "./types";

export class Generator<T extends string = string, N = never> {
    private SymbolsTable: Map<string, Symbol>;

    constructor (public symbols: Map<string, Symbol>) {
        this.SymbolsTable = symbols;
    }

    public generate(nodes: ASTNode<T>[]): string {
        const body = nodes.map(node => {
            const code = this.visit(node);
            const noSemicolon = ['CONDICION', 'BUCLE', 'CLASE', 'FUNCION'];

            return noSemicolon.includes(node.type) ? code : code + ";";
        }).join('\n');

        return `
            ${runtimeInjections}
            ${body}
        `;
    }

    public visit(node: ASTNode<T>): string {
        switch (node.type) {
            case 'Clase':
                return this.generateClass(node);
            case 'Llamada':
                return this.generateCall(node);
            case 'Literal':
                return this.generateLiteral(node);
            case 'Identificador':
                return node.value as string;
            case 'Lista':
                return this.generateArray(node);
            case 'Acceso':
                return this.generateAccess(node);
            case 'AccesoPorIndice':
                return this.generateIndexAccess(node);
            case 'Funcion':
                return this.generateFunction(node);
            case 'Propiedad':
                return this.generateProperty(node);
            case 'Esta':
                return 'this';
            case 'Asignacion':
                return this.generateAssignation(node);
            case 'Super':
                return 'super';
            case 'ExpresionBinaria':
                return this.generateBinaryOperation(node);
            case 'Variable':
                return this.generateVariableDeclaration(node);
            case 'Nuevo':
                return `new ${this.visit(node.object)}`;
            case 'NoUnario':
                return this.generateUnaryOperation(node);
            case 'Expresion':
                return `(${this.visit(node.object)})`;
            case 'Condicion':
                return this.generateCondition(node);
            case 'Unario':
                return this.generateUnaryOperation(node);
            case 'Bucle':
                return this.generateFor(node);
            case 'BDO':
                return this.generateObject(node);
            case 'Salir':
                return 'break';
            case 'Pasar':
                return 'continue';
            case 'Devolver':
                return node.object ? `return ${this.visit(node.object)}` : 'return';
            case 'Exportar':
                return this.generateExport(node);
            case 'Importar':
                let path = node.path.replace(/\.chord$/, '');

               if (path.startsWith('lib:')) {
                    path = `../lib/${path.split(':')[1]}.mjs`; 
                }

                if (!path.startsWith('./') && !path.startsWith('../') && !path.startsWith('/')) {
                    path = `./${path}`;
                }

                if (!path.endsWith('.mjs')) {
                    path += '.mjs';
                }

                if (node.isDestructured) {
                    const ids = node.identificators.join(', ');
                    return `import { ${ids} } from "${path}"`;
                }
                
                return `import * as ${node.identificators[0]} from "${path}"`;
            case 'JS':
                return `${node.value}`;
            default:
                throw new ChordError(
                    ErrorLevel.Compiler,
                    `Generador: Tipo de nodo desconocido: ${node.type}`,
                    node.location
                ).format();
        }
    }

    public visitIfExists (node: ASTNode<T> | undefined): string | undefined {
        return node ? this.visit(node) : undefined;
    }

    private generateClass(node: ClassNode<T>): string {
        const inheritance = node.superClass ? ` extends ${node.superClass}` : '';
        const body = node.body
            .map((n: ASTNode<T>) => "  " + this.visit(n) + ";")
            .join('\n\n');
        
        return `class ${node.id}${inheritance} {\n  ${body}\n}`;
    }

    generateAccess(node: AccessNode<T>): string { 
        const objName = node.object.type === 'Identificador' ? node.object.value : null;
        const propName = node.property;

        if (objName && corelib.classes[objName] && corelib.classes[objName].methods[propName]) {
            return corelib.classes[objName].methods[propName];
        }

        for (const className in corelib.classes) {
            const methods = corelib.classes[className].methods;
            if (methods && methods[propName]) {
                return `${this.visit(node.object)}.${methods[propName]}`;
            }
        }

        return `${this.visit(node.object)}.${propName}`;
    }

    private generateIndexAccess(node: AccessNodeByIndex<T>): string {
        return `${this.visit(node.object)}[${this.visit(node.index)}]`;
    }

    generateCall(node: CallNode<T>): string {
        const args: string = node.params.map((arg: ASTNode<T>) => this.visit(arg)).join(', ');
        let translation: string;
        let isAsyncCall = false;

        if (node.object.type === 'Acceso') {
            translation = this.generateAccess(node.object);

            const symbol = this.SymbolsTable.get(node.object.property);
            if (symbol && symbol.metadata.isAsync) isAsyncCall = true;
        } else {
            if (!('value' in node.object)) throw new ChordError(
                ErrorLevel.Compiler,
                `Se esperaba una llamada con valor en su objeto.`,
                node.location
            ).format();

            const name = node.object.value;
            if (typeof name != 'string') throw new ChordError(
                ErrorLevel.Compiler,
                `Se esperaba un tipo 'string'. Se encontró '${typeof name}'`,
                node.location
            ).format();
            translation = name;

            const symbol = this.SymbolsTable.get(name);
            if (symbol && symbol.metadata.isAsync) isAsyncCall = true;
        }

        const awaitPrefix = isAsyncCall? 'await ' : '';
        return `${awaitPrefix}${translation}(${args})`;
    }

    private generateLiteral(node: LiteralNode<T>): string {
        if (typeof node.value === 'boolean') {
            return node.value ? 'true' : 'false';
        }

        if (typeof node.value === 'string') {
            return `"${node.value}"`;
        }

        return String(node.value);
    }

    private generateArray(node: ListNode<T>): string {
        const elements = node.body.map((element: ASTNode<T>) => this.visit(element)).join(', ');
        return `[${elements}]`;
    }

    private generateFunction(node: FunctionNode<T>): string {
        const params = node.params.join(', ');
        const body = node.body.map((n: ASTNode<T>) => '    ' + this.visit(n) + ";").join('\n');

        const asyncPrefix = node.metadata.isAsync ? 'async ' : '';

        if (node.metadata.isConstructor) {
            return `constructor(${params}) {\n${body}\n  }`;
        }

        if (node.metadata.isMethod) {
            const isStatic = node.metadata.isStatic ? 'static ' : '';
            return `${isStatic}${asyncPrefix}${node.id}(${params}) {\n${body}\n  }`;
        }

        return `${asyncPrefix}function ${node.id}(${params}) {\n${body}\n}`;
    }

    private generateProperty(node: PropertyNode<T>): string {
        const isStatic = node.isStatic ? 'static ' : '';
        const init = node.value ? ` = ${this.visit(node.value)}` : '';
        return `${isStatic}${node.id}${init}`;
    }

    private generateAssignation(node: AssignmentNode<T>): string {
        return `${this.visit(node.left)} = ${this.visit(node.assignment)}`;
    }

    private generateBinaryOperation(node: BinaryExpressionNode<T>): string {
        const operatorsMap: Record<string, string> = {
            'MAS': '+',
            'MENOS': '-',
            'POR': '*',
            'ENTRE': '/',
            'RESTO': '%',
            'EXP': '**',
            'MAYOR': '>',
            'MENOR': '<',
            'MAYOR_IGUAL': '>=',
            'MENOR_IGUAL': '<=',
            'IGUAL': '==',
            'IGUAL_TIPADO': '===',
            'NO_IGUAL': '!=',
            'NO_IGUAL_TIPADO': '!==',
            'DIFERENTE': '!=',
            'Y': '&&',
            'O': '||'
        };

        const op = operatorsMap[node.operator];
        
        return `${this.visit(node.left)} ${op} ${this.visit(node.right)}`;
    }

    private generateVariableDeclaration(node: VariableNode<T>): string {
        return `let ${node.id} = ${this.visit(node.value)}`;
    }

    private generateUnaryOperation(node: UnaryNode<T> | NoUnaryNode<T>): string {
        if (node.operator === 'NO') return `!(${this.visit(node.object)})`;

        if (node.operator === 'TIPO') {
            const mapping = `{ "number": "numero", "string": "texto", "boolean": "booleano", "undefined": "indefinido", "object": "objeto" }`;
            return `${mapping}[typeof (${this.visit(node.object)})]`;
        }

        return '';
    }

    private generateCondition(node: ConditionNode<T>): string {
        const test = this.visit(node.test);
        const consequent = node.consequent
            .map((n: ASTNode<T>) => "    " + this.visit(n) + ";")
            .join('\n');
        
        let result = `if (${test}) {\n${consequent}\n}`;

        if (node.alternate) {
            if (!Array.isArray(node.alternate) && node.alternate.type === 'Condicion') {
                result += ` else ${this.generateCondition(node.alternate)}`;
            } else {
                const alternate = (node.alternate as ASTNode<T>[])
                    .map((n: ASTNode<T>) => "    " + this.visit(n) + ";")
                    .join('\n');
                result += ` else {\n${alternate}\n}`;
            }
        }

        return result;
    }

    private generateFor(node: LoopNode<T>): string {
        const varName = node.var;
        const body = node.body.map((n: ASTNode<T>) => "    " + this.visit(n) + ";").join('\n');
        const iterable = this.visit(node.iterable);

        if (node.iterable.type === 'Llamada' && 'value' in node.iterable.object && node.iterable.object.value === 'rango') {
            const args = node.iterable.params;
            let start = "0", end = this.visit(args[0]);

            if (args.length === 2) {
                start = this.visit(args[0]);
                end = this.visit(args[1]);
            }
            return `for (let ${varName} = ${start}; ${varName} < ${end}; ${varName}++) {\n${body}\n}`;
        }

        return `for (let ${varName} of (Array.isArray(${iterable}) ? ${iterable} : Object.keys(${iterable}))) {\n${body}\n}`;
    }

    private generateObject(node: ODBNode<T>): string {
        if (node.mode === ODBMode.Simple) {
            const props = Object.entries(node.blocks).map(([key, value]) => {
                return `${key}: ${this.visit(value)}`;
            });
            return `{ ${props.join(', ')} }`;
        }

        const declarations = Object.entries(node.blocks).map(([key, value]) => {
            return `let ${key} = ${this.visit(value)};`;
        }).join('\n');

        const executableBody = node.body.map(stmt => this.visit(stmt)).join(';\n');

        const exports = Object.keys(node.blocks).join(', ');

        return `(() => {
                ${declarations}
                ${executableBody}
                return { ${exports} }
            })()`;
    }

    private generateExport(node: ExportNode<T>): string {
        const innerNode = node.object;

        if (innerNode.type === 'Identificador') {
            return `export { ${this.visit(innerNode)} }`;
        }

        return `export ${this.visit(innerNode)}`;
    }
}