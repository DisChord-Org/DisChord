import { ClassDataType, DataType, PrimitiveDataType, UnionDataType } from "../chord/model/DataType";
import { ASTNode, LiteralNode, PrimitiveTypeName, TokenType } from "../chord/model/types";
import { literalStringValue } from "../chord/BDOSchema";
import { eventsMap, InjectedTypes, OptionValueTypes } from "./Generator/constants/mappings";
import { CommandScopeNames } from "./CommandScopeNames";
import { CommandNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType, EventNode } from "./types";

/**
 * A name dischord puts in scope inside a command or an event.
 * @property {string} name - The name, as the code reads it.
 * @property {DataType} [dataType] - Its type, if known.
 * @property {boolean} [hidden] - Whether it is for the generated code only: it cannot be declared again, but the user's code cannot read it.
 */
export interface InjectedName {
    name: string;
    dataType?: DataType;
    hidden?: boolean;
}

/**
 * The names dischord puts in scope inside a command or an event, in the one place that works them out:
 * for a command, the ones `CommandScopeNames` knows (the handler's parameter, the injected names and
 * the options); for an event, the parameters of its family in `eventsMap`. The analyzer rules that need
 * them (the one that declares them as symbols, the one that rejects declaring them again) read it, so they cannot
 * drift from the tables the generator reads.
 * @class InjectedNames
 */
export class InjectedNames {
    /**
     * The names already worked out, by node: two rules ask for the same owner in one analysis, and the
     * tree is built anew for each, so nothing outlives it.
     */
    private static readonly cache: WeakMap<DisChordASTNode, readonly InjectedName[]> = new WeakMap();

    /**
     * @param {DisChordASTNode} owner - A node that owns a scope.
     * @returns {readonly InjectedName[]} The names it puts in scope; none if it is not a command or an event.
     */
    public static of (owner: DisChordASTNode): readonly InjectedName[] {
        let names = InjectedNames.cache.get(owner);

        if (!names) {
            names = InjectedNames.compute(owner);
            InjectedNames.cache.set(owner, names);
        }

        return names;
    }

    /**
     * @param {DisChordASTNode} owner - A node that owns a scope.
     * @returns {string[]} Just the names `of` gives.
     */
    public static namesOf (owner: DisChordASTNode): string[] {
        return InjectedNames.of(owner).map(({ name }) => name);
    }

    /**
     * @returns {DataType | undefined} The type of an injected name, if it is known.
     * @private
     */
    private static typeOf (name: string): DataType | undefined {
        return InjectedTypes[name] ? ClassDataType.of(InjectedTypes[name]) : undefined;
    }

    /**
     * The type of an option's value: the one its `tipo` names, and with `indefinido` too if it is declared `requerido falso`
     * (a literal `falso`; an option required by anything else gets the type alone).
     * @param {DisChordODBNode} options - The `opciones` block of the command.
     * @param {string} name - The option.
     * @returns {DataType | undefined} The type, or `undefined` if the `tipo` is not one with a type.
     * @private
     */
    private static optionType (options: DisChordODBNode, name: string): DataType | undefined {
        const option = options.blocks[name] as DisChordODBNode;
        const keyword = literalStringValue<DisChordNodeType, DisChordNode>(option.blocks['tipo'] as ASTNode<DisChordNodeType, DisChordNode>)?.toLowerCase();
        const typeName = keyword ? OptionValueTypes[keyword] : undefined;
        if (!typeName) return undefined;

        const type = typeName === 'Usuario' ? ClassDataType.of(typeName) : PrimitiveDataType.of(typeName as PrimitiveTypeName);
        const required = option.blocks['requerido'];

        return required?.type === TokenType.LITERAL && (required as LiteralNode<DisChordNodeType>).value === false
            ? UnionDataType.ofTypes([ type, PrimitiveDataType.Indefinido ])
            : type;
    }

    private static compute (owner: DisChordASTNode): readonly InjectedName[] {
        if (owner.type === DisChordTokenType.CREAR_COMANDO) {
            const body = (owner as CommandNode).body;
            const options = CommandScopeNames.optionNames(body);

            return CommandScopeNames.visible(body).map(name => ({
                name,
                hidden: CommandScopeNames.isHidden(name) && !options.includes(name),
                dataType: options.includes(name) ? InjectedNames.optionType(body.blocks['opciones'] as DisChordODBNode, name) : InjectedNames.typeOf(name)
            }));
        }

        if (owner.type === DisChordTokenType.EVENTO) return (eventsMap[(owner as EventNode).name]?.params ?? []).map(name => ({ name, dataType: InjectedNames.typeOf(name) }));

        return [];
    }
}
