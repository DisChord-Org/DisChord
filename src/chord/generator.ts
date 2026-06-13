import { ASTNode, ClassNode, ConditionNode, FunctionNode, ListNode, PropertyNode } from "./types";

    public visit(node: ASTNode<T>): string {
        switch (node.type) {
            case 'Lista':
                return this.generateArray(node);
            case 'AccesoPorIndice':
                return this.generateIndexAccess(node);
            case 'Esta':
                return 'this';
            case 'Super':
                return 'super';
            case 'Variable':
                return this.generateVariableDeclaration(node);
            case 'Nuevo':
                return `new ${this.visit(node.object)}`;
            case 'Expresion':
                return `(${this.visit(node.object)})`;
            case 'Salir':
                return 'break';
            case 'Pasar':
                return 'continue';
            case 'Devolver':
                return node.object ? `return ${this.visit(node.object)}` : 'return';
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

    private generateArray(node: ListNode<T>): string {
        const elements = node.body.map((element: ASTNode<T>) => this.visit(element)).join(', ');
        return `[${elements}]`;
    }
}