import { combineReducers } from 'redux';

function storefront(state = null, action: any): string | null {
  switch (action.type) {
    case 'UPDATE_STOREFRONT': {
      return action.payload.storefront;
    }
    default:
      return state;
  }
}

function status(state = 'OPEN', action: any): string {
  switch (action.type) {
    case 'UPDATE_STOREFRONT': {
      return action.payload.status;
    }
    default:
      return state;
  }
}

function tableIds(state = [], action: any): Array<string> {
  switch (action.type) {
    case 'UPDATE_STOREFRONT': {
      const { tableIdGrid } = action.payload;
      const empty: Array<string> = [];
      return empty.concat.apply([], tableIdGrid);
    }
    default:
      return state;
  }
}

export default combineReducers({
  storefront,
  status,
  tableIds,
});
