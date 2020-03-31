import { combineReducers } from 'redux';
import { TableType } from '../types';

function byId(state = {}, action: any) {
  switch (action.type) {
    case 'UPDATE_TABLE':
    case 'LEFT_TABLE':
    case 'JOINED_TABLE': {
      const { table } = action.payload;
      return {
        ...state,
        [table.tableId]: {
          ...table
        }
      };
    }
    case 'UPDATE_TABLES': {
      const { tables } = action.payload;
      return tables.reduce((acc: any, table: TableType) => {
        return { ...acc, [table.tableId]: table };
      }, {...state});
    }
    default:
      return state;
  }
}

function activeTableId(state = null, action: any) {
  switch(action.type) {
    case 'JOINED_TABLE': {
      const { table: { tableId } } = action.payload;
      return tableId;
    }
    case 'LEFT_TABLE': {
      return null;
    }
    default:
      return state;
  }
}

export default combineReducers({
  byId,
  activeTableId
});
