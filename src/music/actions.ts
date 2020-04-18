import { fetchCurrentlyPlaying } from 'music/services';
import { CurrentlyPlaying } from 'types';

const updateCurrentlyPlaying = (currentlyPlaying: CurrentlyPlaying) => ({
  type: "UPDATE_CURRENTLY_PLAYING",
  payload: { currentlyPlaying }
});


export function fetchAndUpdateCurrentlyPlaying(channelId: string) {
  return async function(dispatch: any) {
    const currentlyPlaying: CurrentlyPlaying = await fetchCurrentlyPlaying(channelId);
    dispatch(updateCurrentlyPlaying(currentlyPlaying));
  }
}
