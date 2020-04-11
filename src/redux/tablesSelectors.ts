export const selectTableById = (tableId: string) => (state: any) => state.tables.byId[tableId];

export const selectJoinedTable = (state: any) => state.tables.byId[state.tables.activeTableId];

export const selectJoinedTableId = (state: any) => {
  const joinedTable = selectJoinedTable(state);
  return joinedTable ? joinedTable.tableId : null;
}

export const selectJoinedTableSeat = (userId: string) => (state: any) => {
  const joinedTable = selectJoinedTable(state);
  const seats = joinedTable ? joinedTable.seats : [];
  return seats.findIndex((seat: any) => seat && seat.userId === userId);
}
