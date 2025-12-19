import http from "http";
import { initChat } from "./chat/chat.server.js";
import url from "node:url";
import fs from "node:fs";
import path from "node:path";
import ejs from "ejs";
import { dirname } from "node:path";
import express from "express";
import session from "express-session";

import authRoutes from "./routes/auth.routes.js";
import apiRoutes from "./routes/api.routes.js";
import requireAdmin from "./middlewares/requireAdmin.js";

// ------------------------
// Constantes
// ------------------------
const SERVER_PORT = 8080;
const app = express();

// ------------------------
// __dirname en ES module
// ------------------------
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const template_folder = path.join(__dirname, "tmpl");

// ------------------------
// Middleware
// ------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // pour récupérer les forms
app.use(apiRoutes);

// sessions
app.use(
  session({
    secret: "tp-secret-simple",
    resave: false,
    saveUninitialized: false,
  })
);

// view = views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// routes auth
app.use(authRoutes);

// routes existantes
app.get("/aboutMe", requireAdmin, (req, res) => {
  res.render("aboutMe");
});

app.get(["/", "/home"], requireAdmin, (req, res) => {
  res.render("home", {
    isAdmin: req.session.isAdmin,
    header: {
      title: "HOME",
    },
    body: {
      header: "<h1>Bienvenue </h1>",
      main: "<p>Connexion réussie.</p>",
    },
  });
});

app.get("/chat", requireAdmin, (req, res) => {
  res.render("chat");
});


// 404
app.use((req, res) => {
  res.status(404).render("notFound");
});

const server = http.createServer(app);
initChat(server);

server.listen(SERVER_PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur + WS sur http://0.0.0.0:${SERVER_PORT}`);
});
