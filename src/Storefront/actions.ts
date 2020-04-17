import { fetchStorefront } from 'src/storefront/services';

const updateStorefront = (storefront: string, status: string, tableIdGrid: Array<Array<string>>) => ({
  type: "UPDATE_STOREFRONT",
  payload: { storefront, status, tableIdGrid }
});


export function fetchAndUpdateStorefront() {
  return async function(dispatch: any) {
    const response = await fetchStorefront();
    const { storefront, status, tableIdGrid } = response;
    dispatch(updateStorefront(storefront, status, tableIdGrid));
    return response;
  }
}
