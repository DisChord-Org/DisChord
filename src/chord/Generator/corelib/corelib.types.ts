import { ClassesEnum } from "./corelib.data";

export interface CoreLibMember {
    readonly transpile: string;
    readonly static?: boolean;
}

export interface CoreLibClass {
    readonly methods: Readonly<Record<string, CoreLibMember>>;
    readonly properties?: Readonly<Record<string, CoreLibMember>>;
}

export interface CoreLib {
    readonly classes: Readonly<Record<ClassesEnum, CoreLibClass>>;
}