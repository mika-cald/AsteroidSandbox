import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let count = 0;

wss.on("connection", ws => {
  count++;
  console.log("Player connected. Online:", count);

  ws.send(JSON.stringify({ playersOnline: count }));

  ws.on("close", () => {
    count--;
    console.log("Player disconnected. Online:", count);
  });
});