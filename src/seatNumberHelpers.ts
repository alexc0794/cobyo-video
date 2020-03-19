// TODO: Some hardcoded shit
// HARD DEPENDENCY ON TABLE BEING 8 SEATS!!!!!!
export function getSeatNumber(
  direction: "frontLeft" | "front" | "frontRight" | "left" | "right",
  fromSeatNumber: number
): number {
  switch (direction) {
    case "frontLeft": {
      return getFrontLeft(fromSeatNumber);
    }
    case "front": {
      return getFront(fromSeatNumber);
    }
    case "frontRight": {
      return getFrontRight(fromSeatNumber);
    }
    case "left": {
      return getLeft(fromSeatNumber);
    }
    case "right": {
      return getRight(fromSeatNumber);
    }
    default:
      return -1;
  }
}

function getFrontLeft(fromSeatNumber: number): number {
  switch (fromSeatNumber) {
    case 0: {
      return 5;
    }
    case 1: {
      return 6;
    }
    case 2: {
      return 7;
    }
    case 3: {
      return -1;
    }
    case 4: {
      return -1;
    }
    case 5: {
      return 0;
    }
    case 6: {
      return 1;
    }
    case 7: {
      return 2;
    }
    default:
      return -1;
  }
}

function getFront(fromSeatNumber: number): number {
  switch (fromSeatNumber) {
    case 0: {
      return 4;
    }
    case 1: {
      return 5;
    }
    case 2: {
      return 6;
    }
    case 3: {
      return 7;
    }
    case 4: {
      return 0;
    }
    case 5: {
      return 1;
    }
    case 6: {
      return 2;
    }
    case 7: {
      return 3;
    }
    default:
      return -1;
  }
}

function getFrontRight(fromSeatNumber: number): number {
  switch (fromSeatNumber) {
    case 0: {
      return -1;
    }
    case 1: {
      return 4;
    }
    case 2: {
      return 5;
    }
    case 3: {
      return 6;
    }
    case 4: {
      return 1;
    }
    case 5: {
      return 2;
    }
    case 6: {
      return 3;
    }
    case 7: {
      return -1;
    }
    default:
      return -1;
  }
}

function getLeft(fromSeatNumber: number): number {
  switch (fromSeatNumber) {
    case 0: {
      return 1;
    }
    case 1: {
      return 2;
    }
    case 2: {
      return 3;
    }
    case 3: {
      return -1;
    }
    case 4: {
      return -1;
    }
    case 5: {
      return 4;
    }
    case 6: {
      return 5;
    }
    case 7: {
      return 6;
    }
    default:
      return -1;
  }
}

function getRight(fromSeatNumber: number): number {
  switch (fromSeatNumber) {
    case 0: {
      return -1;
    }
    case 1: {
      return 0;
    }
    case 2: {
      return 1;
    }
    case 3: {
      return 2;
    }
    case 4: {
      return 5;
    }
    case 5: {
      return 6;
    }
    case 6: {
      return 7;
    }
    case 7: {
      return -1;
    }
    default:
      return -1;
  }
}
