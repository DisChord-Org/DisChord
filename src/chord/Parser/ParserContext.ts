import { Parser } from "../parser";
import { SubParser } from "./subparser";

export type SubParserClass<T extends SubParser<any, any>> = new (parent: Parser<any, any>) => T;

export class ParserContext {
    private static registry: Set<SubParserClass<any>> = new Set();
    private static instances: Map<SubParserClass<any>, SubParser<any, any>> = new Map();

    public static register<T extends SubParser<any, any>>(cls: SubParserClass<T>): void {
        if (!this.registry.has(cls)) {
            this.registry.add(cls);
        }
    }

    public static get<T extends SubParser<any, any>>(cls: SubParserClass<T>, parent: Parser<any, any>): T {
        if (!this.registry.has(cls)) throw new Error(`[ParserContext] Error de seguridad: La clase ${cls.name} no ha sido registrada.`);

        let instance = this.instances.get(cls);

        if (!instance) {
            instance = new cls(parent);
            this.instances.set(cls, instance);
        }

        return instance as T;
    }

    public static flush(): void {
        this.instances.clear();
    }
    
    public static reset(): void {
        this.instances.clear();
        this.registry.clear();
    }
}