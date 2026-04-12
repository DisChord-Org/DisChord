import { pathToFileURL } from 'url';

export class Runner {
    static async execute(filePath: string, projectRoot: string) {
        process.chdir(projectRoot);
        const url = `${pathToFileURL(filePath).href}?u=${Date.now()}`;
        return await import(url);
    }
}