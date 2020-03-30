import { UserType } from '../types';

export const updateUsers = (users: Array<UserType>) => ({
  type: "UPDATE_USERS",
  payload: { users }
});
