import { TableType, SeatType } from '../types';
import { U_SHAPE_TABLE_END_SEAT_LENGTH } from '../Table';

export function getTableGrid(table: TableType): Array<Array<SeatType|null>> {
  switch (table.shape) {
    case 'U_UP':
    case 'U_DOWN': {
      return getCouchTableGrid(table, U_SHAPE_TABLE_END_SEAT_LENGTH);
    }
    case 'DANCE_FLOOR': {
      return getDanceFloorGrid(table);
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

function getDanceFloorGrid(table: TableType): Array<Array<SeatType|null>> {
  const factors: Array<number> = (
    (number: number) => Array
      .from(Array(number + 1), (_, i) => i)
      .filter(i => number % i === 0)
  )(table.seats.length);
  const numRows = Math.floor(factors.length / 2);
  const numCols = table.seats.length / numRows;
  console.log(numRows, numCols, table.seats.length);

  const grid = [];
  for (let x = 0; x < numRows; x++) {
    const row = [];
    for (let y = 0; y < numCols; y++) {
      const seat = table.seats[x * numCols + y];
      if (seat.userId) {
        row.push(seat);
      } else {
        row.push(null);
      }
    }
    grid.push(row);
  }

  return grid;
}
