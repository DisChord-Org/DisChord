import { NewNode, TokenType, TokenTypeUnion, VariableNode } from '../../../chord/types';
import { SubParser } from '../../../chord/Parser/SubParser';
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, EmbedDeclarationNode } from '../../types';
import { Parser } from '../../../chord/Parser/Parser';
import { StatementParser } from '../../../chord/Parser/Grammar/StatementParser/StatementParser';
import { AccessParser } from '../../../chord/Parser/Grammar/Expressions/AccessParser';

/**
 * @class DisChordStatementParser
 * @description Specialized sub-parser that intercepts and orchestrates top-level statements for DisChord.
 * It handles custom syntax and falls back to native Chord statements when necessary.
 * @extends {SubParser<DisChordNodeType, DisChordNode>}
 */
export default class DisChordStatementParser extends SubParser<DisChordNodeType, DisChordNode> {
    /** To identify when this parser should be used */
    static triggerToken: DisChordNodeType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<DisChordNodeType>[] = [];

    /**
     * @param parent - The main Parser context for token expression handling
     */
    constructor (protected parent: Parser<DisChordNodeType, DisChordNode>) {
        super(parent);
    };

    /**
     * Executes the syntactic analysis for the statement.
     * @returns {DisChordASTNode} The constructed abstract syntax tree node.
     * @throws {DisChordError} If 'nuevo' is followed by an invalid or unregistered architectural component.
     * @override
     */
    public parse(): DisChordASTNode {
        const token = this.peek();

        if (token.type === TokenType.Nuevo) {
            this.consume(TokenType.Nuevo);

            // Dialect-specific dispatch (e.g. 'comando'/'evento'/'embed') takes priority over the
            // generic class shorthand, since it's more specific.
            const customStatement = this.parent.parseCustomStatement();
            if (customStatement) return this.bindReusableName(customStatement);

            const classShorthand = this.parent.tryParseClassShorthand();
            if (classShorthand) return classShorthand;

            const call = this.parent.get(AccessParser).parse();
            return this.createNode<NewNode<DisChordNodeType, DisChordNode>>({
                type: TokenType.Nuevo,
                object: call
            });
        }

        return this.parent.get(StatementParser).parse();
    }

    /**
     * If the given node is a value-only declaration reached at statement level (currently just
     * `EmbedDeclarationNode`, from `nuevo embed <Nombre> { ... }`), wraps it in a regular
     * `VariableNode` so `<Nombre>` becomes a usable, reusable binding — mirroring `var <Nombre>
     * es <expr>`. Left untouched otherwise.
     *
     * The same underlying node reached nested inside another expression (e.g. as a message's
     * `embed` property value, via `PrimaryParser` instead of here) never goes through this
     * method, so it stays a bare expression there rather than being bound to a name.
     * @private
     */
    private bindReusableName (node: DisChordASTNode): DisChordASTNode {
        if (node.type !== DisChordTokenType.CREAR_EMBED) return node;

        const embed = node as EmbedDeclarationNode;

        return this.createNode<VariableNode<DisChordNodeType, DisChordNode>>({
            type: TokenType.VARIABLE,
            id: embed.name,
            value: embed
        });
    }
}