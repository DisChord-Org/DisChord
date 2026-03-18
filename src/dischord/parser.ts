import { KeyWords } from '../chord/keywords';
import { Parser } from '../chord/parser';
import { ASTNode, Token } from '../chord/types';
import CommandParser from './Commands/CommandParser';
import MessageParser from './Messages/MessageParser';
import CollectorParser from './Messages/CollectorParser';
import { CollectorNode, CommandNode, MessageNode } from './types';
import ClientParser from './Client/ClientParser';
import EventParser from './Events/EventParser';

export class DisChordParser extends Parser {
    private ClientParser = new ClientParser(this);
    private EventParser = new EventParser(this);
    private CommandParser = new CommandParser(this);
    private MessageParser = new MessageParser(this);
    private CollectorParser = new CollectorParser(this);

    constructor (tokens: Token[], current: number = 0) {
        super(tokens, current);
    }

    public static injectStatements() {
        KeyWords.addStatements([ "encender", "evento", "crear" ]);
    }

    override parseCustomStatement(): ASTNode | null {
        const token = this.peek();

        let node: any = null; // this will save me work, sorry

        switch (token.type) {
            case 'ENCENDER':
                node = this.ClientParser.parse();
                break;
            case 'EVENTO':
                node = this.EventParser.parse();
                break;
            case 'CREAR':
                node = this.parseCreation();
                break;
        }

        return node as unknown as ASTNode;
    }

    private parseCreation(): MessageNode | CommandNode | CollectorNode {
        this.consume('CREAR');

        switch(this.peek().value) {
            case 'mensaje':
                return this.MessageParser.parse();
            case 'comando':
                return this.CommandParser.parse();
            case 'recolector':
                return this.CollectorParser.parse();
        }

        throw new Error(`Se esperaba la creación de un comando o mensaje, se encontró '${this.peek().value}'`);
    }

    override parsePrimary(): ASTNode {
        const token = this.peek();

        switch (token.type) {
            case 'CREAR':
                return this.parseCreation() as unknown as ASTNode;
            default:
                return super.parsePrimary();
        }
    }
}