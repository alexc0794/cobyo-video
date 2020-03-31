export const IS_DEV = false;

// Intervals
export const REFRESH_TABLES_INTERVAL_MS = IS_DEV ? 30000 : 90000; // must be less frequent than RECLAIM_SEAT_WHILE_IN_VIDEO_CHAT_INTERVAL_MS!!!
export const RECLAIM_SEAT_WHILE_IN_VIDEO_CHAT_INTERVAL_MS = IS_DEV ? 20000 : 30000; // reclaim seat
export const REFRESH_ACTIVE_USERS_INTERVAL_MS = IS_DEV ? 10000 : 60000; // update active users
export const SEND_TRANSCRIPT_INTERVAL_MS = 20000; // send transcript
