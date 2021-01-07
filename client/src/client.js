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

const create_click_func = (canvas,game_board,board_drawer) =>
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
            if (game_board.board[piece_y][piece_x]['owner'] == 1 || game_board.board[piece_y][piece_x]['owner'] == 0)
            {
                let moves = game_board.get_allowed_moves(piece_x,piece_y)
            }
        }
        // sock.emit('turn', getCellCoordinates(x, y));
    };

    return {on_click}
}

class BoardDrawer
{

    constructor(canvas, cell_size, shading_size)
    {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d');
        this.cell_size = cell_size;
        this.shading_size = shading_size;
        this.border_size = this.cell_size - this.shading_size;

    }

    draw_piece(x, y, number, cell_color)
    {
        this.ctx.fillStyle = cell_color;
        this.ctx.fillRect(x * this.cell_size + this.border_size, y * this.cell_size + this.border_size, this.shading_size, this.shading_size);
        this.ctx.fillStyle = 'white';
        this.ctx.font = "60px Arial";
        this.ctx.fillText(number, x * this.cell_size + 27, y * this.cell_size + this.cell_size - 13);
    }

    draw_background(width,height)
    {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let y = 0; y < height; y++)
        {
            for (let x = 0; x < width; x++)
            {
                if (((y * width + x + y) % 2) == 0)
                {
                    this.ctx.fillStyle = 'darkgrey';
                } else
                {
                    this.ctx.fillStyle = 'grey';
                }
                this.ctx.fillRect(x * this.cell_size + this.border_size, y * this.cell_size + this.border_size, this.shading_size, this.shading_size);
            }
        }
    }

    draw_board(game_board, going_first)
    {
        let board = game_board.board;
        this.draw_background(game_board.width,game_board.height);
        for (let y = 0; y < game_board.height; y++)
        {
            for (let x = 0; x < game_board.width; x++)
            {
                if (board[y][x]['owner'] != -1)
                {
                    if (going_first)
                    {
                        if (board[y][x]['owner'] == 1)
                        {
                            this.draw_piece(x, y, board[y][x]['piece_no'], 'red');
                        } else
                        {
                            this.draw_piece(x, y, board[y][x]['piece_no'], 'green');
                        }
                    } else
                    {
                        if (board[y][x]['owner'] == 1)
                        {
                            this.draw_piece(x, y, board[y][x]['piece_no'], 'green');
                        } else
                        {
                            this.draw_piece(x, y, board[y][x]['piece_no'], 'red');
                        }
                    }

                }
            }
        }
    }

    highlight_moves(moves, game_board)
    {


    }

}


class GameBoard
{
    player_layout = [[1, 2, 1, 3, 2, 1], [3, 4, 2, 5, 4, 3]];
    opponent_layout = [[3, 4, 5, 2, 4, 3], [1, 2, 3, 1, 2, 1]];

    constructor(board_width, board_height)
    {
        this.width = board_width;
        this.height = board_height;
        this.board = [];
        this.reset_board();
    }

    reset_board()
    {
        this.board = [];
        for (let y = 0; y < this.height; y++)
        {
            this.board[y] = []
            for (let x = 0; x < this.width; x++)
            {
                if (y < this.opponent_layout.length)
                {
                    this.board[y][x] = {piece_no: this.opponent_layout[y][x], owner: 0};
                } else if (y >= this.height - this.player_layout.length)
                {
                    this.board[y][x] = {piece_no: this.player_layout[y - (this.height - this.player_layout.length)][x], owner: 1};
                } else
                {
                    this.board[y][x] = {piece_no: 0, owner: -1};
                }
            }
        }
    }

    is_in_bounds(x, y)
    {
        return (x < 0 || y < 0 || x >= board_width || y >= board_height);
    }

    get_allowed_moves(x, y)
    {
        if (this.board[y][x]['owner'] == -1)
        {
            throw `Board position ${x},${y} has no owner`;
        }
        let piece_no = this.board[y][x]['piece_no'];
        let owner = this.board[y][x]['owner'];
        //reverses direction based on piece owner
        let direction_modifier = ((this.board[y][x]['owner'] == 1) ? -1 : 1);
        let positions = [];
        switch (piece_no)
        {
            case 0:
                break;

            case 1:
                const adjustment = [[0, -1], [0, 1], [0, 2]];
                for (const offset of adjustment)
                {
                    let new_x = x + offset[0] * direction_modifier;
                    let new_y = y + offset[1] * direction_modifier;
                    if (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
                    {
                        positions.push([new_x, new_y]);
                    }
                }
                break;
        }
        return positions;
    }


}

// // contains board drawing/logic
// const get_board = (canvas) =>
// {
//
//
//       const
//
//     // highlight color 'palegoldenrod'
//     const highlight_moves = (x, y, board) =>
//     {
//
//
//     }
//
//
//     return {create_board, draw_background, draw_piece, draw_board};
// };


(() =>
{


    const sock = io();
    sock.on('msg', console.log)
    const canvas = document.querySelector('canvas');
    // const {create_board, draw_background, draw_piece, draw_board} = get_board(canvas)
    // let board = create_board();
    // draw_background();
    // draw_board(board, 1)
    let board = new GameBoard(board_width,board_height)
    let board_drawer = new BoardDrawer(canvas,cell_size,shading_size)
    board_drawer.draw_board(board,1)
    const {on_click} = create_click_func(canvas,board,board_drawer)
    canvas.addEventListener('click', on_click);

})();