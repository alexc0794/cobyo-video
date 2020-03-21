export type UserInSeatType = {
  userId: string,
  satDownAt: string,
} | null;

export type TableType = {
  tableId: string,
  seats: Array<UserInSeatType>,
  name: string,
  lastUpdatedAt: string,
};
