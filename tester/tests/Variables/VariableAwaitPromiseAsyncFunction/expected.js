async function f() {
    return await Promise.all([await Promise.resolve(1)]);
}
