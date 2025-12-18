import http from "node:http";
import url from "node:url";
import fs from "node:fs";
import path from "node:path";
import ejs from "ejs";
import { dirname } from "node:path";
import express from "express";
import session from "express-session";

import authRoutes from "./routes/auth.routes.js";
import requireAdmin from "./middlware/requireAdmin.js";

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
app.use(express.urlencoded({ extended: true })); // pour récupérer les forms

// sessions
app.use(
  session({
    secret: "tp-secret-simple",
    resave: false,
    saveUninitialized: false,
  })
);

// view = tpml
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "tmpl"));

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
      header: "<h1>Bienvenue 👋</h1>",
      main: "<p>Connexion réussie.</p>",
    },
  });
});

// 404
app.use((req, res) => {
  res.status(404).render("notFound");
});

// Lancement
app.listen(SERVER_PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur démarré sur http://0.0.0.0:${SERVER_PORT}`);
});

// ------------------------
// Création du serveur
// ------------------------
/*
const server = http.createServer((request, response) => {
  const pageUrl = url.parse(request.url, true);
  console.log(`URL demandée : ${request.method} ${request.url}`);

  response.setHeader("Content-Type", "text/html; charset=UTF-8");

  let isAdmin = null;
  if (pageUrl.query.isAdmin !== undefined) {
    response.setHeader("Set-Cookie", "isAdmin=" + pageUrl.query.isAdmin);
    isAdmin = pageUrl.query.isAdmin === "true";
  }

  const parsedCookie = parseCookies(request);
  isAdmin = isAdmin ?? parsedCookie.isAdmin;

  switch (pageUrl.pathname) {
    case "/":
    case "/home": {
      const templateData = {
        isAdmin,
        header: { title: "HOME" },
        body: {
          header: "<h1>Bienvenue !</h1>",
          main: "<p>Ceci est mon site fait avec EJS.</p>",
        },
      };

      ejs.renderFile(
        path.join(template_folder, "page.ejs"),
        templateData,
        {},
        (err, str) => {
          if (err) {
            console.error(err);
            response.statusCode = 500;
            return response.end("Erreur serveur");
          }
          response.end(str);
        }
      );
      break;
    }

    case "/aboutMe":
      ejs.renderFile(
        path.join(template_folder, "aboutMe.ejs"),
        {},
        (err, str) => response.end(str)
      );
      break;

    case "/bugUtf8":
      response.end(
        fs.readFileSync(path.join(template_folder, "bugUtf8.html"))
      );
      break;

    case "/test.php":
      response.end("Est-ce bien une page PHP 🤔 ?");
      break;

    default:
      response.statusCode = 404;
      response.end("Page non trouvée");
  }
});
*/

// ------------------------
// Lancement serveur (IMPORTANT)
// ------------------------

/*
server.listen(SERVER_PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Serveur démarré sur http://0.0.0.0:${SERVER_PORT}`
  );
});

console.log("thread principal terminé");
*/

// ------------------------
// Cookies
// ------------------------
function parseCookies(request) {
  const list = {};
  const rc = request.headers.cookie;

  if (!rc) return list;

  rc.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const value = ["true", "false"].includes(parts[1])
      ? parts[1] === "true"
      : parts[1];
    list[parts[0].trim()] = value;
  });

  return list;
}
