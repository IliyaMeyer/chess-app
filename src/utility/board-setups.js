import BOARD_STRINGS from '../constants/board-strings'
import makeSquare from './make-square'

const boardSetups = () => {

  const createEmptyRow = (row) => {
    let boardRow = []
    for (let column = 0; column < 8; column++)
      boardRow.push(makeSquare(true, row, column))
    return boardRow
  }

  const getEmptyBoard = () => {

    let emptyBoard = []

    for (let row = 0; row < 8; row++) {
      emptyBoard.push(createEmptyRow(row))
    }

    return emptyBoard

  }

  const getDefaultStartBoard = () => {

    const { names } = BOARD_STRINGS
    const { BLACK, WHITE } = BOARD_STRINGS.pieceColors

    const createFirstRow = (pieceColor) => {
      const row = pieceColor === WHITE ? 0 : 7
      const pieces = [
        names.CASTLE,
        names.HORSE,
        names.BISHOP,
        names.QUEEN,
        names.KING,
        names.BISHOP,
        names.HORSE,
        names.CASTLE
      ]
      let boardRow = []
      for (let column = 0; column < 8; column++)
        boardRow.push(makeSquare(true, row, column, pieces[column], pieceColor))
      return boardRow
    }

    const createPawnRow = (pieceColor) => {
      const row = pieceColor === WHITE ? 1 : 6
      let boardRow = []
      for (let column = 0; column < 8; column++)
        boardRow.push(makeSquare(true, row, column, names.PAWN, pieceColor))
      return boardRow
    }

    let gameBoard = []

    gameBoard.push(createFirstRow(WHITE))
    gameBoard.push(createPawnRow(WHITE))
    for (let row = 2; row <= 5; row++)
      gameBoard.push(createEmptyRow(row))
    gameBoard.push(createPawnRow(BLACK))
    gameBoard.push(createFirstRow(BLACK))

    return gameBoard

  }

  return {
    getEmptyBoard: getEmptyBoard(),
    getDefaultStartBoard: getDefaultStartBoard()
  }

}

export default boardSetups
