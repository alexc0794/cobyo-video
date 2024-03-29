import dotenv from 'dotenv';
dotenv.config();

export const IS_DEV = process.env.NODE_ENV === 'development';
export const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
export const BASE_WS_URL = process.env.REACT_APP_BASE_WS_URL;

// Intervals
export const REFRESH_STOREFRONT_INTERVAL_MS = 10 * 60 * 1000;
export const REFRESH_TABLES_INTERVAL_MS = IS_DEV ? 10000 : 90000; // must be less frequent than RECLAIM_SEAT_WHILE_IN_VIDEO_CHAT_INTERVAL_MS!!!
export const RECLAIM_SEAT_WHILE_IN_VIDEO_CHAT_INTERVAL_MS = IS_DEV ? 10000 : 30000; // reclaim seat
export const REFRESH_ACTIVE_USERS_INTERVAL_MS = IS_DEV ? 10000 : 60000; // update active users
export const SEND_TRANSCRIPT_INTERVAL_MS = 20000; // send transcript
