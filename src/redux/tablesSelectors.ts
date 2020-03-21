export const selectTableById = (tableId: string) => (state: any) => state.tables.byId[tableId];

export const selectJoinedTable = (state: any) => state.tables.byId[state.tables.activeTableId];
