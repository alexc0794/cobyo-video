import { SeatType, TableType } from '_tables/types';

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
  seats: Array<SeatResponseType | null>,
};

export function transformTable(response: TableResponseType): TableType {
  const seats: Array<SeatType> = response.seats.map((seatResponseData: SeatResponseType | null, i: number) => {
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
