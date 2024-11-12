// Verifica si la pieza puede moverse a una nueva posición
function can_move (piece: any[], position: number[]) {
    for (let y4 = 0; y4 <= piece.length - 1; y4++) {
        for (let x4 = 0; x4 <= piece[y4].length - 1; x4++) {
            if (piece[y4][x4] == 1) {
                if (position[0] + y4 >= 8 || position[1] + x4 >= 8 || position[1] + x4 < 0) {
                    return false
                }
                if (matrix[position[0] + y4][position[1] + x4] == 1) {
                    return false
                }
            }
        }
    }
    return true
}
// Fija la pieza actual en la matriz
function fix_piece () {
    if (current_piece) {
        // Verifica que current_piece no sea null
        for (let y5 = 0; y5 <= tetriminos[current_piece].length - 1; y5++) {
            for (let x5 = 0; x5 <= tetriminos[current_piece][y5].length - 1; x5++) {
                if (tetriminos[current_piece][y5][x5] == 1) {
                    matrix[current_position[0] + y5][current_position[1] + x5] = 1
                }
            }
        }
    }
}
// Actualiza la pantalla con la matriz del juego
function update_screen () {
    clear_screen()
    for (let y2 = 0; y2 <= 7; y2++) {
        for (let x2 = 0; x2 <= 7; x2++) {
            if (matrix[y2][x2] == 1) {
                np.setPixelColor(y2 * 8 + x2, neopixel.colors(NeoPixelColors.White))
            }
        }
    }
    np.show()
}
// Función principal del juego
function game_loop () {
    generate_new_piece()
    basic.forever(function () {
        if (input.buttonIsPressed(Button.A)) {
            // Mueve la pieza a la izquierda
            if (can_move(tetriminos[current_piece || ""] || [], [current_position[0], current_position[1] - 1])) {
                current_position[1] -= 1
            }
        }
        if (input.buttonIsPressed(Button.B)) {
            // Mueve la pieza a la derecha
            if (can_move(tetriminos[current_piece || ""] || [], [current_position[0], current_position[1] + 1])) {
                current_position[1] += 1
            }
        }

        // Mueve la pieza hacia abajo automáticamente
        if (can_move(tetriminos[current_piece || ""] || [], [current_position[0] + 1, current_position[1]])) {
            move_down()
        } else {
            fix_piece()  // Fija la pieza cuando no puede bajar más
            generate_new_piece()  // Genera una nueva pieza
        }

        update_screen()
        draw_piece(tetriminos[current_piece || ""] || [], current_position)
        basic.pause(500)  // Controla la velocidad de caída
    })
}
// Dibuja la pieza actual en la posición especificada
function draw_piece (piece: any[], position: number[]) {
    for (let y3 = 0; y3 <= piece.length - 1; y3++) {
        for (let x3 = 0; x3 <= piece[y3].length - 1; x3++) {
            if (piece[y3][x3] == 1) {
                // Utiliza una cadena vacía si es null
                np.setPixelColor((position[0] + y3) * 8 + (position[1] + x3), colors[0])
            }
        }
    }
    np.show()
}
// Mueve la pieza hacia abajo
function move_down () {
    current_position[0] += 1
}
// Función para limpiar la pantalla
function clear_screen () {
    np.clear()
    np.show()
}
// Genera una nueva pieza aleatoria
function generate_new_piece () {
    let keys = Object.keys(tetriminos)
current_piece = keys[Math.randomRange(0, keys.length - 1)]
    current_position = [0, 3]
    draw_piece(tetriminos[current_piece], current_position)
}
let matrix: number[][] = []
let current_position: number[] = []
let np: neopixel.Strip = null
let current_piece: string | null = null
np = neopixel.create(DigitalPin.P0, 64, NeoPixelMode.RGB)
let tetriminos: { [key: string]: number[][] } = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    L: [[1, 0], [1, 0], [1, 1]],
    Z: [[1, 1, 0], [0, 1, 1]]
}
let colors: { [key: string]: number } = {
    I: neopixel.colors(NeoPixelColors.Blue),  // Cambié "Cyan" por "Blue"
    O: neopixel.colors(NeoPixelColors.Yellow),
    T: neopixel.colors(NeoPixelColors.Purple),
    L: neopixel.colors(NeoPixelColors.Orange),
    Z: neopixel.colors(NeoPixelColors.Red)
}
current_position = [0, 0]
// Inicializa la matriz vacía (8x8)
for (let index = 0; index < 8; index++) {
    let row: number[] = []
    for (let index = 0; index < 8; index++) {
        row.push(0)
    }
    matrix.push(row)
}
// Inicia el juego
game_loop()
