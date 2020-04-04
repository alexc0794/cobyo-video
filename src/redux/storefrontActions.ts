import { fetchStorefront } from '../services/storefront';

const updateStorefront = (storefront: string, status: string, tableIds: Array<string>) => ({
  type: "UPDATE_STOREFRONT",
  payload: { storefront, status, tableIds }
});


export function fetchAndUpdateStorefront() {
  return async function(dispatch: any) {
    const response = await fetchStorefront();
    const { storefront, status, tableIds } = response;
    dispatch(updateStorefront(storefront, status, tableIds));
    return response;
  }
}
