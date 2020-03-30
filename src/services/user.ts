import axios from 'axios';
import { BASE_API_URL } from './config';
import { transformUser } from './transforms';
import { UserType } from '../types';

export function createUser(
  email: string,
  firstName: string,
  lastName: string|null = null,
  facebookUserId: string|null = null,
  profilePictureUrl: string|null = null,
): Promise<UserType> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/user/create`, {
        email,
        first_name: firstName,
        last_name: lastName,
        facebook_user_id: facebookUserId,
        profile_picture_url: profilePictureUrl,
      });
      const user = transformUser(response.data);
      return resolve(user);
    } catch (e) {
      console.error(e);
      return reject("Something went wrong");
    }
  });
}
