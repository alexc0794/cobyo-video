export const selectUserById = (userId: string | null) => (state: any) =>
  userId ? state.users.byId[userId] : null;

export const selectUsersByIds = (userIds: Array<string | null>) => (state: any) =>
  userIds.map(userId => selectUserById(userId)(state));

export const selectActiveUsers = (state: any) => state.users.activeUserIds.map((userId: string) => selectUserById(userId)(state));
