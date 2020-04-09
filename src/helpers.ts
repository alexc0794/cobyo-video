export function getDebugMode() {
  const params = new URLSearchParams(window.location.search);
  const debug = params.get('debug');
  const explicitOn = debug === '1' || debug === 'true';
  const explicitOff = debug === '0' || debug === 'false';
  return {
    explicitOn,
    explicitOff,
  };
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

export function timeSinceShort(inputDate: Date): string {
  const longText = timeSince(inputDate);
  const [value, interval] = longText.split(' ');
  if (value === '0') {
    return 'now';
  }

  return `${value}${interval.slice(0,1)}`;
}
