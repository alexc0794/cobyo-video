import { MenuType } from 'types';
import { fetchMenu } from 'menu/services';

export const updateMenu = (menu: MenuType) => ({
  type: 'UPDATE_MENU',
  payload: { menu }
});

export function fetchAndUpdateMenu(storefront: string) {
  return async function(dispatch: any) {
    const menu = await fetchMenu(storefront);
    dispatch(updateMenu(menu));
    return menu;
  }
}
