import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { WebSocketServer } from "ws";
import { UserService } from "./users";
import { User } from "./users/types";

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
const wss = new WebSocketServer({ port: WS_PORT });

const connections = [];

wss.on("connection", function connection(ws) {
  console.log(`Websocket connected on port ${WS_PORT}`);
  connections.push(ws);

  const handlers = {
    reg: (data: Omit<User, "index">) => {
      const res = userService.login(data);
      console.log(res);
      ws.send(res);
    },
  };

  ws.on("error", console.error);

  ws.on("message", function message(rawMessage) {
    const message = JSON.parse(rawMessage.toString());
    const data = JSON.parse(message.data);
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
