# Lenguaje Conway

**Conway** es el formato de texto de Conway Studio para describir patrones celulares. Está pensado para que una persona pueda leerlo y editarlo, no solo para que el editor lo genere.

## Ejemplo

```conway
# CONWAY/2
pattern Semaforo {
  @color A #65D9B9
  @row 3*A
  @row A . A
  @row 3*A
}
```

- `#` inicia un comentario. El encabezado de versión también es un comentario.
- `pattern Nombre { ... }` declara un patrón. El nombre admite letras, números, guion y guion bajo.
- `@color SIMBOLO #RRGGBB` asigna un color a un símbolo de una sola letra.
- `.` representa una célula muerta.
- Cada fila normal es una secuencia de símbolos sin espacios.
- `@row` permite escribir filas por bloques: `5*A 2*. B` significa cinco células A, dos espacios vacíos y una célula B. Si se omite el número, el bloque tiene longitud uno.

## Colores y símbolos

Los símbolos distinguen tipos visuales de células, no comportamientos diferentes: todas siguen las mismas reglas de Conway. Puedes declarar varios colores:

```conway
# CONWAY/2
pattern DosColores {
  @color A #65D9B9
  @color B #F4B860
  A.B
  .BA
}
```

El punto siempre está reservado para una célula vacía. Cada símbolo vivo usado debe tener un `@color` declarado.

## Filas comprimidas

Las filas normales siguen siendo válidas y suelen ser más cómodas para patrones pequeños:

```conway
pattern Linea {
  @color A #65D9B9
  AAAAAAA........
}
```

Para filas largas, `@row` evita repetir el mismo carácter:

```conway
pattern Linea {
  @color A #65D9B9
  @row 7*A 8*.
}
```

El editor elige automáticamente entre fila normal y comprimida al generar código.

## Instrucciones geométricas

Además de dibujar filas, puedes colocar células o rectángulos mediante coordenadas:

- `@cell x y SIMBOLO`: coloca una célula en una coordenada.
- `@rect x y ancho alto SIMBOLO`: dibuja un rectángulo relleno.

Las coordenadas pueden ser negativas. El editor ajusta el origen automáticamente para que todo el patrón quepa en el área importada. Las instrucciones respetan los colores declarados con `@color`.

```conway
# CONWAY/2
pattern Casa {
  @color A #65D9B9
  @color B #F4B860
  @rect 0 2 7 4 A
  @rect 2 0 3 2 B
  @cell 3 4 B
}
```

Las instrucciones pueden mezclarse con filas normales y filas `@row`. Si dos instrucciones colocan una célula en la misma posición, se conserva la primera.

## Transformaciones

Puedes transformar el patrón después de definir sus filas:

- `@mirror horizontal`: refleja de izquierda a derecha.
- `@mirror vertical`: refleja de arriba abajo.
- `@mirror both`: aplica ambos reflejos.
- `@rotate 90`, `@rotate 180` o `@rotate 270`: gira en sentido horario.

Las transformaciones se aplican en el orden en que aparecen. Puedes combinarlas:

```conway
# CONWAY/2
pattern Flecha {
  @color A #65D9B9
  A..
  AAA
  A..
  @rotate 90
  @mirror vertical
}
```

No necesitas reescribir manualmente las filas para crear variantes simétricas o rotadas.

## Compatibilidad

- Los patrones antiguos `CONWAY/1` siguen siendo compatibles.
- Las filas normales siguen siendo válidas en `CONWAY/2`.
- El editor usa un bloque compacto interno cuando un patrón contiene más de 62 colores distintos. Ese bloque conserva exactamente los datos, pero normalmente no necesitas escribirlo a mano.
- El formato actual admite dimensiones de hasta 2000 × 2000 y limita el patrón a 500 000 células vivas.

## Reglas del archivo

1. Un archivo contiene una sola declaración `pattern`.
2. Todas las filas van dentro de sus llaves.
3. La llave de cierre es obligatoria.
4. Las filas pueden tener longitudes distintas; las más cortas se completan visualmente con células vacías.
5. Los símbolos no declarados producen un error en lugar de asignarles un color arbitrario.

Puedes abrir el panel **Lenguaje Conway** en el editor, generar código desde una selección, modificarlo e importarlo para colocarlo en el lienzo.
