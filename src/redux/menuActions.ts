import {menuItemType} from '../types';

export const saveMenuToStore = (items: Array<menuItemType>) => ({
  type: 'SAVE_MENU_TO_STORE',
  payload: {
    items
  }
})
