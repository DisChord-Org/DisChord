// import * as fs from "fs";
// import path from "path";

import { Lexer } from "./Lexer/lexer";
import { Parser } from "./Parser/parser";
import { executeAST } from "./Interpreter/interpreter";

// const code = fs.readFileSync(path.join(__dirname, "../index.chord"), "utf-8");
// const lexer = new Lexer(code);
// const parser = new Parser(lexer.tokenize()).parse();
// executeAST(parser);

export class DisChord {
    constructor ( code: string ) {
        executeAST(
            new Parser(
                new Lexer(code).tokenize()
            ).parse()
        )
    }
}