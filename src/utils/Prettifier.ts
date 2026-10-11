import fs from 'fs';
import { File } from './File';
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
            console.warn("Aviso: No se pudo formatear el código, se guardará en bruto.");
        }
    
        return code;
    }
    
    /**
     * Formats the code and writes it to the specified file path.
     * @param target - The destination file path; its directory must already exist.
     * @param code - The source code to process and save.
     * @returns The file that was written.
     */
    static async savePrettified (target: string, code: string): Promise<File> {
        const prettified = await Prettifier.prettify(code);
        fs.writeFileSync(target, prettified, 'utf-8');

        return File.of(target);
    }
}