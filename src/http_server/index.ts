import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { WebSocketServer, type WebSocket } from "ws";
import { UserService } from "./users";
import { User } from "./users/types";
import { RoomService } from "./rooms";
import { AddUserToRoomPayload } from "./rooms/types";
import { GameService } from "./game";

export const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(""));
  const file_path =
    __dirname + (req.url === "/" ? "/front/index.html" : "/front" + req.url);
  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const WS_PORT = 3000;
const userService = new UserService();
const roomService = new RoomService();
const gameService = new GameService();
const wss = new WebSocketServer({ port: WS_PORT });

const connections: Record<string, WebSocket> = {};

wss.on("connection", function connection(ws) {
  console.log(`Websocket connected on port ${WS_PORT}`);
  let currentUserName: string;

  const handlers = {
    reg: (data: Omit<User, "index">) => {
      const res = userService.login(data);
      currentUserName = data.name;
      connections[currentUserName] = ws;
      console.log(res);
      ws.send(res);
      ws.send(roomService.getRoomUpdate());
    },
    create_room: () => {
      const currentUser = userService.getUserByName(currentUserName);
      roomService.createRoom(currentUser);
      const roomUpdate = roomService.getRoomUpdate();
      Object.values(connections).forEach((client) => client.send(roomUpdate));
    },
    add_user_to_room: (data: AddUserToRoomPayload) => {
      const currentUser = userService.getUserByName(currentUserName);
      const roomUsers = roomService.addUserToRoom(data.indexRoom, currentUser);
      const responses = gameService.createGame([
        roomUsers[0].name,
        roomUsers[1].name,
      ]);
      roomUsers.forEach((user, index) => {
        connections[user.name].send(responses[index]);
      });
    },
  };

  ws.on("error", console.error);

  ws.on("message", function message(rawMessage) {
    const message = JSON.parse(rawMessage.toString());
    const data = message.data ? JSON.parse(message.data) : "";
    console.log(message);

    const type = message.type;

    if (type in handlers) {
      handlers[type](data);
    } else {
      console.log("invalid command");
    }
  });

  ws.on("close", (code) => {
    console.log(code);
  });
});
