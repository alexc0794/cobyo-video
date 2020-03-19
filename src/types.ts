export type UserInSeat = {
  userId: string,
  satDownAt: string,
} | null;

export type Table = {
  tableId: string,
  seats: Array<UserInSeat>,
  name: string,
  lastUpdatedAt: string,
};
