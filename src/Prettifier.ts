import fs from 'fs';
import prettier from 'prettier';

/**
 * Utility class to format and save generated source code.
 */
export default class Prettifier {

    /**
     * Formats a raw string of code using predefined Prettier rules.
     * @param code - The raw source code to format.
     * @returns The formatted code, or the original string if formatting fails.
     */
    static async prettify (code: string): Promise<string> {
        try {
            code = await prettier.format(code, {
                parser: 'babel',
                semi: true,
                singleQuote: true,
                tabWidth: 4,
                trailingComma: "all",
                printWidth: 120
            });
        } catch (error) {
            console.log("Aviso: No se pudo formatear el código, se guardará en bruto.");
        }
    
        return code;
    }
    
    /**
     * Formats the code and writes it to the specified file path.
     * @param path - The destination file path.
     * @param code - The source code to process and save.
     */
    static async savePrettified (path: string, code: string) {
        const prettified = await Prettifier.prettify(code);
        fs.writeFileSync(path, prettified, 'utf-8');
    }
}