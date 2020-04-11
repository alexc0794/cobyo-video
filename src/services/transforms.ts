import { SeatType, TableType, UserType } from '../types';

type SeatResponseType = {
  user_id: string,
  sat_down_at: string,
} | null;

type TableResponseType = {
  table_id: string,
  seats: Array<SeatResponseType>,
  name: string,
  last_updated_at: string,
  connection: string,
  shape: string,
};

export function transformTable(response: TableResponseType): TableType {
  const seats: Array<SeatType> = response.seats ? response.seats.map((seatResponseData: SeatResponseType, i: number) => {
    if (seatResponseData) {
      return {
        userId: seatResponseData.user_id,
        satDownAt: seatResponseData.sat_down_at,
        seatNumber: i, // THIS IS WHERE WE DECIDE SEAT NUMBER. TODO: REFACTOR
      };
    }
    return {
      userId: null,
      satDownAt: null,
      seatNumber: i
    };
  }) : [];
  return {
    tableId: response.table_id,
    seats,
    lastUpdatedAt: response.last_updated_at,
    name: response.name,
    connection: response.connection,
    shape: response.shape
  };
}

type UserResponseType = {
  user_id: string,
  facebook_user_id: string|null,
  email: string|null,
  first_name: string,
  last_name: string|null,
  profile_picture_url: string|null,
  last_active_at: string|null,
};

export function transformUser(response: UserResponseType): UserType {
  return {
    userId: response.user_id,
    facebookUserId: response.facebook_user_id,
    email: response.email,
    firstName: response.first_name,
    lastName: response.last_name,
    profilePictureUrl: response.profile_picture_url,
    lastActiveAt: response.last_active_at,
  };
}
