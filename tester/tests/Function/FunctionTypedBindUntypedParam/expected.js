import { chordTiene } from './lib/runtimeHelpers.js';
class Buscador {
    buscar(x) {
        return x;
    }
}
function hayEn(p, x) {
    return chordTiene(p, x);
}
function encontrar(p) {
    return p.buscar('a');
}
