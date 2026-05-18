export class KeyWords {
    private static statements: string[] = [
        "clase",
        "extiende",
        "prop",
        "fijar",
        "esta",
        "super",
        "nuevo",
        "devolver",
        "var",
        "es",
        "funcion",
        "si",
        "sino",
        "ademas",
        "para",
        "en",
        "pasar",
        "salir",
        "importar",
        "exportar",
        "tipo"
    ];

    public static addStatements (statements: string[]) {
        this.statements.push(...statements);
    }

    public static getStatements (): string[] {
        return this.statements;
    }
}
