import './PieceImage.scss'
import IMAGE_PATHS from "../../constants/image-paths";
import BOARD_STRINGS from "../../constants/board-strings";

const PieceImage = ({piece, color}) => {

  return (
    <div className={'piece-image__container'}>
      <img
        src={IMAGE_PATHS.pieces[piece]}
        alt={piece} className={color === BOARD_STRINGS.pieceColors.BLACK ? 'piece-image__black' : 'piece-image__white'} />
    </div>
  )
}

export default PieceImage
