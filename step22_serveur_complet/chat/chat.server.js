import { Server } from "socket.io";

const messages = [];

export function initChat(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    // envoyer l'historique au nouvel utilisateur
    socket.emit("history", messages);

    socket.on("message", ({ pseudo, text }) => {
      const msg = {
        pseudo,
        text,
        date: new Date().toLocaleTimeString(),
      };

      messages.push(msg);

      // envoyer à tout le monde
      io.emit("message", msg);
    });
  });
}
