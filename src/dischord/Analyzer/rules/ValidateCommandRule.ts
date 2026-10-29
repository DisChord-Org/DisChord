import { CommandScopeNames } from "../../CommandScopeNames";
import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { ExpressionNode, TokenType } from "../../../chord/model/types";
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
        const validator = this.createBDOValidator();

        this.walk(nodes, current => {
            if (current.type !== DisChordTokenType.CREAR_COMANDO) return;

            const command = current as CommandNode;

            this.validateName(`El nombre del comando '${command.value}'`, slugifyCommandName(command.value), command.location);
            this.validateOptionNames(command);
            validator.validate(command.body, CommandSchema);
            this.validateNoInterpolation(command);
        });
    }

    /**
     * The properties of a command (its description, its flags, the options and their descriptions)
     * are written into the class Seyfert reads when the command is registered, outside the handler:
     * a name interpolated into them (`"dice {nombre}"`) is not there yet, or not yet initialized. So
     * the text of these properties is plain text; the text sent from the handler can interpolate.
     * @private
     */
    private validateNoInterpolation (command: CommandNode): void {
        Object.entries(command.body.blocks).forEach(([ property, value ]) => this.walk([ value ], current => {
            if (current.type === TokenType.EXPRESION && (current as ExpressionNode<DisChordNodeType, DisChordNode>).interpolated) this.fail(
                `La propiedad '${property}' del comando '${command.value}' no admite texto con llaves: se lee al registrar el comando, antes de que existan sus variables. Escribe {{ y }} para llaves literales`,
                current.location
            );
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

        const collisions = CommandScopeNames.collisions(command.body);

        Object.entries((options as DisChordODBNode).blocks).forEach(([ optionName, entry ]) => {
            this.validateName(`El nombre de la opción '${optionName}' del comando '${command.value}'`, optionName, entry.location);

            if (collisions.includes(optionName)) this.fail(`La opción '${optionName}' choca con un nombre que DisChord usa internamente.`, entry.location);
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
}
