import { Tester } from "./Tester";

/**
 * Entry point of the compiler's own test suite (`pnpm test`, and `pnpm test:update` through
 * `scripts/test-update.ts`). It lives with the tests, so nothing under `src/` depends on `tester/`.
 */
new Tester().testAll().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
});
