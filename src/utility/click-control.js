import makeSquare from './make-square'
import BOARD_STRINGS from '../constants/board-strings'

const getOppositeColor = (pieceColor) => {
  return pieceColor === BOARD_STRINGS.pieceColors.WHITE ?
      BOARD_STRINGS.pieceColors.BLACK :
      BOARD_STRINGS.pieceColors.WHITE
}

const isOnBoard = (x, y) => {
  return (x >= 0 && y >= 0 && x < 8 && y < 8)
}

const isCheck = (board = [], color) => {

  let simpleBoard = []
  let kingPosition = {}

  for (let i = 0; i < 8; i++) {
    let row = []
    for (let j = 0; j < 8; j++) {
      row.push({
        type: board[i][j].props.coveringPiece,
        color: board[i][j].props.pieceColor
      })
      if (board[i][j].props.coveringPiece === BOARD_STRINGS.names.KING && board[i][j].props.pieceColor === color)
        kingPosition = {
          x: j,
          y: i
        }
    }
    simpleBoard.push(row)
  }

  const { CASTLE, QUEEN, BISHOP, KING, EMPTY, PAWN } = BOARD_STRINGS.names

  // horse
  const horseDisplacements = [
      [1, -1],
      [2, -2]
  ]
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++)
      if (isOnBoard(horseDisplacements[0][kingPosition.x + i], horseDisplacements[0][kingPosition.y + j]) &&
          simpleBoard[horseDisplacements[0][kingPosition.y + j]][horseDisplacements[0][kingPosition.x + i]] !== EMPTY &&
          simpleBoard[horseDisplacements[0][kingPosition.y + j]][horseDisplacements[0][kingPosition.x + i]].color !==
          color &&
          simpleBoard[horseDisplacements[0][kingPosition.y + j]][horseDisplacements[0][kingPosition.x + i]].type ===
          BOARD_STRINGS.names.HORSE
      )
        return true

  // horizontal/vertical
  const crossPieces = [CASTLE, QUEEN]
  // up
  for (let i = kingPosition.y + 1; i < 8; i++)
    if (simpleBoard[i][kingPosition.x].type !== EMPTY &&
        simpleBoard[i][kingPosition.x].color !== color) {
      if (simpleBoard[i][kingPosition.x].type in crossPieces)
        return true
      break
    }
  // down
  for (let i = kingPosition.y - 1; i >= 0; i--)
    if (simpleBoard[i][kingPosition.x].type !== EMPTY &&
        simpleBoard[i][kingPosition.x].color !== color) {
      if (simpleBoard[i][kingPosition.x].type in crossPieces)
        return true
      break
    }
  // left
  for (let i = kingPosition.x - 1; i >= 0; i--)
    if (simpleBoard[kingPosition.y][i].type !== EMPTY &&
        simpleBoard[kingPosition.y][i].color !== color) {
      if (simpleBoard[kingPosition.y][i].type in crossPieces)
        return true
      break
    }
  // right
  for (let i = kingPosition.x + 1; i < 8; i++)
    if (simpleBoard[kingPosition.y][i].type !== EMPTY &&
        simpleBoard[kingPosition.y][i].color !== color) {
      if (simpleBoard[kingPosition.y][i].type in crossPieces)
        return true
      break
    }

  // diagonals
  const diagonalPieces = [QUEEN, BISHOP]
  // top right
  for (let i = kingPosition.x + 1, j = kingPosition.y + 1; isOnBoard(i, j); i++, j++) {
    if (simpleBoard[j][i].type !== EMPTY &&
        simpleBoard[j][i].color !== color) {
      if (simpleBoard[j][i].type in diagonalPieces)
        return true
      break
    }
  }
  // top left
  for (let i = kingPosition.x - 1, j = kingPosition.y + 1; isOnBoard(i, j); i--, j++) {
    if (simpleBoard[j][i].type !== EMPTY &&
        simpleBoard[j][i].color !== color) {
      if (simpleBoard[j][i].type in diagonalPieces)
        return true
      break
    }
  }
  // bottom right
  for (let i = kingPosition.x + 1, j = kingPosition.y - 1; isOnBoard(i, j); i++, j--) {
    if (simpleBoard[j][i].type !== EMPTY &&
        simpleBoard[j][i].color !== color) {
      if (simpleBoard[j][i].type in diagonalPieces)
        return true
      break
    }
  }
  // bottom left
  for (let i = kingPosition.x - 1, j = kingPosition.y - 1; isOnBoard(i, j); i--, j--) {
    if (simpleBoard[j][i].type !== EMPTY &&
        simpleBoard[j][i].color !== color) {
      if (simpleBoard[j][i].type in diagonalPieces)
        return true
      break
    }
  }

  // check for other king
  for (let i = -1; i <= 1; i++)
    for (let j = -1; j <= 1; j++)
      if (isOnBoard(i, j) && simpleBoard[i][j].type === KING && simpleBoard[i][j].color !== color)
        return true

  // check for pawn
  const pawnDirection = color === BOARD_STRINGS.pieceColors.WHITE ? 1 : -1
  if (isOnBoard(kingPosition.y + pawnDirection, kingPosition.x + 1) &&
      simpleBoard[kingPosition.y + pawnDirection][kingPosition.x + 1].type !== EMPTY &&
      simpleBoard[kingPosition.y + pawnDirection][kingPosition.x + 1].color !== color &&
      simpleBoard[kingPosition.y + pawnDirection][kingPosition.x + 1].type === PAWN)
    return true
  if (isOnBoard(kingPosition.y + pawnDirection, kingPosition.x - 1) &&
      simpleBoard[kingPosition.y + pawnDirection][kingPosition.x - 1].type !== EMPTY &&
      simpleBoard[kingPosition.y + pawnDirection][kingPosition.x - 1].color !== color &&
      simpleBoard[kingPosition.y + pawnDirection][kingPosition.x - 1].type === PAWN)
    return true

}

const synthesizeSquare = (originalSquare, row, column, coveringPiece, pieceColor, tint,
                          positionInitial, board) => {
  // make sure that the move does not result in check for the current player
  if (board !== undefined) {
    let newBoard = []
    board.map((boardRow) => {
      return newBoard.push(boardRow.slice())
    })
    newBoard = move(
        positionInitial,
        {row: row, column: column},
        newBoard,
        tint === BOARD_STRINGS.tintColors.GOLD
    )
    if (!isCheck(newBoard, pieceColor === 'black' ? 'black' : 'white'))
      return makeSquare(originalSquare, row, column, coveringPiece, pieceColor, tint)
  } else
    return makeSquare(originalSquare, row, column, coveringPiece, pieceColor, tint)
  return board[row][column]

}

const select = (row, column, board, currentTurn) => {

  let newBoard = []
  board.map((boardRow) => {
    return newBoard.push(boardRow.slice())
  })

  const { UP_LEFT, UP_RIGHT, DOWN_RIGHT, DOWN_LEFT, UP, DOWN, LEFT, RIGHT } = BOARD_STRINGS.directions
  const { BLUE, RED, GOLD } = BOARD_STRINGS.tintColors
  const { WHITE, BLACK, NONE } = BOARD_STRINGS.pieceColors
  const positionInitial = { row : row, column: column }

  const moveOneBlock = (x, y, direction) => {

    //const movingPiece = newBoard[y][x].props.coveringPiece

    // set x and y values of the block which is potentially being highlighted
    switch (direction) {
      case (UP_LEFT):
        x--
        y++
        break
      case (UP_RIGHT):
        x++
        y++
        break
      case (DOWN_RIGHT):
        x++
        y--
        break
      case (DOWN_LEFT):
        x--
        y--
        break
      case (UP):
        y++
        break
      case (DOWN):
        y--
        break
      case (LEFT):
        x--
        break
      case (RIGHT):
        x++
        break
      default:
        break
    }

    // check that the move is within the bounds of the board
    if (x < 0 || y < 0 || x >= 8 || y >= 8)
      return {
        flag: false,
        x: x,
        y: y
      }

    switch (newBoard[y][x].props.pieceColor) {
      case (currentTurn):
        return {
          flag: false,
          x: x,
          y: y
        }
      case (NONE):
        newBoard[y][x] = synthesizeSquare(
          true,
          y,
          x,
          newBoard[y][x].props.coveringPiece,
          newBoard[y][x].props.pieceColor === WHITE ? WHITE : BLACK,
          BLUE,
          positionInitial,
          board
        )
        return {
          flag: true,
          x: x,
          y: y
        }
      default:
        newBoard[y][x] = synthesizeSquare(
          true,
          y,
          x,
          newBoard[y][x].props.coveringPiece,
          newBoard[y][x].props.pieceColor === WHITE ? WHITE : BLACK,
          RED,
          positionInitial,
          board
        )
        return {
          flag: false,
          x: x,
          y: y
        }
    }

  }

  const moveContinuous = (directions, originalPiece) => {
    directions.map((direction) => {
      let x = column
      let y = row
      let flag = true
      while (flag === true){
        const results = moveOneBlock(x, y, direction, originalPiece)
        flag = results.flag
        x = results.x
        y = results.y
      }
      return []
    })
  }

  const movePawn = () => {
    const x = column
    let y = row
    switch (currentTurn) {
      case (WHITE):
          y++
        break
      case (BLACK):
          y--
        break
      default:
        break
    }
    if (newBoard[y][x].props.coveringPiece === BOARD_STRINGS.names.EMPTY) {
      newBoard[y][x] = synthesizeSquare(
        true,
        y,
        x,
        newBoard[y][x].props.coveringPiece,
        newBoard[y][x].props.pieceColor === WHITE ? WHITE : BLACK,
        BLUE,
        positionInitial,
        board
      )
      const startRow = currentTurn === WHITE ? 1 : 6
      const twoBlockJump = currentTurn === WHITE ? 1 : -1
      if (row === startRow &&
        newBoard[y + twoBlockJump][x].props.coveringPiece === BOARD_STRINGS.names.EMPTY) {
        newBoard[y + twoBlockJump][x] = synthesizeSquare(
          true,
          y + twoBlockJump,
          x,
          newBoard[y + twoBlockJump][x].props.coveringPiece,
          newBoard[y + twoBlockJump][x].props.pieceColor === WHITE ? WHITE : BLACK,
          BLUE,
          positionInitial,
          board
        )
      }
    }
    const pawnSideChecks = [-1, 1]
    pawnSideChecks.map((displacement) => {
      const newX = x + displacement
      if (newX >= 0 && newX < 8 && newBoard[y][newX].props.pieceColor === getOppositeColor(currentTurn)) {
        newBoard[y][newX] = synthesizeSquare(
          true,
          y,
          newX,
          newBoard[y][newX].props.coveringPiece,
          newBoard[y][newX].props.pieceColor === WHITE ? WHITE : BLACK,
          RED,
          positionInitial,
          board
        )
      }
      return []
    })
  }
  const moveCastle = (originalPiece) => {
    moveContinuous([UP, RIGHT, DOWN, LEFT], originalPiece)
  }
  const moveHorse = () => {
    let displacements = [[1, 2], [1, -2], [-1, 2], [-1, -2] , [2, 1,],  [2, -1], [-2, 1], [-2, -1]]
    displacements.map((displacementPair) => {
      const x = displacementPair[0] + column
      const y = displacementPair[1] + row
      if (x >= 0 && x < 8 && y >= 0 && y < 8)
        switch (newBoard[y][x].props.pieceColor){
          case (NONE):
            newBoard[y][x] = synthesizeSquare(
              true,
              y,
              x,
              newBoard[y][x].props.coveringPiece,
              newBoard[y][x].props.pieceColor === WHITE ? WHITE : BLACK,
              BLUE,
              positionInitial,
              board
            )
            break
          case (currentTurn):
            break
          default:
            newBoard[y][x] = synthesizeSquare(
              true,
              y,
              x,
              newBoard[y][x].props.coveringPiece,
              newBoard[y][x].props.pieceColor === WHITE ? WHITE : BLACK,
              RED,
              positionInitial,
              board
            )
            break
        }
      return []
    })
  }
  const moveBishop = () => {
    moveContinuous([UP_LEFT, UP_RIGHT, DOWN_RIGHT, DOWN_LEFT])
  }
  const moveQueen = () => {
    moveContinuous([UP_LEFT, UP_RIGHT, DOWN_RIGHT, DOWN_LEFT])
    moveContinuous([UP, RIGHT, DOWN, LEFT])
  }
  const moveKing = (originalPiece) => {

    Object.values(BOARD_STRINGS.directions).map((direction) => {
      return moveOneBlock(column, row, direction, originalPiece)
    })

    // castling
    let y = row
    let x = column
    if (
      newBoard[y][x].props.originalSquare &&
      newBoard[y][x + 1].props.coveringPiece === NONE &&
      newBoard[y][x + 2].props.coveringPiece === NONE &&
      newBoard[y][x + 3].props.originalSquare
    ) {
      newBoard[y][x + 2] = synthesizeSquare(
        true,
        y,
        x + 2,
        newBoard[y][x + 2].props.coveringPiece,
        newBoard[y][x + 2].props.pieceColor === WHITE ? WHITE : BLACK,
        GOLD,
        positionInitial,
        board
      )
    }
    if (
      newBoard[y][x].props.originalSquare &&
      newBoard[y][x - 1].props.coveringPiece === NONE &&
      newBoard[y][x - 2].props.coveringPiece === NONE &&
      newBoard[y][x - 3].props.coveringPiece === NONE &&
      newBoard[y][x - 4].props.originalSquare
    ) {
      newBoard[y][x - 3] = synthesizeSquare(
        true,
        y,
        x - 3,
        newBoard[y][x - 3].props.coveringPiece,
        newBoard[y][x - 3].props.pieceColor === WHITE ? WHITE : BLACK,
        GOLD,
        positionInitial,
        board
      )
    }

  }

  const { names } = BOARD_STRINGS

  switch (board[row][column].props.coveringPiece) {
    case (names.PAWN):
      movePawn()
      break
    case (names.CASTLE):
      moveCastle()
      break
    case (names.HORSE):
      moveHorse()
      break
    case (names.BISHOP):
      moveBishop()
      break
    case (names.QUEEN):
      moveQueen()
      break
    case (names.KING):
      moveKing()
      break
    default:
      break
  }

  return newBoard

}

const move = (positionInitial, positionFinal, board, isGold) => {

  let newBoard = []
  board.map((boardRow) => {
    return newBoard.push(boardRow.slice())
  })

  const movePiece = (yInitial, yFinal, xInitial, xFinal) => {
    newBoard[yFinal][xFinal] = synthesizeSquare(
      false,
      yFinal,
      xFinal,
      board[yInitial][xInitial].props.coveringPiece,
      board[yInitial][xInitial].props.pieceColor === 'white' ? 'white' : 'black'
    )
    newBoard[yInitial][xInitial] = synthesizeSquare(
      false,
      yInitial,
      xInitial
    )
  }

  const yInitial = positionInitial.row
  const yFinal = positionFinal.row
  const xInitial = positionInitial.column
  const xFinal = positionFinal.column

  if (isGold) {
    const castleXPositions = xFinal === 6 ? [7, 5] : [0, 2]
    movePiece(yInitial, yFinal, castleXPositions[0], castleXPositions[1])
  }

  movePiece(yInitial, yFinal, xInitial, xFinal)

  return newBoard

}

export { select, move }
