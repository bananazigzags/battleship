import { Game } from "./types";

export class GameService {
  private games: Record<string, Game>;

  constructor() {
    this.games = {};
  }

  getUserCurrentKey() {
    return Object.keys(this.games).length.toString();
  }

  createGame(players: Array<string>) {
    const gameId = this.getUserCurrentKey();
    this.games[gameId] = {
      gameId,
    };
    const res1 = JSON.stringify({
      type: "create_game",
      data: JSON.stringify({
        data: {
          idGame: gameId,
          idPlayer: `Player 1: ${players[0]}`,
        },
        id: 0,
      }),
    });
    const res2 = JSON.stringify({
      type: "create_game",
      data: JSON.stringify({
        data: {
          idGame: gameId,
          idPlayer: `Player 2: ${players[1]}`,
        },
        id: 0,
      }),
    });
    return [res1, res2];
  }
}
