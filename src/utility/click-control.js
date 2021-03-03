import makeSquare from './make-square'
import BOARD_STRINGS from "../constants/board-strings";

const select = (row, column, board, currentTurn) => {

  let newBoard = []
  board.map((boardRow) => {
    return newBoard.push(boardRow.slice())
  })

  const { UP_LEFT, UP_RIGHT, DOWN_RIGHT, DOWN_LEFT, UP, DOWN, LEFT, RIGHT } = BOARD_STRINGS.directions
  const { BLUE, RED, GOLD } = BOARD_STRINGS.tintColors
  const { WHITE, BLACK, NONE } = BOARD_STRINGS.pieceColors

  const checkCheck = () => {

  }

  const moveOneBlock = (x, y, direction) => {

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
        newBoard[y][x] = makeSquare(
          true,
          y + 1,
          x + 1,
          newBoard[y][x].props.coveringPiece,
          newBoard[y][x].props.pieceColor,
          BLUE
        )
        return {
          flag: true,
          x: x,
          y: y
        }
      default:
        newBoard[y][x] = makeSquare(
          true,
          y + 1,
          x + 1,
          newBoard[y][x].props.coveringPiece,
          newBoard[y][x].props.pieceColor,
          RED
        )
        return {
          flag: false,
          x: x,
          y: y
        }
    }

  }

  const moveContinuous = (directions) => {
    directions.map((direction) => {
      let x = column - 1
      let y = row - 1
      let flag = true
      while (flag === true){
        const results = moveOneBlock(x, y, direction)
        flag = results.flag
        x = results.x
        y = results.y
      }
      return []
    })
  }

  const getOppositeColor = (pieceColor) => {
    return pieceColor === WHITE ? BLACK : WHITE
  }

  const movePawn = () => {
    const x = column - 1
    let y = row - 1
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
      newBoard[y][x] = makeSquare(
        true,
        y + 1,
        x + 1,
        newBoard[y][x].props.coveringPiece,
        newBoard[y][x].props.pieceColor,
        BLUE
      )
      const startRow = currentTurn === WHITE ? 2 : 7
      const twoBlockJump = currentTurn === WHITE ? 1 : -1
      if (row === startRow &&
        newBoard[y + twoBlockJump][x].props.coveringPiece === BOARD_STRINGS.names.EMPTY) {
        newBoard[y + twoBlockJump][x] = makeSquare(
          true,
          y + twoBlockJump + 1,
          x + 1,
          newBoard[y + twoBlockJump][x].props.coveringPiece,
          newBoard[y + twoBlockJump][x].props.pieceColor,
          BLUE
        )
      }
    }
    const pawnSideChecks = [-1, 1]
    pawnSideChecks.map((displacement) => {
      const newX = x + displacement
      if (newX >= 0 && newX < 8 && newBoard[y][newX].props.pieceColor === getOppositeColor(currentTurn)) {
        newBoard[y][newX] = makeSquare(
          true,
          y + 1,
          newX + 1,
          newBoard[y][newX].props.coveringPiece,
          newBoard[y][newX].props.pieceColor,
          RED
        )
      }
      return []
    })
  }
  const moveCastle = () => {
    moveContinuous([UP, RIGHT, DOWN, LEFT])
  }
  const moveHorse = () => {
    let displacements = [[1, 2], [1, -2], [-1, 2], [-1, -2] , [2, 1,],  [2, -1], [-2, 1], [-2, -1]]
    displacements.map((displacementPair) => {
      const x = displacementPair[0] + column - 1
      const y = displacementPair[1] + row - 1
      if (x >= 0 && x < 8 && y >= 0 && y < 8)
        switch (newBoard[y][x].props.pieceColor){
          case (NONE):
            newBoard[y][x] = makeSquare(
              true,
              y + 1,
              x + 1,
              newBoard[y][x].props.coveringPiece,
              newBoard[y][x].props.pieceColor,
              BLUE
            )
            break
          case (currentTurn):
            break
          default:
            newBoard[y][x] = makeSquare(
              true,
              y + 1,
              x + 1,
              newBoard[y][x].props.coveringPiece,
              newBoard[y][x].props.pieceColor,
              RED
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
  const moveKing = () => {
    Object.values(BOARD_STRINGS.directions).map((direction) => {
      return moveOneBlock(column - 1, row - 1, direction)
    })
    let y = row - 1
    let x = column - 1
    if (
      newBoard[y][x].props.originalSquare &&
      newBoard[y][x + 1].props.coveringPiece === NONE &&
      newBoard[y][x + 2].props.coveringPiece === NONE &&
      newBoard[y][x + 3].props.originalSquare
    ) {
      newBoard[y][x + 2] = makeSquare(
        true,
        y + 1,
        x + 3,
        newBoard[y][x + 2].props.coveringPiece,
        newBoard[y][x + 2].props.pieceColor,
        GOLD
      )
    }
    if (
      newBoard[y][x].props.originalSquare &&
      newBoard[y][x - 1].props.coveringPiece === NONE &&
      newBoard[y][x - 2].props.coveringPiece === NONE &&
      newBoard[y][x - 3].props.coveringPiece === NONE &&
      newBoard[y][x - 4].props.originalSquare
    ) {
      newBoard[y][x - 3] = makeSquare(
        true,
        y + 1,
        x - 2,
        newBoard[y][x - 3].props.coveringPiece,
        newBoard[y][x - 3].props.pieceColor,
        GOLD
      )
    }
  }

  const { names } = BOARD_STRINGS

  switch (board[row - 1][column - 1].props.coveringPiece) {
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
    newBoard[yFinal][xFinal] = makeSquare(
      false,
      yFinal + 1,
      xFinal + 1,
      board[yInitial][xInitial].props.coveringPiece,
      board[yInitial][xInitial].props.pieceColor
    )
    newBoard[yInitial][xInitial] = makeSquare(
      false,
      yInitial + 1,
      xInitial + 1
    )
  }

  const yInitial = positionInitial.row - 1
  const yFinal = positionFinal.row - 1
  const xInitial = positionInitial.column - 1
  const xFinal = positionFinal.column - 1

  if (isGold) {
    const castleXPositions = xFinal === 6 ? [7, 5] : [0, 2]
    movePiece(yInitial, yFinal, castleXPositions[0], castleXPositions[1])
  }

  movePiece(yInitial, yFinal, xInitial, xFinal)

  return newBoard

}

export { select, move }
