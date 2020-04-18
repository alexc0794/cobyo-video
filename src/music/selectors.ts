import { CurrentlyPlaying } from 'types';

export const selectCurrentlyPlaying = (state: any): CurrentlyPlaying => state.music.currentlyPlaying;
