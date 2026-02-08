import { corelib } from "./core.lib";
import { ASTNode, ClassNode, PropertyNode, Symbol } from "./types";

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
            case 'CLASE':
                return this.generateClass(node as ClassNode);
            case 'LLAMADA':
                return this.generateCall(node);
            case 'LITERAL':
                return this.generateLiteral(node);
            case 'IDENTIFICADOR':
                return node.value as string;
            case 'LISTA':
                return this.generateArray(node);
            case 'ACCESO':
                return this.generateAccess(node);
            case 'FUNCION':
                return this.generateFunction(node);
            case 'PROPIEDAD':
                return this.generateProperty(node as PropertyNode);
            case 'ESTA':
                return 'this';
            case 'ASIGNACION':
                return this.generateAssignation(node);
            case 'SUPER':
                return 'super';
            case 'OPERACION_BINARIA':
                return this.generateBinaryOperation(node);
            case 'VAR':
                return this.generateVariableDeclaration(node);
            case 'NUEVO':
                return `new ${this.visit(node.object!)}`;
            case 'NO_UNARIA':
                return this.generateUnaryOperation(node);
            case 'AGRUPACION':
                return `(${this.visit(node.value as any)})`;
            case 'CONDICION':
                return this.generateCondition(node);
            case 'UNARIO':
                return this.generateUnaryOperation(node);
            case 'BUCLE':
                return this.generateFor(node);
            case 'OBJETO':
                return this.generateObject(node);
            case 'SALIR':
                return 'break';
            case 'PASAR':
                return 'continue';
            case 'DEVOLVER':
                return node.object ? `return ${this.visit(node.object)}` : 'return';
            case 'EXPORTAR':
                return this.generateExport(node);
            case 'IMPORTAR':
                const ids = (node as unknown as any).object.join(', ');
                let path = node.value as string;
                
                if (!path.endsWith('.mjs') && (path.startsWith('./') || path.startsWith('../'))) {
                    path += '.mjs';
                }

                return `import { ${ids} } from "${path}"`;
            case 'JS_NATIVO':
                return `${node.value}`;
            default:
                throw new Error(`Generador: Tipo de nodo desconocido: ${node.type}`);
        }
    }

    private generateClass(node: ClassNode): string {
        const inheritance = node.superClass ? ` extends ${node.superClass}` : '';
        const body = node.body
            .map((n: any) => "  " + this.visit(n) + ";")
            .join('\n\n');
        
        return `class ${node.id}${inheritance} {\n  ${body}\n}`;
    }

    generateAccess(node: any): string { 
        const objName = node.object.type === 'IDENTIFICADOR' ? node.object.value : null;
        const propName = node.property;

        if (corelib.classes[objName] && corelib.classes[objName].methods[propName]) {
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

    generateCall(node: any): string {
        const args = node.children.map((arg: any) => this.visit(arg)).join(', ');
        let translation: string;
        let isAsyncCall = false;

        if (node.value.type === 'ACCESO') {
            translation = this.generateAccess(node.value);

            const symbol = this.SymbolsTable.get(node.value.property);
            if (symbol && symbol.isAsync) isAsyncCall = true;
        } else {
            const name = node.value.value;
            translation = name;

            const symbol = this.SymbolsTable.get(name);
            if (symbol && symbol.isAsync) isAsyncCall = true;
        }

        const awaitPrefix = isAsyncCall? 'await ' : '';
        return `${awaitPrefix}${translation}(${args})`;
    }

    private generateLiteral(node: any): string {
        if (typeof node.value === 'boolean') {
            return node.value ? 'true' : 'false';
        }

        if (typeof node.value === 'string') {
            return `"${node.value}"`;
        }

        return String(node.value);
    }

    private generateArray(node: any): string {
        const elements = node.children.map((el: any) => this.visit(el)).join(', ');
        return `[${elements}]`;
    }

    private generateFunction(node: any): string {
        const params = node.params.join(', ');
        const body = node.body.map((n: any) => '    ' + this.visit(n) + ";").join('\n');

        const asyncPrefix = node.isAsync ? 'async ' : '';

        if (node.isConstructor) {
            return `constructor(${params}) {\n${body}\n  }`;
        }

        if (node.isMethod) {
            const isStatic = node.isStatic ? 'static ' : '';
            return `${isStatic}${asyncPrefix}${node.id}(${params}) {\n${body}\n  }`;
        }

        return `${asyncPrefix}function ${node.id}(${params}) {\n${body}\n}`;
    }

    private generateProperty(node: any): string {
        const isStatic = node.isStatic ? 'static ' : '';
        const init = node.prop_value ? ` = ${this.visit(node.prop_value)}` : '';
        return `${isStatic}${node.id}${init}`;
    }

    private generateAssignation(node: any): string {
        return `${this.visit(node.object)} = ${this.visit(node.value)}`;
    }

    private generateBinaryOperation(node: any): string {
        const operatorsMap: any = {
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

    private generateVariableDeclaration(node: any): string {
        return `let ${node.id} = ${this.visit(node.prop_value)}`;
    }

    private generateUnaryOperation(node: ASTNode): string {
        if (node.operator === 'NO') return `!(${this.visit(node.object!)})`;

        if (node.operator === 'TIPO') {
            const mapping = `{ "number": "numero", "string": "texto", "boolean": "booleano", "undefined": "indefinido", "object": "objeto" }`;
            return `${mapping}[typeof (${this.visit(node.object!)})]`;
        }

        return '';
    }

    private generateCondition(node: any): string {
        const test = this.visit(node.test);
        const consequent = node.consequent
            .map((n: any) => "    " + this.visit(n) + ";")
            .join('\n');
        
        let result = `if (${test}) {\n${consequent}\n}`;

        if (node.alternate) {
            if (!Array.isArray(node.alternate) && node.alternate.type === 'CONDICION') {
                result += ` else ${this.generateCondition(node.alternate)}`;
            } else {
                const alternate = (node.alternate as any[])
                    .map((n: any) => "    " + this.visit(n) + ";")
                    .join('\n');
                result += ` else {\n${alternate}\n}`;
            }
        }

        return result;
    }

    private generateFor(node: any): string {
        const varName = node.var;
        const body = node.children.map((n: any) => "    " + this.visit(n) + ";").join('\n');
        const iterable = this.visit(node.iterable);

        if (node.iterable.type === 'LLAMADA' && node.iterable.value.value === 'rango') {
            const args = node.iterable.children;
            let start = "0", end = this.visit(args[0]);

            if (args.length === 2) {
                start = this.visit(args[0]);
                end = this.visit(args[1]);
            }
            return `for (let ${varName} = ${start}; ${varName} < ${end}; ${varName}++) {\n${body}\n}`;
        }

        return `for (let ${varName} of (Array.isArray(${iterable}) ? ${iterable} : Object.keys(${iterable}))) {\n${body}\n}`;
    }

    private generateObject(node: any): string {
        const props = node.children
            .map((p: any) => `${p.key}: ${this.visit(p.value)}`)
            .join(', ');
        return `{ ${props} }`;
    }

    private generateExport(node: any): string {
        const innerNode = node.object;

        if (innerNode.type === 'VAR' || innerNode.type === 'FUNCION' || innerNode.type === 'CLASE') {
            return `export ${this.visit(innerNode)}`;
        }

        if (innerNode.type === 'IDENTIFICADOR') {
            return `export { ${this.visit(innerNode)} }`;
        }

        return `export ${this.visit(innerNode)}`;
    }
}