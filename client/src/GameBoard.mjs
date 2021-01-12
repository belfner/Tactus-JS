import BoardDrawer from "./BoardDrawer.mjs";

export default class GameBoard
{
    player_layout = [[1, 2, 1, 3, 2, 1], [3, 4, 2, 5, 4, 3]];
    opponent_layout = [[3, 4, 5, 2, 4, 3], [1, 2, 3, 1, 2, 1]];

    constructor(board_width, board_height, board_drawer)
    {
        this.width = board_width;
        this.height = board_height;
        this.board = [];
        this.board_drawer = board_drawer;
        this.selected_piece_x = -1;
        this.selected_piece_y = -1;
        this.piece_selected = 0;
        this.moves = [];
    }

    compare_list(a,b)
    {
        return (JSON.stringify(a) === JSON.stringify(b));
    }

    in_list(list,x,compare_func = null)
    {
        let match;
        if (compare_func == null)
        {
            for (const value of list)
            {
                if (x === value)
                {
                   return Boolean(1);
                }
            }
            return Boolean(0);
        }
        else
        {
            for (const value of list)
            {
                if (compare_func(x,value))
                {
                    return Boolean(1);
                }
            }
            return Boolean(0);
        }
    }

    setup_board(going_first)
    {
        this.reset_board(going_first);
    }

    reset_board(going_first)
    {
        this.set_going_first(going_first)
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
        this.board_drawer.draw_board(this,this.going_first)
    }

    set_going_first(value)
    {
        //1 if player is going first, 0 if opponent is going first
        this.going_first = value
    }

    is_in_bounds(x, y)
    {
        return !(x < 0 || y < 0 || x >= this.width || y >= this.height);
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

    select_piece(x,y)
    {
        this.piece_selected = 1;
        this.selected_piece_x = x;
        this.selected_piece_y = y;
        this.highlight_moves(x,y);
    }

    deselect()
    {
        this.piece_selected = 0;
        this.selected_piece_x = -1;
        this.selected_piece_y = -1;
        this.moves = [];
    }

    highlight_moves(x, y)
    {
        // console.log('Made it to line 274')
        this.moves = this.get_allowed_moves(x, y);
        this.board_drawer.highlight_moves(this,this.moves);
    }

    move_piece(to_x,to_y)
    {
        let piece_num = this.board[to_y][to_x]['piece_no'];
        this.board[to_y][to_x] = this.board[this.selected_piece_y][this.selected_piece_x];
        this.board[this.selected_piece_y][this.selected_piece_x] = {piece_no: 0, owner: -1};
        console.log(`${this.board[to_y][to_x]['piece_no']}`)
        if (piece_num != 0)
        {
            this.board[to_y][to_x]['piece_no'] +=  1;
        }
        this.deselect()

    }

    in_highlighted_moves(x,y)
    {
        return this.in_list(this.moves,[x,y],this.compare_list)
    }

    redraw()
    {
        this.board_drawer.draw_board(this)
    }

}