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

export type SelectedUserType = {
  [userId: string]: boolean,
};
