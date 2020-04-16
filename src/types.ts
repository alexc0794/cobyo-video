export type SeatType = {
  userId: string | null,
  satDownAt: string | null,
  seatNumber: number,
};

export type TableType = {
  tableId: string,
  seats: Array<SeatType>,
  name: string,
  lastUpdatedAt: string,
  connection: string,
  shape: string,
};

export type UserType = {
  userId: string,
  facebookUserId: string | null,
  email: string | null,
  firstName: string,
  lastName: string | null,
  profilePictureUrl: string | null,
  lastActiveAt: string | null,
};

export type MenuType = {
  items: Array<MenuItemType>
};

export type MenuItemType = {
  itemId: string,
  name: string,
  cents: number,
  inventory: number,
  category: string,
  imageUrl: string,
};

export type UserMenuItemType = {
  itemId: string,
  fromUserId: string,
  expireOn: string | null,
};

export type UserInSeatType = UserType & SeatType;
