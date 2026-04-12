import Init from './init/Init';

/**
 * Execution Bootstrapper
 * * 1. Instantiates the Init orchestrator.
 * 2. Starts the asynchronous compilation/execution pipeline.
 * 3. Global Catch: Intercepts any unhandled exceptions in the 
 * Lexer, Parser, or Generator, logging them and exiting 
 * the process with an error code (1).
 */
new Init().run().catch(error => {
    console.log(error);
    process.exit(1);
});