import { createSelector } from 'reselect';
import { selectTableById } from './tablesSelectors';

export const selectUserId = (state: any) => state.app.userId;

export const selectToken = (state: any) => state.app.token;

export const selectStorefront = (state: any) => state.app.storefront;

export const selectStatus = (state: any) => state.app.status;

export const selectStorefrontTableIds = (state: any) => state.app.tableIds;

export const selectStorefrontTables = createSelector(
  selectStorefrontTableIds,
  state => state,
  (tableIds, state) => {
    return tableIds.map((tableId: string) => {
      return selectTableById(tableId)(state);
    })
  }
);
