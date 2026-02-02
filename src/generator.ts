import { corelib } from "./core.lib";
import { ASTNode } from "./types";

export class Generator {
    public generate(nodes: ASTNode[]): string {
        return nodes.map(node => this.visit(node)).join('\n');
    }

    private visit(node: ASTNode): string {
        switch (node.type) {
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
            default:
                throw new Error(`Generador: Tipo de nodo desconocido: ${node.type}`);
        }
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
            const libClass = corelib.classes[name];

            if (libClass && libClass.mainMethod) {
                const mainMethod = libClass.mainMethod;
                translation = libClass.methods[mainMethod];
            } else {
                translation = name;
            }
        }

        return `${translation}(${args});`;
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
}