import { TableType } from '../types';

export function getTableRows(table: TableType, userId: string) {
  const rowSize = table.seats.length - 1;
  const seat = table.seats.findIndex(seat => seat && seat.userId === userId);
  const opposingRowSeats = removeNullsOnEnd(getOpposingRowSeats(seat, table.seats.length, rowSize));
  const sameRowSeats = removeNullsOnEnd(getSameRowSeats(seat, table.seats.length, rowSize));
  return [
    opposingRowSeats.map(seat => seat !== null ? table.seats[seat] : null),
    sameRowSeats.map(seat => seat !== null ? table.seats[seat] : null),
  ];
}

function removeNullsOnEnd(
  seats: Array<number|null>,
): Array<number|null> {
  const firstNonNullSeat = seats.findIndex(seat => seat !== null);
  const lastNonNullSeat = seats.length - 1 - seats.slice().reverse().findIndex(seat => seat !== null);

  return seats.slice(firstNonNullSeat, lastNonNullSeat + 1);
}

function getOpposingRowSeats(
  fromSeat: number,
  numSeats: number,
  rowSize: number,
): Array<number|null> {
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

function getSameRowSeats(
  fromSeat: number,
  numSeats: number,
  rowSize: number,
): Array<number|null> {
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
