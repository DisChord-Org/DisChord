import './lib/consoleRuntime.js';
(typeof cliente !== 'undefined' && cliente.logger ? cliente.logger : { info: console.log }).info(
    'hola desde el nivel superior',
    true,
);
function saludar(cliente) {
    (typeof cliente !== 'undefined' && cliente.logger ? cliente.logger : { info: console.log }).info(
        'hola con cliente',
    );
}
saludar(undefined);
