import Square from '../components/Square'

const makeSquare = (originalSquare, row, column, coveringPiece, pieceColor, tint) => {
  return <Square
    originalSquare={originalSquare}
    row={row}
    column={column}
    coveringPiece={coveringPiece}
    pieceColor={pieceColor}
    tint={tint}
    key={row.toString() + column.toString()}
  />
}

export default makeSquare
