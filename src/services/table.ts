import axios from 'axios';
import { BASE_API_URL } from '../config';
import { TableType, SeatType } from '../types';
import { transformTable, transformUser } from './transforms';

export function fetchTable(tableId: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/table/${tableId}`
      );
      return resolve({
        table: transformTable(response.data.table),
        users: response.data.users.map((user: any) => transformUser(user)),
      });
    } catch (e) {
      console.error(e)
      return reject("Something went wrong");
    }
  });
}

export function fetchTables(tableIds: Array<string>, token: string|null = null): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const headers = token ? { 'Authorization': `Bearer ${token}`} : {};
    try {
      const response = await axios.get(`${BASE_API_URL}/tables?table_ids=${tableIds.join(',')}`, { headers });
      return resolve({
        tables: response.data.tables.map((table: any) => transformTable(table)),
        users: response.data.users.map((user: any) => transformUser(user))
      });
    } catch (e) {
      console.error(e);
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
      const table: TableType = transformTable(response.data);
      return resolve(table);
    } catch (e) {
      console.error(e);
      return reject("Something went wrong");
    }
  });
}

export function leaveTable(tableId: string, userId: string): Promise<TableType> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/table/${tableId}/leave`, {
        user_id: userId,
      });
      const table: TableType = transformTable(response.data);
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
      const table: TableType = transformTable(response.data);
      return resolve(table);
    } catch (e) {
      console.error(e);
      return reject("Something went wrong");
    }
  });
}

export function updateTable(tableId: string, seats: Array<SeatType>, name: string): Promise<void> {
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
