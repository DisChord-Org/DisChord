class A {
    static x = (() => {
        function f() {
            return 1;
        }
        return { f };
    })();
}
