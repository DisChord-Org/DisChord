async function tarea() {
    return 1;
}
async function principal() {
    for (let i = 0; i < 2; i++) {
        await tarea();
    }
}
