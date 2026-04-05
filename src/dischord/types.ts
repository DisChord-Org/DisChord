import { ASTNode, BaseNode } from "../chord/types";

export type DisChordNodeType =
        'EncenderBot' | 'Evento' | 'CrearComando'
      | 'ParametroDeComando' | 'CrearMensaje' | 'CuerpoDelMensaje'
      | 'CrearRecolector' | 'BDO';

export interface StartBotNode extends BaseNode<DisChordNodeType> {
    type: 'EncenderBot';
    object: ODBNode;
}

export interface EventNode extends BaseNode<DisChordNodeType> {
    type: 'Evento';
    name: string;
    body: DisChordASTNode[];
}

export interface CommandNode extends BaseNode<DisChordNodeType> {
    type: 'CrearComando';
    value: string;
    params: CommandParam[];
    body: DisChordASTNode[];
}

export interface CommandDescriptionParam extends BaseNode<DisChordNodeType> {
    type: 'ParametroDeComando';
    property: 'Descripcion';
    value: DisChordASTNode;
}

export interface CommandOptionsParam extends BaseNode<DisChordNodeType> {
    type: 'ParametroDeComando';
    property: 'Opciones';
    options: CommandOptionNode[];
}

export interface CommandStringOptionParam extends BaseNode<DisChordNodeType> {
    type: 'ParametroDeComando';
    name: string;
    property: 'Texto';
    description: DisChordASTNode;
    required: DisChordASTNode;
}

export type CommandOptionNode = CommandStringOptionParam;
export type CommandParam = CommandDescriptionParam | CommandOptionsParam;

export interface MessageNode extends BaseNode<DisChordNodeType> {
    type: 'CrearMensaje';
    object: ODBNode;
}

export interface MessageContentNode extends BaseNode<DisChordNodeType> {
    type: 'CuerpoDelMensaje';
    property: 'contenido';
    content: DisChordASTNode;
}

export interface MessageChannelNode extends BaseNode<DisChordNodeType> {
    type: 'CuerpoDelMensaje';
    property: 'canal';
    channel: DisChordASTNode;
}

export interface MessageEmbedNode extends BaseNode<DisChordNodeType> {
    type: 'CuerpoDelMensaje';
    property: 'embed';
    embed: EmbedBody;
}

export interface MessageButtonNode extends BaseNode<DisChordNodeType> {
    type: 'CuerpoDelMensaje';
    property: 'boton';
    id: DisChordASTNode;
    label: DisChordASTNode;
    emoji?: DisChordASTNode;
    style: DisChordASTNode;
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
    object: DisChordASTNode;
}

export interface EmbedDescription extends BaseNode<EmbedComponents> {
    type: 'descripcion';
    object: DisChordASTNode;
}

export interface EmbedColor extends BaseNode<EmbedComponents> {
    type: 'color';
    object: DisChordASTNode;
}

export interface EmbedTimestamp extends BaseNode<EmbedComponents> {
    type: 'hora';
}

export interface EmbedImage extends BaseNode<EmbedComponents> {
    type: 'imagen';
    object: DisChordASTNode;
}

export interface EmbedThumbnail extends BaseNode<EmbedComponents> {
    type: 'cartel';
    object: DisChordASTNode;
}

export interface EmbedAuthor extends BaseNode<EmbedComponents> {
    type: 'autor';
    name: DisChordASTNode;
    iconUrl: DisChordASTNode;
}

export interface EmbedFooter extends BaseNode<EmbedComponents> {
    type: 'pie';
    text: DisChordASTNode;
    iconUrl?: DisChordASTNode;
}

export interface EmbedField extends BaseNode<EmbedComponents> {
    type: 'campo';
    text: DisChordASTNode;
    value: DisChordASTNode;
    inline: DisChordASTNode;
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

export interface CollectorNode extends BaseNode<DisChordNodeType> {
    type: 'CrearRecolector';
    variable: DisChordASTNode;
    body: CollectorPulseBody[];
}

export interface CollectorPulseBody {
    method: 'run';
    id: DisChordASTNode;
    body: DisChordASTNode[];
}

export interface ODBNode extends BaseNode<DisChordNodeType> {
    type: 'BDO';
    blocks: Record<string, DisChordASTNode>;
    body: DisChordASTNode[];
} 

export type CreationNode = CommandNode | MessageNode | CollectorNode;
export type DisChordNode =
      StartBotNode
    | EventNode
    | CommandNode
    | MessageNode
    | CollectorNode
    | ODBNode
    | MessageBodyNode;

export type DisChordASTNode = ASTNode<DisChordNodeType, DisChordNode>;