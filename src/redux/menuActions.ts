import {MenuItemType} from '../types';

export const saveMenuToStore = (items: Array<MenuItemType>) => ({
  type: 'SAVE_MENU_TO_STORE',
  payload: {
    items
  }
})
