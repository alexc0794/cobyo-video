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
};

export function transformTable(tableResponse: TableResponseType): TableType {
  const seats: Array<SeatType> = tableResponse.seats.map((seatResponseData: SeatResponseType) => {
    let seat: SeatType = null;
    if (seatResponseData) {
      seat = {
        userId: seatResponseData.user_id,
        satDownAt: seatResponseData.sat_down_at,
      };
    }
    return seat;
  });
  return {
    tableId: tableResponse.table_id,
    seats,
    lastUpdatedAt: tableResponse.last_updated_at,
    name: tableResponse.name
  };
}

type UserResponseType = {
  user_id: string,
  facebook_user_id: string|null,
  email: string|null,
  first_name: string,
  last_name: string|null,
  profile_picture_url: string|null,
};

export function transformUser(userResponse: UserResponseType): UserType {
  return {
    userId: userResponse.user_id,
    facebookUserId: userResponse.facebook_user_id,
    email: userResponse.email,
    firstName: userResponse.first_name,
    lastName: userResponse.last_name,
    profilePictureUrl: userResponse.profile_picture_url,
  };
}
