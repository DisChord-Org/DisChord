// lib/ent.chord
// ¿env? nah, ent (entorno).
// se supone que Chord es en español, por lo que las variables serán en español.

import fs from 'fs';

class GestorEnt {
    /**
     * Lee y carga el archivo .env en memoria
     */
    public static cargar(path: string = '.env'): void {
        if (!fs.existsSync(path)) return;

        const contenido = fs.readFileSync(path, 'utf-8');
        const lineas = contenido.split(/\r?\n/);

        for (const linea of lineas) {
            const recorte = linea.trim();
            if (!recorte || recorte.startsWith('#')) continue;

            const igualado = recorte.match(/^([^=]+)=(.*)$/);
            if (igualado) {
                const clave = igualado[1].trim();
                let valor = igualado[2].trim();

                valor = valor.replace(/^['"]|['"]$/g, '');

                process.env[clave] = valor; 
            }
        }
    }

    obtenerVariable(nombre: string) {
        return process.env[nombre];
    }
}

const InstanciaEnt = new GestorEnt();

export const ent = new Proxy({}, {
    get(_, prop: string) {
        return InstanciaEnt.obtenerVariable(prop);
    }
});