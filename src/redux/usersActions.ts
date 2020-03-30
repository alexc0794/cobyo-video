import { UserType } from '../types';
import { fetchActiveUsers } from '../services';

export const updateUsers = (users: Array<UserType>) => ({
  type: "UPDATE_USERS",
  payload: { users }
});

export const updateActiveUsers = (users: Array<UserType>) => ({
  type: "UPDATE_ACTIVE_USERS",
  payload: { users }
})

export function fetchAndUpdateActiveUsers() {
  return async function(dispatch: any) {
    const users = await fetchActiveUsers();
    dispatch(updateActiveUsers(users));
  }
}
