/**
 * What `imprimir` is called through: the logger of the bot's client, and `console.log` when there
 * is no client in scope (a function that did not receive `cliente`, the top level of a file) or it
 * has no logger. Decided when the call runs, because whether `cliente` exists at that point is not
 * something the compiler can know for every function. The `{ info: console.log }` fallback keeps
 * the call a method call (`.info(...)`), so the logger keeps its `this`.
 * @type {string}
 */
export const imprimirCallee = "(typeof cliente !== 'undefined' && cliente.logger ? cliente.logger : { info: console.log }).info";
