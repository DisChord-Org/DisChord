let l = [1, 2];
for (let x of Array.isArray(l) || typeof l === 'string' || l instanceof Set
    ? l
    : l instanceof Map
      ? l.keys()
      : Object.keys(l)) {
    x = 'a';
    let r = x;
}
