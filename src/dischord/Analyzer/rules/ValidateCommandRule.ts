import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/Analyzer/walkAST";
import { BDOValidator } from "../../../chord/Analyzer/BDOValidator";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";
import { TokenType } from "../../../chord/types";
import { CommandNode, DisChordASTNode, DisChordODBNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import { CommandSchema } from "../../Generator/constants/schemas";
import { discordNameProblem, slugifyCommandName } from "../../Generator/constants/commandNames";

/**
 * Validates a `comando`'s own properties against {@link CommandSchema} — the same schema
 * `CommandVisitor`/`CommandOptionVisitor` read to generate its flags and options. Moved out of
 * those visitors, which used to discover the same problems mid-generation — see
 * `ValidateCallTargetsRule` for the full rationale behind the split.
 */
export class ValidateCommandRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        const validator = new BDOValidator<DisChordNodeType, DisChordNode>((message, location) => this.fail(message, location));

        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type !== DisChordTokenType.CREAR_COMANDO) return;

            const command = current as CommandNode;

            this.validateName(`El nombre del comando '${command.value}'`, slugifyCommandName(command.value), command.location);
            this.validateOptionNames(command);
            validator.validate(command.body, CommandSchema);
        }));
    }

    /**
     * Rejects an option whose name Discord would refuse. Option names are never changed (they are
     * also the key the handler reads the option by), so an invalid one is an error, not a rewrite.
     * @private
     */
    private validateOptionNames (command: CommandNode): void {
        const options = command.body.blocks['opciones'];
        if (options?.type !== TokenType.BDO) return;

        Object.entries((options as DisChordODBNode).blocks).forEach(([ optionName, entry ]) => {
            this.validateName(`El nombre de la opción '${optionName}' del comando '${command.value}'`, optionName, entry.location);
        });
    }

    /**
     * @param {string} subject - What is being named, as the start of the error message.
     * @param {string} name - The name as Discord will see it.
     * @throws {DisChordError} If Discord would reject `name`.
     * @private
     */
    private validateName (subject: string, name: string, location: DisChordASTNode['location']): void {
        const problem = discordNameProblem(name);
        if (problem !== undefined) this.fail(`${subject} ${problem}.`, location);
    }

    /**
     * @throws {DisChordError} Always.
     * @private
     */
    private fail (message: string, location: DisChordASTNode['location']): never {
        throw new DisChordError({ phase: ErrorLevel.Analysis, message, location }).format();
    }
}
