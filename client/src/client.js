import BoardDrawer from "./BoardDrawer.mjs";
import GameBoard from "./GameBoard.mjs";

const board_width = 6;
const board_height = 8;
const cell_size = 80;
const shading_size = 70;
const border_size = cell_size - shading_size;

// pulled from repo
const getClickCoordinates = (element, event) =>
{
    const {top, left} = element.getBoundingClientRect();
    const {clientX, clientY} = event;
    return {
        x: clientX - left,
        y: clientY - top
    };
};

// gives the board position of the piece that was clicked on
const resolve_clicked_piece = (x, y) =>
{
    if (x % cell_size >= border_size && y % cell_size >= border_size)
    {
        return {
            piece_exists: 1,
            piece_x: Math.floor(x / cell_size),
            piece_y: Math.floor(y / cell_size)
        };
    } else
    {
        return {
            piece_exists: 0,
            piece_x: 0,
            piece_y: 0
        };
    }
};

const create_click_func = (canvas,game_board) =>
{
    const on_click = (e) =>
    {
        // get pixel coordinates of mouse click
        const {x, y} = getClickCoordinates(canvas, e);
        // get board piece of mouse click
        const {piece_exists, piece_x, piece_y} = resolve_clicked_piece(x, y)

        if (piece_exists)
        {
            console.log(`${piece_x}, ${piece_y}`);
            console.log(game_board.board[piece_y][piece_x]['owner'])
            if (game_board.piece_selected && game_board.in_highlighted_moves(piece_x,piece_y))
            {
                game_board.move_piece(piece_x,piece_y)
                game_board.redraw()
                if (game_board.game_over)
                {
                    console.log(`Game over. The winner is ${((game_board.winner === 0) ? 'Red' : 'Green')}`)
                }

            }
            else
            {
                if (game_board.board[piece_y][piece_x]['owner'] != -1)
                {
                    game_board.redraw()

                    game_board.select_piece(piece_x,piece_y)

                }
                else
                {
                    game_board.deselect()
                    game_board.redraw()
                }
            }

        }
        // sock.emit('turn', getCellCoordinates(x, y));
    };

    return {on_click}
}


(() =>
{
    const sock = io();
    sock.on('msg', console.log)
    const canvas = document.querySelector('canvas');
    // const {create_board, draw_background, draw_piece, draw_board} = get_board(canvas)
    // let board = create_board();
    // draw_background();
    // draw_board(board, 1)
    let board_drawer = new BoardDrawer(canvas,cell_size,shading_size)
    let board = new GameBoard(board_width,board_height,board_drawer)
    board.setup_board(0)

    const {on_click} = create_click_func(canvas,board)
    canvas.addEventListener('click', on_click);

})();