import { ASTNode, BaseNode, VariableNode } from "../chord/types";

export type DisChordNodeType = 'EncenderBot' | 'Evento' | 'CrearComando'
                            | 'ParametroDeComando' | 'CrearMensaje' | 'CuerpoDelMensaje'
                            | 'CrearRecolector';

export interface StartBotNode extends BaseNode<DisChordNodeType> {
    type: 'EncenderBot';
    object: ASTNode;
}

export interface EventNode extends BaseNode<DisChordNodeType> {
    type: 'Evento';
    name: string;
    body: ASTNode[];
}

export interface CommandNode extends BaseNode<DisChordNodeType> {
    type: 'CrearComando';
    value: string;
    params: CommandParam[];
    body: ASTNode[];
}

export interface CommandDescriptionParam extends BaseNode<DisChordNodeType> {
    type: 'ParametroDeComando';
    property: 'descripcion';
    value: ASTNode;
}

export type CommandParam = CommandDescriptionParam;

export interface MessageNode extends BaseNode<DisChordNodeType> {
    type: 'CrearMensaje';
    body: MessageBodyNode[];
}

export interface MessageContentNode extends BaseNode<DisChordNodeType> {
    type: 'CuerpoDelMensaje';
    property: 'contenido';
    content: ASTNode;
}

export interface MessageChannelNode extends BaseNode<DisChordNodeType> {
    type: 'CuerpoDelMensaje';
    property: 'canal';
    channel: ASTNode;
}

export interface MessageEmbedNode extends BaseNode<DisChordNodeType> {
    type: 'CuerpoDelMensaje';
    property: 'embed';
    embed: EmbedBody;
}

export interface MessageButtonNode extends BaseNode<DisChordNodeType> {
    type: 'CuerpoDelMensaje';
    property: 'boton';
    id: ASTNode;
    label: ASTNode;
    emoji?: ASTNode;
    style: ASTNode;
}

export type ButtonDataKeys = Extract<keyof MessageButtonNode, 'id' | 'label' | 'emoji' | 'style'>;
export const ButtonPropMap: Record<string, ButtonDataKeys> = {
    'id': 'id',
    'etiqueta': 'label',
    'emoji': 'emoji',
    'estilo': 'style'
};

export enum ButtonStyles {
    azul = 1,
    gris,
    verde,
    rojo,
    enlace,
    premium
}

export type ButtonKeys = keyof typeof ButtonPropMap;
export type EmbedComponents = 'titulo' | 'descripcion' | 'color' | 'hora' | 'imagen' | 'cartel' | 'autor' | 'pie' | 'campo';
export interface EmbedTitle extends BaseNode<EmbedComponents> {
    type: 'titulo';
    object: ASTNode;
}

export interface EmbedDescription extends BaseNode<EmbedComponents> {
    type: 'descripcion';
    object: ASTNode;
}

export interface EmbedColor extends BaseNode<EmbedComponents> {
    type: 'color';
    object: ASTNode;
}

export interface EmbedTimestamp extends BaseNode<EmbedComponents> {
    type: 'hora';
}

export interface EmbedImage extends BaseNode<EmbedComponents> {
    type: 'imagen';
    object: ASTNode;
}

export interface EmbedThumbnail extends BaseNode<EmbedComponents> {
    type: 'cartel';
    object: ASTNode;
}

export interface EmbedAuthor extends BaseNode<EmbedComponents> {
    type: 'autor';
    name: ASTNode;
    iconUrl: ASTNode;
}

export interface EmbedFooter extends BaseNode<EmbedComponents> {
    type: 'pie';
    text: ASTNode;
    iconUrl?: ASTNode;
}

export interface EmbedField extends BaseNode<EmbedComponents> {
    type: 'campo';
    text: ASTNode;
    value: ASTNode;
    inline: ASTNode;
}

export interface EmbedBody {
    titulo?: EmbedTitle;
    descripcion?: EmbedDescription;
    color?: EmbedColor;
    hora?: EmbedTimestamp;
    imagen?: EmbedImage;
    cartel?: EmbedThumbnail;
    autor?: EmbedAuthor;
    pie?: EmbedFooter;
    campos: EmbedField[]
}

export type MessageBodyNode = MessageContentNode | MessageChannelNode | MessageEmbedNode | MessageButtonNode;

export interface CollectorNode {
    type: 'CrearRecolector';
    variable: VariableNode['value'];
}
// export type DisChordASTNode = ASTNode<DisChordNodeType, StartBotNode | EventNode | MessageNode | MessageBodyNode | CommandNode | CommandParam>;