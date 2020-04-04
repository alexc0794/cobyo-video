import { TableType, SeatType } from '../types';
import { U_SHAPE_TABLE_END_SEAT_LENGTH } from '../Table';

export function getTableGrid(table: TableType): Array<Array<SeatType|null>> {
  switch (table.shape) {
    case 'U_UP':
    case 'U_DOWN': {
      return getCouchTableGrid(table, U_SHAPE_TABLE_END_SEAT_LENGTH);
    }
    default:
      return getRectangularTableGrid(table);
  }
}

function getCouchTableGrid(table: TableType, tableEndSeatLength: number): Array<Array<SeatType|null>> {
  const mainRow = table.seats.slice(tableEndSeatLength, table.seats.length - tableEndSeatLength);
  const grid: Array<Array<SeatType|null>> = [];
  if (table.shape === 'U_UP') {
    for (let i = 0; i < tableEndSeatLength; i++) {
      const firstEndSeat = table.seats[i];
      const lastEndSeat = table.seats[table.seats.length - 1 - i];
      const row = [firstEndSeat, ...new Array(mainRow.length - 2).fill(null), lastEndSeat];
      grid.push(row);
    }
    grid.push(mainRow);
  } else if (table.shape === 'U_DOWN') {
    grid.push(mainRow);
    for (let i = 0; i < tableEndSeatLength; i++) {
      const firstEndSeat = table.seats[tableEndSeatLength - 1 - i];
      const lastEndSeat = table.seats[table.seats.length - tableEndSeatLength + i];
      const row = [firstEndSeat, ...new Array(mainRow.length - 2).fill(null), lastEndSeat];
      grid.push(row);
    }
  }

  return grid;
}

function getRectangularTableGrid(table: TableType): Array<Array<SeatType|null>> {
  const totalLength = table.seats.length;
  const mid = totalLength / 2;
  return [table.seats.slice(0, mid), table.seats.slice(mid, totalLength)];
}


export function getTableRows(table: TableType, userId: string) {
  const rowSize = table.seats.length - 1;
  const seat = table.seats.findIndex(seat => seat && seat.userId === userId);
  const opposingRowSeats = removeNullsOnEnd(getOpposingRowSeats(seat, table.seats.length, rowSize));
  const sameRowSeats = removeNullsOnEnd(getSameRowSeats(seat, table.seats.length, rowSize));
  return [
    opposingRowSeats.map(seatNumber => seatNumber !== null ? table.seats[seatNumber] : null),
    sameRowSeats.map(seatNumber => seatNumber !== null ? table.seats[seatNumber] : null),
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
