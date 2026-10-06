class Caja {
    async m() {
        return 1;
    }
}
async function f(Caja) {
    await Caja.m();
}
