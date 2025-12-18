import { Server } from "socket.io";

const messages = [];

// Fonction pour nettoyer les bad words
function cleanBadWords(text) {
  const badWords = ['merde', 'putain', 'con', 'salope', 'encule']; // Liste de mots à censurer
  let cleanedText = text;
  badWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    cleanedText = cleanedText.replace(regex, '*'.repeat(word.length));
  });
  return cleanedText;
}

export function initChat(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    // envoyer l'historique au nouvel utilisateur
    socket.emit("history", messages);

    socket.on("message", ({ pseudo, text }) => {
      // Nettoyer le message
      const cleanedText = cleanBadWords(text);
      const msg = {
        pseudo,
        text: cleanedText,
        date: new Date().toLocaleTimeString(),
      };

      messages.push(msg);

      // envoyer à tout le monde
      io.emit("message", msg);
    });
  });
}
