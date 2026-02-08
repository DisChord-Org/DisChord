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

        "@asincrono",
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
        "desde",
        "js",
        
        "tipo",
        "verdadero",
        "falso",
        "indefinido",

        "mas",
        "menos",
        "por",
        "entre",
        "resto",
        "exp",
        "intro",
        "espacio",

        "mayor",
        "menor",
        "mayor_igual",
        "menor_igual",
        "no",
        "igual_tipado",
        "igual",
        "y",
        "o"
    ];

    public static addStatement (statement: string) {
        this.statements.push(statement);
    }

    public static getStatements (): string[] {
        return this.statements;
    }
}