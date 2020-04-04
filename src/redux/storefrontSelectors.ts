import { createSelector } from 'reselect';
import { selectTableById } from './tablesSelectors';

export const selectStorefront = (state: any) => state.storefront.storefront;

export const selectStatus = (state: any) => state.storefront.status;

export const selectStorefrontTableIds = (state: any) => state.storefront.tableIds;

export const selectStorefrontTables = createSelector(
  selectStorefrontTableIds,
  state => state,
  (tableIds, state) => {
    return tableIds.map((tableId: string) => {
      return selectTableById(tableId)(state);
    })
  }
);
