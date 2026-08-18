import path, { join } from "node:path";
import fs from "fs";

import { DisChordNode, DisChordNodeType, DisChordTokenType, StartBotNode } from "../../../types";
import { intentsMap } from "../../constants/mappings";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { DisChordError, ErrorLevel } from "../../../../errors/ChordError";
import { IdentificatorNode, ImportNode, TokenType, TokenTypeUnion } from "../../../../chord/types";
import { walkAST } from "../../../../chord/Analyzer/walkAST";
import { ImportVisitor } from "../../../../chord/Generator/visitors/modularity/ImportVisitor";

/**
 * Generator class responsible for generating code related to starting the bot and setting up the client in DisChrod.
 */
export default class ClietInitVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = DisChordTokenType.ENCENDER_BOT;
    
    /**
     * Generates code for a StartBotNode, which represents the initialization of the bot in DisChord.
     * It extracts the necessary configuration from the node, generates a Seyfert configuration file, and returns the code to start the client.
     * @param node The StartBotNode representing the bot initialization to generate code for.
     * @returns The generated code for starting the bot.
     */
    visit (node: StartBotNode): string {
        if (node.object.type != 'BDO') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se encontró '${node.object.type}', se esperaba 'Objeto'`,
            location: node.location
        }).format();

        const { blocks } = node.object;
        const prefixNode = blocks['prefijo'] || blocks['prefijos'];

        if (!prefixNode) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `No se ha especificado el prefijo en el bloque 'encender bot'`,
            location: node.location
        }).format();

        const prefix = this.parent.visit(prefixNode);
        const isArray = prefixNode.type === 'Lista';

        let includeSlash = false;
        if (isArray) {
            includeSlash = prefixNode.body.some(
                (p) => p.type === 'Literal' && p.value === '/'
            );
        } else if (prefixNode.type === 'Literal') {
            includeSlash = prefixNode.value === '/';
        }

        const seyfertConfig = this.generateSeyfertConfig(node);
        this.parent.context.extraFiles.set(join(this.parent.context.projectRoot, 'seyfert.config.mjs'), seyfertConfig);

        this.ensureDirectories();

        return `
            import { Client } from "seyfert";
            const client = new Client({
                commands: {
                    prefix: () => ${isArray ? prefix : `[${prefix}]`},
                    reply: () => true
                }
            });

            client.setServices({
                cache: {
                    disabledCache: { bans: true, emojis: true, stickers: true, roles: true, presences: true }
                }
            });

            client.start().then(async () => {
                ${includeSlash ? 'await client.uploadCommands().catch(error => console.log(error));' : ''}
            });

            process.on('unhandledRejection', async (err) => {
                console.error(err);
            });
        `;
    }

    /**
     * Generates the Seyfert configuration file content based on the provided StartBotNode.
     * @param node The StartBotNode containing the configuration for the bot, including the token and intents.
     * @returns The generated Seyfert configuration file content.
     */
    private generateSeyfertConfig(node: StartBotNode): string {
        if (node.object.type != 'BDO') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se encontró '${node.object.type}', se esperaba 'BDO'`,
            location: node.location
        }).format();

        const { blocks } = node.object;
        const tokenNode = blocks['token'];
        const intentsNode = blocks['intenciones'];

        if (!tokenNode) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Falta el bloque 'token' en la configuración del bot.`,
            location: node.location
        }).format();
        
        const token = this.parent.visit(tokenNode);
        const forwardedImports = this.forwardReferencedImports(node);
        let intents = "[]";
        
        if (intentsNode && intentsNode.type === 'Lista') {
            const list = intentsNode.body.map((item: any) => {
                const val = item.value?.toString().replace(/"/g, '');
                const mapped = intentsMap[val];
                if (!mapped) throw new DisChordError({
                    phase: ErrorLevel.Compiler,
                    message: `Intención desconocida: ${val}`,
                    location: node.location
                }).format();
                return `"${mapped}"`;
            });
            intents = `[ ${list.join(',')} ]`;
        }

        return `
            import { GatewayIntentBits } from "seyfert/lib/types/index.js";
            import { config } from "seyfert";
            ${forwardedImports}

            export default config.bot({
                token: ${token},
                intents: ${intents},
                locations: {
                    base: "dist",
                    commands: "comandos",
                    events: "eventos",
                    components: "componentes"
                }
            });
        `;
    }

    /**
     * `seyfert.config.mjs` is written directly to disk here, outside the normal per-file
     * generation pipeline (see `visit()`) — so unlike the main compiled file, it never picks up
     * the source file's own `importar` statements just by being part of the same AST render.
     * This re-emits whichever of those imports the `encender bot` block actually references (any
     * of them — not just one identifier in particular), so a project can `token ent.BOT_TOKEN`,
     * `token miLibreria.leerToken()`, or anything else built on a real `importar`, the same way it
     * already works in every other compiled file.
     * @private
     */
    private forwardReferencedImports (node: StartBotNode): string {
        const importNodes = this.parent.nodes.filter(
            (n): n is ImportNode<DisChordNodeType> => n.type === TokenType.Importar
        );

        if (importNodes.length === 0) return '';

        const referencedNames = new Set<string>();
        walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type === TokenType.IDENTIFICADOR) {
                referencedNames.add((current as unknown as IdentificatorNode<DisChordNodeType>).value);
            }
        });

        const importVisitor = this.parent.get(ImportVisitor);

        return importNodes
            .filter(importNode => importNode.identificators.some(id => referencedNames.has(id)))
            .map(importNode => importVisitor.renderImportStatement(importNode, this.resolveSpecifierFromProjectRoot(importNode.path)))
            .join('\n');
    }

    /**
     * Resolves an import's target module the same way `ImportVisitor` does (the `lib:` installed-
     * library convention, or a plain relative path) but re-relativizes the result from
     * `projectRoot` instead of the originating file's own `dist/` output directory, since that's
     * where `seyfert.config.mjs` actually lives.
     * @private
     */
    private resolveSpecifierFromProjectRoot (rawPath: string): string {
        const cleanPath = rawPath.replace(/\.chord$/, '');
        const projectRoot = this.parent.context.projectRoot;

        let absoluteTarget: string;

        if (cleanPath.startsWith('lib:')) {
            const libName = cleanPath.split(':')[1];
            absoluteTarget = path.join(projectRoot, 'lib', libName, 'src', `${libName}.js`);
        } else {
            const originalDir = this.parent.context.outputDir ?? path.join(projectRoot, 'dist');
            absoluteTarget = path.join(originalDir, cleanPath);
            if (!absoluteTarget.endsWith('.js')) absoluteTarget += '.js';
        }

        let specifier = path.relative(projectRoot, absoluteTarget).split(path.sep).join('/');
        if (!specifier.startsWith('.')) specifier = `./${specifier}`;

        return specifier;
    }

    /**
     * Helper to ensure the output directories exist.
     */
    private ensureDirectories() {
        const dirs = ['comandos', 'eventos', 'componentes'];
        dirs.forEach(dir => {
            const targetPath = join(this.parent.context.projectRoot, 'dist', dir);
            if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });
        });
    }
}