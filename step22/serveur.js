import http from "http";
import ejs from "ejs";
import url from "url";
import { URL } from "node:url";
import fs from "fs";
import path from "path";

const server = http.createServer();
const SERVER_PORT = 8080;

server.listen(SERVER_PORT, "localhost");
server.on("listening", function () {
  console.log(`Serveur démarré à http://localhost:${SERVER_PORT}/ !`);
});

server.on("request", (req, res) => {
  console.log("URL demandée : %s %s", req.method, req.url);

  const url = req.url;
  console.log(url);

  let FilePath =  path.join(__dirname, "pages");

  if (url === "/") {
    console.log("Home Page Requested");
    ejs.renderFile(
      FilePath,
      "Home Page",
      { title: "Home Page" },
      (err, html) => {
        if (err) {
          console.log(err);
          ejs.renderFile(
            FilePath = "./pages/erreur.html.ejs",
            "Error Page",
            { title: "Contact Page" },
          );
        } else {
          ejs.renderFile(
            FilePath = "./pages/contact.html.ejs",
            "Contatc Page",
            { title: "Contact Page" });
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
            res.end(html);
        }
      }
    );
  }
});
