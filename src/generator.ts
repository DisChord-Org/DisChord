import { corelib } from "./core.lib";
import { ASTNode, ClassNode, PropertyNode } from "./types";

export class Generator {
    public generate(nodes: ASTNode[]): string {
        return nodes.map(node => this.visit(node) + ";").join('\n');
    }

    private visit(node: ASTNode): string {
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

    private generateAccess(node: any): string {
        const objName = node.object.value;
        const propName = node.property;

        if (corelib.classes[objName] && corelib.classes[objName].methods[propName]) {
            return corelib.classes[objName].methods[propName];
        }

        return `${this.visit(node.object)}.${propName}`;
    }

    private generateCall(node: any): string {
        let translation: string;
        const args = node.children.map((arg: any) => this.visit(arg)).join(', ');

        if (node.value.type === 'ACCESO') {
            translation = this.generateAccess(node.value);
        } else {
            const name = node.value.value;
            translation = name;
        }

        return `${translation}(${args})`;
    }

    private generateLiteral(node: any): string {
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
        const isStatic = node.isStatic ? 'static ' : '';
        const name = node.isConstructor ? 'constructor' : node.id;
        const params = node.params.join(', ');
        const body = node.body.map((n: any) => '  ' + this.visit(n) + ";").join('\n');

        return `${isStatic}${name}(${params}) {\n    ${body}\n  }`;
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
            'EXP': '**'
        };

        const op = operatorsMap[node.operator];
        
        return `${this.visit(node.left)} ${op} ${this.visit(node.right)}`;
    }

    private generateVariableDeclaration(node: any): string {
        return `let ${node.id} = ${this.visit(node.prop_value)}`;
    }
}