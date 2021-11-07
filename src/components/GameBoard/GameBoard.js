import { useState } from 'react'
import './GameBoard.scss'
import { getDefaultStartBoard } from '../../utility/board-setups'
import { select, move, isCheck, canMove } from  '../../utility/click-control'
import BOARD_STRINGS from '../../constants/board-strings'

const GameBoard = () => {

  const { SELECT, MOVE } = BOARD_STRINGS.actions
  const { WHITE, BLACK } = BOARD_STRINGS.pieceColors

  const [board, setBoard] = useState(getDefaultStartBoard)
  const [prevBoard, setPrevBoard] = useState(getDefaultStartBoard)
  const [action, setAction] = useState(SELECT)
  const [currentTurn, setCurrentTurn] = useState(WHITE)
  const [selectedSquare, setSelectedSquare] = useState()

  const handleSquareClick = (square) => {
    switch (action) {
      case (SELECT):
        if (square.props.pieceColor === currentTurn) {
          setPrevBoard(board)
          setAction(MOVE)
          setSelectedSquare({ row: square.props.row, column: square.props.column })
          setBoard(select(square.props.row, square.props.column, board, currentTurn))
        }
        break
      case (MOVE):
        const { GOLD } = BOARD_STRINGS.tintColors
        if (square.props.tint !== undefined) {
          setBoard(move(
            selectedSquare,
            { row: square.props.row, column: square.props.column },
            prevBoard,
            square.props.tint === GOLD))
          setCurrentTurn(currentTurn === WHITE ? BLACK : WHITE)
        } else
          setBoard(prevBoard)
        setAction(SELECT)
        break
      default:
        break
    }
  }

  return (
    <div className={'game-board__container'}>
      {currentTurn}{' '}{action}{'; '}
      {(isCheck(board, currentTurn) &&
          (
              (
                  <span style={{'color': 'lime'}}>
                    CHECK
                  </span>
              ) || (
                  !canMove(board, currentTurn) &&
                  (
                      <span style={{'color': 'red'}}>
                        MATE
                      </span>
                  )
              )
          )
      ) || (!canMove(board, currentTurn) && (
          <span style={{'color': 'yellow'}}>
            STALEMATE
          </span>
          )
      )}
      <div className={'game-board__grid'}>
        {board.map((boardRow) => (
          <div className={'game-board__row'}>
            {boardRow.map((square) => (
              <div className={'game-board__square'} onClick={() => {handleSquareClick(square)}}>
                {square}
              </div>
            ))}
          </div>
          )
        )}
      </div>
    </div>
  )
}

export default GameBoard
