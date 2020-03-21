import axios from 'axios';
import { TableType, UserInSeatType } from './types';

const IS_DEV = true;

const BASE_API_URL = IS_DEV ? (
  'http://localhost:8080'
) : (
  'https://y6f6x4ptsa.execute-api.us-east-1.amazonaws.com/dev'
);

export function fetchToken(uid: string): Promise<string> {
  return new Promise(async (resolve, _) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/token/${uid}`);
      return resolve(response.data.toString());
    } catch (e) {
      console.error(e);
      return resolve("");
    }
  });
}

export function fetchTable(tableId: string): Promise<TableType> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/table/${tableId}`
      );
      const table = _parseTableData(response.data);
      return resolve(table);
    } catch (e) {
      console.error(e)
      return reject("Something went wrong");
    }
  })
}

export function joinTable(tableId: string, seatNumber: number, userId: string): Promise<TableType> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/table/${tableId}/${seatNumber}`, {
        user_id: userId,
      });
      const table: TableType = _parseTableData(response.data);
      return resolve(table);
    } catch (e) {
      console.error(e);
      return reject("Something went wrong");
    }
  });
}

export async function updateTableWithUserIdsFromRtc(
  tableId: string,
  userIds: Array<string>,
): Promise<TableType> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/table/${tableId}/user_ids`, {
        user_ids: userIds
      });
      const table: TableType = _parseTableData(response.data);
      return resolve(table);
    } catch (e) {
      console.error(e);
      return reject("Something went wrong");
    }
  });
}

export function updateTable(tableId: string, seats: Array<UserInSeatType>, name: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/table/${tableId}`, {
        seats: seats.map(seat => {
          if (seat) {
            return {
              user_id: seat.userId,
              sat_down_at: seat.satDownAt,
            };
          }
          return null;
        }),
        name
      });

      if (response && !!response.data) {
        return resolve();
      } else {
        return reject("Something went wrong");
      }
    } catch (e) {
      console.error(e);
      return reject("Something went wrong");
    }
  });
}

export function sendAudioTranscript(
  body: string,
  tableId: string,
): Promise<boolean> {
  return new Promise(async (resolve, _) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/transcript`, {
        body,
        table_id: tableId,
      });
      return resolve(response && !!response.data);
    } catch (e) {
      console.error(e);
      return resolve(false);
    }
  });
}

export function fetchTableKeywords(tableId: string, minFrequency = 5): Promise<Array<string>> {
  return new Promise(async (resolve, _) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/table/${tableId}/keywords?min_frequency=${minFrequency}`);
      if (response && response.data) {
        return resolve(Object.keys(response.data));
      }
      return resolve([]);
    } catch (e) {
      console.error(e);
      return resolve([]);
    }
  })
}

type UserInSeatResponseData = {
  user_id: string,
  sat_down_at: string,
} | null;

type TableResponseData = {
  table_id: string,
  seats: Array<UserInSeatResponseData>,
  name: string,
  last_updated_at: string,
};

function _parseTableData(data: TableResponseData): TableType {
  const seats: Array<UserInSeatType> = data.seats.map((seatResponseData: UserInSeatResponseData) => {
    let seat: UserInSeatType = null;
    if (seatResponseData) {
      seat = {
        userId: seatResponseData.user_id,
        satDownAt: seatResponseData.sat_down_at,
      };
    }
    return seat;
  });
  return {
    tableId: data.table_id,
    seats,
    lastUpdatedAt: data.last_updated_at,
    name: data.name
  };
}
