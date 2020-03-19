export type UserInSeat = {
  userId: string,
  satDownAt: string,
};

export type Table = {
  tableId: string,
  seats: Array<UserInSeat>,
  lastUpdatedAt: string,
};
