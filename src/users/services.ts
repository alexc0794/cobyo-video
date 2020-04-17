import axios from 'axios';
import { BASE_API_URL } from 'config';
import { UserType } from 'types';

type CreateUserResponse = {
  user: UserType,
  token: string,
};

type GetUserResponse = CreateUserResponse;

export function createUser(
  email: string | null,
  firstName: string,
  lastName: string | null = null,
  facebookUserId: string | null = null,
  profilePictureUrl: string | null = null,
): Promise<GetUserResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const response: CreateUserResponse = (await axios.post(`${BASE_API_URL}/user`, {
        email,
        firstName,
        lastName,
        facebookUserId,
        profilePictureUrl,
      })).data;
      return resolve(response);
    } catch (e) {
      console.error(e);
      return reject("Something went wrong");
    }
  });
}

export function loginGuestUser(userId: string): Promise<GetUserResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const response: GetUserResponse = (await axios.get(`${BASE_API_URL}/user/${userId}`)).data;
      return resolve(response);
    } catch (e) {
      console.error(e);
      return reject("Something went wrong");
    }
  });
}

// type GetActiveUsersResponse = {
//   activeUsers: Array<ActiveUser>,
//   users: Array<User>,
// };

// TODO: Fix this!
export function fetchActiveUsers(token: string): Promise<Array<UserType>> {
  return new Promise(async (resolve, reject) => {
    try {
      const authorization = `Bearer ${token}`;
      const response = await axios.get(`${BASE_API_URL}/active-users`, {
        headers: { Authorization: authorization }
      });
      const users = response.data;
      return resolve(users);
    } catch (e) {
      if (e && e.response && e.response.status) {
        return reject(e.response.status);
      }
      return reject(500);
    }
  });
}
