const BOARD_STRINGS = {
  names: {
    EMPTY: 'empty',
    PAWN: 'pawn',
    CASTLE: 'castle',
    BISHOP: 'bishop',
    HORSE: 'horse',
    QUEEN: 'queen',
    KING: 'king'
  },
  pieceColors: {
    BLACK: 'black',
    WHITE: 'white',
    NONE: 'empty'
  },
  tintColors: {
    RED: 'red',
    BLUE: 'blue',
    GOLD: 'gold'
  },
  squareColors: {
    BLACK: 'black',
    WHITE: 'white',

    NONE: 'none'
  },
  actions: {
    SELECT: 'select',
    MOVE: 'move'
  },
  directions: {
    UP_LEFT: 'up_left',
    UP_RIGHT: 'up_right',
    DOWN_RIGHT: 'down_right',
    DOWN_LEFT: 'down_left',
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
  }

}

export default BOARD_STRINGS
