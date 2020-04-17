import { UserType } from 'src/users/types';

export type SeatType = {
  userId: string | null,
  satDownAt: string | null,
  seatNumber: number,
};

export type TableType = {
  tableId: string,
  seats: Array<SeatType>,
  name: string,
  lastUpdatedAt: string,
  connection: string,
  shape: string,
};

export type UserInSeatType = UserType & SeatType;
