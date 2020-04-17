import { TableType, SeatType, UserType } from 'src/types';
import { selectUserById } from 'src/users/selectors';

export const selectTableById = (tableId: string) => (state: any): TableType => state.tables.byId[tableId];

export const selectJoinedTable = (state: any): TableType => state.tables.byId[state.tables.activeTableId];

export const selectJoinedTableId = (state: any): string | null => {
  const joinedTable = selectJoinedTable(state);
  return joinedTable ? joinedTable.tableId : null;
}

export const selectJoinedTableSeat = (userId: string) => (state: any): number => {
  const joinedTable = selectJoinedTable(state);
  const seats: Array<SeatType> = joinedTable ? joinedTable.seats : [];
  const i: number = seats.findIndex((seat: SeatType) => seat.userId === userId);
  return i >= 0 ? seats[i].seatNumber : -1;
}

export const selectTableUsers = (tableId: string) => (state: any): Array<UserType> => {
  const table: TableType = selectTableById(tableId)(state);
  const userIds: Array<string | null> = table.seats.map((seat: SeatType) => seat.userId);
  const users: Array<UserType> = userIds.reduce((acc: Array<UserType>, userId: string | null) => {
    if (userId) {
      const user: UserType | null = selectUserById(userId)(state);
      if (user) {
        return [...acc, user];
      }
    }
    return acc;
  }, []);
  return users;
}
