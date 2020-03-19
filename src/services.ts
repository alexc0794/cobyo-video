import axios from 'axios';
import { Table, UserInSeat } from './types';

const IS_DEV = true;

const BASE_API_URL = IS_DEV ? (
  'http://localhost:8080'
) : (
  'https://y6f6x4ptsa.execute-api.us-east-1.amazonaws.com/dev'
);

export function fetchToken(uid: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/token/${uid}`
      );
      return resolve(response.data.toString());
    } catch (e) {
      return reject("Something went wrong");
    }
  });
}

type UserInSeatResponse = {
  user_id: string,
  sat_down_at: string,
} | null;

export function fetchTable(tableId: string): Promise<Table> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/table/${tableId}`
      );
      const seats: Array<UserInSeat> = response.data.seats.map((seat: UserInSeatResponse) => {
        if (seat) {
          return {
            userId: seat.user_id,
            satDownAt: seat.sat_down_at,
          };
        }
        return null;
      });
      const table: Table = {
        tableId: response.data.table_id,
        seats,
        lastUpdatedAt: response.data.last_updated_at,
      };
      return resolve(table);
    } catch (e) {
      console.error(e)
      return reject("Something went wrong");
    }
  })
}

export function joinTable(tableId: string, seatNumber: number, userId: string): Promise<boolean> {
  return new Promise(async (resolve, _) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/table/${tableId}/${seatNumber}`, {
        user_id: userId,
      });
      const success = !!response.data;
      return resolve(success);
    } catch (e) {
      console.error(e);
      return resolve(false);
    }
  });
}
