import path from "node:path";

import { DisChordNode, DisChordNodeType, DisChordTokenType, StartBotNode } from "../../../types";
import { intentsMap, SeyfertLocations } from "../../constants/mappings";
import { startBotCustomEntries } from "../../constants/schemas";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { IdentificatorNode, ImportNode, TokenType, TokenTypeUnion } from "../../../../chord/model/types";
import { walkAST } from "../../../../chord/walkAST";
import { ImportSpecifier } from "../../../../utils/ImportSpecifier";
import { ImportVisitor } from "../../../../chord/Generator/visitors/modularity/ImportVisitor";

/**
 * Generator class responsible for generating code related to starting the bot and setting up the client in DisChord.
 */
export default class ClientInitVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
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
        const { blocks } = node.object;
        const prefixNode = (blocks['prefijo'] || blocks['prefijos'])!;

        const prefix = this.parent.visit(prefixNode);
        const isArray = prefixNode.type === TokenType.LISTA;
        const prefixes = prefixNode.type === TokenType.LISTA ? prefixNode.body : [ prefixNode ];
        const includeSlash = prefixes.some(p => p.type === TokenType.LITERAL && p.value === '/');

        const seyfertConfig = this.generateSeyfertConfig(node);
        this.parent.context.extraFiles.set(this.parent.context.projectRoot.resolve('seyfert.config.mjs'), seyfertConfig);

        this.requireOutputDirectories();

        return this.clientTemplate(isArray ? prefix : `[${prefix}]`, includeSlash, this.customProperties(node));
    }

    /**
     * The code that creates and starts the client.
     * @param prefixes The generated array of command prefixes.
     * @param includeSlash Whether the slash commands must be uploaded once the client is up.
     * @param customProperties The assignments of the block's custom properties to the client.
     * @returns The generated client code.
     * @private
     */
    private clientTemplate (prefixes: string, includeSlash: boolean, customProperties: string): string {
        return `
            import { Client } from "seyfert";
            const client = new Client({
                commands: {
                    prefix: () => ${prefixes},
                    reply: () => true
                }
            });

            client.setServices({
                cache: {
                    disabledCache: { bans: true, emojis: true, stickers: true, roles: true, presences: true }
                }
            });

            ${customProperties}

            client.start().then(async () => {
                ${includeSlash ? 'await client.uploadCommands().catch(error => console.log(error));' : ''}
            });

            process.on('unhandledRejection', async (err) => {
                console.error(err);
            });
        `;
    }

    /**
     * The custom properties of the block, set on the client before it starts so every command and
     * event finds them. Each value is awaited, so one that is a promise (a call to an async
     * function) is stored resolved; awaiting a value that isn't a promise changes nothing.
     * @param node The StartBotNode with the block.
     * @returns One assignment per custom property, in source order.
     * @private
     */
    private customProperties (node: StartBotNode): string {
        return startBotCustomEntries(node.object)
            .map(([ key, value ]) => `client[${JSON.stringify(key)}] = ${this.awaited(value)};`)
            .join('\n');
    }

    /**
     * A value, awaited unless it is a literal or already awaits on its own.
     * @private
     */
    private awaited (value: DisChordNode): string {
        const code = this.parent.visit(value);

        return (value.type as string) === TokenType.LITERAL || code.trimStart().startsWith('await ') ? code : `await (${code})`;
    }

    /**
     * Generates the Seyfert configuration file content based on the provided StartBotNode.
     * @param node The StartBotNode containing the configuration for the bot, including the token and intents.
     * @returns The generated Seyfert configuration file content.
     */
    private generateSeyfertConfig(node: StartBotNode): string {
        const { blocks } = node.object;
        const tokenNode = blocks['token']!;
        const intentsNode = blocks['intenciones'];

        const token = this.parent.visit(tokenNode);
        const forwardedImports = this.forwardReferencedImports(node);
        let intents = "[]";

        if (intentsNode && intentsNode.type === TokenType.LISTA) {
            const list = intentsNode.body.map(item => {
                const val = (item as { value?: { toString(): string } }).value?.toString().replace(/"/g, '');
                const mapped = intentsMap[val as string];
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
                    commands: "${SeyfertLocations.commands}",
                    events: "${SeyfertLocations.events}",
                    components: "${SeyfertLocations.components}"
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

        if (ImportSpecifier.isLibrary(cleanPath)) {
            const libName = cleanPath.split(':')[1];
            absoluteTarget = projectRoot.resolve('lib', libName, 'src', 'index.js');
        } else {
            absoluteTarget = path.join(this.parent.context.outputDir, cleanPath);
            if (!absoluteTarget.endsWith('.js')) absoluteTarget += '.js';
        }

        return ImportSpecifier.relative(projectRoot.absolutePath, absoluteTarget);
    }

    /**
     * Asks for the directories Seyfert's loader scans to exist in the output, even if the project
     * has nothing to put in them. Only asks: creating them is the compile command's job, once it
     * knows the compile succeeded and isn't just a check.
     */
    private requireOutputDirectories() {
        Object.values(SeyfertLocations).forEach(dir => {
            this.parent.context.extraDirectories.add(path.join(this.parent.context.distDir, dir));
        });
    }
}