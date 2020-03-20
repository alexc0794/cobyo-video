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

export function timeSince(inputDate: Date): string {
  const now: any = new Date();
  const date: any = inputDate
  let seconds = Math.floor((now - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval === 1) {
    return interval + " year";
  }
  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval === 1) {
    return interval + " month";
  }
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval === 1) {
    return interval + " day";
  }
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval === 1) {
    return interval + " hour";
  }
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval === 1) {
    return interval + " minute";
  }
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
