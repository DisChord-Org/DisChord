import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Test } from "../../../Test";
import { FileCompiler } from "../../../../src/cli/commands/FileCompiler";
import { FileSystem } from "../../../../src/utils/FileSystem";
import { File } from "../../../../src/utils/File";
import { ErrorMessage } from "../../../../src/errors/ErrorMessage";

/**
 * @class HandlerOutsideFolderTest
 * @description Validates `ValidateHandlerFolderRule`: inside the `src/` of a project, a `comando` has to be under `src/comandos/` and an `evento` under `src/eventos/` (at any depth), the only folders Seyfert loads from. A file that is not under `src/` is a script on its own and is left alone.
 */
export class HandlerOutsideFolderTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Handler Outside Folder - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'comando' or an 'evento' declared outside of the folder the bot loads it from";

    private static readonly Command = 'nuevo comando Uno {\n    descripcion "primer comando"\n}\n';
    private static readonly Event = 'nuevo evento encendido {\n    imprimir("hola")\n}\n';

    /**
     * Not a comparison with a snapshot: it compiles buffers placed at different paths of a project.
     * @override
     */
    protected override async run (): Promise<void> {
        const project = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-folder-'));

        fs.writeFileSync(path.join(project, 'package.json'), JSON.stringify({ name: 'folder', type: 'module' }));
        [ 'src/comandos/admin', 'src/eventos', 'src/otros', 'sueltos' ].forEach(folder => fs.mkdirSync(path.join(project, folder), { recursive: true }));

        const { Command, Event } = HandlerOutsideFolderTest;

        try {
            this.expect(project, 'src/comandos/uno.chord', Command);
            this.expect(project, 'src/comandos/admin/uno.chord', Command);
            this.expect(project, 'src/eventos/encendido.chord', Event);
            // not under src: a script on its own
            this.expect(project, 'uno.chord', Command);
            this.expect(project, 'sueltos/encendido.chord', Event);

            this.expect(project, 'src/uno.chord', Command, "Un comando va en 'src/comandos/': este archivo está en 'src/uno.chord' y el bot no lo cargaría. Muévelo a 'src/comandos/uno.chord'.");
            this.expect(project, 'src/otros/uno.chord', Command, "este archivo está en 'src/otros/uno.chord'");
            this.expect(project, 'src/eventos/uno.chord', Command, "Un comando va en 'src/comandos/'");
            this.expect(project, 'src/encendido.chord', Event, "Un evento va en 'src/eventos/'");
            this.expect(project, 'src/comandos/encendido.chord', Event, "Muévelo a 'src/eventos/encendido.chord'");
        } finally {
            fs.rmSync(project, { recursive: true, force: true });
        }
    }

    /**
     * Compiles `source` as the file at `relativePath` of the project, and expects it to be accepted
     * or, with `error`, rejected with that text.
     */
    private expect (project: string, relativePath: string, source: string, error?: string): void {
        const file = File.withContent(path.join(project, relativePath), source);
        const config = FileSystem.layoutOf(file);
        let thrown: string | undefined;

        try {
            new FileCompiler({ run: false, depth: 1 }).compile(file, config, config.distDir);
        } catch (failure) {
            thrown = ErrorMessage.of(failure);
        }

        if (error === undefined && thrown !== undefined) throw new Error(`'${relativePath}' should compile, got: ${thrown}`);
        if (error !== undefined && thrown === undefined) throw new Error(`'${relativePath}' should be rejected, and it compiled`);
        if (error !== undefined && !thrown!.includes(error)) throw new Error(`'${relativePath}' was rejected without the expected text ('${error}').\nGot: ${thrown}`);
    }
}
