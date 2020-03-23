
export function getOpposingRowSeats(fromSeat: number, numSeats: number, rowSize: number): Array<number|null> {
  const seats = [];
  const halfNumSeats = numSeats / 2;
  const inTopRow = fromSeat < halfNumSeats; // Top row is represented by first half of seats
  const minIndex = inTopRow ? halfNumSeats : 0;
  const maxIndex = inTopRow ? numSeats - 1 : halfNumSeats - 1;

  const startIndex = fromSeat + ((halfNumSeats + ((rowSize - 1) / 2)) * (inTopRow ? 1 : -1))
  const endIndex = fromSeat + ((halfNumSeats - (rowSize / 2)) * (inTopRow ? 1 : -1));
  for (let i = startIndex; (inTopRow ? i > endIndex :  i < endIndex); inTopRow ? i-- : i++) {
    if (i < minIndex || i > maxIndex) {
      seats.push(null);
    } else {
      seats.push(i);
    }
  }
  return seats;
}

export function getSameRowSeats(fromSeat: number, numSeats: number, rowSize: number): Array<number|null> {
  const seats = [];
  const halfNumSeats = numSeats / 2;
  const inTopRow = fromSeat < halfNumSeats; // Top row is represented by first half of seats
  const minIndex = inTopRow ? 0 : halfNumSeats;
  const maxIndex = inTopRow ? halfNumSeats - 1 : numSeats - 1;

  const startIndex = fromSeat + ((rowSize - 1) / 2) * (inTopRow ? 1 : -1);
  const endIndex = fromSeat + (-1 * (rowSize - 1) / 2) * (inTopRow ? 1 : -1);
  for (let i = startIndex; (inTopRow ? i >= endIndex : i <= endIndex); (inTopRow ? i-- : i++)) {
    if (i < minIndex || i > maxIndex) {
      seats.push(null);
    } else {
      seats.push(i);
    }
  }
  return seats;
}
