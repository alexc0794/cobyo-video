export type UserType = {
  userId: string,
  facebookUserId: string | null,
  email: string | null,
  firstName: string,
  lastName: string | null,
  profilePictureUrl: string | null,
  lastActiveAt: string | null,
};

export type InventoryItemType = {
  itemId: string,
  userId: string,
  fromUserId: string,
  purchasedAt: string,
  itemIdPurchasedAt: string,
  expiringAtSeconds: number | null,
};
