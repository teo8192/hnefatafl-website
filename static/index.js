import init, { Hnefatafl, CellType, wasm_memory } from "/webapp/hnefatafl_webapp.js";
// Import the WebAssembly memory at the top of the file.
//import { memory } from "/webapp/hnefatafl_webapp_bg.wasm";

init().then(() => {
    let memory = wasm_memory();

    let CELL_SIZE = 50;
    const GRID_COLOR = "#CCCCCC";
    const EMPTY_COLOR = "#BBBBBB";
    const FORTRESS_COLOR = "#888888";
    const ATTACKER_COLOR = "#000000";
    const DEFENDER_COLOR = "#FFFFFF";
    const KING_COLOR = "#FFFF00";
    const HIGHLIGHT_COLOR = "#00FF00";

    const game = Hnefatafl.new();
    const width = game.width();
    const height = game.height();

    const canvas = document.getElementById("hnefatafl-canvas");
    canvas.width = width * (CELL_SIZE + 1) + 1;
    canvas.height = height * (CELL_SIZE + 1) + 1;

    const msg_box = document.getElementById("hnefatafl-msg");
    const turn_box = document.getElementById("hnefatafl-turn");

    const ctx = canvas.getContext("2d");

    let highlighted = {
        x: -1,
        y: -1,
        sel: false
    };

    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor( (event.clientX - rect.left) / (CELL_SIZE + 1));
        const y = Math.floor( (event.clientY - rect.top)  / (CELL_SIZE + 1));
        console.log("x: " + x  + " y: " + y);
        msg_box.textContent = "";
        if (highlighted.sel) {
            let result = game.move_piece(highlighted.x, highlighted.y, x, y);
            if (result !== "") {
                console.log(result);
                msg_box.textContent = result;
            }
            highlighted.sel = false;
        } else {
            highlighted.x = x;
            highlighted.y = y;
            highlighted.sel = true;
        }
    }

    canvas.addEventListener("mousedown", function(e) {
        getCursorPosition(canvas, e);
    });

    const renderLoop = () => {
        // logic?
            //universe.tick();

        if (game.is_black_to_play()) {
            turn_box.textContent = "Black to play";
        } else {
            turn_box.textContent = "White to play";
        }

        drawGrid();

        game.copy_board_to_local();
        drawPieces();

        requestAnimationFrame(renderLoop);
    };

    const drawGrid = () => {
        ctx.beginPath();
        ctx.strokeStyle = GRID_COLOR;

        // Vertical lines.
            for (let i = 0; i <= width; i++) {
                ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
                ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
            }

        // Horizontal lines.
            for (let j = 0; j <= height; j++) {
                ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
                ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
            }

        ctx.stroke();
    };

    const getIndex = (x, y) => {
        return x + y * width;
    };

    const drawPieces = () => {
        const cellsPtr = game.tiles();
        const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

        ctx.beginPath();

        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const idx = getIndex(col, row);

                switch (cells[idx]) {
                    case CellType.Empty:
                        ctx.fillStyle = EMPTY_COLOR;
                        break;
                    case CellType.Attacker:
                        ctx.fillStyle = ATTACKER_COLOR;
                        break;
                    case CellType.Defender:
                        ctx.fillStyle = DEFENDER_COLOR;
                        break;
                    case CellType.King:
                        ctx.fillStyle = KING_COLOR;
                        break;
                }

                if (cells[idx] === CellType.Empty && (
                    (row === 0 && col === 0) ||
                    (row === 0 && col === 10) ||
                    (row === 10 && col === 0) ||
                    (row === 10 && col === 10) ||
                    (row === 5 && col === 5))) {
                    ctx.fillStyle = FORTRESS_COLOR;
                }

                ctx.fillRect(
                    col * (CELL_SIZE + 1) + 1,
                    row * (CELL_SIZE + 1) + 1,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }

        ctx.stroke();
    };

    requestAnimationFrame(renderLoop);
});
