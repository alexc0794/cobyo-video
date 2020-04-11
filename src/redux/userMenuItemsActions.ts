
export const buyMenuItem = (itemName:string, fromUserId: string, toUserIds:Array<string>) => ({
  type: "BUY_MENU_ITEM",
  payload: {itemName, fromUserId, toUserIds}
})