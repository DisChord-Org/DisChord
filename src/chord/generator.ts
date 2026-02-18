import { corelib } from "./core.lib";
import { AccessNode, AssignmentNode, ASTNode, BinaryExpressionNode, CallNode, ClassNode, ConditionNode, ExportNode, FunctionNode, ListNode, LiteralNode, LoopNode, NoUnaryNode, ObjectNode, ObjectPropertyType, PropertyNode, Symbol, UnaryNode, VariableNode } from "./types";

export class Generator {
    private SymbolsTable: Map<string, Symbol>;

    constructor (private symbols: Map<string, Symbol>) {
        this.SymbolsTable = symbols;
    }

    public generate(nodes: ASTNode[]): string {
        return nodes.map(node => {
            const code = this.visit(node);
            const noSemicolon = ['CONDICION', 'BUCLE', 'CLASE', 'FUNCION'];

            return noSemicolon.includes(node.type) ? code : code + ";";
        }).join('\n');
    }

    public visit(node: ASTNode): string {
        switch (node.type) {
            case 'Clase':
                return this.generateClass(node);
            case 'Llamada':
                return this.generateCall(node);
            case 'Literal':
                return this.generateLiteral(node);
            case 'Identificador':
                return node.value;
            case 'Lista':
                return this.generateArray(node);
            case 'Acceso':
                return this.generateAccess(node);
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
            case 'Objeto':
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
                const ids = node.identificators.join(', ');
                let path = node.path;
                
                if (!path.endsWith('.mjs') && (path.startsWith('./') || path.startsWith('../'))) {
                    path += '.mjs';
                }

                return `import { ${ids} } from "${path}"`;
            case 'JS':
                return `${node.value}`;
            default:
                throw new Error(`Generador: Tipo de nodo desconocido: ${(node as { type: string }).type}`);
        }
    }

    private generateClass(node: ClassNode): string {
        const inheritance = node.superClass ? ` extends ${node.superClass}` : '';
        const body = node.body
            .map((n: ASTNode) => "  " + this.visit(n) + ";")
            .join('\n\n');
        
        return `class ${node.id}${inheritance} {\n  ${body}\n}`;
    }

    generateAccess(node: AccessNode): string { 
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

    generateCall(node: CallNode): string {
        const args = node.params.map((arg: ASTNode) => this.visit(arg)).join(', ');
        let translation: string;
        let isAsyncCall = false;

        if (node.object.type === 'Acceso') {
            translation = this.generateAccess(node.object);

            const symbol = this.SymbolsTable.get(node.object.property);
            if (symbol && symbol.metadata.isAsync) isAsyncCall = true;
        } else {
            if (!('value' in node.object)) throw new Error(`Se esperaba una llamada con valor en su objeto.`);
            const name = node.object.value;
            translation = name;

            const symbol = this.SymbolsTable.get(name);
            if (symbol && symbol.metadata.isAsync) isAsyncCall = true;
        }

        const awaitPrefix = isAsyncCall? 'await ' : '';
        return `${awaitPrefix}${translation}(${args})`;
    }

    private generateLiteral(node: LiteralNode): string {
        if (typeof node.value === 'boolean') {
            return node.value ? 'true' : 'false';
        }

        if (typeof node.value === 'string') {
            return `"${node.value}"`;
        }

        return String(node.value);
    }

    private generateArray(node: ListNode): string {
        const elements = node.body.map((element: ASTNode) => this.visit(element)).join(', ');
        return `[${elements}]`;
    }

    private generateFunction(node: FunctionNode): string {
        const params = node.params.join(', ');
        const body = node.body.map((n: ASTNode) => '    ' + this.visit(n) + ";").join('\n');

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

    private generateProperty(node: PropertyNode): string {
        const isStatic = node.isStatic ? 'static ' : '';
        const init = node.value ? ` = ${this.visit(node.value)}` : '';
        return `${isStatic}${node.id}${init}`;
    }

    private generateAssignation(node: AssignmentNode): string {
        return `${this.visit(node.left)} = ${this.visit(node.assignment)}`;
    }

    private generateBinaryOperation(node: BinaryExpressionNode): string {
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
            'Y': '&&',
            'O': '||'
        };

        const op = operatorsMap[node.operator];
        
        return `${this.visit(node.left)} ${op} ${this.visit(node.right)}`;
    }

    private generateVariableDeclaration(node: VariableNode): string {
        return `let ${node.id} = ${this.visit(node.value)}`;
    }

    private generateUnaryOperation(node: UnaryNode | NoUnaryNode): string {
        if (node.operator === 'NO') return `!(${this.visit(node.object)})`;

        if (node.operator === 'TIPO') {
            const mapping = `{ "number": "numero", "string": "texto", "boolean": "booleano", "undefined": "indefinido", "object": "objeto" }`;
            return `${mapping}[typeof (${this.visit(node.object)})]`;
        }

        return '';
    }

    private generateCondition(node: ConditionNode): string {
        const test = this.visit(node.test);
        const consequent = node.consequent
            .map((n: ASTNode) => "    " + this.visit(n) + ";")
            .join('\n');
        
        let result = `if (${test}) {\n${consequent}\n}`;

        if (node.alternate) {
            if (!Array.isArray(node.alternate) && node.alternate.type === 'Condicion') {
                result += ` else ${this.generateCondition(node.alternate)}`;
            } else {
                const alternate = (node.alternate as ASTNode[])
                    .map((n: ASTNode) => "    " + this.visit(n) + ";")
                    .join('\n');
                result += ` else {\n${alternate}\n}`;
            }
        }

        return result;
    }

    private generateFor(node: LoopNode): string {
        const varName = node.var;
        const body = node.body.map((n: ASTNode) => "    " + this.visit(n) + ";").join('\n');
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

    private generateObject(node: ObjectNode): string {
        const props = node.properties
            .map((p: ObjectPropertyType) => `${p.key}: ${this.visit(p.value)}`)
            .join(', ');
        return `{ ${props} }`;
    }

    private generateExport(node: ExportNode): string {
        const innerNode = node.object;

        if (innerNode.type === 'Variable' || innerNode.type === 'Funcion' || innerNode.type === 'Clase') {
            return `export ${this.visit(innerNode)}`;
        }

        if (innerNode.type === 'Identificador') {
            return `export { ${this.visit(innerNode)} }`;
        }

        return `export ${this.visit(innerNode)}`;
    }
}