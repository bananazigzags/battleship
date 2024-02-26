import { ShipData } from "./types";

export class ShipService {
  private ships: Record<string, Record<string | number, ShipData["ships"]>>;

  constructor() {
    this.ships = {};
  }

  getShipsByGameAndPlayer(gameId: string, playerId: string) {
    return this.ships[gameId][playerId];
  }

  addShips(data: ShipData) {
    const { indexPlayer, ships, gameId } = data;
    const gameShipData = this.ships[gameId];
    if (gameShipData) {
      gameShipData[indexPlayer] = ships;
    } else {
      this.ships[gameId] = {
        [indexPlayer]: ships,
      };
    }
    console.log(this.ships);
    const res = JSON.stringify({
      type: "start_game",
      data: {
        ships: JSON.stringify(ships),
        currentPlayerIndex: indexPlayer,
      },
      id: 0,
    });
    return res;
  }
}
