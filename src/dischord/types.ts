import { ASTNode, BaseNode, ODBNode } from "../chord/types";

export type DisChordNodeType =
        'EncenderBot' | 'Evento' | 'CrearComando'
      | 'ParametroDeComando' | 'CrearMensaje' | 'CuerpoDelMensaje'
      | 'CrearRecolector';

export interface StartBotNode extends BaseNode<DisChordNodeType> {
    type: 'EncenderBot';
    object: DisChordODBNode;
}

export interface EventNode extends BaseNode<DisChordNodeType> {
    type: 'Evento';
    name: string;
    body: DisChordASTNode[];
}

export interface CommandNode extends BaseNode<DisChordNodeType> {
    type: 'CrearComando';
    value: string;
    body: DisChordODBNode;
}

export interface MessageNode extends BaseNode<DisChordNodeType> {
    type: 'CrearMensaje';
    object: DisChordODBNode;
}

export enum ButtonStyles {
    azul = 1,
    gris,
    verde,
    rojo,
    enlace,
    premium
}

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

export type CreationNode = CommandNode | MessageNode | CollectorNode;
export type DisChordNode =
      StartBotNode
    | EventNode
    | CommandNode
    | MessageNode
    | CollectorNode;

export type DisChordODBNode = ODBNode<DisChordNodeType, DisChordNode>;
export type DisChordASTNode = ASTNode<DisChordNodeType, DisChordNode>;