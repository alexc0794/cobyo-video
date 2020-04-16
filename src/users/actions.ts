import { UserType } from 'types';
import { fetchActiveUsers, createUser, loginGuestUser } from 'services';
import { selectToken } from 'redux/appSelectors';

export const updateUsers = (users: Array<UserType>) => ({
  type: "UPDATE_USERS",
  payload: { users }
});

export const updateActiveUsers = (users: Array<UserType>) => ({
  type: "UPDATE_ACTIVE_USERS",
  payload: { users }
});

export const createUserSuccess = (user: UserType, token: string) => ({
  type: "CREATE_USER_SUCCESS",
  payload: { user, token }
});

export function fetchAndUpdateActiveUsers() {
  return async function(dispatch: any, getState: any) {
    const token = selectToken(getState());
    try {
      const users = await fetchActiveUsers(token);
      dispatch(updateActiveUsers(users));
      return null;
    } catch (e) {
      return e;
    }
  }
}

export function createAndUpdateUser(
  email: string | null,
  firstName: string,
  lastName: string | null = null,
  facebookUserId: string | null = null,
  profilePictureUrl: string | null = null,
): any {
  return async function(dispatch: any) {
    const { user, token } = await createUser(email, firstName, lastName, facebookUserId, profilePictureUrl);
    dispatch(createUserSuccess(user, token));
    return user;
  }
}

export function loginAndUpdateGuestUser(userId: string): any {
  return async function(dispatch: any) {
    const { user, token } = await loginGuestUser(userId);
    dispatch(createUserSuccess(user, token));
    return user;
  }
}
