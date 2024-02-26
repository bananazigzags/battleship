export type ShipPosition = {
  x: number;
  y: number;
};

export type ShipType = "small" | "medum" | "large" | "huge";

export type Ship = {
  position: ShipPosition;
  direction: boolean;
  type: ShipType;
  length: number;
};

export type ShipData = {
  gameId: string;
  indexPlayer: string | number;
  ships: Array<Ship>;
};
