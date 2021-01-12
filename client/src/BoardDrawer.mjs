export default class BoardDrawer
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
        if (number != 0)
        {
            this.ctx.fillStyle = 'white';
            this.ctx.font = "60px Arial";
            this.ctx.fillText(number, x * this.cell_size + 27, y * this.cell_size + this.cell_size - 13);
        }

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

    draw_board(game_board)
    {
        let board = game_board.board;
        this.draw_background(game_board.width,game_board.height);
        for (let y = 0; y < game_board.height; y++)
        {
            for (let x = 0; x < game_board.width; x++)
            {
                if (board[y][x]['owner'] != -1)
                {
                    if (game_board.going_first)
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

    highlight_moves(game_board,positions)
    {
        console.log('')
        let board = game_board.board
        for (const position of positions)
        {
            let square = board[position[1]][position[0]]

            if (game_board.going_first == 1)
            {
                console.log(`Square owner: ${square['owner']}`)
                switch (square['owner'])
                {
                    case 0:
                        this.draw_piece(position[0],position[1],square['piece_no'], 'MediumSeaGreen');
                        break;
                    case 1:
                        this.draw_piece(position[0],position[1],square['piece_no'], 'IndianRed');
                        break
                    case -1:
                        this.draw_piece(position[0],position[1],square['piece_no'], 'lightblue');
                        break;
                }

            } else
            {
                switch (square['owner'])
                {
                    case 0:
                        this.draw_piece(position[0],position[1],square['piece_no'], 'MediumSeaGreen');
                        break;
                    case 1:
                        this.draw_piece(position[0],position[1],square['piece_no'], 'IndianRed');
                        break;
                    case -1:
                        this.draw_piece(position[0],position[1],square['piece_no'], 'lightblue');
                        break;
                }
            }

        }

    }

}