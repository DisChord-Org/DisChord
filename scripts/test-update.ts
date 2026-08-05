import { spawn } from "node:child_process";
import path from "node:path";

process.env.UPDATE_SNAPSHOTS = "true";

const entryPoint = path.join(process.cwd(), "src", "index.ts");

const child = spawn("npx", ["tsx", entryPoint, "test"], {
    stdio: "inherit",
    shell: true,
    env: process.env
});

child.on("exit", (code: number | null) => {
    process.exit(code ?? 0);
});