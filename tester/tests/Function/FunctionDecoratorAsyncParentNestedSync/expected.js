import './lib/consoleRuntime.js';
async function padre() {
    function hijo() {
        console.log(1);
    }
    hijo();
}
