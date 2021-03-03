import './Square.scss'
import BOARD_STRINGS from '../../constants/board-strings'
import PieceImage from '../PieceImage'

const Square = ({ originalSquare, row, column, coveringPiece, pieceColor, tint }) => {

  const getColor = () => {
    const { BLACK, WHITE } = BOARD_STRINGS.squareColors
    return row % 2 === column % 2 ? {backgroundColor: BLACK} : {backgroundColor: WHITE}
  }

  const getTint = () => {
    return {backgroundColor: tint}
  }

  return (
    <div className={'square__container'} style={getColor()} >
      <div className={'square__tint'} style={getTint()} />
        {coveringPiece !== BOARD_STRINGS.names.EMPTY && (
            <PieceImage piece={coveringPiece} color={pieceColor} />
          )
        }
    </div>
  )
}

Square.defaultProps = {
  coveringPiece: BOARD_STRINGS.names.EMPTY,
  pieceColor: BOARD_STRINGS.pieceColors.NONE,
  squareColor: BOARD_STRINGS.squareColors.NONE
}

export default Square
