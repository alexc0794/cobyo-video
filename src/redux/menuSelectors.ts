export const selectMenuItemById =(Id: string) => (state: any) => state.menu.byId[Id];

export const selectMenuItems = (state: any) => {
  const menu = state.menu;
  const {allIds} = menu;
  return allIds.map((Id:string)=>(selectMenuItemById(Id)(state)));
}