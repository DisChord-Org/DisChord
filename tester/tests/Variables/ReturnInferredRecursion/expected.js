function f(n) {
    if (n > 0) {
        return f(n - 1);
    }
    return 1;
}
let s = f(1);
