import { IS_DEV } from '../config';

export const BASE_API_URL = IS_DEV ? (
  'http://localhost:8080'
) : (
  'https://y6f6x4ptsa.execute-api.us-east-1.amazonaws.com/dev'
);
