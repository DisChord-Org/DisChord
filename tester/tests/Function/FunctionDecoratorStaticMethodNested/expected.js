import './lib/consoleRuntime.js';
class Caja {
    static crear() {
        function interna() {
            console.log(1);
        }
        interna();
    }
}
