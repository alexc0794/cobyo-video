export type SeatType = {
  userId: string,
  satDownAt: string,
} | null;

export type TableType = {
  tableId: string,
  seats: Array<SeatType>,
  name: string,
  lastUpdatedAt: string,
};

export type UserType = {
  userId: string,
  facebookUserId: string|null,
  email: string|null,
  firstName: string,
  lastName: string|null,
  profilePictureUrl: string|null,
};

export type UserInSeatType = UserType & SeatType;
