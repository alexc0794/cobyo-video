import { combineReducers } from 'redux';
import { CurrentlyPlaying } from 'types';

// Assume this is a byId of menu items, not menus.
const initialCurrentlyPlaying: CurrentlyPlaying = {
  fromUserId: '',
  trackId: '',
  trackUri: '',
  trackName: '',
  artistName: '',
  position: 0,
  duration: 0,
  paused: true,
};

function currentlyPlaying(state = initialCurrentlyPlaying, action: any) {
  switch (action.type) {
    case 'UPDATE_CURRENTLY_PLAYING':
    case 'CHANGE_SONG': {
      return action.payload;
    }
    default:
      return state;
  }
}

export default combineReducers({ currentlyPlaying });
