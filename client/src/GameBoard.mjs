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
        this.going_first = -1;
        this.players_turn = -1;
        this.game_over = Boolean(0);
        this.winner = -1;
    }

    compare_list(a, b)
    {
        return (JSON.stringify(a) === JSON.stringify(b));
    }

    in_list(list, x, compare_func = null)
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
        } else
        {
            for (const value of list)
            {
                if (compare_func(x, value))
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
        this.going_first = going_first;
        this.players_turn = going_first;
        this.board = [];
        for (let y = 0; y < this.height; y++)
        {
            this.board[y] = [];
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
        this.board_drawer.draw_board(this, this.going_first);
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

        //reverses direction based on the piece's owner
        let direction_modifier = ((this.board[y][x]['owner'] == 1) ? -1 : 1);

        let positions = [];

        switch (piece_no)
        {
            case 0:
                break;

            case 1:
                positions = this.get_1_moves(x, y, owner, direction_modifier);
                break;
            case 2:
                positions = this.get_2_moves(x, y, owner, direction_modifier);
                break;
            case 3:
                positions = this.get_3_moves(x, y, owner, direction_modifier);
                break;
            case 4:
                positions = this.get_4_moves(x, y, owner, direction_modifier);
                break;
            case 5:
                positions = this.get_5_moves(x, y, owner, direction_modifier);
                break;
            case 6:
                positions = this.get_6_moves(x, y, owner, direction_modifier)
        }
        return positions;
    }

    get_1_moves(x, y, owner, direction_modifier)
    {
        let adjustment = [[0, -1], [0, 1], [0, 2]];
        let positions = [];
        let new_x, new_y;

        new_x = x + adjustment[0][0] * direction_modifier;
        new_y = new_y = y + adjustment[0][1] * direction_modifier;
        if (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
        {
            positions.push([new_x, new_y]);
        }

        new_x = x + adjustment[1][0] * direction_modifier;
        new_y = new_y = y + adjustment[1][1] * direction_modifier;
        if (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
        {
            positions.push([new_x, new_y]);
        }

        //prevents piece from jumping over other pieces
        if (this.board[new_y][new_x]['owner'] != -1)
        {
            return positions;
        }

        new_x = x + adjustment[2][0] * direction_modifier;
        new_y = new_y = y + adjustment[2][1] * direction_modifier;
        if (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
        {
            positions.push([new_x, new_y]);
        }

        return positions
    }

    get_2_moves(x, y, owner, direction_modifier)
    {
        let adjustment = [[0, -1], [1, 1], [-1, 1]];

        let positions = [];
        let new_x, new_y;
        for (const offset of adjustment)
        {
            new_x = x + offset[0] * direction_modifier;
            new_y = y + offset[1] * direction_modifier;
            if (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
            {
                positions.push([new_x, new_y]);
            }
        }
        return positions;
    }

    get_3_moves(x, y, owner, direction_modifier)
    {
        let adjustment = [[1, 1], [0, 1], [-1, 1], [1, 0], [-1, 0], [1, -1], [0, -1], [-1, -1]];

        let positions = [];
        let new_x, new_y;

        for (const offset of adjustment)
        {
            new_x = x + offset[0] * direction_modifier;
            new_y = y + offset[1] * direction_modifier;
            if (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
            {
                positions.push([new_x, new_y]);
            }
        }
        return positions
    }

    get_4_moves(x, y, owner, direction_modifier)
    {
        let positions;
        positions = [];

        let offset_x, offset_y, new_x, new_y, was_not_empty;

        offset_x = 0;
        offset_y = 1;
        new_x = x + offset_x * direction_modifier;
        new_y = y + offset_y * direction_modifier;
        while (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
        {
            //break if piece is blocking path
            if (this.board[new_y][new_x]['owner'] != -1 && was_not_empty)
            {
                break;
            }
            positions.push([new_x, new_y]);
            was_not_empty = this.board[new_y][new_x]['owner'] != -1
            offset_y += 1;
            new_y = y + offset_y * direction_modifier;

        }

        offset_x = 0;
        offset_y = -1;
        new_x = x + offset_x * direction_modifier;
        new_y = y + offset_y * direction_modifier;
        while (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
        {
            if (this.board[new_y][new_x]['owner'] != -1 && was_not_empty)
            {
                break;
            }
            positions.push([new_x, new_y]);
            was_not_empty = this.board[new_y][new_x]['owner'] != -1
            offset_y -= 1;
            new_y = y + offset_y * direction_modifier;

        }

        offset_x = 1;
        offset_y = 0;
        new_x = x + offset_x * direction_modifier;
        new_y = y + offset_y * direction_modifier;
        while (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
        {

            if (this.board[new_y][new_x]['owner'] != -1 && was_not_empty)
            {
                break;
            }

            positions.push([new_x, new_y]);
            was_not_empty = this.board[new_y][new_x]['owner'] != -1
            offset_x -= 1;
            new_x = x + offset_x * direction_modifier;
        }

        offset_x = -1;
        offset_y = 0;
        new_x = x + offset_x * direction_modifier;
        new_y = y + offset_y * direction_modifier;
        while (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
        {
            if (this.board[new_y][new_x]['owner'] != -1 && was_not_empty)
            {
                break;
            }

            positions.push([new_x, new_y]);
            was_not_empty = this.board[new_y][new_x]['owner'] != -1
            offset_x -= 1;
            new_x = x + offset_x * direction_modifier;
        }

        return positions;
    }

    get_5_moves(x, y, owner, direction_modifier)
    {
        let positions;
        positions = [];

        let offset_x, offset_y, new_x, new_y, was_not_empty;

        offset_x = 1;
        offset_y = 1;
        new_x = x + offset_x * direction_modifier;
        new_y = y + offset_y * direction_modifier;
        while (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
        {
            //break if piece is blocking path
            if (this.board[new_y][new_x]['owner'] != -1 && was_not_empty)
            {
                break;
            }
            positions.push([new_x, new_y]);
            was_not_empty = this.board[new_y][new_x]['owner'] != -1
            offset_x += 1;
            offset_y += 1;
            new_x = x + offset_x * direction_modifier;
            new_y = y + offset_y * direction_modifier;

        }

        offset_x = 1;
        offset_y = -1;
        new_x = x + offset_x * direction_modifier;
        new_y = y + offset_y * direction_modifier;
        while (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
        {
            if (this.board[new_y][new_x]['owner'] != -1 && was_not_empty)
            {
                break;
            }
            positions.push([new_x, new_y]);
            was_not_empty = this.board[new_y][new_x]['owner'] != -1
            offset_x += 1;
            offset_y -= 1;
            new_x = x + offset_x * direction_modifier;
            new_y = y + offset_y * direction_modifier;

        }

        offset_x = -1;
        offset_y = 1;
        new_x = x + offset_x * direction_modifier;
        new_y = y + offset_y * direction_modifier;
        while (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
        {

            if (this.board[new_y][new_x]['owner'] != -1 && was_not_empty)
            {
                break;
            }

            positions.push([new_x, new_y]);
            was_not_empty = this.board[new_y][new_x]['owner'] != -1
            offset_x -= 1;
            offset_y += 1;
            new_x = x + offset_x * direction_modifier;
            new_y = y + offset_y * direction_modifier;
        }

        offset_x = -1;
        offset_y = -1;
        new_x = x + offset_x * direction_modifier;
        new_y = y + offset_y * direction_modifier;
        while (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
        {
            if (this.board[new_y][new_x]['owner'] != -1 && was_not_empty)
            {
                break;
            }

            positions.push([new_x, new_y]);
            was_not_empty = this.board[new_y][new_x]['owner'] != -1
            offset_x -= 1;
            offset_y -= 1;
            new_x = x + offset_x * direction_modifier;
            new_y = y + offset_y * direction_modifier;
        }

        return positions;
    }

    get_6_moves(x, y, owner, direction_modifier)
    {
        let adjustment = [[0, 1], [1, -1], [0, -1], [-1, -1], [1, -2], [0, -2], [-1, -2]];

        let positions = [];
        let new_x, new_y;

        for (const offset of adjustment)
        {
            new_x = x + offset[0] * direction_modifier;
            new_y = y + offset[1] * direction_modifier;
            if (this.is_in_bounds(new_x, new_y) && this.board[new_y][new_x]['owner'] != owner)
            {
                positions.push([new_x, new_y]);
            }
        }
        return positions
    }

    select_piece(x, y)
    {
        if (this.board[y][x]['owner'] != this.players_turn)
        {
            return;
        }
        this.piece_selected = 1;
        this.selected_piece_x = x;
        this.selected_piece_y = y;
        this.highlight_moves(x, y);
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
        this.moves = this.get_allowed_moves(x, y);
        this.board_drawer.highlight_moves(this, this.moves);
    }

    move_piece(to_x, to_y)
    {
        if (this.selected_piece_y == -1 || this.selected_piece_x == -1)
        {
            throw 'No piece is selected';
        }
        let piece_num = this.board[to_y][to_x]['piece_no'];
        this.board[to_y][to_x] = this.board[this.selected_piece_y][this.selected_piece_x];
        this.board[this.selected_piece_y][this.selected_piece_x] = {piece_no: 0, owner: -1};
        console.log(`${this.board[to_y][to_x]['piece_no']}`);
        if (piece_num != 0)
        {
            this.board[to_y][to_x]['piece_no'] += 1;
        }
        this.game_over = (this.board[to_y][to_x]['piece_no'] === 7);
        if (this.game_over)
        {
            this.winner = this.board[to_y][to_x]['owner'];
        }
        this.deselect();
        this.players_turn = ((this.players_turn == 1) ? 0 : 1);
    }

    in_highlighted_moves(x, y)
    {
        return this.in_list(this.moves, [x, y], this.compare_list);
    }

    redraw()
    {
        this.board_drawer.draw_board(this);
    }

}