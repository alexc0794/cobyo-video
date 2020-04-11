export const selectMenuItemById =(id: string) => (state: any) => state.menu.byId[id];

export const selectMenuItems = (state: any) => {
  const menu = state.menu;
  const { allIds } = menu;
  return allIds.map((id: string)=>(selectMenuItemById(id)(state)));
}
