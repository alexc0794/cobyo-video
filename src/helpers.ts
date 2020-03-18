export function hashCode(str: string) {
  let hash = 0, i, chr;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
  return hash;
}

// Between 1 and max
export function random(max: number) {
  return Math.floor(Math.random() * Math.floor(max)) + 1;
}
