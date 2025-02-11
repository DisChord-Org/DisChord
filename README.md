# DisChord
Intérprete para crear bots de Discord de forma rápida y eficaz.

# Example

```ts
// Hello world using DisChord

FUNCION hola (lenguaje) {                     // Creamos una función llamada "hola" con un parámetro llamado "lenguaje".
    SI (lenguaje IGUAL "DisChord") {          // Si el parámetro es igual a "DisChord"
        VAR mensaje IGUAL "- ¡Hola mundo!  -" // Asignar una variable
    } SINO {                                  // En caso contrario
        VAR mensaje IGUAL ". . ."             // Asignar una variable
    }

    DEVOLVER <mensaje>                        // Devolver la variable mensaje
}

CONSOLA LIMPIAR                               // Limpiar la consola
CONSOLA "- - - - - - - - -"                   // Enviar un mensaje a la consola
CONSOLA ( hola("DisChord") )                  // Enviar un mensaje a la consola (La llamada a la función "hola" en este caso)
CONSOLA "- - - - - - - - -"                   // Enviar un mensaje a la consola
```