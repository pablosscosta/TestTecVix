import { app } from "./app";
import { socketSetup, getIO } from "./socket";
import http from "http";
import events from "events";

events.EventEmitter.defaultMaxListeners = 20;

const port = process.env.PORT || 3001;
const host = "localhost";


if (process.env.NODE_ENV !== "test") {
  (async () => {
    const server = http.createServer(app);

    socketSetup(server);

    server.listen(port, () => {
      console.log("Server started on port %s:%s 🚀", host, port);
    });
  })();
}

export { getIO };
