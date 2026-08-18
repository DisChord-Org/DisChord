import './lib/consoleRuntime.js';
let mibdo = (() => {
    let bdoA = (() => {
        let bdoB = { bool: true };

        return { bdoB };
    })();

    return { bdoA };
})();
console.log(mibdo.bdoA.bdoB.bool);
