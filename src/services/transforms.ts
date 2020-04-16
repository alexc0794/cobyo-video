import { SeatType, TableType } from 'types';

type SeatResponseType = { // Maps to backend
  seatNumber: number,
  userId: string,
  satDownAt: string,
};

type TableResponseType = { // Maps to backend
  channelId: string,
  channelName: string,
  lastUpdatedAt: string,
  videoConnection: string,
  tableShape: string,
  seats: Array<SeatResponseType|null>,
};

export function transformTable(response: TableResponseType): TableType {
  const seats: Array<SeatType> = response.seats.map((seatResponseData: SeatResponseType|null, i: number) => {
    if (seatResponseData) {
      return seatResponseData;
    }
    return {
      userId: null,
      satDownAt: null,
      seatNumber: i
    };
  });
  return {
    tableId: response.channelId,
    name: response.channelName,
    lastUpdatedAt: response.lastUpdatedAt,
    connection: response.videoConnection,
    shape: response.tableShape,
    seats,
  };
}

// type UserResponseType = {
//   user_id: string,
//   facebook_user_id: string|null,
//   email: string|null,
//   first_name: string,
//   last_name: string|null,
//   profile_picture_url: string|null,
//   last_active_at: string|null,
// };
//
// export function transformUser(response: UserResponseType): UserType {
//   return {
//     userId: response.user_id,
//     facebookUserId: response.facebook_user_id,
//     email: response.email,
//     firstName: response.first_name,
//     lastName: response.last_name,
//     profilePictureUrl: response.profile_picture_url,
//     lastActiveAt: response.last_active_at,
//   };
// }
