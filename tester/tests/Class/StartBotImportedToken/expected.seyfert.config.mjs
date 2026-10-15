import { GatewayIntentBits } from "seyfert/lib/types/index.js";
import { config } from "seyfert";
import { TOKEN } from "./lib/ent/src/index.js"
import { PREFIJO } from "./dist/otro.js"
export default config.bot({
token: TOKEN,
intents: [],
locations: {
base: "dist",
commands: "comandos",
events: "eventos",
components: "componentes"
}
});
