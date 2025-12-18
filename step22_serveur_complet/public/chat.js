let socket;
let pseudo;

function join() {
  pseudo = document.getElementById("pseudo").value;
  if (!pseudo) return;

  socket = io();

  socket.on("history", (msgs) => {
    msgs.forEach(addMessage);
  });

  socket.on("message", addMessage);

  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";
}

function send() {
  const input = document.getElementById("msg");
  if (!input.value) return;

  socket.emit("message", {
    pseudo,
    text: input.value,
  });

  input.value = "";
}

function addMessage(msg) {
  const div = document.createElement("div");
  div.textContent = `[${msg.date}] ${msg.pseudo} : ${msg.text}`;
  document.getElementById("messages").appendChild(div);
}
