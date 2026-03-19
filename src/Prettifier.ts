import fs from 'fs';
import prettier from 'prettier';

export default class Prettifier {
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
    
    static async savePrettified (path: string, code: string) {
        const prettified = await Prettifier.prettify(code);
        fs.writeFileSync(path, prettified, 'utf-8');
    }
}