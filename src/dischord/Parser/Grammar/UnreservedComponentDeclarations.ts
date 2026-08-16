import { SubParserClass } from "../../../chord/Parser/SubParser";
import { DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import EmbedDeclarationParser from "./components/EmbedDeclarationParser";
import ButtonDeclarationParser from "./components/ButtonDeclarationParser";

/**
 * A single unreserved-keyword component declaration: which literal word triggers it (`embed`,
 * `boton`, ...), which `SubParser` parses its `<Nombre> { ... }` body, and which AST node type
 * that parser produces — the last one lets `DisChordStatementParser.bindReusableName` recognize
 * "this is a component declaration that needs wrapping in a `VariableNode`" generically, without
 * hardcoding each node type by name.
 */
export interface UnreservedComponentDeclaration {
    keyword: string;
    nodeType: DisChordNodeType;
    ParserClass: SubParserClass<DisChordNodeType, DisChordNode>;
}

/**
 * Every unreserved-keyword component declaration DisChord recognizes. The single source of truth
 * both `DisChordParser.parseCustomStatement` (dispatch) and `DisChordStatementParser` (deciding
 * whether to bind the result to a reusable name) read from — adding a new one (e.g. a future
 * `menu <Nombre> { ... }`) means adding a row here, not touching either of those files' logic.
 */
export const UnreservedComponentDeclarations: UnreservedComponentDeclaration[] = [
    { keyword: DisChordTokenType.Embed, nodeType: DisChordTokenType.CREAR_EMBED, ParserClass: EmbedDeclarationParser },
    { keyword: DisChordTokenType.Boton, nodeType: DisChordTokenType.CREAR_BOTON, ParserClass: ButtonDeclarationParser }
];
