import axios from 'axios';
import { BASE_API_URL } from 'config';
import { TableType, UserType } from 'types';
import { transformTable } from '_tables/transforms';

export function fetchTable(tableId: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/channel/${tableId}`);
      return resolve({
        table: transformTable(response.data.table),
        users: response.data.users,
      });
    } catch (e) {
      console.error(e)
      return reject("Something went wrong");
    }
  });
}

type FetchTablesResponse = {
  tables: Array<TableType>,
  users: Array<UserType>,
};

export function fetchTables(tableIds: Array<string>, token: string | null = null): Promise<FetchTablesResponse> {
  return new Promise(async (resolve, reject) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    try {
      const response = await axios.get(
        `${BASE_API_URL}/channels?channelIds=${tableIds.join(',')}`,
        { headers },
      );
      return resolve({
        tables: response.data.channels.map((table: any) => transformTable(table)),
        users: response.data.users
      });
    } catch (e) {
      console.error(e);
      return reject("Something went wrong");
    }
  })
}

export function joinTable(tableId: string, seatNumber: number | null, userId: string): Promise<TableType> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/channel/join`,
        { channelId: tableId, userId, seatNumber }
      );
      const table: TableType = transformTable(response.data.channel);
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
      const response = await axios.post(`${BASE_API_URL}/channel/leave`, {
        channelId: tableId,
        userId,
      });
      const table: TableType = transformTable(response.data);
      return resolve(table);
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
        channelId: tableId,
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
      const response = await axios.get(`${BASE_API_URL}/table/${tableId}/keywords?minFrequency=${minFrequency}`);
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
