function hayEn(c, x) {
    return c.has(x);
}
let m = new Map();
hayEn(m, 'a');
function puente(p, q) {
    hayEn(p, 'a');
    hayEn(m, p);
}
let cualquiera = JSON.parse('1');
hayEn(m, cualquiera);
