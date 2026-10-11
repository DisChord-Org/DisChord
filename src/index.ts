import { CommanderError } from 'commander';
import { Program } from './cli/Program';
import { ExitCode } from './cli/ExitCode';
import { BaseChordError } from './errors/ChordError';

/**
 * Execution Bootstrapper
 * 
 * 1. Instantiates the main CLI Program orchestrator.
 * 2. Parses command-line arguments and delegates to appropriate Command handlers.
 * 3. Global Catch: Intercepts handled compiler errors or unhandled runtime 
 *    errors, logging formatted diagnostics and exiting the process with the code `ExitCode`
 *    assigns to the failure.
 */
new Program()
    .parse(process.argv)
    .catch((error: unknown) => {

        if (error instanceof CommanderError) {
            // commander has already printed its usage error, help or version

        } else if (error instanceof BaseChordError) {
            console.error(error.format());
        
        } else if (error instanceof Error) {
            console.error(`\x1b[31m[Fatal Error]\x1b[0m ${error.message}`);
            if (error.stack) console.error(error.stack);

        } else {
            console.error('\x1b[31m[Fatal Error]\x1b[0m Ha ocurrido un error desconocido:', error);
        
        }

        process.exit(ExitCode.of(error));
    });