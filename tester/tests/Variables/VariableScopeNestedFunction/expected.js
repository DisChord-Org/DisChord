function externa() {
    let a = 1;
    function interna() {
        let a = 'x';
        a = 'y';
    }
    a = 2;
}
