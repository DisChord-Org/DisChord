import { Program } from './cli/Program';
import { DisChordError } from './errors/ChordError';

/**
 * Execution Bootstrapper
 * 
 * 1. Instantiates the main CLI Program orchestrator.
 * 2. Parses command-line arguments and delegates to appropriate Command handlers.
 * 3. Global Catch: Intercepts handled DisChordError exceptions or unhandled runtime 
 *    errors, logging formatted diagnostics and exiting the process with code 1.
 */
new Program()
    .parse(process.argv)
    .catch((error: unknown) => {

        if (error instanceof DisChordError) {
            console.error(error.format());
        
        } else if (error instanceof Error) {
            console.error(`\x1b[31m[Fatal Error]\x1b[0m ${error.message}`);
            if (error.stack) console.error(error.stack);

        } else {
            console.error('\x1b[31m[Fatal Error]\x1b[0m Ha ocurrido un error desconocido:', error);
        
        }

        process.exit(1);
    });