// TODO: Some hardcoded shit
// HARD DEPENDENCY ON TABLE BEING 8 SEATS!!!!!!
export function getSeatNumber(
  direction: "frontLeft" | "front" | "frontRight" | "left" | "right",
  fromSeatNumber: number,
  numSeats: number,
): number {
  switch (direction) {
    case "frontLeft": {
      return getFrontLeft(fromSeatNumber, numSeats);
    }
    case "front": {
      return getFront(fromSeatNumber, numSeats);
    }
    case "frontRight": {
      return getFrontRight(fromSeatNumber, numSeats);
    }
    case "left": {
      return getLeft(fromSeatNumber, numSeats);
    }
    case "right": {
      return getRight(fromSeatNumber, numSeats);
    }
    default:
      return -1;
  }
}

function getFrontLeft(fromSeat: number, numSeats: number): number {
  const halfNumSeats = numSeats / 2;
  const inTopRow = fromSeat < halfNumSeats; // Top row is represented by first half of seats
  const delta = (halfNumSeats + 1) * (inTopRow ? 1 : -1) // Add or subtract half + 1
  const toSeat = fromSeat + delta;
  const minIndex = inTopRow ? halfNumSeats : 0;
  const maxIndex = inTopRow ? numSeats - 1 : halfNumSeats - 1;
  if (toSeat < minIndex || toSeat > maxIndex) {
    return -1;
  }
  return toSeat;
}

function getFront(fromSeat: number, numSeats: number): number {
  const halfNumSeats = numSeats / 2;
  const inTopRow = fromSeat < halfNumSeats; // Top row is represented by first half of seats
  const delta = halfNumSeats * (inTopRow ? 1 : -1) // Add or subtract half + 1
  const toSeat = fromSeat + delta;
  const minIndex = inTopRow ? halfNumSeats : 0;
  const maxIndex = inTopRow ? numSeats - 1 : halfNumSeats - 1;
  if (toSeat < minIndex || toSeat > maxIndex) {
    return -1;
  }
  return toSeat;
}

function getFrontRight(fromSeat: number, numSeats: number): number {
  const halfNumSeats = numSeats / 2;
  const inTopRow = fromSeat < halfNumSeats; // Top row is represented by first half of seats
  const delta = (halfNumSeats - 1) * (inTopRow ? 1 : -1) // Add or subtract half + 1
  const toSeat = fromSeat + delta;
  const minIndex = inTopRow ? halfNumSeats : 0;
  const maxIndex = inTopRow ? numSeats - 1 : halfNumSeats - 1;
  if (toSeat < minIndex || toSeat > maxIndex) {
    return -1;
  }
  return toSeat;
}

function getLeft(fromSeat: number, numSeats: number): number {
  const halfNumSeats = numSeats / 2;
  const inTopRow = fromSeat < halfNumSeats; // Top row is represented by first half of seats
  const delta = 1 * (inTopRow ? 1 : -1) // Add or subtract half + 1
  const toSeat = fromSeat + delta;
  const minIndex = inTopRow ? 0 : halfNumSeats;
  const maxIndex = inTopRow ? halfNumSeats - 1 : numSeats - 1;
  if (toSeat < minIndex || toSeat > maxIndex) {
    return -1;
  }
  return toSeat;
}

function getRight(fromSeat: number, numSeats: number): number {
  const halfNumSeats = numSeats / 2;
  const inTopRow = fromSeat < halfNumSeats; // Top row is represented by first half of seats
  const delta = -1 * (inTopRow ? 1 : -1) // Add or subtract half + 1
  const toSeat = fromSeat + delta;
  const minIndex = inTopRow ? 0 : halfNumSeats;
  const maxIndex = inTopRow ? halfNumSeats - 1 : numSeats - 1;
  if (toSeat < minIndex || toSeat > maxIndex) {
    return -1;
  }
  return toSeat;
}
