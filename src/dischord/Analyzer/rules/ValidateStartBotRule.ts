import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, StartBotNode } from "../../types";
import { StartBotSchema, startBotCustomEntries, startBotDeclaredKeys } from "../../Generator/constants/schemas";
import { EditDistance } from "../../../utils/EditDistance";
import { reservedClientMembers } from "../../Generator/constants/clientMembers";

/**
 * Validates `encender bot { ... }` against {@link StartBotSchema}, and that its custom properties
 * (the keys the schema doesn't declare, which become properties of `cliente`) don't take the name
 * of something `cliente` already has, nor look like a misspelled key of the schema (`intencion`
 * for `intenciones`), which would otherwise be accepted silently as a property.
 */
export class ValidateStartBotRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /** The most edits between a custom key and a declared one for it to be taken for a typo. */
    private static readonly TYPO_DISTANCE = 2;

    private readonly validator = this.createBDOValidator();

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        this.walk(nodes, current => {
            if (current.type !== DisChordTokenType.ENCENDER_BOT) return;

            const { object } = current as StartBotNode;

            this.validator.validate(object, StartBotSchema);
            this.validateCustomProperties(object);
        });
    }

    /**
     * Setting a property `cliente` already has would overwrite what Seyfert or the language reads
     * from the client, and a key that is one edit or two from a declared one is most likely a typo.
     * @private
     */
    private validateCustomProperties (object: StartBotNode['object']): void {
        startBotCustomEntries(object).forEach(([ key, value ]) => {
            if (reservedClientMembers.has(key)) this.fail(`'${key}' ya existe en 'cliente' y 'encender bot' no puede sobrescribirlo. Usa otro nombre para esa propiedad.`, value.location);

            const intended = startBotDeclaredKeys().find(declared => EditDistance.between(key, declared) <= ValidateStartBotRule.TYPO_DISTANCE);

            if (intended) this.fail(`'encender bot' no admite '${key}'. ¿Querías decir '${intended}'?`, value.location);
        });
    }
}
