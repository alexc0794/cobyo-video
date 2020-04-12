import axios from 'axios';
import { BASE_API_URL } from '../config';
import { transformUser } from './transforms';
import { UserType } from '../types';

type UserTokenResponse = {
  user: UserType,
  token: string,
};

export function createUser(
  email: string|null,
  firstName: string,
  lastName: string|null = null,
  facebookUserId: string|null = null,
  profilePictureUrl: string|null = null,
): Promise<UserTokenResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/user/create`, {
        email,
        first_name: firstName,
        last_name: lastName,
        facebook_user_id: facebookUserId,
        profile_picture_url: profilePictureUrl,
      });
      const user: UserType = transformUser(response.data.user);
      return resolve({ user, token: response.data.token });
    } catch (e) {
      console.error(e);
      return reject("Something went wrong");
    }
  });
}

export function loginGuestUser(userId: string): Promise<UserTokenResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/guest/${userId}`);
      const user: UserType = transformUser(response.data.user);
      return resolve({ user, token: response.data.token });
    } catch (e) {
      console.error(e);
      return reject("Something went wrong");
    }
  });
}

export function fetchActiveUsers(token: string): Promise<Array<UserType>> {
  return new Promise(async (resolve, reject) => {
    try {
      const authorization = `Bearer ${token}`;
      const response = await axios.get(`${BASE_API_URL}/active-users`, {
        headers: {
          'Authorization': authorization,
        }
      });
      const users = response.data.map((user: any) => transformUser(user));
      return resolve(users);
    } catch (e) {
      if (e && e.response && e.response.status) {
        return reject(e.response.status);
      }
      return reject(500);
    }
  });
}
