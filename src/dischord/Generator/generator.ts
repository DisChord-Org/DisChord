import fs from "node:fs";
import { join } from "node:path";

import { Generator } from "../../chord/generator";
import { AccessNode, ASTNode, CallNode, ObjectPropertyType } from "../../chord/types";
import { corelib, createMessageFunctionInjection, EmbedColors, eventsMap, intentsMap } from "./../core.lib";
import { ButtonStyles, CollectorNode, CollectorPulseBody, CommandNode, CommandOptionNode, CommandParam, DisChordNodeType, EmbedBody, EmbedField, EventNode, MessageBodyNode, MessageButtonNode, MessageChannelNode, MessageContentNode, MessageEmbedNode, MessageNode, StartBotNode } from "./../types";
import ClietInitGenerator from "./Client/ClientInitGenerator";
import EventGenerator from "./Events/EventGenerator";
import CommandGenerator from "./Commands/CommandGenerator";
import MessageGenerator from "./Messages/MessageGenerator";
import CollectorGenerator from "./CollectorGenerator";

export class DisChordGenerator extends Generator {
    projectRooth: string = '';

    public currentInteraction: string | null = null; // context

    private ClientInitGenerator = new ClietInitGenerator(this);
    private EventGenerator = new EventGenerator(this);
    private CommandGenerator = new CommandGenerator(this);
    private MessageGenerator = new MessageGenerator(this);
    private CollectorGenerator = new CollectorGenerator(this);

    constructor(symbols: Map<string, any>, projectRoot: string) {
        super(symbols);
        this.projectRooth = projectRoot;
    }

    override visit(node: ASTNode): string {
        switch (node.type as DisChordNodeType) {
            case 'EncenderBot':
                return this.ClientInitGenerator.generate(node as unknown as StartBotNode);
            case 'Evento':
                return this.EventGenerator.generate(node as unknown as EventNode);
            case 'CrearMensaje':
                return this.MessageGenerator.generate(node as unknown as MessageNode);
            case 'CrearComando':
                return this.CommandGenerator.generate(node as unknown as CommandNode);
            case 'CrearRecolector':
                return this.CollectorGenerator.generate(node as unknown as CollectorNode);
            default:
                return super.visit(node);
        }
    }

    override generateAccess(node: AccessNode): string {
        const objName = node.object.type === 'Identificador' ? node.object.value : null;
        const propName = node.property;

        if (objName && corelib[objName]) {
            const mapping = corelib[objName];
            
            if (typeof mapping === 'object' && mapping[propName]) {
                const translation = mapping[propName];
                
                if (translation.startsWith(objName + '.')) {
                    return translation;
                }
                return `${objName}.${translation}`;
            }
        }

        return super.generateAccess(node);
    }

    override generateCall(node: CallNode): string {
        if (node.object.type === 'Identificador') {
            const name = node.object.value;
            
            if (typeof corelib[name] === 'string') {
                const translation = corelib[name] as string;
                const args = node.params.map((arg: ASTNode) => this.visit(arg)).join(', ');
                return `${translation}(${args})`;
            }
        }

        return super.generateCall(node);
    }
}