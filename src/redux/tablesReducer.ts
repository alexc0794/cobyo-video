import { combineReducers } from 'redux';

function byId(state = {}, action: any) {
  switch (action.type) {
    case 'UPDATE_TABLE':
    case 'JOINED_TABLE': {
      const { table } = action.payload;
      return {
        ...state,
        [table.tableId]: {
          ...table
        }
      };
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
    default:
      return state;
  }
}

export default combineReducers({
  byId,
  activeTableId
});
