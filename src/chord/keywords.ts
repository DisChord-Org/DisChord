export class KeyWords {
    private static statements: string[] = [
        "clase",
        "prop",
        "devolver",
        "var",
        "funcion",
        "si",
        "para",
        "pasar",
        "salir",
        "importar",
        "exportar"
    ];

    public static addStatements (statements: string[]) {
        this.statements.push(...statements);
    }

    public static getStatements (): string[] {
        return this.statements;
    }
}
